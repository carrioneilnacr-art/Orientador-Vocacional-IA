import {randomUUID} from 'node:crypto';
import {NextResponse} from 'next/server';
import {checkRateLimits,type RateLimitResult} from './rateLimit';
import {GUEST_TEST_COOKIE_NAME,STUDENT_COOKIE_NAME,signGuestTestSession,verifyGuestTestSession,verifyStudentSession} from './studentAuth';

export const RATE_COOKIE='chaski_usage_session';
const policies={chat:12,'assessment-read':30,'assessment-write':10,'adventure-start':20,'adventure-finish':10,'adventure-read':30} as const;
export type RateOperation=keyof typeof policies;
export type RequestRateResult=RateLimitResult&{setCookie?:string};
export function requestIp(req:Request){return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('x-real-ip')||'unknown';}
function cookies(req:Request){
 return new Map((req.headers.get('cookie')??'').split(';').map(part=>{const i=part.indexOf('=');return [part.slice(0,i).trim(),part.slice(i+1).trim()];}));
}
export function quotaIdentity(req:Request):{id:string;setCookie?:string}|null{
 const jar=cookies(req);
 const student=verifyStudentSession(jar.get(STUDENT_COOKIE_NAME)??'');
 if(student)return {id:`student:${student.schoolId}:${student.studentId}`};
 for(const name of ['chaski_adventure_session',GUEST_TEST_COOKIE_NAME,RATE_COOKIE]){
  const payload=verifyGuestTestSession(jar.get(name));
  if(payload)return {id:`guest:${payload.testId}`};
 }
 const id=`RL-${randomUUID()}`,token=signGuestTestSession(id,7);
 if(!token)return null;
 return {id:`guest:${id}`,setCookie:`${RATE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${process.env.NODE_ENV==='production'?'; Secure':''}`};
}
export async function checkRequestRateLimit(req:Request,operation:RateOperation):Promise<RequestRateResult>{
 const identity=quotaIdentity(req);
 if(!identity)return {allowed:false,status:503,retryAfter:5};
 const result=await checkRateLimits([
  {key:`${operation}:ip:${requestIp(req)}`,max:600,windowMs:60000},
  {key:`${operation}:session:${identity.id}`,max:policies[operation],windowMs:60000},
 ]);
 return {...result,setCookie:identity.setCookie};
}
export function quotaHeaders(limit:RequestRateResult):Record<string,string>{
 return {...(limit.retryAfter?{'Retry-After':String(limit.retryAfter)}:{}),...(limit.setCookie?{'Set-Cookie':limit.setCookie}:{})};
}
export function quotaJson(body:unknown,limit:RequestRateResult,init:ResponseInit={}){
 const headers=new Headers(init.headers);
 for(const [name,value] of Object.entries(quotaHeaders(limit)))headers.set(name,value);
 return NextResponse.json(body,{...init,headers});
}
