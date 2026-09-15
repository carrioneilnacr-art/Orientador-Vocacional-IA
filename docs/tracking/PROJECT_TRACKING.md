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
- [x] **UI-07:** Rediseño dinámico del dock de valores en Landing Page y desvinculación a plataforma multi-universitaria.
- [x] **GIT-01:** Sincronizar repositorio local con GitHub `carrioneilnacr-art/Orientador-Vocacional-IA` y realizar commit atómico.
- [x] **DATA-02:** Ingesta y extracción estructurada en Supabase de la malla de Ingeniería de Sistemas Computacionales UPN (74 cursos, 10 ciclos, 200 créditos, ICACIT/ACM-IEEE, 6 campus).
- [x] **DATA-03:** Ingesta y extracción estructurada en Supabase de las 12 carreras restantes de UPN (895 cursos totales, 13 carreras UPN en 6 campus, fuentes oficiales, acreditaciones ICACIT/SINEACE, empleabilidad IPSOS 2024).
- [x] **DATA-04:** Ingesta y extracción estructurada en Supabase de las 13 carreras de pregrado UTP (737 cursos en mallas, 15 campus a nivel nacional, 195 ofertas académicas, acreditaciones ICACIT/IAC-CINDA, empleabilidad UTP/Intercorp, fichas y fuentes oficiales en `docs/data/UTP_VERIFIED_SOURCES.md`).
- [x] **DATA-05:** Ingesta y extracción estructurada en Supabase de las 11 carreras oficiales de UCV (535 cursos en mallas, 13 campus licenciados por SUNEDU, 143 ofertas académicas, acreditaciones SINEACE/ICACIT, Sistema de Titulación Inmediata STI, empleabilidad 87.5%, fichas y fuentes oficiales en `docs/data/UCV_VERIFIED_SOURCES.md`).
- [x] **DATA-06:** Ingesta y extracción estructurada en Supabase de las 9 carreras de pregrado UCH (576 cursos en mallas, campus Los Olivos licenciado por SUNEDU, 9 ofertas académicas, investigación formativa temprana, empleabilidad >90%, fichas y fuentes oficiales en `docs/data/UCH_VERIFIED_SOURCES.md`).
- [x] **DATA-07:** Ingesta y extracción estructurada en Supabase de las 15 carreras de pregrado UCSUR (853 cursos en mallas, 4 campus licenciados por SUNEDU: Villa, Norte, Aramburú, Ate; 55 ofertas académicas; Medicina Humana de 14 ciclos con internado médico; Medicina Veterinaria y Zootecnia; Economía y Finanzas; Arquitectura de Interiores; fichas y fuentes oficiales en `docs/data/UCSUR_VERIFIED_SOURCES.md`).
- [x] **DATA-08:** Ingesta y extracción estructurada en Supabase de las 14 carreras de pregrado USMP (954 cursos en mallas, 6 campus y filiales licenciadas por SUNEDU: Santa Anita, La Molina, Comas, Surquillo, Chiclayo, Arequipa; 42 ofertas académicas; Medicina Humana de 14 ciclos; Derecho de 12 ciclos; fichas y fuentes oficiales en `docs/data/USMP_VERIFIED_SOURCES.md`).
- [x] **DATA-09:** Depuración y eliminación completa de UPC en base de datos y sistema (`012_remove_upc_and_focus_lima_norte.sql`), enfoque prioritario en sedes de Lima Norte (Los Olivos, Comas, Independencia, SMP) para UPN, UTP, UCV, UCH, UCSUR y USMP, corrección de formateo de caracteres en chat (`CopilotChat.tsx`) y optimización del bot Chaski a respuestas concisas y capacidad activa de comparación de mallas.

### 🟡 En Curso (IN PROGRESS)
- [ ] **UI-08:** Implementación de la vista de carrera y visor interactivo de mallas curriculares (`/carreras/[slug]`).

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
