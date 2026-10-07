# Orientador Vocacional IA — Plan Integral de Funcionalidades para el Colegio

> **Documento de referencia oficial** combinando la propuesta de evolución de Chaski 2.0 y el plan de funcionalidades para el Colegio Matemático Honores.  
> **Fecha:** 01/10/2026  
> **Estado:** Aprobado para ejecución  
> **Repo:** `carrioneilnacr-art/Orientador-Vocacional-IA`

---

## Instrucciones para los Agentes de IA

- Stack existente: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Supabase (PostgreSQL) + Drizzle ORM, Vercel AI SDK, Zod, Recharts, jsPDF, Vitest.
- **No trabajar sobre `main`.** Crear una rama por funcionalidad (`feat/auth-codigo`, `feat/importador-notas`, `feat/dashboard-colegio`).
- En tablas nuevas usar `bigint` / `uuid` para llaves foráneas (**no** `bigserial`, como hay hoy en `schema.ts`).
- Toda validación de entrada con **Zod**. Toda ruta del colegio debe verificar rol y `school_id` en el servidor.
- Nunca enviar nombres de alumnos a un modelo de IA. Solo datos agregados o anonimizados.
- Escribir pruebas Vitest para: parser de notas, reglas de validación, cálculo del ajuste académico y permisos por rol.
- Los números de rentabilidad (sección 8) son **ilustrativos**. No hardcodearlos en la app; deben ser parámetros editables.

---

## Fase 1: Esquema de Base de Datos y Correcciones Técnicas (Subagente: grounded-ai-dba)

### 1.1 Nuevas Tablas
- `schools` (id uuid, name, slug unique, grade_scale)
- `classrooms` (id uuid, school_id FK, year, grade, section)
- `students` (id uuid, school_id FK, classroom_id FK, student_code, full_name, access_code_hash unique, consent_status, consent_at)
- `school_staff` (user_id uuid PK from Supabase Auth, school_id FK, role: ADMIN|PSICOLOGO|TUTOR|DIRECTOR)
- `academic_records` (id bigint, student_id FK, import_id FK, period, subject, area, grade numeric, confirmed_at)
- `career_area_weights` (id bigint, career_id FK, area, weight numeric)
- `grade_imports` (id uuid, school_id FK, uploaded_by, file_type, storage_path, status, stats jsonb, created_at, confirmed_at)
- `grade_import_rows` (id bigint, import_id FK, raw_student_code, raw_name, subject, period, raw_grade, parsed_grade, status, issues jsonb, confidence)
- `audit_log` (id uuid, actor_id, action, target_type, target_id, metadata jsonb, created_at)
- `tutoring_requests` (id uuid, student_id FK, school_id FK, reason, status, created_at, resolved_at, resolved_by)
- `alumni_outcomes` (id uuid, student_id FK, year, university, career, scholarship, notes)

### 1.2 Migraciones sobre tablas existentes
- `user_sessions` → agregar `student_id` (uuid, nullable FK) y `school_id` (uuid, nullable FK)
- Corregir llaves foráneas que usan `bigserial` innecesariamente → migrar a `bigint`

### 1.3 Correcciones de Seguridad Críticas
1. **`profileContext` manipulable desde el cliente** → Leer contexto en servidor a partir de cookie de sesión
2. **Prompt que instruye a inventar datos** ("actúa como si hubieras buscado en internet") → Cambiar a honestidad: "si no está en la BD, decirlo"
3. **RLS inefectivo** con rol `postgres` → Validar autorización por colegio y rol en rutas API
4. **Rate limiting** → Agregar a `/api/chat` y `/api/vocacional`
5. **README vs código** → Ya actualizado (OpenAI en producción, Gemini para tests)

---

## Fase 2: Autenticación y Acceso (Subagente: frontend-chaski-ui + grounded-ai-dba)

### 2.1 Alumnos (sin registro)
1. Admin carga lista de alumnos (nombre, grado, sección, student_code)
2. Sistema genera access_code por alumno (guardar solo hash) + exportar hoja imprimible por aula
3. Alumno entra con access_code → cookie de sesión firmada (httpOnly)
4. Modo invitado se mantiene; si ingresa código en resultados, se vincula testId a su ficha
5. Alumno ve notas en solo lectura + botón "reportar error" → alerta al admin

### 2.2 Personal del Colegio
- Login con Supabase Auth
- Roles: ADMIN, PSICOLOGO, TUTOR, DIRECTOR (cada uno con permisos específicos)

