# Plan: Reescritura de preguntas y opciones del Orientador Vocacional IA

**Para:** agente de código (Claude Code / dev) que va a aplicar el cambio en el repo.
**Archivo objetivo:** `src/data/questionnaireData.ts`
**Alcance:** SOLO se modifican los campos `questionText`, `helperText` (array `VERIFIED_16_QUESTIONS`) y `optionText` (array `VERIFIED_64_OPTIONS`).

## ⚠️ Reglas duras — no romper el sistema de puntaje

1. **NO tocar** `id`, `code`, `questionId`, `scorePayload`, `icon`, `interactionType`, `missionNumber`, `orderNumber`, `isActive` en ningún registro.
2. **NO reordenar** las opciones dentro de cada pregunta (el orden 1º-2º-3º-4º de cada `questionId` debe mantenerse tal cual está, porque cada posición mantiene su `scorePayload` original).
3. Solo se reemplaza el string de `questionText`, `helperText` y `optionText`. Todo lo demás queda exactamente igual.
4. Después del cambio, correr `npm run build` (o `tsc --noEmit`) para confirmar que no se rompió tipado, y `npm test` si hay tests en `src/__tests__` que referencien estos textos literalmente (revisar antes de tocar, por si algún test hace `expect(text).toBe(...)`).
5. Hacer el cambio en una rama nueva (`feature/preguntas-teen-friendly`) y no directo en `main`.

## Por qué se cambió (contexto para el agente/dev)

Las preguntas originales usaban escenarios de mundo laboral/corporativo ("tu proyecto empresarial", "arquitectura técnica", "expansión de mercado"), poco relacionables para un estudiante de 5to de secundaria (16-17 años). Se reescribieron con escenarios de vida real de esa edad (trabajos grupales del cole, redes sociales, videojuegos, amigos, familia) manteniendo intacta la categoría RIASEC/técnica que mide cada opción (`scorePayload` sin cambios).

---

## MISIÓN 1 — Lo que te atrae (Q1 a Q4)

### Q1 — `id: 1`, code `Q01_FREE_AFTERNOON`
- **questionText:** `"Tienes una tarde totalmente libre, sin tareas ni planes. ¿Qué termina ganando tu atención?"`
- **helperText:** `"Elige lo que harías por pura curiosidad, sin que nadie te lo pida."`

| id | scorePayload (no tocar) | optionText nuevo |
|---|---|---|
| 101 | TECH:3, LOGIC:1 | `"Armar o programar algo random: una app, un bot, editar un video con efectos nuevos."` |
| 102 | ARTISTIC:3, TECH:1 | `"Dibujar, diseñar algo o crear contenido que se vea increíble para subir a redes."` |
| 103 | INVESTIGATIVE:3, LOGIC:1 | `"Meterte a un hueco de internet investigando algo raro hasta entenderlo del todo."` |
| 104 | ENTERPRISING:3, CONVENTIONAL:1 | `"Pensar cómo convertir una idea tuya en algo que otros usarían o pagarían."` |

### Q2 — `id: 2`, code `Q02_MYSTERY_BOX`
- **questionText:** `"Te regalan una caja sellada que hace un ruido raro y nadie te dice qué hay dentro. ¿Qué haces primero?"`
- **helperText:** `"Sigue tu primer instinto frente a lo desconocido."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 201 | REALISTIC:3, TECH:1 | `"La abres ya y empiezas a ver cómo funciona por dentro."` |
| 202 | INVESTIGATIVE:3, LOGIC:1 | `"La agitas, la pesas, buscas pistas y armas una hipótesis antes de abrirla."` |
| 203 | ARTISTIC:2, INVESTIGATIVE:2 | `"Te imaginas mil historias de qué podría ser antes de siquiera tocarla."` |
| 204 | SOCIAL:3, INVESTIGATIVE:1 | `"Llamas a tus panas para abrirla juntos y armar teorías en grupo."` |

### Q3 — `id: 3`, code `Q03_CURIOSITY_PROJECT`
- **questionText:** `"Si te dieran un mes libre y todos los recursos que necesitas, ¿cuál de estos proyectos armarías?"`
- **helperText:** `"Imagina que tienes todas las herramientas para lograrlo."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 301 | REALISTIC:3, TECH:1 | `"Un robot, un dron o algo físico que realmente funcione."` |
| 302 | LOGIC:3, INVESTIGATIVE:1 | `"Un análisis con datos reales para descubrir un patrón que nadie ha visto."` |
| 303 | ARTISTIC:3, ENTERPRISING:1 | `"Un cortometraje o una cuenta de contenido que se vuelva viral."` |
| 304 | SOCIAL:3, ENTERPRISING:1 | `"Una campaña o colecta para ayudar a alguien o a tu comunidad."` |

