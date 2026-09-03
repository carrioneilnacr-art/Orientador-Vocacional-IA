import { db } from '@/db';
import { questionnaireQuestions, questionnaireOptions, vocationalRules, careers, academicOffers, campuses, tuitionFees } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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

    return NextResponse.json({ questions, options });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // answers: Record<questionId, optionId>
    const { answers } = await req.json();

    // 1. Fetch all options for the answered questions
    const allOptions = await db.select().from(questionnaireOptions);

    // 2. Build dimension scores from selected options
    const dimensionScores: Record<string, number> = {};
    for (const [questionId, optionId] of Object.entries(answers)) {
      const option = allOptions.find((o) => o.id === Number(optionId));
      if (!option?.scorePayload) continue;
      const payload = option.scorePayload as Record<string, number>;
      for (const [dim, score] of Object.entries(payload)) {
        dimensionScores[dim] = (dimensionScores[dim] || 0) + score;
      }
    }

    // 3. Normalize scores to 0-100
    const maxPossible = Object.keys(answers).length * 5; // max score per question = 5
    const normalizedScores: Record<string, number> = {};
    for (const [dim, score] of Object.entries(dimensionScores)) {
      normalizedScores[dim] = Math.min(100, Math.round((score / maxPossible) * 100));
    }

    // 4. Calculate match per career using vocational_rules
    const rules = await db
      .select({
        careerId: vocationalRules.careerId,
        dimension: vocationalRules.dimension,
        weight: vocationalRules.weight,
        minScore: vocationalRules.minScore,
        explanationTemplate: vocationalRules.explanationTemplate,
      })
      .from(vocationalRules);

    const careerScores: Record<number, { weightedScore: number; totalWeight: number; explanations: string[] }> = {};

    for (const rule of rules) {
      const userScore = normalizedScores[rule.dimension] || 0;
      const minScore = Number(rule.minScore);
      const weight = Number(rule.weight);

      if (!careerScores[rule.careerId]) {
        careerScores[rule.careerId] = { weightedScore: 0, totalWeight: 0, explanations: [] };
      }

      // Only give points if user meets minimum threshold
      if (userScore >= minScore) {
        careerScores[rule.careerId].weightedScore += userScore * weight;
        careerScores[rule.careerId].explanations.push(rule.explanationTemplate);
      }
      careerScores[rule.careerId].totalWeight += weight * 100;
    }

    // 5. Compute final match % and sort
    const matchResults = Object.entries(careerScores)
      .map(([careerId, data]) => ({
        careerId: Number(careerId),
        match: data.totalWeight > 0 ? Math.min(99, Math.round((data.weightedScore / data.totalWeight) * 100)) : 0,
        explanations: data.explanations,
      }))
      .filter((r) => r.match > 0)
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    if (matchResults.length === 0) {
      return NextResponse.json({ dimensionScores: normalizedScores, topCareers: [] });
    }

    // 6. Fetch career details for top results
    const topCareers = await Promise.all(
      matchResults.map(async (result) => {
        const careerData = await db.select().from(careers).where(eq(careers.id, result.careerId)).limit(1);
        if (!careerData.length) return null;
        const career = careerData[0];

        const offers = await db
          .select({ campusName: campuses.name, modality: academicOffers.modality })
          .from(academicOffers)
          .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
          .where(eq(academicOffers.careerId, career.id));

        const firstOffer = await db
          .select({ id: academicOffers.id })
          .from(academicOffers)
          .where(eq(academicOffers.careerId, career.id))
          .limit(1);

        let costText = 'Consultar en admisiones';
        if (firstOffer.length > 0) {
          const fees = await db.select().from(tuitionFees).where(eq(tuitionFees.academicOfferId, firstOffer[0].id)).limit(2);
          if (fees.length > 0) {
            const amounts = fees.map((f) => `${f.currency} ${f.amount}`);
            costText = amounts.join(' - ');
          }
        }

        return {
          id: career.id,
          slug: career.slug,
          name: career.name,
          faculty: career.faculty,
          degree: career.degree,
          match: result.match,
          justification: result.explanations.join(' '),
          campuses: offers.map((o) => o.campusName),
          cost: costText,
        };
      })
    );

    return NextResponse.json({
      dimensionScores: normalizedScores,
      topCareers: topCareers.filter(Boolean),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
