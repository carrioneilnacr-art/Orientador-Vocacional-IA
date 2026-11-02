export function mayReadIndividualExplorations(role:string):boolean{
 return role==='ADMIN'||role==='PSICOLOGO';
}
