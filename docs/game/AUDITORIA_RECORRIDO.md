# Inspección de navegación: Plaza y colegio

## Cobertura automática

Ejecutar `node scripts/audit-map-routes.cjs`. Usa las funciones reales de movimiento, incluyendo subpasos y radio del personaje. Muestrea cada 5 píxeles; no es una certificación visual.

- Plaza: 28.713 posiciones alcanzables; 30.513 marcadas como libres; 1.800 libres desconectadas. La muestra incluye cielo y zonas superiores del edificio. Debe definirse una superficie caminable explícita.
- Patio: 14.823 posiciones libres, todas alcanzables desde la llegada. Todas las bases registradas en ambos mapas bloquean.
- Resultados completos: `auditoria-rutas.json`.

## Recorrido en navegador

Se condujo Chaski con teclado: borde sur y oeste de fuente, aproximación a fachada, sector de cuadros/caballete, corredor sur y Metropolitano. La transición real al colegio funcionó.

En el colegio se recorrieron borde inferior izquierdo, aproximación al jardín y busto, corredor central, banca posterior derecha, acceso a escalera y subida completa al segundo piso. No se entró en aulas.

Observaciones: el caballete y los cuadros obligan a salir por arriba antes de rodearlos; no fue un bloqueo permanente. Detrás del bus ampliado Chaski queda totalmente oculto, incluyendo estando en la zona de embarque: conviene revisar legibilidad de ese acceso. Las bases comprobadas del patio frenaron el desplazamiento y la escalera llegó al segundo piso.

## Pendiente visual

El recorrido manual realizado no cubre todavía cada lado de cada objeto. No se puede declarar que todas las máscaras estén libres de defectos con las capturas actuales. Falta inspeccionar de forma sistemática el sector superior/derecho de la plaza, cada árbol y los huecos entre objetos; también el pasillo completo del segundo piso. La comprobación de conectividad no sustituye esa revisión.
