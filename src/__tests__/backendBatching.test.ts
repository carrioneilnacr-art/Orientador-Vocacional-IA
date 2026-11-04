import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {PgDialect} from 'drizzle-orm/pg-core';
import type {SQL} from 'drizzle-orm';

const probe=vi.hoisted(()=>({rows:[] as (unknown[]|Error)[],queries:0,filters:[] as SQL[],orders:[] as SQL[]}));
vi.mock('@/db',()=>({db:{select:()=>{
 probe.queries++;
 const rows=probe.rows.shift()??[];
 const builder={
  from:()=>builder,innerJoin:()=>builder,orderBy:(...orders:SQL[])=>{probe.orders.push(...orders);return builder;},limit:()=>builder,
  where:(condition:SQL)=>{probe.filters.push(condition);return builder;},
  then:(resolve:(value:unknown[])=>unknown,reject?:(error:unknown)=>unknown)=>
   (rows instanceof Error?Promise.reject(rows):Promise.resolve(rows)).then(resolve,reject),
 };
 return builder;
}}}));

import {fetchCareerContext} from '@/modules/chaski-ai/infrastructure/careerContext';
import {assessmentRepository} from '@/modules/assessment/infrastructure/assessmentRepository';
import {VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS} from '@/data/questionnaireData';
const career=(id:number)=>({id,name:`Carrera ${id}`,slug:`carrera-${id}`,faculty:'Facultad',degree:'Grado',generalProfile:'Perfil registrado'});
const offer=(careerId:number,institutionId:number)=>({offerId:careerId*10+institutionId,careerId,institutionId,institutionShort:`U${institutionId}`,institutionName:`Universidad ${institutionId}`,campusName:'Los Olivos',district:'Los Olivos',sourceUrl:`https://official.example/offer-${careerId}-${institutionId}`});
const sqlFilters=()=>probe.filters.map(filter=>new PgDialect().sqlToQuery(filter).sql).join('\n');
beforeEach(()=>{probe.rows=[];probe.queries=0;probe.filters=[];probe.orders=[];});
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();});

