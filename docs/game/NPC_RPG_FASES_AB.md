# NPC RPG — fases A y B

Implementados Mateo (pintor), Don Ernesto (anciano lector), Valeria (estudiante), Luis (vendedor) y Camila/Diego (pareja de estudiantes). Son cinco entidades independientes. Hay tres sprites nuevos en `public/game/plaza-lima/rpg/`; se reutilizan el anciano y la pareja de `generated/`.

## Archivos

- `src/game/plazaRpgNpcs.ts`: datos, posiciones en coordenadas originales y proximidad; alcance de 105 unidades y elección de un solo vecino más próximo.
- `src/game/plazaRpgCrops.json`: recortes alfa medidos para normalizar escala y apoyo.
- `src/components/game/PlazaNpcRenderer.ts`: sombras, reposo, borde de silueta dorado, burbuja crema y aviso E Hablar con entrada suave.
- `PlazaPlayable.tsx`: integración en el Canvas existente y orden vertical común entre objetos, Chaski y NPC.
- `plazaPhysics.ts`: huellas sólidas independientes de los NPC.
- `Adventure.tsx`: pausa al abrir paneles y preferencia de movimiento reducido.

El fondo, la cámara y las posiciones del escenario no cambian. El aviso E Hablar es la fase visual de proximidad. No abre diálogos todavía: las fases C, D y E quedan pendientes de revisión, tal como pide el documento del usuario. No se cambiaron puntuaciones ni servicios de IA.

Verificado en navegador: acercamiento a Mateo cambia su burbuja al aviso E Hablar y destaca su silueta. Los otros NPC mantienen sus burbujas. Las pruebas cubren proximidad, colisiones, recortes y acceso físico a los cinco grupos.

Actualización: las fases C/D/E se implementaron tras la autorización posterior. Ver NPC_RPG_DIALOGOS_Y_CAPAS.md.
