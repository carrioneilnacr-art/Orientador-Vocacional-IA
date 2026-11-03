# Medición inicial de capacidad — 3 de noviembre de 2026

Destino: https://orientador-vocacional-ia.vercel.app. Generador: una máquina en Lima, Node fetch, tooling/capacity-probe.mjs. No se instalaron k6 ni servicios externos. El script ofrece una sonda HTTP reproducible, no sustituye pruebas de navegador ni una carga distribuida.

## Resultados observados

| Flujo | Usuarios virtuales por etapa | p95 HTTP por etapa (ms) | Resultado |
|---|---|---|---|
| HTML portada/aventura | 1 / 10 / 30 / 60 / 100 | 570 / 344 / 366 / 627 / 1181 | 673 solicitudes, todas 200 |
| Catálogo GET vocacional | 1 / 5 / 10 | 695 / 546 / 763 | 50 solicitudes, todas 200 |
| Sesión + consulta sin resultado | 1 / 5 / 10 | 730 / 872 / 450 | 96 solicitudes; 200 y 404 esperados |
| Sesión + guardar/repetir + recuperar aventura | 1 / 5 / 10 | 704 / 472 / 437 | 80 solicitudes, todas 200 |
| Chat | 1 | 2228 total; 2045 hasta cabeceras | HTTP 200 con evento SSE de error |

Una segunda solicitud aislada confirmó el error del chat: `data: {"type":"error","errorText":"An error occurred."}`. No revela la causa interna; requiere logs de Vercel/proveedor. No se continuó aumentando carga del chat.

Los tiempos son por petición, no por recorrido completo. TTFB del script mide hasta recepción de cabeceras, no primer token. Etapas de páginas/catálogo/sesión de 10 segundos, pausas de 3 segundos por usuario; persistencia de 5 segundos por etapa. Las etapas incluyen dispersión por red y calentamiento. Los informes JSON preservan duración efectiva y número de muestras; los percentiles de etapas pequeñas son poco estables. La etapa HTML de 100 usuarios hizo 308 solicitudes en 12.76 s efectivos (~24 solicitudes/s incluyendo pausa final), sin descargar JS, imágenes ni ejecutar juego. No se midió saturación, duración sostenida, tráfico distribuido ni recursos de Vercel/Supabase. Varias sondas coincidieron parcialmente en el tiempo: no son benchmarks aislados.

Persistencia: evidencia sintética anónima válida para el contrato, sin alumno/colegio, con 16 sesiones únicas (1+5+10), hasta dos POST por sesión y posteriores GET. Se dejaron esos registros con caducidad normal; no se borraron datos. Los estados 200 comprueban que las rutas aceptaron y devolvieron resultado; la sonda no compara contenido, recuento de filas ni aislamiento entre colegios. El flujo de cuestionario POST, portal autenticado, importaciones, PDF y validación semántica del stream no se cubrieron.

## Interpretación

No se observó caída de las páginas hasta 100 usuarios virtuales en este patrón breve. No equivale a 100 alumnos usando todas las funciones: el chat ya falla con un usuario. Tampoco establece una capacidad máxima. No aparecieron 429 en esta ejecución; el límite por IP en memoria identificado en código sigue siendo un riesgo, no un fallo reproducido. No se falsearon IPs ni se desactivaron controles.

La aventura procesa movimiento localmente: el servidor no recibe una petición por frame. La fluidez exige perfilar un navegador real en equipos escolares. Fondos PNG activos de aproximadamente 2–3 MB, máscaras de píxeles calculadas en el hilo principal y redibujado completo durante pausas son candidatos de optimización, no cuellos de botella medidos.

## Prioridades

1. Diagnosticar el stream del chat con logs correlacionados, comprobar credenciales/modelos vigentes y recuperación de errores asíncronos. Registrar fin correcto del stream, primer token, duración y consumo.
2. Límites compartidos por sesión/operación y presupuesto IA; dimensionar caso de colegio con NAT. Evitar escoger un límite por IP que bloquee alumnos legítimos.
3. Agrupar consultas repetidas de catálogo/mallas y reutilizar catálogo público versionado. Nunca cachear respuestas privadas entre colegios. Configurar pool y timeouts según pooler y plan reales, tras observar conexiones.
4. Convertir fondos a formatos comprimidos con comparación visual, precalcular recortes y cargar escenarios por demanda. Reducir render durante pausa y cuando la pestaña esté oculta. Medir FPS, frames largos y arranque en un equipo modesto.
5. Medición posterior de 10–30 minutos con recursos observables y flujos completos: guardado validado por contenido, reintentos/idempotencia, consentimiento/aislamiento, chat y cuestionario. Escalar 10→30→60→100 sólo si cada etapa cumple latencia y errores. Evaluar cada operación por separado y después una mezcla basada en uso real.

## Reproducción (PowerShell)

```powershell
$env:BASE_URL='https://orientador-vocacional-ia.vercel.app'
$env:MODE='pages' # pages, catalog, adventure, chat
$env:USERS='1,10,30,60,100'
$env:STAGE_SECONDS='10'
$env:THINK_MS='3000'
$env:WRITE_RESULTS='false'
$env:OUTPUT='capacity-pages.json'
node tooling/capacity-probe.mjs
```

Para persistencia: MODE=adventure, WRITE_RESULTS=true, USERS=1,5,10. Crea resultados sintéticos en la base destino; usar una base de pruebas para repeticiones extensas. Para chat comenzar USERS=1 y STAGE_SECONDS=1; cada solicitud puede consumir cuota del proveedor. La sonda termina etapas al superar 5% de errores de servidor/transporte/stream o 10% de 429, tras 20 muestras; las solicitudes ya iniciadas finalizan. No ignora 429 al calcular éxito. No se modificó ni desplegó código de aplicación.