describe('Batched verified chat context',()=>{
 it('prefers an accent-normalized full career name over broad engineering matches',async()=>{
  const selected={...career(3),name:'Ingeniería de Software'};
  probe.rows=[[{...career(1),name:'Ingeniería Civil'},{...career(2),name:'Ingeniería Industrial'},selected],[offer(3,1)],[],[]];
  const result=await fetchCareerContext('Quiero conocer ingeniería de software');
  expect(result).toContain('CARRERA: Ingeniería de Software');expect(result).not.toContain('CARRERA: Ingeniería Civil');expect(result).not.toContain('CARRERA: Ingeniería Industrial');
  const filter=probe.filters.map(value=>new PgDialect().sqlToQuery(value)).find(value=>value.sql.includes('academic_offers'))!;
  expect(filter.params).toContain(3);expect(filter.params).not.toContain(1);expect(filter.params).not.toContain(2);
  const ranked=new PgDialect().sqlToQuery(probe.orders[0]);expect(ranked.sql).toContain('case when');expect(ranked.sql).toContain('position(');expect(ranked.sql).toContain('desc');
 });
 it('preserves both explicitly named comparisons and compresses repeated URLs without dropping sixteen courses',async()=>{
  const shared='https://official.example.edu.pe/documentos/academicos/mallas-curriculares/verificadas/2026/curricula-completa-ingresantes-2026-actualizacion-oficial.pdf';
  const selected=[{...career(31),name:'Medicina Humana'},{...career(32),name:'Arquitectura'}];
  const offers=[offer(31,1),offer(31,2),offer(32,1),offer(32,2)].map(value=>({...value,sourceUrl:shared}));
  const curricula=[{id:3101,offerId:311},{id:3102,offerId:312},{id:3201,offerId:321},{id:3202,offerId:322}];
  probe.rows=[[...selected,{...career(33),name:'Ingeniería Civil'}],offers,curricula,curricula.flatMap(value=>Array.from({length:16},(_,index)=>({curriculumId:value.id,name:`Curso-${value.id}-${index}`,cycle:index+1,sourceUrl:shared})))];
  const result=await fetchCareerContext('Comparar medicina humana y arquitectura');
  expect(result).toContain('CARRERA: Medicina Humana');expect(result).toContain('CARRERA: Arquitectura');expect(result).not.toContain('CARRERA: Ingeniería Civil');
  expect(result.match(/Curso-\d+-\d+/g)).toHaveLength(64);expect(result.match(/fuente: F1/g)).toHaveLength(68);
  expect(result.split(shared)).toHaveLength(2);expect(result).toContain(`F1: ${shared}`);
  const expanded=result.split('FUENTES OFICIALES (')[0].replace(/\bF1\b/g,shared)+'=========================================================================\n';
  const oldBytes=Buffer.byteLength(expanded),newBytes=Buffer.byteLength(result);
  expect(newBytes).toBeLessThan(oldBytes);
  console.info('[Context provenance fixture bytes]',{expandedUrlBytes:oldBytes,dictionaryBytes:newBytes,reductionPercent:Number(((1-newBytes/oldBytes)*100).toFixed(2))});
 });
 it('coalesces forty normalized career queries into one verified four-read batch',async()=>{
  probe.rows=[[career(1)],[offer(1,1)],[{id:101,offerId:11}],[{curriculumId:101,name:'Curso oficial',cycle:1,sourceUrl:'https://official.example/course'}]];
  const results=await Promise.all(Array.from({length:40},(_,i)=>fetchCareerContext(i%2?'Derecho administración':'DERECHO ADMINISTRACIÓN!')));
  expect(probe.queries).toBe(4);expect(new Set(results).size).toBe(1);expect(results[0]).toContain('https://official.example/course');
 });
 it('caches successful no-match responses but never a database failure',async()=>{
  vi.spyOn(console,'error').mockImplementation(()=>{});
  probe.rows=[[],new Error('offline'),[]];
  expect(await fetchCareerContext('intereses vocacionales')).toBe('');
  expect(await fetchCareerContext('INTERESES VOCACIONALES!')).toBe('');expect(probe.queries).toBe(1);
  await expect(fetchCareerContext('contabilidad')).rejects.toThrow('VERIFIED_CATALOG_UNAVAILABLE');
  expect(await fetchCareerContext('contabilidad')).toBe('');expect(probe.queries).toBe(3);
 });
 it('expires cached context after30seconds and never reuses yesterday source validity',async()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-03T23:59:20Z'));
  probe.rows=[[],[],[]];
  await fetchCareerContext('economia');await fetchCareerContext('economia');expect(probe.queries).toBe(1);
  vi.setSystemTime(new Date('2026-11-03T23:59:51Z'));await fetchCareerContext('economia');expect(probe.queries).toBe(2);
  vi.setSystemTime(new Date('2026-11-04T00:00:01Z'));await fetchCareerContext('economia');expect(probe.queries).toBe(3);
 });
 it('resolves two careers and two institutions each in four reads, without mixing curricula',async()=>{
  probe.rows=[
   [career(1),career(2)],
   [offer(1,1),offer(1,2),offer(2,1),offer(2,2)],
   [{id:101,offerId:11},{id:102,offerId:12},{id:201,offerId:21},{id:202,offerId:22}],
   [101,102,201,202].flatMap(curriculumId=>Array.from({length:18},(_,i)=>({curriculumId,name:`Curso-${curriculumId}-${i}`,cycle:i+1,sourceUrl:`https://official.example/course-${curriculumId}`}))),
  ];
  const result=await fetchCareerContext('Comparar arquitectura medicina');
  expect(probe.queries).toBe(4); // Previously 1 search + 2 offers + 4 curricula + 4 courses = 11.
  expect((11-probe.queries)/11).toBeGreaterThan(.6);
  const [first,second]=result.split('CARRERA: Carrera 2');
  expect(first).toContain('Curso-101-15');expect(first).not.toContain('Curso-101-16');
  expect(first).not.toContain('Curso-201');expect(second).toContain('Curso-201-0');
  expect(result).toContain('https://official.example/offer-1-1');
  expect(result).toContain('https://official.example/course-101');
  const filters=sqlFilters();
  expect(filters.match(/"sources"\."valid_until"/g)?.length).toBeGreaterThanOrEqual(6);
  expect(filters).toContain('"curricula"."is_current"');
 });
 it('skips empty search terms and uses only one read for unmatched terms without substituting an unrelated career',async()=>{
  expect(await fetchCareerContext('hola')).toBe('');
  expect(probe.queries).toBe(0);
  probe.queries=0;
  expect(await fetchCareerContext('que hay para estudiar')).toBe('');
  expect(probe.queries).toBe(0);
  expect(await fetchCareerContext('ingenieria inexistente')).toBe('');
  expect(probe.queries).toBe(1);
 });
 it('never publishes career facts when verified offers are missing',async()=>{
  probe.rows=[[career(1)],[]];
  const result=await fetchCareerContext('arquitectura');
  expect(result).toBe('Información no disponible actualmente en nuestras fuentes oficiales registradas.');
  expect(probe.queries).toBe(2);
 });
});

