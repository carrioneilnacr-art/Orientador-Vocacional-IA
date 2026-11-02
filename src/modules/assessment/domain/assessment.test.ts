import {describe,expect,it,vi} from 'vitest';
import {VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS,VERIFIED_RULES} from '@/data/questionnaireData';
import {calculateScores,rankCareers,validateAnswers,validCatalog,InvalidAssessment,type Catalog} from './assessment';
import {completeAssessment,type AssessmentRepository} from '../application/completeAssessment';
const catalog:Catalog={questions:VERIFIED_16_QUESTIONS,options:VERIFIED_64_OPTIONS,source:'verified-local'};
const answers=Object.fromEntries(catalog.questions.map(q=>[q.id,catalog.options.find(o=>o.questionId===q.id)!.id]));
describe('Assessment domain',()=>{
 it('accepts all sixteen answers bound to their own questions',()=>{
  expect(validCatalog(catalog)).toBe(true);expect(validateAnswers({answers},catalog)).toEqual(answers);
 });
 it('rejects incomplete, invented, repeated and cross-question answers',()=>{
  const [first,second]=catalog.questions;
  const incomplete={...answers};delete incomplete[first.id];
  for(const bad of [null,[],{}, {answers:[]},{answers:incomplete},{answers:{...answers,[first.id]:answers[second.id]}},{answers:{...answers,99999:1}},{answers:{...answers,[first.id]:'1'}}])expect(()=>validateAnswers(bad,catalog)).toThrow(InvalidAssessment);
 });
 it('rejects catalogs with missing missions, options, invalid dimensions or nonfinite scores',()=>{
  expect(validCatalog({...catalog,options:catalog.options.slice(1)})).toBe(false);
  expect(validCatalog({...catalog,questions:catalog.questions.map(q=>({...q,missionNumber:1}))})).toBe(false);
  for(const scorePayload of [{ALIEN:3},{SOCIAL:NaN},{}])expect(validCatalog({...catalog,options:catalog.options.map((o,i)=>i?o:{...o,scorePayload})})).toBe(false);
 });
 it('preserves legacy arithmetic, thresholds and ranking for valid answers',()=>{
  const {raw,normalized}=calculateScores(answers,catalog);
  const expected:Record<string,number>={};
  for(const id of Object.values(answers))for(const [key,value] of Object.entries(catalog.options.find(o=>o.id===id)!.scorePayload as Record<string,number>))expected[key]=(expected[key]??0)+value;
  for(const [key,value] of Object.entries(expected))expect(raw[key]).toBe(value);
  expect(normalized.TECH).toBe(Math.min(99,Math.round(raw.TECH/120*100)));
  const ranked=rankCareers(raw,normalized,VERIFIED_RULES);expect(ranked.length).toBeGreaterThan(0);expect(ranked.length).toBeLessThanOrEqual(5);
  expect(ranked.every((r,i)=>r.match<=98&&(!i||ranked[i-1].match>=r.match))).toBe(true);
 });
 it('application validates before saving and uses injected repository and identity',async()=>{
  const save=vi.fn().mockResolvedValue(true);
  const repository:AssessmentRepository={loadCatalog:async()=>catalog,loadRules:async()=>VERIFIED_RULES,resolveCareers:async()=>[],save};
  const identity={id:()=> 'test-fixture',now:()=>new Date('2026-11-02T00:00:00Z')};
  await expect(completeAssessment({answers:{}},repository,identity)).rejects.toThrow(InvalidAssessment);expect(save).not.toHaveBeenCalled();
  const result=await completeAssessment({answers},repository,identity);expect(result.testId).toBe('test-fixture');expect(result.saved).toBe(true);expect(save).toHaveBeenCalledOnce();
 });
});
