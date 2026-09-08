# CHASKI — Integración visual y animada en el Orientador Vocacional IA

## 1. Objetivo

Integrar la mascota **CHASKI** dentro del sistema de orientación vocacional existente sin rehacer la lógica de la plataforma.

La idea es que CHASKI sea el personaje que representa al sistema y acompañe al estudiante en momentos concretos:

1. Landing / bienvenida.
2. Cuestionario: presencia mínima para no distraer.
3. Procesamiento: aparece mientras se analiza el perfil.
4. Resultados: CHASKI presenta y contextualiza el perfil.
5. Chat final: CHASKI se convierte en el avatar del orientador IA.
6. Cierre: pantalla emocional de “Hoy diste un gran paso”.

La guía visual actual ya plantea una experiencia tecnológica, psicológica y tipo “Wrapped”, con una interfaz limpia y sin emojis estridentes. CHASKI debe reforzar esa identidad, no competir con ella.

---

# 2. Concepto de CHASKI

## Idea central

> **“Antes conectaba caminos y llevaba mensajes.  
> Ahora conecta estudiantes con oportunidades.”**

CHASKI representa la idea de un **mensajero que conecta caminos**.

No debe sentirse como un chatbot genérico. Su función narrativa es:

- escuchar;
- interpretar;
- orientar;
- conectar;
- acompañar.

### Personalidad

CHASKI debería comunicarse como un compañero inteligente:

- cercano;
- curioso;
- claro;
- positivo;
- profesional;
- nunca infantil;
- nunca excesivamente robótico.

Debe evitar frases demasiado artificiales como:

> “He analizado exhaustivamente tus datos.”

Preferir:

> “Hay algo interesante en tus respuestas.”

o:

> “Tu forma de resolver problemas aparece varias veces en tus respuestas.”

---

# 3. Cómo integrarlo al sistema existente

No se recomienda crear una aplicación aparte.

CHASKI debe ser un **componente reutilizable** dentro del frontend actual.

Arquitectura conceptual:

```text
App
│
├── Landing
│   └── ChaskiHero
│
├── Questionnaire
│   └── ChaskiMini
│
├── Analysis
│   └── ChaskiAnalysis
│
├── Results
│   ├── ChaskiResult
│   ├── PersonalityProfile
│   └── CareerMatches
│
├── Chat
│   └── ChaskiChat
│
└── Final
    └── ChaskiClosing
```

La lógica de evaluación debe permanecer separada de la representación visual.

Ejemplo:

```text
RESPUESTAS
    ↓
Motor de evaluación
    ↓
Perfil vocacional
    ↓
Personalidad dominante
    ↓
Carreras compatibles
    ↓
CHASKI adapta su apariencia y mensaje
```

---

# 4. Componente principal

Si el frontend está desarrollado en React, crear:

```text
src/
├── components/
│   └── chaski/
│       ├── Chaski.jsx
│       ├── ChaskiChat.jsx
│       ├── ChaskiResult.jsx
│       ├── ChaskiAnalysis.jsx
│       └── chaski.config.js
│
├── assets/
│   └── chaski/
│       ├── base/
│       ├── analytic/
│       ├── creative/
│       ├── social/
│       └── entrepreneur/
│
└── data/
    └── personalityProfiles.js
```

El componente debería recibir propiedades en lugar de tener información fija.

Ejemplo conceptual:

```jsx
<Chaski
  personality="analitico"
  state="thinking"
  size="large"
/>
```

Otros estados:

```jsx
<Chaski personality="creativo" state="happy" />
<Chaski personality="social" state="listening" />
<Chaski personality="emprendedor" state="motivated" />
```

---

# 5. Personalización por personalidad

La interfaz NO debería cambiar completamente.

Debe mantenerse:

- mismo CHASKI;
- misma estructura corporal;
- mismo rostro;
- mismo símbolo;
- misma identidad de marca.

Lo que cambia:

- color;
- accesorios;
- postura;
- elementos alrededor;
- expresión;
- mensajes;
- énfasis visual.

## Analítico

### Concepto

“Entiende, analiza, resuelve.”

Características:

- azul;
- azul profundo;
- gris frío;
- elementos de datos;
- gráficos;
- tablet o panel de análisis.

### Sensación psicológica

Orden, lógica, precisión y concentración.

---

## Creativo

### Concepto

“Imagina nuevas posibilidades.”

Características:

- violeta;
- lavanda;
- magenta suave;
- elementos de diseño;
- formas abstractas;
- tablet/lienzo.

