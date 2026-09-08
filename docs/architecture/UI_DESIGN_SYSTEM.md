# Sistema de Diseño UI/UX: Orientador Vocacional IA

Este documento define la identidad visual y los lineamientos de diseño gráfico de toda la plataforma. El enfoque principal es crear un ecosistema digital que atraiga a estudiantes de 5to de secundaria, combinando la seriedad de una evaluación psicológica con la estética moderna de la ingeniería de sistemas.

## 1. Filosofía de Diseño ("Dark Tech & Wrapped")
La identidad visual de la aplicación huye del clásico formato clínico (blanco, plano, aburrido) y adopta una postura inmersiva:
- **Minimalismo Tecnológico**: Reducción de distracciones visuales (cero emojis o emoticones estridentes).
- **Gamificación Sensorial**: Interacciones inspiradas en resúmenes anuales como "Spotify Wrapped" (grandes porcentajes, tarjetas que se elevan).
- **Sobriedad Profesional**: Atrae a un público con orientación STEM (Ciencias, Tecnología, Ingeniería y Matemáticas).

## 2. Paleta de Colores
El sistema utiliza una paleta fuertemente arraigada en los tonos **Slate** (pizarras profundas) y acentos en **Teal** (verde azulado).

### Fondos (Modo Oscuro)
- **Base Principal (`bg-slate-900`)**: Se utiliza como el lienzo principal de la aplicación, dando profundidad y reduciendo la fatiga visual.
- **Tarjetas y Paneles (`bg-slate-800` / `bg-slate-700/50`)**: Para crear jerarquía y elevación en contenedores de información y cuadros de texto.

### Acentos y Tonalidades (Psicología + Ingeniería)
- **Acento Primario (`teal-400` y `teal-500`)**: Representa tecnología, crecimiento y claridad mental. Se usa para las barras de progreso, los gráficos de radar y el porcentaje de Match.
- **Acento Secundario (`emerald-400`)**: Para datos relacionados a finanzas o números duros (ej. Costos y pensiones).

### Tipografía y Textos
- **Títulos (`text-white`)**: Impacto máximo y alto contraste.
- **Cuerpos de texto (`text-slate-300` / `text-slate-400`)**: Para mantener la legibilidad sin cegar al usuario.

## 3. Componentes Visuales Clave

### A. Landing Page (Inicio)
- **Estética**: Limpia, directa y libre de degradados neón excesivos.
- **Llamados a la Acción (CTA)**: Botones sólidos (`bg-teal-600`) que guían al usuario sin agobiarlo.

### B. Flujo del Cuestionario
- **Libre de distracciones**: Una interfaz de una sola columna donde el centro de atención es la pregunta.
- **Feedback Inmediato**: Barras de progreso precisas y opciones seleccionables con bordes definidos. El chatbot está intencionalmente ausente aquí para no romper la concentración.

### C. Experiencia "Wrapped" (Pantalla de Resultados)
- **ADN Vocacional (Radar Chart)**: 
  - Gráfico en red (telaraña) sobre un panel oscuro.
  - El polígono interior tiene una opacidad del 50% en color Teal, creando un efecto de brillo tecnológico.
- **Tarjetas de Carreras ("Top Matches")**:
  - **Tipografía Gigante**: El porcentaje de Match domina la tarjeta visualmente (`text-3xl font-black`).
  - **Caja de Insights**: Las justificaciones ("¿Por qué hace match contigo?") se presentan en bloques de color integrados que simulan terminales de código o citas de la IA.
  - **Pills**: Uso de etiquetas redondeadas (`rounded-full`) para datos rápidos (Sedes, Costo).

### D. Chatbot Flotante (Gemini IA)
- **Comportamiento**: Oculto durante todo el proceso de evaluación; se revela **únicamente en la pantalla final**.
- **Interfaz del Chat**: Mantiene la paleta Teal/Slate, promoviendo respuestas concisas, profesionales y sin emojis, alineándose con el perfil serio de la plataforma.

## 4. Micro-Interacciones
El movimiento es vital para que la app se sienta viva sin ser ruidosa:
- **Elevación y Sombra (`hover:-translate-y-2 hover:shadow-[0_10px_30px_...]`)**: Las tarjetas de carreras se levantan al pasar el mouse, con una sombra que proyecta luz color Teal, incentivando el clic.
- **Transiciones (`duration-300 transition-all`)**: Cambios de color en botones y enlaces que se sienten suaves, dando una percepción "premium" del software.
