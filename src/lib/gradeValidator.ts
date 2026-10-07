/**
 * gradeValidator.ts
 * Motor de validación exhaustiva de calificaciones importadas fila por fila.
 */

import { ParsedGradeRow, normalizeString, normalizeGrade, mapSubjectToArea } from './gradeParser';

export type ValidationSeverity = 'ERROR' | 'WARNING';
export type RowStatus = 'OK' | 'WARNING' | 'ERROR';

export interface ValidationIssue {
  field: 'studentCode' | 'rawName' | 'subject' | 'period' | 'rawGrade' | 'parsedGrade' | 'general';
  severity: ValidationSeverity;
  message: string;
  code: string;
}

export interface ExistingStudentInfo {
  id: string;
  studentCode: string;
  fullName: string;
}

export interface ValidatedGradeRow {
  originalRowIndex: number;
  studentCode: string;
  rawName?: string;
  matchedStudentId?: string;
  matchedStudentName?: string;
  subject: string;
  area: string;
  period: string;
  rawGrade: string;
  parsedGrade: number | null;
  gradeScale: 'VIGESIMAL' | 'LITERAL' | 'UNKNOWN';
  status: RowStatus;
  issues: ValidationIssue[];
  confidence: number;
}

export interface ValidationSummary {
  totalRows: number;
  okCount: number;
  warningCount: number;
  errorCount: number;
  canConfirm: boolean;
  rows: ValidatedGradeRow[];
}

export interface ValidationOptions {
  existingStudents?: ExistingStudentInfo[];
  requireKnownStudents?: boolean;
  validPeriods?: string[];
}

/**
 * Calcula similitud básica entre dos nombres basada en intersección de palabras clave
 */
function namesMatchApproximately(nameA: string, nameB: string): boolean {
  const normA = normalizeString(nameA)
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const normB = normalizeString(nameB)
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (normA.length === 0 || normB.length === 0) return true;

  // Contar cuántas palabras de A aparecen en B
  const intersection = normA.filter((word) => normB.includes(word));
  return intersection.length > 0;
}

/**
 * Valida si un periodo tiene un formato razonable de año y bimestre/trimestre/semestre
 */
function isStandardPeriodFormat(period: string): boolean {
  if (!period) return false;
  const p = normalizeString(period);
  // Ejemplos válidos: 2025, 2025-1, 2025-b1, 2025-t2, 2026-s1, 1b, 2b, 1t, 2t, bimestre 1, trimestre 2, anual 2025
  const regex = /^(20\d\d([-_\s]?(b[1-4]|t[1-3]|s[1-2]|[1-4]b|[1-3]t|[1-2]|anual)?)?|(b[1-4]|t[1-3]|s[1-2]|[1-4]b|[1-3]t|bimestre\s*[1-4]|trimestre\s*[1-3]|semestre\s*[1-2]))$/;
  return regex.test(p);
}

/**
 * Valida una fila individual de nota
 */