### Sensación psicológica

Imaginación, originalidad y exploración.

---

## Social

### Concepto

“Conecta, inspira, genera impacto.”

Características:

- coral;
- rosa cálido;
- terracota clara;
- elementos de conversación;
- personas;
- símbolos de conexión.

### Sensación psicológica

Empatía, comunicación y colaboración.

---

## Emprendedor

### Concepto

“Piensa hoy. Construye mañana.”

Características:

- ámbar;
- naranja;
- dorado suave;
- elementos estratégicos;
- objetivos;
- gráficos de crecimiento.

### Sensación psicológica

Iniciativa, liderazgo y acción.

---

## Explorador

### Concepto

“Siempre hay algo nuevo por descubrir.”

Características:

- verde;
- verde oliva;
- arena;
- elementos de mapas;
- rutas;
- brújula.

### Sensación psicológica

Curiosidad, aprendizaje y adaptabilidad.

---

# 6. Chaski durante el cuestionario

No debe ocupar demasiado espacio.

El cuestionario debe seguir siendo el protagonista.

### Desktop

CHASKI puede aparecer:

- pequeño en una esquina;
- junto a una frase;
- ocasionalmente debajo de la pregunta.

Ejemplo:

```text
┌───────────────────────────────────────────────┐
│ Pregunta 8 de 20                         40% │
│                                               │
│ ¿En qué tipo de entorno te sientes cómodo?   │
│                                               │
│ [ Entorno estructurado ]                      │
│ [ Entorno creativo ]                          │
│ [ Entorno dinámico ]                          │
│ [ Trabajar con personas ]                     │
│                                               │
│                              CHASKI           │
│                         “Piensa en situaciones │
│                          donde realmente       │
│                          disfrutas trabajar.” │
└───────────────────────────────────────────────┘
```

### Mobile

CHASKI debe ser todavía más pequeño.

No debe convertirse en un elemento permanente que reduzca el espacio disponible.

---

# 7. Pantalla de análisis

Esta es una de las mejores oportunidades para usar la mascota.

Mientras el sistema procesa:

```text
Analizando tu perfil...

CHASKI

Estoy conectando tus respuestas
con intereses, fortalezas y
posibles caminos profesionales.
```

Animación:

- respiración suave;
- movimiento flotante;
- pequeños movimientos de cabeza;
- elementos alrededor apareciendo;
- barra de progreso.

No usar una animación excesivamente rápida.

La sensación debe ser:

> “El sistema está pensando.”

No:

> “Estoy viendo un videojuego.”

---

# 8. Pantalla de resultados

Aquí CHASKI vuelve a tener protagonismo.

Ejemplo:

```text
TU PERFIL PRINCIPAL ES

ANALÍTICO

“Te motiva entender cómo funcionan
las cosas, resolver problemas y
encontrar soluciones con lógica.”

              CHASKI
          [pose analítica]

Tus principales fortalezas

Pensamiento analítico
Aprendizaje rápido
Resolución de problemas
Enfoque en soluciones
```

CHASKI puede sostener un elemento visual relacionado con el perfil.

---

# 9. Pantalla emocional final

Esta idea debe conservarse.

## Mensaje principal

> **Hoy diste un gran paso.**

Subtexto:

> Tu historia apenas comienza y ya estás construyendo un futuro con más sentido.

CHASKI aparece en una escena amplia, por ejemplo:

- en una montaña;
- mirando un camino;
- sosteniendo una pequeña bandera;
- mirando hacia el horizonte.

Botones:

```text
Descargar mis resultados
Compartir resultado
Explorar más carreras
```

Esta pantalla debe sentirse como el cierre de una experiencia, no como otra página del dashboard.

---

# 10. Chatbot con CHASKI

CHASKI debe convertirse en el avatar del chatbot.

Ejemplo:

```text
┌─────────────────────────────────────┐
│ CHASKI IA                      ×    │
│ Tu guía vocacional                  │
├─────────────────────────────────────┤
│                                     │
│  [CHASKI]                           │
│  Hola, soy Chaski.                  │
│                                     │
│  Ya conozco algunas cosas sobre     │
│  cómo piensas y qué te interesa.   │
│                                     │
│  ¿Qué quieres explorar primero?     │
│                                     │
│ [Por qué me recomiendas esta carrera]│
│ [Campo laboral]                     │
│ [Universidades]                     │
│                                     │
│ Escribe tu pregunta...          →   │
└─────────────────────────────────────┘
```

