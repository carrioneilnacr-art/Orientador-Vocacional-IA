/**
 * questionnaireData.ts
 * Definición central de las 16 interacciones del Orientador Vocacional IA.
 * Dividido en 4 misiones temáticas con Chaski.
 */

export interface QuestionItem {
  id: number;
  code: string;
  missionNumber: number;
  missionTitle: string;
  missionSubtitle: string;
  missionIcon: string;
  interactionType: 'CHOICE' | 'SCENARIO' | 'ROLE' | 'FUTURE';
  questionText: string;
  helperText: string;
  orderNumber: number;
  isActive: boolean;
}

export interface OptionItem {
  id: number;
  questionId: number;
  optionText: string;
  icon?: string;
  scorePayload: Record<string, number>;
}

export interface MissionInfo {
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  startQuestionOrder: number;
  endQuestionOrder: number;
  chaskiIntro: string;
  chaskiCompletedMessage: string;
}

export const MISSIONS_CONFIG: MissionInfo[] = [
  {
    number: 1,
    title: "Misión 01",
    subtitle: "Lo que te atrae",
    icon: "🧭",
    startQuestionOrder: 1,
    endQuestionOrder: 4,
    chaskiIntro: "¡Hola! Soy Chaski. Vamos a descubrir qué cosas te despiertan curiosidad y te mueven de manera natural.",
    chaskiCompletedMessage: "¡Gran comienzo! Has dejado claras tus primeras inclinaciones. Ahora veamos cómo afrontas los retos.",
  },
  {
    number: 2,
    title: "Misión 02",
    subtitle: "Cómo resuelves",
    icon: "🧩",
    startQuestionOrder: 5,
    endQuestionOrder: 8,
    chaskiIntro: "Ahora quiero ver qué haces cuando aparece un problema inesperado y los caminos no están marcados.",
    chaskiCompletedMessage: "¡Excelente capacidad de análisis! Ya conozco tu forma de pensar. Ahora descubramos tu estilo con las personas.",
  },
  {
    number: 3,
    title: "Misión 03",
    subtitle: "Cómo actúas",
    icon: "🤝",
    startQuestionOrder: 9,
    endQuestionOrder: 12,
    chaskiIntro: "Toda gran meta requiere equipo. Quiero saber cuál es tu rol preferido y qué ambiente te potencia.",
    chaskiCompletedMessage: "¡Notable! Tu perfil colaborativo está tomando forma. Entremos al tramo final: tu futuro soñado.",
  },
  {
    number: 4,
    title: "Misión 04",
    subtitle: "Tu futuro",
    icon: "🚀",
    startQuestionOrder: 13,
    endQuestionOrder: 16,
    chaskiIntro: "Última misión. Imagina que puedes elegir cualquier horizonte sin límites. ¿Qué camino te llama más?",
    chaskiCompletedMessage: "¡Misiones completadas! Ya tengo suficientes pistas para mapear tu ADN Vocacional.",
  },
];

