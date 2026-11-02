# Lecciones aprendidas al construir la Plaza de Lima

## Errores, causas y soluciones observadas

| Problema | Causa comprobada en el código | Solución aplicada o regla para el Colegio |
| --- | --- | --- |
| Chaski atravesaba o se mezclaba con objetos | La imagen visible y la huella física no se modelan con la misma geometría; una caja que cubre todo un sprite tampoco representa su base. | `plazaPhysics.ts` separa huellas rectangulares, elípticas y poligonales. En el Colegio cada elemento tendrá base física e imagen independientes, con rutas probadas alrededor. |
| Faroles, árboles y bancas se ordenaban mal | El centro de una imagen no es su punto de apoyo. | `PlazaPlayable.tsx` ordena Chaski y NPC por la Y de los pies. Los objetos tienen profundidad de base; los niveles elevados requerirán además capas explícitas. |
| Aparecían parches o suelo duplicado al caminar detrás de objetos | Los recortes extraídos del atlas incluían píxeles vecinos y se repintaban completos cada fotograma. | Los recortes ahora se aplican solo donde un personaje se cruza con el objeto. Para el Colegio preferir sprites separados con alfa real y no extraerlos de una escena compuesta. |
| Algunos personajes quedaban ocultos por jardineras | La profundidad y el área de una máscara podían cubrir el punto de apoyo de un NPC. | Comprobar para cada objeto el área visible, la máscara, la base física y la profundidad con los personajes en ambos lados. |
| Escenarios anteriores parecían maquetas | `AdventureWorld.tsx` usa un paisaje SVG y estaciones de actividad que no corresponden a puertas ni salas caminables. | No tomar esa escena como base visual del Colegio. Migrar sus funciones útiles tras extraer el controlador de Chaski de la Plaza. |

## Reglas para mapas siguientes

1. Usar una única escala de mundo por escenario. Posicionar cada entidad por los pies o la base y documentar el origen del sprite.
2. Separar suelo, arquitectura, objetos con oclusión, NPC y elementos de primer plano. El arte estático puede componerse por capas, pero las puertas, escaleras, colisiones y oclusiones deben ser entidades del mapa.
3. Definir el collider según la base que ocupa el objeto. Su zona de interacción es otro dato y no bloquea el paso.
4. Probar entrada, salida y retorno de cada sala; verificar que ningún cambio de zona reinicie el progreso ni el estado de Chaski.
5. Para los dos pisos, usar regiones navegables conectadas y profundidad por nivel. Ordenar solo por Y no resuelve una barandilla elevada.
6. Mantener interés, preferencia y desempeño como evidencias distintas. Las elecciones narrativas no son un diagnóstico vocacional.
7. Cargar solo los recursos de la zona activa y limpiar animaciones, observadores y listeners al desmontarla.

## Pruebas de regresión necesarias

- Rutas: rodear fuente, jardineras, bancas y NPC; en el Colegio, todas las mesas, paredes, puertas, barandillas y escaleras.
- Profundidad: tomar capturas delante y detrás de árboles, bancas y faroles; comprobar que el fondo no cambia fuera del personaje.
- Movimiento: las cuatro direcciones, diagonales, reposo, colisión deslizante y bloqueo durante diálogos.
- Progreso: cada actividad cuenta una sola vez tras completarse; reabrirla no duplica evidencia; recargar conserva las respuestas.
- Transiciones: Plaza → Colegio → salas → patio → segundo piso → patio, con regreso sin pérdida de datos.
- Accesibilidad: teclado para diálogo y opciones, reducción de movimiento y foco restaurado al cerrar.
