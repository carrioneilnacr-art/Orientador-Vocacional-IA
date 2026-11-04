import { db } from '@/db';
import { careers, campuses, academicOffers, institutions, curricula, curriculumCourses, sources } from '@/db/schema';
import { and, asc, desc, eq, gte, ilike, inArray, isNull, or, sql } from 'drizzle-orm';
import {createHash} from 'node:crypto';
import {createPublicReadCache} from '@/lib/publicReadCache';

const UNAVAILABLE = 'Información no disponible actualmente en nuestras fuentes oficiales registradas.';
const LIMA_NORTE_DISTRICTS = new Set(['los olivos', 'comas', 'independencia', 'san martín de porres', 'san martin de porres', 'puente piedra', 'carabayllo']);
const STOPWORDS = new Set(['hola','gracias','chaski','para','cuanto','cuesta','sedes','donde','cual','como','tiene','dime','sabes','sobre','que','hay','una','este','esta','con','del','los','las','por','estudiar','temas','ciclo','primer','segundo','malla','curricular','mejor','entre','comparar','opinion','diferencia']);
// Successful no-match lookups are public catalog facts too. Failures reject and
// are never cached, so an outage cannot masquerade as a verified empty result.
const publicContextCache=createPublicReadCache<string>({maxEntries:64,ttlMs:30000,cacheable:()=>true});
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();

export async function fetchCareerContext(userMessage: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const normalizedMessage=normalize(userMessage);
  const words = [...new Set(normalizedMessage.split(' ').filter(word => word.length >= 4 && !STOPWORDS.has(word)))].slice(0, 8);
  if (!words.length) return '';
  // Key contains no message text or identity. UTC day prevents stale source
  // validity being carried across midnight; only official context is retained.
  // Phrase order matters for exact named-career selection. Only its hash is kept.
  const key=createHash('sha256').update(today+':'+normalizedMessage).digest('hex');
  return publicContextCache.read(key,()=>loadCareerContext(words,today,normalizedMessage));
}

