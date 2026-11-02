# Recursos del colegio

El patio procede de la imagen entregada por el usuario. Los interiores activos son `laboratorio-hd.png`, `taller-hd.png` y `tecnologia-hd.png`, recreados mediante imagegen en 1672 × 941 píxeles. Los recortes originales se conservan como referencia. Las coordenadas de los obstáculos son datos independientes editables desde «Objetos y colisiones». Los interiores se muestran con la proporción de sus imágenes originales.

La revisión compacta activa usa ahora `laboratorio-compacto.png`, `taller-compacto.png` y `tecnologia-compacto.png`. Se generaron mediante la herramienta integrada imagegen usando cada interior HD como referencia. Se pidió reducir el suelo vacío entre un 25 y un 30 %, acercar la entrada al mobiliario y ampliar los muebles de forma coherente, conservando caminos transitables, iluminación, colores y una zona libre para el NPC. Se pidió excluir personajes, interfaz y textos. Las colisiones y siluetas se volvieron a medir para estas imágenes. Los archivos HD anteriores se conservan como versiones previas.

Los cinco personajes se generaron con la herramienta integrada imagegen y fondo transparente. `npcs.png` conserva la hoja original. `elena.png`, `diego.png`, `lucia.png`, `andres.png` y `sofia.png` contienen los recortes individuales. Chaski conserva sus recursos anteriores.

## Generación de interiores HD

Se usó la herramienta integrada imagegen. El prompt común pidió un escenario original detallado pixel art de un colegio peruano, cámara frontal elevada, muebles a escala, sombras de contacto, suelo transitable amplio y entrada inferior central libre para el personaje independiente. Se pidió formato 16:9 y al menos 1920 × 1080. La herramienta entregó tres PNG de 1672 × 941, que se integran a su tamaño real sin ampliar sus píxeles para aparentar mayor resolución.

Las especificaciones de cada prompt fueron las siguientes.

- Laboratorio. Paredes azul gris, pizarra posterior, armarios con material de química, tabla periódica, esqueleto al fondo a la derecha, ventanas derechas, isla de experimentos en la mitad izquierda y tres taburetes. Suelo libre a la derecha y en el tercio inferior. Posición del NPC reservada en 65 % X, 75 % Y.
- Taller. Paredes cálidas, vigas de madera, ventanas derechas, mural peruano posterior, materiales en estanterías, busto izquierdo, tres caballetes distribuidos por la sala, mesa baja de arte y alfombra plana central. Pasos libres alrededor de todos los muebles. Posición del NPC reservada en 65 % X, 78 % Y.
- Tecnología. Paredes azules, pizarra posterior, mesas con computadoras junto a ambas paredes, sillas recogidas, componentes electrónicos en las estanterías y luz natural. Pasillo central ancho y suelo delantero libre. Posición del NPC reservada en 65 % X, 78 % Y.

Los tres prompts excluyeron personas, Chaski, interfaces, títulos, bordes y collages. Los NPC y el jugador se dibujan de forma independiente sobre el escenario generado.

Prompt de generación empleado

Create a transparent PNG sprite sheet for a detailed Peruvian school pixel art RPG. Five independent full-body standing NPC sprites in ONE horizontal row, equally sized cells, generous clear separation, no overlap, no text, no background. In left-to-right order: Professor Elena adult woman with brown shoulder-length hair glasses cream blouse navy trousers; Diego teenage boy blue science goggles on head white science coat navy trousers; Lucia teenage girl black hair red beret art apron holding paintbrush; Andres teenage boy curly brown hair square glasses white school shirt navy trousers holding electronics; Sofia teenage girl long black hair white school blouse navy skirt with clipboard. Charming detailed crisp pixel art, consistent with blue and gold Chaski robot school RPG. Front-facing 3/4 standing, full feet visible, all same scale. Canvas wide 5:1, true transparent alpha. Individual cells suitable for automated equal-width slicing.
