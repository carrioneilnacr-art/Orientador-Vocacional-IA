import {mayReadIndividualExplorations} from '../domain/explorationAccess';
export type SchoolExploration={id:string;studentName:string;createdAt:string;notes:{label:string;text:string}[]};
export interface SchoolExplorationReader{list(schoolId:string,before?:Date):Promise<SchoolExploration[]>}
export async function listExplorations(reader:SchoolExplorationReader,identity:{schoolId:string;role:string},before?:Date){
 if(!mayReadIndividualExplorations(identity.role))throw new Error('FORBIDDEN');
 return reader.list(identity.schoolId,before);
}
