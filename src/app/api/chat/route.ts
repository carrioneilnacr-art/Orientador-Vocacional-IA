import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { db } from '@/db';
import { careers, campuses, academicOffers, tuitionFees, institutions, curricula, curriculumCourses } from '@/db/schema';
import { eq, ilike, inArray, or } from 'drizzle-orm';

export const maxDuration = 30;

const LIMA_NORTE_DISTRICTS = new Set(['los olivos', 'comas', 'independencia', 'san martín de porres', 'san martin de porres', 'puente piedra', 'carabayllo']);

async function fetchCareerContext(userMessage: string): Promise<string> {
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
    let foundCareers: any[] = [];

    // Search for careers by name or keyword
    for (const word of rawWords) {
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
          })
          .from(academicOffers)
          .innerJoin(institutions, eq(academicOffers.institutionId, institutions.id))
          .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
          .where(eq(academicOffers.careerId, career.id));

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
            let coursesSummary = 'Malla oficial registrada.';
            try {
              if (data.offerIds.length > 0) {
                const cur = await db
                  .select({ id: curricula.id })
                  .from(curricula)
                  .where(inArray(curricula.academicOfferId, data.offerIds))
                  .limit(1);

                if (cur.length > 0) {
                  const sampleCourses = await db
                    .select({ name: curriculumCourses.courseName, cycle: curriculumCourses.cycle })
                    .from(curriculumCourses)
                    .where(eq(curriculumCourses.curriculumId, cur[0].id))
                    .orderBy(curriculumCourses.cycle)
                    .limit(16);

                  if (sampleCourses.length > 0) {
                    coursesSummary = sampleCourses.map((c) => `${c.name} (Ciclo ${c.cycle})`).join(', ');
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
Duración oficial: ${career.durationYears} años (${career.durationSemesters} semestres) | Grado: ${career.degree}
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

export async function POST(req: Request) {
  try {
    const { messages, profileContext } = await req.json();

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
    const careerContext = lastUserMsg ? await fetchCareerContext(lastUserMsg.content) : '';

    const systemPrompt = `Eres Chaski, el orientador vocacional inteligente, ágil y cercano de nuestra plataforma en Perú.
Acompañas a estudiantes de 5to de secundaria (16 a 17 años) a elegir su carrera y universidad ideal. Eres analítico, conectas las ideas y piensas más allá de lo obvio para dar consejos de gran valor.

REGLAS DE FORMATO Y ESTILO (ESTRICTAS Y OBLIGATORIAS):
1. RESPUESTAS CONCRETAS, ÁGILES Y AL PUNTO:
   - Máximo 2 a 3 párrafos muy breves o viñetas cortas. Cero muros de texto aburridos. Los chicos de colegio leen rápido y quieren respuestas directas.
2. CERO CARACTERES O SÍMBOLOS DE MARKDOWN ROTOS:
   - PROHIBIDO usar almohadillas o títulos markdown como "###", "##" o "#".
   - PROHIBIDO usar líneas divisorias como "---" o "***".
   - Usa viñetas limpias con el punto "•" para enumerar.
   - Usa negrita (**palabra**) ÚNICAMENTE para nombres de universidades, carreras o cursos clave.
3. TONO JUVENIL, CÁLIDO Y MOTIVADOR:
   - Trátalo de "tú", con chispa y buena vibra, como un hermano mayor universitario que te dice las cosas claras y sin floros.
   - Mantén siempre el respeto y la empatía, pase lo que pase no contestes mal.

MANEJO DE PREGUNTAS FUERA DE LUGAR Y BROMAS (GUARDRAILS):
- Los usuarios son adolescentes y pueden hacer preguntas traviesas, vulgares, chistes, retos virales, o pedirte que resuelvas sus tareas de matemáticas/historia.
- REGLA DE ORO: NO respondas a temas que no sean de orientación vocacional, carreras, universidades o futuro laboral. 
- DESVÍO ELEGANTE: Si intentan sacarte de tema, responde con humor pero firmeza y redirige la conversación. (Ejemplo: "¡Jaja, buena esa! Pero mi especialidad no es resolver tareas ni hablar de chismes. Mejor cuéntame, ¿ya sabes qué vas a estudiar terminando el cole?"). No los regañes, solo esquiva y vuelve a lo nuestro.

POSTURA CLARA ANTE COMPARACIONES Y ANÁLISIS PROFUNDO:
- Tienes que ser IMPARCIAL y equitativo con todas las universidades. Reconoce lo bueno de cada una objetivamente.
- Si te piden comparar, analiza profundamente y da una postura basada en sus enfoques (ej: práctico vs investigación).
- PRIORIZA Y DESTACA SIEMPRE LAS SEDES DE ZONA NORTE DE LIMA (Los Olivos, Comas, etc.) para que sepa qué opción le queda más accesible.
- Dale tu conclusión vinculándola a su perfil vocacional.
- Menciona a la UCSUR (Universidad Científica del Sur) como una excelente opción de primer nivel en Lima Norte aplicable a diversas facultades, pero mantén la imparcialidad general.

BECAS Y BENEFICIOS (MUY IMPORTANTE):
- Si notas interés por el costo o rendimiento académico, pregúntale directamente si pertenece al "Tercio Superior" o medio superior en su colegio.
- Recomienda proactivamente que averigüe sobre becas, ya que las universidades ofrecen grandes beneficios, descuentos y categorizaciones especiales para alumnos destacados.

DATOS OFICIALES, CREDIBILIDAD Y MUNDO REAL:
- Las universidades oficiales con las que trabajamos en nuestra BD son: UPN, UTP, UCV, UCH, UCSUR y USMP.
- Toda información de cursos, semestres y sedes debe basarse en los datos provistos abajo.
- Si te preguntan algo que no está en la base de datos, actúa como si hubieras buscado en internet y dales la mejor respuesta basada en tu amplio conocimiento general del mundo actual (tendencias tecnológicas, demanda de empresas, etc.).
- ¡REGLA ESTRICTA DE CREDIBILIDAD!: NUNCA le digas al estudiante que "busque en la web de la universidad", "consulte la página oficial" o "busque más información por su cuenta". Eres un experto, compórtate como tal. Responde directamente con total seguridad. Jamás delegues la búsqueda al usuario.${profileContext || ''}${careerContext}`;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (e: any) {
    const errorMsg = e.message || e.toString();
    console.error('[Chat API Error]', errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
