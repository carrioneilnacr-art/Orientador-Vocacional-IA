/**
 * vocacional.ts
 * Tipos e interfaces del dominio de resultados vocacionales.
 */

export interface CareerResult {
  id: number;
  slug: string;
  name: string;
  faculty: string;
  degree: string;
  match: number;
  justification: string;
  campuses: string[];
  cost: string;
}

export interface VocationalResults {
  /** Absent for legacy local reports; false means server persistence failed. */
  saved?: boolean;
  testId?: string;
  createdAt?: string;
  dimensionScores: Record<string, number>;
  topCareers: CareerResult[];
}

