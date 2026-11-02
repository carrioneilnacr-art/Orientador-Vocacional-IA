# Auditoría de preparación: Plaza de Lima y colegio

Fecha: 1 de noviembre de 2026. Alcance: versión local de escritorio; revisión de código, pruebas automáticas, conectividad de movimiento e inspección del navegador. No se modificó la lógica del juego durante esta auditoría. Se excluye una nueva inspección visual de las aulas, según el alcance solicitado anteriormente.

## Seguimiento: correcciones implementadas

Tras la auditoría se corrigieron NAV-01, FLOW-01, UI-01, SAVE-01, RESET-01, NPC-01, GEO-01, DEPTH-01, BUS-01 y QA-01 en el código. La tabla original se conserva más abajo como registro del diagnóstico, no como estado actualizado.

- Suelo poligonal con margen de los pies; cerrado el corredor al cielo. Muestreo nuevo: plaza **22.253/22.253** posiciones libres conectadas, patio **14.823/14.823**; cero libres desconectadas en esa malla. `auditoria-rutas.json` actualizado.
- Gate compartido por UI, teclado y padre que exige los cinco IDs obligatorios. El capítulo cuenta solo esas cinco conversaciones; 5/5 equivale a 100%.
- Envoltorio de guardado versionado `chaski-journey-v1`: capítulo, preferencias, conversaciones de plaza/colegio y actividades se guardan juntos. Migra las claves anteriores y valida las entradas; no modifica pesos RIASEC. Recarga en un punto seguro del patio, no en la posición exacta ni a mitad de escalera/aula.
- Reinicio remonta el mundo, vuelve a plaza, limpia respuestas del colegio y elimina el override de URL de vista de desarrollo. Las pruebas de reinicio se hicieron con datos creados para QA en el origen separado `localhost:3001`, sin borrar la partida habitual de `localhost:3000`.
- Sofía tiene huella sólida, paso por el pasillo y profundidad por pies. La pausa conserva la escalera. Caballete y jardín del busto tienen siluetas y profundidad. El embarque se sitúa al lado izquierdo visible del bus, en (960,875), con la huella del vehículo ampliada.
- ESLint usa las configuraciones flat oficiales instaladas de Next; no se desactivaron reglas. Ajuste mínimo de refs de aula para que el linter se ejecute correctamente; actividades y arte del aula conservados.

Validaciones ejecutadas después de los cambios:

- **137/137 pruebas**, 21 archivos.
- TypeScript sin errores.
- ESLint dirigido a componentes/física/persistencia modificados: sin errores ni advertencias. No es una declaración sobre todo el repositorio.
- `npm run build`: compilación, tipos y 28 páginas generadas correctamente.
- Navegador sobre compilación de producción en puerto 3001: cinco conversaciones completadas por teclado; bloqueo real al intentar embarcar con 4/5; desbloqueo a 5/5; llegada al colegio; respuesta de Elena; recarga conservando capítulo y respuesta; bitácora confirmada; reinicio desde colegio y segunda recarga en plaza con 0/5.
- Navegador local: embarque con Chaski visible, subida de escalera y pasillo hasta rodear a Sofía. No se entró en aulas durante el recorrido visual.

Evidencia: `validacion-bloqueo-4-de-5.png`, `validacion-embarque-v2.png`, `validacion-bitacora-colegio.png`.

Límite de la verificación: los defectos enumerados tienen corrección y pruebas de regresión, pero no se declara ausencia absoluta de bugs. Sigue pendiente una comparación visual exhaustiva de cada píxel de todas las máscaras y una medición formal de rendimiento en distintos equipos. El escenario 3 y la movilidad escolar son el siguiente desarrollo; no están implementados por este cierre de correcciones.

## Dictamen

**No apto para declarar ambos capítulos cerrados ni libres de bugs.** La base es jugable, pero hay dos fallos de prioridad alta en límites y progresión. Puede diseñarse el capítulo 3; antes de incorporarlo conviene cerrar los defectos siguientes y repetir las pruebas de aceptación.

## Evidencia ejecutada

- `npx vitest run`: 20 archivos, 128 pruebas aprobadas.
- `npx tsc --noEmit`: salida 0, sin errores.
- `node scripts/audit-map-routes.cjs`: plaza 28.713 posiciones alcanzables de 30.513 consideradas libres; patio 14.823 de 14.823. Muestreo de 5 píxeles con las funciones reales de movimiento. La prueba de centro sólido de cada objeto pasa, pero no demuestra que todo su contorno coincida con el arte.
- ESLint sobre componentes y física de ambos capítulos: no completado; la configuración falla con `TypeError: Converting circular structure to JSON`. No equivale a cero advertencias.
- Navegador: plaza y patio cargan. Se confirma 5/5 conversaciones con barra de 56%; patio muestra su actividad guardada. Se realizaron desplazamientos parciales por la plaza. Los intentos posteriores no permitieron reproducir visualmente el recorrido al cielo, que sí está confirmado con las funciones de física.
- No se ejecutó build de producción ni medición formal de rendimiento. No se completó un barrido visual nuevo de cada lado de cada objeto. Las pruebas verdes no certifican todas las máscaras, resoluciones de escritorio ni secuencias de entrada.

## Hallazgos y aceptación

