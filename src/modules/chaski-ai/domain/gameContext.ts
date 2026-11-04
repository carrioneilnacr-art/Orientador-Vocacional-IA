import {z} from 'zod';

const version=z.enum(['legacy-v1','adventure-v2']);
const plazaNpc=z.enum(['mateo','ernesto','valeria','luis','estudiantes']);
const room=z.enum(['laboratorio','taller','tecnologia']);
const choice=z.number().int().min(0).max(2);
const schoolVersions=z.object({elena:version.optional(),sofia:version.optional()}).strict();

/** Client-declared navigation/preferences only. Never proves completion or identity. */
export const gameContextSchema=z.object({
 version:z.literal(1),scene:z.enum(['plaza','colegio']),room:room.optional(),
 activeNpc:z.enum(['mateo','ernesto','valeria','luis','estudiantes','elena','sofia']).optional(),
 rpgEntries:z.array(z.object({npcId:plazaNpc,choice,contentVersion:version.optional()}).strict()).max(5),
 schoolEntries:z.array(z.object({activityId:room,preference:z.enum(['more','unsure','other']),contentVersion:version.optional()}).strict()).max(3),
 schoolAnswers:z.object({elena:choice.optional(),sofia:choice.optional()}).strict().optional(),
 schoolContentVersions:schoolVersions.optional(),
}).strict().superRefine((value,ctx)=>{
 if(new Set(value.rpgEntries.map(item=>item.npcId)).size!==value.rpgEntries.length)ctx.addIssue({code:'custom',message:'Personajes repetidos.'});
 if(new Set(value.schoolEntries.map(item=>item.activityId)).size!==value.schoolEntries.length)ctx.addIssue({code:'custom',message:'Actividades repetidas.'});
 if(value.scene==='plaza'&&value.room)ctx.addIssue({code:'custom',message:'El aula pertenece al colegio.'});
});
export type GameContext=z.infer<typeof gameContextSchema>;
