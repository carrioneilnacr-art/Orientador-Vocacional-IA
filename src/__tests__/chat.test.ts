import { describe, it, expect } from 'vitest';
import { vocationalChatTools } from '../domain/vocational/tools';

describe('Vocational Chat Tools', () => {
  it('should have 4 tools defined', () => {
    expect(vocationalChatTools.length).toBe(4);
  });
  
  it('should include getTuitionAndScholarships tool', () => {
    const tuitionTool = vocationalChatTools.find(t => t.name === 'getTuitionAndScholarships');
    expect(tuitionTool).toBeDefined();
    expect(tuitionTool?.parameters?.required).toContain('careerSlug');
    expect(tuitionTool?.parameters?.required).toContain('campusId');
  });
});
