import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configFromEnv,runMixed} from './mixed-capacity.mjs';

test('validates user and paid-call bounds',()=>{
 assert.throws(()=>configFromEnv({USERS:'121'}));assert.throws(()=>configFromEnv({CHAT_MAX_REQUESTS:'121'}));
 assert.deepEqual(configFromEnv({}).stages,[40,80,120]);
});
test('isolates cookies, validates persisted replay and enforces total chat budget',async()=>{
 let sessions=0,chat=0;const seen=new Set();
 const fetchImpl=async(url,options)=>{
  const path=new URL(url).pathname;
  if(path==='/aventura')return new Response('html');
  if(path==='/api/aventura/sesion')return Response.json({ready:true},{headers:{'set-cookie':`session=user-${++sessions}; HttpOnly; Path=/`}});
  if(path==='/api/vocacional')return Response.json({questions:Array(16).fill({}),options:Array(64).fill({})});
  if(path==='/api/chat'){chat++;return new Response('data: {"type":"text-delta","delta":"Hola"}\n\ndata: {"type":"finish"}\n\ndata: [DONE]\n');}
  seen.add(options.headers.Cookie);assert.match(options.headers.Cookie,/session=user-\d+/);
  return Response.json({result:{kind:'adventure-exploration',scope:'plaza-colegio',version:1,createdAt:'2026-11-03T00:00:00Z',notes:Array(8).fill({id:'example',text:'Example'})}});
 };
 const result=await runMixed(configFromEnv({USERS:'2,3',ROUNDS:'2',WRITE_RESULTS:'true',CHAT_FRACTION:'1',CHAT_MAX_REQUESTS:'2',THINK_MS:'0'}),{fetchImpl,sleep:async()=>{}});
 assert.equal(result.stages.length,2);assert.equal(result.stages[1].completedUsers,3);assert.equal(chat,2);assert.equal(seen.size,5);assert.equal(result.stages[0].operations.recover.unexpected,0);
});
test('stops on semantic failure before producing more work',async()=>{
 let calls=0;
 const result=await runMixed(configFromEnv({USERS:'1,40'}),{fetchImpl:async()=>{calls++;return new Response('bad',{status:503});}});
 assert.equal(calls,1);assert.equal(result.stages.length,1);assert.match(result.stages[0].stopReason,/HTTP 503/);
});
test('does not count broken HTTP200 chat as success',async()=>{
 const fetchImpl=async(url)=>{
  const path=new URL(url).pathname;
  if(path==='/aventura')return new Response('html');
  if(path.endsWith('/sesion'))return Response.json({ready:true},{headers:{'set-cookie':'session=one'}});
  if(path==='/api/vocacional')return Response.json({questions:Array(16).fill({}),options:Array(64).fill({})});
  if(path.endsWith('/resultado'))return Response.json({error:'No result'},{status:404});
  return new Response('data: {"type":"error"}\n\ndata: [DONE]\n');
 };
 const result=await runMixed(configFromEnv({USERS:'1',CHAT_FRACTION:'1'}),{fetchImpl});
 assert.match(result.stages[0].stopReason,/chat.*semantic/);assert.equal(result.stages[0].operations.chat.unexpected,1);
});
