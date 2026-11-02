import {z} from 'zod';
import {getPlazaDialogue,getSchoolDialogue} from './narrativeContent';
const contentVersion=z.enum(['legacy-v1','adventure-v2']);

export const plazaIds=['mateo','ernesto','valeria','luis','estudiantes'] as const;
export const activityIds=['laboratorio','taller','tecnologia'] as const;
export const explorationInput=z.object({
 version:z.literal(1),
 rpgEntries:z.array(z.object({npcId:z.enum(plazaIds),contentVersion:contentVersion.optional(),choice:z.number().int().min(0).max(2)}).strict()).length(5),
 schoolEntries:z.array(z.object({version:z.literal(1),chapterId:z.literal('colegio'),contentVersion:contentVersion.optional(),activityId:z.enum(activityIds),preference:z.enum(['more','unsure','other']),performance:z.object({attempts:z.number().int().min(0).max(10000),solved:z.boolean().nullable()}).strict(),choices:z.array(z.number().int().min(0).max(10)).max(32),completedAt:z.string().datetime()}).strict()).length(3),
 schoolContentVersions:z.object({elena:contentVersion.optional(),sofia:contentVersion.optional()}).strict().optional(),
 schoolAnswers:z.object({elena:z.number().int().min(0).max(2).optional(),sofia:z.number().int().min(0).max(2).optional()}).strict(),
}).strict().superRefine((value,ctx)=>{
 if(new Set(value.rpgEntries.map(entry=>entry.npcId)).size!==5)ctx.addIssue({code:'custom',message:'Completa las cinco conversaciones diferentes.'});
 if(new Set(value.schoolEntries.map(entry=>entry.activityId)).size!==3)ctx.addIssue({code:'custom',message:'Completa las tres actividades diferentes.'});
});
export type ExplorationInput=z.infer<typeof explorationInput>;
export const explorationResultSchema=z.object({version:z.literal(1),kind:z.literal('adventure-exploration'),scope:z.literal('plaza-colegio'),createdAt:z.string().datetime(),notes:z.array(z.object({id:z.string().max(40),label:z.string().max(120),text:z.string().max(500)})).max(10),disclaimer:z.string().max(1000)});
export type ExplorationResult=z.infer<typeof explorationResultSchema>;
const labels={mateo:'Creatividad',ernesto:'Memoria y comunidad',valeria:'Colaboración',luis:'Ideas y trabajo',estudiantes:'Trabajo en equipo',laboratorio:'Laboratorio de Ciencias',taller:'Taller Creativo',tecnologia:'Aula Tecnológica',elena:'Bienvenida al colegio',sofia:'Organización escolar'};
const preferences={more:'Quiero seguir explorando esta actividad.',unsure:'Todavía estoy descubriendo si me interesa.',other:'Prefiero probar otras actividades.'};
export function summarizeExploration(input:ExplorationInput,createdAt:string):ExplorationResult{
 const notes:{id:string;label:string;text:string}[]=input.rpgEntries.map(entry=>({id:entry.npcId,label:labels[entry.npcId],text:getPlazaDialogue(entry.npcId,entry.contentVersion??'legacy-v1').notes[entry.choice]}));
 for(const entry of input.schoolEntries)notes.push({id:entry.activityId,label:labels[entry.activityId],text:preferences[entry.preference]});
 for(const id of ['elena','sofia'] as const){const choice=input.schoolAnswers[id];if(choice!==undefined)notes.push({id,label:labels[id],text:getSchoolDialogue(id,input.schoolContentVersions?.[id]??'legacy-v1').notes[choice]});}
 return {version:1,kind:'adventure-exploration',scope:'plaza-colegio',createdAt,notes,disclaimer:'Estas son tus preferencias declaradas en los dos capítulos disponibles. No constituyen un diagnóstico, una medición de capacidad ni una recomendación definitiva de carrera. Los siguientes escenarios todavía están en desarrollo.'};
}
