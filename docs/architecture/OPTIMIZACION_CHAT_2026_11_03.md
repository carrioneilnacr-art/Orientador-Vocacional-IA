# Corrección del chat y optimización — 3 de noviembre de 2026

Registro de la primera fase. El estado posterior de cuotas, concurrencia y publicación se documenta en `RESISTENCIA_AULAS_2026_11_03.md`; sus mediciones prevalecen sobre los pendientes históricos de este informe.

Supervisor: agente principal; especialistas coordinados de chat/proveedores, backend/datos y frontend/juego. Se intercambiaron contratos, fallos de pruebas y revisiones entre agentes. Cambios locales; no hay despliegue ni commit automático.

## Causas verificadas del chat

- La clave OpenAI anterior del entorno local respondió 401 `expired_secret_key` al endpoint oficial de modelos. No fue una hipótesis de cuota.
- El proveedor alternativo retirado tenía un modelo que respondió404 NOT_FOUND en una generación real. Sus modelos de respaldo tampoco estaban en el catálogo consultado. Se eliminó por decisión del usuario.
- La selección anterior podía ignorar OpenAI por existir otra clave. El try/catch de la creación del stream no manejaba fallos asíncronos posteriores. El cliente ignoraba eventos SSE de error.
- La nueva clave suministrada por el usuario se guardó únicamente en `.env.local` ignorado por Git. Modelos devolvió200 y una generación GPT real devolvió200, modelo `gpt-4o-mini-2024-07-18`, texto no vacío, aproximadamente2084ms. No se guardó la clave en este informe ni en código.
- Esto prueba el entorno local, no la clave de Vercel. Se consultó metadata de producción; los logs de errores devolvieron403 por permisos y no había CLI Vercel disponible. No se cambió configuración remota.

## Correcciones

El chat utiliza exclusivamente GPT mediante OPENAI_API_KEY y OPENAI_MODEL. Se retiraron el proveedor alternativo, sus dependencias y sus variables de configuración. No se introdujo AI Gateway.

El servidor consume eventos reales de GPT. Si ya empezó una respuesta y ocurre un fallo, preserva el texto y comunica error. Registra metadatos de error, proveedor, modelo, tiempos y requestId sin claves ni mensajes. Limita salida y espera; presupuesto25s desde inicio de ruta y contexto máximo5s, con respuesta de indisponibilidad al agotar ese plazo. La consulta Drizzle subyacente no se cancela automáticamente: límites de conexión/consulta en BD quedan pendientes de dimensionamiento.

El cliente detecta errores HTTP/SSE, abortos y respuestas truncadas. Exige evento `finish` además de texto; `[DONE]` solo no acredita éxito. La sonda de capacidad ahora mide primer texto real y finalización, y comprueba forma del resultado de aventura guardado.

## Mejoras cuantificables

| Área | Antes → después | Qué demuestra |
|---|---|---|
| Contexto chat, fixture2 carreras×2 universidades | 11→4 lecturas | 63,6% menos consultas, prueba con DB instrumentada |
| Resolver5 recomendaciones | 20→3 lecturas | 85% menos consultas, prueba con DB instrumentada |
| Camino completo cuestionario con ese catálogo | 24→7 operaciones BD | 70,8% menos por contabilidad del camino; no latencia medida |
| Cinco fondos activos | 13.494.383→10.726.252 bytes | 20,51% menos descarga; RGBA idéntico, compresión sin pérdida |
| Escena pausada | hasta60→10 pinturas/s | Aproximadamente83% menos pinturas teóricas a60Hz, no FPS medidos |

No existe evidencia de una mejora global de velocidad60–70%. Menos consultas y bytes no se convierten directamente en ese porcentaje de latencia o de usuarios soportados. Se conservan reglas de scoring y se añaden filtros de fuente/vigencia de ofertas, costos y mallas. Escenarios colegio/alternativo se cargan por demanda; pestañas ocultas omiten render y física. Movimiento activo mantiene su frecuencia.

## Verificación real

`capacity-chat-local-fixed-2026-11-03.json`: petición real al endpoint local tras corrección, HTTP200, texto y finish sin error, primer texto1369ms y finalización3127ms. Es una muestra local de desarrollo, no comparación válida de latencia contra el fallo anterior de producción ni prueba de capacidad máxima. Los greetings evitan consulta BD; esta muestra no demuestra recuperación de carreras desde Supabase. El endpoint completó también otras dos muestras de humo del agente de chat.

La aventura local cargó correctamente su árbol accesible en navegador tras los cambios. La comparación de píxeles de activos es automática; no se ha certificado todo el recorrido ni medido FPS en hardware escolar.

Verificación final integrada: TypeScript correcto;179 pruebas Vitest en32 archivos aprobadas;3 comprobaciones nativas SSE aprobadas; ESLint dirigido aprobado; `next build` completó33 páginas. Con `next start --port 3001`, tres solicitudes GPT simultáneas completaron con texto y finish sin error: p95 hasta primer texto3768ms y hasta finalización5006ms (sólo3 muestras; no capacidad máxima). Informe `capacity-chat-production-local-2026-11-03.json`. El servidor de producción local quedó disponible en http://localhost:3001.

## Pendiente para producción

1. Reemplazar la clave OpenAI de Vercel si corresponde y publicar el código verificado; luego comprobar GPT y recuperación de catálogo con fuentes desde el despliegue.
2. Sustituir el rate limiter en memoria por almacenamiento compartido y separar cuotas por sesión/operación. Dimensionar límites por IP para alumnos bajo NAT. No se provisionó un servicio Redis ni se relajaron protecciones arbitrariamente.
3. Ajustar pool/timeout al plan real Supabase y observar consultas/conexiones. No se modificaron esquema, RLS ni índices remotos.
4. Repetir carga sostenida con flujos completos y recursos observables. La prueba previa de100 usuarios era HTML, no todos usando todas las funciones.
5. El cuestionario conserva persistencia heredada de mejor esfuerzo: un200 no garantiza guardado si falla BD; requiere evolución independiente del contrato/UI de recuperación.

La clave GPT se conserva por instrucción del usuario en configuración privada excluida de Git. La variable del proyecto Vercel se actualizó después de autorizar el acceso al equipo; no se incluye su valor en los informes.

## Fuentes y herramientas investigadas

- Skills Grounded AI, Database Governor, Vercel AI SDK, UI Styling, React Best Practices y OpenAI Docs; APIs contrastadas con documentación y fuente de paquetes instalados.
- [Vercel AI SDK, repositorio oficial](https://github.com/vercel/ai): contratos de stream y manejo de errores.
- [Errores OpenAI](https://developers.openai.com/api/docs/guides/error-codes): clasificación de autenticación frente a límites.
- [Drizzle SELECT](https://orm.drizzle.team/docs/select) y [repositorio oficial](https://github.com/drizzle-team/drizzle-orm): lecturas agrupadas y SQL parametrizado.
- [k6](https://github.com/grafana/k6): referencia para pruebas posteriores; estas mediciones se hicieron con la sonda Node incluida, no con k6.

Herramientas: `node tooling/chat-health.mjs`, `node --test tooling/chat-stream-metrics.check.mjs`, `node tooling/capacity-probe.mjs`, `node tooling/optimize-game-assets.mjs`. La última regenera WebP lossless y verifica igualdad RGBA. No ejecutar carga con IA masivamente sin definir presupuesto y cuotas.
