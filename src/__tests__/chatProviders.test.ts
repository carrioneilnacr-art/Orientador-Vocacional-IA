import {afterEach,describe,expect,it,vi} from 'vitest';
import {configuredChatProviders,safeProviderError} from '@/modules/chaski-ai/infrastructure/chatProviders';
import {streamChatResponse} from '@/modules/chaski-ai/infrastructure/streamChatResponse';

afterEach(()=>vi.restoreAllMocks());
describe('chat provider reliability',()=>{
 it('uses GPT exclusively when its key is configured',()=>{
  expect(configuredChatProviders({OPENAI_API_KEY:'test'}).map(p=>p.name)).toEqual(['openai']);
  expect(configuredChatProviders({})).toEqual([]);
 });
 it('supports GPT model overrides',()=>{
  expect(configuredChatProviders({OPENAI_API_KEY:'test',OPENAI_MODEL:'custom-model'})[0].modelId).toBe('custom-model');
 });
 it('does not include raw credential-bearing messages or response bodies in logs',()=>{
  expect(safeProviderError({name:'APIError',statusCode:401,message:'sk-secret',url:'https://example/key',data:{error:{code:'expired_secret_key',message:'sk-secret'}}})).toEqual({name:'APIError',status:401,code:'expired_secret_key'});
 });
 const input=()=>({providers:configuredChatProviders({OPENAI_API_KEY:'test'}),messages:[{role:'user' as const,content:'Hola'}],system:'Verified only',requestId:'test-id',signal:new AbortController().signal});
 it('streams GPT text with a completed finish event',async()=>{
  vi.spyOn(console,'info').mockImplementation(()=>{});
  const text=await streamChatResponse(input(),async function*(){yield {type:'text-delta',text:'Hola'};yield {type:'finish'};}).text();
  expect(text).toContain('"delta":"Hola"');expect(text).toContain('"type":"finish"');expect(text).not.toContain('"type":"error"');
 });
 it('emits a safe error when GPT emits an asynchronous failure before text',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});vi.spyOn(console,'info').mockImplementation(()=>{});
  const calls:string[]=[];
  const response=streamChatResponse(input(),async function*(provider){calls.push(provider.name);yield {type:'error',error:new Error('secret')};});
  const text=await response.text();
  expect(calls).toEqual(['openai']);expect(text).toContain('"type":"error"');expect(text).not.toContain('secret');expect(response.headers.get('x-request-id')).toBe('test-id');
 });
 it('preserves partial text and emits safe error without appending fallback answer',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});vi.spyOn(console,'info').mockImplementation(()=>{});
  const calls:string[]=[];
  const text=await streamChatResponse(input(),async function*(provider){calls.push(provider.name);yield {type:'text-delta',text:'Parte'};yield {type:'error',error:new Error('sk-secret')};}).text();
  expect(calls).toEqual(['openai']);expect(text).toContain('"delta":"Parte"');expect(text).toContain('"type":"error"');expect(text).toContain('test-id');expect(text).not.toContain('sk-secret');
 });
 it('treats empty and abruptly ended GPT streams as failures',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  const calls:string[]=[];
  const text=await streamChatResponse(input(),async function*(provider){calls.push(provider.name);yield {type:'finish'};}).text();
  expect(calls).toEqual(['openai']);expect(text).toContain('"type":"error"');expect(text).not.toContain('"type":"finish"');
 });
 it('does not call providers after request cancellation',async()=>{
  const controller=new AbortController();controller.abort();const args={...input(),signal:controller.signal};
  const start=vi.fn(async function*(){yield {type:'text-delta',text:'unexpected'};});
  const text=await streamChatResponse(args,start).text();expect(start).not.toHaveBeenCalled();expect(text).toContain('"type":"error"');
 });
 it('shows a safe busy response on GPT overload without retrying or leaking diagnostics',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  const start=vi.fn(async function*(){yield {type:'error',error:{name:'APIError',statusCode:429,message:'private quota/key details'}};});
  const text=await streamChatResponse(input(),start).text();
  expect(start).toHaveBeenCalledTimes(1);expect(text).toContain('ocupado');expect(text).not.toContain('private quota');
 });
});
