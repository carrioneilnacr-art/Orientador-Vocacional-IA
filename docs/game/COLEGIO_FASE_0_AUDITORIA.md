# Capítulo 2 — Colegio: auditoría y plan técnico (Fase 0)

Esta fase documenta cómo ampliar el juego. No se ha programado el escenario ni se ha usado la imagen de referencia como fondo. La referencia muestra un patio de colegio peruano, fachada de dos niveles, bandera, jardines, escaleras, cancha y cuatro interiores; el Colegio será un solo capítulo con zonas conectadas.

## Estado real del proyecto

| Sistema | Implementación actual | Reutilización prevista |
| --- | --- | --- |
| Framework y renderizado | Next.js y React; la Plaza vigente se dibuja en Canvas 2D a 1671 × 941 en `src/components/game/PlazaPlayable.tsx`. | Conservar Canvas y el escalado sin deformación. Crear datos de mapa y renderizadores por zona, no otro motor. |
| Avatar | `chaski-camina.png`, `chaski-frente.png`, `chaski-espalda.png` y `src/game/chaski*Frames.json`. Se usa una altura visual de 100 unidades; el origen es el pie. | Usar exactamente estas hojas, recortes y dimensiones. Extraer la lógica de dibujo y control de `PlazaPlayable.tsx` para compartirla. |
| Movimiento | WASD/flechas; velocidad objetivo 210 unidades/s, aceleración suavizada con `1-exp(-20*dt)`, paso diagonal normalizado. `movePlayer` avanza en subpasos de hasta 4 unidades. | Extraer controlador y mantener estos parámetros. No reutilizar el controlador distinto de `AdventureWorld.tsx` (175 unidades/s). |
| Física | `src/game/plazaPhysics.ts`: límites, rectángulos, elipses, polígono de la fuente y NPC con collider en los pies. | Generalizar el resolvedor para recibir sólidos y límites de la zona; los obstáculos del Colegio se definirán por objeto. |
| Profundidad | Chaski y NPC ordenados por Y de los pies; objetos del fondo tienen recortes frontales condicionados por profundidad. | Reusar el principio y los filtros de alfa; crear capas explícitas para pasillo superior, barandillas y escalera. |
| NPC | `src/game/plazaRpgNpcs.ts` y `src/components/game/PlazaNpcRenderer.ts`: entidad, punto de apoyo, rango de interacción, burbuja y resaltado. | Parametrizar renderizador y distancia por zona. Exactamente cinco NPC obligatorios del Colegio; decorativos sin interacción. |
| Diálogo | `src/components/game/PlazaRpgDialogue.tsx`: texto a 30 ms por letra, avance con E/Enter/Espacio, tres opciones, teclado y clic, movimiento pausado. | Generalizar datos/identidad del NPC conservando el mismo componente visual y sus controles. |
| Bitácora y guardado | `src/components/game/Adventure.tsx` guarda dos estructuras en `localStorage`: `chaski-adventure-v1` y `chaski-plaza-rpg-v1`. | Añadir una versión de progreso escolar validada y mostrarla en la bitácora existente sin perder las entradas de Plaza. El guardado es local a este navegador. |
| RIASEC | `rpgRiasec` en `src/game/plazaRpgDialogues.ts` calcula pesos narrativos exploratorios; `getPlazaRiasec` calcula otro esquema antiguo. El cuestionario vocacional es un flujo separado. | Mantener evidencias escolares separadas de interés y desempeño; no mezclar ni publicar porcentajes como si fueran resultados validados. Definir pesos configurables con revisión psicométrica antes de implementarlos. |
| Transición | `PlazaPlayable` llama `onBoard`; `Adventure.tsx` cambia `scene` a `colegio` y muestra `AdventureWorld`. | Sustituir la escena escolar provisional por el capítulo nuevo y conservar en `Adventure.tsx` el estado de Plaza y bitácora. |

## Brechas que hay que resolver antes de considerar terminado el capítulo

