# Chaski 2D — procedencia

## Iteración de Plaza, 31 de octubre de 2026

- `plaza/metropolitano-sprite-v2.png`: ImageGen integrado, bus 2D aislado con transparencia. Prompt: «A single isolated pixel-art game prop: Lima city articulated yellow bus, blue-black windows, passenger door, wheels, detailed 2D side view facing right. Transparent background. No text or scenery.»
- `npcs/tecnico-cutout-v2.png`: edición ImageGen de `npcs/tecnico.png`; fondo retirado para usar al mismo técnico como NPC independiente. Prompt: «Remove ONLY the dark door, bus interior, floor and every background pixel. Keep the same single Peruvian transit technician character, identical pose, blue uniform, blue cap, hand gesture, face and proportions. Transparent background.»

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

La caminata activa usa ahora `chaski-walk-right-user.png`, tira de ocho poses aportada por el usuario desde `Downloads/chaski_walk_right.png`. Se conserva el archivo recibido sin edición.

## Escenarios de referencia

La imagen `Pixel Peru_ Chaski’s City Adventure.png`, proporcionada por el usuario, se utiliza solo como referencia de ambientación. La Plaza de Lima se reconstruye con capas SVG independientes en `src/components/game/PlazaScene.tsx`; no se carga la imagen de referencia en el juego. Chaski y el NPC son recursos separados.

## Recursos individuales de la Plaza (30 de octubre de 2026)

Revisión de acabado tras la captura del usuario: `plaza/farol.png`, `banca.png`, `puesto.png`, `metro.png`, `arbol.png` y `mirador.png`. Generados por separado con ImageGen y transparencia real. Prompt común: «Create a standalone transparent game environment sprite. Beautiful detailed 2D hand-painted pixel art for a richly illustrated Lima plaza adventure. Match warm golden afternoon sunlight, dark ink contours, finely shaded textures and realistic stylized proportions. Complete object, no ground plane, no scene background, no text, no interface. ONE separate asset to be layered into a playable map, not a scene or collage.» Sujetos respectivos: farol colonial triple con flores; banca de madera y hierro verde; puesto de artesano con toldo rojo y crema; bus amarillo lateral con ventanas oscuras; árbol frondoso completo; escalinata y terraza colonial con balaustradas y macetas. Archivos optimizados en el proyecto conservando el canal alfa.

Método: herramienta integrada ImageGen; salida transparente, recorte del margen transparente y reducción para uso en el juego. Archivos finales: `plaza/catedral.png`, `plaza/fuente.png`, `plaza/galeria.png`, `plaza/palmera.png`, `plaza/jardin.png`; `npcs/inventor.png`, `npcs/artista.png`, `npcs/vecino.png`, `npcs/guia.png`, `npcs/nayra.png`, `npcs/tecnico.png`. `npcs/estudiantes.png` se conserva como recurso de la etapa anterior.

Prompt común de entorno: «Single independent environment sprite for a layered 2D Lima plaza game. User-provided Plaza de Lima image is a style guide only, not an edit target. Premium richly detailed hand-painted pixel art, crisp pixel clusters, warm daylight. Isolated centered object on truly transparent background. No ground plane, no sky, no people, no text, no collage.» Sujetos por separado: fachada colonial con balcones y arcos, catedral con dos torres, fuente ornamental de dos niveles, palmera, jardinera con flores.

Prompt común de personajes: «Independent single full-body 2D game NPC sprite. Detailed hand-painted pixel art, warm sunlight, readable dark outlines, full feet visible. Centered with transparent background. No scenery, text or interface, no other people. Coherent with a richly detailed colonial Lima plaza adventure game.» Sujetos por separado: vendedor inventor con dispositivo, artista con caballete, vecino mayor con álbum, guía con mapa, Nayra con robot clasificador, técnico del Metropolitano con llave inglesa. Son personajes ficticios de exploración vocacional.

- Archivo: `chaski-walk-v1.png`.
- Referencia: `chaski-2d.png`.
- Adaptación generada con ImageGen el 30 de octubre de 2026.
- Contenido: ciclo horizontal de cuatro frames para caminar hacia la derecha. El juego invierte el sprite para caminar hacia la izquierda y usa la pose original al estar quieto.
