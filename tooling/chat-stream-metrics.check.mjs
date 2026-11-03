import {test} from 'node:test';
import assert from 'node:assert/strict';
import {measureChatStream} from './chat-stream-metrics.mjs';
const stream = chunks => new ReadableStream({start(c){for(const text of chunks)c.enqueue(new TextEncoder().encode(text));c.close();}});
test('requires text and finish, measures first delta across network chunks',async()=>{
  const r=await measureChatStream(stream(['data: {"type":"text-de','lta","delta":"Hola"}\n\ndata: {"type":"finish"}\n\ndata: [DONE]\n']),()=>123);
  assert.equal(r.firstTextAt,123);assert.equal(r.textCharacters,4);assert.equal(r.valid,true);
});
test('HTTP success with error-only SSE is a failed chat',async()=>{
  const r=await measureChatStream(stream(['data: {"type":"error","errorText":"unavailable"}\n\ndata: [DONE]\n']));
  assert.equal(r.valid,false);assert.equal(r.streamError,true);
});
test('partial text without finish is not a completed answer',async()=>{
  assert.equal((await measureChatStream(stream(['data: {"type":"text-delta","delta":"parcial"}\n']))).valid,false);
});