| ID | Prioridad | Hallazgo y evidencia | Criterio de cierre |
|---|---|---|---|
| NAV-01 | Alta | Plaza sin superficie caminable explícita. `plazaPhysics.ts:40` solo comprueba límites del lienzo y obstáculos. Desde (850,749), `movePlayer(p,325,0)` y `movePlayer(p,0,-735)` llega aproximadamente a (1163.11,14), libre: cielo accesible. | Polígono de suelo con margen del jugador; ninguna posición alcanzable fuera del pavimento previsto. |
| FLOW-01 | Alta | `PlazaPlayable.tsx:84,87` desbloquea el bus con >=3 conversaciones; la misión requiere 5. `Adventure.tsx:263` repite el umbral antiguo. | 0..4 bloquean; los cinco IDs válidos desbloquean teclado y clic, con mensaje coherente. |
| UI-01 | Media | `Adventure.tsx:200-201` mezcla cinco conversaciones y cuatro misiones antiguas en el denominador del capítulo. 5/5 produce 56%. | Plaza completa muestra 100%; porcentaje y contador representan el mismo objetivo. |
| SAVE-01 | Media | `Adventure.tsx:126,158-169` guarda elecciones pero no capítulo, piso ni posición. Recargar colegio en URL normal devuelve a plaza. | Reanudación en el capítulo correcto, en un punto seguro; restauración validada contra colisiones. |
| RESET-01 | Media | `Adventure.tsx:368-374` vacía evidencias pero no vuelve a plaza ni remonta el mundo. Respuestas locales de colegio siguen vivas. | Reiniciar desde patio o aula devuelve al inicio, borra toda respuesta y restablece bloqueo y posición. |
| NPC-01 | Media | `ColegioPatio.tsx:15,115` guarda Elena/Sofía solo en estado local; no llegan a bitácora ni sobreviven recarga. | Definir si son evidencia vocacional; si lo son, guardarlas y restaurarlas con IDs propios, sin duplicados. |
| GEO-01 | Media | Sofía se pinta siempre después de Chaski; segundo piso usa movimiento fijo sin collider del NPC (`ColegioPatio.tsx:60,85`). | Huella independiente, aproximación sin solapamiento indebido y profundidad coherente con los pies. |
| DEPTH-01 | Media | Caballete y jardín del busto tienen colisión pero carecen de `depth/canopy` (`plazaPhysics.ts:19,31`); restauración de primer plano los omite (`PlazaPlayable.tsx:47`). | Rodear y pasar detrás con oclusión correcta; no copiar suelo sobre el personaje. |
| BUS-01 | Media | Embarque (1195,835), sprite del bus y banda de colisión inferior no están alineados (`PlazaPlayable.tsx:35`, `plazaPhysics.ts:5,34`). El acceso puede ocultar al personaje. | Puerta reconocible y punto de interacción visible; no atravesar carrocería ni perder legibilidad al embarcar. |
| QA-01 | Media | ESLint no arranca por configuración FlatCompat. | Linter ejecutable y resultados revisados, además de tipos y pruebas. |

La clasificación por color de árboles, bancas y jardines en `plazaOcclusion.ts` es un riesgo de transparencia, no prueba suficiente de un defecto en cada objeto. Requiere comparación visual de siluetas. La auditoría anterior está en `AUDITORIA_RECORRIDO.md` y conserva los sectores pendientes.

## Puerta de salida al capítulo 3

Actualmente no hay condición ni transición colegio → capítulo 3: `Adventure.tsx:225` guarda las actividades, pero no desbloquea una salida. Es funcionalidad pendiente, distinta de un fallo de colisión.

Propuesta de diseño: capítulo 3 **Feria de talentos**. La plaza presenta preferencias; el colegio permite probar habilidades; la feria conecta ambas en retos prácticos de ciencia, arte, tecnología, organización y colaboración. No presentar todavía una profesión final ni resultados diagnósticos.

Transporte propuesto: **movilidad escolar**, con un pequeño bus de excursión en la salida del colegio. Tras completar las tres actividades obligatorias, Elena ofrece una invitación a la feria. Chaski camina a la puerta, interactúa con el vehículo, se guarda el avance, se ve una transición breve del viaje y aparece en un punto seguro de la feria. Es una propuesta narrativa de juego, no una ruta real de transporte de Lima. Mantener el Metropolitano para la conexión ya establecida plaza → colegio.

## Pruebas de cierre antes de integrar el siguiente escenario

1. Cerrar los dos hallazgos altos y repetir pruebas de movimiento con límites caminables explícitos.
2. Inspeccionar cada obstáculo por delante, detrás y ambos costados; registrar captura y objeto; comprobar máscara, base y puntos de contacto de pies.
3. Recorrer subida, descenso, ambos extremos del pasillo y regreso de cada puerta. Comprobar pérdida de foco y apertura de bitácora durante movimiento.
4. Probar partida nueva, recarga, guardado, reset, repetir conversación, los umbrales 4/5 y 5/5, y actividades repetidas sin duplicación.
5. Verificar vista normal y pantalla completa en tamaños de escritorio, errores de consola, carga fallida de assets y rendimiento; ejecutar build de producción y linter reparado.

El cierre se acredita con evidencia de estos casos, no con un porcentaje estimado de calidad.
