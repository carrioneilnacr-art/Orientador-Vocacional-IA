import { db } from '@/db';
import { careers, campuses, academicOffers, institutions, curricula, curriculumCourses, sources } from '@/db/schema';
import { and, asc, desc, eq, gte, ilike, inArray, isNull, or } from 'drizzle-orm';
import {createHash} from 'node:crypto';
import {createPublicReadCache} from '@/lib/publicReadCache';

const UNAVAILABLE = 'Información no disponible actualmente en nuestras fuentes oficiales registradas.';
const LIMA_NORTE_DISTRICTS = new Set(['los olivos', 'comas', 'independencia', 'san martín de porres', 'san martin de porres', 'puente piedra', 'carabayllo']);
const STOPWORDS = new Set(['hola','gracias','chaski','para','cuanto','cuesta','sedes','donde','cual','como','tiene','dime','sabes','sobre','que','hay','una','este','esta','con','del','los','las','por','estudiar','temas','ciclo','primer','segundo','malla','curricular','mejor','entre','comparar','opinion','diferencia']);
// Successful no-match lookups are public catalog facts too. Failures reject and
// are never cached, so an outage cannot masquerade as a verified empty result.
const publicContextCache=createPublicReadCache<string>({maxEntries:64,ttlMs:30000,cacheable:()=>true});

export async function fetchCareerContext(userMessage: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const words = [...new Set(userMessage.toLowerCase().replace(/[^a-záéíóúñü\s]/gi, ' ').split(/\s+/).filter(word => word.length >= 4 && !STOPWORDS.has(word)))].slice(0, 8);
  if (!words.length) return '';
  // Key contains no message text or identity. UTC day prevents stale source
  // validity being carried across midnight; only official context is retained.
  const key=createHash('sha256').update(today+':'+[...words].sort().join('|')).digest('hex');
  return publicContextCache.read(key,()=>loadCareerContext(words,today));
}

async function loadCareerContext(words:string[],today:string):Promise<string>{
  try {
    // One parameterized search, rather than up to eight sequential round trips.
    const foundCareers = await db.select().from(careers)
      .where(or(...words.map(word => or(ilike(careers.name, `%${word}%`), ilike(careers.slug, `%${word}%`)))))
      .orderBy(asc(careers.id)).limit(6);
    if (!foundCareers.length) return '';
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
        const courseText = courses.length ? courses.map(course => `${course.name} (Ciclo ${course.cycle}; fuente: ${course.sourceUrl})`).join(', ') : UNAVAILABLE;
        return `• Universidad: ${institution.institutionShort} (${institution.institutionName})\n  - ${north.length ? `SEDES LIMA NORTE: ${[...new Set(north.map(offer => `${offer.campusName} (${offer.district})`))].join(', ')}` : 'Sin sede directa en Lima Norte'}\n  - Malla Curricular (Muestra de cursos oficiales): ${courseText}`;
      });
      return `CARRERA: ${career.name} (${career.faculty})\nGrado registrado: ${career.degree}\nFuentes de ofertas: ${[...new Set(careerOffers.map(offer => offer.sourceUrl))].join(', ')}\nPerfil: ${career.generalProfile?.substring(0, 280) || UNAVAILABLE}\n\nCOMPARATIVA DE UNIVERSIDADES DISPONIBLES (ENFOQUE ZONA NORTE):\n${comparisons.join('\n\n')}`;
    });
    return `\n\n=== DATOS OFICIALES DE LA BASE DE DATOS (ZONA NORTE Y UNIVERSIDADES) ===\n${details.join('\n\n---\n')}\n=========================================================================\n`;
  } catch {
    console.error('[CareerContext] Verified catalog lookup unavailable');
    throw new Error('VERIFIED_CATALOG_UNAVAILABLE');
  }
}