El chatbot debe usar la información real del resultado del estudiante.

Ejemplo:

```text
Perfil:
Analítico

Fortalezas:
- Lógica
- Resolución
- Aprendizaje rápido

Carreras:
- Ingeniería de Sistemas
- Ciencia de Datos
- Ingeniería Industrial
```

Así CHASKI no es solamente decoración.

---

# 11. ¿Puede CHASKI moverse?

## Sí.

Hay diferentes niveles de animación.

### NIVEL 1 — Animación CSS

La opción más sencilla.

Se puede animar:

- flotación;
- respiración;
- escala;
- aparición;
- pequeños giros.

Por ejemplo:

```css
.chaski {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}
```

Ventaja:

- muy ligero;
- rápido;
- fácil de implementar.

Desventaja:

- el personaje realmente no “actúa”;
- solo se mueve la imagen completa.

---

# 12. NIVEL 2 — Framer Motion

Para React, esta es una opción muy buena para microinteracciones.

Permite hacer:

- entrada del personaje;
- rebote;
- movimiento;
- transición entre estados;
- hover;
- gestos;
- aparición de elementos.

Ejemplo conceptual:

```jsx
<motion.img
  src={chaski}
  animate={{
    y: [0, -8, 0]
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

También puede reaccionar:

```text
Usuario selecciona respuesta
        ↓
CHASKI mira / reacciona
        ↓
Usuario continúa
        ↓
CHASKI cambia de pose
```

---

# 13. NIVEL 3 — Lottie

Si queremos animaciones más elaboradas:

```text
Diseñador / animador
       ↓
Archivo JSON
       ↓
Lottie
       ↓
React
```

Podríamos tener:

```text
chaski_idle.json
chaski_thinking.json
chaski_happy.json
chaski_listening.json
chaski_surprised.json
```

Esto permitiría reutilizar las animaciones en web y móvil.

---

# 14. NIVEL 4 — Rive

Si queremos que CHASKI sea realmente interactivo, Rive es una alternativa muy interesante.

Podría reaccionar a estados:

```text
IDLE
 ↓
QUESTION
 ↓
LISTENING
 ↓
THINKING
 ↓
RESULT
 ↓
HAPPY
```

Incluso:

```text
Mouse → CHASKI mira al cursor
Respuesta seleccionada → CHASKI reacciona
Resultado calculado → CHASKI cambia de expresión
Chat abierto → CHASKI entra en modo conversación
```

Este nivel es el que más se acerca a que CHASKI se sienta como un personaje real.

---

# 15. Importante: la imagen actual de CHASKI

Una imagen generada como PNG/JPG no puede convertirse automáticamente en un personaje 3D completamente animado.

Hay tres caminos:

### Opción A — PNG + animaciones

La más rápida.

```text
Imagen de CHASKI
+
CSS / Framer Motion
=
Mascota animada
```

Ideal para el MVP.

---

### Opción B — Varias poses

Crear varias imágenes:

```text
chaski-normal.png
chaski-pensando.png
chaski-feliz.png
chaski-analizando.png
chaski-saludando.png
```

El frontend cambia entre ellas.

Esto ya genera la sensación de que CHASKI está reaccionando.

---

### Opción C — Modelo preparado para animación

Crear un modelo 3D real de CHASKI y después riggearlo.

Flujo:

```text
Diseño de CHASKI
       ↓
Modelo 3D
       ↓
Rig
       ↓
Animaciones
       ↓
Web
```

Tecnologías posibles:

- Blender;
- Three.js;
- React Three Fiber;
- GLB / GLTF.

Es la opción más potente, pero también la más costosa en tiempo.

---

# 16. Recomendación para este proyecto

No empezaría haciendo un modelo 3D complejo.

Para una primera versión:

```text
CHASKI
   +
PNG/WebP
   +
Framer Motion
   +
5-8 poses
   +
microinteracciones
```

Esto permite que la plataforma se sienta viva sin hacer pesada la aplicación.

Después, si el proyecto crece:

```text
CHASKI V1
PNG + Motion

        ↓

CHASKI V2
Lottie / Rive

        ↓

