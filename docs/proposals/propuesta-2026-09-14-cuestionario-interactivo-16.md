# Orientador Vocacional IA — Plan de Cuestionario Interactivo de 16 Interacciones

**Repositorio:** https://github.com/carrioneilnacr-art/Orientador-Vocacional-IA  
**Objetivo:** transformar el cuestionario actual en una experiencia breve, visual y gamificada, sin cambiar el estilo ni romper la arquitectura existente.

## 1. Decisión de producto

La nueva versión tendrá **16 interacciones**, no 16 preguntas tradicionales.

El estudiante debe sentir que está viviendo una pequeña aventura guiada por Chaski, no llenando un formulario.

**Concepto:** “Descubre tu camino con Chaski”  
**Duración objetivo:** 3–5 minutos.

Flujo:

```text
Landing
  ↓
Chaski te explica la aventura
  ↓
Misión 1 — Lo que te atrae
  ↓
Misión 2 — Cómo resuelves
  ↓
Misión 3 — Cómo actúas
  ↓
Misión 4 — Tu futuro
  ↓
Análisis de Chaski
  ↓
ADN Vocacional
  ↓
Carreras recomendadas
```

## 2. Qué dice la investigación

El **O*NET Interest Profiler** es una herramienta de exploración vocacional basada en el modelo RIASEC de Holland: Realista, Investigador, Artístico, Social, Emprendedor y Convencional. Su versión Mini-IP para móvil utiliza 30 preguntas y su versión corta utiliza 60; por tanto, **16 interacciones no deben presentarse como una prueba psicométrica completa**. Sirven como una primera orientación y exploración.  
Fuente: https://www.onetcenter.org/IP.html

CareerOneStop indica que la orientación profesional puede considerar **intereses, habilidades y valores**, y recomienda usar los resultados para explorar carreras, no como una decisión automática.  
Fuente: https://www.careeronestop.org/ExploreCareers/Assessments/self-assessments.aspx

La APA presenta la evaluación vocacional como un proceso que puede integrar intereses, capacidades y características personales.  
Fuente: https://www.apa.org/pubs/books/career-assessment

La OECD documenta herramientas digitales de orientación que convierten la autoevaluación en una experiencia interactiva y después relacionan los resultados con habilidades, sectores y ocupaciones.  
Fuente: https://www.oecd.org/en/publications/observatory-on-digital-technologies-in-career-guidance-for-youth-odicy_e098122e-en/choices-match-self-assessment-tool_0bb72e2e-en.html

### Conclusión metodológica

No debemos decir:

> “16 preguntas determinan qué carrera debes estudiar.”

Debemos decir:

> “16 decisiones detectan patrones de intereses y preferencias para recomendar carreras que vale la pena explorar.”

---

# 3. Dimensiones del proyecto

Se mantienen las 8 dimensiones que ya utiliza Orientador Vocacional IA:

| Dimensión | Qué busca detectar |
|---|---|
| Realista | Preferencia por actividades prácticas, herramientas, construcción y acción |
| Investigador | Curiosidad, investigación, análisis y descubrimiento |
| Artístico | Creatividad, diseño, expresión y originalidad |
| Social | Ayuda, comunicación, enseñanza y trabajo con personas |
| Emprendedor | Liderazgo, iniciativa, negociación y toma de decisiones |
| Convencional | Organización, estructura, planificación y procesos |
| Tecnológico | Interés por tecnología, sistemas e innovación |
| Lógico | Razonamiento, patrones, análisis y resolución de problemas |

**Importante:** las seis primeras corresponden al núcleo RIASEC. Tecnológico y Lógico deben presentarse como **dimensiones complementarias propias del proyecto**, no como categorías oficiales adicionales de RIASEC.

---

# 4. Diseño general de las 16 interacciones

