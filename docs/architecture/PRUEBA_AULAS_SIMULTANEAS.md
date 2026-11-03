# Pruebas de aulas simultáneas

`tooling/mixed-capacity.mjs` usa Node 22, sin instalar servicios de carga. Ejecutar `node --test tooling/mixed-capacity.check.mjs` para validar el propio generador sin red ni consumo de GPT.

## Un aula: 40 flujos activos

```powershell
$env:BASE_URL='http://localhost:3000'
$env:USERS='40'
$env:ROUNDS='1'
$env:THINK_MS='3000'
$env:WRITE_RESULTS='true'
$env:CHAT_FRACTION='1'
$env:CHAT_MAX_REQUESTS='40'
$env:OUTPUT='capacity-mixed-40.json'
node tooling/mixed-capacity.mjs
```

Cada usuario mantiene cookies propias: carga HTML de aventura, crea sesión firmada, lee las 16 preguntas/64 opciones, guarda evidencia sintética y recupera el mismo resultado. El chat, si corresponde por fracción y presupuesto, exige texto y evento `finish` sin error. Se comprueba igualdad exacta del resultado POST/GET; rondas adicionales comprueban que repetir el POST conserva el mismo resultado. No se falsifican IPs ni se comparten sesiones. Los resultados sintéticos son anónimos y no representan estudiantes reales; se conservan con la caducidad normal del sistema. Para carga extensa usar base de pruebas.

Son 40 **flujos HTTP activos**, no 40 solicitudes GPT alineadas en el mismo milisegundo: cada usuario llega al chat tras sus consultas anteriores. Para medir específicamente una ráfaga de 40 GPT se usa la sonda directa `capacity-probe.mjs` en modo chat, USERS=40 y STAGE_SECONDS=1, después de comprobar que los límites y el presupuesto lo permiten.

## Varias aulas y carga sostenida

Cambiar USERS a `40,80,120` para uno, dos y tres grupos. Primero ejecutar un smoke con USERS=1, ROUNDS=2, CHAT_FRACTION=0. Con los flujos estables, repetir con fracción GPT de 0.1 y CHAT_MAX_REQUESTS=12 (presupuesto máximo compartido entre etapas). Las rondas se espacian con THINK_MS; dentro de cada recorrido las operaciones se ejecutan secuencialmente sin pausas artificiales. ROUNDS admite hasta 10; para ensayos prolongados aumentar la duración con pausas representativas y supervisar recursos de Vercel/Supabase y gasto de GPT.

La primera respuesta inesperada (incluidos 429), error de transporte, stream fallido o validación semántica fallida aborta la etapa, cancela lo que siga en vuelo e impide etapas posteriores. Cancelar una solicitud no garantiza revertir una escritura ya aceptada. Los informes diferencian errores y solicitudes canceladas; no registran cookies, claves, preguntas completas ni respuestas GPT. Los tiempos hasta primer texto se calculan leyendo SSE; TTFB HTTP no equivale a primer token.

Evaluar por operación: p95, tasa de errores, 429, primer texto GPT y duración completa; verificar guardados, conexiones y consumo en paralelo. El número de usuarios de una etapa exitosa es evidencia de ese patrón y duración; no establece el máximo soportado. Este generador no ejecuta WebGL/canvas, descargas de imágenes, PDF, portal autenticado ni FPS en equipos escolares.
