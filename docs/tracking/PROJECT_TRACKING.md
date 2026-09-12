# Dashboard de Seguimiento de Proyecto: Orientador Vocacional IA

**Última actualización:** 02/09/2026  
**Líder Técnico:** Senior Full-Stack Lead  
**Estado General:** EN CURSO (Fase 1: Configuración y Gobernanza Completada | Fase 2: Base de Datos en Supabase Completada)

---

## 1. División de Tareas por Agentes

| Agente | Rol | Enfoque Principal | Estado |
| :--- | :--- | :--- | :--- |
| **Agente 1** | Database & Data Specialist | Supabase PostgreSQL, Drizzle Schemas, Seed UPC, Migraciones | 🟢 Completado (Hito 1 y 2) |
| **Agente 2** | Core Domain & AI Specialist | Algoritmo Vocacional (RIASEC), Tool Calling, Route Handlers | 🟡 Siguiente paso (Fase 3) |
| **Agente 3** | Frontend & UX/UI Specialist | Next.js App Router, Tailwind, Landing, Cuestionario, Chat UI | ⚪ Pendiente (Fase 4) |

---

## 2. Tablero de Tareas (Kanban)

### 🔵 Hecho (DONE)
- [x] **GOV-01:** Definición de Reglas de Proyecto (`docs/rules/PROJECT_RULES.md` y `.agents/rules/AGENTS.md`).
- [x] **GOV-02:** Definición de Skills de seguimiento y gobernanza (`.agents/skills/project-tracker`, `git-workflow`, `db-governor`).
- [x] **DB-01:** Completar diseño de esquema relacional (`docs/architecture/DATABASE_SCHEMA.md`).
- [x] **DB-02:** Crear script de migración SQL unificado con 19 tablas (`docs/architecture/001_initial_schema.sql`).
- [x] **DB-03:** Aplicar migración a Supabase (`ottyfzyfuayjomtucujy`) mediante MCP con éxito.
- [x] **DB-04:** Crear y ejecutar script de sembrado de datos reales UPC 2026 (`docs/architecture/002_seed_upc_data.sql` y `004_seed_16_interactions.sql`).
- [x] **DB-05:** Activar Row Level Security (RLS) y políticas de lectura pública (`docs/architecture/003_enable_rls_policies.sql`).
- [x] **DB-06:** Modelos Drizzle ORM y relaciones tipadas en `src/db/schema.ts` y cliente en `src/db/index.ts`.
- [x] **DATA-01:** Documentación de fuentes oficiales y trazabilidad en `docs/data/UPC_VERIFIED_SOURCES.md`.
- [x] **DOM-01:** Motor de cálculo psicométrico RIASEC + Afinidad Tecnológica/Lógica calibrado para 16 preguntas (`src/app/api/vocacional/route.ts`).
- [x] **DB-07:** Persistencia de sesiones en Supabase (`user_sessions` con testId, token, payload de respuestas, perfil y carreras para analítica/entrenamiento IA futuro).
- [x] **UI-03:** Cuestionario interactivo de 16 preguntas en 4 misiones con Chaski, barra segmentada, interludios y persistencia en cliente.
- [x] **UI-04:** Pantalla de resultados (radar vocacional + top 3 carreras + descripciones dinámicas por perfil + exportación PDF horizontal nativo sin localhost).
- [x] **UI-06:** Visor de respuestas marcadas al azar (modal estrictamente de solo lectura y no editable para QA/auditoría antes de enviar).

### 🟡 En Curso (IN PROGRESS)
- [ ] **GIT-01:** Sincronizar repositorio local con GitHub `carrioneilnacr-art/Orientador-Vocacional-IA` y realizar commit atómico.

### ⚪ Por Hacer (BACKLOG - Agente 2 & Agente 3)
- [ ] **DOM-02:** Use cases para recomendación de carreras y generación de explicaciones avanzadas.
- [ ] **AI-01:** Agente conversacional con Function Calling (`getCareerDetails`, `compareCareers`, etc.).
- [ ] **UI-01:** Setup y layout de Next.js App Router con Tailwind CSS.
- [ ] **UI-02:** Landing Page "Empieza a conocer tu futuro".
- [ ] **UI-05:** Chatbot interactivo con citas de fuentes verificadas.
- [ ] **QA-01:** Pruebas de estrés y rendimiento para 20 estudiantes concurrentes.

---

## 3. Criterios de Aceptación (Definition of Done - DoD)
- [x] Código con tipado estricto en TypeScript sin errores en schemas de base de datos.
- [x] Toda tabla en Supabase tiene claves foráneas e índices para queries frecuentes.
- [x] Los datos institucionales reflejan fielmente las fuentes oficiales de la UPC 2026.
- [x] Políticas RLS activadas para las 19 tablas en Supabase.
- [ ] Cada funcionalidad relevante cuenta con commit semántico y push a GitHub.
