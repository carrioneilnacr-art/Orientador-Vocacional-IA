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
    questionText: "Tienes una tarde totalmente libre, sin tareas ni planes. ¿Qué termina ganando tu atención?",
    helperText: "Elige lo que harías por pura curiosidad, sin que nadie te lo pida.",
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
    questionText: "Te regalan una caja sellada que hace un ruido raro y nadie te dice qué hay dentro. ¿Qué haces primero?",
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
    questionText: "Si te dieran un mes libre y todos los recursos que necesitas, ¿cuál de estos proyectos armarías?",
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
    questionText: "Dentro de unos años, ¿qué logro te haría decir 'esto pasó gracias a mí'?",
    helperText: "Visualiza el impacto que más te gustaría causar.",
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
    questionText: "Están en pleno trabajo grupal para el cole y de la nada todo se traba: nadie se pone de acuerdo o algo simplemente no funciona. ¿Qué haces tú primero?",
    helperText: "No hay respuesta incorrecta; responde cómo sueles actuar de verdad.",
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
    questionText: "Sale un juego, app o programa nuevo que todos están usando. ¿Cómo prefieres aprender a usarlo?",
    helperText: "Piensa en cómo aprendes mejor, no en lo que 'deberías' hacer.",
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
    questionText: "De la nada te retan a hacer algo que nunca has intentado. ¿Qué parte del reto te engancha más?",
    helperText: "Lo que realmente te prende la mente frente al reto.",
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
    questionText: "Están planeando algo con amigos (un viaje, un evento, un video) y hay 3 formas de hacerlo, pero queda poco tiempo para decidir.",
    helperText: "¿En qué te apoyas más cuando hay que decidir rápido?",
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
    questionText: "Tu salón va a organizar algo grande desde cero (un evento, una campaña, una presentación). Todavía nadie tiene rol. ¿Cuál agarras tú, sin que te lo pidan?",
    helperText: "El papel donde sientes que rindes con más energía.",
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
    questionText: "Un compañero de tu grupo se está quedando atrás y no avanza con su parte.",
    helperText: "¿Cómo reaccionas naturalmente en ese momento?",
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
    questionText: "Si pudieras teletransportarte ahora mismo a un lugar a pasar la tarde haciendo lo que más te gusta, ¿cuál eliges?",
    helperText: "El espacio que te inspiraría estar cada día.",
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
    questionText: "Tu grupo de amigos tiene una idea buenísima para un proyecto o evento, pero está todo desordenado y nadie hace nada.",
    helperText: "El paso que darías tú para que avance.",
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
    questionText: "Un canal de YouTube te ofrece grabar un video siguiendo a alguien durante una semana en su trabajo. ¿A cuál de estos seguirías?",
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
    questionText: "Imagina que en el futuro tienes total libertad para crear algo propio, sin límites de plata ni tiempo. ¿Qué armarías?",
    helperText: "Tu legado soñado, sin filtros.",
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
    questionText: "Si pudieras elegir un problema del mundo para dedicarte a resolverlo, ¿cuál sería?",
    helperText: "La causa que te haría levantarte con ganas cada mañana.",
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
    questionText: "Última decisión: Chaski te muestra 4 caminos posibles para tu futuro. No lo pienses tanto, elige el que más te llame.",
    helperText: "Elige el sendero que más vibre contigo, sin pensarlo de más.",
    orderNumber: 16,
    isActive: true,
  },
];

