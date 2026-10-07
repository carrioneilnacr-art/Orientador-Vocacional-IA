---
name: grounded-ai
description: >-
  Use this skill to design, audit, and implement Grounded AI features in Orientador Vocacional IA, ensuring zero hallucinations and strict traceability against Supabase.
---

# Grounded AI Skill: Orientador Vocacional IA

Esta habilidad guía a los agentes de Antigravity en la implementación y auditoría de respuestas basadas en hechos verificados procedentes de la base de datos PostgreSQL en Supabase.

## 1. Reglas Cardinales de Grounding

1. **La base de datos es la única fuente de verdad:**
   * La IA nunca debe estimar ni inventar datos numéricos (pensiones, matrículas, cuotas, créditos académicos).
   * Los nombres de carreras, menciones y mallas curriculares deben coincidir exactamente con los registros de la tabla `careers` y `curriculum_courses`.
2. **Trazabilidad Obligatoria:**
   * Todo dato mostrado debe tener trazabilidad hacia la tabla `sources` (`url`, `publisher`, `accessed_at`, `valid_until`).
3. **Manejo de Vacíos:**
   * Si un dato no se encuentra tras la búsqueda en la BD, la respuesta estándar debe ser:
     *"Información no disponible actualmente en nuestras fuentes oficiales registradas."*

## 2. Flujo de Consulta Aumentada (RAG Relacional)

Para cualquier endpoint o función que use IA (como `/api/chat` o `/api/vocacional`):

```typescript
// 1. Extraer palabras clave del mensaje del usuario
// 2. Ejecutar búsqueda parametrizada en la BD (Drizzle ORM)
const matchedCareers = await db
  .select()
  .from(careers)
  .where(or(ilike(careers.name, `%${query}%`), ilike(careers.slug, `%${query}%`)))
  .limit(5);

// 3. Inyectar únicamente el contexto recuperado en el System Prompt
const systemPrompt = `
Eres Chaski, orientador vocacional.
IMPORTANTE: Basa tus respuestas ÚNICAMENTE en este contexto verificado:
${JSON.stringify(matchedCareers)}
Si la respuesta no está en el contexto, indica explícitamente que no se cuenta con datos registrados.
`;
```

## 3. Lista de Verificación (Checklist) para Agentes
- [ ] ¿La consulta a la base de datos maneja errores con `try/catch`?
- [ ] ¿Se filtran las carreras por sede o distrito si el estudiante especifica una zona (ej. Lima Norte)?
- [ ] ¿El modelo utilizado (@google/genai o ai-sdk) tiene una temperatura baja ($\le 0.2$) para minimizar variaciones no verificadas?
- [ ] ¿Se evita cualquier interpolación de datos externos sin registro en `sources`?