| Misión | Objetivo | Interacciones |
|---|---|---:|
| 🧭 01. Lo que te atrae | Intereses espontáneos | 4 |
| 🧩 02. Cómo resuelves | Forma de pensar y resolver | 4 |
| 🤝 03. Cómo actúas | Roles y entorno de trabajo | 4 |
| 🚀 04. Tu futuro | Motivaciones y ambientes deseados | 4 |
| **Total** | | **16** |

No usar las 16 como una lista continua de preguntas.

---

# 5. Las 16 interacciones propuestas

## MISIÓN 01 — 🧭 Lo que te atrae

### 01. Tienes una tarde libre. ¿Qué reto probarías?

- 💻 Crear una aplicación o herramienta → `TECH +3`, `LOGIC +1`
- 🎨 Diseñar algo que sorprenda visualmente → `ARTISTIC +3`, `TECH +1`
- 🔬 Investigar por qué ocurre algo → `INVESTIGATIVE +3`, `LOGIC +1`
- 🚀 Crear una idea para vender o emprender → `ENTERPRISING +3`, `CONVENTIONAL +1`

### 02. Te entregan una caja misteriosa. ¿Qué haces primero?

- 🔧 Intentar abrirla y probar cómo funciona → `REALISTIC +3`, `TECH +1`
- 🔍 Buscar pistas para descubrir qué contiene → `INVESTIGATIVE +3`, `LOGIC +1`
- 🎨 Imaginar qué podría ser antes de abrirla → `ARTISTIC +2`, `INVESTIGATIVE +2`
- 🗣️ Preguntar a otros y comparar teorías → `SOCIAL +3`, `INVESTIGATIVE +1`

### 03. ¿Cuál de estos proyectos te daría más curiosidad?

- 🛠️ Construir un prototipo → `REALISTIC +3`, `TECH +1`
- 📊 Analizar datos para descubrir un patrón → `LOGIC +3`, `INVESTIGATIVE +1`
- 🎨 Crear una campaña o experiencia visual → `ARTISTIC +3`, `ENTERPRISING +1`
- 🤝 Organizar una iniciativa para ayudar a personas → `SOCIAL +3`, `ENTERPRISING +1`

### 04. ¿Qué logro te haría pensar “esto fue gracias a mí”?

- 💡 Haber creado una solución útil → `TECH +2`, `REALISTIC +1`, `LOGIC +1`
- 🔬 Haber descubierto algo que nadie veía → `INVESTIGATIVE +3`, `LOGIC +1`
- 🎨 Haber creado algo original → `ARTISTIC +3`, `TECH +1`
- 👑 Haber conseguido que un equipo logre algo grande → `ENTERPRISING +2`, `SOCIAL +2`

---

## MISIÓN 02 — 🧩 Cómo resuelves

### 05. Tu proyecto no funciona y nadie sabe por qué. ¿Qué haces?

- 🧠 Revisar paso a paso dónde está el error → `LOGIC +3`, `CONVENTIONAL +1`
- 🔧 Hacer pruebas hasta encontrar qué lo soluciona → `REALISTIC +2`, `TECH +2`
- 🔎 Investigar si alguien tuvo el mismo problema → `INVESTIGATIVE +3`, `CONVENTIONAL +1`
- 🤝 Reunir al equipo y buscar una solución juntos → `SOCIAL +3`, `ENTERPRISING +1`

### 06. Tienes que aprender una herramienta nueva. ¿Qué prefieres?

- 🛠️ Experimentar directamente → `REALISTIC +2`, `TECH +2`
- 🧠 Entender primero cómo funciona → `INVESTIGATIVE +2`, `LOGIC +2`
- 🎨 Buscar una forma creativa de usarla → `ARTISTIC +3`, `TECH +1`
- 🗣️ Pedir consejos y aprender acompañado → `SOCIAL +3`, `CONVENTIONAL +1`

### 07. Aparece un reto que nunca has visto. ¿Qué te motiva más?

