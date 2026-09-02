# Reglas del Proyecto: Orientador Vocacional con IA

## 1. Principio Fundamental: Grounded AI (Cero Alucinaciones)
1. **La base de datos es la única fuente de hechos:** La IA (LLM) nunca debe inventar, asumir ni extrapolar costos de pensiones, nombres de carreras, mallas curriculares, requisitos de admisión o porcentajes de empleabilidad.
2. **Trazabilidad obligatoria:** Todo dato cuantitativo o institucional mostrado al usuario debe estar respaldado por un registro en la tabla `sources` con `url`, `publisher`, `accessed_at` y `valid_until`.
3. **Manejo de vacíos de información:** Si un dato no existe en la base de datos verificada, el sistema debe responder explícitamente: *"Información no disponible actualmente en nuestras fuentes oficiales registradas"*.

## 2. Gobernanza de Archivos y Documentación
1. **Organización estricta:** Ningún archivo Markdown (`.md`) debe crearse en la raíz del proyecto (a excepción de `README.md`).
   - `docs/rules/`: Políticas, estándares y convenciones.
   - `docs/tracking/`: Seguimiento de sprints, backlog, tareas y DoD.
   - `docs/architecture/`: Esquemas de base de datos, arquitectura de software y diagramas.
   - `docs/data/`: Fichas técnicas de investigación y fuentes.
   - `Archivos .MD/`: Documentos base de investigación original.
   - `.agents/`: Reglas y skills operativas de los agentes de codificación.

## 3. Estándares de Base de Datos y Supabase
1. **No a cambios destructivos no confirmados:** Prohibido ejecutar sentencias `DROP TABLE`, `TRUNCATE`, o eliminación masiva de datos en Supabase sin autorización expresa del usuario.
2. **Claves foráneas e integridad referencial:** Toda relación debe contar con restricciones de integridad y cascadas de eliminación (`ON DELETE CASCADE` o `ON DELETE SET NULL`) debidamente fundamentadas.
3. **Optimización de índices:** Toda columna utilizada frecuentemente en filtros (`institution_id`, `career_id`, `slug`, `category`) debe contar con un índice explícito.

## 4. Estándares de Git y Control de Versiones
1. **Conventional Commits:** Todos los commits deben seguir el estándar:
   - `feat(scope): ...` para nuevas funcionalidades.
   - `fix(scope): ...` para corrección de bugs.
   - `docs(scope): ...` para documentación y tracking.
   - `test(scope): ...` para pruebas unitarias e integración.
   - `chore(scope): ...` para mantenimiento o configuración.
2. **Commits frecuentes y atómicos:** Subir commits a GitHub inmediatamente después de completar y verificar cada hito significativo.

## 5. Reglas Operativas de Desarrollo (Protocolo Senior)
1. Analizar integralmente frontend, backend y base de datos antes de intervenir.
2. Implementar soluciones completas de extremo a extremo, no código parcial ni placeholders (`// TODO`).
3. Ejecutar pruebas y verificación de tipos (`tsc --noEmit`, linters, queries) tras cada cambio.
4. Auto-corregir cualquier error identificado y re-verificar.
5. Mantener la privacidad de claves de API y credenciales de servidor en todo momento.
