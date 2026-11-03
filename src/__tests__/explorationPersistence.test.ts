import {beforeEach,describe,expect,it,vi} from 'vitest';
import {drizzle} from 'drizzle-orm/postgres-js';
import {NextRequest,NextResponse} from 'next/server';
import {canReadExploration,type ExplorationRecord} from '@/modules/adventure/application/completeExploration';
import {plazaIds,activityIds,explorationInput,summarizeExploration} from '@/modules/adventure/domain/exploration';

const state=vi.hoisted(()=>({inserted:[] as unknown[],existing:[] as unknown[],reads:0,writes:0,identity:null as {id:string;schoolId:string}|null}));
vi.mock('@/db',()=>({db:{
 insert:()=>{state.writes++;return {values:()=>({onConflictDoNothing:()=>({returning:async()=>state.inserted})})};},
 select:()=>{state.reads++;return {from:()=>({where:()=>({limit:async()=>state.existing})})};},
}}));
vi.mock('@/lib/requestRateLimit',()=>({checkRequestRateLimit:async()=>({allowed:true,status:200}),quotaJson:(body:unknown,_quota:unknown,init?:ResponseInit)=>NextResponse.json(body,init)}));
vi.mock('@/modules/adventure/infrastructure/requestIdentity',()=>({
 adventureToken:()=> 'ADV-test',currentStudent:async()=>state.identity,
 ownsExploration:(record:ExplorationRecord,identity:{id:string;schoolId:string}|null)=>canReadExploration(record,identity),
}));
import {explorationRepository,explorationInsert} from '@/modules/adventure/infrastructure/drizzleExplorationRepository';
import {POST} from '@/app/api/aventura/resultado/route';

const valid=()=>explorationInput.parse({version:1,rpgEntries:plazaIds.map(npcId=>({npcId,choice:0})),schoolEntries:activityIds.map(activityId=>({version:1,chapterId:'colegio',activityId,preference:'more',performance:{attempts:1,solved:true},choices:[0],completedAt:'2026-11-02T15:00:00.000Z'})),schoolAnswers:{elena:1}});
const record=():ExplorationRecord=>({token:'ADV-test',studentId:null,schoolId:null,input:valid(),result:summarizeExploration(valid(),'2026-11-02T15:00:00.000Z')});
const row=(overrides:Record<string,unknown>={})=>({sessionToken:'ADV-test',studentId:null,schoolId:null,answersPayload:valid(),profileResult:record().result,createdAt:new Date('2026-11-02T15:00:00.000Z'),expiresAt:new Date(Date.now()+86400000),...overrides});
const request=()=>new NextRequest('https://school.example/api/aventura/resultado',{method:'POST',headers:{Origin:'https://school.example','Content-Type':'application/json'},body:JSON.stringify(valid())});
beforeEach(()=>{state.inserted=[];state.existing=[];state.reads=0;state.writes=0;state.identity=null;});
describe('Immutable exploration persistence round trips',()=>{
 it('uses a single INSERT RETURNING for a newly saved result, with no preliminary or trailing SELECT',async()=>{
  state.inserted=[row()];
  const response=await POST(request());
  expect(response.status).toBe(200);
  expect((await response.json()).result.kind).toBe('adventure-exploration');
  expect(state.writes).toBe(1);expect(state.reads).toBe(0);
 });
 it('replays the original stored evidence on conflict with just one fallback read',async()=>{
  const old=valid();old.rpgEntries[0].choice=2;
  state.existing=[row({answersPayload:old})];
  const saved=await explorationRepository.saveOnce(record());
  expect(saved.input.rpgEntries[0].choice).toBe(2);
  expect(state.writes).toBe(1);expect(state.reads).toBe(1);
 });
 it('returns403 for an existing record owned by a different student or school without mutating it',async()=>{
  state.identity={id:'other-student',schoolId:'other-school'};
  const stored=row({studentId:'original-student',schoolId:'original-school'});
  state.existing=[stored];
  const response=await POST(request());
  expect(response.status).toBe(403);
  expect(state.existing).toEqual([stored]);
  expect(state.writes).toBe(1);expect(state.reads).toBe(1);
 });
 it('rejects expired or malformed stored records rather than accepting a new replacement',async()=>{
  state.existing=[row({expiresAt:new Date(0)})];
  await expect(explorationRepository.saveOnce(record())).rejects.toThrow('persistence unavailable');
  state.existing=[row({answersPayload:{version:1}})];
  await expect(explorationRepository.saveOnce(record())).rejects.toThrow('persistence unavailable');
 });
 it('generates an INSERT DO NOTHING RETURNING, never a conflict UPDATE',()=>{
  const query=explorationInsert(drizzle.mock(),record()).toSQL();
  expect(query.sql).toContain('on conflict ("session_token") do nothing returning');
  expect(query.sql).not.toContain('do update');
  expect(query.sql).not.toMatch(/^update /);
 });
});
