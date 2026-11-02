import {and,desc,eq,gt,lt,sql} from 'drizzle-orm';
import {db} from '@/db';
import {students,userSessions} from '@/db/schema';
import type {SchoolExplorationReader} from '../application/listExplorations';
import {z} from 'zod';
const savedProfile=z.object({kind:z.literal('adventure-exploration'),version:z.literal(1),notes:z.array(z.object({label:z.string().max(200),text:z.string().max(1000)})).max(20)});
export const explorationReader:SchoolExplorationReader={
 async list(schoolId,before){
  const rows=await db.select({id:userSessions.id,name:students.fullName,createdAt:userSessions.createdAt,profile:userSessions.profileResult})
   .from(userSessions).innerJoin(students,and(eq(students.id,userSessions.studentId),eq(students.schoolId,userSessions.schoolId)))
   .where(and(eq(userSessions.schoolId,schoolId),eq(students.schoolId,schoolId),eq(students.active,true),eq(students.consentStatus,'GRANTED'),gt(userSessions.expiresAt,new Date()),sql`${userSessions.profileResult}->>'kind' = 'adventure-exploration'`,before?lt(userSessions.createdAt,before):undefined))
   .orderBy(desc(userSessions.createdAt)).limit(20);
  return rows.flatMap(row=>{const result=savedProfile.safeParse(row.profile);return result.success?[{id:row.id,studentName:row.name,createdAt:row.createdAt.toISOString(),notes:result.data.notes}]:[];});
 }
};
