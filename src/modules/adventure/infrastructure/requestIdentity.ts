import {NextRequest} from 'next/server';
import {db} from '@/db';
import {students} from '@/db/schema';
import {and,eq} from 'drizzle-orm';
import {STUDENT_COOKIE_NAME,verifyStudentSession,verifyGuestTestSession} from '@/lib/studentAuth';
import type {ExplorationRecord} from '../application/completeExploration';
import {canReadExploration} from '../application/completeExploration';
export const ADVENTURE_COOKIE='chaski_adventure_session';
export function adventureToken(req:NextRequest){
 const payload=verifyGuestTestSession(req.cookies.get(ADVENTURE_COOKIE)?.value);
 return payload?.testId.startsWith('ADV-')?payload.testId:null;
}
export async function currentStudent(req:NextRequest){
 const cookie=req.cookies.get(STUDENT_COOKIE_NAME)?.value;
 if(!cookie)return null;
 const session=verifyStudentSession(cookie);if(!session)throw new Error('INVALID_IDENTITY');
 const [student]=await db.select({id:students.id,schoolId:students.schoolId,consentStatus:students.consentStatus}).from(students).where(and(eq(students.id,session.studentId),eq(students.schoolId,session.schoolId),eq(students.active,true))).limit(1);
 if(!student||student.consentStatus!=='GRANTED')throw new Error('CONSENT_REQUIRED');
 return student;
}
export function ownsExploration(record:ExplorationRecord,student:{id:string;schoolId:string}|null){return canReadExploration(record,student);}
