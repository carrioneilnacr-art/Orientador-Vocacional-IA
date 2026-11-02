# Patio: colisiones y máscaras revisadas

- Las máscaras geométricas genéricas se sustituyeron por contornos específicos en las coordenadas originales de la imagen. Conservan los colores originales de piedra, luces y madera.
- Bancas: colisión de asiento/patas ampliada y orden visual por apoyo físico. La banca posterior izquierda deja visible a Chaski cuando ya está delante. Los espacios bajo los asientos quedan abiertos.
- Se trazaron farol, pedestal, busto, tablero y sus dos patas, reciclaje, macetas, árbol izquierdo y jardineras. El inspector muestra los contornos reales en violeta y las bases sólidas en verde.
- Se eliminó el clip fraccional alrededor de Chaski: los recortes se restauran en coordenadas enteras del atlas. Cada máscara se almacena solo en su rectángulo mínimo.
- Las colisiones guardadas usan la revisión `patio-contornos-v2`, para no volver a cargar las antiguas por encima de la corrección. Los ajustes anteriores siguen conservados en su clave original.
- Luis, vendedor de la plaza, avanza 32 píxeles en Y (una casilla) para separarse de la jardinera; su colisión e interacción toman automáticamente la nueva posición.

La prueba `colegioOcclusion.test.ts` verifica el hueco bajo la banca, la profundidad delante de ella, el suelo libre junto al farol/tablero y las aproximaciones a los obstáculos. La prueba de rutas existente recorre todo el suelo libre muestreado del patio y comprueba llegada a Elena y la escalera.

`node scripts/inspect-colegio-masks.cjs` genera `colegio-mascaras-verificacion.png`, con seis posiciones de superposición. Detrás de una estatua o jardinera opaca el personaje puede quedar realmente oculto; delante y en los huecos abiertos debe permanecer visible.
