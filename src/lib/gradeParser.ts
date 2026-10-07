/**
 * gradeParser.ts
 * Parser flexible y normalizador de notas escolares para colegios peruanos (MINEDU).
 */

export interface ParsedGradeRow {
  originalRowIndex: number;
  studentCode: string;
  rawName?: string;
  subject: string;
  area: string;
  period: string;
  rawGrade: string;
  parsedGrade: number | null;
  gradeScale: 'VIGESIMAL' | 'LITERAL' | 'UNKNOWN';
}

export interface ParseResult {
  headers: string[];
  detectedColumns: {
    studentCode: string | null;
    rawName: string | null;
    subject: string | null;
    period: string | null;
    rawGrade: string | null;
  };
  rows: ParsedGradeRow[];
  errors: string[];
}

/**
 * Áreas curriculares oficiales según Currículo Nacional del MINEDU (Secundaria)
 */
export const MINEDU_AREAS = [
  'Matemática',
  'Comunicación',
  'Ciencia y Tecnología',
  'Ciencias Sociales',
  'Desarrollo Personal, Ciudadanía y Cívica',
  'Inglés',
  'Arte y Cultura',
  'Educación para el Trabajo',
  'Educación Física',
  'Educación Religiosa',
  'Tutoría y Orientación Educativa',
] as const;

export type MineduArea = (typeof MINEDU_AREAS)[number] | 'OTRO';

/**
 * Normaliza cadenas quitando tildes, signos de puntuación extra y convirtiendo a minúsculas
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Mapea el nombre de una materia/curso al Área Curricular oficial MINEDU.
 */
export function mapSubjectToArea(subject: string): MineduArea {
  const norm = normalizeString(subject);
  if (!norm) return 'OTRO';

  // 1. Matemática
  if (
    norm.includes('matematica') ||
    norm.includes('algebra') ||
    norm.includes('geometria') ||
    norm.includes('trigonometria') ||
    norm.includes('aritmetica') ||
    norm.includes('razonamiento matematico') ||
    norm === 'rm' ||
    norm.includes('calculo') ||
    norm.includes('estadistica')
  ) {
    return 'Matemática';
  }

  // 2. Comunicación
  if (
    norm.includes('comunicacion') ||
    norm.includes('lenguaje') ||
    norm.includes('literatura') ||
    norm.includes('razonamiento verbal') ||
    norm === 'rv' ||
    norm.includes('plan lector') ||
    norm.includes('redaccion') ||
    norm.includes('gramatica')
  ) {
    return 'Comunicación';
  }

  // 3. Educación Física (se evalúa antes de Física para evitar colisión)
  if (
    norm.includes('educacion fisica') ||
    norm.includes('ed fisica') ||
    norm.includes('ed. fisica') ||
    norm.includes('ed.fisica') ||
    norm.includes('deporte') ||
    norm.includes('psicomotricidad')
  ) {
    return 'Educación Física';
  }

  // 4. Ciencia y Tecnología
  if (
    norm.includes('ciencia y tecnologia') ||
    norm.includes('cyt') ||
    norm.includes('cta') ||
    norm.includes('biologia') ||
    norm.includes('quimica') ||
    norm.includes('fisica') ||
    norm.includes('ciencias naturales') ||
    norm.includes('ecologia') ||
    norm.includes('anatomia')
  ) {
    return 'Ciencia y Tecnología';
  }

  // 4. Desarrollo Personal, Ciudadanía y Cívica (DPCC)
  if (
    norm.includes('dpcc') ||
    norm.includes('desarrollo personal') ||
    norm.includes('ciudadania') ||
    norm.includes('civica') ||
    norm.includes('fcc') ||
    norm.includes('formacion ciudadana')
  ) {
    return 'Desarrollo Personal, Ciudadanía y Cívica';
  }

  // 5. Ciencias Sociales (CC.SS / HGE)
  if (
    norm.includes('ciencias sociales') ||
    norm.includes('sociales') ||
    norm.includes('historia') ||
    norm.includes('geografia') ||
    norm.includes('economia') ||
    norm.includes('hge')
  ) {
    return 'Ciencias Sociales';
  }

  // 6. Inglés
  if (
    norm.includes('ingles') ||
    norm.includes('english') ||
    norm.includes('idioma extranjero') ||
    norm.includes('lengua extranjera')
  ) {
    return 'Inglés';
  }

  // 7. Arte y Cultura
  if (
    norm.includes('arte') ||
    norm.includes('musica') ||
    norm.includes('danza') ||
    norm.includes('teatro') ||
    norm.includes('artes plasticas') ||
    norm.includes('dibujo') ||
    norm.includes('pintura')
  ) {
    return 'Arte y Cultura';
  }

  // 8. Educación para el Trabajo (EPT)
  if (
    norm.includes('educacion para el trabajo') ||
    norm.includes('ept') ||
    norm.includes('computacion') ||
    norm.includes('informatica') ||
    norm.includes('robotica') ||
    norm.includes('programacion') ||
    norm.includes('emprendimiento') ||
    norm.includes('gestion empresarial')
  ) {
    return 'Educación para el Trabajo';
  }


  // 10. Educación Religiosa
  if (
    norm.includes('religion') ||
    norm.includes('educacion religiosa') ||
    norm.includes('ed religiosa') ||
    norm.includes('ed. religiosa') ||
    norm.includes('fe y valores')
  ) {
    return 'Educación Religiosa';
  }

  // 11. Tutoría
  if (
    norm.includes('tutoria') ||
    norm.includes('toe') ||
    norm.includes('orientacion vocacional') ||
    norm.includes('orientacion educativa')
  ) {
    return 'Tutoría y Orientación Educativa';
  }

  return 'OTRO';
}

