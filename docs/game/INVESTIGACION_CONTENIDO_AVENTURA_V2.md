# Renovación de contenido de la aventura — 02/11/2026

## Alcance implementado
Cinco dilemas de la Plaza, conversaciones de Elena y Sofía y tres desafíos de aula. Mapas, sprites, física y composición conservados. Historia común: preparar una muestra escolar que conecta con la comunidad. Público de diseño asumido: secundaria peruana, pendiente de contraste con estudiantes.

## Investigación y decisiones
- [O*NET Interest Profiler Manual (2021)](https://www.onetcenter.org/reports/IP_Manual.html): intereses para exploración; no confundir con capacidades. RIASEC orienta la cobertura editorial, no valida nuestras preguntas originales ni autoriza usar su baremo.
- [OECD, Indicators of teenage career readiness (2021)](https://www.oecd.org/en/publications/indicators-of-teenage-career-readiness_cec854f8-en.html): explorar, experimentar y pensar sobre el futuro. Aplicación de diseño: situación, acción, consecuencia y reflexión. La asociación longitudinal no demuestra eficacia de este videojuego.
- [MINEDU, Reconozco mis habilidades y capacidades](https://www.minedu.gob.pe/somospromo/pdf/orientacion-vocacional/guias/ov-reconozco-mis-habilidades-y-capacidades.pdf): autoconocimiento a partir de experiencias y habilidades desarrollables. Notas situadas, sin identidades rígidas.
- [Ryan, Rigby y Przybylski (2006)](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf): autonomía y competencia percibida relacionadas con disfrute. Aplicación editorial: decisiones con consecuencias comprensibles, controles claros, ayuda y reintento. No garantiza motivación en nuestra población.

Fuentes consultadas el 02/11/2026. Diálogos originales, no copia de ítems O*NET. Datos de plantas y fallas son simulados y se presentan como tales; no son datos institucionales ni recomendaciones de carrera.

## NPC y situaciones
| NPC | Situación | Pista exploratoria |
|---|---|---|
| Mateo | Afiches con materiales limitados | Expresar, investigar o experimentar con materiales |
| Ernesto | Fotos con fechas contradictorias | Registrar, contrastar o escuchar memoria comunitaria |
| Valeria | Visita de estudiantes nuevos | Acompañar, comunicar u organizar |
| Luis | Colas y alimentos sobrantes | Producción, propuesta u organización |
| Camila y Diego | Proyecto para reducir desperdicio de agua | Prototipar, investigar o coordinar |
| Elena | Elegir qué observar del propio recorrido | Curiosidad, reintento o colaboración |
| Sofía | Muestra con espacio y tiempos limitados | Acuerdos, prueba de recorrido o guía visual |

Texto exacto, opciones, reacciones y notas en `src/modules/adventure/domain/narrativeContent.ts` (fuente compartida por cliente y servidor). Las tres preferencias son defendibles, sin nota moral ni respuesta vocacional correcta.

## Desafíos implementados
- Laboratorio: diseñar comparación controlada, interpretar una observación ficticia y reconocer límites de generalización.
- Taller: elegir audiencia, paleta, composición y forma de revisión; vista previa visual. No hay composición correcta ni puntuación estética.
- Tecnología: examinar tres comprobaciones, formular hipótesis, elegir intervención y verificar dos fallas simultáneas. Sustituye interruptores triviales.
- Todos permiten ayuda y revisión, sin cronómetro. Se puede reflexionar sin resolver correctamente. La preferencia declarada se guarda aparte de intentos y resolución. El resumen no infiere aptitud de esos datos.

## Arquitectura y conservación histórica
`contentVersion` por elección de Plaza y evidencia de aula; `schoolContentVersions` por conversación del patio. Ausencia equivale a legacy-v1, las respuestas nuevas llevan adventure-v2. Catálogo anterior congelado. Bitácora, diálogo repetido y resumen del servidor resuelven por versión. No se borran partidas, no se obliga a reiniciar y no se recalculan los pesos del cuestionario formal. Para probar todo el contenido nuevo desde cero se puede usar el reinicio existente voluntariamente.

## Pendiente antes de validar resultados finales
Revisión por orientador/psicólogo educativo; entrevistas cognitivas con alumnado; pilotaje de comprensión, atractivo y accesibilidad; cobertura equilibrada de experiencias prácticas, sociales, comerciales y administrativas; estudio independiente de fiabilidad, validez y sesgos de cualquier puntuación futura. Cinco dilemas y tres aulas no bastan para un perfil definitivo. Las elecciones forzadas de tres opciones también limitan lo que se puede interpretar. Los próximos escenarios deben ampliar experiencias, no repetir preguntas obvias.

## Verificación técnica
156 pruebas en 28 archivos pasan; TypeScript sin errores. HTTP GET /aventura respondió 200. No se realizaron inserciones de prueba en la base de datos ni se afirma pilotaje con estudiantes o inspección visual completa del nuevo flujo.
