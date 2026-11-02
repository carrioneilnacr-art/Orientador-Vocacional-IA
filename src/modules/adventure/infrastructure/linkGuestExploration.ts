import {NextRequest} from 'next/server';
import {db} from '@/db';
import {students,userSessions} from '@/db/schema';
import {and,eq,gt,isNull} from 'drizzle-orm';
import {adventureToken} from './requestIdentity';
import {explorationRepository} from './drizzleExplorationRepository';

/** A signed guest capability may be claimed once by an active, consenting student. */
export async function linkGuestExploration(req:NextRequest,studentId:string,schoolId:string):Promise<boolean>{
 const token=adventureToken(req);if(!token)return false;
 const [student]=await db.select({id:students.id}).from(students).where(and(eq(students.id,studentId),eq(students.schoolId,schoolId),eq(students.active,true),eq(students.consentStatus,'GRANTED'))).limit(1);
 if(!student)return false;
 const record=await explorationRepository.find(token);if(!record||record.studentId!==null||record.schoolId!==null)return false;
 const rows=await db.update(userSessions).set({studentId,schoolId}).where(and(eq(userSessions.sessionToken,token),isNull(userSessions.studentId),isNull(userSessions.schoolId),gt(userSessions.expiresAt,new Date()))).returning({id:userSessions.id});
 return rows.length===1;
}
