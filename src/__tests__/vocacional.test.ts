import { describe, it, expect } from 'vitest';
import { calculateFinalScore, calculateAcademicAdjustment } from '../lib/academicAdjustment';

const DIMENSION_LABELS: Record<string, string> = {
  TECH: "Tecnológico",
  LOGIC: "Lógico",
  INVESTIGATIVE: "Investigador",
  SOCIAL: "Social",
  ARTISTIC: "Artístico",
  ENTERPRISING: "Emprendedor",
  CONVENTIONAL: "Convencional",
  REALISTIC: "Realista",
};

describe('Vocational Dimensions & Chaski Personality', () => {
  it('correctly maps dimension labels', () => {
    expect(DIMENSION_LABELS['TECH']).toBe('Tecnológico');
    expect(DIMENSION_LABELS['LOGIC']).toBe('Lógico');
    expect(DIMENSION_LABELS['INVESTIGATIVE']).toBe('Investigador');
  });

  it('determines primary profile name from top dimension score', () => {
    const scores = {
      LOGIC: 50,
      TECH: 43,
      INVESTIGATIVE: 33,
      ENTERPRISING: 28,
      SOCIAL: 23,
    };

    const topDimension = Object.entries(scores).sort(([, a], [, b]) => b - a)[0]?.[0];
    expect(topDimension).toBe('LOGIC');
    expect(DIMENSION_LABELS[topDimension]).toBe('Lógico');
  });

  it('assigns correct Chaski personality based on top dimension', () => {
    const getPersonality = (topDim: string) => {
      if (topDim === 'TECH' || topDim === 'LOGIC') return 'analitico';
      if (topDim === 'INVESTIGATIVE') return 'explorador';
      if (topDim === 'SOCIAL') return 'social';
      if (topDim === 'ARTISTIC') return 'creativo';
      if (topDim === 'ENTERPRISING') return 'emprendedor';
      return 'default';
    };

    expect(getPersonality('LOGIC')).toBe('analitico');
    expect(getPersonality('INVESTIGATIVE')).toBe('explorador');
    expect(getPersonality('SOCIAL')).toBe('social');
  });

  it('validates that 16 interactions are divided evenly across 4 missions', async () => {
    const { VERIFIED_16_QUESTIONS, VERIFIED_64_OPTIONS, MISSIONS_CONFIG } = await import('../data/questionnaireData');
    expect(VERIFIED_16_QUESTIONS).toHaveLength(16);
    expect(VERIFIED_64_OPTIONS).toHaveLength(64);
    expect(MISSIONS_CONFIG).toHaveLength(4);

    for (let mission = 1; mission <= 4; mission++) {
      const missionQuestions = VERIFIED_16_QUESTIONS.filter((q) => q.missionNumber === mission);
      expect(missionQuestions).toHaveLength(4);
    }

    // Every question has exactly 4 options with scorePayload
    for (const q of VERIFIED_16_QUESTIONS) {
      const qOptions = VERIFIED_64_OPTIONS.filter((o) => o.questionId === q.id);
      expect(qOptions).toHaveLength(4);
      for (const opt of qOptions) {
        expect(Object.keys(opt.scorePayload).length).toBeGreaterThan(0);
      }
    }
  });

  it('generates random answers for all 16 questions and produces valid scores and top careers', async () => {
    const { VERIFIED_16_QUESTIONS, VERIFIED_64_OPTIONS } = await import('../data/questionnaireData');
    
    // Simulate random choices
    const randomAnswers: Record<number, number> = {};
    for (const q of VERIFIED_16_QUESTIONS) {
      const opts = VERIFIED_64_OPTIONS.filter((o) => o.questionId === q.id);
      const chosen = opts[Math.floor(Math.random() * opts.length)];
      randomAnswers[q.id] = chosen.id;
    }
    expect(Object.keys(randomAnswers)).toHaveLength(16);

    // Calculate scores
    const dimScores: Record<string, number> = {};
    for (const [, optId] of Object.entries(randomAnswers)) {
      const opt = VERIFIED_64_OPTIONS.find((o) => o.id === optId);
      if (opt?.scorePayload) {
        for (const [dim, val] of Object.entries(opt.scorePayload)) {
          dimScores[dim] = (dimScores[dim] || 0) + val;
        }
      }
    }

    for (const [dim, val] of Object.entries(dimScores)) {
      expect(val).toBeGreaterThan(0);
      expect(isNaN(val)).toBe(false);
    }
  });

  it('validates that 64 options cover the 8 dimensions', async () => {
    const { VERIFIED_64_OPTIONS } = await import('../data/questionnaireData');
    const dimensionsFound = new Set<string>();

    for (const opt of VERIFIED_64_OPTIONS) {
      for (const dim of Object.keys(opt.scorePayload)) {
        dimensionsFound.add(dim);
      }
    }
    expect(dimensionsFound.size).toBe(8);
  });

  it('validates micro-reactions length and coverage', async () => {
    const { CHASKI_MICRO_REACTIONS } = await import('../data/questionnaireData');
    expect(Object.keys(CHASKI_MICRO_REACTIONS)).toHaveLength(8);

    for (const key of Object.keys(CHASKI_MICRO_REACTIONS)) {
      expect(CHASKI_MICRO_REACTIONS[key].text.length).toBeGreaterThan(10);
      expect(CHASKI_MICRO_REACTIONS[key].text.length).toBeLessThanOrEqual(70);
      expect(CHASKI_MICRO_REACTIONS[key].emoji).toBeDefined();
    }
  });

  it('validates mission config chaski text lengths', async () => {
    const { MISSIONS_CONFIG } = await import('../data/questionnaireData');
    for (const mission of MISSIONS_CONFIG) {
      expect(mission.chaskiIntro.length).toBeGreaterThan(20);
      expect(mission.chaskiIntro.length).toBeLessThanOrEqual(160);
      expect(mission.chaskiCompletedMessage.length).toBeGreaterThan(20);
      expect(mission.chaskiCompletedMessage.length).toBeLessThanOrEqual(160);
    }
  });
});

describe('Academic Adjustment', () => {
  it('calculateFinalScore works with default weights', () => {
    const riasec = 100;
    const academicAdj = 1.0;
    const score = calculateFinalScore(riasec, academicAdj);
    expect(score).toBe(100);
  });

  it('calculateFinalScore handles different weights', () => {
    const score = calculateFinalScore(100, 1.0, { riasecWeight: 0.5, academicWeight: 0.5 });
    expect(score).toBe(100);

    const scoreLow = calculateFinalScore(100, 0.5, { riasecWeight: 0.5, academicWeight: 0.5 });
    expect(scoreLow).toBe(75); // 50 + (100*0.5*0.5) = 75
  });

  it('calculateAcademicAdjustment computes perfectly with high grades', () => {
    const grades = [{ area: 'Matemática', grade: 20 }, { area: 'Comunicación', grade: 20 }];
    const weights = [{ area: 'Matemática', weight: 0.7 }, { area: 'Comunicación', weight: 0.3 }];
    
    const adj = calculateAcademicAdjustment(grades, weights);
    expect(adj).toBeCloseTo(1.0);
  });

  it('calculateAcademicAdjustment never returns 0 with very low grades', () => {
    const grades = [{ area: 'Matemática', grade: 0 }, { area: 'Comunicación', grade: 0 }];
    const weights = [{ area: 'Matemática', weight: 0.7 }, { area: 'Comunicación', weight: 0.3 }];
    
    const adj = calculateAcademicAdjustment(grades, weights);
    expect(adj).toBeCloseTo(0.20);
  });
});