---

## Fase 3: Importador de Notas (Subagente: grounded-ai-dba)

### Flujo:
```
Subir archivo → Detectar tipo → Extraer filas → Validar → Pantalla de revisión → Confirmar → Guardar
```

- Excel/CSV: parseo determinista (SheetJS/PapaParse) + mapeo de columnas
- PDF con texto: extracción + modelo
- PDF escaneado/foto: modelo con visión + generateObject + Zod
- Validación por fila (OK/WARNING/ERROR)
- Pantalla de revisión con edición en línea
- Deshacer importación por import_id
- Auditoría completa

---

## Fase 4: Evolución de Chaski 2.0 (Subagente: frontend-chaski-ui)

### 4.1 Micro-Reacciones (Zero Muros de Texto)
- Burbujas flotantes de máximo 8-12 palabras que responden al clic
- Animaciones con Framer Motion (spring, duration: 0.3, bounce: 0)
- Auto-desvanecimiento a 1.5s

### 4.2 Brújula Vocacional en Vivo
- Mini-radar flotante en esquina superior durante el cuestionario
- Pulso visual hacia la dimensión RIASEC al hacer clic

### 4.3 Dilemas Situacionales Gamificados
- Rediseñar las 16 preguntas: de enunciados largos académicos a decisiones rápidas de 1-2 líneas
- Mantener la estructura: 4 misiones × 4 preguntas × 4 opciones = 64 opciones

### 4.4 Resumen "Al Grano"
- One-liner de impacto tipo carta de videojuego
- Tarjetas colapsables con tabular-nums para pensiones y mallas

---

## Fase 5: Dashboard del Colegio (Subagente: frontend-chaski-ui)

- Vista por aula/grado: avance, carreras más recomendadas, radar agregado
- Ficha individual (PSICOLOGO, TUTOR): perfil, top 5, notas, alertas
- Alertas: perfil plano, intereses vs rendimiento, sin test, sin consentimiento
- Exportar Excel/PDF
- Regla de privacidad: no mostrar agregados de grupos < 5 alumnos
- Botón "quiero hablar con un tutor" → solicitud al dashboard
- Informe PDF para padres

---

## Fase 6: Matching Académico y Chat Seguro (Subagente: psychometrics-qa)

### Fórmula de ajuste:
```
puntaje_final = 0.80 × afinidad_RIASEC + 0.20 × ajuste_académico
```
- Porcentajes son parámetros editables
- Nota baja no elimina carreras → mensaje de reforzamiento
- Tercio superior se calcula con notas reales (no preguntarle al alumno)
- Chat lee contexto en servidor (cookie), no desde el cliente
- Solo enviar agregados al modelo (sin nombre ni código)

---

## Fase 7: Módulo de Valor y Reporte Ejecutivo

- Reporte ejecutivo anual PDF para director/promotor
- Seguimiento de egresados (alumni_outcomes)
- Panel de KPIs: % orientados, tiempo promedio, satisfacción
- Calendario de admisiones y becas
- Material para marketing del colegio

---

## Privacidad y Legal (Obligatorio)
- Ley 29733 de Protección de Datos Personales
- Consentimiento del padre firmado por el colegio → consent_status
- No usar DNI; solo student_code
- Retención definida con eliminación de archivos
- Auditoría de accesos a fichas
- Informar proveedor de IA en la interfaz

---

## Roadmap de Ejecución

| Fase | Entregable | Resultado Verificable |
| :-: | :--- | :--- |
| 1 | `schools`, `classrooms`, `students`, carga masiva + `access_code` | Admin carga un aula y descarga hojas de códigos |
| 2 | Login por código + vínculo `user_sessions` ↔ alumno + consentimiento | Alumno entra, hace test y queda ligado a su ficha |
| 3 | Auth del personal (Supabase Auth), roles y dashboard básico | Tutor ve avance y resultados de su aula |
| 4 | **Importador de notas** (Excel → PDF/foto con IA) | Admin sube archivo, corrige y confirma |
| 5 | Ajuste académico + chat con contexto del servidor + tercio superior | Resultado cambia con las notas |
| 6 | Informe para padres, solicitudes de tutoría, alertas | Psicólogo recibe y atiende solicitudes |
| 7 | Reporte ejecutivo, seguimiento de egresados, panel de KPIs | Director descarga reporte anual |
| 8 | Piloto con el colegio + medición de ROI real | Informe de resultados del piloto |
