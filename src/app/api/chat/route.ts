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

        return `
Carrera: ${career.name}
Facultad: ${career.faculty}
Grado: ${career.degree}
Duración: ${career.durationYears} años (${career.durationSemesters} semestres)
Sedes: ${offers.map(o => `${o.campusName} (${o.modality})`).join(', ') || 'No disponible'}
Pensiones: ${feesText || 'No disponible'}
Perfil: ${career.generalProfile?.substring(0, 300) || 'No disponible'}
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

    const systemPrompt = `Eres el Asistente Vocacional de nuestra plataforma de orientación.
Tu objetivo es ayudar a los postulantes a encontrar la carrera ideal y responder sus dudas sobre sedes, mallas curriculares, costos y grado académico de las diversas universidades que tenemos en nuestra base de datos.
IMPORTANTE: Usa SOLO la información del contexto oficial provisto más abajo para responder preguntas. Si no tienes datos en el contexto, dilo claramente.
Si tienes el perfil vocacional del usuario, personaliza tu respuesta destacando por qué esa carrera es adecuada para su perfil específico.
REGLA ESTRICTA: No uses ningún tipo de emoji, emoticon, ni signos de exclamación excesivos. Mantén un tono sumamente profesional, sobrio y directo en todas tus respuestas.${profileContext || ''}${careerContext}`;

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
