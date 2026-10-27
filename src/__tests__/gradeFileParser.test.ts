import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import { detectGradeFileType, parseGradeFile } from '@/lib/gradeFileParser';

describe('gradeFileParser', () => {
  it('rechaza extensiones no permitidas aunque contengan texto', () => {
    expect(() => detectGradeFileType('notas.docx', 'application/octet-stream', new TextEncoder().encode('texto')))
      .toThrow('Formato no admitido');
  });

  it('valida la firma real del archivo y no confía solo en la extensión', () => {
    expect(() => detectGradeFileType('notas.pdf', 'application/pdf', new TextEncoder().encode('falso')))
      .toThrow('cabecera PDF válida');
    expect(() => detectGradeFileType('notas.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', new Uint8Array([1, 2, 3, 4])))
      .toThrow('libro XLSX válido');
  });

  it('extrae una hoja XLSX y conserva filas para la vista previa', async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bimestre 1');
    sheet.addRow(['codigo_estudiante', 'nombres_alumno', 'curso', 'periodo', 'nota']);
    sheet.addRow(['HON-001', 'Andrea Salazar', 'Matemática', '2026-B1', 18]);
    sheet.addRow(['HON-002', 'Bruno Castillo', 'Comunicación', '2026-B1', 'A']);
    const buffer = await workbook.xlsx.writeBuffer();

    const result = await parseGradeFile({
      fileName: 'notas.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      bytes: new Uint8Array(buffer),
    });

    expect(result.fileType).toBe('XLSX');
    expect(result.sourceLabel).toBe('Bimestre 1');
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({ studentCode: 'HON-001', parsedGrade: 18 });
    expect(result.rows[1]).toMatchObject({ studentCode: 'HON-002', parsedGrade: 16 });
  });

  it('rechaza una hoja Excel sin columnas reconocibles', async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Datos');
    sheet.addRow(['dato', 'valor']);
    sheet.addRow(['uno', 'dos']);
    const buffer = await workbook.xlsx.writeBuffer();

    await expect(parseGradeFile({
      fileName: 'datos.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      bytes: new Uint8Array(buffer),
    })).rejects.toThrow('No se detectó la columna');
  });

  it('extrae una tabla de notas de un PDF seleccionable', async () => {
    const pdf = new jsPDF({ orientation: 'landscape' });
    pdf.setFontSize(9);
    const rows = [
      ['codigo_estudiante', 'nombres_alumno', 'curso', 'periodo', 'nota'],
      ['CMH-2026-001', 'Adriana Salazar Rios', 'Matematica', '2026-B1', '18'],
    ];
    const x = [10, 68, 145, 194, 248, 285];
    x.forEach((position) => pdf.line(position, 12, position, 40));
    [12, 26, 40].forEach((position) => pdf.line(10, position, 285, position));
    rows.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      pdf.text(cell, x[columnIndex] + 2, 20 + rowIndex * 14);
    }));
    const bytes = new Uint8Array(pdf.output('arraybuffer'));
    const result = await parseGradeFile({ fileName: 'notas.pdf', mimeType: 'application/pdf', bytes });
    expect(result.fileType).toBe('PDF');
    expect(result.rows[0]).toMatchObject({ studentCode: 'CMH-2026-001', parsedGrade: 18 });
  });
});
