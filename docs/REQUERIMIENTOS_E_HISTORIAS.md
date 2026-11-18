# Requerimientos e historias de usuario

## Alcance y criterio de lectura

Inventario de la aplicación revisado a partir del código del repositorio. «Implementado» significa que existe código para la función y no certifica que una integración, fuente o configuración esté activa en producción. «Propuesto» designa trabajo pendiente. Las rutas antiguas `/api/aventura/*` y la consulta de exploraciones escolares siguen en el repositorio como funciones heredadas; la pantalla del videojuego fue retirada. Los datos reales de carreras, costos o matrícula deben proceder de las fuentes verificadas registradas; su disponibilidad depende de la base de datos.

Actores: visitante o estudiante invitado; estudiante con código institucional; psicólogo, tutor, director o administrador autorizado; operador técnico. Un estudiante puede usar la evaluación sin iniciar sesión. Las funciones institucionales dependen de la cuenta, el colegio, el rol y la configuración de servicios.

## Requerimientos funcionales implementados en código

| ID | Requerimiento | Criterio observable y evidencia |
|---|---|---|
| RF-01 | Presentar el cuestionario | `/cuestionario` muestra introducción, bloques temáticos y botón para comenzar. `src/components/test-intro/`. |
| RF-02 | Cargar preguntas y opciones | `GET /api/vocacional` obtiene el catálogo mediante el repositorio. Responde con error de servicio cuando no puede cargarlo. |
| RF-03 | Contestar y navegar | Seleccionar una opción habilita continuar; se puede volver a la pregunta anterior. Hay transiciones entre bloques de cuatro preguntas. `src/app/cuestionario/page.tsx`. |
| RF-04 | Validar respuestas | `POST /api/vocacional` valida el cuerpo y las respuestas contra el catálogo antes de calcular. Una solicitud inválida devuelve 400. |
| RF-05 | Calcular perfil y sugerencias | La capa de dominio calcula puntuaciones y ordena carreras mediante reglas; el repositorio resuelve datos de carreras. `src/modules/assessment/`. |
| RF-06 | Presentar el resultado | Tras el envío se muestra una revelación de perfil y se navega a `/resultados`, donde se presentan dimensiones, carreras y secciones relacionadas. |
| RF-07 | Conservar resultado local y gestionar fallos | La interfaz guarda respuestas y resultado en el navegador. El servidor devuelve `saved`; si no pudo persistirlo, se muestra aviso en resultados. La carga inicial borra las respuestas guardadas, por lo que reanudar tras recargar no está garantizado. |
| RF-08 | Exportar e iniciar otra evaluación | El informe ofrece impresión como PDF mediante el navegador y reinicio local. `src/app/resultados/page.tsx`. |
| RF-09 | Explorar información educativa | Hay páginas de universidades, detalle de carrera por identificador y explicación del sistema. La información disponible depende del catálogo y sus fuentes. |
| RF-10 | Conversar con Chaski | `POST /api/chat` valida mensajes, obtiene contexto de carreras y transmite la respuesta del proveedor configurado. Si no hay proveedor o contexto, informa indisponibilidad. |
| RF-11 | Acceder como estudiante institucional | Se valida un código escolar y su hash contra estudiantes; la respuesta crea una sesión si el acceso es válido. `POST /api/colegio/acceso`. |
| RF-12 | Vincular evaluación de invitado | Cuando existe una sesión de evaluación de invitado válida, el acceso institucional intenta asociarla con el estudiante. |
| RF-13 | Acceder como personal | Un usuario o correo y contraseña se autentican mediante Supabase Auth. Se comprueba la pertenencia al colegio y un rol permitido. `POST /api/colegio/staff/login`. |
| RF-14 | Gestionar sesión | Existen rutas para consultar sesión de estudiante y personal, y cerrarla. La cookie de personal tiene `HttpOnly`, `SameSite=Strict` y `Secure` en producción. |
| RF-15 | Gestionar consentimiento | Existe un endpoint institucional de consentimiento. Su procedimiento, responsables y efectos deben contrastarse con el diseño jurídico y la configuración del colegio antes de operar con estudiantes. |
| RF-16 | Consultar información académica | El portal presenta historia académica sujeta a sesión y permisos. `src/app/colegio/academico/` y `/api/colegio/academico`. |
| RF-17 | Importar calificaciones | Personal autorizado puede cargar archivo o contenido CSV, obtener validaciones y usar las rutas de confirmación y reversión. El límite de archivo indicado por el endpoint es 5 MB. `src/app/api/colegio/notas/`. |
| RF-18 | Consultar exploraciones heredadas | La ruta y pantalla institucional de exploraciones existen y aplican controles en el dominio. Deben revisarse porque el recorrido de videojuego ya no está disponible. |
| RF-19 | Registrar auditoría | El inicio de sesión institucional registra un evento de auditoría; existen registros adicionales en flujos escolares. No se ha verificado aquí cobertura integral. |
| RF-20 | Limitar solicitudes | Las rutas de evaluación y chat consultan límites de solicitudes. El acceso escolar aplica cuotas por IP y, para estudiante, también por credencial. Su comportamiento depende de la infraestructura configurada. |

