import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gradeImports, academicRecords, auditLog } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { importId } = body;

    if (!importId) {
      return NextResponse.json(
        { error: 'El identificador de importación (importId) es obligatorio.' },
        { status: 400 }
      );
    }

    // 1. Verificar si existe la importación
    const [existingImport] = await db
      .select()
      .from(gradeImports)
      .where(eq(gradeImports.id, importId))
      .limit(1);

    if (!existingImport) {
      return NextResponse.json(
        { error: 'No se encontró la importación especificada.' },
        { status: 404 }
      );
    }

    // 2. Eliminar los registros académicos vinculados a esta importación
    const deletedRecords = await db
      .delete(academicRecords)
      .where(eq(academicRecords.importId, importId))
      .returning({ id: academicRecords.id });

    // 3. Marcar la importación como REVERTED
    await db
      .update(gradeImports)
      .set({
        status: 'REVERTED',
      })
      .where(eq(gradeImports.id, importId));

    // 4. Registrar en auditoría
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      action: 'IMPORT_REVERTED',
      targetType: 'grade_imports',
      targetId: importId,
      metadata: {
        schoolId: existingImport.schoolId,
        revertedCount: deletedRecords.length,
      },
    });

    return NextResponse.json({
      success: true,
      importId,
      revertedCount: deletedRecords.length,
      message: `Se revirtió la importación eliminando ${deletedRecords.length} calificaciones de los expedientes.`,
    });
  } catch (error: any) {
    console.error('[API Revertir Notas] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al revertir la importación de calificaciones.' },
      { status: 500 }
    );
  }
}
