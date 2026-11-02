# Plaza de Lima — Fase 1: profundidad y colisiones

Se conservaron el fondo, la cámara, las posiciones de los NPC y la composición. Chaski y los NPC se ordenan por la coordenada de sus pies; los recortes del primer plano se ordenan por la base del objeto. Las huellas de árboles, postes, bancas y puesto se redujeron a sus bases físicas. Se añadieron capas de jardinera con recortes limitados; la jardinera junto a Luis queda detrás de él y su huella no invade su punto de apoyo. El árbol grande ahora excluye parte del edificio vecino de su máscara frontal. La fuente conserva su perímetro poligonal.

Verificado: 17 pruebas específicas de física, rutas, máscaras y profundidad; TypeScript del juego correcto. Se inspeccionó la plaza en navegador y los cinco NPC permanecen visibles. Esta fase no cambia la misión, el contador ni la condición existente del Metropolitano. Las fases 2 y 3 quedan pendientes de revisión del usuario.

## Corrección de recortes transparentes

Los recortes del atlas se estaban repintando completos sobre el fondo en cada fotograma. Al incluir píxeles vecinos de pavimento, esto producía manchas y duplicaciones incluso lejos de Chaski. Ahora el fondo estático se dibuja una sola vez y cada recorte se aplica únicamente en la intersección entre el área del personaje y el objeto que debe quedar delante. La misma regla se usa para Chaski y los NPC; las colisiones y la composición del mapa permanecen separadas de estos recortes visuales.

Verificación de esta corrección: 16 pruebas de profundidad, máscaras y física; comprobación de tipos con `tsconfig.game-check.json`; inspección en navegador de la plaza y el cruce de Chaski con un farol.
