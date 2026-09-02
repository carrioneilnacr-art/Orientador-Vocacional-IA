import { describe, it, expect } from 'vitest';
import { calculateCosineSimilarity, findTopCareers, CareerProfile, UserProfile } from '../domain/vocational/scoring';

describe('Scoring Engine', () => {
  it('should calculate cosine similarity correctly', () => {
    const vecA: UserProfile = { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0, T: 1, M: 0 };
    const vecB: UserProfile = { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0, T: 1, M: 0 };
    const score = calculateCosineSimilarity(vecA, vecB);
    expect(score).toBeCloseTo(1.0);
    
    const vecC: UserProfile = { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0, T: 0, M: 0 };
    const scoreOrthogonal = calculateCosineSimilarity(vecA, vecC);
    expect(scoreOrthogonal).toBe(0);
  });

  it('should find top careers based on profile', () => {
    const userProfile: UserProfile = { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0, T: 1, M: 1 };
    const careers: CareerProfile[] = [
      { id: '1', slug: 'software', name: 'Software', weights: { R: 0, I: 0.8, A: 0, S: 0, E: 0, C: 0, T: 1, M: 0.9 } },
      { id: '2', slug: 'arte', name: 'Arte', weights: { R: 0, I: 0, A: 1, S: 0.5, E: 0, C: 0, T: 0, M: 0 } }
    ];

    const results = findTopCareers(userProfile, careers, 1);
    
    expect(results.length).toBe(1);
    expect(results[0].career.slug).toBe('software');
    expect(results[0].score).toBeGreaterThan(0.9);
  });
});
