/**
 * academicAdjustment.ts
 * Implementación de la fórmula de ajuste académico.
 */

export interface AcademicAdjustmentConfig {
  riasecWeight: number;
  academicWeight: number;
}

const DEFAULT_CONFIG: AcademicAdjustmentConfig = {
  riasecWeight: 0.80,
  academicWeight: 0.20,
};

/**
 * Calcula el puntaje final ponderando la afinidad RIASEC y el ajuste académico.
 *
 * @param riasecAffinity - Puntaje base de afinidad (ej. 0 a 100).
 * @param academicAdjustment - Multiplicador de ajuste académico (ej. 0.20 a 1.00).
 * @param config - Configuración opcional para los pesos (default 80% / 20%).
 * @returns El puntaje final ponderado.
 */
export function calculateFinalScore(
  riasecAffinity: number,
  academicAdjustment: number,
  config?: Partial<AcademicAdjustmentConfig>
): number {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Normalizar que la suma de pesos sea 1 (o 100%)
  const totalWeight = mergedConfig.riasecWeight + mergedConfig.academicWeight;
  const wRiasec = mergedConfig.riasecWeight / totalWeight;
  const wAcademic = mergedConfig.academicWeight / totalWeight;

  // Calculamos un factor de impacto académico. 
  // academicAdjustment es un factor entre 0.20 (nota más baja, penalización máxima pero no elimina) 
  // y 1.00 (nota máxima, sin penalización).
  // Nota: una baja nota no debe retornar score 0.
  
  const score = (riasecAffinity * wRiasec) + (riasecAffinity * academicAdjustment * wAcademic);
  
  return score;
}

/**
 * Calcula el ajuste académico basado en las notas del estudiante y los pesos de la carrera.
 * Retorna un factor multiplicativo (ej. 0.2 a 1.0) donde una nota baja nunca es 0.
 *
 * @param studentGrades - Notas del estudiante por área (0-20).
 * @param careerWeights - Relevancia de cada área para la carrera (0-1).
 * @returns Factor de ajuste académico (mínimo 0.20).
 */
export function calculateAcademicAdjustment(
  studentGrades: { area: string; grade: number }[],
  careerWeights: { area: string; weight: number }[]
): number {
  let totalWeight = 0;
  let weightedScore = 0;

  for (const cw of careerWeights) {
    const studentGrade = studentGrades.find(sg => sg.area === cw.area);
    if (studentGrade) {
      // Normalizamos la nota de 0-20 a 0.2-1.0 para que nota baja nunca sea 0.
      // 0 -> 0.20, 20 -> 1.00
      const normalizedGrade = 0.20 + (studentGrade.grade / 20) * 0.80;
      weightedScore += normalizedGrade * cw.weight;
      totalWeight += cw.weight;
    }
  }

  if (totalWeight === 0) return 1.0; // Si no hay áreas con peso, no hay impacto.

  return weightedScore / totalWeight;
}
