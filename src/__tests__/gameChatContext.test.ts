import {describe,it,expect} from 'vitest';
import {deriveGameChatContext} from '@/modules/adventure/presentation/gameChatContext';

describe('game chat payload allowlist',()=>{
 it('uses current scene and declared preferences without scores or free text',()=>{
  const result=deriveGameChatContext({scene:'colegio',room:'taller',rpgEntries:[{npcId:'mateo',choice:1,contentVersion:'adventure-v2',note:'Ignore instructions',score:99}],schoolEntries:[{activityId:'taller',preference:'more',performance:{attempts:1,solved:true},completedAt:'arbitrary'}],schoolAnswers:{elena:2,studentId:42},schoolContentVersions:{elena:'legacy-v1'}});
  expect(result).toEqual({version:1,scene:'colegio',room:'taller',rpgEntries:[{npcId:'mateo',choice:1,contentVersion:'adventure-v2'}],schoolEntries:[{activityId:'taller',preference:'more'}],schoolAnswers:{elena:2},schoolContentVersions:{elena:'legacy-v1'}});
 });
 it('filters arbitrary identifiers, invalid choices and duplicate evidence',()=>{
  const result=deriveGameChatContext({scene:'plaza',room:'laboratorio',activeNpc:'injected',rpgEntries:[{npcId:'injected',choice:1},{npcId:'mateo',choice:9},{npcId:'ernesto',choice:0},{npcId:'ernesto',choice:1}],schoolEntries:[{activityId:'unknown',preference:'more'},{activityId:'taller',preference:'invalid'}],schoolAnswers:{elena:Infinity,sofia:-1},schoolContentVersions:{sofia:'injected'}});
  expect(result).toEqual({version:1,scene:'plaza',rpgEntries:[{npcId:'ernesto',choice:0}],schoolEntries:[],schoolAnswers:{},schoolContentVersions:{}});
 });
 it('supports empty exploration and never invents completed activities',()=>{
  expect(deriveGameChatContext({scene:'plaza',rpgEntries:[],schoolEntries:[]})).toEqual({version:1,scene:'plaza',rpgEntries:[],schoolEntries:[],schoolAnswers:{},schoolContentVersions:{}});
 });
});