- 🧩 Descubrir la lógica detrás del problema → `LOGIC +3`, `INVESTIGATIVE +1`
- 🔧 Construir una solución con tus propias manos → `REALISTIC +3`, `TECH +1`
- 💡 Encontrar una solución que nadie haya pensado → `ARTISTIC +2`, `INVESTIGATIVE +2`
- 🚀 Conseguir que otras personas se sumen → `ENTERPRISING +3`, `SOCIAL +1`

### 08. Tu equipo tiene tres caminos posibles y poco tiempo.

- 📊 Comparar datos y riesgos → `LOGIC +2`, `INVESTIGATIVE +2`
- 🛠️ Elegir el camino más práctico → `REALISTIC +3`, `CONVENTIONAL +1`
- 💡 Proponer una opción completamente diferente → `ARTISTIC +3`, `ENTERPRISING +1`
- 👑 Coordinar al equipo y tomar una decisión → `ENTERPRISING +2`, `SOCIAL +2`

---

## MISIÓN 03 — 🤝 Cómo actúas

### 09. Tu equipo recibe un proyecto desde cero. ¿Qué papel escogerías?

- 🔧 Constructor: hacer que funcione → `REALISTIC +2`, `TECH +2`
- 🧠 Estratega: entender y planificar → `LOGIC +2`, `CONVENTIONAL +2`
- 🎨 Creativo: darle una idea diferente → `ARTISTIC +3`, `TECH +1`
- 👑 Líder: organizar y mover al equipo → `ENTERPRISING +3`, `SOCIAL +1`

### 10. Una persona de tu equipo está teniendo dificultades.

- 🤝 Sentarte con ella y tratar de ayudar → `SOCIAL +3`, `CONVENTIONAL +1`
- 🧠 Explicarle una forma estructurada de resolverlo → `LOGIC +2`, `SOCIAL +2`
- 💡 Proponer otra manera de hacer las cosas → `ARTISTIC +2`, `SOCIAL +1`, `TECH +1`
- 👑 Organizar al equipo para que avancen → `ENTERPRISING +3`, `SOCIAL +1`

### 11. ¿Dónde te imaginarías disfrutando más un proyecto?

- 💻 Frente a una computadora creando soluciones → `TECH +3`, `LOGIC +1`
- 🔬 En un laboratorio investigando → `INVESTIGATIVE +3`, `CONVENTIONAL +1`
- 🎨 En un estudio creando y diseñando → `ARTISTIC +3`, `TECH +1`
- 🗣️ Con personas, coordinando y tomando decisiones → `SOCIAL +2`, `ENTERPRISING +2`

### 12. Tu grupo tiene una idea, pero nadie la está organizando.

- 📋 Crear una lista y ordenar tareas → `CONVENTIONAL +3`, `LOGIC +1`
- 🛠️ Convertir la idea en un prototipo → `REALISTIC +2`, `TECH +2`
- 🎨 Desarrollar la parte creativa → `ARTISTIC +3`, `ENTERPRISING +1`
- 👑 Tomar iniciativa y repartir responsabilidades → `ENTERPRISING +3`, `SOCIAL +1`

---

## MISIÓN 04 — 🚀 Tu futuro

### 13. Puedes pasar una semana en uno de estos lugares. ¿Cuál eliges?

- 💻 Empresa tecnológica → `TECH +3`, `LOGIC +1`
- 🔬 Laboratorio o centro de investigación → `INVESTIGATIVE +3`, `LOGIC +1`
- 🎨 Agencia o estudio creativo → `ARTISTIC +3`, `ENTERPRISING +1`
- 🤝 Organización donde trabajas directamente con personas → `SOCIAL +3`, `ENTERPRISING +1`

### 14. Tu profesión te da libertad para crear algo. ¿Qué crearías?

- 💻 Una herramienta tecnológica → `TECH +3`, `LOGIC +1`
- 🔬 Un nuevo método o descubrimiento → `INVESTIGATIVE +3`, `LOGIC +1`
- 🎨 Una experiencia, diseño o contenido → `ARTISTIC +3`, `SOCIAL +1`
- 🚀 Un negocio o proyecto que genere impacto → `ENTERPRISING +3`, `SOCIAL +1`

