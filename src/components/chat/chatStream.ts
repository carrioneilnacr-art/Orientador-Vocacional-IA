export class ChatResponseError extends Error {}

/** Parse split SSE frames and surface failures without discarding partial text. */
export async function readChatStream(response:Response,onText:(text:string)=>void):Promise<string>{
 if(!response.ok){
  let message='No pudimos consultar a Chaski. Inténtalo nuevamente.';
  try{const body:unknown=await response.json();if(body&&typeof body==='object'&&'error' in body&&typeof body.error==='string')message=body.error;}catch{}
  throw new ChatResponseError(message);
 }
 if(!response.body)throw new ChatResponseError('No recibimos una respuesta de Chaski. Inténtalo nuevamente.');
 const reader=response.body.getReader(),decoder=new TextDecoder();
 let buffer='',fullText='',finished=false;
 const parse=(line:string)=>{
  if(!line.startsWith('data:'))return;
  const data=line.slice(5).trim();if(data==='[DONE]')return;
  let event:unknown;try{event=JSON.parse(data);}catch{return;}
  if(!event||typeof event!=='object'||!('type' in event))return;
  if(event.type==='error')throw new ChatResponseError('errorText' in event&&typeof event.errorText==='string'?event.errorText:'No pudimos completar la respuesta de Chaski. Inténtalo nuevamente.');
  if(event.type==='abort')throw new ChatResponseError('La respuesta se interrumpió. Inténtalo nuevamente.');
  if(event.type==='finish')finished=true;
  if(event.type==='text-delta'&&'delta' in event&&typeof event.delta==='string'){fullText+=event.delta;onText(fullText);}
 };
 try{
  while(true){
   const {done,value}=await reader.read();
   buffer+=done?decoder.decode():decoder.decode(value,{stream:true});
   const lines=buffer.split('\n');buffer=lines.pop()??'';for(const line of lines)parse(line);
   if(done){if(buffer)parse(buffer);break;}
  }
  if(!finished)throw new ChatResponseError('La respuesta se interrumpió. Inténtalo nuevamente.');
  if(!fullText.trim())throw new ChatResponseError('No recibimos texto de Chaski. Inténtalo nuevamente.');
  return fullText;
 }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