CHASKI V3
3D interactivo
```

---

# 17. Estados recomendados

Crear un sistema de estados:

```js
const chaskiStates = {
  idle: "normal",
  thinking: "pensando",
  listening: "escuchando",
  happy: "feliz",
  curious: "curioso",
  analyzing: "analizando",
  motivated: "motivado",
  surprised: "sorprendido"
};
```

Y combinarlo con la personalidad:

```js
{
  personality: "analitico",
  state: "thinking"
}
```

o:

```js
{
  personality: "creativo",
  state: "happy"
}
```

---

# 18. Sistema de diseño recomendado

La estructura visual debe seguir siendo consistente con el sistema actual:

## Base

- fondo claro;
- blanco cálido / hueso;
- negro o azul muy oscuro para textos;
- tarjetas limpias;
- bordes suaves;
- fotografías peruanas utilizadas de manera editorial.

## Personalización

No utilizar un único color para toda la plataforma.

El color de personalidad aparece únicamente cuando corresponde.

Ejemplo:

```text
ANALÍTICO
Azules

CREATIVO
Violetas

SOCIAL
Corales / rosas

EMPRENDEDOR
Ámbar / naranja

EXPLORADOR
Verdes
```

El logo y la identidad CHASKI permanecen constantes.

---

# 19. Responsive

La plataforma debe diseñarse desde el inicio para:

```text
Desktop
1440px
1280px
1024px

Tablet
768px

Mobile
390px
375px
360px
```

En mobile:

- CHASKI más pequeño;
- resultados apilados;
- radar convertido en tarjeta;
- chatbot ocupa casi toda la pantalla;
- CTA siempre accesible;
- imágenes optimizadas.

---

# 20. Rendimiento

Como el sistema será utilizado por estudiantes simultáneamente, no cargar todas las imágenes y animaciones al inicio.

Usar:

```text
Landing
 ↓
Carga CHASKI principal

Cuestionario
 ↓
Carga solo estados necesarios

Resultados
 ↓
Carga assets de personalidad

Chat
 ↓
Carga avatar / animación correspondiente
```

Recomendaciones:

- WebP/AVIF para imágenes;
- lazy loading;
- tamaños responsive;
- evitar videos pesados;
- no cargar las cinco personalidades si solo se necesita una;
- comprimir las animaciones.

---

# 21. Experiencia completa

El recorrido ideal sería:

```text
             INICIO
                │
                ▼
         CHASKI SALUDA
                │
                ▼
          CUESTIONARIO
                │
        ┌───────┴───────┐
        │               │
   CHASKI SUTIL      RESPUESTAS
        │               │
        └───────┬───────┘
                ▼
        ANALIZANDO PERFIL
                │
          CHASKI PIENSA
                │
                ▼
        RESULTADO PERSONAL
                │
       ┌────────┴─────────┐
       │                  │
 PERSONALIDAD         CARRERAS
       │                  │
       └────────┬─────────┘
                ▼
          CHASKI EXPLICA
                │
                ▼
            CHAT IA
                │
                ▼
       “HOY DISTE UN GRAN PASO”
```

---

# 22. Resultado que buscamos

La plataforma no debería sentirse como:

> “Un test vocacional con IA.”

Debería sentirse como:

> **“Una experiencia que me ayudó a entender qué puedo hacer con mi futuro.”**

Y CHASKI es el hilo conductor de esa experiencia.

## Frase de marca

> **Antes conectaba caminos y llevaba mensajes.  
> Ahora conecta estudiantes con oportunidades.**

### Cierre

> **Hoy diste un gran paso.**

> Tu historia apenas comienza.

---

# 23. Prioridad de implementación

## Fase 1 — MVP

- CHASKI estático.
- 5 variantes de personalidad.
- Estados básicos.
- Landing.
- Resultado.
- Chatbot.
- Pantalla final.

## Fase 2 — Animación

- Framer Motion.
- flotación;
- entrada;
- reacción;
- estados;
- microinteracciones.

## Fase 3 — Personaje interactivo

- Rive o Lottie.
- expresiones;
- animaciones independientes;
- reacciones a eventos.

## Fase 4 — Experiencia avanzada

- modelo 3D;
- interacción con cursor/touch;
- animaciones complejas;
- CHASKI como personaje completamente interactivo.

---

## Decisión recomendada

**Para el proyecto actual: CHASKI + React + Tailwind + Framer Motion + imágenes WebP/AVIF.**

Esto permite conseguir una experiencia visual muy cercana a los mockups sin introducir una complejidad innecesaria.

Más adelante, si se quiere que CHASKI tenga movimiento corporal real y reacciones avanzadas, migrar las animaciones a **Rive** o crear un modelo 3D.