export function validateGradeRow(
  row: ParsedGradeRow,
  options: ValidationOptions = {}
): ValidatedGradeRow {
  const issues: ValidationIssue[] = [];
  const { existingStudents, requireKnownStudents = false, validPeriods } = options;

  let matchedStudentId: string | undefined;
  let matchedStudentName: string | undefined;

  // 1. Validación de código de estudiante
  const cleanCode = (row.studentCode || '').trim();
  if (!cleanCode) {
    issues.push({
      field: 'studentCode',
      severity: 'ERROR',
      code: 'MISSING_STUDENT_CODE',
      message: 'El código o documento del estudiante es obligatorio.',
    });
  } else if (existingStudents && existingStudents.length > 0) {
    const student = existingStudents.find(
      (s) => normalizeString(s.studentCode) === normalizeString(cleanCode)
    );

    if (student) {
      matchedStudentId = student.id;
      matchedStudentName = student.fullName;

      // 2. Validación de discrepancia de nombre si se especificó
      if (row.rawName && row.rawName.trim()) {
        const matches = namesMatchApproximately(row.rawName, student.fullName);
        if (!matches) {
          issues.push({
            field: 'rawName',
            severity: 'WARNING',
            code: 'NAME_MISMATCH',
            message: `El nombre "${row.rawName}" no coincide claramente con "${student.fullName}" registrado en el sistema.`,
          });
        }
      }
    } else if (requireKnownStudents) {
      issues.push({
        field: 'studentCode',
        severity: 'ERROR',
        code: 'STUDENT_NOT_FOUND',
        message: `El código "${cleanCode}" no pertenece a ningún estudiante matriculado en este colegio.`,
      });
    } else {
      issues.push({
        field: 'studentCode',
        severity: 'WARNING',
        code: 'STUDENT_NOT_REGISTERED',
        message: `El código "${cleanCode}" no está registrado previamente. Se asociará si se crea el estudiante.`,
      });
    }
  }

  // 3. Validación de curso y área
  const cleanSubject = (row.subject || '').trim();
  if (!cleanSubject) {
    issues.push({
      field: 'subject',
      severity: 'ERROR',
      code: 'MISSING_SUBJECT',
      message: 'El nombre del curso o asignatura es obligatorio.',
    });
  } else {
    const area = row.area || mapSubjectToArea(cleanSubject);
    if (area === 'OTRO') {
      issues.push({
        field: 'subject',
        severity: 'WARNING',
        code: 'UNRECOGNIZED_AREA',
        message: `El curso "${cleanSubject}" no pudo ser mapeado automáticamente a un área MINEDU.`,
      });
    }
  }

  // 4. Validación de periodo
  const cleanPeriod = (row.period || '').trim();
  if (!cleanPeriod) {
    issues.push({
      field: 'period',
      severity: 'ERROR',
      code: 'MISSING_PERIOD',
      message: 'El periodo académico es obligatorio.',
    });
  } else if (validPeriods && validPeriods.length > 0) {
    const isValid = validPeriods.some((p) => normalizeString(p) === normalizeString(cleanPeriod));
    if (!isValid) {
      issues.push({
        field: 'period',
        severity: 'WARNING',
        code: 'PERIOD_NOT_IN_LIST',
        message: `El periodo "${cleanPeriod}" no coincide con los periodos activos del colegio.`,
      });
    }
  } else if (!isStandardPeriodFormat(cleanPeriod)) {
    issues.push({
      field: 'period',
      severity: 'WARNING',
      code: 'NON_STANDARD_PERIOD',
      message: `El periodo "${cleanPeriod}" no tiene un formato estándar sugerido (ej: 2025-1, 2025-B1).`,
    });
  }

  // 5. Validación de nota y calificación
  const cleanRawGrade = (row.rawGrade || '').trim();
  let parsedGrade = row.parsedGrade;
  let gradeScale = row.gradeScale;

  if (!cleanRawGrade) {
    issues.push({
      field: 'rawGrade',
      severity: 'ERROR',
      code: 'MISSING_GRADE',
      message: 'La nota o calificación es obligatoria.',
    });
  } else {
    // Si no vino pre-parseada o se editó
    if (parsedGrade === null || parsedGrade === undefined) {
      const norm = normalizeGrade(cleanRawGrade);
      parsedGrade = norm.grade;
      gradeScale = norm.scale;
    }

    if (parsedGrade === null) {
      issues.push({
        field: 'rawGrade',
        severity: 'ERROR',
        code: 'INVALID_GRADE_FORMAT',
        message: `La nota "${cleanRawGrade}" no es válida. Use escala 0-20 o literales peruanas (AD, A, B, C).`,
      });
    } else if (parsedGrade < 0 || parsedGrade > 20) {
      issues.push({
        field: 'parsedGrade',
        severity: 'ERROR',
        code: 'GRADE_OUT_OF_RANGE',
        message: `La nota calculada (${parsedGrade}) debe estar comprendida entre 0.00 y 20.00.`,
      });
    }
  }

  // 6. Clasificación de estado y cálculo de confianza
  const hasErrors = issues.some((i) => i.severity === 'ERROR');
  const hasWarnings = issues.some((i) => i.severity === 'WARNING');

  let status: RowStatus = 'OK';
  let confidence = 1.0;

  if (hasErrors) {
    status = 'ERROR';
    confidence = 0.0;
  } else if (hasWarnings) {
    status = 'WARNING';
    const warningCount = issues.filter((i) => i.severity === 'WARNING').length;
    confidence = warningCount === 1 ? 0.85 : 0.7;
  } else {
    status = 'OK';
    confidence = 1.0;
  }

  return {
    originalRowIndex: row.originalRowIndex,
    studentCode: cleanCode,
    rawName: row.rawName,
    matchedStudentId,
    matchedStudentName,
    subject: cleanSubject,
    area: row.area || mapSubjectToArea(cleanSubject),
    period: cleanPeriod,
    rawGrade: cleanRawGrade,
    parsedGrade,
    gradeScale,
    status,
    issues,
    confidence,
  };
}

/**
 * Valida una colección completa de notas y retorna el resumen
 */
export function validateGradeRows(
  rows: ParsedGradeRow[],
  options: ValidationOptions = {}
): ValidationSummary {
  const validatedRows = rows.map((row) => validateGradeRow(row, options));

  let okCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  for (const r of validatedRows) {
    if (r.status === 'OK') okCount++;
    else if (r.status === 'WARNING') warningCount++;
    else if (r.status === 'ERROR') errorCount++;
  }

  const canConfirm = validatedRows.length > 0 && errorCount === 0;

  return {
    totalRows: validatedRows.length,
    okCount,
    warningCount,
    errorCount,
    canConfirm,
    rows: validatedRows,
  };
}
