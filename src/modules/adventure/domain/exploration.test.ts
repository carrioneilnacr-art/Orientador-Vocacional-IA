import {describe,it,expect} from 'vitest';
import {explorationInput,plazaIds,activityIds,summarizeExploration,explorationResultSchema} from './exploration';
import {completeExploration,canReadExploration,type ExplorationRecord,type ExplorationRepository} from '../application/completeExploration';
const valid=()=>({version:1 as const,rpgEntries:plazaIds.map(npcId=>({npcId,choice:0})),schoolEntries:activityIds.map(activityId=>({version:1 as const,chapterId:'colegio' as const,activityId,preference:'more' as const,performance:{attempts:1,solved:true},choices:[0],completedAt:'2026-11-02T15:00:00.000Z'})),schoolAnswers:{elena:1}});
describe('Adventure exploration evidence',()=>{
 it('requires the current student and school for a linked record',()=>{
  const record={studentId:'student-1',schoolId:'school-1'};
  expect(canReadExploration(record,null)).toBe(false);
  expect(canReadExploration(record,{id:'student-2',schoolId:'school-1'})).toBe(false);
  expect(canReadExploration(record,{id:'student-1',schoolId:'school-2'})).toBe(false);
  expect(canReadExploration(record,{id:'student-1',schoolId:'school-1'})).toBe(true);
  expect(canReadExploration({studentId:null,schoolId:'school-1'},null)).toBe(false);
 });
 it('rejects incomplete, duplicate, unknown and extra scored inputs',()=>{
  const data=valid();expect(explorationInput.safeParse(data).success).toBe(true);
  expect(explorationInput.safeParse({...data,rpgEntries:data.rpgEntries.slice(1)}).success).toBe(false);
  expect(explorationInput.safeParse({...data,rpgEntries:Array(5).fill(data.rpgEntries[0])}).success).toBe(false);
  expect(explorationInput.safeParse({...data,schoolEntries:Array(3).fill(data.schoolEntries[0])}).success).toBe(false);
  expect(explorationInput.safeParse({...data,score:99}).success).toBe(false);
  expect(explorationInput.safeParse({...data,rpgEntries:[...data.rpgEntries.slice(1),{npcId:'unknown',choice:0}]}).success).toBe(false);
 });
 it('records declared preferences without treating skill performance as interests',()=>{
  const input=explorationInput.parse(valid());const result=summarizeExploration(input,'2026-11-02T15:00:00.000Z');
  const other=explorationInput.parse(valid());other.schoolEntries.forEach(entry=>{entry.performance={attempts:999,solved:false};});
  expect(summarizeExploration(other,result.createdAt)).toEqual(result);
  expect(result).not.toHaveProperty('dimensionScores');expect(result).not.toHaveProperty('topCareers');
  expect(explorationResultSchema.safeParse(result).success).toBe(true);
 });
 it('supports immutable idempotent submission through its repository port',async()=>{
  const records=new Map<string,ExplorationRecord>();
  const repository:ExplorationRepository={async find(token){return records.get(token)??null;},async saveOnce(record){const stored=records.get(record.token)??record;records.set(record.token,stored);return stored;}};
  const identity={token:'ADV-test',studentId:null,schoolId:null};
  const first=await completeExploration(valid(),identity,repository,()=>new Date('2026-11-02T15:00:00.000Z'));
  const changed=valid();changed.rpgEntries[0].choice=2;
  expect(await completeExploration(changed,identity,repository)).toEqual(first);expect(records.size).toBe(1);
  await expect(completeExploration({},identity,repository)).rejects.toThrow();expect(records.size).toBe(1);
 });
});
