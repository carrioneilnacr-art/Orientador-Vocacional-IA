# Chaski 2D — procedencia

- Archivo: `chaski-2d.png`.
- Referencia del proyecto: `public/assets/chaski-hero.png`.
- Adaptación realizada con la herramienta integrada ImageGen el 30 de octubre de 2026.
- Uso: ilustración transparente para la primera aventura. Es una pose única con movimiento de posición; todavía no es un atlas de animación direccional.
- No se incorporaron personajes, sprites ni música de videojuegos comerciales.

## Prompt de producción

Use case: style-transfer. Create ONE game-ready 2D full-body character sprite of the EXACT Chaski robot from the reference image: cream explorer hat with navy Andean geometric band and blue feather, black faceplate with two warm vertical glowing eyes, cream robot body, teal scarf and backpack, dark boots. Preserve character identity. Convert 3D to charming polished hand-drawn 2D adventure game illustration with crisp dark outlines, restrained cel shading, readable small silhouette. Standing three-quarter front view, both feet visible, arms relaxed, no map. Centered single character with generous transparent margins. Genuine transparent background, no scenery, no lettering, no shadow outside feet, no sprite sheet, no extra characters. Intended playable sprite for an original Andean exploration game.

## Paisaje

El paisaje se dibuja con SVG nativo en `AdventureWorld.tsx`: geometría original de montañas, casas, río, puente, caminos y vegetación. No utiliza paquetes de mapas externos.

## Caminata

- Archivo: `chaski-walk-v1.png`.
- Referencia: `chaski-2d.png`.
- Adaptación generada con ImageGen el 30 de octubre de 2026.
- Contenido: ciclo horizontal de cuatro frames para caminar hacia la derecha. El juego invierte el sprite para caminar hacia la izquierda y usa la pose original al estar quieto.
