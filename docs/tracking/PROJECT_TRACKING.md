# Dashboard de Seguimiento de Proyecto: Orientador Vocacional IA

**Última actualización:** 02/09/2026  
**Líder Técnico:** Senior Full-Stack Lead  
**Estado General:** EN CURSO (Fase 1 & Fase 2: Configuración y Base de Datos)

---

## 1. División de Tareas por Agentes

| Agente | Rol | Enfoque Principal | Estado |
| :--- | :--- | :--- | :--- |
| **Agente 1** | Database & Data Specialist | Supabase PostgreSQL, Drizzle Schemas, Seed UPC, Migraciones | 🟡 En progreso |
| **Agente 2** | Core Domain & AI Specialist | Algoritmo Vocacional (RIASEC), Tool Calling, Route Handlers | ⚪ Pendiente (Fase 3) |
| **Agente 3** | Frontend & UX/UI Specialist | Next.js App Router, Tailwind, Landing, Cuestionario, Chat UI | ⚪ Pendiente (Fase 4) |

---

## 2. Tablero de Tareas (Kanban)

### 🔵 Hecho (DONE)
- [x] **GOV-01:** Definición de Reglas de Proyecto (`docs/rules/PROJECT_RULES.md` y `.agents/rules/AGENTS.md`).
- [x] **GOV-02:** Definición de Skills de seguimiento y gobernanza (`.agents/skills/`).

### 🟡 En Curso (IN PROGRESS)
- [ ] **DB-01:** Completar diseño de esquema relacional (`docs/architecture/DATABASE_SCHEMA.md`).
- [ ] **DB-02:** Crear script de migración SQL unificado (`docs/architecture/001_initial_schema.sql`).
- [ ] **DB-03:** Aplicar migración a Supabase (`ottyfzyfuayjomtucujy`) mediante MCP.
- [ ] **DB-04:** Crear y ejecutar script de sembrado de datos reales UPC 2026 (`docs/architecture/002_seed_upc_data.sql`).
- [ ] **GIT-01:** Inicializar Git local, vincular a GitHub `carrioneilnacr-art/Orientador-Vocacional-IA` y realizar commit inicial.

### ⚪ Por Hacer (BACKLOG)
- [ ] **DOM-01:** Motor de cálculo psicométrico RIASEC + Afinidad Tecnológica/Lógica.
- [ ] **DOM-02:** Use cases para recomendación de carreras y generación de explicaciones.
- [ ] **AI-01:** Agente conversacional con Function Calling (`getCareerDetails`, `compareCareers`, etc.).
- [ ] **UI-01:** Setup de proyecto Next.js 14/15 con TypeScript y Tailwind.
- [ ] **UI-02:** Landing Page "Empieza a conocer tu futuro".
- [ ] **UI-03:** Cuestionario interactivo multi-etapas con persistencia en cliente.
- [ ] **UI-04:** Pantalla de resultados (radar vocacional + top 3 carreras + comparador).
- [ ] **UI-05:** Chatbot interactivo con citas de fuentes verificadas.
- [ ] **QA-01:** Pruebas de estrés y rendimiento para 20 estudiantes concurrentes.

---

## 3. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Código con tipado estricto en TypeScript sin errores de compilación (`tsc --noEmit`).
- [ ] Toda tabla en Supabase tiene claves foráneas e índices para queries frecuentes.
- [ ] Los datos institucionales reflejan fielmente las fuentes oficiales de la UPC 2026.
- [ ] Cada funcionalidad relevante cuenta con commit semántico y push a GitHub.
