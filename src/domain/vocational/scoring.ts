export type Dimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C' | 'T' | 'M';

export type UserProfile = Record<Dimension, number>;

export interface CareerProfile {
  id: string;
  slug: string;
  name: string;
  weights: Record<Dimension, number>;
}

export interface MatchResult {
  career: CareerProfile;
  score: number;
  explanation: string;
}

export function calculateCosineSimilarity(vecA: Record<Dimension, number>, vecB: Record<Dimension, number>): number {
  const dimensions: Dimension[] = ['R', 'I', 'A', 'S', 'E', 'C', 'T', 'M'];
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (const dim of dimensions) {
    const valA = vecA[dim] || 0;
    const valB = vecB[dim] || 0;
    
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function findTopCareers(userProfile: UserProfile, careers: CareerProfile[], topN: number = 3): MatchResult[] {
  const matches: MatchResult[] = careers.map(career => {
    const score = calculateCosineSimilarity(userProfile, career.weights);
    return {
      career,
      score,
      explanation: generateExplanation(userProfile, career)
    };
  });
  
  return matches.sort((a, b) => b.score - a.score).slice(0, topN);
}

function generateExplanation(userProfile: UserProfile, career: CareerProfile): string {
  // Simple heuristic for explanation
  const dimensions: Dimension[] = ['R', 'I', 'A', 'S', 'E', 'C', 'T', 'M'];
  
  let bestDim: Dimension = 'R';
  let maxContribution = -1;
  
  for (const dim of dimensions) {
    const contribution = (userProfile[dim] || 0) * (career.weights[dim] || 0);
    if (contribution > maxContribution) {
      maxContribution = contribution;
      bestDim = dim;
    }
  }
  
  const dimNames: Record<Dimension, string> = {
    R: 'Realista',
    I: 'Investigador',
    A: 'Artístico',
    S: 'Social',
    E: 'Emprendedor',
    C: 'Convencional',
    T: 'Tecnológico',
    M: 'Lógico-Matemático'
  };
  
  return `Gran afinidad en el área ${dimNames[bestDim]} alineada con los requerimientos de la carrera.`;
}
