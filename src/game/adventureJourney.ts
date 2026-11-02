import {initialProgress,readProgress,type Progress} from './adventure';
import {readRpgChoices,type RpgDecision} from './plazaRpgDialogues';
import {allPlazaNpcsCompleted} from './plazaRpgNpcs';
import {readSchoolEvidence,type SchoolEvidence} from './schoolActivities';
import {type NarrativeContentVersion} from '@/modules/adventure/domain/narrativeContent';

export const JOURNEY_SAVE_KEY='chaski-journey-v1';
export type SchoolSpeaker='elena'|'sofia';
export type SchoolAnswers=Partial<Record<SchoolSpeaker,number>>;
export type SchoolContentVersions=Partial<Record<SchoolSpeaker,NarrativeContentVersion>>;
export type Journey={version:1;scene:'plaza'|'colegio';progress:Progress;rpgEntries:RpgDecision[];schoolEntries:SchoolEvidence[];schoolAnswers:SchoolAnswers;schoolContentVersions:SchoolContentVersions};
export const schoolConversationChoices=[
 'Cómo resolver problemas y experimentar.',
 'Cómo crear y compartir mis ideas.',
 'Cómo colaborar y ayudar a otras personas.',
] as const;

export function newJourney():Journey{
 return {version:1,scene:'plaza',progress:{...initialProgress,decisions:[],npcDecisions:[]},rpgEntries:[],schoolEntries:[],schoolAnswers:{},schoolContentVersions:{}};
}
export function recordSchoolAnswer(answers:SchoolAnswers,id:SchoolSpeaker,choice:number):SchoolAnswers{
 if(!['elena','sofia'].includes(id)||!Number.isInteger(choice)||choice<0||choice>2||answers[id]!==undefined)return answers;
 return {...answers,[id]:choice};
}
/** One envelope keeps chapter and evidence consistent. Old saves migrate once. */
export function readJourney(raw:string|null,legacy?:{progress:string|null;rpg:string|null;school:string|null}):Journey{
 const fallback=newJourney();
 if(legacy){fallback.progress=readProgress(legacy.progress);fallback.rpgEntries=readRpgChoices(legacy.rpg);fallback.schoolEntries=readSchoolEvidence(legacy.school);}
 if(!raw||raw.length>50000)return fallback;
 try{
  const data:unknown=JSON.parse(raw);
  if(!data||typeof data!=='object'||!('version' in data)||data.version!==1)return fallback;
  const result=newJourney();
  if('progress' in data)result.progress=readProgress(JSON.stringify(data.progress));
  if('rpgEntries' in data)result.rpgEntries=readRpgChoices(JSON.stringify(data.rpgEntries));
  if('schoolEntries' in data)result.schoolEntries=readSchoolEvidence(JSON.stringify(data.schoolEntries));
  if('schoolAnswers' in data&&data.schoolAnswers&&typeof data.schoolAnswers==='object'){
   for(const id of ['elena','sofia'] as const){const value:unknown=Object.getOwnPropertyDescriptor(data.schoolAnswers,id)?.value;if(typeof value==='number')result.schoolAnswers=recordSchoolAnswer(result.schoolAnswers,id,value);}
  }
  if('schoolContentVersions' in data&&data.schoolContentVersions&&typeof data.schoolContentVersions==='object'){
   for(const id of ['elena','sofia'] as const){const value:unknown=Object.getOwnPropertyDescriptor(data.schoolContentVersions,id)?.value;if(result.schoolAnswers[id]!==undefined&&(value==='legacy-v1'||value==='adventure-v2'))result.schoolContentVersions[id]=value;}
  }
  if('scene' in data&&data.scene==='colegio'&&allPlazaNpcsCompleted(result.rpgEntries.map(entry=>entry.npcId)))result.scene='colegio';
  return result;
 }catch{return fallback;}
}
