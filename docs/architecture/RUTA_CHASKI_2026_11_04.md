# Ruta vigente de Chaski — 4 de noviembre de2026

## Base entregada y mediciones

GPT exclusivo, clave conservada en configuración privada; cuotas PostgreSQL compartidas y pool configurable; consultas agrupadas, caché pública acotada y guardado inmutable de aventura. Fondos comprimidos sin pérdida y escenarios diferidos. Las últimas mejoras priorizan carreras mencionadas expresamente, evitan repetir URLs oficiales en el contexto y recuperan entradas de caché pendientes que no terminan.

Mediciones locales con compilación de producción, Supabase y GPT reales:40 sesiones/240 solicitudes sin errores;80/480 sin errores. Último ensayo120/720 completó120 guardados y120 respuestas GPT, con p95 de finalización del chat24630ms: soportó esa ráfaga breve pero la espera es alta. No equivale a capacidad máxima, prueba sostenida, FPS ni120 alumnos autenticados. Las sesiones fueron sintéticas anónimas. Informes JSON en esta carpeta conservan también fallos anteriores.

Las reducciones de consultas fueron63,6% para el fixture de contexto y85% para resolver cinco carreras; los nuevos guardados pasan de3 operaciones a1. Fondos20,51% más livianos. La codificación de procedencia del contexto redujo un fixture14643→3788bytes manteniendo hechos/fuentes; no se afirma mejora global de velocidad60–70%.

## Secuencia de producto

1. **Cerrar el piloto escolar.** Probar en producción40 alumnos autenticados, guardado/reanudación, aislamiento entre colegios, cambios de consentimiento y fallos de red. Medir primer texto GPT, respuesta completa, errores, conexiones y costo durante una sesión de clase. Cierre: resultados recuperables, accesos correctos y umbrales de latencia acordados con evidencia; no basta un200.
2. **Integrar Chaski al recorrido.** Hoy el acompañamiento programado del juego y el chat/API son piezas diferentes. Construir acompañamiento contextual por escenario y actividad usando únicamente evidencia autorizada del servidor, memoria de sesión acotada y fuentes oficiales. Cierre: reconoce progreso real, explica preferencias sin inventar aptitudes y responde con enlaces verificables.
3. **Completar la aventura.** Diseñar e implementar Feria de Talentos y siguientes escenarios, con actividades diferenciadas, navegación, accesibilidad y pruebas de recorrido. Cada actividad define qué evidencia aporta y qué no permite concluir. Cierre: recorrido de inicio a cierre, reanudable y utilizable en equipos escolares modestos.
4. **Validar el instrumento antes de prometer precisión.** Revisar contenido con orientación/psicometría, versionar catálogo e instrumento y evaluar scoring con pilotos. Mantener separados preferencias, desempeño en minijuegos, notas y cuestionario. Cierre: documentación de validez y límites; no convertir pesos narrativos en porcentajes de compatibilidad.
5. **Cerrar la experiencia escolar.** Fortalecer vistas de psicología/tutoría según permisos, reportes útiles, seguimiento y recuperación de resultados. Ampliar datos de carreras sólo mediante fuentes registradas y vigentes. Evitar rankings escolares o inferencias individuales no autorizadas.

La siguiente entrega recomendada es un piloto escolar completo de40 alumnos y la integración contextual de Chaski en Plaza/colegio, antes de abrir más escenarios. Autenticación y portal ya existen parcialmente: no tratarlos como módulos enteramente futuros.

## Operación pendiente

Confirmar carga sostenida en Vercel, presupuestos GPT y conexiones totales por todas las instancias; establecer timeout para el rol dedicado de BD y mantenimiento acotado de cuotas expiradas. Reconciliar SQL operativo con migraciones canónicas. Documentar por separado despliegue READY, prueba de humo y prueba de carga: son evidencias distintas.
