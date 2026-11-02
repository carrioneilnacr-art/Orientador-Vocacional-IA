import {describe,it,expect} from 'vitest';
import {explorationInput,summarizeExploration,plazaIds,activityIds} from './exploration';
import {getPlazaDialogue,getSchoolDialogue} from './narrativeContent';
import {reviewLabConclusion,reviewTechRepair} from './schoolChallengeContent';
describe('versioned adventure content',()=>{
 it('keeps historical meaning and uses the same new note as the client',()=>{
 const raw={version:1,rpgEntries:plazaIds.map(npcId=>({npcId,choice:0})),schoolEntries:activityIds.map(activityId=>({version:1,chapterId:'colegio',activityId,preference:'more',performance:{attempts:1,solved:false},choices:[0],completedAt:'2026-11-02T15:00:00.000Z'})),schoolAnswers:{sofia:0}};
 const old=explorationInput.parse(raw);const date='2026-11-02T15:00:00.000Z';
 expect(summarizeExploration(old,date).notes[0].text).toBe(getPlazaDialogue('mateo','legacy-v1').notes[0]);
 const fresh=explorationInput.parse({...raw,rpgEntries:raw.rpgEntries.map(e=>({...e,contentVersion:'adventure-v2'})),schoolContentVersions:{sofia:'adventure-v2'}});
 expect(summarizeExploration(fresh,date).notes[0].text).toBe(getPlazaDialogue('mateo','adventure-v2').notes[0]);
 expect(summarizeExploration(fresh,date).notes.at(-1)?.text).toBe(getSchoolDialogue('sofia','adventure-v2').notes[0]);
 expect(summarizeExploration(old,date).notes[0]).not.toEqual(summarizeExploration(fresh,date).notes[0]);
 expect(explorationInput.safeParse({...raw,rpgEntries:[{...raw.rpgEntries[0],contentVersion:'invented'},...raw.rpgEntries.slice(1)]}).success).toBe(false);
 });
 it('requires controlled evidence and both signal faults to be resolved',()=>{
 expect(reviewLabConclusion(0,0).solved).toBe(true);expect(reviewLabConclusion(1,0).solved).toBe(false);expect(reviewLabConclusion(0,1).solved).toBe(false);
 expect(reviewTechRepair(1,2).solved).toBe(true);expect(reviewTechRepair(1,0).connected).toBe(false);expect(reviewTechRepair(1,1).connected).toBe(false);expect(reviewTechRepair(0,2).solved).toBe(false);
 });
});
