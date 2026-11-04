import {NextRequest} from 'next/server';
import {adventureToken,currentStudent,ownsExploration} from '@/modules/adventure/infrastructure/requestIdentity';
import {explorationRepository} from '@/modules/adventure/infrastructure/drizzleExplorationRepository';
import type {SavedChatEvidence} from '../application/gameGuidance';

/** Cookie-scoped private lookup. No cache and no caller-selected identity. */
export async function savedGameContext(req:Request):Promise<SavedChatEvidence>{
 const request=new NextRequest(req.url,{headers:req.headers});
 const token=adventureToken(request);
 if(!token)return {status:'absent'};
 try{
  const student=await currentStudent(request);
  const record=await explorationRepository.find(token);
  if(!record)return {status:'absent'};
  if(!ownsExploration(record,student))return {status:'restricted'};
  return {status:'saved',savedAt:record.result.createdAt,notes:record.result.notes.map(({label,text})=>({label,text}))};
 }catch(error){
  if(error instanceof Error&&['INVALID_IDENTITY','CONSENT_REQUIRED'].includes(error.message))return {status:'restricted'};
  throw Object.assign(new Error('Saved exploration context unavailable'),{code:'SAVED_CONTEXT_UNAVAILABLE'});
 }
}