## Requerimientos no funcionales

| ID | Requerimiento y criterio | Estado y evidencia |
|---|---|---|
| RNF-01 | **Privacidad y mínimo acceso.** Los datos escolares deben estar disponibles solo a quien corresponda por colegio y rol. | Parcial: existen sesiones y comprobaciones de permisos. Falta auditar exhaustivamente cada ruta y las políticas RLS. |
| RNF-02 | **Credenciales.** Evitar almacenar códigos de acceso de estudiantes en texto legible. | Implementado en la búsqueda mediante hash; revisar fortaleza de códigos, secreto y ciclo de vida. |
| RNF-03 | **Autenticación del personal.** Validar contraseña con el proveedor de identidad y autorización institucional. | Implementado con Supabase Auth y comprobación de rol. OTP/MFA no se observó en el flujo de inicio de sesión revisado. |
| RNF-04 | **Cifrado.** Proteger datos en tránsito y reposo, y limitar acceso a claves. | Propuesto como requisito verificable de despliegue; HTTPS y cifrado en reposo deben comprobarse en proveedores y configuración, no se certifican solo por el código. |
| RNF-05 | **Disponibilidad.** Informar errores comprensibles y permitir reintento. | Parcial: las APIs manejan diversos errores; la carga inicial fallida del cuestionario debe revisarse porque deja el catálogo vacío. |
| RNF-06 | **Capacidad.** Soportar al menos 40 estudiantes simultáneos en una sesión realista, con objetivos de latencia y errores aprobados. | Propuesto y pendiente de prueba integral con cuestionario, resultados, chat y servicios reales. La existencia de límites no demuestra esa capacidad. |
| RNF-07 | **Accesibilidad.** Navegación por teclado, nombres accesibles, contraste y mensajes de estado. | Parcial: hay botones semánticos, etiquetas y alertas en varias pantallas. Falta auditoría completa de teclado, lector de pantalla y contraste. |
| RNF-08 | **Adaptabilidad.** Presentar cuestionario, resultados y portal de forma legible en anchos de escritorio y móvil. | Parcial: se usan clases responsivas; falta verificación sistemática en dispositivos. |
| RNF-09 | **Trazabilidad de datos educativos.** Vincular datos cuantitativos a fuentes verificadas y fecha de consulta. | Requerimiento del proyecto. Auditar cobertura por campo y ausencia de fuentes antes de afirmar cumplimiento completo. |
| RNF-10 | **Confiabilidad del resultado.** Validar opciones y puntuar de forma reproducible según versión de reglas. | Parcial: dominio y pruebas disponibles; falta documentar formalmente versiones, validación psicométrica y reproducibilidad longitudinal. |
| RNF-11 | **Observabilidad.** Asociar errores de chat a una referencia para soporte. | Implementado en chat mediante identificador de solicitud y tiempos del servidor; no equivale a monitoreo completo del sistema. |
| RNF-12 | **Mantenibilidad.** Separar reglas de evaluación, aplicación y persistencia. | La evaluación tiene capas de dominio, aplicación e infraestructura; revisar deuda en páginas y componentes grandes. |
| RNF-13 | **Recuperación y retención.** Definir respaldos, pruebas de restauración, plazos y eliminación autorizada. | Propuesto. No se comprobó una política operativa. |
| RNF-14 | **Protección de menores y uso responsable.** La orientación es apoyo a la decisión y requiere tratamiento apropiado de datos de estudiantes. | Propuesto como control integral; revisar consentimiento, finalidad, privacidad y supervisión con el colegio. |
| RNF-15 | **Seguridad frente a abuso.** Limitar intentos y solicitudes costosas. | Parcial: existen límites, validaciones y tamaño máximo en rutas concretas. Faltan pruebas de abuso distribuidas y revisión de configuración. |

