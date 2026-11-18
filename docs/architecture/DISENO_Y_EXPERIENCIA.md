# Diseño, accesibilidad y experiencia del estudiante

Revisión del repositorio del 18 de noviembre de 2026. El sistema utiliza el cuestionario web; los documentos de juego conservados son históricos. La revisión estática no certifica cumplimiento WCAG ni sustituye pruebas con estudiantes y lectores de pantalla.

## Capacidades disponibles para el trabajo

| Herramienta local | Aplicación prevista | Ubicación |
| --- | --- | --- |
| ui-styling | Componentes, estados de formularios, Tailwind y diseño adaptable | `.agents/skills/ui-styling/SKILL.md` |
| design-system | Tokens de color, tipografía y especificaciones de componentes | `.agents/skills/design-system/SKILL.md` |
| better-interface | Revisión de accesibilidad, organización, tipografía y contenido | `.agents/skills/better-interface/SKILL.md` |
| better-accessibility | Etiquetas, teclado, contraste y mensajes de estado | `.agents/skills/better-accessibility/SKILL.md` |
| ui-ux-pro-max | Evaluación de recorridos de interfaz | `C:/Users/Leonardo/.codex/skills/ui-ux-pro-max/SKILL.md`, sujeto a disponibilidad local |

No se instaló software adicional. Estas habilidades orientan el trabajo futuro y no acreditan cumplimiento automático.

## Problemas y decisiones propuestas

1. **Continuidad del cuestionario.** `src/app/cuestionario/page.tsx` guarda respuestas en el navegador durante el recorrido, pero las elimina al cargar las preguntas. Definir una pantalla de reanudación o inicio nuevo con consentimiento claro, recuperación por identificador y opción de borrar datos. Verificar fallos de red y recargas en cada una de las 16 preguntas.
2. **Resultados sin carreras.** `src/app/resultados/page.tsx` depende de una carrera seleccionada. Mostrar un estado vacío cuando no hay coincidencias y permitir reintentar o volver al cuestionario. Comprobar catálogo vacío y respuesta incompleta.
3. **Acceso y OTP.** Diseñar estados para ingreso, código expirado, reenvío, errores y recuperación. Mantener el foco, ofrecer pegado y autocompletado y no revelar si una cuenta existe. El código del alumno actual es reutilizable; el MFA de personal es propuesto. Véase `AUDITORIA_SEGURIDAD_Y_CALIDAD.md`.
4. **Responsive.** Revisar portada, cuestionario, resultados, chat y portal de personal a 320, 375, 768, 1024 y 1440 píxeles. Comprobar ausencia de desplazamiento horizontal involuntario, contenido con zoom de 200 %, tablas y diálogos dentro de pantalla, y orientación horizontal y vertical. Son tamaños de prueba, no garantía de soporte.
5. **Accesibilidad.** Revisar teclado completo, foco visible, asociación de etiquetas y errores con sus campos, anuncios de cambios mediante regiones de estado, contraste de textos y controles, y alternativas al color. Aplicar WCAG 2.2 AA según el contenido y sus excepciones; comprobar tamaño de objetivos táctiles y autenticación accesible. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
6. **Lenguaje y confianza.** Explicar que el resultado orienta la exploración y necesita conversación con un orientador. Identificar fecha y fuente cuando se muestre información educativa, y mostrar disponibilidad desconocida cuando falte evidencia.
7. **Atención y recuperación.** Ofrecer contacto institucional verificable, mensajes de indisponibilidad y un canal de soporte definido con el colegio. No prometer atención, tiempos o cobertura que no estén acordados.

## Validación antes de liberar

- Recorrido completo con teclado y lector de pantalla, incluyendo botones para avanzar, regresar, cerrar diálogos, consultar resultados e imprimir.
- Pruebas con estudiantes y personal, sin registrar datos sensibles en capturas ni herramientas de análisis.
- Capturas en los tamaños indicados, mediciones de contraste y revisión de foco y zoom.
- Pruebas de interrupción de red, sesión vencida, código incorrecto y catálogo sin resultados.
- Registrar incidencias, prioridad, evidencia y fecha de corrección. Medir tiempos y accesibilidad de forma independiente; no declarar capacidad de 40 alumnos sin una prueba representativa.
