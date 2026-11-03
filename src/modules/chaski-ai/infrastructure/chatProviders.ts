import {createOpenAI} from '@ai-sdk/openai';
import type {LanguageModel} from 'ai';

export type ChatProvider = {name:'openai'; modelId:string; model:LanguageModel};
export function configuredChatProviders(env:Record<string,string|undefined>=process.env):ChatProvider[]{
 const openaiKey=env.OPENAI_API_KEY?.trim();
 const providers:ChatProvider[]=[];
 if(openaiKey){const modelId=env.OPENAI_MODEL?.trim()||'gpt-4o-mini';providers.push({name:'openai',modelId,model:createOpenAI({apiKey:openaiKey})(modelId)});}
 return providers;
}

// Raw errors can include credentials, URLs and user content. Log metadata only.
export function safeProviderError(error:unknown):{name:string;status?:number;code?:string}{
 if(!error||typeof error!=='object')return {name:'UnknownError'};
 const e=error as Record<string,unknown>;
 const data=e.data&&typeof e.data==='object'?e.data as Record<string,unknown>:undefined;
 const detail=data?.error&&typeof data.error==='object'?data.error as Record<string,unknown>:undefined;
 const code=detail?.code??e.code;
 return {name:typeof e.name==='string'?e.name.slice(0,80):'ProviderError',status:typeof e.statusCode==='number'?e.statusCode:undefined,code:typeof code==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(code)?code:undefined};
}
