import {db} from '@/db';
import {questionnaireQuestions,questionnaireOptions,vocationalRules,careers,academicOffers,campuses,institutions,tuitionFees,userSessions,sources} from '@/db/schema';
import {and,asc,eq,gte,inArray,isNull,lte,or} from 'drizzle-orm';
import {VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS,VERIFIED_CAREERS,VERIFIED_RULES} from '@/data/questionnaireData';
import {validCatalog,type Catalog} from '../domain/assessment';
import type {AssessmentRepository, Career} from '../application/completeAssessment';
import {createPublicReadCache} from '@/lib/publicReadCache';

const UNAVAILABLE='Información no disponible actualmente en nuestras fuentes oficiales registradas.';
const NORTH_DISTRICTS=new Set(['los olivos','comas','independencia','san martín de porres','san martin de porres','puente piedra','carabayllo']);
const catalogCache=createPublicReadCache<Catalog>({maxEntries:1,ttlMs:30000,cacheable:catalog=>catalog.source==='database'&&validCatalog(catalog)});

export const assessmentRepository:AssessmentRepository={
 async loadCatalog(){
  const catalog=await catalogCache.read('questionnaire-catalog',async()=>{
  try{
   const questions=await db.select().from(questionnaireQuestions).where(eq(questionnaireQuestions.isActive,true)).orderBy(questionnaireQuestions.orderNumber);
   const ids=questions.map(question=>question.id);
   const options=ids.length ? await db.select().from(questionnaireOptions).where(inArray(questionnaireOptions.questionId,ids)).orderBy(questionnaireOptions.questionId) : [];
   const catalog:Catalog={questions,options,source:'database'};
   if(validCatalog(catalog))return catalog;
  }catch{ /* A failed database read uses the entire verified catalog. */ }
  return {questions:VERIFIED_16_QUESTIONS,options:VERIFIED_64_OPTIONS,source:'verified-local'};
  });
  // Public snapshot is copied so a caller cannot mutate another request's data.
  return structuredClone(catalog);
 },
 async loadRules(source){
  if(source==='verified-local')return VERIFIED_RULES;
  return (await db.select().from(vocationalRules)).map(r=>({careerId:Number(r.careerId),dimension:r.dimension,weight:Number(r.weight),minScore:Number(r.minScore),explanationTemplate:r.explanationTemplate}));
 },
 async resolveCareers(matches,source){
  if(!matches.length)return [];
  if(source==='verified-local')return matches.flatMap(result=>{
   const career=VERIFIED_CAREERS.find(item=>item.id===result.careerId);
   return career ? [{id:career.id,slug:career.slug,name:career.name,faculty:career.faculty,degree:career.degree,match:result.match,justification:result.explanations.slice(0,2).join(' '),campuses:career.campuses,cost:career.cost}] : [];
  });
  try{
   const ids=[...new Set(matches.map(match=>match.careerId))];
   const today=new Date().toISOString().slice(0,10);
   // Three reads for the whole result set, replacing up to four per career.
   const [careerRows,offers]=await Promise.all([
    db.select().from(careers).where(inArray(careers.id,ids)),
    db.select({id:academicOffers.id,careerId:academicOffers.careerId,institutionShort:institutions.shortName,campusName:campuses.name,district:campuses.district})
     .from(academicOffers).innerJoin(campuses,eq(academicOffers.campusId,campuses.id))
     .innerJoin(institutions,eq(academicOffers.institutionId,institutions.id))
     .innerJoin(sources,eq(academicOffers.sourceId,sources.id))
     .where(and(inArray(academicOffers.careerId,ids),or(isNull(sources.validUntil),gte(sources.validUntil,today))))
     .orderBy(asc(academicOffers.id)),
   ]);
   const firstOffers=new Map<number,number>();
   for(const offer of offers)if(!firstOffers.has(offer.careerId))firstOffers.set(offer.careerId,offer.id);
   const feeRows=firstOffers.size ? await db.select({offerId:tuitionFees.academicOfferId,amount:tuitionFees.amount,currency:tuitionFees.currency})
    .from(tuitionFees).innerJoin(sources,eq(tuitionFees.sourceId,sources.id))
    .where(and(inArray(tuitionFees.academicOfferId,[...firstOffers.values()]),or(isNull(sources.validUntil),gte(sources.validUntil,today)),or(isNull(tuitionFees.validUntil),gte(tuitionFees.validUntil,today)),or(isNull(tuitionFees.validFrom),lte(tuitionFees.validFrom,today))))
    .orderBy(asc(tuitionFees.id)) : [];
   const careerById=new Map(careerRows.map(career=>[career.id,career]));
   return matches.flatMap((result):Career[]=>{
    const career=careerById.get(result.careerId);
    if(!career)return [];
    const careerOffers=offers.filter(offer=>offer.careerId===career.id);
    const north:string[]=[],other:string[]=[];
    for(const offer of careerOffers){
     const target=NORTH_DISTRICTS.has(offer.district.toLowerCase())||/norte|comas|olivos/.test(offer.campusName.toLowerCase())?north:other;
     const label=`${offer.institutionShort} (${offer.campusName})`;
     if(!target.includes(label))target.push(label);
    }
    const fees=feeRows.filter(fee=>fee.offerId===firstOffers.get(career.id)).slice(0,2);
    return [{id:career.id,slug:career.slug,name:career.name,faculty:career.faculty,degree:career.degree,match:result.match,justification:result.explanations.slice(0,2).join(' '),campuses:[...north,...other].slice(0,8),cost:fees.length?fees.map(fee=>`${fee.currency} ${fee.amount}`).join(' - '):UNAVAILABLE}];
   });
  }catch{
   console.error('[Assessment] Verified career lookup unavailable');
   // Database rule IDs must never resolve against the unrelated local catalog.
   return [];
  }
 },
 async save({testId,answers,dimensionScores,topCareers}){
  try{
   const dominantDimension=Object.entries(dimensionScores).sort(([,a],[,b])=>b-a)[0]?.[0]??'LOGIC';
   await db.insert(userSessions).values({sessionToken:testId,answersPayload:answers,profileResult:{dominantDimension,dimensionScores,assessmentVersion:'questionnaire-v1'},recommendedCareerIds:topCareers.map(c=>c.id),expiresAt:new Date(Date.now()+365*24*60*60*1000)});
   return true;
  }catch{return false;}
 },
};
