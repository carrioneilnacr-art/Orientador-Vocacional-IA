import { db } from '@/db';
import {
  questionnaireQuestions,
  questionnaireOptions,
  vocationalRules,
  careers,
  academicOffers,
  campuses,
  tuitionFees,
  userSessions,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import {
  VERIFIED_16_QUESTIONS,
  VERIFIED_64_OPTIONS,
  VERIFIED_CAREERS,
  VERIFIED_RULES,
} from '@/data/questionnaireData';

export async function GET() {
  try {
    const questions = await db
      .select()
      .from(questionnaireQuestions)
      .where(eq(questionnaireQuestions.isActive, true))
      .orderBy(questionnaireQuestions.orderNumber);

    const options = await db
      .select()
      .from(questionnaireOptions)
      .orderBy(questionnaireOptions.questionId);

    if (questions && questions.length >= 16 && options && options.length >= 64) {
      return NextResponse.json({ questions, options });
    }

    // Si la BD tiene menos de 16 preguntas o está en migración, usamos el dataset verificado
    return NextResponse.json({
      questions: VERIFIED_16_QUESTIONS,
      options: VERIFIED_64_OPTIONS,
    });
  } catch (err: unknown) {
    console.warn('[API Vocacional] Fallback a datos locales verificados debido a:', err);
    return NextResponse.json({
      questions: VERIFIED_16_QUESTIONS,
      options: VERIFIED_64_OPTIONS,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers: Record<string | number, number> = body.answers || {};

    // 1. Obtener todas las opciones disponibles (de BD o fallback local)
    let allOptions: Array<{ id: number; questionId: number; optionText: string; scorePayload: unknown }> = [];
    try {
      allOptions = await db.select().from(questionnaireOptions);
    } catch {
      allOptions = [];
    }

    if (!allOptions || allOptions.length === 0) {
      allOptions = VERIFIED_64_OPTIONS;
    }

    // 2. Acumular puntajes brutos por dimensión
    const dimensionScores: Record<string, number> = {
      REALISTIC: 0,
      INVESTIGATIVE: 0,
      ARTISTIC: 0,
      SOCIAL: 0,
      ENTERPRISING: 0,
      CONVENTIONAL: 0,
      TECH: 0,
      LOGIC: 0,
    };

    for (const [, optionId] of Object.entries(answers)) {
      const option = allOptions.find((o) => o.id === Number(optionId));
      if (!option?.scorePayload) continue;
      const payload = option.scorePayload as Record<string, number>;
      for (const [dim, score] of Object.entries(payload)) {
        dimensionScores[dim] = (dimensionScores[dim] || 0) + score;
      }
    }

    // 3. Normalizar puntajes a 0-100 de forma proporcional al rendimiento máximo por dimensión
    // En las 16 interacciones, cada dimensión tiene un techo teórico de entre 12 y 16 puntos
    const maxPossiblePerDim: Record<string, number> = {
      REALISTIC: 16,
      INVESTIGATIVE: 18,
      ARTISTIC: 19,
      SOCIAL: 18,
      ENTERPRISING: 19,
      CONVENTIONAL: 14,
      TECH: 18,
      LOGIC: 18,
    };

    const normalizedScores: Record<string, number> = {};
    for (const [dim, rawScore] of Object.entries(dimensionScores)) {
      const maxCap = maxPossiblePerDim[dim] || 16;
      normalizedScores[dim] = Math.min(99, Math.max(0, Math.round((rawScore / maxCap) * 100)));
    }

    // 4. Calcular compatibilidad con carreras usando reglas vocacionales
    let rulesList: Array<{
      careerId: number;
      dimension: string;
      weight: number;
      minScore: number;
      explanationTemplate: string;
    }> = [];

    try {
      const dbRules = await db
        .select({
          careerId: vocationalRules.careerId,
          dimension: vocationalRules.dimension,
          weight: vocationalRules.weight,
          minScore: vocationalRules.minScore,
          explanationTemplate: vocationalRules.explanationTemplate,
        })
        .from(vocationalRules);

      if (dbRules && dbRules.length > 0) {
        rulesList = dbRules.map((r) => ({
          careerId: Number(r.careerId),
          dimension: r.dimension,
          weight: Number(r.weight),
          minScore: Number(r.minScore),
          explanationTemplate: r.explanationTemplate,
        }));
      }
    } catch {
      rulesList = [];
    }

    if (rulesList.length === 0) {
      rulesList = VERIFIED_RULES;
    }

    const careerScores: Record<
      number,
      { weightedScore: number; totalWeight: number; explanations: string[] }
    > = {};

    for (const rule of rulesList) {
      const userScore = normalizedScores[rule.dimension] || 0;
      if (!careerScores[rule.careerId]) {
        careerScores[rule.careerId] = { weightedScore: 0, totalWeight: 0, explanations: [] };
      }

      if (userScore >= rule.minScore) {
        careerScores[rule.careerId].weightedScore += userScore * rule.weight;
        careerScores[rule.careerId].explanations.push(rule.explanationTemplate);
      }
      careerScores[rule.careerId].totalWeight += rule.weight * 100;
    }

    // 5. Ranking de carreras
    const matchResults = Object.entries(careerScores)
      .map(([careerId, data]) => ({
        careerId: Number(careerId),
        match:
          data.totalWeight > 0
            ? Math.min(98, Math.round((data.weightedScore / data.totalWeight) * 100))
            : 0,
        explanations: data.explanations,
      }))
      .filter((r) => r.match > 0)
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    // 6. Obtener detalles de carreras (BD con fallback a VERIFIED_CAREERS)
    const topCareers = await Promise.all(
      matchResults.map(async (result) => {
        try {
          const careerData = await db
            .select()
            .from(careers)
            .where(eq(careers.id, result.careerId))
            .limit(1);

          if (careerData && careerData.length > 0) {
            const c = careerData[0];
            const offers = await db
              .select({ campusName: campuses.name, modality: academicOffers.modality })
              .from(academicOffers)
              .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
              .where(eq(academicOffers.careerId, c.id));

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
              campuses: offers.map((o) => o.campusName),
              cost: costText,
            };
          }
        } catch {
          // Si la BD falla, recurrimos al catálogo local de verificación
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

    // 7. Generar Test ID y registrar la sesión en user_sessions para analítica y futuros modelos de IA
    const dominantDimension =
      Object.entries(normalizedScores).sort(([, a], [, b]) => b - a)[0]?.[0] || 'LOGIC';

    const testId = `TEST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      await db.insert(userSessions).values({
        sessionToken: testId,
        answersPayload: answers,
        profileResult: {
          dominantDimension,
          dimensionScores: normalizedScores,
        },
        recommendedCareerIds: validTopCareers.map((c) => c!.id),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año de conservación
      });
      console.log(`[API Vocacional] Test registrado exitosamente en user_sessions con ID: ${testId}`);
    } catch (err) {
      console.warn('[API Vocacional] Advertencia: No se pudo guardar la sesión en user_sessions:', err);
    }

    return NextResponse.json({
      testId,
      createdAt: new Date().toISOString(),
      dimensionScores: normalizedScores,
      topCareers: validTopCareers,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