/**
 * Normaliza una nota en escala vigesimal (0-20) o literal peruana MINEDU (AD, A, B, C)
 */
export function normalizeGrade(raw: string | number | null | undefined): {
  grade: number | null;
  isValid: boolean;
  scale: 'VIGESIMAL' | 'LITERAL' | 'UNKNOWN';
} {
  if (raw === null || raw === undefined) {
    return { grade: null, isValid: false, scale: 'UNKNOWN' };
  }

  const str = String(raw).trim().toUpperCase();
  if (!str) {
    return { grade: null, isValid: false, scale: 'UNKNOWN' };
  }

  // 1. Escala literal MINEDU
  switch (str) {
    case 'AD':
      return { grade: 19, isValid: true, scale: 'LITERAL' };
    case 'A':
      return { grade: 16, isValid: true, scale: 'LITERAL' };
    case 'B':
      return { grade: 13, isValid: true, scale: 'LITERAL' };
    case 'C':
      return { grade: 10, isValid: true, scale: 'LITERAL' };
  }

  // 2. Escala vigesimal (0 a 20)
  // Soporte para comas decimales "14,5" -> "14.5"
  const cleanedNum = str.replace(',', '.');
  const num = Number(cleanedNum);

  if (!isNaN(num) && isFinite(num)) {
    if (num >= 0 && num <= 20) {
      // Redondeo a 2 decimales
      const rounded = Math.round(num * 100) / 100;
      return { grade: rounded, isValid: true, scale: 'VIGESIMAL' };
    }
  }

  return { grade: null, isValid: false, scale: 'UNKNOWN' };
}

/**
 * Detecta delimitador de columnas CSV (coma, punto y coma, tabulación)
 */
export function detectDelimiter(firstLine: string): string {
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const tabs = (firstLine.match(/\t/g) || []).length;

  if (tabs > semicolons && tabs > commas) return '\t';
  if (semicolons > commas) return ';';
  return ',';
}

/**
 * Parsea una línea de texto CSV respetando comillas y delimitadores
 */