### 15. ¿Qué problema te gustaría ayudar a solucionar?

- ⚙️ Problemas complejos que requieren tecnología → `TECH +2`, `LOGIC +2`
- 🔬 Problemas que todavía nadie entiende bien → `INVESTIGATIVE +3`, `LOGIC +1`
- 🎨 Problemas que necesitan nuevas ideas → `ARTISTIC +3`, `ENTERPRISING +1`
- 🤝 Problemas que afectan directamente a las personas → `SOCIAL +3`, `ENTERPRISING +1`

### 16. Decisión final

Mostrar cuatro caminos grandes. Chaski dice:

> “No lo pienses demasiado. Elige el camino que más te llame.”

- ⚙️ Crear y construir → `REALISTIC +2`, `TECH +2`
- 🔬 Descubrir y comprender → `INVESTIGATIVE +2`, `LOGIC +2`
- 🎨 Imaginar y expresar → `ARTISTIC +3`, `SOCIAL +1`
- 🚀 Liderar y transformar → `ENTERPRISING +3`, `SOCIAL +1`

La última interacción debe sentirse como el cierre de la aventura, no como una pregunta académica.

---

# 6. Por qué estas preguntas

No debemos preguntar directamente “¿qué carrera quieres estudiar?”. Eso favorece las carreras que el estudiante ya conoce.

Las interacciones deben explorar:

```text
intereses
+
forma de resolver
+
rol preferido
+
ambiente de trabajo
+
motivaciones
```

Esto coincide con el enfoque de O*NET y con herramientas digitales de orientación descritas por la OECD. La evidencia y los instrumentos oficiales se centran en actividades e intereses laborales y en el autoconocimiento, que luego se conecta con opciones profesionales.  
Fuentes:
- https://www.onetcenter.org/IP.html
- https://www.careeronestop.org/Toolkit/Careers/interest-assessment-help.aspx
- https://www.oecd.org/en/publications/observatory-on-digital-technologies-in-career-guidance-for-youth-odicy_e098122e-en/choices-match-self-assessment-tool_0bb72e2e-en.html

**Las preguntas propuestas aquí son redacción propia adaptada al producto; no se copian literalmente los ítems propietarios de otras pruebas.**

---

# 7. Reglas de scoring

Cada opción utiliza una dimensión principal y, cuando tenga sentido, una secundaria:

```text
Principal   +3
Secundaria  +1
```

o:

```text
Principal   +2
Secundaria  +2
```

Ejemplo:

```json
{
  "TECH": 3,
  "LOGIC": 1
}
```

El usuario nunca debe ver estos valores.

## Regla importante

No repartir las 16 interacciones como “2 preguntas para cada dimensión”.

Una misma decisión puede medir varias dimensiones. Esto reduce patrones evidentes y hace que la experiencia sea más natural.

---

# 8. Motor de recomendación

No crear un nuevo motor de IA.

Mantener:

```text
Decisiones
   ↓
scorePayload
   ↓
dimensionScores
   ↓
normalización
   ↓
vocational_rules
   ↓
match por carrera
   ↓
Top de carreras
```

El backend actual ya está construido alrededor de `POST /api/vocacional`, `scorePayload` y `vocational_rules`.

### Regla crítica

**Gemini no decide el porcentaje de match.**

La IA debe:

- explicar;
- comparar;
- contextualizar;
- responder preguntas;
- conversar con el estudiante.

La recomendación numérica debe seguir siendo trazable al motor de reglas y a la base de datos.

---

# 9. Mantener la identidad visual

El modo interactivo **no debe convertirse en un videojuego oscuro o gamer**.

Mantener:

- fondo claro actual;
- azul oscuro;
- celeste;
- tarjetas blancas;
- bordes suaves;
- esquinas redondeadas;
- tipografía limpia;
- animaciones suaves;
- Chaski;
- diseño responsive.

