import {describe,expect,it} from 'vitest';
import {newJourney,readJourney,recordSchoolAnswer} from './adventureJourney';
import {rpgNpcs,allPlazaNpcsCompleted,plazaConversationPercent} from './plazaRpgNpcs';

describe('chapter gates and saved journey',()=>{
 it('requires every unique mandatory NPC, even when duplicates inflate the count',()=>{
  const ids=rpgNpcs.map(npc=>npc.id);
  for(let count=0;count<5;count++)expect(allPlazaNpcsCompleted(ids.slice(0,count))).toBe(false);
  expect(allPlazaNpcsCompleted(ids)).toBe(true);
  expect(allPlazaNpcsCompleted(Array(5).fill('mateo'))).toBe(false);
  expect(plazaConversationPercent(ids)).toBe(100);
  expect(plazaConversationPercent(['mateo','mateo','unknown'])).toBe(20);
 });
 it('restores the school chapter and answers only with a completed plaza',()=>{
  const saved=newJourney();saved.scene='colegio';saved.rpgEntries=rpgNpcs.map(npc=>({npcId:npc.id,choice:1}));saved.schoolAnswers={elena:0,sofia:2};
  expect(readJourney(JSON.stringify(saved))).toEqual(saved);
  saved.rpgEntries.pop();expect(readJourney(JSON.stringify(saved)).scene).toBe('plaza');
 });
 it('validates persisted answers and preserves first choice on repeat conversations',()=>{
  const first=recordSchoolAnswer({},'elena',1);
  expect(recordSchoolAnswer(first,'elena',2)).toEqual(first);
  const parsed=readJourney(JSON.stringify({...newJourney(),schoolAnswers:{elena:9,sofia:0}}));
  expect(parsed.schoolAnswers).toEqual({sofia:0});
  expect(readJourney('broken')).toEqual(newJourney());
 });
 it('migrates old evidence and creates an entirely clean reset',()=>{
  const migrated=readJourney(null,{progress:null,rpg:'[{"npcId":"mateo","choice":0}]',school:null});
  expect(migrated.rpgEntries).toHaveLength(1);
  const reset=newJourney();expect(readJourney(JSON.stringify(reset))).toEqual(reset);
  expect(reset.scene).toBe('plaza');expect(reset.schoolAnswers).toEqual({});expect(reset.rpgEntries).toEqual([]);
 });
});
