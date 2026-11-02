import {randomUUID} from 'node:crypto';
import {NextRequest,NextResponse} from 'next/server';
import {checkRateLimit} from '@/lib/rateLimit';
import {GUEST_TEST_COOKIE_NAME,signGuestTestSession} from '@/lib/studentAuth';
import {InvalidAssessment} from '@/modules/assessment/domain/assessment';
import {completeAssessment} from '@/modules/assessment/application/completeAssessment';
import {assessmentRepository} from '@/modules/assessment/infrastructure/assessmentRepository';

function rateLimit(req:Request){
 const ip=req.headers.get('x-forwarded-for')||req.headers.get('x-real-ip')||'unknown';
 const result=checkRateLimit(ip);
 return result.allowed?null:NextResponse.json({error:'Too many requests'},{status:429,headers:{'Retry-After':String(result.retryAfter)}});
}
export async function GET(req:Request){
 const limited=rateLimit(req);if(limited)return limited;
 try{
  const {questions,options}=await assessmentRepository.loadCatalog();
  return NextResponse.json({questions,options},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'No se pudo cargar la evaluación.'},{status:503});}
}
export async function POST(req:NextRequest){
 const limited=rateLimit(req);if(limited)return limited;
 let body:unknown;try{body=await req.json();}catch{return NextResponse.json({error:'JSON inválido.'},{status:400});}
 try{
  const {saved,...result}=await completeAssessment(body,assessmentRepository,{id:()=>`TEST-${randomUUID()}`,now:()=>new Date()});
  const response=NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
  response.cookies.delete(GUEST_TEST_COOKIE_NAME);
  if(saved){
   const token=signGuestTestSession(result.testId);
   if(token)response.cookies.set({name:GUEST_TEST_COOKIE_NAME,value:token,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:30*24*60*60});
  }
  return response;
 }catch(error){
  if(error instanceof InvalidAssessment)return NextResponse.json({error:error.message},{status:400});
  console.error('[Assessment] Evaluation failed');
  return NextResponse.json({error:'No se pudo completar la evaluación. Inténtalo nuevamente.'},{status:500});
 }
}