Evitar:

- pixel art;
- neón excesivo;
- HUD complejo;
- monedas;
- barras de vida;
- estética de videojuego de acción.

La sensación buscada es:

> **producto digital interactivo + aventura vocacional**

no:

> videojuego tradicional.

---

# 10. UX

## En lugar de:

```text
Pregunta 7 de 16
```

utilizar:

```text
MISIÓN 2
Cómo resuelves

━━━━━━━━━━━━●━━━━
```

## Reglas

1. Una interacción por pantalla.
2. Máximo cuatro opciones.
3. Texto corto.
4. Respuestas visuales.
5. Animación al seleccionar.
6. Navegación anterior/siguiente.
7. Progreso visible pero discreto.
8. Chaski guía entre misiones.
9. No mostrar la dimensión que se está midiendo.

## Mensajes de Chaski

### Inicio

> “Vamos a descubrir qué cosas te mueven.”

### Misión 2

> “Ahora quiero ver qué haces cuando aparece un problema.”

### Misión 3

> “También quiero saber cómo te gusta trabajar con otras personas.”

### Misión 4

> “Última misión. Imagina que puedes explorar cualquier camino.”

### Final

> “Ya tengo suficientes pistas. Veamos qué caminos podrían encajar contigo.”

---

# 11. Arquitectura recomendada

No crear otra aplicación.

Reutilizar:

```text
src/app/cuestionario/page.tsx
src/app/api/vocacional/route.ts
src/db/schema.ts
src/components/chaski/
```

Agregar componentes:

```text
src/components/questionnaire/
├── AdventureIntro.tsx
├── MissionHeader.tsx
├── MissionProgress.tsx
├── InteractiveQuestion.tsx
├── ChoiceCard.tsx
├── ScenarioCard.tsx
├── RoleCard.tsx
└── MissionComplete.tsx
```

La idea es separar la interfaz del flujo sin duplicar la lógica del backend.

---

# 12. Base de datos

El proyecto ya posee:

```text
questionnaire_questions
questionnaire_options
```

y las opciones utilizan `scorePayload`.

Por eso, el primer enfoque debe ser **reutilizar esas tablas**.

Si hace falta diferenciar misiones o tipos de interacción, evaluar agregar:

```text
mission
interactionType
```

mediante una migración de Drizzle.

Tipos sugeridos:

```text
SCENARIO
CHOICE
ROLE
ENVIRONMENT
FINAL_CHOICE
```

No crear nuevas tablas si una columna o metadata existente resuelve correctamente el problema.

---

# 13. Persistencia

Actualmente las respuestas del cuestionario se guardan temporalmente en `localStorage`.

Para la nueva versión:

```text
vocational_answers_v3
```

Esto evita mezclar respuestas de la versión antigua con las 16 nuevas interacciones.

Al reiniciar:

```text
vocational_answers_v3
vocational_results
vocational_profile_context
```

deben limpiarse.

---

# 14. Pantalla de análisis

Ya existe `ChaskiAnalysis.tsx`.

No reemplazarla; evolucionarla.

Propuesta:

```text
             ✦ CHASKI ✦

      Ya tengo tus decisiones.

     Estoy encontrando patrones
           en tu perfil...

      █████████████░░░

        🧭 Intereses
        💡 Preferencias
        ⚡ Patrones
```

Luego:

> “Tu ADN Vocacional está listo.”

y pasar a `/resultados`.

---

# 15. Resultado final

No mostrar solamente:

```text
TECH 87%
LOGIC 82%
SOCIAL 43%
```

Primero mostrar una interpretación amigable:

```text
TU PERFIL

🚀 El Creador de Soluciones

Tu perfil combina curiosidad tecnológica,
pensamiento lógico y gusto por resolver
problemas.

TECH       ██████████ 91%
LOGIC      █████████  84%
REALISTIC  ████████   72%
```

Después:

