import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gradeImports, academicRecords, auditLog } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getActiveStaffSessionFromRequest, hasStaffPermission } from '@/lib/staffAuth';

export async function POST(req: NextRequest) {
  try {
    const session = await getActiveStaffSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Inicia sesión para continuar.' }, { status: 401 });
    if (!hasStaffPermission(session.role, 'grades:confirm')) {
      return NextResponse.json({ error: 'No tienes permiso para revertir importaciones.' }, { status: 403 });
    }
    const body = await req.json().catch(() => null);
    const parsed = z.object({ importId: z.string().uuid() }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Identificador de importación inválido.' }, { status: 400 });
    const { importId } = parsed.data;

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
      .where(and(eq(gradeImports.id, importId), eq(gradeImports.schoolId, session.schoolId)))
      .limit(1);

    if (!existingImport) {
      return NextResponse.json(
        { error: 'No se encontró la importación o no tienes acceso.' },
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
      actorId: session.userId,
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
  } catch (error) {
    console.error('[API Revertir Notas] Error:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json(
      { error: 'Error al revertir la importación de calificaciones.' },
      { status: 500 }
    );
  }
}
