import {describe,it,expect} from 'vitest';
import {readRpgChoices,recordRpgChoice,rpgRiasec,rpgDialogues} from './plazaRpgDialogues';
import {rpgNpcs} from './plazaRpgNpcs';
describe('Plaza RPG conversations',()=>{
 it('keeps the first choice without accumulating points on repeat visits',()=>{
  const first=recordRpgChoice([],'mateo',0);const repeated=recordRpgChoice(first,'mateo',1);
  expect(repeated).toEqual(first);expect(rpgRiasec(repeated).A).toBe(3);
 });
 it('round-trips choices and rejects malformed values and unknown NPCs',()=>{
  const entries=recordRpgChoice([],'luis',2);expect(readRpgChoices(JSON.stringify(entries))).toEqual(entries);
  expect(readRpgChoices('[{"npcId":"mateo","choice":9},{"npcId":"unknown","choice":0}]')).toEqual([]);
  expect(readRpgChoices('broken')).toEqual([]);expect(recordRpgChoice([],'mateo',NaN)).toEqual([]);
 });
 it('has three complete choices, reactions, notes and configured weights for each approved NPC',()=>{
  for(const npc of rpgNpcs){const d=rpgDialogues[npc.id];expect(d.choices).toHaveLength(3);expect(d.reactions).toHaveLength(3);expect(d.notes).toHaveLength(3);expect(d.weights).toHaveLength(3);for(let i=0;i<3;i++){expect(d.notes[i].length).toBeGreaterThan(10);expect(d.reactions[i].length).toBeGreaterThan(10);}}
 });
 it('does not award negative or unwanted points for Mateo declining artistic activities',()=>{
  expect(rpgRiasec(recordRpgChoice([],'mateo',2,'legacy-v1'))).toEqual({R:0,I:0,A:0,S:0,E:0,C:0});
 });
});
