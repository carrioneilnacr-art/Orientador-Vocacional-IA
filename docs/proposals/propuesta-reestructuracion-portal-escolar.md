# Reestructuración del Portal Escolar de Chaski

**Estado:** Propuesta de producto para el MVP piloto  
**Propósito:** Alinear el portal escolar con el trabajo real del colegio y con la entrega incremental de valor del curso Administración de Proyectos de Software.

## Propuesta de valor

Chaski ayuda al equipo escolar a acompañar a cada estudiante desde la exploración vocacional hasta un próximo paso concreto, usando información verificable y seguimiento humano.

El resultado vocacional es una hipótesis para conversar con el estudiante. No es un diagnóstico psicológico, una predicción de éxito ni una decisión automática sobre su futuro.

## Usuarios y necesidades

| Usuario | Necesidad que resuelve el portal | Información que debe mostrar |
|---|---|---|
| Psicólogo | Identificar quién necesita conversación y organizar el seguimiento | Casos asignados, señales observables, notas de seguimiento y próximas acciones |
| Tutor | Acompañar acciones acordadas dentro de su aula | Avance, acciones pendientes y vías para derivar una preocupación |
| Administrador | Mantener la operación escolar y la calidad de los datos | Aulas, invitaciones, consentimientos, importaciones y auditoría |
| Director | Organizar la campaña vocacional y evaluar su alcance | Indicadores agregados, cobertura, actividades y resultados del piloto |
| Estudiante y familia | Comprender opciones y conversar sobre próximos pasos | Perfil explicado, carreras con fuentes y guía de exploración |

## Flujo central del producto

1. El colegio prepara aulas, estudiantes, códigos de acceso y consentimiento.
2. El estudiante realiza la exploración vocacional y recibe opciones justificadas con datos trazables.
3. El profesional escolar revisa el resultado como punto de partida para una conversación.
4. El profesional registra una acción acordada, responsable, fecha de revisión y estado.
5. El equipo consulta el avance agregado y ajusta talleres o acompañamiento.
6. El piloto mide uso y utilidad; las afirmaciones de impacto se publican únicamente cuando exista evidencia.

## Estructura propuesta del portal

- **Inicio / Pendientes:** trabajo que requiere atención, ordenado por próxima acción y fecha; sin puntajes de riesgo automáticos.
- **Seguimientos:** acciones acordadas, responsables, fechas y estado; permite registrar el resultado de la conversación.
- **Estudiantes:** búsqueda y filtros según rol y aula autorizada; vista individual con acceso auditado.
- **Campaña vocacional:** avance de participación, actividades y cobertura por aula.
- **Administración:** importación de notas, gestión de accesos, consentimiento, personal y auditoría.
- **Informes:** resúmenes agregados con protección para cohortes pequeñas y exportaciones funcionales.

## Reglas de producto y privacidad

- No inventar estadísticas ni mostrar datos de ejemplo como registros reales.
- No etiquetar a estudiantes como dispersos, apáticos, conflictivos o de alto riesgo a partir de un único cuestionario.
- No enviar nombres, códigos, notas ni otra información identificable de estudiantes a proveedores de IA.
- Limitar cada consulta por sesión, rol, colegio y aula en el servidor.
- Ocultar resultados agregados cuando el grupo tenga menos de cinco estudiantes.
- Solicitar consentimiento válido antes de recopilar o vincular datos de menores.
- Registrar accesos, cambios, importaciones y exportaciones sensibles.
- Informar de forma clara las fuentes y la fecha de actualización de los datos universitarios.

## Alcance del MVP del piloto

### Incluye

- Acceso seguro para personal y autorización por rol/colegio.
- Bandeja de pendientes y flujo de seguimiento con acción, responsable, fecha y estado.
- Vista individual para profesionales autorizados y vistas agregadas para dirección.
- Consentimiento y estado de participación visibles para el personal autorizado.
- Importación de calificaciones con validación, revisión humana y reversión auditada.
- Diseño responsive y accesible para móvil, tablet y escritorio.

### Fuera del MVP hasta validación

- Predicción de deserción o de éxito profesional.
- Envío automático de fichas a familias sin revisión y autorización.
- Recomendaciones clínicas o diagnósticos.
- Analítica avanzada que no esté basada en datos reales del piloto.
- Seguimiento de egresados y ROI financiero con cifras no verificadas.

## Criterios de aceptación del piloto

1. Un profesional puede iniciar sesión y solo consultar estudiantes de su colegio y ámbito autorizado.
2. Un profesional autorizado puede registrar y actualizar un seguimiento completo, con trazabilidad de autoría y fecha.
3. El panel diferencia información faltante, importada, confirmada y demostrativa.
4. La dirección puede revisar métricas agregadas sin acceder a fichas individuales.
5. Las exportaciones incluyen solo datos autorizados y respetan el umbral mínimo de cohorte.
6. Las pantallas principales se pueden operar en móvil sin desplazamiento horizontal general ni acciones inaccesibles por teclado.
7. El colegio puede completar un piloto y evaluar cobertura, acciones atendidas, utilidad percibida y problemas encontrados antes de afirmar impacto.

## Relación con el sílabo del curso

| Punto del curso | Evidencia del proyecto |
|---|---|
| Valor y beneficios | Propuesta de valor por interesado y evaluación del piloto |
| Interesados y comunicación | Revisión de flujos con psicología, tutoría, dirección, estudiantes y familias |
| Alcance, recursos y presupuesto | MVP delimitado y priorizado por entregas |
| Riesgos, calidad y gobernanza | Controles de privacidad, autorización, trazabilidad y revisión humana |
| Métodos ágiles y flujo | Entregas pequeñas revisables en Preview y límites de alcance por iteración |
| Cambios y control adaptativo | Historias, criterios de aceptación y registro de cambios aprobados |
| Beneficios, sostenibilidad y cierre | Informe de piloto, lecciones aprendidas y decisión fundamentada de continuar o ajustar |

## Ruta de implementación y despliegue

1. Validar este alcance y prototipo con interesados del colegio.
2. Implementar cada entrega en ramas de funcionalidad y abrir pull requests en GitHub.
3. Usar despliegues Preview de Vercel para revisar cambios antes de producción.
4. Preparar migraciones versionadas de Supabase, revisar seguridad y respaldos antes de aplicarlas.
5. Verificar roles, aislamiento por colegio, importación/reversión, consentimiento, auditoría y UI responsive en el entorno de Preview.
6. Publicar a producción cuando el piloto tenga datos de prueba autorizados y los criterios de aceptación estén satisfechos.
7. Medir resultados del piloto y actualizar el backlog según evidencia.
