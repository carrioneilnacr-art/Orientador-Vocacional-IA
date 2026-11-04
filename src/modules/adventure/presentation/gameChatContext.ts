import {gameContextSchema,type GameContext} from '@/modules/chaski-ai/domain/gameContext';

/** Explicit allowlist: never forward local notes, scores, identities or timing. */
export function deriveGameChatContext(input:{scene:unknown;room?:unknown;activeNpc?:unknown;rpgEntries:readonly unknown[];schoolEntries:readonly unknown[];schoolAnswers?:unknown;schoolContentVersions?:unknown}):GameContext{
 const seenNpcs=new Set<string>(),seenActivities=new Set<string>();
 const rpgEntries=input.rpgEntries.flatMap(value=>{
  if(!value||typeof value!=='object')return [];
  const item=value as Record<string,unknown>;
  const result=gameContextSchema.safeParse({version:1,scene:'plaza',rpgEntries:[{npcId:item.npcId,choice:item.choice,...(item.contentVersion?{contentVersion:item.contentVersion}:{})}],schoolEntries:[]});
  if(!result.success||seenNpcs.has(result.data.rpgEntries[0].npcId))return [];
  seenNpcs.add(result.data.rpgEntries[0].npcId);return result.data.rpgEntries;
 }).slice(0,5);
 const schoolEntries=input.schoolEntries.flatMap(value=>{
  if(!value||typeof value!=='object')return [];
  const item=value as Record<string,unknown>;
  const result=gameContextSchema.safeParse({version:1,scene:'colegio',rpgEntries:[],schoolEntries:[{activityId:item.activityId,preference:item.preference,...(item.contentVersion?{contentVersion:item.contentVersion}:{})}]});
  if(!result.success||seenActivities.has(result.data.schoolEntries[0].activityId))return [];
  seenActivities.add(result.data.schoolEntries[0].activityId);return result.data.schoolEntries;
 }).slice(0,3);
 const schoolAnswers:Record<string,number>={},schoolContentVersions:Record<string,string>={};
 for(const id of ['elena','sofia']){
  const answer:unknown=input.schoolAnswers&&typeof input.schoolAnswers==='object'?Object.getOwnPropertyDescriptor(input.schoolAnswers,id)?.value:undefined;
  const version:unknown=input.schoolContentVersions&&typeof input.schoolContentVersions==='object'?Object.getOwnPropertyDescriptor(input.schoolContentVersions,id)?.value:undefined;
  if(typeof answer==='number'&&Number.isInteger(answer)&&answer>=0&&answer<=2){schoolAnswers[id]=answer;if(version==='legacy-v1'||version==='adventure-v2')schoolContentVersions[id]=version;}
 }
 const scene=input.scene==='colegio'?'colegio':'plaza';
 return gameContextSchema.parse({version:1,scene,rpgEntries,schoolEntries,schoolAnswers,schoolContentVersions,...(scene==='colegio'&&['laboratorio','taller','tecnologia'].includes(String(input.room))?{room:input.room}:{}),...(['mateo','ernesto','valeria','luis','estudiantes','elena','sofia'].includes(String(input.activeNpc))?{activeNpc:input.activeNpc}:{})});
}
