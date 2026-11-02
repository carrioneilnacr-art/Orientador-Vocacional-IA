export const dimensions=['REALISTIC','INVESTIGATIVE','ARTISTIC','SOCIAL','ENTERPRISING','CONVENTIONAL','TECH','LOGIC'] as const;
export type Scores=Record<string,number>;
export type Question={id:number;missionNumber:number|null;isActive:boolean};
export type Option={id:number;questionId:number;optionText:string;scorePayload:unknown};
export type Catalog={questions:Question[];options:Option[];source:'database'|'verified-local'};
export type Rule={careerId:number;dimension:string;weight:number;minScore:number;explanationTemplate:string};
export type Match={careerId:number;match:number;explanations:string[]};
export class InvalidAssessment extends Error {}
export function validCatalog(catalog:Pick<Catalog,'questions'|'options'>):boolean{
 const {questions,options}=catalog;
 return questions.length===16&&options.length===64&&new Set(questions.map(q=>q.id)).size===16&&new Set(options.map(o=>o.id)).size===64
 &&[1,2,3,4].every(m=>questions.filter(q=>q.missionNumber===m&&q.isActive).length===4)
 &&questions.every(q=>options.filter(o=>o.questionId===q.id).length===4)
 &&questions.every(q=>Number.isSafeInteger(q.id)&&q.id>0)
 &&options.every(o=>Number.isSafeInteger(o.id)&&o.id>0&&o.scorePayload!==null&&typeof o.scorePayload==='object'&&!Array.isArray(o.scorePayload)&&Object.keys(o.scorePayload).length>0&&Object.entries(o.scorePayload).every(([key,value])=>dimensions.includes(key as typeof dimensions[number])&&typeof value==='number'&&Number.isFinite(value)&&value>=0));
}
export function validateAnswers(input:unknown,catalog:Catalog):Record<string,number>{
 if(!input||typeof input!=='object'||Array.isArray(input)||!('answers' in input)||!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers))throw new InvalidAssessment('Respuestas inválidas.');
 const entries=Object.entries(input.answers);
 if(entries.length!==16||!validCatalog(catalog))throw new InvalidAssessment('Completa las 16 actividades con una respuesta por pregunta.');
 const ids=new Set<number>(),result:Record<string,number>={};
 for(const [key,value] of entries){
  if(!/^[1-9]\d*$/.test(key)||!Number.isSafeInteger(Number(key))||typeof value!=='number'||!Number.isSafeInteger(value)||ids.has(value))throw new InvalidAssessment('Identificadores de respuesta inválidos.');
  const question=catalog.questions.find(q=>q.id===Number(key));
  const option=catalog.options.find(o=>o.id===value&&o.questionId===question?.id);
  if(!question||!option)throw new InvalidAssessment('La opción no pertenece a la pregunta.');
  ids.add(value);result[key]=value;
 }
 return result;
}
export function calculateScores(answers:Record<string,number>,catalog:Catalog){
 const raw:Scores=Object.fromEntries(dimensions.map(d=>[d,0]));
 for(const id of Object.values(answers))for(const [dimension,score] of Object.entries(catalog.options.find(o=>o.id===id)!.scorePayload as Scores))raw[dimension]+=score;
 const caps:Scores={TECH:120,LOGIC:120,ARTISTIC:140,INVESTIGATIVE:140,ENTERPRISING:140,CONVENTIONAL:130,REALISTIC:130,SOCIAL:140};
 const normalized=Object.fromEntries(dimensions.map(d=>[d,Math.min(99,Math.max(0,Math.round(raw[d]/caps[d]*100)))]));
 return {raw,normalized};
}
export function rankCareers(raw:Scores,normalized:Scores,rules:Rule[]):Match[]{
 const totals=new Map<number,{weighted:number;weight:number;explanations:string[]}>();
 for(const rule of rules){
  const value=totals.get(rule.careerId)??{weighted:0,weight:0,explanations:[]};
  if((raw[rule.dimension]??0)>=rule.minScore){value.weighted+=(normalized[rule.dimension]??0)*rule.weight;value.explanations.push(rule.explanationTemplate);}
  value.weight+=rule.weight*100;totals.set(rule.careerId,value);
 }
 return [...totals].map(([careerId,t])=>({careerId,match:t.weight>0?Math.min(98,Math.round(t.weighted/t.weight*100)):0,explanations:t.explanations})).filter(r=>r.match>0).sort((a,b)=>b.match-a.match).slice(0,5);
}