```text
Tus caminos principales

🥇 Ingeniería de Software — 92%
🥈 Ingeniería de Sistemas — 87%
🥉 Ciencia de Datos — 82%
```

El resultado debe conservar el ADN Vocacional, el radar y las recomendaciones que ya existen.

---

# 16. Reglas de contenido

## No utilizar preguntas moralmente obvias

Evitar:

> “¿Te gusta ayudar a los demás?”

Porque “sí” puede parecer la respuesta correcta.

Preferir:

> “Un integrante del equipo está bloqueado. ¿Qué haces primero?”

## No preguntar solamente gustos

Combinar:

```text
interés
+
resolución
+
comportamiento
+
entorno
+
motivación
```

## No preguntar por carreras demasiado pronto

No:

> “¿Te interesa Ingeniería de Sistemas?”

Primero descubrir patrones y posteriormente conectar esos patrones con carreras.

## No revelar la categoría

No mostrar:

```text
TECH
LOGIC
SOCIAL
```

durante el juego.

---

# 17. Reglas de implementación basadas en el repositorio

### Stack

Mantener:

```text
Next.js
React
TypeScript
Tailwind CSS
PostgreSQL / Supabase
Drizzle ORM
Google Gemini / AI SDK
Framer Motion
Vitest
```

### Backend

No crear otro servidor.

Reutilizar:

```text
/api/vocacional
```

### Scoring

No mover la lógica de puntuación al frontend.

### IA

No usar Gemini como calculadora del match.

### Diseño

No cambiar la identidad visual global.

### Componentes

Evitar concentrar toda la nueva experiencia en `page.tsx`.

### Testing

Después de cada hito verificar:

```bash
npm run test
npm run lint
```

y realizar la comprobación de tipos/compilación del proyecto.

### Git

Usar commits pequeños y descriptivos, por ejemplo:

```text
feat(questionnaire): add 16-interaction adventure
feat(questionnaire): add scenario cards
feat(chaski): add mission guidance
test(vocational): update scoring tests
fix(questionnaire): preserve v3 answers
```

---

# 18. Plan de implementación

## Sprint 1 — Diseño

- definir las 16 interacciones;
- revisar lenguaje;
- validar scoring;
- diseñar wireframes;
- definir mensajes de Chaski.

## Sprint 2 — Datos

- cargar las 16 preguntas;
- cargar respuestas;
- configurar `scorePayload`;
- revisar `vocational_rules`.

## Sprint 3 — Frontend

- misiones;
- tarjetas;
- interacción;
- progreso;
- animaciones;
- navegación;
- persistencia.

## Sprint 4 — Integración

- conectar `/api/vocacional`;
- probar puntuaciones;
- validar recomendaciones;
- integrar Chaski.

## Sprint 5 — Piloto

Probar con estudiantes reales y medir:

- tiempo de finalización;
- abandono;
- preguntas confusas;
- opciones repetitivas;
- carreras obtenidas;
- percepción de diversión;
- percepción de utilidad.

No considerar el cuestionario “definitivo” hasta hacer este piloto.

---

# 19. Criterios para aceptar una interacción

Una interacción entra al sistema únicamente si:

- se entiende en aproximadamente 5 segundos;
- tiene máximo cuatro opciones;
- no tiene una respuesta obviamente correcta;
- no pregunta directamente por una carrera;
- mide al menos una dimensión;
- idealmente aporta a una segunda;
- puede responderse sin experiencia laboral;
- resulta natural para un estudiante;
- puede representarse visualmente;
- no se siente como examen.

---

# 20. Evolución futura

La versión de 16 interacciones debe considerarse el **MVP interactivo**.

Después pueden añadir:

### Fase 2 — Habilidades

Detectar habilidades percibidas o actividades que el estudiante considera que puede aprender y desarrollar.

### Fase 3 — Valores profesionales

Agregar:

- estabilidad;
- independencia;
- impacto social;
- ingresos;
- creatividad;
- liderazgo;
- equilibrio de vida;
- entorno de trabajo.