## Historias de usuario y aceptación

| ID | Historia | Criterios de aceptación | Estado |
|---|---|---|---|
| HU-01 | Como estudiante quiero conocer el propósito y la duración estimada para decidir si comienzo. | La introducción describe 16 preguntas, temas y duración estimada y permite comenzar. | Implementada en interfaz; estimación pendiente de medir. |
| HU-02 | Como estudiante quiero elegir una respuesta por pregunta y volver atrás para corregirla. | Sin selección no se puede avanzar; al volver se recupera la selección en la sesión actual. | Implementada. |
| HU-03 | Como estudiante quiero recibir un resultado relacionado con mis intereses. | Tras validar todas las respuestas se calculan dimensiones y carreras; si falla el envío aparece un mensaje. | Implementada, depende del catálogo y reglas. |
| HU-04 | Como estudiante quiero descargar mi informe para revisarlo después. | La acción abre la impresión del navegador con el informe; la disponibilidad de guardar como PDF depende del navegador. | Implementada. |
| HU-05 | Como estudiante quiero preguntar a Chaski sobre opciones para aclarar dudas. | Se puede enviar una consulta y ver una respuesta; ante falla se muestra error con referencia. | Implementada en API; requiere proveedor configurado. |
| HU-06 | Como estudiante quiero acceder con el código de mi colegio para vincular mi evaluación. | Un código válido inicia sesión y, cuando hay resultado de invitado verificable, intenta vincularlo; uno inválido se rechaza. | Implementada, depende de datos y configuración. |
| HU-07 | Como personal autorizado quiero iniciar sesión para acceder a mi colegio. | Credenciales y pertenencia se validan; una cuenta sin rol válido recibe rechazo. | Implementada. |
| HU-08 | Como personal autorizado quiero revisar la importación de notas antes de confirmar. | Se comprueba permiso, archivo y filas; las acciones de confirmar y revertir tienen rutas propias. | Implementada, comprobar permisos y operación con datos reales. |
| HU-09 | Como psicólogo quiero acceder a información del estudiante según mi rol para acompañarlo. | El acceso exige sesión válida y alcance institucional. | Parcial; verificar matriz completa y experiencia en portal. |
| HU-10 | Como estudiante quiero recuperar una evaluación interrumpida para no empezar de nuevo. | Tras recargar se restauran pregunta y respuesta sin pérdida; una sesión compartida no revela resultados ajenos. | Propuesta; el flujo actual borra respuestas al cargar. |
| HU-11 | Como personal quiero un segundo factor para proteger mi cuenta. | Activación y verificación de OTP, recuperación segura, límites de intento y registro de eventos; probado en dispositivos reales. | Propuesta; no se identificó OTP en el flujo actual. |
| HU-12 | Como estudiante quiero saber por qué se sugiere una carrera y consultar sus fuentes. | Cada dato verificable enlaza a fuente vigente; se informa explícitamente cuando no está disponible. | Propuesta de aceptación integral; auditar cada vista y fuente. |
| HU-13 | Como responsable del servicio quiero medir el desempeño de una clase completa. | Prueba con 40 y más usuarios, distribución de tareas, percentiles, errores, costos y límites documentados. | Propuesta, sin afirmar resultados actuales. |
| HU-14 | Como usuario con discapacidad quiero completar el cuestionario con teclado y lector de pantalla. | Foco visible, etiquetas, orden lógico, anuncios de error y contraste comprobados. | Propuesta de aceptación, pendiente de auditoría. |

## Trazabilidad y validaciones pendientes

1. Contrastar estas historias con responsables del colegio y actualizar estados con evidencia de pruebas y despliegue.
2. Inventariar datos sensibles, bases legales, responsables y retención antes de procesar nuevos datos escolares.
3. Verificar que resultados vacíos y fallos de red tengan una salida clara. En `resultados/page.tsx`, la condición de carga depende de una carrera seleccionada y puede impedir mostrar el estado vacío.
4. Retirar o adaptar referencias y endpoints heredados de aventura solo después de revisar sus datos y consumidores institucionales.
5. Separar los criterios medibles propuestos de resultados ya obtenidos. No se dispone aquí de una prueba que garantice 40 usuarios, certificación de accesibilidad ni validación psicométrica clínica.
