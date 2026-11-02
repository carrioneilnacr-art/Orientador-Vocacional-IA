import {calculateScores,rankCareers,validateAnswers,type Catalog,type Rule,type Match} from '../domain/assessment';
export type Career={id:number;slug:string;name:string;faculty:string|null;degree:string|null;match:number;justification:string;campuses:string[];cost:string};
export type SavedAssessment={testId:string;createdAt:string;dimensionScores:Record<string,number>;topCareers:Career[];saved:boolean};
export interface AssessmentRepository{
 loadCatalog():Promise<Catalog>;
 loadRules(source:Catalog['source']):Promise<Rule[]>;
 resolveCareers(matches:Match[],source:Catalog['source']):Promise<Career[]>;
 save(input:{testId:string;answers:Record<string,number>;dimensionScores:Record<string,number>;topCareers:Career[]}):Promise<boolean>;
}
export async function completeAssessment(input:unknown,repository:AssessmentRepository,identity:{id:()=>string;now:()=>Date}):Promise<SavedAssessment>{
 const catalog=await repository.loadCatalog();
 const answers=validateAnswers(input,catalog);
 const {raw,normalized}=calculateScores(answers,catalog);
 const matches=rankCareers(raw,normalized,await repository.loadRules(catalog.source));
 const topCareers=await repository.resolveCareers(matches,catalog.source);
 const testId=identity.id(),createdAt=identity.now().toISOString();
 const saved=await repository.save({testId,answers,dimensionScores:normalized,topCareers});
 return {testId,createdAt,dimensionScores:normalized,topCareers,saved};
}
