import { parseGradeCSV, type ParseResult } from '@/lib/gradeParser';

export const MAX_GRADE_FILE_BYTES = 5 * 1024 * 1024;
const MAX_IMPORT_ROWS = 5_000;
const MAX_IMPORT_COLUMNS = 50;
const MAX_PDF_PAGES = 50;

export type GradeFileType = 'CSV' | 'XLSX' | 'PDF';

export interface ParsedGradeFile extends ParseResult {
  fileType: GradeFileType;
  sourceLabel: string;
}

function escapeCsvCell(value: string): string {
  if (!/[",\r\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function matrixToCsv(matrix: string[][]): string {
  return matrix
    .map((row) => row.map((value) => escapeCsvCell(value.trim())).join(','))
    .join('\n');
}

function trimMatrix(matrix: string[][]): string[][] {
  return matrix
    .map((row) => row.slice(0, MAX_IMPORT_COLUMNS).map((value) => value.trim()))
    .filter((row) => row.some(Boolean))
    .slice(0, MAX_IMPORT_ROWS + 1);
}

function assertValidResult(result: ParseResult, sourceLabel: string): ParseResult {
  if (result.rows.length > MAX_IMPORT_ROWS) {
    throw new Error(`El archivo supera el límite de ${MAX_IMPORT_ROWS} filas.`);
  }
  if (result.rows.length === 0 || result.errors.length > 0) {
    const detail = result.errors.join(' ');
    throw new Error(detail || `No se encontraron filas de notas reconocibles en ${sourceLabel}.`);
  }
  return result;
}

export function detectGradeFileType(fileName: string, mimeType: string, bytes: Uint8Array): GradeFileType {
  const extension = fileName.toLowerCase().split('.').pop() ?? '';
  const isPdf = bytes.length >= 5 && new TextDecoder('ascii').decode(bytes.slice(0, 5)) === '%PDF-';
  const isZip = bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

  if (extension === 'pdf' || mimeType === 'application/pdf') {
    if (!isPdf) throw new Error('El archivo no contiene una cabecera PDF válida.');
    return 'PDF';
  }

  if (
    extension === 'xlsx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    if (!isZip) throw new Error('El archivo no contiene un libro XLSX válido.');
    return 'XLSX';
  }

  if (extension === 'csv' || extension === 'txt' || mimeType.startsWith('text/')) {
    if (bytes.includes(0)) throw new Error('El archivo de texto contiene datos binarios no permitidos.');
    return 'CSV';
  }

  throw new Error('Formato no admitido. Usa CSV, XLSX o un PDF con una tabla de notas.');
}

async function parseXlsx(bytes: Uint8Array): Promise<ParsedGradeFile> {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const excelBuffer = Buffer.from(bytes) as unknown as Parameters<typeof workbook.xlsx.load>[0];
  await workbook.xlsx.load(excelBuffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error('El libro Excel no contiene hojas.');
  if (worksheet.actualRowCount > MAX_IMPORT_ROWS + 1) {
    throw new Error(`La primera hoja supera el límite de ${MAX_IMPORT_ROWS} filas.`);
  }
  if (worksheet.actualColumnCount > MAX_IMPORT_COLUMNS) {
    throw new Error(`La primera hoja supera el límite de ${MAX_IMPORT_COLUMNS} columnas.`);
  }

  const matrix: string[][] = [];
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    const values: string[] = [];
    for (let column = 1; column <= Math.min(worksheet.actualColumnCount, MAX_IMPORT_COLUMNS); column += 1) {
      values.push(row.getCell(column).text.trim());
    }
    matrix.push(values);
  });

  const normalized = trimMatrix(matrix);
  const parsed = assertValidResult(parseGradeCSV(matrixToCsv(normalized)), `la hoja “${worksheet.name}”`);
  return { ...parsed, fileType: 'XLSX', sourceLabel: worksheet.name };
}

async function parsePdf(bytes: Uint8Array): Promise<ParsedGradeFile> {
  const { DOMMatrix, ImageData, Path2D } = await import('@napi-rs/canvas');
  Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: bytes });
  try {
    const info = await parser.getInfo();
    if (info.total > MAX_PDF_PAGES) {
      throw new Error(`El PDF supera el límite de ${MAX_PDF_PAGES} páginas.`);
    }

    const result = await parser.getTable();
    let best: { parsed: ParseResult; label: string } | null = null;
    const groupedTables = new Map<string, { matrix: string[][]; label: string }>();

    for (const page of result.pages) {
      for (let tableIndex = 0; tableIndex < page.tables.length; tableIndex += 1) {
        const table = trimMatrix(page.tables[tableIndex].map((row) => row.map((cell) => String(cell))));
        if (table.length < 2) continue;
        const key = table[0].map((cell) => cell.toLowerCase().trim()).join('|');
        const group = groupedTables.get(key);
        if (group) group.matrix.push(...table.slice(1));
        else groupedTables.set(key, { matrix: [...table], label: `Página ${page.num}, tabla ${tableIndex + 1}` });
        const parsed = parseGradeCSV(matrixToCsv(table));
        if (parsed.errors.length === 0 && parsed.rows.length > (best?.parsed.rows.length ?? 0)) {
          best = { parsed, label: `Página ${page.num}, tabla ${tableIndex + 1}` };
        }
      }
    }

    for (const group of groupedTables.values()) {
      const parsed = parseGradeCSV(matrixToCsv(group.matrix));
      if (parsed.errors.length === 0 && parsed.rows.length > (best?.parsed.rows.length ?? 0)) {
        best = { parsed, label: group.label };
      }
    }

    if (!best) {
      throw new Error(
        'No se identificó una tabla de notas con columnas de código, curso y nota. Revisa el PDF o usa la plantilla Excel/CSV.'
      );
    }

    const parsed = assertValidResult(best.parsed, best.label);
    return { ...parsed, fileType: 'PDF', sourceLabel: best.label };
  } finally {
    await parser.destroy();
  }
}

export async function parseGradeFile(input: {
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
}): Promise<ParsedGradeFile> {
  if (input.bytes.byteLength === 0) throw new Error('El archivo está vacío.');
  if (input.bytes.byteLength > MAX_GRADE_FILE_BYTES) {
    throw new Error('El archivo supera el límite de 5 MB.');
  }

  const fileType = detectGradeFileType(input.fileName, input.mimeType, input.bytes);
  if (fileType === 'XLSX') return parseXlsx(input.bytes);
  if (fileType === 'PDF') return parsePdf(input.bytes);

  const text = new TextDecoder('utf-8', { fatal: true }).decode(input.bytes);
  const parsed = assertValidResult(parseGradeCSV(text), 'el archivo CSV');
  return { ...parsed, fileType: 'CSV', sourceLabel: input.fileName };
}
