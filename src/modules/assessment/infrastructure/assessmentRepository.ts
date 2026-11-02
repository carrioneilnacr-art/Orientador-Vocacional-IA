import {db} from '@/db';
import {questionnaireQuestions,questionnaireOptions,vocationalRules,careers,academicOffers,campuses,institutions,tuitionFees,userSessions} from '@/db/schema';
import {eq} from 'drizzle-orm';
import {VERIFIED_16_QUESTIONS,VERIFIED_64_OPTIONS,VERIFIED_CAREERS,VERIFIED_RULES} from '@/data/questionnaireData';
import {validCatalog,type Catalog} from '../domain/assessment';
import type {AssessmentRepository} from '../application/completeAssessment';
export const assessmentRepository:AssessmentRepository={
 async loadCatalog(){
  try{
   const questions=await db.select().from(questionnaireQuestions).where(eq(questionnaireQuestions.isActive,true)).orderBy(questionnaireQuestions.orderNumber);
   const ids=new Set(questions.map(q=>q.id));
   const options=(await db.select().from(questionnaireOptions).orderBy(questionnaireOptions.questionId)).filter(o=>ids.has(o.questionId));
   const catalog:Catalog={questions,options,source:'database'};
   if(validCatalog(catalog))return catalog;
  }catch{ /* A failed database read uses the entire verified catalog. */ }
  return {questions:VERIFIED_16_QUESTIONS,options:VERIFIED_64_OPTIONS,source:'verified-local'};
 },
 async loadRules(source){
  if(source==='verified-local')return VERIFIED_RULES;
  return (await db.select().from(vocationalRules)).map(r=>({careerId:Number(r.careerId),dimension:r.dimension,weight:Number(r.weight),minScore:Number(r.minScore),explanationTemplate:r.explanationTemplate}));
 },
 async resolveCareers(matchResults,source){
    const topCareers = await Promise.all(
      matchResults.map(async (result) => {
        if(source==='database'){
        try {
          const careerData = await db
            .select()
            .from(careers)
            .where(eq(careers.id, result.careerId))
            .limit(1);

          if (careerData && careerData.length > 0) {
            const c = careerData[0];
            const offers = await db
              .select({
                institutionShort: institutions.shortName,
                campusName: campuses.name,
                district: campuses.district,
                modality: academicOffers.modality,
              })
              .from(academicOffers)
              .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
              .innerJoin(institutions, eq(academicOffers.institutionId, institutions.id))
              .where(eq(academicOffers.careerId, c.id));

            const limaNorteDistricts = new Set(['los olivos', 'comas', 'independencia', 'san martín de porres', 'san martin de porres', 'puente piedra']);

            // Format and sort: Lima Norte sedes first
            const formattedCampuses: string[] = [];
            const otherCampuses: string[] = [];

            offers.forEach((o) => {
              const distLow = o.district.toLowerCase();
              const nameLow = o.campusName.toLowerCase();
              const isNorte = limaNorteDistricts.has(distLow) || nameLow.includes('norte') || nameLow.includes('comas') || nameLow.includes('olivos');
              const label = `${o.institutionShort} (${o.campusName})`;
              if (isNorte) {
                if (!formattedCampuses.includes(label)) formattedCampuses.push(label);
              } else {
                if (!otherCampuses.includes(label)) otherCampuses.push(label);
              }
            });

            const finalCampuses = [...formattedCampuses, ...otherCampuses].slice(0, 8);

            const firstOffer = await db
              .select({ id: academicOffers.id })
              .from(academicOffers)
              .where(eq(academicOffers.careerId, c.id))
              .limit(1);

            let costText = 'Consultar en admisiones';
            if (firstOffer.length > 0) {
              const fees = await db
                .select()
                .from(tuitionFees)
                .where(eq(tuitionFees.academicOfferId, firstOffer[0].id))
                .limit(2);
              if (fees.length > 0) {
                costText = fees.map((f) => `${f.currency} ${f.amount}`).join(' - ');
              }
            }

            return {
              id: c.id,
              slug: c.slug,
              name: c.name,
              faculty: c.faculty,
              degree: c.degree,
              match: result.match,
              justification: result.explanations.slice(0, 2).join(' '),
              campuses: finalCampuses.length > 0 ? finalCampuses : offers.map((o) => o.campusName),
              cost: costText,
            };
          }
        } catch {
          // Never pair database rule IDs with an unrelated fallback catalog.
        }
        return null;
        }
        const localCareer = VERIFIED_CAREERS.find((c) => c.id === result.careerId);
        if (!localCareer) return null;

        return {
          id: localCareer.id,
          slug: localCareer.slug,
          name: localCareer.name,
          faculty: localCareer.faculty,
          degree: localCareer.degree,
          match: result.match,
          justification: result.explanations.slice(0, 2).join(' '),
          campuses: localCareer.campuses,
          cost: localCareer.cost,
        };
      })
    );

    const validTopCareers = topCareers.filter(Boolean);


 return validTopCareers.filter((career):career is NonNullable<typeof career>=>career!==null);
 },
 async save({testId,answers,dimensionScores,topCareers}){
  try{
   const dominantDimension=Object.entries(dimensionScores).sort(([,a],[,b])=>b-a)[0]?.[0]??'LOGIC';
   await db.insert(userSessions).values({sessionToken:testId,answersPayload:answers,profileResult:{dominantDimension,dimensionScores,assessmentVersion:'questionnaire-v1'},recommendedCareerIds:topCareers.map(c=>c.id),expiresAt:new Date(Date.now()+365*24*60*60*1000)});
   return true;
  }catch{return false;}
 },
};