export const VERIFIED_16_QUESTIONS: QuestionItem[] = [
  // MISIÓN 01 — Lo que te atrae (1 a 4)
  {
    id: 1,
    code: "Q01_FREE_AFTERNOON",
    missionNumber: 1,
    missionTitle: "Misión 01: Lo que te atrae",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "CHOICE",
    questionText: "Tienes una tarde libre. ¿Qué reto probarías?",
    helperText: "Elige la actividad que harías por pura curiosidad.",
    orderNumber: 1,
    isActive: true,
  },
  {
    id: 2,
    code: "Q02_MYSTERY_BOX",
    missionNumber: 1,
    missionTitle: "Misión 01: Lo que te atrae",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "SCENARIO",
    questionText: "Te entregan una caja misteriosa con piezas y mecanismos. ¿Qué haces primero?",
    helperText: "Sigue tu primer instinto frente a lo desconocido.",
    orderNumber: 2,
    isActive: true,
  },
  {
    id: 3,
    code: "Q03_CURIOSITY_PROJECT",
    missionNumber: 1,
    missionTitle: "Misión 01: Lo que te atrae",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "CHOICE",
    questionText: "¿Cuál de estos proyectos te daría más curiosidad desarrollar?",
    helperText: "Imagina que tienes todas las herramientas para lograrlo.",
    orderNumber: 3,
    isActive: true,
  },
  {
    id: 4,
    code: "Q04_PROUD_ACHIEVEMENT",
    missionNumber: 1,
    missionTitle: "Misión 01: Lo que te atrae",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "CHOICE",
    questionText: "¿Qué logro te haría pensar con orgullo: 'esto fue gracias a mí'?",
    helperText: "Visualiza el impacto que más valoras.",
    orderNumber: 4,
    isActive: true,
  },

  // MISIÓN 02 — Cómo resuelves (5 a 8)
  {
    id: 5,
    code: "Q05_PROJECT_BLOCKED",
    missionNumber: 2,
    missionTitle: "Misión 02: Cómo resuelves",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "SCENARIO",
    questionText: "Tu proyecto se bloquea con un error y nadie sabe por qué. ¿Qué haces?",
    helperText: "No hay camino incorrecto; responde cómo sueles actuar.",
    orderNumber: 5,
    isActive: true,
  },
  {
    id: 6,
    code: "Q06_LEARN_NEW_TOOL",
    missionNumber: 2,
    missionTitle: "Misión 02: Cómo resuelves",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "CHOICE",
    questionText: "Tienes que aprender una herramienta o software nuevo. ¿Cómo prefieres?",
    helperText: "Piensa en cómo aprendes mejor.",
    orderNumber: 6,
    isActive: true,
  },
  {
    id: 7,
    code: "Q07_UNSEEN_CHALLENGE",
    missionNumber: 2,
    missionTitle: "Misión 02: Cómo resuelves",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "SCENARIO",
    questionText: "Aparece un desafío que nunca has visto. ¿Qué te motiva más?",
    helperText: "Lo que te genera chispa mental frente al reto.",
    orderNumber: 7,
    isActive: true,
  },
  {
    id: 8,
    code: "Q08_THREE_PATHS_TIME",
    missionNumber: 2,
    missionTitle: "Misión 02: Cómo resuelves",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "CHOICE",
    questionText: "Tu equipo tiene tres caminos posibles y muy poco tiempo para decidir.",
    helperText: "¿En qué criterio confías más bajo presión?",
    orderNumber: 8,
    isActive: true,
  },

  // MISIÓN 03 — Cómo actúas (9 a 12)
  {
    id: 9,
    code: "Q09_TEAM_ROLE",
    missionNumber: 3,
    missionTitle: "Misión 03: Cómo actúas",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "ROLE",
    questionText: "Tu equipo recibe un proyecto desde cero. ¿Qué rol escogerías?",
    helperText: "El papel donde sientes que aportas con más energía.",
    orderNumber: 9,
    isActive: true,
  },
  {
    id: 10,
    code: "Q10_PEER_DIFFICULTY",
    missionNumber: 3,
    missionTitle: "Misión 03: Cómo actúas",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "SCENARIO",
    questionText: "Una persona de tu equipo está teniendo dificultades para avanzar.",
    helperText: "¿Cómo reaccionas naturalmente frente a esa situación?",
    orderNumber: 10,
    isActive: true,
  },
  {
    id: 11,
    code: "Q11_ENJOY_ENVIRONMENT",
    missionNumber: 3,
    missionTitle: "Misión 03: Cómo actúas",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "CHOICE",
    questionText: "¿Dónde te imaginarías disfrutando más tu jornada en un proyecto?",
    helperText: "El espacio que te inspiraría cada día.",
    orderNumber: 11,
    isActive: true,
  },
  {
    id: 12,
    code: "Q12_DISORGANIZED_IDEA",
    missionNumber: 3,
    missionTitle: "Misión 03: Cómo actúas",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "SCENARIO",
    questionText: "Tu grupo tiene una gran idea, pero nadie la está ordenando.",
    helperText: "El paso que darías para ponerla en marcha.",
    orderNumber: 12,
    isActive: true,
  },

  // MISIÓN 04 — Tu futuro (13 a 16)
  {
    id: 13,
    code: "Q13_ONE_WEEK_IMMERSION",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu futuro",
    missionSubtitle: "Motivaciones y ambientes deseados",
    missionIcon: "🚀",
    interactionType: "FUTURE",
    questionText: "Puedes pasar una semana de inmersión en uno de estos lugares. ¿Cuál eliges?",
    helperText: "La experiencia que no te querrías perder.",
    orderNumber: 13,
    isActive: true,
  },
  {
    id: 14,
    code: "Q14_PROFESSION_FREEDOM",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu futuro",
    missionSubtitle: "Motivaciones y ambientes deseados",
    missionIcon: "🚀",
    interactionType: "FUTURE",
    questionText: "Tu profesión te da libertad total para crear algo propio. ¿Qué crearías?",
    helperText: "Tu legado profesional soñado.",
    orderNumber: 14,
    isActive: true,
  },
  {
    id: 15,
    code: "Q15_GLOBAL_PROBLEM",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu futuro",
    missionSubtitle: "Motivaciones y ambientes deseados",
    missionIcon: "🚀",
    interactionType: "CHOICE",
    questionText: "¿Qué problema te gustaría ayudar a solucionar en el mundo?",
    helperText: "La causa que te inspiraría levantarte cada mañana.",
    orderNumber: 15,
    isActive: true,
  },
  {
    id: 16,
    code: "Q16_FINAL_DESTINY",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu futuro",
    missionSubtitle: "Decisión final de camino",
    missionIcon: "🚀",
    interactionType: "CHOICE",
    questionText: "Decisión final: Chaski te muestra 4 grandes caminos. ¿Hacia dónde te inclinas?",
    helperText: "No lo pienses demasiado. Elige el sendero que más vibre contigo.",
    orderNumber: 16,
    isActive: true,
  },
];