### Q4 — `id: 4`, code `Q04_PROUD_ACHIEVEMENT`
- **questionText:** `"Dentro de unos años, ¿qué logro te haría decir 'esto pasó gracias a mí'?"`
- **helperText:** `"Visualiza el impacto que más te gustaría causar."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 401 | TECH:2, REALISTIC:1, LOGIC:1 | `"Haber inventado o arreglado algo que de verdad le sirve a la gente."` |
| 402 | INVESTIGATIVE:3, LOGIC:1 | `"Haber descubierto o entendido algo que a nadie más se le ocurrió."` |
| 403 | ARTISTIC:3, TECH:1 | `"Haber creado algo (una canción, un video, un diseño) que a la gente le llegó de verdad."` |
| 404 | ENTERPRISING:2, SOCIAL:2 | `"Haber armado un equipo y logrado algo grande que solo no hubieras podido."` |

---

## MISIÓN 2 — Cómo resuelves (Q5 a Q8)

### Q5 — `id: 5`, code `Q05_PROJECT_BLOCKED`
- **questionText:** `"Están en pleno trabajo grupal para el cole y de la nada todo se traba: nadie se pone de acuerdo o algo simplemente no funciona. ¿Qué haces tú primero?"`
- **helperText:** `"No hay respuesta incorrecta; responde cómo sueles actuar de verdad."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 501 | LOGIC:3, CONVENTIONAL:1 | `"Revisas todo paso a paso, con calma, hasta encontrar dónde está la falla."` |
| 502 | REALISTIC:2, TECH:2 | `"Empiezas a probar cosas directamente hasta que algo funcione."` |
| 503 | INVESTIGATIVE:3, CONVENTIONAL:1 | `"Buscas en internet si a alguien más le pasó lo mismo y cómo lo resolvió."` |
| 504 | SOCIAL:3, ENTERPRISING:1 | `"Reúnes al grupo y buscan la solución conversando entre todos."` |

### Q6 — `id: 6`, code `Q06_LEARN_NEW_TOOL`
- **questionText:** `"Sale un juego, app o programa nuevo que todos están usando. ¿Cómo prefieres aprender a usarlo?"`
- **helperText:** `"Piensa en cómo aprendes mejor, no en lo que 'deberías' hacer."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 601 | REALISTIC:2, TECH:2 | `"Metiéndote directo, tocando todo hasta entenderlo solo."` |
| 602 | INVESTIGATIVE:2, LOGIC:2 | `"Viendo primero cómo está hecho y por qué funciona así."` |
| 603 | ARTISTIC:3, TECH:1 | `"Buscando una forma creativa y distinta de usarlo que nadie más pensó."` |
| 604 | SOCIAL:3, CONVENTIONAL:1 | `"Pidiéndole a alguien que ya sabe que te enseñe y aprendiendo juntos."` |

### Q7 — `id: 7`, code `Q07_UNSEEN_CHALLENGE`
- **questionText:** `"De la nada te retan a hacer algo que nunca has intentado. ¿Qué parte del reto te engancha más?"`
- **helperText:** `"Lo que realmente te prende la mente frente al reto."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 701 | LOGIC:3, INVESTIGATIVE:1 | `"Descubrir la lógica escondida detrás: entender por qué funciona así."` |
| 702 | REALISTIC:3, TECH:1 | `"Armar algo concreto con tus manos (o con código) que sí funcione."` |
| 703 | ARTISTIC:2, INVESTIGATIVE:2 | `"Encontrar una solución rara que a nadie más se le hubiera ocurrido."` |
| 704 | ENTERPRISING:3, SOCIAL:1 | `"Lograr que otros se sumen y se emocionen contigo por el reto."` |

### Q8 — `id: 8`, code `Q08_THREE_PATHS_TIME`
- **questionText:** `"Están planeando algo con amigos (un viaje, un evento, un video) y hay 3 formas de hacerlo, pero queda poco tiempo para decidir."`
- **helperText:** `"¿En qué te apoyas más cuando hay que decidir rápido?"`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 801 | LOGIC:2, INVESTIGATIVE:2 | `"Comparas ventajas y desventajas de cada opción con cabeza fría."` |
| 802 | REALISTIC:3, CONVENTIONAL:1 | `"Vas por la opción más práctica y fácil de hacer ya."` |
| 803 | ARTISTIC:3, ENTERPRISING:1 | `"Propones una cuarta idea que mezcla lo mejor de las tres."` |
| 804 | ENTERPRISING:2, SOCIAL:2 | `"Escuchas a todos, buscas que estén de acuerdo y decides por el grupo."` |