- El Colegio actual en `AdventureWorld.tsx` es un paisaje SVG genérico con cuatro estaciones; no contiene patio fiel, salas, puertas ni escaleras funcionales. Su avatar tiene movimiento y dibujo diferentes de los de la Plaza.
- El Metropolitano de la Plaza se desbloquea con **3** respuestas (`PlazaPlayable.tsx`), mientras el capítulo solicitado exige **5**. La auditoría no cambia esta condición; hay que acordar la regla única al integrar la transición.
- `scene` y la posición del personaje no se persisten; la carga inicia en la Plaza. El nuevo gestor debe guardar zona y posición segura sin perder decisiones anteriores.
- Los pesos narrativos de Plaza no están conectados al cuestionario ni al sistema final de recomendaciones. Antes de integrar el Colegio se necesita un modelo explícito de evidencias y una revisión de su interpretación.
- No se encontraron assets escolares dedicados en `public/game/`. La imagen adjunta es dirección artística, no un sprite utilizable como escenario jugable.
- La Plaza aún depende de recortes de una imagen compuesta para parte de la oclusión. En el Colegio se deben usar objetos separados con transparencia real para evitar las distorsiones ya detectadas.

## Diseño de implementación propuesto

1. **Base compartida:** extraer de `PlazaPlayable.tsx` el controlador de movimiento, las hojas de Chaski, el ciclo Canvas, el escalado y el orden de entidades. Mantener adaptador de Plaza para evitar regresiones.
2. **Datos de zona:** definir patio, laboratorio, taller creativo, aula tecnológica y segundo piso bajo un único `chapterId: colegio`. Cada zona tendrá dimensiones, suelo, objetos, colisiones, oclusores, puertas y punto de llegada. El pasillo y las escaleras conectan patio y segundo piso.
3. **Arte:** crear tiles de suelo y sprites independientes para fachada, bandera, puertas, barandillas, gradas, bancas, jardineras, árboles, cancha y mobiliario interior, en pixel art compatible con Chaski. Verificar alfa, bordes, escala y huella física por recurso. No incrustar la imagen de referencia.
4. **Navegación:** hacer el patio transitable. La escalera se modelará como ruta continua con puntos intermedios y regiones de piso; el jugador podrá subir y bajar manteniendo los pies sobre los escalones. Las puertas activarán transiciones breves entre salas del mismo colegio.
5. **Cinco NPC:** Elena en patio; Diego en laboratorio; Lucía en taller; Andrés en aula tecnológica; Sofía en segundo piso. Reusar burbuja, resaltado y cuadro RPG. Los alumnos ambientales no tendrán acciones.
6. **Actividades y evidencia:** diseñar cinco interacciones breves distintas. Guardar `chapterId`, `npcId`, `activityId`, respuesta, preferencia, desempeño separado, estado y versión de evidencia. Completar solo al terminar; repetir no suma de nuevo. No introducir puntuaciones RIASEC arbitrarias antes de revisar su configuración.
7. **Progreso:** `Actividades 0/5` en la interfaz y detalle en la bitácora. Salida al Capítulo 3 tras 5/5; mientras no exista Feria de Profesiones, mostrar capítulo completado en el Colegio.
8. **Verificación:** pruebas de física, rutas, escalera, diálogos, progreso y persistencia; recorrido manual de cada zona; pruebas de regresión de la Plaza. Ver `docs/LECCIONES_APRENDIDAS_MAPAS.md`.

## Recursos necesarios y riesgos

- **Arte:** atlas o sprites escolares transparentes, consistentes en escala y luz; interiores separados; retratos y sprites de los cinco NPC. Se puede reutilizar Chaski y parte del mobiliario común de Plaza. Los assets todavía no se han generado.
- **Riesgo visual:** la referencia combina patio, segundo piso, mapa e interiores en una lámina. Cada panel debe convertirse en una zona jugable; copiar su composición como una sola imagen impediría oclusión y colisiones reales.
- **Riesgo técnico:** un refactor amplio del controlador puede romper la Plaza. Extraer piezas pequeñas, comparar movimiento y rutas, y conservar las pruebas existentes.
- **Riesgo de datos:** el progreso guardado actual tiene dos formatos para Plaza. El esquema escolar deberá migrar o coexistir sin borrar decisiones existentes.
- **Riesgo psicométrico:** preferencia por una tarea y habilidad al realizarla son mediciones distintas; ninguna elección escolar basta para inferir una carrera o universidad.

## Entregas por fases

Esta auditoría es la **Fase 0**. La siguiente entrega implementaría solo patio, arquitectura, Chaski y colisiones; después interiores y segundo piso; luego cinco NPC y diálogos; actividades; progreso; y pulido. Cada fase se revisará visual y funcionalmente antes de extender el mapa.
