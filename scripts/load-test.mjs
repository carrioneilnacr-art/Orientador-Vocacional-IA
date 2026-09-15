/**
 * load-test.mjs — Prueba de carga del Orientador Vocacional IA
 * Uso: node scripts/load-test.mjs [URL] [N_USUARIOS]
 * Ej:  node scripts/load-test.mjs http://localhost:3000 5
 * Ej:  node scripts/load-test.mjs https://mi-app.vercel.app 20
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const N_USERS  = parseInt(process.argv[3] || '5', 10);
const TIMEOUT  = 15000;

const C = { green:'\x1b[32m', red:'\x1b[31m', yellow:'\x1b[33m', cyan:'\x1b[36m', bold:'\x1b[1m', reset:'\x1b[0m' };
const log = (c, m) => console.log(`${c}${m}${C.reset}`);

const ANSWERS = { 1:101,2:202,3:302,4:403,5:501,6:603,7:701,8:803,9:903,10:1001,11:1101,12:1204,13:1301,14:1401,15:1503,16:1604 };
const CHAT_MSG = [{ role:'user', content:'¿Cuánto cuesta estudiar Ingeniería de Software?' }];

async function timedFetch(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  const t0 = Date.now();
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    // Para respuestas streaming, leer solo los primeros chunks
    if (res.body && res.headers.get('content-type')?.includes('stream')) {
      const reader = res.body.getReader();
      for (let i = 0; i < 8; i++) {
        const { done } = await reader.read();
        if (done) break;
      }
      reader.cancel().catch(() => {});
    }
    return { ok: res.ok, status: res.status, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, status: e.name === 'AbortError' ? 'TIMEOUT' : 'ERROR', ms: Date.now() - t0 };
  } finally {
    clearTimeout(t);
  }
}

async function simulateUser(id) {
  const r1 = await timedFetch(`${BASE_URL}/api/vocacional`);
  const r2 = await timedFetch(`${BASE_URL}/api/vocacional`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: ANSWERS }),
  });
  const r3 = await timedFetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: CHAT_MSG }),
  });
  return [
    { test: 'GET  /api/vocacional (preguntas)', ...r1 },
    { test: 'POST /api/vocacional (resultados)', ...r2 },
    { test: 'POST /api/chat      (bot Chaski)', ...r3 },
  ];
}

async function main() {
  log(C.bold + C.cyan, `\n🚀 PRUEBA DE CARGA — ${N_USERS} usuarios simultáneos`);
  log(C.cyan, `   URL: ${BASE_URL}  |  Timeout: ${TIMEOUT/1000}s por request\n`);

  const t0 = Date.now();
  const all = await Promise.all(Array.from({ length: N_USERS }, (_, i) => simulateUser(i + 1)));
  const elapsed = Date.now() - t0;

  // Agrupar stats por endpoint
  const stats = {};
  for (const userResults of all) {
    for (const r of userResults) {
      if (!stats[r.test]) stats[r.test] = { ok: 0, fail: 0, times: [] };
      if (r.ok) { stats[r.test].ok++; stats[r.test].times.push(r.ms); }
      else stats[r.test].fail++;
    }
  }

  log(C.bold, '📊 RESULTADOS:');
  log(C.bold, '─'.repeat(62));

  let totalOk = 0, totalFail = 0;
  for (const [ep, s] of Object.entries(stats)) {
    const avg = s.times.length ? Math.round(s.times.reduce((a,b)=>a+b,0)/s.times.length) : 0;
    const min = s.times.length ? Math.min(...s.times) : 0;
    const max = s.times.length ? Math.max(...s.times) : 0;
    const emoji = avg < 600 ? '🟢' : avg < 2500 ? '🟡' : '🔴';
    const sc = s.fail === 0 ? C.green : s.fail < s.ok ? C.yellow : C.red;
    log(C.bold, `\n  ${ep}`);
    log(sc, `    ✅ ${s.ok}/${s.ok+s.fail} OK   ❌ ${s.fail} fallaron`);
    if (s.times.length) log(C.reset, `    ${emoji} Avg: ${avg}ms  Min: ${min}ms  Max: ${max}ms`);
    totalOk += s.ok; totalFail += s.fail;
  }

  const total = totalOk + totalFail;
  const rate = Math.round((totalOk / total) * 100);
  const rc = rate >= 95 ? C.green : rate >= 70 ? C.yellow : C.red;

  log(C.bold, '\n' + '─'.repeat(62));
  log(C.bold, '🏁 RESUMEN:');
  log(rc,     `   Éxito: ${rate}%  (${totalOk}/${total} requests)`);
  log(C.reset,`   Tiempo total del test: ${elapsed}ms`);
  log(C.reset,`   Usuarios simultáneos:  ${N_USERS}`);

  if (rate >= 95)      log(C.green  + C.bold, `\n   ✅ ¡Tu sistema aguanta perfectamente ${N_USERS} usuarios!\n`);
  else if (rate >= 70) log(C.yellow + C.bold, `\n   ⚠️  Aguanta pero con algunos errores bajo carga.\n`);
  else                 log(C.red    + C.bold, `\n   ❌ Problemas con ${N_USERS} usuarios simultáneos.\n`);
}

main().catch(console.error);