CareerOneStop dispone de una herramienta separada de Work Values y la OECD documenta sistemas de orientación que trabajan con intereses y valores.  
Fuentes:
- https://www.careeronestop.org/ExploreCareers/Assessments/self-assessments.aspx
- https://www.oecd.org/en/publications/observatory-on-digital-technologies-in-career-guidance-for-youth-odicy_e098122e-en/choices-match-self-assessment-tool_0bb72e2e-en.html

### Fase 4 — Datos académicos

Evolucionar hacia:

```text
Perfil vocacional
+
Intereses
+
Habilidades
+
Notas
+
Universidad
+
Carrera
+
Mercado laboral
```

Así el sistema podría pasar de responder solamente:

> “¿Qué te interesa?”

a responder:

> “¿Qué caminos podrías explorar dadas tus características y contexto?”

---

# 21. Regla final del producto

> **El estudiante no debe sentir que hizo un test; debe sentir que descubrió algo sobre sí mismo.**

La arquitectura ideal es:

```text
16 decisiones entretenidas
          ↓
Perfil de intereses
          ↓
Motor de reglas
          ↓
Base de datos académica
          ↓
Carreras compatibles
          ↓
Chaski explica y acompaña
```

Las recomendaciones deben abrir posibilidades y fomentar exploración; no presentar una carrera como una verdad absoluta.

---

# 22. Módulo de Pruebas y Respuestas al Azar (QA Testing Tool)

Para agilizar el desarrollo continuo, pruebas de regresión y demostraciones rápidas sin necesidad de seleccionar manualmente las 16 preguntas una por una, se incorpora el componente flotante `RandomTestController.tsx`.

### Capacidades del módulo de pruebas:
1. **🎲 Responder actual al azar (`Alt + R`):**
   - Elige automáticamente una opción aleatoria y válida de la pregunta visible en pantalla.
   - Aplica el estado de selección y avanza fluidamente a la siguiente decisión.
2. **⚡ Completar todo al azar (Test Rápido - `Alt + Shift + R`):**
   - Genera en un solo clic un mapa completo de 16 respuestas aleatorias válidas (una para cada interacción de las 4 misiones).
   - Realiza el `POST` hacia `/api/vocacional`, almacena en `vocational_answers_v3` y pasa directamente a la animación de análisis de Chaski y `/resultados` en menos de 2 segundos.
3. **Control flotante discreto:**
   - Ubicado en la esquina inferior derecha con badge de estado, colapsable/expandible para no obstruir el diseño principal Navy & Cyan.
4. **Resiliencia y Fallback Offline:**
   - La arquitectura incluye `src/data/questionnaireData.ts` con las 16 preguntas, 64 opciones, reglas y catálogo verificado de carreras UPC.
   - Si la conexión a Supabase/PostgreSQL no está configurada o se encuentra inactiva localmente, el sistema opera con 100% de funcionalidad sin arrojar errores 500.

---

## Fuentes de investigación

- O*NET Interest Profiler: https://www.onetcenter.org/IP.html
- O*NET Interest Profiler API: https://services.onetcenter.org/reference/mpp/ip
- CareerOneStop — Interest Assessment: https://www.careeronestop.org/Toolkit/Careers/interest-assessment-help.aspx
- CareerOneStop — Self-Assessments: https://www.careeronestop.org/ExploreCareers/Assessments/self-assessments.aspx
- APA — Career Assessment: https://www.apa.org/pubs/books/career-assessment
- OECD — Choices Match: https://www.oecd.org/en/publications/observatory-on-digital-technologies-in-career-guidance-for-youth-odicy_e098122e-en/choices-match-self-assessment-tool_0bb72e2e-en.html
- OECD — Skills Profiling Tool: https://www.oecd.org/en/publications/the-oecd-skills-profiling-tool-a-new-instrument-to-improve-career-decisions_598ff539-en.html
- Repositorio: https://github.com/carrioneilnacr-art/Orientador-Vocacional-IA
