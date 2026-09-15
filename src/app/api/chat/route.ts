import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { db } from '@/db';
import { careers, campuses, academicOffers, tuitionFees } from '@/db/schema';
import { eq, ilike } from 'drizzle-orm';

export const maxDuration = 30;

async function fetchCareerContext(userMessage: string): Promise<string> {
  // Extract candidate words (4+ chars, not stopwords)
  const stopwords = new Set(['para', 'cuanto', 'cuesta', 'sedes', 'donde', 'cual', 'como', 'tiene', 'dime', 'sabes', 'sobre', 'que', 'hay', 'una', 'este', 'esta', 'con', 'del', 'los', 'las', 'por', 'estudiar', 'temas', 'ciclo', 'primer', 'segundo', 'malla', 'curricular']);
  const words = userMessage.toLowerCase().replace(/[^a-záéíóúñü\s]/gi, ' ').split(/\s+/).filter(w => w.length >= 4 && !stopwords.has(w));

  if (words.length === 0) return '';

  try {
    // Try each word until we find careers
    let found: any[] = [];
    for (const word of words) {
      found = await db.select().from(careers).where(ilike(careers.name, `%${word}%`)).limit(3);
      if (found.length > 0) break;
    }
    if (found.length === 0) return '';

    const details = await Promise.all(
      found.map(async (career) => {
        const offers = await db
          .select({ campusName: campuses.name, modality: academicOffers.modality })
          .from(academicOffers)
          .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
          .where(eq(academicOffers.careerId, career.id));

        const allOffers = await db
          .select({ id: academicOffers.id })
          .from(academicOffers)
          .where(eq(academicOffers.careerId, career.id))
          .limit(1);

        let feesText = '';
        if (allOffers.length > 0) {
          const fees = await db
            .select()
            .from(tuitionFees)
            .where(eq(tuitionFees.academicOfferId, allOffers[0].id));
          feesText = fees.map(f => `${f.concept}: ${f.currency} ${f.amount}`).join(', ');
        }

        const workFieldsText = Array.isArray(career.generalWorkFields) && career.generalWorkFields.length > 0
          ? career.generalWorkFields.join(', ')
          : 'No disponible';

        return `
Carrera: ${career.name}
Facultad: ${career.faculty}
Grado: ${career.degree}
Duración: ${career.durationYears} años (${career.durationSemesters} semestres)
Sedes: ${offers.map(o => `${o.campusName} (${o.modality})`).join(', ') || 'No disponible'}
Pensiones: ${feesText || 'No disponible'}
Áreas de trabajo y especialidades: ${workFieldsText}
Perfil: ${career.generalProfile?.substring(0, 400) || 'No disponible'}
        `.trim();
      })
    );

    return `\n\n=== INFORMACIÓN OFICIAL DE LA BASE DE DATOS ===\n${details.join('\n\n---\n')}\n===================================================\n`;
  } catch {
    return '';
  }
}

export async function POST(req: Request) {
  try {
    const { messages, profileContext } = await req.json();

    // Get the last user message to fetch relevant career context from DB
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
    const careerContext = lastUserMsg ? await fetchCareerContext(lastUserMsg.content) : '';

    const systemPrompt = `Eres Chaski, el orientador vocacional inteligente y compañero de ruta de nuestra plataforma en Perú.
Tu misión es acompañar, aconsejar y resolver las dudas de estudiantes que están por terminar el colegio (5to año de secundaria, entre 16 y 17 años).

PERSONALIDAD Y TONO:
- Háblale de "tú", con cercanía, calidez, respeto y entusiasmo, como un mentor joven o hermano mayor que los comprende y apoya.
- Lenguaje simple, claro y cero aburrido: evita el lenguaje burocrático o tecnicismos pesados. Si mencionas un término técnico, explícalo inmediatamente con palabras cotidianas.
- Formato amigable: usa párrafos cortos y viñetas para que sea fácil y entretenido de leer en pantalla.

CONEXIÓN CON EL PERFIL VOCACIONAL Y EJEMPLOS REALISTAS:
- Siempre que expliques una carrera, especialidad o curso, CONÉCTALO DIRECTAMENTE CON EL PERFIL VOCACIONAL DEL ESTUDIANTE (provisto en el contexto).
  * Si es Investigador/Analítico: conéctalo con descifrar patrones, analizar información a fondo y resolver problemas complejos.
  * Si es Emprendedor: conéctalo con liderar proyectos, generar impacto comercial, crear negocios y tomar decisiones estratégicas.
  * Si es Social: conéctalo con ayudar a personas, transformar vidas, educar y trabajar en equipo.
  * Si es Creativo/Artístico: conéctalo con diseñar, comunicar ideas visuales y crear experiencias innovadoras.
  * Si es Tecnológico/Lógico: conéctalo con construir software, automatizar procesos y dominar la tecnología del futuro.
  * Si es Realista: conéctalo con aplicar cosas prácticas, herramientas tangibles y soluciones directas en el terreno.
- Da ejemplos cotidianos de la vida real (ej. apps que usan a diario como Instagram o Yape, empresas reales, situaciones cotidianas del trabajo).

EXPLICACIÓN DE CURSOS Y ESPECIALIDADES:
- Si el estudiante pregunta por un curso de la malla o un área de especialidad:
  1. Explica con palabras muy sencillas de qué trata.
  2. Explica para qué le va a servir en la vida real y en su futuro trabajo.
  3. Relaciónalo con cómo su perfil vocacional le facilitará entenderlo o disfrutarlo.
  4. Quítale el miedo a materias consideradas difíciles o "filtro" (como números o memorización), animándolo con consejos prácticos.

REGLA DE CONFIABILIDAD DE DATOS:
- Para pensiones/costos, sedes, facultades, modalidades y duración oficial de cada carrera, básate en la INFORMACIÓN OFICIAL provista abajo. No inventes montos ni sedes que no figuren en los datos.
- Si no cuentas con el costo exacto o la sede de una universidad específica en el contexto, indícaselo con honestidad y anímalo a consultar la oficina de admisión oficial.${profileContext || ''}${careerContext}`;

    const result = streamText({
      model: google('gemini-3.6-flash'),
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
