import {describe,expect,it} from 'vitest';
import {readSchoolEvidence,recordSchoolEvidence,type SchoolEvidence} from './schoolActivities';

const entry:SchoolEvidence={version:1,chapterId:'colegio',activityId:'laboratorio',preference:'more',performance:{attempts:2,solved:false},choices:[0,1,2,0],completedAt:'2026-11-01T12:00:00.000Z'};
describe('evidencia de actividades escolares',()=>{
 it('mantiene el interés separado de la resolución del reto',()=>{
  const stored=readSchoolEvidence(JSON.stringify([entry]));
  expect(stored[0].preference).toBe('more');expect(stored[0].performance.solved).toBe(false);
 });
 it('repetir una actividad actualiza una sola entrada',()=>{
  const first=recordSchoolEvidence([],entry);
  const replay=recordSchoolEvidence(first,{...entry,preference:'unsure',performance:{attempts:1,solved:true}});
  expect(replay).toHaveLength(1);expect(replay[0].preference).toBe('unsure');
 });
 it('recupera las elecciones y rechaza guardados malformados',()=>{
  expect(readSchoolEvidence(JSON.stringify([entry]))).toEqual([entry]);
  expect(readSchoolEvidence('{broken')).toEqual([]);
  expect(readSchoolEvidence(JSON.stringify([{...entry,activityId:'otra'}]))).toEqual([]);
 });
});
