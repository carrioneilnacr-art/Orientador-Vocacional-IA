# Propuesta de Evolución: Chaski 2.0 y Rediseño de Preguntas Vocacionales

**Fecha de Propuesta:** 01/10/2026  
**Autor:** Equipo de Desarrollo / Feedback Estudiantil  
**Estado:** Propuesta de Diseño e Innovación  

---

## 1. Problemas Identificados en Encuestas Estudiantiles

1. **Fatiga por Exceso de Texto ("Mucha Info"):**
   * Los estudiantes de 5to de secundaria (16-17 años) navegan rápido en sus teléfonos.
   * Chaski muestra párrafos largos antes de cada misión y al final del test, lo que provoca abandono o lectura superficial.
2. **Preguntas Académicas y Poco Conectadas con la Realidad:**
   * Enunciados de 3 a 4 líneas teóricas resultan aburridos y desconectados de su vida cotidiana.
   * Se requiere pasar de *"¿Qué rol prefieres en un proyecto interdisciplinario?"* a **Dilemas Situacionales Inmediatos**.
3. **Falta de Seguimiento Interactivo de Chaski:**
   * Chaski parece un adorno estático al inicio y al final en vez de un verdadero **copiloto gamificado** que reacciona a cada decisión.

---

## 2. Solución 1: Chaski como Copiloto Reactivo (Micro-Feedback)

En lugar de textos largos, Chaski reacciona en tiempo real a cada selección con una burbuja flotante de 1 línea (máximo 8 a 12 palabras) y una micro-animación:

| Dimensión Favorecida | Micro-Reacción de Chaski (Aparece 1.5s y se desvanece) | Animación / Icono |
| :--- | :--- | :--- |
| **TECH / LÓGICO** | *"¡Ojo analítico! Te van los sistemas y patrones."* | 💻 Salto alegre |
| **INVESTIGADOR** | *"¡Modo detective activado! Buscas la raíz del problema."* | 🔍 Lupa / Mirada curiosa |
| **ARTÍSTICO** | *"¡Creatividad total! Rompes esquemas tradicionales."* | 🎨 Destello de colores |
| **SOCIAL** | *"¡Liderazgo empático! Conectas y ayudas al equipo."* | 🤝 Pulgar arriba |
| **EMPRENDEDOR** | *"¡Visión de negocio! Tomas acción sin dudar."* | 🚀 Despegue enérgico |
| **CONVENCIONAL / REALISTA**| *"¡Organización impecable! Estructura y precisión."* | 📋 Asentimiento con sonrisa |

---

## 3. Solución 2: Brújula Vocacional en Vivo

* En la esquina superior derecha del cuestionario, se añade una **mini-brújula / radar en vivo**.
* Cada vez que el estudiante hace clic en una opción, la aguja de la brújula oscila brevemente hacia la dimensión correspondiente con un efecto de pulso sutil (`better-ui`).
* Esto transforma el cuestionario en un **minijuego de autodescubrimiento** con gratificación visual instantánea.

---

## 4. Solución 3: Los 16 Dilemas Situacionales Gamificados

Transformación de preguntas largas a **decisiones rápidas de la vida real**:

### Misión 1: Tu Chispa Natural (Curiosidad y Decisiones)
* **P1:** *Es sábado y tienes la tarde libre para un proyecto personal. ¿En qué te clavas?*
  * A. Creando un video, ilustración o música que impacte. (Artístico)
  * B. Descifrando por qué falla un código, app o circuito. (Tecnológico / Lógico)
  * C. Organizando una salida grupal o una causa solidaria. (Social)
  * D. Investigando un misterio científico o un caso curioso. (Investigador)
* **P2:** *Te regalan una entrada a una convención internacional. ¿A cuál vas sin pensarlo?*
  * A. Cumbre de inteligencia artificial y nuevas tecnologías. (Tech)
  * B. Festival de diseño, cine y narrativa interactiva. (Artístico)
  * C. Foro de jóvenes líderes sociales y derechos humanos. (Social)
  * D. Hackathon de startups y emprendimientos de impacto. (Emprendedor)

### Misión 2: En la Cancha (Resolución de Problemas)
* **P5:** *Tu equipo se queda sin ideas a 1 hora de entregar el trabajo final del colegio. ¿Qué haces?*
  * A. Tomo el timón, reparto tareas contrarreloj y salvamos la entrega. (Emprendedor)
  * B. Analizo fríamente qué falló y rediseño la propuesta básica. (Lógico / Investigador)
  * C. Armo una presentación visual impecable que conquiste al profesor. (Artístico)
  * D. Calmo los ánimos de todos y busco un punto medio para avanzar. (Social)

---

## 5. Próximos Pasos para Implementar
1. Validar esta estructura de dilemas.
2. Reemplazar `VERIFIED_16_QUESTIONS` y `VERIFIED_64_OPTIONS` en `src/data/questionnaireData.ts` manteniendo exactamente 16 preguntas (4 por misión) y 64 opciones.
3. Actualizar `src/__tests__/vocacional.test.ts` con `npx vitest run`.
