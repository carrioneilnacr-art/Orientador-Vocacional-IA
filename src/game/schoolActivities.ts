import {z} from 'zod';
import type {SchoolRoomId} from './colegioRooms';

export const SCHOOL_ACTIVITY_KEY='chaski-school-activities-v1';
const evidenceSchema=z.object({
 version:z.literal(1),chapterId:z.literal('colegio'),
 contentVersion:z.enum(['legacy-v1','adventure-v2']).optional(),
 activityId:z.enum(['laboratorio','taller','tecnologia']),
 preference:z.enum(['more','unsure','other']),
 performance:z.object({attempts:z.number().int().min(0).max(10000),solved:z.boolean().nullable()}),
 choices:z.array(z.number().int().min(0).max(10)).max(32),
 completedAt:z.string().datetime(),
});
export type SchoolEvidence=z.infer<typeof evidenceSchema>;
export const legacySchoolActivityNames:Record<SchoolRoomId,string>={laboratorio:'El misterio de las plantas',taller:'Un mural para el colegio',tecnologia:'Devuelve la señal'};
export const schoolActivityNames:Record<SchoolRoomId,string>={laboratorio:'El huerto que se seca',taller:'Una invitación que se entienda',tecnologia:'La feria se quedó sin pantalla'};
/** Missing version identifies historical evidence; never relabel it with new tasks. */
export function schoolActivityName(room:SchoolRoomId,contentVersion?:SchoolEvidence['contentVersion']){
 return (contentVersion==='adventure-v2'?schoolActivityNames:legacySchoolActivityNames)[room];
}
export const preferenceLabels={more:'Quiero seguir explorando esta actividad.',unsure:'Todavía estoy descubriendo si me interesa.',other:'Prefiero probar otras actividades.'};
export const explorationAreas:Record<SchoolRoomId,string>={laboratorio:'Observar y buscar explicaciones',taller:'Imaginar y expresarse',tecnologia:'Construir y resolver problemas prácticos'};

export function readSchoolEvidence(raw:string|null):SchoolEvidence[]{
 try{
  const parsed:unknown=JSON.parse(raw??'[]');if(!Array.isArray(parsed)||parsed.length>3)return [];
  const result:SchoolEvidence[]=[];
  for(const item of parsed){const evidence=evidenceSchema.safeParse(item);if(evidence.success&&!result.some(old=>old.activityId===evidence.data.activityId))result.push(evidence.data);}
  return result;
 }catch{return [];}
}

export function recordSchoolEvidence(entries:readonly SchoolEvidence[],entry:SchoolEvidence):SchoolEvidence[]{
 const parsed=evidenceSchema.safeParse(entry);if(!parsed.success)return [...entries];
 return [...entries.filter(old=>old.activityId!==parsed.data.activityId),parsed.data];
}
