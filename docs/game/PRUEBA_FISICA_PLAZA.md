# Prueba física de la plaza

## Bus y personaje actualizados

- `base/plaza-sin-bus.png`: fondo editado con la estación y la vereda reconstruidas donde estaba el bus.
- `base/bus-pista.png`: nuevo bus transparente independiente sobre la pista, con colisión propia y orden de profundidad.
- `base/chaski-camina.png`: ocho poses laterales y espejo para la izquierda. `base/chaski-frente.png` y `base/chaski-espalda.png`: ocho poses por cada dirección vertical. El motor cambia de hoja según la dirección y mantiene la misma altura y apoyo de pies con los metadatos de fotogramas.
- La fuente usa un polígono que abarca su jardín y estanque. Se calcula también la distancia a cada arista para incluir el radio de los pies del jugador.
- Las oclusiones del atlas se dibujan completamente opacas: detrás de la estación el personaje queda oculto. La fuente usa una máscara poligonal para no cubrir el pavimento exterior. Estas máscaras siguen siendo aproximaciones de la silueta, no todos los objetos están extraídos a sprites transparentes.
- El bus tiene un ancho de 650 unidades (antes 490); `BUS_PLACEMENT` comparte posición, tamaño y profundidad entre el dibujo y su sólido.

`plazaOcclusion.ts` filtra el pavimento de las regiones de atlas antes de dibujar las capas delanteras. Los árboles conservan follaje/tronco y las bancas conservan sus materiales saturados; la estación se mantiene opaca. Las capas se calculan una vez al cargar y se reutilizan. El filtrado por color sigue siendo una aproximación: se debe revisar si se cambia la paleta del fondo.

Verificación actual: seis pruebas de física, cuatro pruebas del filtrado de suelo y comprobación de TypeScript del código fuente. Se comprobó en el navegador el giro a la espalda y el recorrido lateral junto a la jardinera inferior.

Paneles Chaski/progreso restaurados y paleta exterior azul pizarra con dorado.

`PlazaPlayable.tsx` ejecuta un bucle Canvas con movimiento, aceleración, frenado, pasos animados y personaje robot generado por geometría pixelada. El origen físico está en los pies. `plazaPhysics.ts` define obstáculos por objeto en coordenadas del atlas aprobado de 1671 × 941. El desplazamiento se subdivide para impedir atravesar obstáculos entre fotogramas. Se puede caminar con WASD/flechas y controles táctiles, mostrar colisiones y reubicar el personaje.

Limitación: el arte está todavía consolidado en el PNG aprobado. Algunas entidades tienen regiones de atlas para oclusión; las máscaras son aproximadas. No es una extracción terminada de sprites transparentes independientes. Las colisiones son geometría explícita y comprobable, no detección automática de píxeles. Deben afinarse visualmente antes de considerar terminada la reconstrucción.

Verificación: cuatro pruebas de sólidos, límite, fuente y recorrido inferior; TypeScript del código fuente sin errores.
