# Diálogos RPG y corrección de capas — 2026-10-31

Se conservan los cinco encuentros y sus sprites aprobados, el fondo y las posiciones de la plaza.

## Corrección visual

El Canvas ahora compone todas las capas en una superficie de 1671 × 941 y escala el resultado una sola vez. Esto evita diferencias de muestreo entre el fondo y sus regiones de primer plano. Se limitan las máscaras de faroles, bolardos y esquina del paradero para excluir pavimento alrededor de su silueta. Las huellas de colisión siguen separadas del dibujo y el orden sigue la coordenada Y de apoyo.

La plaza todavía utiliza un atlas con máscaras de primer plano; estas máscaras no equivalen a un conjunto completo de sprites transparentes dibujados a mano.

## Conversaciones

- E o botón Hablar abre únicamente el encuentro cercano; Chaski se detiene.
- Retrato del sprite aprobado, panel inferior azul marino y dorado, texto a 30 ms por letra.
- E, Espacio o Enter completan el texto. Flechas arriba/abajo o W/S seleccionan; Enter, clic o toque confirman. Escape cierra.
- Mateo, Ernesto, Valeria, Luis y Camila/Diego tienen tres preferencias, reacciones y notas propias.
- La primera elección se conserva sin acumular puntuación en visitas repetidas. Los pesos RIASEC son configurables y exploratorios; no modifican el cuestionario ni producen un diagnóstico.
- Guardado local separado en `chaski-plaza-rpg-v1`, bitácora y progreso integrados. Las partidas anteriores se conservan.
- Corrección del foco durante el montaje repetido de React en desarrollo; al cerrar vuelve al juego.

## Archivos principales

- src/game/plazaRpgDialogues.ts y su test: narrativa, pesos, lectura validada y guardado idempotente.
- src/components/game/PlazaRpgDialogue.tsx y .module.css: diálogo y retratos.
- src/components/game/Adventure.tsx: persistencia, bitácora y progreso.
- src/components/game/PlazaPlayable.tsx: interacción y composición del mapa.
- src/components/game/PlazaNpcRenderer.ts: indicador completado.
- src/game/plazaOcclusion.ts y su test: máscaras de primer plano.

## Verificación

- `npx vitest run`: 102 pruebas, 13 archivos, correctas.
- `npx tsc --noEmit`: correcto.
- Navegador: apertura por proximidad con E, foco en diálogo, cierre Escape, B abre bitácora con respuesta previa, reapertura de Mateo sin duplicados y navegación W/S en Ernesto.
- Captura: dialogos-rpg-verificacion.png.

Cambios locales; no se ejecutó push a GitHub.

## Cierre de la plaza para escritorio

Se comprobó mediante una búsqueda de caminos sobre la geometría sólida que Chaski puede llegar desde el punto inicial a los cinco encuentros y a la parada. Se añadió un reflejo animado discreto dentro de la fuente, desactivado si el jugador prefiere movimiento reducido. Al acercarse a la puerta del Metropolitano, aparece una indicación breve; tras tres conversaciones permite viajar al Colegio Horizonte existente. Se verificó en navegador el paso desde la plaza al colegio. La prueba con estudiantes reales queda como validación de contenido futura, pues requiere participantes; no se realizó una prueba móvil por indicación del usuario.

Archivos: `src/components/game/PlazaPlayable.tsx`, `PlazaPlayable.module.css`, `Adventure.tsx`, `src/game/plazaRoutes.test.ts`. Verificación: `npx vitest run src/game/plazaRoutes.test.ts src/game/plazaPhysics.test.ts` (7 pruebas) y `npx tsc --noEmit` correctos. Cambios locales, aún sin publicar.
