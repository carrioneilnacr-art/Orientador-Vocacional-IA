import { describe, it, expect } from 'vitest';
import { CalculateProfileUseCase, ICareerRepository } from '../application/use-cases/calculateProfileUseCase';
import { CareerProfile } from '../domain/vocational/scoring';

describe('CalculateProfileUseCase', () => {
  it('should process responses and return top recommendations', async () => {
    const mockCareers: CareerProfile[] = [
      { id: '1', slug: 'software', name: 'Software', weights: { R: 0, I: 0.8, A: 0, S: 0, E: 0, C: 0, T: 1, M: 0.9 } },
      { id: '2', slug: 'arte', name: 'Arte', weights: { R: 0, I: 0, A: 1, S: 0.5, E: 0, C: 0, T: 0, M: 0 } },
      { id: '3', slug: 'medicina', name: 'Medicina', weights: { R: 0.5, I: 0.9, A: 0, S: 0.8, E: 0, C: 0, T: 0.2, M: 0.4 } }
    ];

    const mockRepo: ICareerRepository = {
      getAllCareerProfiles: async () => mockCareers
    };

    const useCase = new CalculateProfileUseCase(mockRepo);
    
    const responses = {
      'T_1': 5,
      'I_1': 4,
      'M_1': 3,
      'A_1': 0
    };

    const result = await useCase.execute(responses);

    expect(result.profile.T).toBe(5);
    expect(result.profile.I).toBe(4);
    expect(result.profile.M).toBe(3);
    
    // Software should be the top match because of T and I
    expect(result.recommendations.length).toBe(3);
    expect(result.recommendations[0].career.slug).toBe('software');
  });
});
