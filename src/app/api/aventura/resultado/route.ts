import {NextRequest,NextResponse} from 'next/server';
import {ZodError} from 'zod';
import {completeExploration} from '@/modules/adventure/application/completeExploration';
import {explorationRepository} from '@/modules/adventure/infrastructure/drizzleExplorationRepository';
import {adventureToken,currentStudent,ownsExploration} from '@/modules/adventure/infrastructure/requestIdentity';
import {checkRequestRateLimit,quotaJson} from '@/lib/requestRateLimit';
import {explorationInput} from '@/modules/adventure/domain/exploration';
const headers={'Cache-Control':'private, no-store'};
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Origen no permitido.'},{status:403,headers});
 const quota=await checkRequestRateLimit(req,'adventure-finish');
 const json=(body:unknown,init?:ResponseInit)=>quotaJson(body,quota,init);
 if(!quota.allowed)return json({error:'Intenta más tarde.'},{status:quota.status,headers});
 const token=adventureToken(req);if(!token)return json({error:'Inicia la sesión de aventura.'},{status:401,headers});
 try{
  const text=await req.text();if(text.length>32000)return json({error:'Demasiados datos.'},{status:413,headers});
  let raw:unknown;try{raw=JSON.parse(text);}catch{return json({error:'JSON inválido.'},{status:400,headers});}
  explorationInput.parse(raw);
  const student=await currentStudent(req);
  // saveOnce never updates a conflict. Authorize the returned original record
  // below, avoiding a redundant read and the pre-read/insert race.
  const record=await completeExploration(raw,{token,studentId:student?.id??null,schoolId:student?.schoolId??null},explorationRepository);
  if(!ownsExploration(record,student))return json({error:'No tienes acceso a este recorrido.'},{status:403,headers});
  return json({result:record.result},{headers});
 }catch(error){
  if(error instanceof ZodError)return json({error:'Completa las cinco conversaciones y las tres actividades con respuestas válidas.'},{status:400,headers});
  if(error instanceof Error&&['INVALID_IDENTITY','CONSENT_REQUIRED'].includes(error.message))return json({error:'Revisa tu sesión y consentimiento del colegio.'},{status:403,headers});
  return json({error:'No pudimos guardar el recorrido. Tu bitácora local se conserva; inténtalo de nuevo.'},{status:503,headers});
 }
}
export async function GET(req:NextRequest){
 const quota=await checkRequestRateLimit(req,'adventure-read');
 const json=(body:unknown,init?:ResponseInit)=>quotaJson(body,quota,init);
 if(!quota.allowed)return json({error:'Intenta más tarde.'},{status:quota.status,headers});
 const token=adventureToken(req);if(!token)return json({error:'No hay un resultado de aventura en esta sesión.'},{status:401,headers});
 try{
  const student=await currentStudent(req),record=await explorationRepository.find(token);
  if(!record)return json({error:'Todavía no has guardado tu recorrido.'},{status:404,headers});
  if(!ownsExploration(record,student))return json({error:'No tienes acceso a este recorrido.'},{status:403,headers});
  return json({result:record.result},{headers});
 }catch{return json({error:'No pudimos recuperar el recorrido.'},{status:503,headers});}
}
