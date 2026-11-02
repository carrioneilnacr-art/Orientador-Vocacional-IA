# Plaza de Lima: integración de recursos 2D

## Inventario recibido

El paquete original está en `plaza-lima/`. Su `manifest.json` registra arquitectura, suelo, vegetación, mobiliario, seis NPC RIASEC, tres fotogramas de la fuente y cuatro poses para cada dirección de Chaski. Los recursos utilizables se copiaron a `public/game/plaza-lima/` para servirlos desde Next.js. La carpeta `_pendientes` se mantiene solo como referencia y no se sirve en el juego.

## Integración actual

El sistema maestro es el PNG de referencia de **1672 × 941 px**. `plazaLayout.ts` conserva los puntos de apoyo originales en píxeles y calcula `x = x_original / 1672 × 1000` y `y = y_original / 941 × 620`. El ancho y alto de cada sprite usan el mismo factor `1000 / 1672`, por lo que no se estiran para compensar la diferencia entre las relaciones de aspecto. Los elementos se ordenan por la coordenada Y de su base. El mapa mantiene 1000 × 620 unidades para conservar la navegación actual; la cámara lo escala uniformemente y recorta ligeramente cuando el marco no tiene su misma proporción.

| Referencia | Punto de apoyo en el PNG | Uso en el juego |
| --- | ---: | --- |
| Catedral | base y = 356 | Arquitectura del fondo |
| Fuente | base x = 856, y = 626 | Foco central y colisión elíptica |
| Chaski | pies x = 850, y = 752 | Aparición del jugador |
| Estudiantes | pies x = 477, y = 865 | Diálogo RIASEC |
| Estación | base y = 806 | Estructura sólida |
| Puerta del bus | x = 1300, y = 825 | Transición al colegio |

Los demás puntos y las huellas físicas están en la misma tabla de datos del código. Son marcas tomadas del PNG, no datos de un archivo original por capas: permiten corregir una posición concreta sin desacoplar sprite, colisión y minimapa.

- `PlazaArtScene.tsx` compone suelo repetible, cielo, nubes, tres edificios, árboles, palmeras, jardineras, bancas, faroles, puesto, vendedor, fuente, estación y autobús como objetos separados. Cada pieza con profundidad tiene su propia posición y orden vertical.
- `src/game/plazaLayout.ts` reúne las posiciones visuales, las huellas sólidas y la zona de la puerta del bus. Los árboles bloquean por el tronco; la fuente usa una elipse; jardines, bancas, edificios, estación y bus bloquean según su base visible. Así el dibujo y las colisiones se ajustan en el mismo lugar.
- `PlazaWorld.tsx` usa los fotogramas direccionales de Chaski, conserva WASD/flechas, colisiones, cámara, cercanía a NPC, diálogo, bitácora y salida al colegio. Se mantiene desactivado el desplazamiento por clic en el suelo.
- `PlazaDialogue.tsx` usa los retratos de los seis NPC del paquete. Las preguntas, opciones y pesos RIASEC siguen en `src/game/plazaNpcs.ts` sin cambiar sus valores.
- La estación y el autobús son sprites independientes. La nueva composición usa también sprites transparentes propios para la catedral, fuente, bancas, puesto, vendedor, faroles, jardineras con arbusto, pavimento, nubes y parte de la vegetación.
- La fuente conserva el efecto de agua superpuesto; Chaski puede rodearla gracias a su colisión elíptica.

## Límites conocidos del paquete

- Los cuatro fotogramas laterales de Chaski muestran poca variación de perfil; el manifiesto los clasifica como ciclos limitados. Para una caminata lateral plenamente natural hacen falta nuevas poses.
- Los sprites de NPC son poses únicas; el movimiento de reposo se simula con una oscilación suave. Hacen falta fotogramas adicionales para animación corporal real.
- Los NPC son sprites independientes. Su escala es aproximada porque las imágenes de origen tienen distintos márgenes transparentes; la normalización definitiva requiere recortar y redibujar fotogramas de cada uno.
- Algunos recortes incluyen decoración horneada, especialmente la escalinata. Esa parte no puede ocluirse ni colisionar por cada flor de forma independiente sin regenerar el arte.
- El mapa actual usa el tamaño del nivel existente, 1000 × 620 unidades. La ampliación a un mundo mayor requiere más piezas de borde y rutas jugables para evitar repetición visible o espacios vacíos.

## Verificación

La escena se revisó en el localhost a 1672 × 940 y se comparó con la referencia. `npx vitest run` pasó 84 pruebas, incluidas la conversión de coordenadas y la ruta continua a los seis NPC y al bus. El código fuente pasó `npx tsc --noEmit --project tsconfig.game-check.json`. El `npx tsc --noEmit` general sigue afectado por errores de sintaxis en archivos generados bajo `.next/dev/types`.
