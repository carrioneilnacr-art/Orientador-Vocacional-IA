# Regla: Toda la data de dominio va en Supabase — NUNCA en archivos locales ni GitHub

## Regla absoluta e irrompible

**TODA información de dominio del proyecto Orientador Vocacional IA debe residir exclusivamente en Supabase.**
Esto incluye, sin excepción:

| Categoría | Tabla en Supabase | NO hacer |
|---|---|---|
| Preguntas del cuestionario | `questionnaire_questions` | Hardcodear texto en `.ts` / `.json` |
| Opciones del cuestionario | `questionnaire_options` | Hardcodear opciones en `.ts` / `.json` |
| Carreras universitarias | `careers` | Definir carreras en archivos locales |
| Universidades / instituciones | `universities` | Listar universidades en código |
| Mallas curriculares | `curriculum_courses` | Guardar mallas en `.ts` / `.sql` locales |
| Sedes / campus | `campuses` | Hardcodear sedes en archivos |
| Oferta académica | `academic_offers` | Combinar carreras y sedes en código |
| Costos y aranceles | `tuition_fees` | Poner precios en variables locales |
| Reglas vocacionales (scoring) | `vocational_rules` | Poner weights/scores en código |
| Sesiones de usuario | `user_sessions` | Guardar resultados solo en localStorage |

---

## Por qué es una regla dura

1. **Consistencia**: Un cambio en Supabase se refleja inmediatamente en producción sin redeploy.
2. **Seguridad**: Datos de universidades, precios y mallas NO van en un repo público de GitHub.
3. **Escalabilidad**: Nuevas universidades, carreras, preguntas = solo INSERT en Supabase, cero cambios de código.
4. **Fuente única de verdad**: El archivo `.ts` local causó confusión porque la app ignoraba sus cambios y usaba la BD.

---

## Qué SÍ puede ir en archivos locales / GitHub

- Código de la aplicación (componentes, páginas, hooks, API routes)
- Esquemas Drizzle (`src/db/schema.ts`) — define la estructura, nunca los datos
- Migraciones SQL (`docs/architecture/*.sql`) — scripts de migración, no datos de producción
- Tipos TypeScript de las entidades (interfaces, enums)
- Configuración (`.env.example`, `next.config.ts`, etc.)

---

## Cómo agregar data nueva

### CORRECTO: INSERT directo en Supabase via MCP

```sql
-- Agregar nueva universidad
INSERT INTO universities (name, slug, country) VALUES ('UPN', 'upn', 'PE');

-- Agregar nueva pregunta
INSERT INTO questionnaire_questions (code, question_text, helper_text, mission_number, order_number, is_active)
VALUES ('Q17_NEW', 'Texto de pregunta...', 'Helper text...', 1, 17, true);
```

Usar siempre: herramienta `supabase / execute_sql`, proyecto `ottyfzyfuayjomtucujy`

### INCORRECTO: Hardcodear en archivos TypeScript

```typescript
// NUNCA hacer esto — viola esta regla:
export const VERIFIED_CAREERS = [
  { id: 1, name: 'Ingeniería de Software', ... }
];
```

---

## El archivo src/data/questionnaireData.ts

Este archivo existe ÚNICAMENTE como fallback de emergencia cuando Supabase no responde.

- NO editarlo como fuente primaria de datos.
- Si Supabase tiene los datos, el fallback nunca se activa.
- Para actualizar preguntas o carreras: SIEMPRE editar Supabase primero.
- Si un cambio en este archivo no se ve en la app, es porque Supabase tiene los datos reales y los está devolviendo correctamente.

---

## Checklist pre-commit para cualquier cambio de datos

- El dato nuevo está en una tabla de Supabase (INSERT/UPDATE vía MCP)
- El archivo `.ts` local NO tiene data hardcodeada nueva
- El PR NO modifica `VERIFIED_16_QUESTIONS`, `VERIFIED_64_OPTIONS` ni `VERIFIED_CAREERS` con datos reales
- Si se toca el fallback local, hay una razón técnica documentada en el PR

---

Proyecto: Orientador Vocacional IA
Supabase project ID: ottyfzyfuayjomtucujy
Región: ca-central-1
