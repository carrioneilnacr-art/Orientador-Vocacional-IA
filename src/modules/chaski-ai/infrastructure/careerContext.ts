import { db } from '@/db';
import { careers, campuses, academicOffers, institutions, curricula, curriculumCourses, sources } from '@/db/schema';
import { and, eq, gte, ilike, inArray, isNull, or } from 'drizzle-orm';

const LIMA_NORTE_DISTRICTS = new Set(['los olivos', 'comas', 'independencia', 'san martín de porres', 'san martin de porres', 'puente piedra', 'carabayllo']);

export async function fetchCareerContext(userMessage: string): Promise<string> {
  const today=new Date().toISOString().slice(0,10);
  const stopwords = new Set([
    'para', 'cuanto', 'cuesta', 'sedes', 'donde', 'cual', 'como', 'tiene', 'dime',
    'sabes', 'sobre', 'que', 'hay', 'una', 'este', 'esta', 'con', 'del', 'los',
    'las', 'por', 'estudiar', 'temas', 'ciclo', 'primer', 'segundo', 'malla',
    'curricular', 'mejor', 'entre', 'comparar', 'opinion', 'diferencia'
  ]);

  const rawWords = userMessage
    .toLowerCase()
    .replace(/[^a-záéíóúñü\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopwords.has(w));

  try {
    let foundCareers: (typeof careers.$inferSelect)[] = [];

    // Search for careers by name or keyword
    for (const word of rawWords.slice(0,8)) {
      foundCareers = await db
        .select()
        .from(careers)
        .where(or(ilike(careers.name, `%${word}%`), ilike(careers.slug, `%${word}%`)))
        .limit(6);
      if (foundCareers.length > 0) break;
    }

    // Default fallback to systems/software if discussing tech/universities
    if (foundCareers.length === 0 && (userMessage.toLowerCase().includes('ingenier') || userMessage.toLowerCase().includes('sistema') || userMessage.toLowerCase().includes('software'))) {
      foundCareers = await db
        .select()
        .from(careers)
        .where(ilike(careers.slug, '%sistema%'))
        .limit(6);
    }

    if (foundCareers.length === 0) return '';

    const details = await Promise.all(
      foundCareers.map(async (career) => {
        // Fetch academic offers with institution and campus details
        const offers = await db
          .select({
            offerId: academicOffers.id,
            institutionShort: institutions.shortName,
            institutionName: institutions.name,
            campusName: campuses.name,
            district: campuses.district,
            city: campuses.city,
            modality: academicOffers.modality,
            sourceUrl:sources.url,
          })
          .from(academicOffers)
          .innerJoin(institutions, eq(academicOffers.institutionId, institutions.id))
          .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
          .innerJoin(sources,eq(academicOffers.sourceId,sources.id))
          .where(and(eq(academicOffers.careerId, career.id),or(isNull(sources.validUntil),gte(sources.validUntil,today))));

        if(!offers.length)return 'Información no disponible actualmente en nuestras fuentes oficiales registradas.';

        // Group offers by institution and detect Lima Norte presence
        const uniMap = new Map<string, { name: string; limaNorteSedes: string[]; otherSedes: string[]; offerIds: number[] }>();

        for (const o of offers) {
          const short = o.institutionShort;
          if (!uniMap.has(short)) {
            uniMap.set(short, {
              name: o.institutionName,
              limaNorteSedes: [],
              otherSedes: [],
              offerIds: [],
            });
          }
          const entry = uniMap.get(short)!;
          entry.offerIds.push(o.offerId);

          const distLow = o.district.toLowerCase();
          const nameLow = o.campusName.toLowerCase();
          const isLimaNorte =
            LIMA_NORTE_DISTRICTS.has(distLow) ||
            nameLow.includes('norte') ||
            nameLow.includes('comas') ||
            nameLow.includes('olivos');

          if (isLimaNorte) {
            entry.limaNorteSedes.push(`${o.campusName} (${o.district})`);
          } else {
            entry.otherSedes.push(o.campusName);
          }
        }

        // Fetch curriculum courses for comparison
        const uniComparisons = await Promise.all(
          Array.from(uniMap.entries()).map(async ([uniKey, data]) => {
            let coursesSummary = 'Información no disponible actualmente en nuestras fuentes oficiales registradas.';
            try {
              if (data.offerIds.length > 0) {
                const cur = await db
                  .select({ id: curricula.id })
                  .from(curricula)
                  .where(inArray(curricula.academicOfferId, data.offerIds))
                  .limit(1);

                if (cur.length > 0) {
                  const sampleCourses = await db
                    .select({ name: curriculumCourses.courseName, cycle: curriculumCourses.cycle,sourceUrl:sources.url })
                    .from(curriculumCourses)
                    .innerJoin(sources,eq(curriculumCourses.sourceId,sources.id))
                    .where(and(eq(curriculumCourses.curriculumId, cur[0].id),or(isNull(sources.validUntil),gte(sources.validUntil,today))))
                    .orderBy(curriculumCourses.cycle)
                    .limit(16);

                  if (sampleCourses.length > 0) {
                    coursesSummary = sampleCourses.map((c) => `${c.name} (Ciclo ${c.cycle}; fuente: ${c.sourceUrl})`).join(', ');
                  }
                }
              }
            } catch {}

            const norteText = data.limaNorteSedes.length > 0
              ? `SEDES LIMA NORTE: ${data.limaNorteSedes.join(', ')}`
              : 'Sin sede directa en Lima Norte';

            return `• Universidad: ${uniKey} (${data.name})
  - ${norteText}
  - Malla Curricular (Muestra de cursos oficiales): ${coursesSummary}`;
          })
        );

        return `CARRERA: ${career.name} (${career.faculty})
Grado registrado: ${career.degree}
Fuentes de ofertas: ${[...new Set(offers.map(offer=>offer.sourceUrl))].join(', ')}
Perfil: ${career.generalProfile?.substring(0, 280) || 'Perfil oficial de la carrera.'}

COMPARATIVA DE UNIVERSIDADES DISPONIBLES (ENFOQUE ZONA NORTE):
${uniComparisons.join('\n\n')}`;
      })
    );

    return `\n\n=== DATOS OFICIALES DE LA BASE DE DATOS (ZONA NORTE Y UNIVERSIDADES) ===\n${details.join('\n\n---\n')}\n=========================================================================\n`;
  } catch (err) {
    console.error('Error fetching career context:', err);
    return '';
  }
}
