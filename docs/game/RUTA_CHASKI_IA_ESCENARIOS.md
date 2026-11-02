# Ruta de Chaski IA: de la plaza a la devolución final

## Propósito

Chaski acompaña la exploración y devuelve al estudiante sus propias pistas. Las opciones del juego son preferencias narrativas; el resultado vocacional final debe apoyarse en el cuestionario estructurado y en datos de carreras y universidades verificados por la base de datos. No se deben presentar los puntos ocultos del juego como diagnóstico.

## Escenarios siguientes

1. **Colegio — reconocer lo cotidiano.** Laboratorio, taller de arte, biblioteca y trabajo en equipo. Decisiones sobre actividades que el estudiante disfruta, evita o desea probar. Chaski pregunta por qué eligió cada una.
2. **Feria de talentos — probar sin presión.** Estaciones de ciencia, arte, emprendimiento, tecnología y servicio comunitario. Minimisiones cortas con varios enfoques posibles; se guardan observaciones, no aciertos.
3. **Barrio de Lima — encontrar sentido.** Problemas cercanos de comunidad, memoria, movilidad y ambiente. Chaski ayuda a conectar habilidades con necesidades reales.
4. **Centro comercial y restaurante — mirar el trabajo de cerca.** Diseño, atención, logística, cocina y gestión aparecen como tareas concretas. El estudiante puede conversar con trabajadores y descubrir actividades detrás de cada lugar.
5. **Clínica y ciudad digital — ampliar posibilidades.** Entrevistas y tareas seguras de cuidado, investigación, software y operación. Chaski diferencia interés por una actividad de una decisión de carrera.
6. **Universidad e institutos — investigar opciones.** Solo se muestran programas, requisitos, costos y datos de instituciones existentes en las fuentes oficiales registradas. Cuando falta un dato, se indica su ausencia.
7. **Bitácora final — conversación con Chaski IA.** Chaski resume las preferencias guardadas, invita a revisarlas y compara patrones con el cuestionario estructurado. Se muestran rutas para seguir explorando y fuentes de la información. El estudiante puede corregir o descartar pistas; no recibe una profesión impuesta.

## Secuencia de producto

La Plaza de Lima abre el Colegio por el Metropolitano tras cinco conversaciones. Al completar las tres actividades disponibles del colegio se puede guardar el recorrido en el servidor y abrir `/aventura/resultados`, una devolución exploratoria de estos dos capítulos. No se exige un cuestionario posterior para ver esos descubrimientos. El perfil final del recorrido completo requiere los escenarios restantes y calibrar sus actividades; no se equiparan los pesos narrativos actuales con una medición psicométrica. La arquitectura vigente se describe en `../architecture/ARQUITECTURA_MONOLITO_MODULAR.md`.

## Interfaz revisada

El diálogo RPG usa una banda inferior compacta. Chaski ocupa la columna derecha con mensajes contextuales. Ajustes y reinicio permanecen accesibles desde la bitácora. El inspector del colegio sigue disponible para revisar objetos y colisiones. El guardado local permite reanudar; al finalizar se conserva una copia validada en el servidor, asociable al colegio con consentimiento.

## Regreso entre capítulos — 02/11/2026
En el colegio, el botón Volver a la plaza permite regresar sin borrar conversaciones ni actividades completadas. Para volver al colegio se usa el Metropolitano de la plaza; las cinco conversaciones ya completadas siguen contando. Una partida nueva empieza en Plaza de Lima; si existe guardado se reanuda el capítulo anterior. El regreso no completa ni descarta respuestas guardadas. Las actividades sin terminar no se registran. Este cambio de navegación usa el guardado local existente y no requiere una migración de Supabase. El guardado final conserva su contrato JSON versionado; la sincronización intermedia entre dispositivos sigue pendiente.
