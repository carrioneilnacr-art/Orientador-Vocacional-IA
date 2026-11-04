# Piloto operativo de Chaski con40 alumnos

Plan propuesto, no resultado de un piloto realizado. Responsable: un coordinador del colegio, personal autorizado de orientación y una persona que registre incidencias técnicas. Primero ensayo con4–8 personas; después una sesión de aproximadamente45minutos con40 alumnos. No empezar con varios salones hasta revisar esta primera sesión.

## Preparación el día anterior

1. Confirmar versión publicada y hacer un recorrido completo con una cuenta de prueba: acceso, aventura, consulta a Chaski, guardado y recuperación desde otro inicio de sesión permitido.
2. Verificar que existen colegio, alumnos, códigos individuales y permisos del personal. La pantalla `/colegio/acceso` utiliza códigos ya provisionados; no genera automáticamente una cohorte. Si no existen, provisionarlos mediante el procedimiento administrativo autorizado antes de convocar al grupo; no compartir una cuenta entre40 personas ni usar registros demo como resultados reales.
3. Completar el procedimiento de autorización/consentimiento del colegio. Comprobar estado activo y consentimiento de cada participante. No asumir que un clic de la aplicación reemplaza todos los requisitos institucionales.
4. Reservar40 dispositivos, probar WiFi del mismo salón y navegadores. Separar fallos de equipo/red de fallos del servidor. Tener un dispositivo de reemplazo y una forma de reportar incidencias por código de participante.
5. Tener acceso a registros de Vercel, estado de Supabase y consumo GPT. Confirmar créditos y límites del proveedor. No poner claves ni datos personales en hojas compartidas.

## Ejecución sugerida

| Minutos | Actividad |
|---|---|
|0–5 | Explicar objetivo exploratorio; entregar cada código de forma privada y abrir `/colegio/acceso` |
|5–10 | Los40 acceden y abren `/aventura`; anotar fallos de acceso, carga o dispositivos |
|10–25 | Recorrido libre por Plaza/colegio; probar bitácora y acompañamiento de Chaski |
|25–30 | Todos consultan a Chaski una vez: “¿Qué puedo hacer ahora en este escenario?”; después una pregunta personal sobre lo explorado. No pedir que envíen mensajes repetidamente |
|30–38 | Completar las actividades disponibles, guardar y recargar para comprobar recuperación; reintentar únicamente si hay un aviso de fallo |
|38–45 | Retroalimentación breve y revisión de evidencias por personal autorizado; registrar incidencias sin exponer respuestas individuales al salón |

Si no todos llegan al colegio en ese tiempo, no marcar actividades ficticias para cerrar la prueba. Registrar dónde se detuvieron y continuar según el objetivo del ensayo. La aventura disponible no es un diagnóstico ni prueba de aptitud.

## Qué medir

Registrar por fase: participantes que iniciaron/terminaron, errores de acceso, guardados recuperables, códigos HTTP429/503, identificadores técnicos de solicitud, tiempo hasta primer texto y fin de respuesta GPT, carga del escenario y congelamientos del dispositivo. Vercel/Supabase deben revisarse junto con los tiempos del navegador; un200 sin respuesta completa o guardado confirmado no acredita éxito.

Objetivos iniciales propuestos, por validar: p95 API sin IA≤3s, primer texto GPT≤5s y respuesta completa≤10s. Cero exposición entre colegios y cero resultados perdidos sin mecanismo de recuperación. Si no hay40 muestras válidas, informar el número observado; no inventar percentiles.

Formato de incidencias: código de participante | hora | fase | dispositivo/red | qué esperaba | qué ocurrió | requestId si existe | pudo continuar | resolución. No copiar conversaciones sensibles ni contraseñas al registro.

## Decisión al terminar

- Continuar con otro salón si todos los resultados presentados como guardados se recuperan, no hay fallos de permisos y la latencia permite completar la sesión.
- Detener la ampliación ante exposición de datos, errores repetidos, guardados no recuperables o bloqueo general del chat. Conservar bitácoras y registrar la incidencia; no borrar resultados para ocultar fallos.
- Separar abandono por instrucciones/confusión de incapacidad del servidor. Preguntar qué entendieron de Chaski, dónde necesitaron ayuda y si la respuesta reflejaba lo que habían declarado.

Repetir con dos salones sólo después de corregir los hallazgos; medir de nuevo, sin extrapolar automáticamente que una prueba de40 acredita80 o120 alumnos autenticados.
