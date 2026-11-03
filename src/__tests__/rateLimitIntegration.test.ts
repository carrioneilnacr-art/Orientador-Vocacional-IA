import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';

// Explicit opt-in: writes anonymous expiring quota counters to configured DB.
describe.skipIf(process.env.RATE_LIMIT_INTEGRATION!=='true')('Actual PostgreSQL shared quota adapter',()=>{
 it('admits40 independent sessions under the same NAT with one atomic statement per request',async()=>{
  const {checkRateLimits}=await import('@/lib/rateLimit');
  const prefix=`integration:${randomUUID()}`;
  const started=performance.now();
  const measurements=await Promise.all(Array.from({length:40},async(_,i)=>{
   const t=performance.now();
   const result=await checkRateLimits([{key:`${prefix}:ip`,max:600,windowMs:60000},{key:`${prefix}:session:${i}`,max:12,windowMs:60000}]);
   return {...result,ms:performance.now()-t};
  }));
  const sorted=measurements.map(row=>row.ms).sort((a,b)=>a-b);
  console.log('[Real quota adapter 40]',JSON.stringify({allowed:measurements.filter(row=>row.allowed).length,totalMs:performance.now()-started,p50ms:sorted[19],p95ms:sorted[37],poolMax:process.env.DB_POOL_MAX??'default3'}));
  expect(measurements.every(row=>row.allowed)).toBe(true);
 },30000);
});
