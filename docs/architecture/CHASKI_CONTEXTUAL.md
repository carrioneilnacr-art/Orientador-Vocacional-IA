# Chaski dentro de la aventura

El botón Chaski del HUD y «Conversar con Chaski» de la tarjeta guía abren un diálogo bajo demanda. Se pausa el juego mientras el alumno escribe; Escape cierra y devuelve el foco. Cerrar cancela una petición pendiente. No se envían mensajes por movimiento ni se guardan nuevas evidencias por conversar.

El cliente envía únicamente escena, aula, personajes y elecciones/preferencias admitidas. No envía notas libres, identidad, puntajes ni rendimiento como contexto del juego. El servidor valida una lista cerrada y reconstruye las reflexiones desde contenido editorial versionado.

El prompt distingue guía editorial del mapa, estado actual declarado por el navegador y un recorrido guardado autorizado. Este último se obtiene exclusivamente mediante cookie firmada, propiedad de sesión, alumno activo y consentimiento actual; no se cachea. Una evidencia guardada puede pertenecer a una partida anterior y no certifica el avance local ni una aptitud. El cliente no puede escoger alumno/colegio mediante IDs del cuerpo.

Chaski puede orientar sobre Plaza, colegio, controles, personajes y siguientes actividades; para carreras y datos académicos sigue utilizando sólo fuentes recuperadas de la BD. No convierte decisiones narrativas en porcentajes ni diagnósticos. Los errores de infraestructura al consultar evidencia privada detienen la generación.

Guía operativa para la prueba con personas: [PILOTO_40_ALUMNOS.md](PILOTO_40_ALUMNOS.md). Antes de convocarla deben existir colegio, permisos y códigos individuales; esta entrega no crea automáticamente40 alumnos ni ejecuta el piloto escolar.

Verificación integrada:219 pruebas aprobadas y1 integración opt-in omitida, tipos correctos y build completado. Pruebas nuevas cubren rechazo de IDs/puntajes/campos arbitrarios, cookies manipuladas, aislamiento, consentimiento, contexto antiguo y ausencia de consultas privadas en el chat tradicional. La carga de40 alumnos autenticados sigue siendo un ensayo pendiente, distinto de las pruebas automatizadas.
