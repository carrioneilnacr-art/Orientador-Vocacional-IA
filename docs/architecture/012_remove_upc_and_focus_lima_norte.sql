-- ============================================================================
-- MIGRACIÓN 012: Depuración de UPC y Enfoque Estratégico en Sedes de Lima Norte
-- Orientador Vocacional IA
-- ============================================================================
-- Fecha: 2026-09-15
-- Propósito:
--   1. Eliminar de forma segura e integral todos los registros asociados a la
--      Universidad Peruana de Ciencias Aplicadas (UPC) por requerimiento de auditoría.
--   2. Actualizar plantillas de reglas vocacionales para eliminar menciones a UPC.
--   3. Limpiar registros de fuentes y base de conocimiento de chat vinculados a UPC.
-- ============================================================================

BEGIN;

-- 1. Actualizar plantillas de explicación en vocational_rules
UPDATE vocational_rules
SET explanation_template = REPLACE(explanation_template, ' en la UPC.', ' en las universidades más prestigiosas y licenciadas del país.')
WHERE explanation_template ILIKE '%UPC%';

UPDATE vocational_rules
SET explanation_template = REPLACE(explanation_template, ' en la UPC', ' en universidades de primer nivel')
WHERE explanation_template ILIKE '%UPC%';

-- 2. Eliminar artículos de conocimiento de chat vinculados a UPC
DELETE FROM chat_knowledge
WHERE title ILIKE '%UPC%' OR content ILIKE '%UPC%';

-- 3. Eliminar la institución UPC (la clave foránea con ON DELETE CASCADE eliminará
--    automáticamente: campuses, academic_offers, curricula, curriculum_courses,
--    tuition_fees, scholarships y employment_indicators).
DELETE FROM institutions
WHERE short_name = 'UPC';

-- 4. Eliminar fuentes asociadas a la UPC
DELETE FROM sources
WHERE source_name ILIKE '%UPC%';

COMMIT;
