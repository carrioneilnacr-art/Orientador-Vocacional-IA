import {describe,expect,it,vi} from 'vitest';
import {drizzle} from 'drizzle-orm/postgres-js';
vi.mock('@/db',()=>({db:{}}));
import {createRateLimiter,quotaStatement,type AtomicQuotaStore} from '@/lib/rateLimit';
import {postgresPoolConfig} from '@/db/poolConfig';

function atomicFixture(){
 let now=0;
 const counters=new Map<string,{hits:number;expires:number}>();
 const store:AtomicQuotaStore=async buckets=>buckets.map(bucket=>{
  const existing=counters.get(bucket.key);
  const value=existing&&existing.expires>now?{...existing,hits:existing.hits+1}:{hits:1,expires:now+bucket.windowMs};
  counters.set(bucket.key,value);
  return {key:bucket.key,hits:value.hits,retryAfter:Math.ceil((value.expires-now)/1000)};
 });
 return {store,counters,advance:(ms:number)=>{now+=ms;}};
}
describe('Shared quota policy with an atomic store',()=>{
 it('generates one atomic PostgreSQL multi-row upsert, resetting expired counters with server time',()=>{
  const query=quotaStatement(drizzle.mock(),[{key:'hashed-ip',max:600,windowMs:60000},{key:'hashed-session',max:12,windowMs:60000}]).toSQL();
  expect(query.sql.match(/insert into/g)).toHaveLength(1);
  expect(query.sql).toContain('on conflict ("bucket_key") do update');
  expect(query.sql).toContain('"expires_at" <= current_timestamp then 1');
  expect(query.sql).toContain('"hits" + 1');
  expect(query.sql).toContain('excluded.expires_at');
  expect(query.params).toContain('hashed-ip');
  expect(query.params).toContain('hashed-session');
 });
 it('admits120 unique students behind one school IP and limits one student independently',async()=>{
  const fixture=atomicFixture(),limit=createRateLimiter(fixture.store);
  const results=await Promise.all(Array.from({length:120},(_,id)=>limit([{key:'chat:ip:school',max:600,windowMs:60000},{key:`chat:session:${id}`,max:12,windowMs:60000}])));
  expect(results.every(result=>result.allowed)).toBe(true);
  const repeated=await Promise.all(Array.from({length:12},()=>limit([{key:'chat:ip:school',max:600,windowMs:60000},{key:'chat:session:0',max:12,windowMs:60000}])));
  expect(repeated.filter(result=>result.allowed)).toHaveLength(11);
  expect(repeated.at(-1)).toEqual({allowed:false,status:429,retryAfter:60});
  expect([...fixture.counters.keys()].every(key=>/^[a-f0-9]{64}$/.test(key))).toBe(true);
 });
 it('two limiter instances share one atomic store without doubling a quota and reset at expiry',async()=>{
  const fixture=atomicFixture(),a=createRateLimiter(fixture.store),b=createRateLimiter(fixture.store);
  const bucket=[{key:'staff_login:school',max:10,windowMs:60000}];
  const results=await Promise.all(Array.from({length:40},(_,i)=>(i%2?a:b)(bucket)));
  expect(results.filter(result=>result.allowed)).toHaveLength(10);
  fixture.advance(60000);
  expect((await b(bucket)).allowed).toBe(true);
 });
 it('fails closed when database quota storage fails',async()=>{
  const spy=vi.spyOn(console,'error').mockImplementation(()=>{});
  const limit=createRateLimiter(async()=>{throw new Error('offline');});
  expect(await limit([{key:'chat:session:x',max:12,windowMs:60000}])).toEqual({allowed:false,status:503,retryAfter:5});
  spy.mockRestore();
 });
});

describe('Bounded serverless pool settings',()=>{
 it('uses explicit conservative defaults and validates overrides',()=>{
  expect(postgresPoolConfig({})).toEqual({prepare:false,max:6,idle_timeout:20,connect_timeout:10});
  expect(postgresPoolConfig({DB_POOL_MAX:'6'}).max).toBe(6);
  for(const value of ['0','-1','1.5','NaN','100'])expect(()=>postgresPoolConfig({DB_POOL_MAX:value})).toThrow('DB_POOL_MAX');
 });
});
