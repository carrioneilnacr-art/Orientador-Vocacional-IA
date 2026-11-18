# Plan propuesto de 14 semanas para orientación vocacional

## Alcance y condiciones

Esta es una planificación propuesta, no un registro de trabajo ya ejecutado. Comprende siete sprints de dos semanas a partir de una fecha de inicio que acuerde el equipo. Se centra en el cuestionario, las recomendaciones, Chaski y el portal escolar. El alcance de cada sprint está sujeto a la capacidad real del equipo y a la revisión de la comunidad educativa.

La aplicación ya contiene rutas de cuestionario, resultados, chat, catálogo universitario y portal escolar. La existencia de estas rutas no demuestra que todas estén validadas en producción. Antes de iniciar cambios se deberá establecer su estado mediante una revisión del código, configuración y pruebas. Los registros escolares existentes deben conservarse durante cualquier cambio de acceso o datos.

**Supuesto de capacidad:** equipo pequeño de dos desarrolladores, una persona responsable del producto con acceso semanal al colegio, y apoyo parcial de psicología/orientación y pruebas. Si una persona asume varios roles, reducir el alcance del sprint en lugar de eliminar las verificaciones.

## Calendario por sprints

| Sprint y semanas | Objetivo y trabajo | Entregables y criterio de aceptación |
| --- | --- | --- |
| 1 · 1–2 | Acordar alcance y línea base. Inventariar las rutas activas, dependencias, datos sensibles y flujos de estudiante y personal. Revisar accesibilidad y funcionamiento de teclado, móvil y escritorio. Registrar riesgos y métricas actuales. | Inventario y backlog priorizado con responsables. La persona responsable del producto valida el flujo que se conservará. Se documentan resultados y limitaciones de las pruebas iniciales. |
| 2 · 3–4 | Mejorar la experiencia del cuestionario. Revisar navegación, redacción, progreso, errores y recuperación ante recarga, incluyendo dispositivos pequeños y lectores de pantalla. Revisar contenido con orientación escolar. | Un estudiante completa las 16 preguntas y entiende cómo continuar o corregir una respuesta. Los hallazgos críticos de navegación y contraste cuentan con corrección o decisión documentada. |
| 3 · 5–6 | Auditar resultados, recomendaciones y fuentes oficiales registradas. Verificar reglas de puntuación y vigencia de contenido junto a la persona de orientación. Evitar que las sugerencias se presenten como diagnósticos. | Casos conocidos de puntuación reproducibles y pruebas automatizadas del cálculo. Resultados identifican el carácter orientativo y muestran únicamente información disponible y respaldada en las fuentes registradas. |
| 4 · 7–8 | Revisar identidad y acceso de estudiantes y personal. Diseñar OTP, recuperación, caducidad, límites de intentos y manejo de sesiones según roles. Definir proveedor, costes, tratamiento de datos y consentimiento antes de implementarlo. | Diseño de acceso aprobado y modelo de amenazas documentado. Prototipo probado con expiración, código inválido, límite de intentos y cierre de sesión. La activación queda condicionada a tener proveedor y configuración verificados. |
| 5 · 9–10 | Implementar las mejoras de acceso aprobadas y endurecer seguridad. Revisar autorización por colegio y rol, controles de entrada, secretos, cifrado en tránsito y almacenamiento según los servicios usados. | Una persona sin permisos no accede a datos de otro colegio. Las pruebas comprueban sesiones, OTP y recuperación según el diseño aprobado. Se registran las garantías efectivas del proveedor y las brechas pendientes. |
| 6 · 11–12 | Revisar Chaski, rendimiento y operación. Probar errores y límites del proveedor de IA, tiempos de respuesta y comportamiento bajo carga progresiva. Mejorar observabilidad sin registrar información sensible. | La aplicación muestra un mensaje claro si el servicio no responde. Se cuenta con métricas y resultados de carga reproducibles para un escenario de 40 usuarios, sin declarar capacidad hasta comprobarla en el entorno y configuración previstos. |
| 7 · 13–14 | Ejecutar piloto supervisado y preparar entrega. Ensayar con usuarios autorizados, registrar incidencias y accesibilidad, corregir defectos prioritarios, preparar soporte y decisión de salida. | Informe del piloto con número real de participantes, resultados, incidencias y decisiones. Manual breve de uso y soporte, lista de incidencias conocidas y aprobación de responsables para el despliegue. |

## Historias prioritarias y criterios

Las siguientes historias son candidatos al backlog. Su asignación y esfuerzo se refinan al inicio de cada sprint.

| ID | Historia | Aceptación verificable | Sprint |
| --- | --- | --- | --- |
| HU-P01 | Como estudiante, quiero responder el cuestionario desde mi equipo para explorar mis intereses. | Puedo iniciar, responder 16 preguntas y llegar al resultado sin pérdida inesperada de respuestas durante el recorrido. | 2 |
| HU-P02 | Como estudiante, quiero entender cómo se generó mi resultado para interpretarlo con orientación. | El resultado explica su propósito y presenta las recomendaciones como apoyo para explorar. | 3 |
| HU-P03 | Como estudiante, quiero consultar información de carreras con sus fuentes para verificarla. | El sistema identifica la fuente registrada o informa que no hay datos disponibles. | 3 |
| HU-P04 | Como usuario autorizado, quiero recibir un código temporal para acceder a mi cuenta. | El código tiene vencimiento, admite intentos limitados y no permite acceso tras caducar. Su canal y proveedor se eligen en el sprint 4. | 4–5 |
| HU-P05 | Como personal del colegio, quiero consultar solo los datos autorizados de mi institución. | Pruebas con identidades de colegios diferentes rechazan acceso cruzado y verifican los roles aplicables. | 5 |
| HU-P06 | Como estudiante, quiero que Chaski me explique cuando no dispone de información oficial. | Ante un dato ausente, responde con la indicación de información no disponible sin inventar carreras, precios ni requisitos. | 6 |
| HU-P07 | Como responsable del servicio, quiero conocer tiempos y errores durante un piloto para actuar ante fallas. | Las métricas recogen tasa de error y latencias por ruta sin guardar claves, códigos ni respuestas sensibles en texto libre. | 6–7 |

## Dependencias y riesgos

- **Acceso y OTP.** La definición del canal de entrega, el proveedor, la recuperación y las reglas para cuentas de estudiantes dependen de la decisión del responsable del producto y de la configuración institucional. Antes de usar datos reales, verificar autorizaciones, privacidad y edad aplicables con el colegio.
- **Información vocacional.** El contenido depende de fuentes oficiales registradas y revisiones de vigencia. Las afirmaciones cuantitativas requieren trazabilidad. La validación pedagógica no se sustituye por una prueba técnica.
- **IA y costos.** Chaski depende de la disponibilidad, límites y facturación del proveedor configurado. Las pruebas deben usar límites y presupuesto aprobados por el responsable.
- **Capacidad simultánea.** Cuarenta estudiantes es la meta de prueba, no una capacidad garantizada. Registrar mezcla de acciones, tasa de error, percentiles de latencia, infraestructura y fecha de cada ensayo.
- **Disponibilidad del colegio.** Reservar con anticipación espacios para revisión de contenidos y piloto. Si se retrasa, mantener los entregables en validación y replanificar.

## Reglas de seguimiento

Al final de cada sprint, registrar el trabajo realmente terminado, pruebas ejecutadas, resultados, pendientes, responsable y decisión del equipo. Una historia se considera terminada cuando cumple sus criterios, pasa las comprobaciones pertinentes, cuenta con revisión y sus cambios están documentados. Ningún sprint de este plan debe marcarse como ejecutado sin evidencia.
