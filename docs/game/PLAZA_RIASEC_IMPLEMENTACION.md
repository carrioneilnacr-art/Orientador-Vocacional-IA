# Plaza de Lima: exploración RIASEC

## Estado implementado

El nivel usa el motor existente de React, SVG, sprites PNG y `requestAnimationFrame`. `PlazaWorld.tsx` concentra el movimiento, la cámara y las interacciones de la Plaza; los escenarios anteriores conservan `AdventureWorld.tsx`.

- Suelo, galería, catedral, fuente, jardines, palmeras, bancas, faroles, puesto, mirador y rejas son objetos independientes. No se carga ninguna referencia como fondo.
- `PlazaScene.tsx` declara objetos sólidos y piezas dibujadas con profundidad. El orden del jugador y de los NPC depende de la posición vertical de sus pies.
- Los NPC tienen un rectángulo sólido independiente y una zona de conversación de 78 unidades. Fuera de esa zona, pulsar un NPC acerca a Chaski; hablar requiere estar cerca.
- Teclado: WASD/flechas para caminar, E para hablar, Escape para cerrar. En diálogo: E/espacio/Enter termina la escritura; arriba/abajo y Enter eligen una respuesta. También se puede usar el ratón o tocar.
- Escritura a 30 ms por carácter, retrato, tres preferencias y una reacción específica. La animación se reduce con el ajuste existente.
- Luis (R), Nayra (I), Luna (A), Valeria (S), Mateo (E) y Don Julián (C) registran una nota narrativa y la elección versionada.
- Los puntos se calculan con `getPlazaRiasec` a partir de las elecciones guardadas. No se muestran, no se mezclan con el cuestionario oficial y volver a responder sustituye la elección anterior.
- Los guardados antiguos conservan sus preferencias como notas históricas, sin asignarles retrospectivamente los nuevos pesos. Es necesario conversar de nuevo para completar estos encuentros.
- Al completar los seis encuentros, la puerta del Metropolitano amarillo desbloquea el viaje al Colegio Horizonte existente, con transición breve.

## Arte

La revisión de composición usa `plazaProjection.ts`: conserva las coordenadas de colisión y comprime visualmente el suelo para dar más presencia a la arquitectura. La conversión inversa mantiene correctos los destinos al tocar el mapa. En escritorio la cámara encuadra el mapa completo; en móvil conserva la altura y acompaña horizontalmente a Chaski. El Metropolitano se muestra parcialmente fuera del borde derecho, con la puerta accesible desde la plaza.

Los recursos están en `public/game/plaza` y `public/game/npcs`. Son elementos individuales originales generados con la herramienta integrada de imágenes, con fondo transparente, optimizados y ensamblados en el motor. El protagonista mantiene `chaski-2d.png` y `chaski-walk-right-user.png`. El reposo de NPC usa una animación sutil del sprite; no son atlas de animación de cuerpo completo.

## Verificación

Vitest comprueba persistencia, migración, pesos exactos de Nayra, sustitución de elecciones sin duplicar puntos, desbloqueo y un recorrido continuo desde el inicio hasta las seis zonas de interacción y la puerta del bus. Los obstáculos y NPC bloquean el paso. TypeScript se comprueba con `npx tsc --noEmit`.

El acabado y la composición son una adaptación propia, no una reproducción exacta de la referencia. Quedan para una fase posterior sprites de caminata frontal y posterior de Chaski, animaciones dibujadas por fotogramas de los NPC y la ampliación artística de los demás escenarios.