export const VERIFIED_64_OPTIONS: OptionItem[] = [
  // Q01
  { id: 101, questionId: 1, optionText: "Armar o programar algo random: una app, un bot, editar un video con efectos nuevos.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 102, questionId: 1, optionText: "Dibujar, diseñar algo o crear contenido que se vea increíble para subir a redes.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 103, questionId: 1, optionText: "Meterte a un hueco de internet investigando algo raro hasta entenderlo del todo.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 104, questionId: 1, optionText: "Pensar cómo convertir una idea tuya en algo que otros usarían o pagarían.", icon: "🚀", scorePayload: { ENTERPRISING: 3, CONVENTIONAL: 1 } },

  // Q02
  { id: 201, questionId: 2, optionText: "La abres ya y empiezas a ver cómo funciona por dentro.", icon: "🔧", scorePayload: { REALISTIC: 3, TECH: 1 } },
  { id: 202, questionId: 2, optionText: "La agitas, la pesas, buscas pistas y armas una hipótesis antes de abrirla.", icon: "🔍", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 203, questionId: 2, optionText: "Te imaginas mil historias de qué podría ser antes de siquiera tocarla.", icon: "🎨", scorePayload: { ARTISTIC: 2, INVESTIGATIVE: 2 } },
  { id: 204, questionId: 2, optionText: "Llamas a tus panas para abrirla juntos y armar teorías en grupo.", icon: "🗣️", scorePayload: { SOCIAL: 3, INVESTIGATIVE: 1 } },

  // Q03
  { id: 301, questionId: 3, optionText: "Un robot, un dron o algo físico que realmente funcione.", icon: "🛠️", scorePayload: { REALISTIC: 3, TECH: 1 } },
  { id: 302, questionId: 3, optionText: "Un análisis con datos reales para descubrir un patrón que nadie ha visto.", icon: "📊", scorePayload: { LOGIC: 3, INVESTIGATIVE: 1 } },
  { id: 303, questionId: 3, optionText: "Un cortometraje o una cuenta de contenido que se vuelva viral.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 304, questionId: 3, optionText: "Una campaña o colecta para ayudar a alguien o a tu comunidad.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q04
  { id: 401, questionId: 4, optionText: "Haber inventado o arreglado algo que de verdad le sirve a la gente.", icon: "💡", scorePayload: { TECH: 2, REALISTIC: 1, LOGIC: 1 } },
  { id: 402, questionId: 4, optionText: "Haber descubierto o entendido algo que a nadie más se le ocurrió.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 403, questionId: 4, optionText: "Haber creado algo (una canción, un video, un diseño) que a la gente le llegó de verdad.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 404, questionId: 4, optionText: "Haber armado un equipo y logrado algo grande que solo no hubieras podido.", icon: "👑", scorePayload: { ENTERPRISING: 2, SOCIAL: 2 } },

  // Q05
  { id: 501, questionId: 5, optionText: "Revisas todo paso a paso, con calma, hasta encontrar dónde está la falla.", icon: "🧠", scorePayload: { LOGIC: 3, CONVENTIONAL: 1 } },
  { id: 502, questionId: 5, optionText: "Empiezas a probar cosas directamente hasta que algo funcione.", icon: "🔧", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 503, questionId: 5, optionText: "Buscas en internet si a alguien más le pasó lo mismo y cómo lo resolvió.", icon: "🔎", scorePayload: { INVESTIGATIVE: 3, CONVENTIONAL: 1 } },
  { id: 504, questionId: 5, optionText: "Reúnes al grupo y buscan la solución conversando entre todos.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q06
  { id: 601, questionId: 6, optionText: "Metiéndote directo, tocando todo hasta entenderlo solo.", icon: "🛠️", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 602, questionId: 6, optionText: "Viendo primero cómo está hecho y por qué funciona así.", icon: "🧠", scorePayload: { INVESTIGATIVE: 2, LOGIC: 2 } },
  { id: 603, questionId: 6, optionText: "Buscando una forma creativa y distinta de usarlo que nadie más pensó.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 604, questionId: 6, optionText: "Pidiéndole a alguien que ya sabe que te enseñe y aprendiendo juntos.", icon: "🗣️", scorePayload: { SOCIAL: 3, CONVENTIONAL: 1 } },

  // Q07
  { id: 701, questionId: 7, optionText: "Descubrir la lógica escondida detrás: entender por qué funciona así.", icon: "🧩", scorePayload: { LOGIC: 3, INVESTIGATIVE: 1 } },
  { id: 702, questionId: 7, optionText: "Armar algo concreto con tus manos (o con código) que sí funcione.", icon: "🔧", scorePayload: { REALISTIC: 3, TECH: 1 } },
  { id: 703, questionId: 7, optionText: "Encontrar una solución rara que a nadie más se le hubiera ocurrido.", icon: "💡", scorePayload: { ARTISTIC: 2, INVESTIGATIVE: 2 } },
  { id: 704, questionId: 7, optionText: "Lograr que otros se sumen y se emocionen contigo por el reto.", icon: "🚀", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q08
  { id: 801, questionId: 8, optionText: "Comparas ventajas y desventajas de cada opción con cabeza fría.", icon: "📊", scorePayload: { LOGIC: 2, INVESTIGATIVE: 2 } },
  { id: 802, questionId: 8, optionText: "Vas por la opción más práctica y fácil de hacer ya.", icon: "🛠️", scorePayload: { REALISTIC: 3, CONVENTIONAL: 1 } },
  { id: 803, questionId: 8, optionText: "Propones una cuarta idea que mezcla lo mejor de las tres.", icon: "💡", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 804, questionId: 8, optionText: "Escuchas a todos, buscas que estén de acuerdo y decides por el grupo.", icon: "👑", scorePayload: { ENTERPRISING: 2, SOCIAL: 2 } },

  // Q09
  { id: 901, questionId: 9, optionText: "El que arma y hace que las cosas realmente funcionen.", icon: "🔧", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 902, questionId: 9, optionText: "El que organiza los tiempos, tareas y hace que todo cuadre.", icon: "🧠", scorePayload: { LOGIC: 2, CONVENTIONAL: 2 } },
  { id: 903, questionId: 9, optionText: "El que le da una onda o estilo único que todos van a recordar.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 904, questionId: 9, optionText: "El que lidera, reparte tareas y motiva al equipo.", icon: "👑", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q10
  { id: 1001, questionId: 10, optionText: "Te sientas con él o ella a escuchar qué pasa y a apoyarlo.", icon: "🤝", scorePayload: { SOCIAL: 3, CONVENTIONAL: 1 } },
  { id: 1002, questionId: 10, optionText: "Le explicas paso a paso una forma más simple de resolverlo.", icon: "🧠", scorePayload: { LOGIC: 2, SOCIAL: 2 } },
  { id: 1003, questionId: 10, optionText: "Le propones una forma distinta y más entretenida de hacerlo.", icon: "💡", scorePayload: { ARTISTIC: 2, SOCIAL: 1, TECH: 1 } },
  { id: 1004, questionId: 10, optionText: "Reorganizas las tareas del grupo para que todo salga a tiempo.", icon: "👑", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q11
  { id: 1101, questionId: 11, optionText: "Un cuarto lleno de pantallas, creando o programando algo.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 1102, questionId: 11, optionText: "Un laboratorio o biblioteca, investigando algo a fondo.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, CONVENTIONAL: 1 } },
  { id: 1103, questionId: 11, optionText: "Un estudio creativo, diseñando o grabando contenido.", icon: "🎨", scorePayload: { ARTISTIC: 3, TECH: 1 } },
  { id: 1104, questionId: 11, optionText: "Una reunión con gente, coordinando y armando planes.", icon: "🗣️", scorePayload: { SOCIAL: 2, ENTERPRISING: 2 } },

  // Q12
  { id: 1201, questionId: 12, optionText: "Armas una lista o cronograma claro de qué hacer y cuándo.", icon: "📋", scorePayload: { CONVENTIONAL: 3, LOGIC: 1 } },
  { id: 1202, questionId: 12, optionText: "Agarras una parte y haces un primer avance para mostrar que se puede.", icon: "🛠️", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 1203, questionId: 12, optionText: "Diseñas cómo se va a ver o comunicar para que todos lo entiendan.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 1204, questionId: 12, optionText: "Tomas la iniciativa, repartes tareas y comprometes al grupo.", icon: "👑", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q13
  { id: 1301, questionId: 13, optionText: "Alguien que crea apps, videojuegos o inteligencia artificial.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 1302, questionId: 13, optionText: "Un científico resolviendo algo que nadie ha logrado entender.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 1303, questionId: 13, optionText: "Alguien que crea contenido, marcas o campañas para una agencia.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 1304, questionId: 13, optionText: "Alguien que trabaja transformando la vida de otras personas.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q14
  { id: 1401, questionId: 14, optionText: "Una app o sistema que le simplifique la vida a millones de personas.", icon: "💻", scorePayload: { TECH: 3, LOGIC: 1 } },
  { id: 1402, questionId: 14, optionText: "Una investigación o descubrimiento que cambie cómo entendemos algo.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 1403, questionId: 14, optionText: "Una marca, canal o proyecto creativo que conecte con la gente.", icon: "🎨", scorePayload: { ARTISTIC: 3, SOCIAL: 1 } },
  { id: 1404, questionId: 14, optionText: "Un negocio propio que crezca y genere impacto real.", icon: "🚀", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },

  // Q15
  { id: 1501, questionId: 15, optionText: "Problemas de tecnología, seguridad digital o manejo de datos.", icon: "⚙️", scorePayload: { TECH: 2, LOGIC: 2 } },
  { id: 1502, questionId: 15, optionText: "Misterios científicos que todavía nadie ha logrado explicar.", icon: "🔬", scorePayload: { INVESTIGATIVE: 3, LOGIC: 1 } },
  { id: 1503, questionId: 15, optionText: "Cómo nos comunicamos, expresamos y vivimos experiencias nuevas.", icon: "🎨", scorePayload: { ARTISTIC: 3, ENTERPRISING: 1 } },
  { id: 1504, questionId: 15, optionText: "Problemas que afectan directamente la salud o el bienestar de la gente.", icon: "🤝", scorePayload: { SOCIAL: 3, ENTERPRISING: 1 } },

  // Q16
  { id: 1601, questionId: 16, optionText: "Crear y construir: diseñar soluciones prácticas y tecnología.", icon: "⚙️", scorePayload: { REALISTIC: 2, TECH: 2 } },
  { id: 1602, questionId: 16, optionText: "Descubrir y entender: investigar a fondo y basarte en evidencia.", icon: "🔬", scorePayload: { INVESTIGATIVE: 2, LOGIC: 2 } },
  { id: 1603, questionId: 16, optionText: "Imaginar y expresar: crear ideas originales que emocionen a otros.", icon: "🎨", scorePayload: { ARTISTIC: 3, SOCIAL: 1 } },
  { id: 1604, questionId: 16, optionText: "Liderar y transformar: armar proyectos, innovar y emprender.", icon: "🚀", scorePayload: { ENTERPRISING: 3, SOCIAL: 1 } },
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
  { careerId: 1, dimension: 'TECH', weight: 1.0, minScore: 10, explanationTemplate: 'Tu alta afinidad tecnológica coincide con el diseño y construcción de sistemas de software avanzados en las mejores universidades del país.' },
  { careerId: 1, dimension: 'LOGIC', weight: 0.85, minScore: 8, explanationTemplate: 'Tu pensamiento analítico y estructurado te permitirá dominar algoritmos complejos y arquitectura de datos.' },
  { careerId: 2, dimension: 'TECH', weight: 0.90, minScore: 8, explanationTemplate: 'Tu interés en tecnología aplicada a procesos te posiciona idealmente para liderar la transformación digital empresarial.' },
  { careerId: 2, dimension: 'ENTERPRISING', weight: 0.80, minScore: 7, explanationTemplate: 'Tu visión de negocio te permitirá alinear los sistemas informáticos con los objetivos estratégicos corporativos.' },
  { careerId: 3, dimension: 'INVESTIGATIVE', weight: 1.00, minScore: 10, explanationTemplate: 'Tu perfil investigador te impulsa a comprender los fundamentos matemáticos y desarrollar algoritmos innovadores de IA.' },
  { careerId: 3, dimension: 'LOGIC', weight: 0.95, minScore: 9, explanationTemplate: 'Tu rigurosidad lógica es esencial para resolver problemas complejos de computación científica.' },
  { careerId: 4, dimension: 'ENTERPRISING', weight: 1.00, minScore: 10, explanationTemplate: 'Tu liderazgo natural y visión estratégica encajan con la dirección de organizaciones competitivas en las principales universidades.' },
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