describe('Batched assessment career resolution',()=>{
 it('singleflights forty catalog reads and returns independent verified database snapshots',async()=>{
  probe.rows=[VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS];
  const catalogs=await Promise.all(Array.from({length:40},()=>assessmentRepository.loadCatalog()));
  expect(probe.queries).toBe(2);expect(catalogs.every(catalog=>catalog.source==='database')).toBe(true);
  expect(catalogs[0]).not.toBe(catalogs[1]);expect(catalogs[0].questions).not.toBe(catalogs[1].questions);
 });
 it('never caches fallback catalogs and refreshes verified database snapshots after expiry',async()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  probe.rows=[new Error('offline'),new Error('offline'),VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS,VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS];
  expect((await assessmentRepository.loadCatalog()).source).toBe('verified-local');
  expect((await assessmentRepository.loadCatalog()).source).toBe('verified-local');expect(probe.queries).toBe(2);
  expect((await assessmentRepository.loadCatalog()).source).toBe('database');expect(probe.queries).toBe(4);
  await assessmentRepository.loadCatalog();expect(probe.queries).toBe(4);
  vi.setSystemTime(new Date('2030-01-01T00:00:31Z'));await assessmentRepository.loadCatalog();expect(probe.queries).toBe(6);
 });
 it('uses three reads for five recommendations and preserves ranking and campus preference',async()=>{
  const matches=[5,4,3,2,1].map(careerId=>({careerId,match:90,explanations:['Afinidad registrada']}));
  probe.rows=[
   [1,2,3,4,5].map(career),
   [1,2,3,4,5].flatMap(careerId=>[{id:careerId*10,careerId,institutionShort:'U',campusName:'Sur',district:'Surco'},{id:careerId*10+1,careerId,institutionShort:'U',campusName:'Norte',district:'Comas'}]),
   [1,2,3,4,5].map(careerId=>({offerId:careerId*10,amount:`${careerId}00.00`,currency:'PEN'})),
  ];
  const results=await assessmentRepository.resolveCareers(matches,'database');
  expect(probe.queries).toBe(3); // Previously up to 4 reads per career = 20.
  expect((20-probe.queries)/20).toBe(.85);
  expect(results.map(result=>result.id)).toEqual([5,4,3,2,1]);
  expect(results[0].campuses).toEqual(['U (Norte)','U (Sur)']);
  expect(results[0].cost).toBe('PEN 500.00');
  const filters=sqlFilters();
  expect(filters).toContain('"sources"."valid_until"');
  expect(filters).toContain('"tuition_fees"."valid_from"');
  expect(filters).toContain('"tuition_fees"."valid_until"');
 });
 it('returns unavailable costs and omits unknown database IDs, without local fallback',async()=>{
  probe.rows=[[career(1)],[],[]];
  const results=await assessmentRepository.resolveCareers([{careerId:1,match:80,explanations:[]},{careerId:999,match:70,explanations:[]}],'database');
  expect(results).toHaveLength(1);
  expect(results[0].cost).toBe('Información no disponible actualmente en nuestras fuentes oficiales registradas.');
  expect(results[0].campuses).toEqual([]);
  expect(probe.queries).toBe(2);
 });
 it('does not query the database for empty results or the verified-local catalog',async()=>{
  expect(await assessmentRepository.resolveCareers([],'database')).toEqual([]);
  await assessmentRepository.resolveCareers([{careerId:999999,match:80,explanations:[]}],'verified-local');
  expect(probe.queries).toBe(0);
 });
});
