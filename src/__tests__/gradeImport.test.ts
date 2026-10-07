import { describe, it, expect } from 'vitest';
import {
  normalizeGrade,
  mapSubjectToArea,
  detectDelimiter,
  parseGradeCSV,
  generateGradeCsvTemplate,
} from '../lib/gradeParser';
import { validateGradeRow, validateGradeRows } from '../lib/gradeValidator';

describe('gradeParser - Normalización de notas', () => {
  it('normaliza notas vigesimales numéricas (0-20)', () => {
    expect(normalizeGrade(20)).toEqual({ grade: 20, isValid: true, scale: 'VIGESIMAL' });
    expect(normalizeGrade('15.5')).toEqual({ grade: 15.5, isValid: true, scale: 'VIGESIMAL' });
    expect(normalizeGrade('18,75')).toEqual({ grade: 18.75, isValid: true, scale: 'VIGESIMAL' });
    expect(normalizeGrade('0')).toEqual({ grade: 0, isValid: true, scale: 'VIGESIMAL' });
    expect(normalizeGrade('11')).toEqual({ grade: 11, isValid: true, scale: 'VIGESIMAL' });
  });

  it('normaliza escala literal peruana MINEDU (AD, A, B, C)', () => {
    expect(normalizeGrade('AD')).toEqual({ grade: 19, isValid: true, scale: 'LITERAL' });
    expect(normalizeGrade('ad')).toEqual({ grade: 19, isValid: true, scale: 'LITERAL' });
    expect(normalizeGrade('A')).toEqual({ grade: 16, isValid: true, scale: 'LITERAL' });
    expect(normalizeGrade('B')).toEqual({ grade: 13, isValid: true, scale: 'LITERAL' });
    expect(normalizeGrade('  c  ')).toEqual({ grade: 10, isValid: true, scale: 'LITERAL' });
  });

  it('rechaza notas fuera de rango o caracteres inválidos', () => {
    expect(normalizeGrade(21).isValid).toBe(false);
    expect(normalizeGrade(-1).isValid).toBe(false);
    expect(normalizeGrade('N/A').isValid).toBe(false);
    expect(normalizeGrade('').isValid).toBe(false);
    expect(normalizeGrade(null).isValid).toBe(false);
  });
});

describe('gradeParser - Mapeo de áreas curriculares MINEDU', () => {
  it('mapea materias a Matemática', () => {
    expect(mapSubjectToArea('Matemática')).toBe('Matemática');
    expect(mapSubjectToArea('Álgebra Superior')).toBe('Matemática');
    expect(mapSubjectToArea('Geometría y Trigonometría')).toBe('Matemática');
    expect(mapSubjectToArea('Razonamiento Matemático (RM)')).toBe('Matemática');
  });

  it('mapea materias a Comunicación', () => {
    expect(mapSubjectToArea('Lenguaje y Literatura')).toBe('Comunicación');
    expect(mapSubjectToArea('Razonamiento Verbal')).toBe('Comunicación');
    expect(mapSubjectToArea('Plan Lector')).toBe('Comunicación');
  });

  it('mapea materias a Ciencia y Tecnología', () => {
    expect(mapSubjectToArea('Ciencia y Tecnología')).toBe('Ciencia y Tecnología');
    expect(mapSubjectToArea('Biología')).toBe('Ciencia y Tecnología');
    expect(mapSubjectToArea('Química Orgánica')).toBe('Ciencia y Tecnología');
    expect(mapSubjectToArea('Física Elemental')).toBe('Ciencia y Tecnología');
  });

  it('mapea materias a Ciencias Sociales y DPCC', () => {
    expect(mapSubjectToArea('Historia del Perú')).toBe('Ciencias Sociales');
    expect(mapSubjectToArea('Geografía y Economía')).toBe('Ciencias Sociales');
    expect(mapSubjectToArea('DPCC - Desarrollo Personal')).toBe('Desarrollo Personal, Ciudadanía y Cívica');
  });

  it('mapea materias a Inglés, Arte, EPT y Educación Física', () => {
    expect(mapSubjectToArea('Inglés Técnico')).toBe('Inglés');
    expect(mapSubjectToArea('Arte y Cultura (Música)')).toBe('Arte y Cultura');
    expect(mapSubjectToArea('Educación para el Trabajo (Robótica)')).toBe('Educación para el Trabajo');
    expect(mapSubjectToArea('Educación Física')).toBe('Educación Física');
    expect(mapSubjectToArea('Educación Religiosa')).toBe('Educación Religiosa');
  });

  it('asigna "OTRO" a materias irreconocibles', () => {
    expect(mapSubjectToArea('Ajedrez Extracurricular')).toBe('OTRO');
  });
});