export const VERIFIED_64_OPTIONS: OptionItem[] = [
  // Q01
  { id: 101, questionId: 1, optionText: "Crear una aplicación o herramienta digital que solucione algo.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 102, questionId: 1, optionText: "Diseñar algo que sorprenda visualmente o comunique una idea.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 103, questionId: 1, optionText: "Investigar por qué ocurre un fenómeno intrigante hasta entenderlo.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 104, questionId: 1, optionText: "Crear una idea de negocio o proyecto para emprender.", icon: "🚀", scorePayload: { ENTERPRISING: 3, CONVENTIONAL: 1 } },

  // Q02
  { id: 201, questionId: 2, optionText: "Intentar abrirla y probar cómo funciona su mecanismo.", icon: "🔧", scorePayload: { REALISTIC: 3, TECH: 1 } },
  { id: 202, questionId: 2, optionText: "Buscar pistas y deducir qué contiene antes de abrirla.", icon: "🔍", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 203, questionId: 2, optionText: "Imaginar qué podría ser y construir una historia a su alrededor.", icon: "🎨", scorePayload: { ARTISTIC: 2, INVESTIGATIVE: 2 } },
  { id: 204, questionId: 2, optionText: "Preguntar a los demás y contrastar teorías en grupo.", icon: "🗣️", scorePayload: { SOCIAL: 3, INVESTIGATIVE: 1 } },

  // Q03
  { id: 301, questionId: 3, optionText: "Construir un prototipo funcional físico o electrónico.", icon: "🛠️", scorePayload: { REALISTIC: 3, TECH: 1 } },
  { id: 302, questionId: 3, optionText: "Analizar datos y estadísticas para descubrir un patrón.", icon: "📊", scorePayload: { LOGIC: 3, INVESTIGATIVE: 1 } },
  { id: 303, questionId: 3, optionText: "Crear una campaña publicitaria o experiencia visual memorable.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 304, questionId: 3, optionText: "Organizar una iniciativa para ayudar y orientar a personas.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q04
  { id: 401, questionId: 4, optionText: "Haber creado una solución técnica innovadora y útil.", icon: "💡", scorePayload: { TECH: 2, REALISTIC: 1, LOGIC: 1 } },
  { id: 402, questionId: 4, optionText: "Haber descubierto una respuesta que nadie lograba ver.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 403, questionId: 4, optionText: "Haber creado una obra, diseño o mensaje de gran impacto.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 404, questionId: 4, optionText: "Haber liderado a un equipo para alcanzar una meta ambiciosa.", icon: "👑", scorePayload: { ENTERPRISING: 2, SOCIAL: 2 } },

  // Q05
  { id: 501, questionId: 5, optionText: "Revisar paso a paso y de forma metódica hasta hallar el error.", icon: "🧠", scorePayload: { LOGIC: 3, CONVENTIONAL: 1 } },
  { id: 502, questionId: 5, optionText: "Hacer pruebas prácticas directas hasta dar con lo que funciona.", icon: "🔧", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 503, questionId: 5, optionText: "Investigar si alguien resolvió un problema similar en la literatura.", icon: "🔎", scorePayload: { INVESTIGATIVE: 3, CONVENTIONAL: 1 } },
  { id: 504, questionId: 5, optionText: "Reunir al equipo y buscar una solución compartida.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q06
  { id: 601, questionId: 6, optionText: "Experimentar directamente con sus botones y opciones.", icon: "🛠️", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 602, questionId: 6, optionText: "Entender primero la lógica y fundamentos de cómo fue diseñada.", icon: "🧠", scorePayload: { INVESTIGATIVE: 2, LOGIC: 2 } },
  { id: 603, questionId: 6, optionText: "Buscar una forma creativa de usarla para un diseño o idea.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 604, questionId: 6, optionText: "Pedir consejos a personas que la dominen y aprender juntos.", icon: "🗣️", scorePayload: { SOCIAL: 3, CONVENTIONAL: 1 } },

  // Q07
  { id: 701, questionId: 7, optionText: "Descubrir la lógica y los patrones ocultos detrás del problema.", icon: "🧩", scorePayload: { LOGIC: 3, INVESTIGATIVE: 1 } },
  { id: 702, questionId: 7, optionText: "Construir una solución práctica tangible con tus manos o código.", icon: "🔧", scorePayload: { REALISTIC: 3, TECH: 1 } },
  { id: 703, questionId: 7, optionText: "Encontrar una solución fuera de lo común que nadie haya pensado.", icon: "💡", scorePayload: { ARTISTIC: 2, INVESTIGATIVE: 2 } },
  { id: 704, questionId: 7, optionText: "Conseguir que otras personas se entusiasmen y se sumen al reto.", icon: "🚀", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q08
  { id: 801, questionId: 8, optionText: "Comparar datos objetivos, probabilidades y evaluar riesgos.", icon: "📊", scorePayload: { LOGIC: 2, INVESTIGATIVE: 2 } },
  { id: 802, questionId: 8, optionText: "Elegir la ruta más práctica, segura y de ejecución directa.", icon: "🛠️", scorePayload: { REALISTIC: 3, CONVENTIONAL: 1 } },
  { id: 803, questionId: 8, optionText: "Proponer una alternativa ingeniosa que reformule el problema.", icon: "💡", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 804, questionId: 8, optionText: "Alinear criterios en el equipo, mediar y tomar la decisión final.", icon: "👑", scorePayload: { ENTERPRISING: 2, SOCIAL: 2 } },

  // Q09
  { id: 901, questionId: 9, optionText: "Constructor: diseñar la arquitectura técnica y hacer que opere.", icon: "🔧", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 902, questionId: 9, optionText: "Estratega: analizar los requerimientos y planificar las fases.", icon: "🧠", scorePayload: { LOGIC: 2, CONVENTIONAL: 2 } },
  { id: 903, questionId: 9, optionText: "Creativo: darle una identidad única y una experiencia atractiva.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 904, questionId: 9, optionText: "Líder: organizar las prioridades y motivar al equipo al objetivo.", icon: "👑", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q10
  { id: 1001, questionId: 10, optionText: "Sentarte con ella a escucharla con empatía y brindarle apoyo.", icon: "🤝", scorePayload: { SOCIAL: 3, CONVENTIONAL: 1 } },
  { id: 1002, questionId: 10, optionText: "Explicarle un método ordenado paso a paso para destrabarla.", icon: "🧠", scorePayload: { LOGIC: 2, SOCIAL: 2 } },
  { id: 1003, questionId: 10, optionText: "Sugerirle otra forma creativa de encarar la tarea más fácil.", icon: "💡", scorePayload: { ARTISTIC: 2, SOCIAL: 1, TECH: 1 } },
  { id: 1004, questionId: 10, optionText: "Reorganizar responsabilidades del grupo para cumplir a tiempo.", icon: "👑", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q11
  { id: 1101, questionId: 11, optionText: "Frente a una estación tecnológica creando soluciones y software.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 1102, questionId: 11, optionText: "En un centro de investigación analizando teorías y evidencia.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, CONVENTIONAL: 1 } },
  { id: 1103, questionId: 11, optionText: "En un estudio de diseño o agencia conceptualizando proyectos.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 1104, questionId: 11, optionText: "En reuniones de trabajo coordinando con personas y negociando.", icon: "🗣️", scorePayload: { SOCIAL: 2, ENTERPRISING: 2 } },

  // Q12
  { id: 1201, questionId: 12, optionText: "Crear un cronograma ordenado y estructurar tareas claras.", icon: "📋", scorePayload: { CONVENTIONAL: 3, LOGIC: 1 } },
  { id: 1202, questionId: 12, optionText: "Tomar una parte y construir un prototipo rápido para probar.", icon: "🛠️", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 1203, questionId: 12, optionText: "Diseñar la parte visual o comunicacional para que se entienda.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 1204, questionId: 12, optionText: "Asumir la iniciativa, delegar funciones y comprometer al grupo.", icon: "👑", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q13
  { id: 1301, questionId: 13, optionText: "En una empresa de tecnología o desarrollo de inteligencia artificial.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 1302, questionId: 13, optionText: "En un laboratorio de investigación científica o data science.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 1303, questionId: 13, optionText: "En una agencia de publicidad, branding o producción de contenidos.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 1304, questionId: 13, optionText: "En una organización social o de desarrollo del talento humano.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q14
  { id: 1401, questionId: 14, optionText: "Una herramienta digital o sistema tecnológico que simplifique vidas.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 1402, questionId: 14, optionText: "Un modelo científico o estudio riguroso que revele algo nuevo.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 1403, questionId: 14, optionText: "Una marca, propuesta estética o contenido que emocione e inspire.", icon: "🎨", scorePayload: { ARTISTIC: 3, SOCIAL: 1 } },
  { id: 1404, questionId: 14, optionText: "Una empresa rentable con impacto positivo y expansión de mercado.", icon: "🚀", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q15
  { id: 1501, questionId: 15, optionText: "Problemas complejos de automatización, ciberseguridad y datos.", icon: "⚙️", scorePayload: { TECH: 2, LOGIC: 2 } },
  { id: 1502, questionId: 15, optionText: "Enigmas científicos o fenómenos que aún no se comprenden bien.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 1503, questionId: 15, optionText: "Desafíos de comunicación, cultura e innovación de experiencias.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 1504, questionId: 15, optionText: "Problemas que afectan directamente el bienestar y salud de personas.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q16
  { id: 1601, questionId: 16, optionText: "Crear y construir: diseñar soluciones prácticas y tecnología.", icon: "⚙️", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 1602, questionId: 16, optionText: "Descubrir y comprender: profundizar en el saber y la evidencia.", icon: "🔬", scorePayload: { INVESTIGATIVE: 2, LOGIC: 2 } },
  { id: 1603, questionId: 16, optionText: "Imaginar y expresar: dar vida a ideas originales e inspiradoras.", icon: "🎨", scorePayload: { ARTISTIC: 3, SOCIAL: 1 } },
  { id: 1604, questionId: 16, optionText: "Liderar y transformar: dirigir proyectos, innovar y emprender.", icon: "🚀", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },
];

export interface VerifiedCareer {
  id: number;
  slug: string;
  name: string;
  faculty: string;
  degree: string;
  campuses: string[];
  cost: string;
}

export const VERIFIED_CAREERS: VerifiedCareer[] = [
  {
    id: 1,
    slug: 'ingenieria-de-software',
    name: 'Ingeniería de Software',
    faculty: 'Ingeniería',
    degree: 'Bachiller en Ingeniería de Software',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1980 - PEN 4150',
  },
  {
    id: 2,
    slug: 'ingenieria-de-sistemas-de-informacion',
    name: 'Ingeniería de Sistemas de Información',
    faculty: 'Ingeniería',
    degree: 'Bachiller en Ingeniería de Sistemas de Información',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1980 - PEN 4150',
  },
  {
    id: 3,
    slug: 'ciencias-de-la-computacion',
    name: 'Ciencias de la Computación',
    faculty: 'Ingeniería',
    degree: 'Bachiller en Ciencias de la Computación',
    campuses: ['Monterrico', 'San Isidro'],
    cost: 'PEN 1980 - PEN 4150',
  },
  {
    id: 4,
    slug: 'administracion',
    name: 'Administración',
    faculty: 'Negocios',
    degree: 'Bachiller en Administración',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1850 - PEN 3950',
  },
  {
    id: 5,
    slug: 'administracion-y-marketing',
    name: 'Administración y Marketing',
    faculty: 'Negocios',
    degree: 'Bachiller en Administración y Marketing',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1850 - PEN 3950',
  },
  {
    id: 6,
    slug: 'administracion-y-finanzas',
    name: 'Administración y Finanzas',
    faculty: 'Negocios',
    degree: 'Bachiller en Administración y Finanzas',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel'],
    cost: 'PEN 1850 - PEN 3950',
  },
  {
    id: 7,
    slug: 'psicologia',
    name: 'Psicología',
    faculty: 'Psicología',
    degree: 'Bachiller en Psicología',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1750 - PEN 3800',
  },
  {
    id: 8,
    slug: 'derecho',
    name: 'Derecho',
    faculty: 'Derecho',
    degree: 'Bachiller en Derecho',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1950 - PEN 4100',
  },
  {
    id: 9,
    slug: 'comunicacion-y-publicidad',
    name: 'Comunicación y Publicidad',
    faculty: 'Comunicaciones',
    degree: 'Bachiller en Comunicación y Publicidad',
    campuses: ['Monterrico', 'San Isidro', 'San Miguel', 'Villa'],
    cost: 'PEN 1850 - PEN 3950',
  },
  {
    id: 10,
    slug: 'arquitectura',
    name: 'Arquitectura',
    faculty: 'Arquitectura',
    degree: 'Bachiller en Arquitectura',
    campuses: ['Monterrico', 'San Miguel', 'Villa'],
    cost: 'PEN 2100 - PEN 4350',
  },
];

export interface VerifiedRule {
  careerId: number;
  dimension: string;
  weight: number;
  minScore: number;
  explanationTemplate: string;
}

export const VERIFIED_RULES: VerifiedRule[] = [
  { careerId: 1, dimension: 'TECH', weight: 1.0, minScore: 10, explanationTemplate: 'Tu alta afinidad tecnológica coincide con el diseño y construcción de sistemas de software avanzados en la UPC.' },
  { careerId: 1, dimension: 'LOGIC', weight: 0.85, minScore: 8, explanationTemplate: 'Tu pensamiento analítico y estructurado te permitirá dominar algoritmos complejos y arquitectura de datos.' },
  { careerId: 2, dimension: 'TECH', weight: 0.90, minScore: 8, explanationTemplate: 'Tu interés en tecnología aplicada a procesos te posiciona idealmente para liderar la transformación digital empresarial.' },
  { careerId: 2, dimension: 'ENTERPRISING', weight: 0.80, minScore: 7, explanationTemplate: 'Tu visión de negocio te permitirá alinear los sistemas informáticos con los objetivos estratégicos corporativos.' },
  { careerId: 3, dimension: 'INVESTIGATIVE', weight: 1.00, minScore: 10, explanationTemplate: 'Tu perfil investigador te impulsa a comprender los fundamentos matemáticos y desarrollar algoritmos innovadores de IA.' },
  { careerId: 3, dimension: 'LOGIC', weight: 0.95, minScore: 9, explanationTemplate: 'Tu rigurosidad lógica es esencial para resolver problemas complejos de computación científica.' },
  { careerId: 4, dimension: 'ENTERPRISING', weight: 1.00, minScore: 10, explanationTemplate: 'Tu liderazgo natural y visión estratégica encajan con la dirección de organizaciones competitivas en la UPC.' },
  { careerId: 4, dimension: 'CONVENTIONAL', weight: 0.70, minScore: 6, explanationTemplate: 'Tu capacidad de orden y organización respalda la gestión eficiente de recursos y proyectos.' },
  { careerId: 5, dimension: 'ARTISTIC', weight: 0.90, minScore: 8, explanationTemplate: 'Tu creatividad e imaginación te permitirán diseñar experiencias de marca y campañas de marketing de alto impacto.' },
  { careerId: 5, dimension: 'ENTERPRISING', weight: 0.85, minScore: 8, explanationTemplate: 'Tu visión comercial y estratégica potencia la toma de decisiones en mercados competitivos.' },
  { careerId: 6, dimension: 'LOGIC', weight: 0.95, minScore: 9, explanationTemplate: 'Tu afinidad por el análisis cuantitativo te permitirá destacar en finanzas corporativas y mercados de inversión.' },
  { careerId: 6, dimension: 'ENTERPRISING', weight: 0.85, minScore: 8, explanationTemplate: 'Tu orientación al logro te prepara para liderar decisiones financieras de alto valor empresarial.' },
  { careerId: 7, dimension: 'SOCIAL', weight: 1.00, minScore: 10, explanationTemplate: 'Tu profunda empatía y vocación de ayuda te conectan con la evaluación e intervención en el bienestar humano.' },
  { careerId: 7, dimension: 'INVESTIGATIVE', weight: 0.75, minScore: 7, explanationTemplate: 'Tu curiosidad por el comportamiento complementa tu formación científica en diagnóstico psicológico.' },
  { careerId: 8, dimension: 'INVESTIGATIVE', weight: 0.85, minScore: 8, explanationTemplate: 'Tu capacidad de análisis e investigación fundamenta una sólida argumentación jurídica.' },
  { careerId: 8, dimension: 'ENTERPRISING', weight: 0.80, minScore: 7, explanationTemplate: 'Tu criterio estratégico y negociación te preparan para liderar en derecho corporativo y resolución de disputas.' },
  { careerId: 9, dimension: 'ARTISTIC', weight: 1.00, minScore: 10, explanationTemplate: 'Tu creatividad e imaginación son clave para diseñar campañas publicitarias transmedia y conceptos de marca memorables.' },
  { careerId: 9, dimension: 'ENTERPRISING', weight: 0.80, minScore: 7, explanationTemplate: 'Tu capacidad persuasiva te permite negociar y conectar emocionalmente con audiencias masivas.' },
  { careerId: 10, dimension: 'REALISTIC', weight: 0.95, minScore: 8, explanationTemplate: 'Tu gusto por lo constructivo y espacial es fundamental en el diseño arquitectónico y proyectos habitables.' },
  { careerId: 10, dimension: 'ARTISTIC', weight: 0.90, minScore: 8, explanationTemplate: 'Tu sensibilidad estética y espacial te capacita para crear proyectos sostenibles y con identidad.' },
];