---

## MISIÓN 3 — Cómo actúas (Q9 a Q12)

### Q9 — `id: 9`, code `Q09_TEAM_ROLE`
- **questionText:** `"Tu salón va a organizar algo grande desde cero (un evento, una campaña, una presentación). Todavía nadie tiene rol. ¿Cuál agarras tú, sin que te lo pidan?"`
- **helperText:** `"El papel donde sientes que rindes con más energía."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 901 | REALISTIC:2, TECH:2 | `"El que arma y hace que las cosas realmente funcionen."` |
| 902 | LOGIC:2, CONVENTIONAL:2 | `"El que organiza los tiempos, tareas y hace que todo cuadre."` |
| 903 | ARTISTIC:3, TECH:1 | `"El que le da una onda o estilo único que todos van a recordar."` |
| 904 | ENTERPRISING:3, SOCIAL:1 | `"El que lidera, reparte tareas y motiva al equipo."` |

### Q10 — `id: 10`, code `Q10_PEER_DIFFICULTY`
- **questionText:** `"Un compañero de tu grupo se está quedando atrás y no avanza con su parte."`
- **helperText:** `"¿Cómo reaccionas naturalmente en ese momento?"`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1001 | SOCIAL:3, CONVENTIONAL:1 | `"Te sientas con él o ella a escuchar qué pasa y a apoyarlo."` |
| 1002 | LOGIC:2, SOCIAL:2 | `"Le explicas paso a paso una forma más simple de resolverlo."` |
| 1003 | ARTISTIC:2, SOCIAL:1, TECH:1 | `"Le propones una forma distinta y más entretenida de hacerlo."` |
| 1004 | ENTERPRISING:3, SOCIAL:1 | `"Reorganizas las tareas del grupo para que todo salga a tiempo."` |

### Q11 — `id: 11`, code `Q11_ENJOY_ENVIRONMENT`
- **questionText:** `"Si pudieras teletransportarte ahora mismo a un lugar a pasar la tarde haciendo lo que más te gusta, ¿cuál eliges?"`
- **helperText:** `"El espacio que te inspiraría estar cada día."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1101 | TECH:3, LOGIC:1 | `"Un cuarto lleno de pantallas, creando o programando algo."` |
| 1102 | INVESTIGATIVE:3, CONVENTIONAL:1 | `"Un laboratorio o biblioteca, investigando algo a fondo."` |
| 1103 | ARTISTIC:3, TECH:1 | `"Un estudio creativo, diseñando o grabando contenido."` |
| 1104 | SOCIAL:2, ENTERPRISING:2 | `"Una reunión con gente, coordinando y armando planes."` |

### Q12 — `id: 12`, code `Q12_DISORGANIZED_IDEA`
- **questionText:** `"Tu grupo de amigos tiene una idea buenísima para un proyecto o evento, pero está todo desordenado y nadie hace nada."`
- **helperText:** `"El paso que darías tú para que avance."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1201 | CONVENTIONAL:3, LOGIC:1 | `"Armas una lista o cronograma claro de qué hacer y cuándo."` |
| 1202 | REALISTIC:2, TECH:2 | `"Agarras una parte y haces un primer avance para mostrar que se puede."` |
| 1203 | ARTISTIC:3, ENTERPRISING:1 | `"Diseñas cómo se va a ver o comunicar para que todos lo entiendan."` |
| 1204 | ENTERPRISING:3, SOCIAL:1 | `"Tomas la iniciativa, repartes tareas y comprometes al grupo."` |

---

## MISIÓN 4 — Tu futuro (Q13 a Q16)

### Q13 — `id: 13`, code `Q13_ONE_WEEK_IMMERSION`
- **questionText:** `"Un canal de YouTube te ofrece grabar un video siguiendo a alguien durante una semana en su trabajo. ¿A cuál de estos seguirías?"`
- **helperText:** `"La experiencia que no te querrías perder."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1301 | TECH:3, LOGIC:1 | `"Alguien que crea apps, videojuegos o inteligencia artificial."` |
| 1302 | INVESTIGATIVE:3, LOGIC:1 | `"Un científico resolviendo algo que nadie ha logrado entender."` |
| 1303 | ARTISTIC:3, ENTERPRISING:1 | `"Alguien que crea contenido, marcas o campañas para una agencia."` |
| 1304 | SOCIAL:3, ENTERPRISING:1 | `"Alguien que trabaja transformando la vida de otras personas."` |

