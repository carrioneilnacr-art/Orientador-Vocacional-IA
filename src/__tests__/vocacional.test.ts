import { describe, it, expect } from 'vitest';

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
});
