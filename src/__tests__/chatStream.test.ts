import {describe,it,expect} from 'vitest';
import {readChatStream} from '@/components/chat/chatStream';

const response=(chunks:string[])=>new Response(new ReadableStream({start(controller){for(const chunk of chunks)controller.enqueue(new TextEncoder().encode(chunk));controller.close();}}));
describe('chat SSE handling',()=>{
 it('decodes split frames and final unterminated line',async()=>{
  const texts:string[]=[];
  expect(await readChatStream(response(['data: {"type":"text-del','ta","delta":"Hola"}\n\ndata: {"type":"finish"}\n\ndata: [DONE]']),text=>texts.push(text))).toBe('Hola');
  expect(texts).toEqual(['Hola']);
 });
 it('surfaces provider error after partial text',async()=>{
  const texts:string[]=[];
  await expect(readChatStream(response(['data: {"type":"text-delta","delta":"Parcial"}\n\ndata: {"type":"error","errorText":"Reintenta. Referencia: test"}\n']),text=>texts.push(text))).rejects.toThrow('Referencia: test');
  expect(texts).toEqual(['Parcial']);
 });
 it('does not report a truncated stream as completed',async()=>{
  await expect(readChatStream(response(['data: {"type":"text-delta","delta":"Parcial"}\n']),()=>{})).rejects.toThrow('interrumpió');
 });
 it('uses safe HTTP error returned by server',async()=>{
  await expect(readChatStream(Response.json({error:'Chaski no está disponible. Referencia: test'},{status:503}),()=>{})).rejects.toThrow('Referencia: test');
 });
 it('rejects a completed stream without text',async()=>{
  await expect(readChatStream(response(['data: {"type":"finish"}\n\ndata: [DONE]\n']),()=>{})).rejects.toThrow('No recibimos texto');
 });
 it('requires explicit finish even when DONE arrives',async()=>{
  await expect(readChatStream(response(['data: {"type":"text-delta","delta":"Parcial"}\n\ndata: [DONE]\n']),()=>{})).rejects.toThrow('interrumpió');
 });
 it('surfaces an aborted stream after partial text',async()=>{
  const texts:string[]=[];
  await expect(readChatStream(response(['data: {"type":"text-delta","delta":"Parcial"}\n\ndata: {"type":"abort"}\n']),text=>texts.push(text))).rejects.toThrow('interrumpió');
  expect(texts).toEqual(['Parcial']);
 });
});
