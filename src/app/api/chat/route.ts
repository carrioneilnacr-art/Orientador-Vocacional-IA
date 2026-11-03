import {randomUUID} from 'node:crypto';
import {checkRequestRateLimit,quotaHeaders,type RequestRateResult} from '@/lib/requestRateLimit';
import {fetchCareerContext} from '@/modules/chaski-ai/infrastructure/careerContext';
import {configuredChatProviders,safeProviderError} from '@/modules/chaski-ai/infrastructure/chatProviders';
import {streamChatResponse} from '@/modules/chaski-ai/infrastructure/streamChatResponse';
import {buildChaskiPrompt} from '@/modules/chaski-ai/application/buildPrompt';
import {chatRequestSchema} from '@/modules/chaski-ai/domain/chatRequest';

export const maxDuration=30;
export async function POST(req:Request){
 const requestId=randomUUID();
 let quota:RequestRateResult|undefined;
 const timings:Record<string,number>={};
 const timingHeaders=():Record<string,string>=>Object.keys(timings).length?{'Server-Timing':Object.entries(timings).map(([name,ms])=>`${name};dur=${ms.toFixed(1)}`).join(', ')}:{};
 const requestSignal=AbortSignal.any([req.signal,AbortSignal.timeout(25000)]);
 const json=(error:string,status:number,extraHeaders?:Record<string,string>)=>Response.json({error,requestId},{status,headers:{'x-request-id':requestId,'Cache-Control':'private, no-store',...(quota?quotaHeaders(quota):{}),...timingHeaders(),...extraHeaders}});
 try{
  const quotaStart=performance.now();
  quota=await checkRequestRateLimit(req,'chat');
  timings.quota=performance.now()-quotaStart;
  if(!quota.allowed)return json(quota.status===503?'Chaski está ocupado. Inténtalo nuevamente en unos momentos.':'Has realizado muchas consultas. Inténtalo en unos momentos.',quota.status);
  if(Number(req.headers.get('content-length')||0)>200000)return json('Solicitud demasiado grande.',413);
  const text=await req.text();
  if(new TextEncoder().encode(text).byteLength>200000)return json('Solicitud demasiado grande.',413);
  let body:unknown;try{body=JSON.parse(text);}catch{return json('JSON inválido.',400);}
  const parsed=chatRequestSchema.safeParse(body);
  if(!parsed.success)return json('Mensajes inválidos o demasiado extensos.',400);
  const providers=configuredChatProviders();
  if(!providers.length)return json('Chaski no está disponible temporalmente. Referencia: '+requestId+'.',503);
  const {messages}=parsed.data;
  // Bound the context wait; on timeout return unavailable instead of asking the
  // model to answer a catalog question with an unverified/partial context.
  let contextTimer:ReturnType<typeof setTimeout>|undefined;
  let onAbort:(()=>void)|undefined;
  let careerContext:string;
  const contextStart=performance.now();
  try{
   careerContext=await Promise.race([
    fetchCareerContext(messages[messages.length-1].content),
    new Promise<never>((_,reject)=>{
     contextTimer=setTimeout(()=>reject(Object.assign(new Error('Context unavailable'),{code:'CONTEXT_TIMEOUT'})),10000);
     onAbort=()=>reject(Object.assign(new Error('Request aborted'),{code:'REQUEST_ABORTED'}));
     requestSignal.addEventListener('abort',onAbort,{once:true});
     if(requestSignal.aborted)onAbort();
    }),
   ]);
  }finally{
   timings.context=performance.now()-contextStart;
   if(contextTimer)clearTimeout(contextTimer);
   if(onAbort)requestSignal.removeEventListener('abort',onAbort);
  }
  const response=streamChatResponse({providers,messages,system:buildChaskiPrompt(careerContext),requestId,signal:requestSignal});
  for(const [key,value] of Object.entries(quotaHeaders(quota)))response.headers.set(key,value);
  for(const [key,value] of Object.entries(timingHeaders()))response.headers.set(key,value);
  return response;
 }catch(error){
  console.error('[Chat request failed]',{requestId,...safeProviderError(error)});
  return json('No se pudo completar la conversación. Referencia: '+requestId+'.',503);
 }
}