export function parseCSVLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' || char === "'") {
      if (inQuotes && nextChar === char) {
        // Comilla escapada ("" -> ")
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

/**
 * Alias reconocidos para mapeo flexible de columnas
 */
const COLUMN_ALIASES = {
  studentCode: [
    'codigo',
    'código',
    'cod',
    'codigo_estudiante',
    'cod_estudiante',
    'codigo_alumno',
    'cod_alumno',
    'student_code',
    'studentcode',
    'dni',
    'id_estudiante',
    'matricula',
    'codigo estudiante',
    'codigo alumno',
  ],
  rawName: [
    'nombre',
    'nombres',
    'estudiante',
    'alumno',
    'nombre_estudiante',
    'nombre_alumno',
    'apellidos_y_nombres',
    'apellidos y nombres',
    'nombre_completo',
    'nombre completo',
    'full_name',
    'fullname',
  ],
  subject: [
    'curso',
    'materia',
    'asignatura',
    'subject',
    'area',
    'area_curricular',
    'unidad_didactica',
    'nombre_curso',
    'disciplina',
  ],
  period: [
    'periodo',
    'period',
    'bimestre',
    'trimestre',
    'semestre',
    'ciclo',
    'ano',
    'año',
    'year',
    'fase',
  ],
  rawGrade: [
    'nota',
    'calificacion',
    'calificación',
    'grade',
    'promedio',
    'puntaje',
    'score',
    'calif',
    'evaluacion',
  ],
};

/**
 * Detecta qué columna corresponde a qué atributo
 */
export function mapHeaderColumns(headers: string[]): {
  studentCode: number;
  rawName: number;
  subject: number;
  period: number;
  rawGrade: number;
} {
  const result = {
    studentCode: -1,
    rawName: -1,
    subject: -1,
    period: -1,
    rawGrade: -1,
  };

  headers.forEach((rawHeader, idx) => {
    const h = normalizeString(rawHeader);
    if (!h) return;

    if (result.studentCode === -1 && COLUMN_ALIASES.studentCode.some((alias) => normalizeString(alias) === h)) {
      result.studentCode = idx;
    } else if (result.rawGrade === -1 && COLUMN_ALIASES.rawGrade.some((alias) => normalizeString(alias) === h)) {
      result.rawGrade = idx;
    } else if (result.subject === -1 && COLUMN_ALIASES.subject.some((alias) => normalizeString(alias) === h)) {
      result.subject = idx;
    } else if (result.period === -1 && COLUMN_ALIASES.period.some((alias) => normalizeString(alias) === h)) {
      result.period = idx;
    } else if (result.rawName === -1 && COLUMN_ALIASES.rawName.some((alias) => normalizeString(alias) === h)) {
      result.rawName = idx;
    }
  });

  return result;
}

/**
 * Parsea el contenido CSV completo de notas
 */
export function parseGradeCSV(csvContent: string): ParseResult {
  const errors: string[] = [];
  // Remover BOM si está presente
  const cleanContent = csvContent.replace(/^\uFEFF/, '').trim();

  if (!cleanContent) {
    return {
      headers: [],
      detectedColumns: { studentCode: null, rawName: null, subject: null, period: null, rawGrade: null },
      rows: [],
      errors: ['El archivo CSV está vacío.'],
    };
  }

  const lines = cleanContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      headers: [],
      detectedColumns: { studentCode: null, rawName: null, subject: null, period: null, rawGrade: null },
      rows: [],
      errors: ['El archivo debe contener al menos una fila de encabezados y una fila de datos.'],
    };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter);
  const colMap = mapHeaderColumns(headers);

  // Validar columnas obligatorias mínimas: codigo, curso, nota
  if (colMap.studentCode === -1) {
    errors.push('No se detectó la columna de código o DNI del estudiante (ej: "codigo", "dni", "cod_estudiante").');
  }
  if (colMap.subject === -1) {
    errors.push('No se detectó la columna del curso o asignatura (ej: "curso", "materia", "asignatura").');
  }
  if (colMap.rawGrade === -1) {
    errors.push('No se detectó la columna de nota o calificación (ej: "nota", "calificacion", "promedio").');
  }

  const parsedRows: ParsedGradeRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const values = parseCSVLine(rawLine, delimiter);

    // Ignorar líneas vacías
    if (values.every((v) => !v)) continue;

    const studentCode = colMap.studentCode !== -1 ? (values[colMap.studentCode] || '').trim() : '';
    const rawName = colMap.rawName !== -1 ? (values[colMap.rawName] || '').trim() : undefined;
    const subject = colMap.subject !== -1 ? (values[colMap.subject] || '').trim() : '';
    const period = colMap.period !== -1 ? (values[colMap.period] || '2025-1').trim() : '2025-1';
    const rawGrade = colMap.rawGrade !== -1 ? (values[colMap.rawGrade] || '').trim() : '';

    const norm = normalizeGrade(rawGrade);
    const area = mapSubjectToArea(subject);

    parsedRows.push({
      originalRowIndex: i + 1,
      studentCode,
      rawName: rawName || undefined,
      subject,
      area,
      period,
      rawGrade,
      parsedGrade: norm.grade,
      gradeScale: norm.scale,
    });
  }

  return {
    headers,
    detectedColumns: {
      studentCode: colMap.studentCode !== -1 ? headers[colMap.studentCode] : null,
      rawName: colMap.rawName !== -1 ? headers[colMap.rawName] : null,
      subject: colMap.subject !== -1 ? headers[colMap.subject] : null,
      period: colMap.period !== -1 ? headers[colMap.period] : null,
      rawGrade: colMap.rawGrade !== -1 ? headers[colMap.rawGrade] : null,
    },
    rows: parsedRows,
    errors,
  };
}

/**
 * Genera el CSV de plantilla oficial con ejemplos listos para descargar
 */
export function generateGradeCsvTemplate(): string {
  const headers = ['codigo_estudiante', 'nombres_alumno', 'curso', 'periodo', 'nota'];
  const sampleRows = [
    ['HON-001', 'Ana Lucia Ramos Vargas', 'Matemática (Álgebra)', '2025-B1', '18.5'],
    ['HON-002', 'Carlos Mendoza Quispe', 'Comunicación Integral', '2025-B1', 'AD'],
    ['HON-003', 'Diego Fernando Sanchez', 'Física Elemental', '2025-B1', '14'],
    ['HON-004', 'Elena Sofia Castro', 'Historia del Perú', '2025-B1', 'A'],
    ['HON-005', 'Gabriel Torres Morales', 'Inglés Técnico', '2025-B1', '16'],
  ];

  const lines = [headers.join(','), ...sampleRows.map((r) => r.join(','))];
  return lines.join('\n');
}
