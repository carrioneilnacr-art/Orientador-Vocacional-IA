import {writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {measureChatStream} from './chat-stream-metrics.mjs';

// Closed workload: one active request per virtual user, followed by think time.
const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const mode = process.env.MODE || 'pages';
if (!['pages', 'catalog', 'adventure', 'chat'].includes(mode)) throw new Error('Unknown MODE');
const stages = (process.env.USERS || '1,10,30,60,100').split(',').map(Number);
const seconds = Number(process.env.STAGE_SECONDS || 15);
const think = Number(process.env.THINK_MS || 3000);
const writes = process.env.WRITE_RESULTS === 'true';
const payload = {version:1,rpgEntries:['mateo','ernesto','valeria','luis','estudiantes'].map(npcId=>({npcId,choice:0})),schoolEntries:['laboratorio','taller','tecnologia'].map(activityId=>({version:1,chapterId:'colegio',activityId,preference:'unsure',performance:{attempts:0,solved:null},choices:[],completedAt:new Date().toISOString()})),schoolAnswers:{}};
if (stages.some(n => !Number.isInteger(n) || n < 1 || n > 100) || seconds < 1 || seconds > 120 || think < 1000) throw new Error('Invalid load limits');
const report = {base, mode, writes, startedAt: new Date().toISOString(), stages: [], scope: 'HTTP only; no browser rendering or FPS. Closed workload, not maximum capacity. Writes only when WRITE_RESULTS=true, with synthetic anonymous exploration evidence.'};
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const percentile = (values, p) => values.length ? [...values].sort((a,b) => a-b)[Math.ceil(values.length*p)-1] : null;
let stop = false;
for (const users of stages) {
  const samples = [], deadline = performance.now() + seconds * 1000;
  const start = performance.now();
  async function request(path, options = {}, expected = 200) {
    const t = performance.now();
    try {
      const response = await fetch(base + path, {...options, signal: AbortSignal.timeout(15000)});
      const ttfb = performance.now() - t;
      const chat = mode === 'chat' && response.body ? await measureChatStream(response.body) : null;
      const body = chat ? '' : await response.text();
      const s = {status: response.status, ms: performance.now()-t, ttfb, ok: response.status === expected};
      if (mode === 'chat') {
        s.streamError = !chat?.valid;
        s.firstTextMs = chat?.firstTextAt == null ? null : chat.firstTextAt-t;
      }
      if (writes && path === '/api/aventura/resultado' && response.status === 200) {
        try { const result=JSON.parse(body).result; s.ok = result?.kind === 'adventure-exploration' && result?.scope === 'plaza-colegio' && Array.isArray(result?.notes) && result.notes.length >= 8; }
        catch {s.ok=false;}
      }
      if (s.streamError) s.ok = false;
      samples.push(s);
      return response;
    } catch { samples.push({status: 0, ms: performance.now()-t, ok: false}); }
    finally {
      if (samples.length >= 20 && samples.filter(s => s.status === 0 || s.status >= 500 || s.streamError).length / samples.length > 0.05) stop = true;
      if (samples.length >= 20 && samples.filter(s => s.status === 429).length / samples.length > 0.1) stop = true;
    }
  }
  await Promise.all(Array.from({length: users}, async (_, user) => {
    let iteration = 0;
    let sessionCookie;
    while (!stop && performance.now() < deadline) {
      if (mode === 'pages') await request(iteration++ % 2 ? '/aventura' : '/');
      if (mode === 'catalog') await request('/api/vocacional');
      if (mode === 'adventure') {
        if (!sessionCookie) {
          const r = await request('/api/aventura/sesion', {method:'POST', headers:{Origin:base,'Content-Type':'application/json'},body:'{}'});
          sessionCookie = r?.status === 200 ? r.headers.get('set-cookie')?.split(';')[0] : undefined;
        }
        if (sessionCookie && !stop) {
          if(writes) await request('/api/aventura/resultado', {method:'POST',headers:{Cookie:sessionCookie,Origin:base,'Content-Type':'application/json'},body:JSON.stringify(payload)});
          if (!stop) await request('/api/aventura/resultado', {headers:{Cookie:sessionCookie}}, writes ? 200 : 404);
        }
      }
      if (mode === 'chat') await request('/api/chat', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'Hola, ¿cómo puedo explorar mis intereses?'}]})});
      await pause(think);
    }
  }));
  const statuses = {};
  for (const s of samples) statuses[s.status] = (statuses[s.status] || 0) + 1;
  const result = {users, requests:samples.length, elapsedSeconds:(performance.now()-start)/1000, statuses, unexpected:samples.filter(s=>!s.ok).length, streamErrors:samples.filter(s=>s.streamError).length, p50ms:percentile(samples.map(s=>s.ms),.5), p95ms:percentile(samples.map(s=>s.ms),.95), maxMs:Math.max(0,...samples.map(s=>s.ms)), p95ttfbMs:percentile(samples.filter(s=>s.ttfb!==undefined).map(s=>s.ttfb),.95), stopped:stop};
  report.stages.push(result);
  result.p95firstTextMs = percentile(samples.filter(s=>s.firstTextMs != null).map(s=>s.firstTextMs),.95);
  console.log(JSON.stringify(result));
  if (stop) break;
}
report.finishedAt = new Date().toISOString();
const output = process.env.OUTPUT || `capacity-${mode}.json`;
await writeFile(output, JSON.stringify(report,null,2));
console.log(`Report: ${output}`);