async function loadCareerContext(words:string[],today:string,normalizedMessage:string):Promise<string>{
  try {
    // One parameterized search, rather than up to eight sequential round trips.
    const normalizedName=sql<string>`translate(lower(${careers.name}), 'áéíóúüñ', 'aeiouun')`;
    const normalizedSlug=sql<string>`translate(lower(${careers.slug}), 'áéíóúüñ', 'aeiouun')`;
    const matches=words.map(word=>or(ilike(normalizedName,`%${word}%`),ilike(normalizedSlug,`%${word}%`))!);
    const exactSqlName=sql<string>`trim(regexp_replace(${normalizedName}, '[^a-z0-9]+', ' ', 'g'))`;
    const exactSql=sql<number>`case when position(' ' || ${exactSqlName} || ' ' in ${` ${normalizedMessage} `}) > 0 then 100 else 0 end`;
    const relevance=sql<number>`(${exactSql} + ${sql.join(matches.map((match,index)=>sql`case when ${match} then ${words[index]==='ingenieria'?1:3} else 0 end`),sql` + `)})`;
    const candidates = await db.select().from(careers)
      .where(or(...matches)).orderBy(desc(relevance),asc(careers.id)).limit(6);
    if (!candidates.length) return '';
    const exact=candidates.filter(career=>` ${normalizedMessage} `.includes(` ${normalize(career.name)} `));
    const foundCareers=exact.length?exact:candidates;
    const offers = await db.select({
      offerId: academicOffers.id, careerId: academicOffers.careerId, institutionId: institutions.id,
      institutionShort: institutions.shortName, institutionName: institutions.name,
      campusName: campuses.name, district: campuses.district, sourceUrl: sources.url,
    }).from(academicOffers)
      .innerJoin(institutions, eq(academicOffers.institutionId, institutions.id))
      .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
      .innerJoin(sources, eq(academicOffers.sourceId, sources.id))
      .where(and(inArray(academicOffers.careerId, foundCareers.map(career => career.id)), or(isNull(sources.validUntil), gte(sources.validUntil, today))))
      .orderBy(asc(academicOffers.id));
    if (!offers.length) return UNAVAILABLE;

    // Select one current, sourced curriculum per career/institution, consistently.
    const curriculumRows = await db.select({id: curricula.id, offerId: curricula.academicOfferId})
      .from(curricula).innerJoin(sources, eq(curricula.sourceId, sources.id))
      .where(and(inArray(curricula.academicOfferId, offers.map(offer => offer.offerId)), eq(curricula.isCurrent, true), or(isNull(sources.validUntil), gte(sources.validUntil, today))))
      .orderBy(desc(curricula.academicYear), asc(curricula.id));
    const offerById = new Map(offers.map(offer => [offer.offerId, offer]));
    const chosen = new Map<string, number>();
    for (const curriculum of curriculumRows) {
      const offer = offerById.get(curriculum.offerId);
      if (offer) {
        const key = `${offer.careerId}:${offer.institutionId}`;
        if (!chosen.has(key)) chosen.set(key, curriculum.id);
      }
    }
    const courseRows = chosen.size ? await db.select({curriculumId: curriculumCourses.curriculumId, name: curriculumCourses.courseName, cycle: curriculumCourses.cycle, sourceUrl: sources.url})
      .from(curriculumCourses).innerJoin(sources, eq(curriculumCourses.sourceId, sources.id))
      .where(and(inArray(curriculumCourses.curriculumId, [...chosen.values()]), or(isNull(sources.validUntil), gte(sources.validUntil, today))))
      .orderBy(asc(curriculumCourses.curriculumId), asc(curriculumCourses.cycle), asc(curriculumCourses.id)) : [];
    const coursesByCurriculum = new Map<number, typeof courseRows>();
    for (const course of courseRows) {
      const group = coursesByCurriculum.get(course.curriculumId) ?? [];
      if (group.length < 16) group.push(course);
      coursesByCurriculum.set(course.curriculumId, group);
    }
    const sourceIds=new Map<string,string>();
    const sourceRef=(url:string)=>{let id=sourceIds.get(url);if(!id){id=`F${sourceIds.size+1}`;sourceIds.set(url,id);}return id;};
    const details = foundCareers.map(career => {
      const careerOffers = offers.filter(offer => offer.careerId === career.id);
      if (!careerOffers.length) return UNAVAILABLE;
      const universityIds = [...new Set(careerOffers.map(offer => offer.institutionId))];
      const comparisons = universityIds.map(institutionId => {
        const group = careerOffers.filter(offer => offer.institutionId === institutionId);
        const institution = group[0];
        const north = group.filter(offer => LIMA_NORTE_DISTRICTS.has(offer.district.toLowerCase()) || /norte|comas|olivos/.test(offer.campusName.toLowerCase()));
        const curriculumId = chosen.get(`${career.id}:${institutionId}`);
        const courses = curriculumId ? coursesByCurriculum.get(curriculumId) ?? [] : [];
        const courseText = courses.length ? courses.map(course => `${course.name} (Ciclo ${course.cycle}; fuente: ${sourceRef(course.sourceUrl)})`).join(', ') : UNAVAILABLE;
        return `• Universidad: ${institution.institutionShort} (${institution.institutionName})\n  - ${north.length ? `SEDES LIMA NORTE: ${[...new Set(north.map(offer => `${offer.campusName} (${offer.district}; fuente: ${sourceRef(offer.sourceUrl)})`))].join(', ')}` : 'Sin sede directa en Lima Norte'}\n  - Fuentes de ofertas: ${[...new Set(group.map(offer=>sourceRef(offer.sourceUrl)))].join(', ')}\n  - Malla Curricular (Muestra de cursos oficiales): ${courseText}`;
      });
      return `CARRERA: ${career.name} (${career.faculty})\nGrado registrado: ${career.degree}\nFuentes de ofertas: ${[...new Set(careerOffers.map(offer => sourceRef(offer.sourceUrl)))].join(', ')}\nPerfil: ${career.generalProfile?.substring(0, 280) || UNAVAILABLE}\n\nCOMPARATIVA DE UNIVERSIDADES DISPONIBLES (ENFOQUE ZONA NORTE):\n${comparisons.join('\n\n')}`;
    });
    const dictionary=[...sourceIds].map(([url,id])=>`${id}: ${url}`).join('\n');
    return `\n\n=== DATOS OFICIALES DE LA BASE DE DATOS (ZONA NORTE Y UNIVERSIDADES) ===\n${details.join('\n\n---\n')}\nFUENTES OFICIALES (cada referencia F corresponde a esta URL; cita la URL al responder):\n${dictionary}\n=========================================================================\n`;
  } catch {
    console.error('[CareerContext] Verified catalog lookup unavailable');
    throw new Error('VERIFIED_CATALOG_UNAVAILABLE');
  }
}
