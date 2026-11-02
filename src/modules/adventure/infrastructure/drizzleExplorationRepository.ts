import {db} from '@/db';
import {userSessions} from '@/db/schema';
import {eq} from 'drizzle-orm';
import type {ExplorationRepository} from '../application/completeExploration';
import {explorationInput,summarizeExploration,type ExplorationResult} from '../domain/exploration';

export const explorationRepository:ExplorationRepository={
 async find(token){
  const [row]=await db.select().from(userSessions).where(eq(userSessions.sessionToken,token)).limit(1);
  if(!row||row.expiresAt.getTime()<=Date.now())return null;
  const result=row.profileResult as Partial<ExplorationResult>|null;
  const input=explorationInput.safeParse(row.answersPayload);
  if(!input.success||result?.kind!=='adventure-exploration'||result.version!==1||!Array.isArray(result.notes))return null;
  return {token,studentId:row.studentId,schoolId:row.schoolId,input:input.data,result:summarizeExploration(input.data,row.createdAt.toISOString())};
 },
 async saveOnce(record){
  await db.insert(userSessions).values({sessionToken:record.token,studentId:record.studentId,schoolId:record.schoolId,answersPayload:record.input,profileResult:record.result,recommendedCareerIds:[],expiresAt:new Date(Date.now()+30*86400000)}).onConflictDoNothing({target:userSessions.sessionToken});
  const stored=await this.find(record.token);
  if(!stored)throw new Error('Exploration persistence unavailable');
  return stored;
 }
};