### Q14 — `id: 14`, code `Q14_PROFESSION_FREEDOM`
- **questionText:** `"Imagina que en el futuro tienes total libertad para crear algo propio, sin límites de plata ni tiempo. ¿Qué armarías?"`
- **helperText:** `"Tu legado soñado, sin filtros."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1401 | TECH:3, LOGIC:1 | `"Una app o sistema que le simplifique la vida a millones de personas."` |
| 1402 | INVESTIGATIVE:3, LOGIC:1 | `"Una investigación o descubrimiento que cambie cómo entendemos algo."` |
| 1403 | ARTISTIC:3, SOCIAL:1 | `"Una marca, canal o proyecto creativo que conecte con la gente."` |
| 1404 | ENTERPRISING:3, SOCIAL:1 | `"Un negocio propio que crezca y genere impacto real."` |

### Q15 — `id: 15`, code `Q15_GLOBAL_PROBLEM`
- **questionText:** `"Si pudieras elegir un problema del mundo para dedicarte a resolverlo, ¿cuál sería?"`
- **helperText:** `"La causa que te haría levantarte con ganas cada mañana."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1501 | TECH:2, LOGIC:2 | `"Problemas de tecnología, seguridad digital o manejo de datos."` |
| 1502 | INVESTIGATIVE:3, LOGIC:1 | `"Misterios científicos que todavía nadie ha logrado explicar."` |
| 1503 | ARTISTIC:3, ENTERPRISING:1 | `"Cómo nos comunicamos, expresamos y vivimos experiencias nuevas."` |
| 1504 | SOCIAL:3, ENTERPRISING:1 | `"Problemas que afectan directamente la salud o el bienestar de la gente."` |

### Q16 — `id: 16`, code `Q16_FINAL_DESTINY`
- **questionText:** `"Última decisión: Chaski te muestra 4 caminos posibles para tu futuro. No lo pienses tanto, elige el que más te llame."`
- **helperText:** `"Elige el sendero que más vibre contigo, sin pensarlo de más."`

| id | scorePayload | optionText nuevo |
|---|---|---|
| 1601 | REALISTIC:2, TECH:2 | `"Crear y construir: diseñar soluciones prácticas y tecnología."` (sin cambio, ya funcionaba bien) |
| 1602 | INVESTIGATIVE:2, LOGIC:2 | `"Descubrir y entender: investigar a fondo y basarte en evidencia."` |
| 1603 | ARTISTIC:3, SOCIAL:1 | `"Imaginar y expresar: crear ideas originales que emocionen a otros."` |
| 1604 | ENTERPRISING:3, SOCIAL:1 | `"Liderar y transformar: armar proyectos, innovar y emprender."` |

---

## Pasos para el agente

1. Crear rama `feature/preguntas-teen-friendly` a partir de `main`.
2. Abrir `src/data/questionnaireData.ts`.
3. Ubicar cada objeto en `VERIFIED_16_QUESTIONS` por su `id` y reemplazar únicamente `questionText` y `helperText` con los valores de este documento.
4. Ubicar cada objeto en `VERIFIED_64_OPTIONS` por su `id` y reemplazar únicamente `optionText` con el valor de este documento. Confirmar que el `scorePayload` de cada fila coincide con la tabla (es una verificación cruzada, no un cambio).
5. Correr `npm run build` (o `tsc --noEmit`) para verificar que no hay errores de tipos.
6. Correr `npm test` (carpeta `src/__tests__`) y revisar si algún test falla por comparar texto literal viejo — si es así, actualizar esos tests al nuevo texto, no revertir el contenido.
7. Levantar el entorno local (`npm run dev`) y hacer un passthrough manual de las 16 preguntas en el navegador para confirmar que se ven bien, que no hay textos cortados en mobile, y que el flujo de Chaski sigue teniendo sentido narrativo pregunta a pregunta.
8. Abrir un PR con el diff, indicando en la descripción que es un cambio de copy/contenido, sin cambios de lógica de scoring (para que el reviewer sepa que no necesita revisar el motor de cálculo).

## Fuera de alcance (no incluido en este cambio)

- Los mensajes de introducción/cierre de cada misión (`chaskiIntro`, `chaskiCompletedMessage` en `MISSIONS_CONFIG`) no se tocaron. Si se quiere, es un cambio de copy aparte, de bajo riesgo, en el mismo archivo.
- No se cambiaron los `icon` de cada opción — siguen representando la misma categoría (💻 tech, 🎨 artístico, 🔬 investigativo, 🤝 social, 🚀/👑 emprendedor, 📋/📊 convencional, 🔧/🛠️ realista), así que siguen siendo visualmente coherentes con el nuevo texto.
- Rediseño visual de la Q16 (propuesta de hacerla más gráfica con 4 imágenes en vez de solo texto) queda como tarea de UI aparte, no de este cambio de contenido.
