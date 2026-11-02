import {describe,expect,it} from 'vitest';
import {listExplorations} from '../application/listExplorations';
describe('institutional exploration access',()=>{
 it('denies individual responses to roles without that permission before querying data',async()=>{
  let called=false;const reader={list:async()=>{called=true;return [];}};
  for(const role of ['TUTOR','DIRECTOR','unknown'])await expect(listExplorations(reader,{schoolId:'a',role})).rejects.toThrow('FORBIDDEN');
  expect(called).toBe(false);
 });
 it('uses the school from the verified identity',async()=>{
  let scoped='';await listExplorations({list:async(id)=>{scoped=id;return [];}},{schoolId:'school-a',role:'PSICOLOGO'});expect(scoped).toBe('school-a');
 });
});
