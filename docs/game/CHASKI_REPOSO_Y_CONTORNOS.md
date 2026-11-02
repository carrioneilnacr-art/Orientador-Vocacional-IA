# Chaski: reposo y contornos limpios

Se añadió `public/game/plaza-lima/base/chaski-reposo-v2.png`: tres poses independientes (frente, perfil derecho y espalda), generadas con la herramienta integrada imagegen a partir de las tres láminas existentes. El perfil izquierdo se refleja en el motor. Las láminas de caminata originales se conservan.

Prompt empleado: crear una lámina transparente con exactamente tres Chaski completos en una fila: frente, perfil derecho y espalda. Conservar identidad, armadura crema, botas y bufanda azules, sombrero con banda estampada y pluma azul, cara negra y ojos ámbar. Reposo con piernas rectas, pies cercanos y paralelos sobre una misma línea, brazos relajados. Pixel art con contornos limpios, sin sombra, partículas, textos ni píxeles sueltos.

`chaskiAvatar.ts` selecciona una pose de reposo independiente al detenerse. Detecta los espacios transparentes entre poses, recorta cada silueta y mantiene la base de los pies. La respiración varía ligeramente la altura sin desplazar los pies. La caminata utiliza una escala constante por orientación y caché de fotogramas.

`chaskiSpritePixels.ts` limpia los fotogramas una sola vez al cargarlos: descarta alpha tenue y grupos minúsculos aislados del recorte, sin desenfoque ni operaciones repetidas por fotograma. Aplica a plaza, patio y aulas mediante el renderizador compartido. No cambia velocidad, colisiones ni coordenadas de apoyo.
