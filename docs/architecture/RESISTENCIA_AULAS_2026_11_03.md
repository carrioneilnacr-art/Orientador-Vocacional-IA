# Resistencia por aulas y GPT exclusivo — 3 de noviembre de2026

Chaski usa únicamente OPENAI_API_KEY y OPENAI_MODEL. Se retiraron el proveedor anterior, sus paquetes, variables locales e indicaciones en documentación de la aplicación. Se conserva la clave GPT local; el proyecto Vercel ya tiene actualizada su variable privada. El valor no se almacena en código ni informes. La lista remota de variables no contenía otro proveedor de IA.

## Cambios cerrados

- Cuotas compartidas en PostgreSQL, atómicas entre instancias. Un UPSERT de IP+sesión; no transacciones abiertas sobre viajes de red. Tabla nueva, RLS y privilegios públicos revocados, migración aditiva aplicada/verificada. Prueba real de40 incrementos sobre4 conexiones sin pérdida.
- Identidad de cuota firmada por estudiante/sesión, con límite adicional por IP para colegios bajo NAT. Chat12/min por sesión e IP600/min por operación; acceso alumno300/min por IP y5/min por código; personal mantiene10/min por IP. El fallo del almacén devuelve503, sin desactivar protecciones.
- Pool explícito de6 conexiones por instancia con prepare:false para pooler de transacciones, idle20s y conexión10s, configurable. Observación real del adaptador con40 solicitudes: p95 de3480ms con3 conexiones frente a2134ms con6, muestras individuales incluyendo conexión inicial. No equivale a dimensionar todas las instancias del despliegue.
- Caché pública acotada de30s:40 peticiones equivalentes al catálogo comparten2 lecturas; contexto oficial comparte un lote de4. Los errores no se cachean. Fuentes se separan por díaUTC. No se cachean identidades, respuestas de alumnos ni consentimiento.
- Guardado aventura de3 consultas a1 con INSERT DO NOTHING RETURNING; reintento de3 a2, sin actualizar conflictos. La autorización usa siempre el registro realmente almacenado. API cuestionario expone saved:false e interfaz conserva respuestas y permite reintentar fallos HTTP.
- GPT con streaming comprobado, límite1200tokens y25s de plazo total; contexto máximo10s dentro del mismo plazo, errores seguros y Server-Timing para cuota/contexto. No hay reintentos automáticos que multipliquen consumo. Un200 sin texto y finish se considera error.

## Evidencia local con Supabase y GPT reales

Generador en una máquina, compilación `next build`/`next start`. Cookies independientes, misma IP sin falsificar. Cada flujo: HTML aventura, sesión, catálogo16/64, guardar evidencia anónima, recuperar y comparar exactamente el resultado, y GPT según presupuesto. No simula FPS ni descarga todos los activos. Las etapas son ráfagas breves de trabajo comprimido, sin tiempo real de recorrido entre operaciones.

| Informe | Concurrencia | Resultado |
|---|---:|---|
| capacity-mixed-40-2026-11-03.json |40 | Falló: transacción de cuotas causaba convoy, contexto5s se agotaba. Se preserva la evidencia del fallo |
| capacity-mixed-40-fixed-2026-11-03.json |40 |240/240 peticiones200,40 guardados recuperados y40 GPT completos |
| capacity-mixed-classrooms-2026-11-03.json |80 |480/480 peticiones200,80 guardados y80 GPT completos |
| mismo informe, segunda etapa |120 |640/640 peticiones200,120 guardados y40 GPT completos por presupuesto global |
| capacity-mixed-40-final-2026-11-03.json |40 |240/240200,40 guardados y40 GPT completos consultando8 carreras reales recuperadas de BD |
| capacity-mixed-120-final-2026-11-03.json |120 | Guardados120/120, contexto5s agotado con120 consultas GPT de carreras; aborto de prueba tras primer503,119 peticiones canceladas. Se amplió contexto a10s manteniendo plazo total25s |

En40 con8 consultas de carreras, p95: sesión2516ms, catálogo3258ms, guardar2993ms, recuperar3163ms, primer texto GPT8757ms y finalización9996ms. El p95 de guardado bajó de5960ms a2993ms entre las dos implementaciones con40 usuarios, aproximadamente50%; son muestras individuales y cambiaron los temas del chat. No se afirma una mejora global de60–70% ni capacidad máxima universal.120 usuarios con todo GPT y consultas a fuentes es un escenario más exigente que120 navegando con40 preguntas GPT.

## Verificación y límites

TypeScript, pruebas de dominio/HTTP/cuotas/streams y build verificados localmente. El test de integración real de cuotas es opt-in; el resto de pruebas no requiere secretos. Las pruebas normales no acreditan un run de GitHub Actions. Los informes JSON posteriores registran nuevos ensayos y entorno exacto.

Pendientes operativos: observar conexiones globales según plan real y número de instancias, timeout PostgreSQL para rol dedicado, mantenimiento acotado de contadores caducados, ensayo sostenido y FPS en equipos escolares. El catálogo del cuestionario aún no queda fijado por versión entre GET y POST. No se modificó el scoring ni se añadieron afirmaciones educativas sin fuentes.

La migración es un SQL operativo auditado (`ADD_SHARED_RATE_LIMIT.sql`), consistente con el esquema Drizzle, que debe aplicarse antes de desplegar en otra base. Reconciliar con el historial canónico de migraciones; no ejecutar indiscriminadamente SQL histórico.
