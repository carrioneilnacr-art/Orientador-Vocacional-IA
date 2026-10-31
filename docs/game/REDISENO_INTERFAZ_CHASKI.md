# Interfaz de Chaski Adventure — estado de trabajo

## Objetivo

Integrar la Plaza de Lima jugable en una interfaz de orientación vocacional clara, responsiva y visualmente ligada al personaje Chaski. La referencia enviada por el usuario guía la composición; no se usa como fondo ni como asset del producto.

## Implementado

- Cabecera con identidad Chaski y enlaces reales a Aventura y Universidades. Se retiraron temporalmente «Explorar carreras» y «Mi perfil» mientras el estudiante explora.
- En escritorio, el juego ocupa la columna principal y Chaski IA y el progreso quedan a un costado para reducir el desplazamiento vertical. En pantallas pequeñas, el juego conserva prioridad y los paneles se reorganizan debajo.
- Paleta basada en el vestuario de Chaski: azul tinta `#0b1e2c`, azul tejido `#174466`, pergamino `#f4e9d6` y dorado `#e7b867`. El uso de cian brillante se sustituyó en la carcasa de la interfaz por acentos cálidos.
- Las decisiones cromáticas y de distribución se contrastaron con las guías locales `ui-ux-pro-max` y `design-system` del repositorio. La búsqueda de paletas de juegos devolvió opciones rosa y verde poco afines al personaje; se tomaron las reglas de consistencia, contraste y tokens y se eligieron colores del Chaski existente.
- La barra de progreso deriva de encuentros NPC versionados y misiones completadas (10 actividades en total). Las letras RIASEC son identificadores con etiquetas, no exponen puntajes ni aparentan un diagnóstico.
- HUD con ubicación, controles, bitácora y pantalla completa. La tecla B abre la bitácora. El minimapa, el movimiento, las colisiones, los diálogos y el guardado local siguen en los componentes del juego.
- El minimapa ahora se pliega y muestra un plano con caminos, fuente, jardines, paradero y posiciones de NPC al abrirlo. Chaski y el progreso ocupan tarjetas con azul tejido más vivo y dorado; el acceso del progreso abre la bitácora.
- Bus amarillo como sprite transparente independiente de la plataforma SVG, con hitbox propia y zona de abordaje. Luis se reutiliza como recorte transparente. Los NPC se distribuyeron más a lo ancho y se ajustaron sombras y hitboxes de objetos visibles.

## Arquitectura y archivos

- `src/components/game/Adventure.tsx`: navegación, composición y estado del progreso.
- `src/components/game/AdventureShell.css`: tema y distribución responsiva de la carcasa. Conviene consolidar las reglas anteriores de `Adventure.module.css` en una siguiente limpieza.
- `src/components/game/PlazaWorld.tsx`: cámara que ajusta el mapa al marco sin deformar coordenadas.
- `src/components/game/PlazaWorld.module.css`: minimapa, indicador y diálogo ligados al marco del juego.
- `public/game/plaza/metropolitano-sprite-v2.png` y `public/game/npcs/tecnico-cutout-v2.png`: recursos transparentes nuevos.

## Pendiente antes de publicar

1. Revisado el encuadre a 1366×768: el documento mide 768 px de alto, sin desplazamiento vertical; juego y barra lateral quedan dentro de la ventana. A 390×844, el documento mide 844 px de alto y no hay desplazamiento horizontal. Pendiente comparar a 1920×1080, tableta y otras alturas móviles; si el texto aumenta, se debe permitir el desplazamiento para conservar legibilidad.
2. Validar interacción real de teclado, clic, minimapa y NPC tras cambios de cámara y pantalla completa. Revisar diálogos largos en móvil. Las 6 pruebas del nivel pasan; la comprobación visual del último cambio aún está pendiente.
3. Consolidar CSS y ajustar contraste y tamaños táctiles tras la revisión visual.
4. Resolver los archivos de tipos generados dañados en `.next/dev/types` antes de usar `npx tsc --noEmit` como puerta de aprobación. ESLint también requiere corregir su configuración circular existente.
5. Revisar el estado de Git y separar cambios previos del juego de este rediseño antes de crear un commit convencional y subir la rama de prueba. No se ha realizado push en esta iteración.
