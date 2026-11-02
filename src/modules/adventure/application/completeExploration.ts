import {explorationInput,summarizeExploration,type ExplorationInput,type ExplorationResult} from '../domain/exploration';
export type ExplorationRecord={token:string;studentId:string|null;schoolId:string|null;result:ExplorationResult;input:ExplorationInput};
export interface ExplorationRepository{
 saveOnce(record:ExplorationRecord):Promise<ExplorationRecord>;
 find(token:string):Promise<ExplorationRecord|null>;
}
export function canReadExploration(record:Pick<ExplorationRecord,'studentId'|'schoolId'>,student:{id:string;schoolId:string}|null){
 return record.studentId===null&&record.schoolId===null||!!student&&student.id===record.studentId&&student.schoolId===record.schoolId;
}
export async function completeExploration(raw:unknown,identity:{token:string;studentId:string|null;schoolId:string|null},repository:ExplorationRepository,now:()=>Date=()=>new Date()){
 const input=explorationInput.parse(raw);
 return repository.saveOnce({...identity,input,result:summarizeExploration(input,now().toISOString())});
}