describe('gradeParser - Parseo de CSV', () => {
  it('detecta delimitador correctamente (coma, punto y coma, tab)', () => {
    expect(detectDelimiter('codigo,curso,nota')).toBe(',');
    expect(detectDelimiter('codigo;curso;nota')).toBe(';');
    expect(detectDelimiter('codigo\tcurso\tnota')).toBe('\t');
  });

  it('parsea CSV con encabezados estándar y variados', () => {
    const csv = `codigo_estudiante,nombres,materia,periodo,calificacion
HON-101,Juan Perez,Matemática,2025-1,17.5
HON-102,Maria Lopez,Comunicación,2025-1,AD
HON-103,Pedro Gomez,Biología,2025-1,B`;

    const result = parseGradeCSV(csv);
    expect(result.errors.length).toBe(0);
    expect(result.rows.length).toBe(3);

    expect(result.rows[0].studentCode).toBe('HON-101');
    expect(result.rows[0].area).toBe('Matemática');
    expect(result.rows[0].parsedGrade).toBe(17.5);
    expect(result.rows[0].gradeScale).toBe('VIGESIMAL');

    expect(result.rows[1].studentCode).toBe('HON-102');
    expect(result.rows[1].area).toBe('Comunicación');
    expect(result.rows[1].parsedGrade).toBe(19);
    expect(result.rows[1].gradeScale).toBe('LITERAL');

    expect(result.rows[2].parsedGrade).toBe(13);
  });

  it('reporta error si faltan columnas obligatorias', () => {
    const invalidCsv = `nombre,periodo
Juan Perez,2025-1`;
    const result = parseGradeCSV(invalidCsv);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes('código'))).toBe(true);
  });

  it('genera la plantilla CSV oficial con formato correcto', () => {
    const template = generateGradeCsvTemplate();
    expect(template).toContain('codigo_estudiante');
    expect(template).toContain('curso');
    expect(template).toContain('nota');
    const parsed = parseGradeCSV(template);
    expect(parsed.errors.length).toBe(0);
    expect(parsed.rows.length).toBeGreaterThanOrEqual(3);
  });
});

describe('gradeValidator - Reglas de validación fila por fila', () => {
  const dummyStudents = [
    { id: 'uuid-1', studentCode: 'HON-101', fullName: 'Juan Perez Silva' },
    { id: 'uuid-2', studentCode: 'HON-102', fullName: 'Maria Lopez Ruiz' },
  ];

  it('clasifica como OK una fila perfecta', () => {
    const row = {
      originalRowIndex: 2,
      studentCode: 'HON-101',
      rawName: 'Juan Perez',
      subject: 'Álgebra',
      area: 'Matemática',
      period: '2025-B1',
      rawGrade: '18',
      parsedGrade: 18,
      gradeScale: 'VIGESIMAL' as const,
    };

    const validated = validateGradeRow(row, { existingStudents: dummyStudents });
    expect(validated.status).toBe('OK');
    expect(validated.confidence).toBe(1.0);
    expect(validated.matchedStudentId).toBe('uuid-1');
    expect(validated.issues.length).toBe(0);
  });

  it('clasifica como ERROR si el código falta o la nota es inválida', () => {
    const rowMissingCode = {
      originalRowIndex: 2,
      studentCode: '',
      subject: 'Matemática',
      area: 'Matemática',
      period: '2025-1',
      rawGrade: '15',
      parsedGrade: 15,
      gradeScale: 'VIGESIMAL' as const,
    };

    const val1 = validateGradeRow(rowMissingCode);
    expect(val1.status).toBe('ERROR');
    expect(val1.issues.some((i) => i.code === 'MISSING_STUDENT_CODE')).toBe(true);

    const rowInvalidGrade = {
      originalRowIndex: 3,
      studentCode: 'HON-101',
      subject: 'Matemática',
      area: 'Matemática',
      period: '2025-1',
      rawGrade: '25', // fuera de rango
      parsedGrade: null,
      gradeScale: 'UNKNOWN' as const,
    };

    const val2 = validateGradeRow(rowInvalidGrade);
    expect(val2.status).toBe('ERROR');
    expect(val2.issues.some((i) => i.severity === 'ERROR')).toBe(true);
  });

  it('genera WARNING si el nombre difiere del registrado o el curso no tiene área oficial', () => {
    const rowNameMismatch = {
      originalRowIndex: 2,
      studentCode: 'HON-101',
      rawName: 'Roberto Gomez Bolaños', // No coincide con Juan Perez Silva
      subject: 'Curso No Reconocido',
      area: 'OTRO',
      period: '2025-1',
      rawGrade: '16',
      parsedGrade: 16,
      gradeScale: 'VIGESIMAL' as const,
    };

    const validated = validateGradeRow(rowNameMismatch, { existingStudents: dummyStudents });
    expect(validated.status).toBe('WARNING');
    expect(validated.issues.some((i) => i.code === 'NAME_MISMATCH')).toBe(true);
    expect(validated.issues.some((i) => i.code === 'UNRECOGNIZED_AREA')).toBe(true);
    expect(validated.confidence).toBeLessThan(1.0);
  });

  it('calcula correctamente el resumen y canConfirm en validateGradeRows', () => {
    const rows = [
      {
        originalRowIndex: 2,
        studentCode: 'HON-101',
        subject: 'Matemática',
        area: 'Matemática',
        period: '2025-1',
        rawGrade: '18',
        parsedGrade: 18,
        gradeScale: 'VIGESIMAL' as const,
      },
      {
        originalRowIndex: 3,
        studentCode: 'HON-102',
        subject: 'Comunicación',
        area: 'Comunicación',
        period: '2025-1',
        rawGrade: 'A',
        parsedGrade: 16,
        gradeScale: 'LITERAL' as const,
      },
    ];

    const summary = validateGradeRows(rows);
    expect(summary.totalRows).toBe(2);
    expect(summary.okCount).toBe(2);
    expect(summary.errorCount).toBe(0);
    expect(summary.canConfirm).toBe(true);

    // Si agregamos una con error
    const withError = [
      ...rows,
      {
        originalRowIndex: 4,
        studentCode: '',
        subject: '',
        area: 'OTRO',
        period: '',
        rawGrade: 'XYZ',
        parsedGrade: null,
        gradeScale: 'UNKNOWN' as const,
      },
    ];

    const summaryWithError = validateGradeRows(withError);
    expect(summaryWithError.errorCount).toBe(1);
    expect(summaryWithError.canConfirm).toBe(false);
  });
});
