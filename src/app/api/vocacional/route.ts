import {randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
import {checkRequestRateLimit,quotaJson} from '@/lib/requestRateLimit';
import {GUEST_TEST_COOKIE_NAME,signGuestTestSession} from '@/lib/studentAuth';
import {InvalidAssessment} from '@/modules/assessment/domain/assessment';
import {completeAssessment} from '@/modules/assessment/application/completeAssessment';
import {assessmentRepository} from '@/modules/assessment/infrastructure/assessmentRepository';

export async function GET(req:Request){
 const quota=await checkRequestRateLimit(req,'assessment-read');
 const json=(body:unknown,init?:ResponseInit)=>quotaJson(body,quota,init);
 if(!quota.allowed)return json({error:'No se pudo atender la solicitud. Inténtalo en unos momentos.'},{status:quota.status});
 try{
  const {questions,options}=await assessmentRepository.loadCatalog();
  return json({questions,options},{headers:{'Cache-Control':'no-store'}});
 }catch{return json({error:'No se pudo cargar la evaluación.'},{status:503});}
}
export async function POST(req:NextRequest){
 const quota=await checkRequestRateLimit(req,'assessment-write');
 const json=(body:unknown,init?:ResponseInit)=>quotaJson(body,quota,init);
 if(!quota.allowed)return json({error:'No se pudo atender la solicitud. Inténtalo en unos momentos.'},{status:quota.status});
 let body:unknown;try{body=await req.json();}catch{return json({error:'JSON inválido.'},{status:400});}
 try{
  const {saved,...result}=await completeAssessment(body,assessmentRepository,{id:()=>`TEST-${randomUUID()}`,now:()=>new Date()});
  const response=json({...result,saved},{headers:{'Cache-Control':'no-store'}});
  response.cookies.delete(GUEST_TEST_COOKIE_NAME);
  if(saved){
   const token=signGuestTestSession(result.testId);
   if(token)response.cookies.set({name:GUEST_TEST_COOKIE_NAME,value:token,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:30*24*60*60});
  }
  return response;
 }catch(error){
  if(error instanceof InvalidAssessment)return json({error:error.message},{status:400});
  console.error('[Assessment] Evaluation failed');
  return json({error:'No se pudo completar la evaluación. Inténtalo nuevamente.'},{status:500});
 }
}
