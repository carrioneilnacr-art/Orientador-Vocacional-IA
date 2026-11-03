import {createUIMessageStream,createUIMessageStreamResponse,streamText,type ModelMessage} from 'ai';
import {safeProviderError,type ChatProvider} from './chatProviders';

type Part={type:string;text?:string;error?:unknown};
type StartStream=(provider:ChatProvider,signal:AbortSignal)=>AsyncIterable<Part>;
export function streamChatResponse(input:{providers:ChatProvider[];messages:ModelMessage[];system:string;requestId:string;signal:AbortSignal},startStream?:StartStream){
 const started=Date.now();
 const signal=AbortSignal.any([input.signal,AbortSignal.timeout(25000)]);
 const safeMessage=`No pudimos completar la respuesta de Chaski. Inténtalo nuevamente. Referencia: ${input.requestId}.`;
 const start:StartStream=startStream??((provider,abortSignal)=>streamText({model:provider.model,messages:input.messages,system:input.system,temperature:0.2,maxOutputTokens:1200,maxRetries:0,abortSignal,timeout:{firstChunkMs:10000,chunkMs:10000},onError:()=>{}}).stream);
 const stream=createUIMessageStream({
  onError:()=>safeMessage,
  async execute({writer}){
   writer.write({type:'start',messageId:input.requestId});
   let emitted=false;
   let failureStatus:number|undefined;
   for(const provider of input.providers){
    if(signal.aborted){writer.write({type:'error',errorText:safeMessage});writer.setOutcome({status:input.signal.aborted?'aborted':'failed'});return;}
    try{
     let completed=false;
     for await(const part of start(provider,signal)){
      if(part.type==='error')throw part.error??new Error('PROVIDER_STREAM_ERROR');
      if(part.type==='abort')throw new Error('PROVIDER_STREAM_ABORTED');
      if(part.type==='text-delta'&&part.text){
       if(!emitted){writer.write({type:'text-start',id:input.requestId});console.info('[Chat first text]',{requestId:input.requestId,provider:provider.name,model:provider.modelId,ms:Date.now()-started});}
       emitted=true;writer.write({type:'text-delta',id:input.requestId,delta:part.text});
      }
      if(part.type==='finish')completed=true;
     }
     if(!completed||!emitted)throw new Error('INCOMPLETE_PROVIDER_STREAM');
     writer.write({type:'text-end',id:input.requestId});
     writer.write({type:'finish'});writer.setOutcome({status:'completed'});
     console.info('[Chat completed]',{requestId:input.requestId,provider:provider.name,model:provider.modelId,ms:Date.now()-started});
     return;
    }catch(error){
     const metadata=safeProviderError(error);
     failureStatus=metadata.status;
     console.warn('[Chat provider failed]',{requestId:input.requestId,provider:provider.name,model:provider.modelId,...metadata,ms:Date.now()-started});
     // Never append a different model's answer after visible output started.
     if(emitted)break;
    }
   }
   if(emitted)writer.write({type:'text-end',id:input.requestId});
   const errorText=failureStatus===429||failureStatus===503
    ?`Chaski está ocupado en este momento. Espera unos segundos e inténtalo nuevamente. Referencia: ${input.requestId}.`
    :safeMessage;
   writer.write({type:'error',errorText});writer.setOutcome({status:input.signal.aborted?'aborted':'failed'});
  },
 });
 return createUIMessageStreamResponse({stream,headers:{'x-request-id':input.requestId,'Cache-Control':'private, no-store'}});
}
