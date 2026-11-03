import {db} from '@/db';
import {userSessions} from '@/db/schema';
import {eq} from 'drizzle-orm';
import type {ExplorationRecord,ExplorationRepository} from '../application/completeExploration';
import {explorationInput,summarizeExploration,type ExplorationResult} from '../domain/exploration';

function recordFromRow(row:typeof userSessions.$inferSelect|undefined):ExplorationRecord|null{
  if(!row||row.expiresAt.getTime()<=Date.now())return null;
  const result=row.profileResult as Partial<ExplorationResult>|null;
  const input=explorationInput.safeParse(row.answersPayload);
  if(!input.success||result?.kind!=='adventure-exploration'||result.version!==1||!Array.isArray(result.notes))return null;
  return {token:row.sessionToken,studentId:row.studentId,schoolId:row.schoolId,input:input.data,result:summarizeExploration(input.data,row.createdAt.toISOString())};
}

export function explorationInsert(database:Pick<typeof db,'insert'>,record:ExplorationRecord){
 return database.insert(userSessions).values({sessionToken:record.token,studentId:record.studentId,schoolId:record.schoolId,answersPayload:record.input,profileResult:record.result,recommendedCareerIds:[],expiresAt:new Date(Date.now()+30*86400000)})
  .onConflictDoNothing({target:userSessions.sessionToken}).returning();
}

export const explorationRepository:ExplorationRepository={
 async find(token){
  const [row]=await db.select().from(userSessions).where(eq(userSessions.sessionToken,token)).limit(1);
  return recordFromRow(row);
 },
 async saveOnce(record){
  const [inserted]=await explorationInsert(db,record);
  if(inserted){
   const saved=recordFromRow(inserted);
   if(!saved)throw new Error('Exploration persistence unavailable');
   return saved;
  }
  // A replay or concurrent submission reads the original immutable result.
  // Ownership must be checked against this stored record, never request input.
  const stored=await this.find(record.token);
  if(!stored)throw new Error('Exploration persistence unavailable');
  return stored;
 }
};
