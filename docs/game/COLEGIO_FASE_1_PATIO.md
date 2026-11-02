# Colegio — Fase 1: patio jugable

La imagen enviada por el usuario se guarda sin deformación en `public/game/colegio/patio-referencia.png` (1672 × 941). Se usa como fondo visual del patio por instrucción explícita posterior a la auditoría. No se han incrustado NPC ni Chaski en ese fondo: Chaski usa las mismas tres hojas de animación y el mismo punto de apoyo que en Plaza de Lima.

## Estructura jugable

- `src/game/chaskiAvatar.ts` reúne las hojas, los fotogramas, la altura, la velocidad y la aceleración del Chaski de Plaza. Tanto la Plaza como el Colegio llaman a este dibujo compartido.
- `src/game/colegioPatio.ts` define colisiones separadas para fachada, escaleras, árbol, jardines, cuatro bancas, busto, tablero, farol, pedestal, reciclaje y asta. La cancha y el pavimento permanecen transitables. La física usa subpasos y resolución por eje, como la Plaza.
- `src/components/game/ColegioPatio.tsx` dibuja el fondo a proporción original, mueve a Chaski mediante WASD/flechas y vuelve a dibujar pequeños recortes de objetos solo cuando Chaski camina detrás de ellos. Los recortes se enmascaran por color y se limitan al área del personaje para evitar parches en el resto del mapa.
- `src/components/game/Adventure.tsx` carga el patio al abordar desde Plaza y mantiene la bitácora guardada. Para revisar esta fase en desarrollo se puede abrir `/aventura?vista=colegio`; este acceso directo está limitado a `NODE_ENV=development`.

## Alcance de esta fase

Las puertas, el corredor visible, el segundo piso, las escaleras y la cancha forman parte del arte. La física mantiene bloqueadas las zonas aún no navegables. Las escaleras y los interiores se convertirán en rutas transitables en la Fase 2. No se han añadido NPC, actividades ni progreso escolar; el 0 % del panel indica que el capítulo escolar no ha comenzado sus actividades.

Dos sprites nuevos transparentes (`fachada.png`, `banca.png`) quedaron en `public/game/colegio/` como recursos de desarrollo. No se superponen al fondo aprobado porque duplicarían la arquitectura y las bancas de la imagen elegida por el usuario.

## Riesgo visual pendiente

El fondo recibido es RGB y no contiene capas alfa individuales. Las máscaras actuales permiten profundidad local, pero los bordes finos de follaje y mobiliario pueden necesitar siluetas de alfa revisadas cuando se implementen los interiores y se amplíen las rutas del patio. El arte base y los colliders son datos separados; no se usa la imagen como mapa de colisiones.
