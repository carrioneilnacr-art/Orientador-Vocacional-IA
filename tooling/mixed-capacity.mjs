import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {measureChatStream} from './chat-stream-metrics.mjs';

export function configFromEnv(env=process.env){
 const config={base:(env.BASE_URL||'http://localhost:3000').replace(/\/$/,''),stages:(env.USERS||'40,80,120').split(',').map(Number),rounds:Number(env.ROUNDS||1),thinkMs:Number(env.THINK_MS||3000),chatFraction:Number(env.CHAT_FRACTION||0.1),chatMax:Number(env.CHAT_MAX_REQUESTS||12),writes:env.WRITE_RESULTS==='true',timeoutMs:Number(env.TIMEOUT_MS||30000)};
 if(config.stages.some(n=>!Number.isInteger(n)||n<1||n>120)||!Number.isInteger(config.rounds)||config.rounds<1||config.rounds>10||!Number.isFinite(config.thinkMs)||config.thinkMs<0||config.thinkMs>60000||!Number.isFinite(config.chatFraction)||config.chatFraction<0||config.chatFraction>1||!Number.isInteger(config.chatMax)||config.chatMax<0||config.chatMax>120||!Number.isInteger(config.timeoutMs)||config.timeoutMs<1000||config.timeoutMs>120000)throw new Error('Invalid workload limits');
 new URL(config.base);
 config.topics=env.CHAT_TOPICS?JSON.parse(env.CHAT_TOPICS):[];
 if(!Array.isArray(config.topics)||config.topics.length>16||config.topics.some(topic=>typeof topic!=='string'||topic.length>200))throw new Error('Invalid chat topics');
 return config;
}
export function validExploration(body){return body?.result?.kind==='adventure-exploration'&&body.result.scope==='plaza-colegio'&&body.result.version===1&&typeof body.result.createdAt==='string'&&Array.isArray(body.result.notes)&&body.result.notes.length===8&&body.result.notes.every(note=>typeof note.id==='string'&&typeof note.text==='string');}
const quantile=(values,p)=>values.length?[...values].sort((a,b)=>a-b)[Math.ceil(values.length*p)-1]:null;
function summarize(samples){return {requests:samples.length,statuses:samples.reduce((out,s)=>{out[s.status]=(out[s.status]||0)+1;return out;},{}),unexpected:samples.filter(s=>!s.ok&&!s.cancelled).length,cancelled:samples.filter(s=>s.cancelled).length,p50ms:quantile(samples.map(s=>s.ms),.5),p95ms:quantile(samples.map(s=>s.ms),.95),p95firstTextMs:quantile(samples.flatMap(s=>s.firstTextMs==null?[]:[s.firstTextMs]),.95),p95quotaMs:quantile(samples.flatMap(s=>s.quotaMs==null?[]:[s.quotaMs]),.95),p95contextMs:quantile(samples.flatMap(s=>s.contextMs==null?[]:[s.contextMs]),.95)};}
export async function runMixed(config,{fetchImpl=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms)),onStage=()=>{}}={}){
 const runId=randomUUID(),report={runId,startedAt:new Date().toISOString(),config,stages:[],scope:'HTTP closed workloads; no rendering/FPS. Per-user cookies; no spoofed IPs. Synthetic anonymous results when writes=true. Chat budget shared across stages.'};
 let chatCalls=0;
 for(const users of config.stages){
  const abort=new AbortController(),samples=[],started=performance.now();let stopReason=null,completed=0,persistedSessions=0;
  const fail=reason=>{if(!stopReason){stopReason=reason;abort.abort();}};
  const payload={version:1,rpgEntries:['mateo','ernesto','valeria','luis','estudiantes'].map(npcId=>({npcId,choice:0})),schoolEntries:['laboratorio','taller','tecnologia'].map(activityId=>({version:1,chapterId:'colegio',activityId,preference:'unsure',performance:{attempts:0,solved:null},choices:[],completedAt:new Date().toISOString()})),schoolAnswers:{}};
  await Promise.all(Array.from({length:users},async(_,user)=>{
   const jar=new Map();let expectedResult=null,hasSaved=false;
   async function request(operation,path,{method='GET',body,validate=()=>true,expected=200,chat=false}={}){
    if(abort.signal.aborted)return null;
    const start=performance.now();let status=0;
    try{
     const response=await fetchImpl(config.base+path,{method,headers:{Origin:config.base,'Content-Type':'application/json',Cookie:[...jar].map(([k,v])=>`${k}=${v}`).join(';'),'X-Capacity-Run':runId},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.any([abort.signal,AbortSignal.timeout(config.timeoutMs)])});
     status=response.status;const ttfb=performance.now()-start;
     const timing=response.headers.get('server-timing')||'';
     const quotaMs=timing.match(/quota;dur=([\d.]+)/)?.[1],contextMs=timing.match(/context;dur=([\d.]+)/)?.[1];
     for(const cookie of response.headers.getSetCookie?.()||[]){const first=cookie.split(';')[0],at=first.indexOf('=');if(at>0)jar.set(first.slice(0,at),first.slice(at+1));}
     const metrics=chat&&status===200?await measureChatStream(response.body):null;
     const text=metrics?'':await response.text();let data=null;if(text){try{data=JSON.parse(text);}catch{}}
     const ok=status===expected&&(chat?metrics?.valid===true:validate(data));
     samples.push({operation,status,ms:performance.now()-start,ttfb,ok,...(quotaMs?{quotaMs:Number(quotaMs)}:{}),...(contextMs?{contextMs:Number(contextMs)}:{}),...(chat?{firstTextMs:metrics?.firstTextAt==null?null:metrics.firstTextAt-start,finished:metrics?.finished===true,streamError:metrics?.streamError===true}:{})});
     if(!ok){fail(`${operation}: ${status===429?'rate-limited':status===expected?'semantic/stream validation failed':`HTTP ${status}`}`);return null;}
     return data;
    }catch{
     const cancelled=abort.signal.aborted;
     samples.push({operation,status,ms:performance.now()-start,ok:false,cancelled});
     if(!cancelled)fail(`${operation}: transport/timeout failure`);
     return null;
    }
   }
   await request('page','/aventura');
   if(abort.signal.aborted)return;
   await request('session','/api/aventura/sesion',{method:'POST',body:{},validate:data=>data?.ready===true&&jar.size>0});
   if(abort.signal.aborted)return;
   await request('catalog','/api/vocacional',{validate:data=>Array.isArray(data?.questions)&&data.questions.length===16&&Array.isArray(data.options)&&data.options.length===64});
   for(let round=0;round<config.rounds&&!abort.signal.aborted;round++){
    if(config.writes){
     const saved=await request('save','/api/aventura/resultado',{method:'POST',body:payload,validate:validExploration});
     if(abort.signal.aborted)return;
     if(!hasSaved){persistedSessions++;hasSaved=true;expectedResult=saved.result;}
     else if(JSON.stringify(saved.result)!==JSON.stringify(expectedResult)){fail('save replay changed persisted result');return;}
     const loaded=await request('recover','/api/aventura/resultado',{validate:validExploration});
     if(abort.signal.aborted)return;
     if(JSON.stringify(loaded.result)!==JSON.stringify(expectedResult)){fail('recover did not match saved result');return;}
    }else await request('recover-empty','/api/aventura/resultado',{expected:404,validate:data=>typeof data?.error==='string'});
    if(!abort.signal.aborted&&user<Math.ceil(users*config.chatFraction)&&chatCalls<config.chatMax){
     chatCalls++;
     const topic=config.topics?.length?config.topics[user%config.topics.length]:null;
     await request('chat','/api/chat',{method:'POST',body:{messages:[{role:'user',content:topic?`Quiero conocer la carrera ${topic}. Menciona un curso registrado y su fuente, brevemente.`:'¿Cómo puedo explorar mis intereses? Responde brevemente.'}]},chat:true});
    }
    if(round+1<config.rounds&&!abort.signal.aborted)await sleep(config.thinkMs);
   }
   if(!abort.signal.aborted)completed++;
  }));
  const stage={users,elapsedSeconds:(performance.now()-started)/1000,completedUsers:completed,persistedSessionsConfirmed:persistedSessions,stopReason,...summarize(samples),operations:Object.fromEntries([...new Set(samples.map(s=>s.operation))].map(op=>[op,summarize(samples.filter(s=>s.operation===op))]))};
  report.stages.push(stage);onStage(stage);
  if(stopReason)break;
 }
 report.chatCalls=chatCalls;report.finishedAt=new Date().toISOString();return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const report=await runMixed(configFromEnv(),{onStage:stage=>console.log(JSON.stringify(stage))});
 const output=process.env.OUTPUT||'capacity-mixed.json';await writeFile(output,JSON.stringify(report,null,2));console.log(`Report: ${output}`);
 if(report.stages.some(s=>s.stopReason))process.exitCode=1;
}
