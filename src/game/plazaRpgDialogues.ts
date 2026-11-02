import {rpgNpcs,type RpgNpcId} from './plazaRpgNpcs';
import type {RiasecDimension} from './plazaNpcs';

import {CURRENT_NARRATIVE_VERSION,getPlazaDialogue,type NarrativeContentVersion} from '@/modules/adventure/domain/narrativeContent';
export {rpgDialogues,legacyRpgDialogues} from '@/modules/adventure/domain/narrativeContent';
export type RpgDecision={npcId:RpgNpcId;choice:number;contentVersion?:NarrativeContentVersion};
export const RPG_SAVE_KEY='chaski-plaza-rpg-v1';
export function recordRpgChoice(entries:readonly RpgDecision[],npcId:RpgNpcId,choice:number,contentVersion:NarrativeContentVersion=CURRENT_NARRATIVE_VERSION):RpgDecision[]{
 if(!rpgNpcs.some(n=>n.id===npcId)||!Number.isInteger(choice)||choice<0||choice>2||entries.some(e=>e.npcId===npcId))return [...entries];
 return [...entries,{npcId,choice,...(contentVersion==='legacy-v1'?{}:{contentVersion})}];
}
export function readRpgChoices(raw:string|null):RpgDecision[]{
 try{const data:unknown=JSON.parse(raw??'[]');if(!Array.isArray(data)||data.length>5)return [];let entries:RpgDecision[]=[];
 for(const e of data){if(!e||typeof e!=='object'||!('npcId' in e)||!('choice' in e))continue;const npc=rpgNpcs.find(n=>n.id===e.npcId);if(npc&&typeof e.choice==='number')entries=recordRpgChoice(entries,npc.id,e.choice,'contentVersion' in e&&e.contentVersion==='adventure-v2'?'adventure-v2':'legacy-v1');}return entries;}catch{return [];}
}
export function rpgRiasec(entries:readonly RpgDecision[]):Record<RiasecDimension,number>{
 const totals:Record<RiasecDimension,number>={R:0,I:0,A:0,S:0,E:0,C:0};
 for(const entry of readRpgChoices(JSON.stringify(entries))){const weights=getPlazaDialogue(entry.npcId,entry.contentVersion??'legacy-v1').weights[entry.choice];for(const dimension of Object.keys(totals) as RiasecDimension[])totals[dimension]+=weights[dimension]??0;}return totals;
}
