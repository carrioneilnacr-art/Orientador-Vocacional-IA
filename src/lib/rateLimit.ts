import {createHash} from 'node:crypto';
import {sql} from 'drizzle-orm';
import {db} from '@/db';
import {rateLimitBuckets} from '@/db/schema';

export type RateLimitResult={allowed:boolean;status:200|429|503;retryAfter?:number};
export type QuotaBucket={key:string;max:number;windowMs:number};
export type AtomicQuotaStore=(buckets:QuotaBucket[])=>Promise<{key:string;hits:number;retryAfter:number}[]>;

export function quotaStatement(database:Pick<typeof db,'insert'>,buckets:QuotaBucket[]){
 return database.insert(rateLimitBuckets).values(buckets.map(bucket=>({bucketKey:bucket.key,hits:1,expiresAt:sql`current_timestamp + ${bucket.windowMs} * interval '1 millisecond'`})))
  .onConflictDoUpdate({target:rateLimitBuckets.bucketKey,set:{
   hits:sql<number>`case when ${rateLimitBuckets.expiresAt} <= current_timestamp then 1 else least(${rateLimitBuckets.hits} + 1, 10001) end`,
   expiresAt:sql`case when ${rateLimitBuckets.expiresAt} <= current_timestamp then excluded.expires_at else ${rateLimitBuckets.expiresAt} end`,
  }})
  .returning({key:rateLimitBuckets.bucketKey,hits:rateLimitBuckets.hits,retryAfter:sql<number>`greatest(1, ceil(extract(epoch from (${rateLimitBuckets.expiresAt} - current_timestamp))))::integer`});
}
const postgresQuotaStore:AtomicQuotaStore=async buckets=>{
 // One autocommit statement releases the shared IP row before the next client
 // round trip. A client-held transaction here convoys classmates behind NAT.
 const rows=await quotaStatement(db,buckets);
 if(rows.length!==buckets.length)throw new Error('Quota counter unavailable');
 return rows;
};

export function createRateLimiter(store:AtomicQuotaStore){
 return async(buckets:QuotaBucket[]):Promise<RateLimitResult>=>{
  if(!buckets.length||buckets.length>4||buckets.some(({key,max,windowMs})=>!key||!Number.isInteger(max)||max<1||max>10000||!Number.isFinite(windowMs)||windowMs<1000||windowMs>86400000))throw new Error('Invalid rate limit configuration');
  try{
   const hashed=buckets.map(bucket=>({...bucket,key:createHash('sha256').update(bucket.key).digest('hex')}));
   const rows=await store(hashed);
   if(rows.length!==hashed.length)throw new Error('Quota counter unavailable');
   const denied=rows.filter(row=>row.hits>(hashed.find(bucket=>bucket.key===row.key)?.max??0));
   return denied.length?{allowed:false,status:429,retryAfter:Math.max(...denied.map(row=>row.retryAfter))}:{allowed:true,status:200};
  }catch{
   console.error('[RateLimit] Shared quota store unavailable');
   return {allowed:false,status:503,retryAfter:5};
  }
 };
}

export const checkRateLimits=createRateLimiter(postgresQuotaStore);
export function checkRateLimit(key:string,max=30,windowSecondsOrMs=60000){
 const windowMs=windowSecondsOrMs<1000?windowSecondsOrMs*1000:windowSecondsOrMs;
 return checkRateLimits([{key,max,windowMs}]);
}
