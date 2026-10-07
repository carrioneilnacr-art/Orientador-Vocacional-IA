/**
 * questionnaireData.ts
 * Definición central de las 16 interacciones del Orientador Vocacional IA.
 * Dividido en 4 misiones temáticas con Chaski.
 * 
 * CALIBRACIÓN PSICOMÉTRICA BALANCEADA:
 * Cubre de manera equitativa e inclusiva todas las áreas vocacionales:
 * - Ciencias de la Salud y Humanas (Psicología, Medicina, Trabajo Social)
 * - Negocios, Finanzas y Leyes (Administración, Marketing, Finanzas, Derecho)
 * - Arte, Diseño y Arquitectura (Arquitectura, Diseño, Comunicación & Publicidad)
 * - Ingeniería, Ciencias y Tecnología (Software, Sistemas, Computación, Civil, Industrial)
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
    subtitle: "Tu Chispa Natural",
    icon: "🧭",
    startQuestionOrder: 1,
    endQuestionOrder: 4,
    chaskiIntro: "¡Habla! Soy Chaski, tu guía vocacional. Vamos a descubrir tus intereses y pasiones espontáneas. ¡Sin presiones, responde con total sinceridad!",
    chaskiCompletedMessage: "¡Excelente inicio! Ya capto tus talentos naturales. Ahora veamos cómo te desenvuelves resolviendo retos.",
  },
  {
    number: 2,
    title: "Misión 02",
    subtitle: "En la Cancha",
    icon: "🧩",
    startQuestionOrder: 5,
    endQuestionOrder: 8,
    chaskiIntro: "Momento de resolver. ¿Qué estrategia aplicas cuando se presenta un dilema o un obstáculo en el camino?",
    chaskiCompletedMessage: "¡Gran capacidad de análisis! Tienes un enfoque único para resolver. Ahora veamos tu estilo en equipo.",
  },
  {
    number: 3,
    title: "Misión 03",
    subtitle: "Tu Estilo con la Gente",
    icon: "🤝",
    startQuestionOrder: 9,
    endQuestionOrder: 12,
    chaskiIntro: "El éxito se construye en comunidad. ¿Qué rol asumes naturalmente al trabajar con otras personas?",
    chaskiCompletedMessage: "¡Notable liderazgo y empatía! Vamos a la misión final: tu visión y huella en el mundo.",
  },
  {
    number: 4,
    title: "Misión 04",
    subtitle: "Tu Huella en el Mundo",
    icon: "🚀",
    startQuestionOrder: 13,
    endQuestionOrder: 16,
    chaskiIntro: "Último tramo del viaje. Proyecta tu futuro con audacia: ¿en qué campo quieres dejar tu legado profesional?",
    chaskiCompletedMessage: "¡Misión completada con éxito! He procesado tus 16 decisiones y tu perfil vocacional está listo. ¡Descúbrelo!",
  },
];

export const VERIFIED_16_QUESTIONS: QuestionItem[] = [
  // MISIÓN 01 — Tu Chispa Natural (1 a 4)
  {
    id: 1,
    code: "Q01_FREE_AFTERNOON",
    missionNumber: 1,
    missionTitle: "Misión 01: Tu Chispa Natural",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "CHOICE",
    questionText: "Tienes una tarde libre para iniciar un proyecto propio sin límites. ¿En qué te enfocarías?",
    helperText: "Elige lo que harías por pura pasión e iniciativa personal.",
    orderNumber: 1,
    isActive: true,
  },
  {
    id: 2,
    code: "Q02_INTERDISCIPLINARY_CONTEST",
    missionNumber: 1,
    missionTitle: "Misión 01: Tu Chispa Natural",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "SCENARIO",
    questionText: "En una feria escolar de proyectos de impacto social, ¿qué propuesta liderarías?",
    helperText: "Visualiza la causa que más despierta tu entusiasmo.",
    orderNumber: 2,
    isActive: true,
  },
  {
    id: 3,
    code: "Q03_CURIOSITY_PROJECT",
    missionNumber: 1,
    missionTitle: "Misión 01: Tu Chispa Natural",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "CHOICE",
    questionText: "Si contaras con financiamiento garantizado para fundar una organización de un mes, ¿cuál crearías?",
    helperText: "Piensa en el tipo de entidad que refleje tus valores.",
    orderNumber: 3,
    isActive: true,
  },
  {
    id: 4,
    code: "Q04_PROUD_ACHIEVEMENT",
    missionNumber: 1,
    missionTitle: "Misión 01: Tu Chispa Natural",
    missionSubtitle: "Intereses espontáneos",
    missionIcon: "🧭",
    interactionType: "CHOICE",
    questionText: "Al mirar atrás dentro de 10 años, ¿qué gran logro profesional te haría sentir pleno?",
    helperText: "Visualiza el legado que te llenaría de orgullo.",
    orderNumber: 4,
    isActive: true,
  },

  // MISIÓN 02 — En la Cancha (5 a 8)
  {
    id: 5,
    code: "Q05_PROJECT_BLOCKED",
    missionNumber: 2,
    missionTitle: "Misión 02: En la Cancha",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "SCENARIO",
    questionText: "Tu equipo sufre un bloqueo crítico a pocas horas de una presentación decisiva. ¿Cómo actúas?",
    helperText: "Tu respuesta instintiva frente a la presión.",
    orderNumber: 5,
    isActive: true,
  },
  {
    id: 6,
    code: "Q06_LEARN_NEW_TOOL",
    missionNumber: 2,
    missionTitle: "Misión 02: En la Cancha",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "CHOICE",
    questionText: "Debes asimilar un conocimiento complejo y totalmente nuevo en tiempo récord. ¿Cuál es tu método?",
    helperText: "El estilo de aprendizaje donde eres más efectivo.",
    orderNumber: 6,
    isActive: true,
  },
  {
    id: 7,
    code: "Q07_ETHICAL_DILEMMA",
    missionNumber: 2,
    missionTitle: "Misión 02: En la Cancha",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "SCENARIO",
    questionText: "Frente a un conflicto de intereses o dilema ético complejo en una institución, ¿qué priorizas?",
    helperText: "El principio rector de tus decisiones de fondo.",
    orderNumber: 7,
    isActive: true,
  },
  {
    id: 8,
    code: "Q08_DECISION_UNCERTAINTY",
    missionNumber: 2,
    missionTitle: "Misión 02: En la Cancha",
    missionSubtitle: "Forma de pensar y resolver",
    missionIcon: "🧩",
    interactionType: "CHOICE",
    questionText: "Hay que tomar una decisión crucial con información incompleta. ¿De qué te guías principalmente?",
    helperText: "Tu base de confianza para dar el siguiente paso.",
    orderNumber: 8,
    isActive: true,
  },

  // MISIÓN 03 — Tu Estilo con la Gente (9 a 12)
  {
    id: 9,
    code: "Q09_TEAM_ROLE",
    missionNumber: 3,
    missionTitle: "Misión 03: Tu Estilo con la Gente",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "ROLE",
    questionText: "En un equipo multidisciplinario de alto rendimiento, ¿cuál es tu rol natural espontáneo?",
    helperText: "La función donde fluyes con mayor solvencia.",
    orderNumber: 9,
    isActive: true,
  },
  {
    id: 10,
    code: "Q10_PEER_DIFFICULTY",
    missionNumber: 3,
    missionTitle: "Misión 03: Tu Estilo con la Gente",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "SCENARIO",
    questionText: "Un integrante del equipo se encuentra desmotivado o desorientado. ¿Cómo intervienes?",
    helperText: "Tu forma sincera de acompañar y orientar.",
    orderNumber: 10,
    isActive: true,
  },
  {
    id: 11,
    code: "Q11_ENJOY_ENVIRONMENT",
    missionNumber: 3,
    missionTitle: "Misión 03: Tu Estilo con la Gente",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "CHOICE",
    questionText: "¿En qué tipo de ambiente profesional sientes que tu energía y creatividad se potencian al máximo?",
    helperText: "El entorno laboral donde te imaginas todos los días.",
    orderNumber: 11,
    isActive: true,
  },
  {
    id: 12,
    code: "Q12_ORGANIZING_CHAOS",
    missionNumber: 3,
    missionTitle: "Misión 03: Tu Estilo con la Gente",
    missionSubtitle: "Roles y trabajo en equipo",
    missionIcon: "🤝",
    interactionType: "SCENARIO",
    questionText: "Surge una gran idea colectiva pero reina el desorden y la falta de rumbo. ¿Cuál es tu aporte inicial?",
    helperText: "La acción concreta con la que transformas ideas en realidad.",
    orderNumber: 12,
    isActive: true,
  },

  // MISIÓN 04 — Tu Huella en el Mundo (13 a 16)
  {
    id: 13,
    code: "Q13_NATIONAL_PROBLEM",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu Huella en el Mundo",
    missionSubtitle: "Motivaciones y ambientes deseados",
    missionIcon: "🚀",
    interactionType: "FUTURE",
    questionText: "Si tuvieras la potestad de resolver un desafío prioritario en el país, ¿cuál elegirías?",
    helperText: "La causa que mueve tu vocación más profunda.",
    orderNumber: 13,
    isActive: true,
  },
  {
    id: 14,
    code: "Q14_MEDIA_INFLUENCE",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu Huella en el Mundo",
    missionSubtitle: "Motivaciones y ambientes deseados",
    missionIcon: "🚀",
    interactionType: "FUTURE",
    questionText: "Si lideraras un medio de comunicación o canal masivo, ¿en qué temáticas centrarías tus contenidos?",
    helperText: "El campo del conocimiento que te apasiona divulgar.",
    orderNumber: 14,
    isActive: true,
  },
  {
    id: 15,
    code: "Q15_FUTURE_VOCATION",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu Huella en el Mundo",
    missionSubtitle: "Motivaciones y ambientes deseados",
    missionIcon: "🚀",
    interactionType: "CHOICE",
    questionText: "Visualizándote en plena madurez profesional (30 a 35 años), ¿en qué labor te verías más realizado?",
    helperText: "El estilo de vida y propósito que anhelas construir.",
    orderNumber: 15,
    isActive: true,
  },
  {
    id: 16,
    code: "Q16_VOCATIONAL_SUPERPOWER",
    missionNumber: 4,
    missionTitle: "Misión 04: Tu Huella en el Mundo",
    missionSubtitle: "Decisión final de camino",
    missionIcon: "🚀",
    interactionType: "CHOICE",
    questionText: "Como don definitivo para forjar tu destino profesional, Chaski te ofrece 4 facultades. ¿Cuál eliges?",
    helperText: "Tu talento nuclear con el que transformarás realidades.",
    orderNumber: 16,
    isActive: true,
  },
];

export const VERIFIED_64_OPTIONS: OptionItem[] = [
  // ── Q01 (Misión 1, Pregunta 1) ──
  { id: 101, questionId: 1, optionText: "Crear contenido visual, producciones artísticas, narrativas o música.", icon: "🎨", scorePayload: { ARTISTIC: 25, SOCIAL: 10, ENTERPRISING: 5 } },
  { id: 102, questionId: 1, optionText: "Diseñar un modelo de negocio, emprendimiento o estrategia de ventas.", icon: "🚀", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 10, LOGIC: 5 } },
  { id: 103, questionId: 1, optionText: "Brindar apoyo emocional, asesorar personas o coordinar ayuda social.", icon: "❤️", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 10, ARTISTIC: 5 } },
  { id: 104, questionId: 1, optionText: "Construir, programar o reparar prototipos técnicos o funcionales.", icon: "🛠️", scorePayload: { REALISTIC: 20, TECH: 20, LOGIC: 15 } },

  // ── Q02 (Misión 1, Pregunta 2) ──
  { id: 201, questionId: 2, optionText: "Una investigación médica o de salud mental para el bienestar comunitario.", icon: "🔬", scorePayload: { INVESTIGATIVE: 25, SOCIAL: 15, LOGIC: 10 } },
  { id: 202, questionId: 2, optionText: "Una iniciativa de defensa legal, derechos ciudadanos y justicia social.", icon: "⚖️", scorePayload: { SOCIAL: 20, ENTERPRISING: 20, INVESTIGATIVE: 10 } },
  { id: 203, questionId: 2, optionText: "El diseño bioclimático o maqueta de un espacio urbano sostenible.", icon: "🏛️", scorePayload: { REALISTIC: 20, ARTISTIC: 20, LOGIC: 10 } },
  { id: 204, questionId: 2, optionText: "La gestión presupuestal, auditoría y análisis de viabilidad financiera.", icon: "📊", scorePayload: { CONVENTIONAL: 25, LOGIC: 15, ENTERPRISING: 10 } },

  // ── Q03 (Misión 1, Pregunta 3) ──
  { id: 301, questionId: 3, optionText: "Un estudio de diseño gráfico, productora creativa o agencia publicitaria.", icon: "🎬", scorePayload: { ARTISTIC: 25, ENTERPRISING: 15, SOCIAL: 5 } },
  { id: 302, questionId: 3, optionText: "Un centro de orientación psicológica y desarrollo humano para jóvenes.", icon: "🤝", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, ENTERPRISING: 5 } },
  { id: 303, questionId: 3, optionText: "Una empresa de desarrollo tecnológico, software inteligente y robótica.", icon: "💻", scorePayload: { TECH: 25, LOGIC: 20, REALISTIC: 10 } },
  { id: 304, questionId: 3, optionText: "Un fondo de inversiones comerciales y expansión empresarial de alto impacto.", icon: "📈", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 15, LOGIC: 10 } },

  // ── Q04 (Misión 1, Pregunta 4) ──
  { id: 401, questionId: 4, optionText: "Haber defendido con éxito a personas vulnerables o transformado vidas humanas.", icon: "🌟", scorePayload: { SOCIAL: 25, ENTERPRISING: 15, INVESTIGATIVE: 10 } },
  { id: 402, questionId: 4, optionText: "Haber consolidado una organización empresarial líder y altamente rentable.", icon: "🏢", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 20, LOGIC: 5 } },
  { id: 403, questionId: 4, optionText: "Haber diseñado obras arquitectónicas o campañas creativas memorables.", icon: "✨", scorePayload: { ARTISTIC: 25, REALISTIC: 15, ENTERPRISING: 10 } },
  { id: 404, questionId: 4, optionText: "Haber creado soluciones tecnológicas o científicas de impacto global.", icon: "🧠", scorePayload: { INVESTIGATIVE: 20, TECH: 20, LOGIC: 15 } },

  // ── Q05 (Misión 2, Pregunta 5) ──
  { id: 501, questionId: 5, optionText: "Analizo los antecedentes, normativas y datos objetivos para hallar la raíz de la falla.", icon: "🔍", scorePayload: { LOGIC: 25, INVESTIGATIVE: 15, CONVENTIONAL: 10 } },
  { id: 502, questionId: 5, optionText: "Propongo una idea conceptual innovadora y disruptiva que redefine la propuesta.", icon: "💡", scorePayload: { ARTISTIC: 25, ENTERPRISING: 15, SOCIAL: 5 } },
  { id: 503, questionId: 5, optionText: "Reorganizo al grupo con calma, modero el clima emocional y distribuyo prioridades.", icon: "🤝", scorePayload: { SOCIAL: 25, ENTERPRISING: 15, CONVENTIONAL: 10 } },
  { id: 504, questionId: 5, optionText: "Ejecuto de inmediato las acciones prácticas de ingeniería y ensamblado necesarias.", icon: "🔧", scorePayload: { REALISTIC: 25, TECH: 15, LOGIC: 10 } },

  // ── Q06 (Misión 2, Pregunta 6) ──
  { id: 601, questionId: 6, optionText: "Investigo los fundamentos científicos, marcos teóricos y literatura especializada.", icon: "📚", scorePayload: { INVESTIGATIVE: 25, LOGIC: 15, CONVENTIONAL: 5 } },
  { id: 602, questionId: 6, optionText: "Construyo esquemas visuales, infografías y metáforas comunicacionales.", icon: "🎨", scorePayload: { ARTISTIC: 25, SOCIAL: 10, CONVENTIONAL: 10 } },
  { id: 603, questionId: 6, optionText: "Debato con expertos y formo un círculo de estudio interactivo para resolver dudas.", icon: "🗣️", scorePayload: { SOCIAL: 25, ENTERPRISING: 15, INVESTIGATIVE: 5 } },
  { id: 604, questionId: 6, optionText: "Sigo una metodología secuencial, manuales estructurados y listas de control.", icon: "📋", scorePayload: { CONVENTIONAL: 25, LOGIC: 15, REALISTIC: 10 } },

  // ── Q07 (Misión 2, Pregunta 7) ──
  { id: 701, questionId: 7, optionText: "El marco normativo, la jurisprudencia, los derechos fundamentales y la justicia.", icon: "⚖️", scorePayload: { INVESTIGATIVE: 20, ENTERPRISING: 20, SOCIAL: 10 } },
  { id: 702, questionId: 7, optionText: "La salud psicológica, el bienestar humano y la empatía con los involucrados.", icon: "❤️", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, ARTISTIC: 5 } },
  { id: 703, questionId: 7, optionText: "El análisis costo-beneficio, la eficiencia económica y la estabilidad financiera.", icon: "📈", scorePayload: { CONVENTIONAL: 25, LOGIC: 15, ENTERPRISING: 15 } },
  { id: 704, questionId: 7, optionText: "El rigor lógico, la evidencia empírica y la consistencia de los sistemas.", icon: "⚙️", scorePayload: { LOGIC: 25, TECH: 15, INVESTIGATIVE: 15 } },

  // ── Q08 (Misión 2, Pregunta 8) ──
  { id: 801, questionId: 8, optionText: "Elaboro una matriz de decisión cuantitativa con ponderación de riesgos.", icon: "📊", scorePayload: { CONVENTIONAL: 25, LOGIC: 20, INVESTIGATIVE: 5 } },
  { id: 802, questionId: 8, optionText: "Sigo mi criterio estético, visión creativa y el impacto sensorial esperado.", icon: "👁️", scorePayload: { ARTISTIC: 25, ENTERPRISING: 10, SOCIAL: 5 } },
  { id: 803, questionId: 8, optionText: "Busco el consenso democrático y evalúo el impacto social en la comunidad.", icon: "🗳️", scorePayload: { SOCIAL: 25, ENTERPRISING: 15, CONVENTIONAL: 5 } },
  { id: 804, questionId: 8, optionText: "Asumo el liderazgo con determinación y convenzo a las partes de la estrategia.", icon: "👑", scorePayload: { ENTERPRISING: 25, LOGIC: 10, SOCIAL: 10 } },

  // ── Q09 (Misión 3, Pregunta 9) ──
  { id: 901, questionId: 9, optionText: "El Estratega / Líder: defino la visión, consigo alianzas y expongo la propuesta.", icon: "🎤", scorePayload: { ENTERPRISING: 25, SOCIAL: 15, ARTISTIC: 10 } },
  { id: 902, questionId: 9, optionText: "El Creador / Diseñador: concibo la identidad visual, el espacio y la narrativa de marca.", icon: "🎨", scorePayload: { ARTISTIC: 25, REALISTIC: 15, ENTERPRISING: 5 } },
  { id: 903, questionId: 9, optionText: "El Investigador / Diagnosta: profundizo en la fundamentación y análisis de datos.", icon: "🔎", scorePayload: { INVESTIGATIVE: 25, LOGIC: 15, CONVENTIONAL: 10 } },
  { id: 904, questionId: 9, optionText: "El Constructor / Gestor Operativo: aseguro la infraestructura y ejecución técnica.", icon: "🛠️", scorePayload: { REALISTIC: 20, TECH: 20, CONVENTIONAL: 10 } },

  // ── Q10 (Misión 3, Pregunta 10) ──
  { id: 1001, questionId: 10, optionText: "Converso en privado con empatía para entender su estado emocional y apoyarlo.", icon: "❤️", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, ARTISTIC: 5 } },
  { id: 1002, questionId: 10, optionText: "Reestructuro el cronograma y reasigno tareas para optimizar el flujo de trabajo.", icon: "🗂️", scorePayload: { CONVENTIONAL: 25, ENTERPRISING: 15, LOGIC: 10 } },
  { id: 1003, questionId: 10, optionText: "Lo inspiro con una visión renovada del objetivo común y reconozco su potencial.", icon: "🔥", scorePayload: { ENTERPRISING: 25, SOCIAL: 15, ARTISTIC: 5 } },
  { id: 1004, questionId: 10, optionText: "Le explico la lógica técnica paso a paso y le facilito herramientas de apoyo.", icon: "🧠", scorePayload: { LOGIC: 20, INVESTIGATIVE: 15, TECH: 15 } },

  // ── Q11 (Misión 3, Pregunta 11) ──
  { id: 1101, questionId: 11, optionText: "En un consultorio, hospital, centro educativo o institución de desarrollo social.", icon: "🏥", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, CONVENTIONAL: 5 } },
  { id: 1102, questionId: 11, optionText: "En un estudio de arquitectura, agencia publicitaria o set creativo de medios.", icon: "🏛️", scorePayload: { ARTISTIC: 25, REALISTIC: 15, ENTERPRISING: 10 } },
  { id: 1103, questionId: 11, optionText: "En una sala de directorio corporativo, centro financiero o tribunal de justicia.", icon: "👔", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 15, LOGIC: 10 } },
  { id: 1104, questionId: 11, optionText: "En un laboratorio de ingeniería, centro de innovación tecnológica o planta industrial.", icon: "💻", scorePayload: { REALISTIC: 20, TECH: 20, LOGIC: 15 } },

  // ── Q12 (Misión 3, Pregunta 12) ──
  { id: 1201, questionId: 12, optionText: "Establezco los acuerdos normativos, el código de conducta y el marco de gobernanza.", icon: "⚖️", scorePayload: { INVESTIGATIVE: 20, CONVENTIONAL: 20, SOCIAL: 10 } },
  { id: 1202, questionId: 12, optionText: "Estructuro el presupuesto financiero, cronograma de entregables y métricas de control.", icon: "📊", scorePayload: { CONVENTIONAL: 25, LOGIC: 15, ENTERPRISING: 10 } },
  { id: 1203, questionId: 12, optionText: "Diseño la estrategia de comunicación, imagen pública y lanzamiento de campaña.", icon: "📣", scorePayload: { ARTISTIC: 25, ENTERPRISING: 15, SOCIAL: 10 } },
  { id: 1204, questionId: 12, optionText: "Configuro los sistemas operativos, herramientas digitales y logística de soporte.", icon: "⚙️", scorePayload: { REALISTIC: 20, TECH: 20, LOGIC: 10 } },

  // ── Q13 (Misión 4, Pregunta 13) ──
  { id: 1301, questionId: 13, optionText: "La salud mental comunitaria, la inclusión educativa y el bienestar infantil.", icon: "❤️", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, ENTERPRISING: 5 } },
  { id: 1302, questionId: 13, optionText: "La competitividad económica, generación de empleo formal y fomento empresarial.", icon: "📈", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 15, LOGIC: 10 } },
  { id: 1303, questionId: 13, optionText: "El ordenamiento territorial, hábitat digno y la regeneración urbana sostenible.", icon: "🏡", scorePayload: { ARTISTIC: 20, REALISTIC: 20, SOCIAL: 10 } },
  { id: 1304, questionId: 13, optionText: "La modernización tecnológica, infraestructura digital y ciberseguridad del país.", icon: "🌐", scorePayload: { TECH: 25, LOGIC: 20, REALISTIC: 10 } },

  // ── Q14 (Misión 4, Pregunta 14) ──
  { id: 1401, questionId: 14, optionText: "Comportamiento humano, psicología aplicada, neurociencias y relaciones sanas.", icon: "🧠", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, ARTISTIC: 5 } },
  { id: 1402, questionId: 14, optionText: "Estrategias de inversión, finanzas corporativas, derecho empresarial y marketing.", icon: "💰", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 15, LOGIC: 10 } },
  { id: 1403, questionId: 14, optionText: "Arquitectura vanguardista, arte contemporáneo, diseño y cultura audiovisual.", icon: "🎨", scorePayload: { ARTISTIC: 25, REALISTIC: 15, SOCIAL: 5 } },
  { id: 1404, questionId: 14, optionText: "Innovación científica, algoritmos de IA, computación y proyectos de ingeniería.", icon: "🤖", scorePayload: { INVESTIGATIVE: 20, TECH: 20, LOGIC: 15 } },

  // ── Q15 (Misión 4, Pregunta 15) ──
  { id: 1501, questionId: 15, optionText: "Diagnosticando, evaluando e interviniendo para sanar y elevar el potencial humano.", icon: "🩺", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 20, REALISTIC: 5 } },
  { id: 1502, questionId: 15, optionText: "Como socio de una firma jurídica, director general corporativo o estratega financiero.", icon: "💼", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 15, LOGIC: 10 } },
  { id: 1503, questionId: 15, optionText: "Proyectando edificaciones icónicas, marcas globales o dirigiendo obras creativas.", icon: "🏛️", scorePayload: { ARTISTIC: 25, REALISTIC: 15, ENTERPRISING: 10 } },
  { id: 1504, questionId: 15, optionText: "Desarrollando arquitecturas de software avanzadas o sistemas de alta complejidad.", icon: "💻", scorePayload: { TECH: 25, LOGIC: 20, REALISTIC: 10 } },

  // ── Q16 (Misión 4, Pregunta 16) ──
  { id: 1601, questionId: 16, optionText: "El don de la Empatía y el Diagnóstico: comprender a las personas y sanar su bienestar.", icon: "❤️", scorePayload: { SOCIAL: 25, INVESTIGATIVE: 15, ARTISTIC: 5 } },
  { id: 1602, questionId: 16, optionText: "El don del Liderazgo y la Visión: dirigir organizaciones hacia el éxito estratégico.", icon: "🚀", scorePayload: { ENTERPRISING: 25, CONVENTIONAL: 15, LOGIC: 10 } },
  { id: 1603, questionId: 16, optionText: "El don de la Creación y el Espacio: transformar la estética y materializar obras maestras.", icon: "✨", scorePayload: { ARTISTIC: 25, REALISTIC: 15, ENTERPRISING: 5 } },
  { id: 1604, questionId: 16, optionText: "El don del Ingenio y la Lógica: decodificar enigmas complejos y construir tecnología pionera.", icon: "🦾", scorePayload: { LOGIC: 20, TECH: 20, INVESTIGATIVE: 15 } },
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
    campuses: ['UPN (Los Olivos, Comas)', 'UTP (Lima Norte)'],
    cost: 'PEN 850 - PEN 1450',
  },
  {
    id: 2,
    slug: 'ingenieria-de-sistemas-de-informacion',
    name: 'Ingeniería de Sistemas e Informática',
    faculty: 'Ingeniería',
    degree: 'Bachiller en Ingeniería de Sistemas',
    campuses: ['UPN (Los Olivos, Comas)', 'UCH (Los Olivos)', 'UTP (Lima Norte)', 'UCV (Lima Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 650 - PEN 1350',
  },
  {
    id: 3,
    slug: 'ciencias-de-la-computacion',
    name: 'Ciencias de la Computación',
    faculty: 'Ingeniería',
    degree: 'Bachiller en Ciencias de la Computación',
    campuses: ['UCH (Los Olivos)', 'UTP (Lima Norte)'],
    cost: 'PEN 650 - PEN 1200',
  },
  {
    id: 4,
    slug: 'administracion',
    name: 'Administración',
    faculty: 'Negocios y Ciencias Empresariales',
    degree: 'Bachiller en Administración',
    campuses: ['UPN (Los Olivos, Comas)', 'UCH (Los Olivos)', 'UTP (Lima Norte)', 'UCV (Lima Norte)', 'UCSUR (Campus Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 600 - PEN 1350',
  },
  {
    id: 5,
    slug: 'administracion-y-marketing',
    name: 'Administración y Marketing',
    faculty: 'Negocios y Ciencias Empresariales',
    degree: 'Bachiller en Administración y Marketing',
    campuses: ['UPN (Los Olivos, Comas)', 'UTP (Lima Norte)', 'UCSUR (Campus Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 650 - PEN 1400',
  },
  {
    id: 6,
    slug: 'administracion-y-finanzas',
    name: 'Administración y Finanzas',
    faculty: 'Negocios y Ciencias Financieras',
    degree: 'Bachiller en Administración y Finanzas',
    campuses: ['UPN (Los Olivos, Comas)', 'UTP (Lima Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 650 - PEN 1400',
  },
  {
    id: 7,
    slug: 'psicologia',
    name: 'Psicología',
    faculty: 'Ciencias de la Salud',
    degree: 'Bachiller en Psicología',
    campuses: ['UPN (Los Olivos, Comas)', 'UCH (Los Olivos)', 'UTP (Lima Norte)', 'UCV (Lima Norte)', 'UCSUR (Campus Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 650 - PEN 1450',
  },
  {
    id: 8,
    slug: 'derecho',
    name: 'Derecho',
    faculty: 'Derecho y Ciencias Políticas',
    degree: 'Bachiller en Derecho',
    campuses: ['UPN (Los Olivos, Comas)', 'UCH (Los Olivos)', 'UTP (Lima Norte)', 'UCV (Lima Norte)', 'UCSUR (Campus Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 700 - PEN 1550',
  },
  {
    id: 9,
    slug: 'comunicacion-y-publicidad',
    name: 'Comunicación y Publicidad',
    faculty: 'Comunicaciones',
    degree: 'Bachiller en Comunicación y Publicidad',
    campuses: ['UPN (Los Olivos, Comas)', 'UTP (Lima Norte)', 'UCV (Lima Norte)'],
    cost: 'PEN 650 - PEN 1350',
  },
  {
    id: 10,
    slug: 'arquitectura',
    name: 'Arquitectura',
    faculty: 'Arquitectura y Diseño',
    degree: 'Bachiller en Arquitectura',
    campuses: ['UPN (Los Olivos, Comas)', 'UTP (Lima Norte)', 'UCV (Lima Norte)', 'UCSUR (Campus Norte)', 'USMP (Lima Norte - Comas)'],
    cost: 'PEN 850 - PEN 1600',
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
  { careerId: 1, dimension: 'TECH', weight: 1.0, minScore: 25, explanationTemplate: 'Tu alta afinidad tecnológica coincide con el diseño y construcción de sistemas de software avanzados en las mejores universidades del país.' },
  { careerId: 1, dimension: 'LOGIC', weight: 0.85, minScore: 20, explanationTemplate: 'Tu pensamiento analítico y estructurado te permitirá dominar algoritmos complejos y arquitectura de datos.' },
  { careerId: 2, dimension: 'TECH', weight: 0.90, minScore: 25, explanationTemplate: 'Tu interés en tecnología aplicada a procesos te posiciona idealmente para liderar la transformación digital empresarial.' },
  { careerId: 2, dimension: 'ENTERPRISING', weight: 0.80, minScore: 20, explanationTemplate: 'Tu visión de negocio te permitirá alinear los sistemas informáticos con los objetivos estratégicos corporativos.' },
  { careerId: 3, dimension: 'INVESTIGATIVE', weight: 1.00, minScore: 25, explanationTemplate: 'Tu perfil investigador te impulsa a comprender los fundamentos matemáticos y desarrollar algoritmos innovadores de IA.' },
  { careerId: 3, dimension: 'LOGIC', weight: 0.95, minScore: 20, explanationTemplate: 'Tu rigurosidad lógica es esencial para resolver problemas complejos de computación científica.' },
  { careerId: 4, dimension: 'ENTERPRISING', weight: 1.00, minScore: 25, explanationTemplate: 'Tu liderazgo natural y visión estratégica encajan con la dirección de organizaciones competitivas en las principales universidades.' },
  { careerId: 4, dimension: 'CONVENTIONAL', weight: 0.70, minScore: 20, explanationTemplate: 'Tu capacidad de orden y organización respalda la gestión eficiente de recursos y proyectos.' },
  { careerId: 5, dimension: 'ARTISTIC', weight: 0.90, minScore: 25, explanationTemplate: 'Tu creatividad e imaginación te permitirán diseñar experiencias de marca y campañas de marketing de alto impacto.' },
  { careerId: 5, dimension: 'ENTERPRISING', weight: 0.85, minScore: 25, explanationTemplate: 'Tu visión comercial y estratégica potencia la toma de decisiones en mercados competitivos.' },
  { careerId: 6, dimension: 'LOGIC', weight: 0.95, minScore: 25, explanationTemplate: 'Tu afinidad por el análisis cuantitativo te permitirá destacar en finanzas corporativas y mercados de inversión.' },
  { careerId: 6, dimension: 'ENTERPRISING', weight: 0.85, minScore: 25, explanationTemplate: 'Tu orientación al logro te prepara para liderar decisiones financieras de alto valor empresarial.' },
  { careerId: 7, dimension: 'SOCIAL', weight: 1.00, minScore: 25, explanationTemplate: 'Tu profunda empatía y vocación de ayuda te conectan con la evaluación e intervención en el bienestar humano.' },
  { careerId: 7, dimension: 'INVESTIGATIVE', weight: 0.75, minScore: 20, explanationTemplate: 'Tu curiosidad por el comportamiento complementa tu formación científica en diagnóstico psicológico.' },
  { careerId: 8, dimension: 'INVESTIGATIVE', weight: 0.85, minScore: 25, explanationTemplate: 'Tu capacidad de análisis e investigación fundamenta una sólida argumentación jurídica.' },
  { careerId: 8, dimension: 'ENTERPRISING', weight: 0.80, minScore: 20, explanationTemplate: 'Tu criterio estratégico y negociación te preparan para liderar en derecho corporativo y resolución de disputas.' },
  { careerId: 9, dimension: 'ARTISTIC', weight: 1.00, minScore: 25, explanationTemplate: 'Tu creatividad e imaginación son clave para diseñar campañas publicitarias transmedia y conceptos de marca memorables.' },
  { careerId: 9, dimension: 'ENTERPRISING', weight: 0.80, minScore: 20, explanationTemplate: 'Tu capacidad persuasiva te permite negociar y conectar emocionalmente con audiencias masivas.' },
  { careerId: 10, dimension: 'REALISTIC', weight: 0.95, minScore: 25, explanationTemplate: 'Tu gusto por lo constructivo y espacial es fundamental en el diseño arquitectónico y proyectos habitables.' },
  { careerId: 10, dimension: 'ARTISTIC', weight: 0.90, minScore: 25, explanationTemplate: 'Tu sensibilidad estética y espacial te capacita para crear proyectos sostenibles y con identidad.' },
];

export const CHASKI_MICRO_REACTIONS: Record<string, { text: string; emoji: string }> = {
  TECH: { text: '¡Ingenio innovador! Te apasiona la tecnología.', emoji: '💻' },
  LOGIC: { text: '¡Mente analítica! Encuentras patrones con rigor.', emoji: '🧠' },
  INVESTIGATIVE: { text: '¡Curiosidad científica! Indagas hasta la raíz.', emoji: '🔍' },
  SOCIAL: { text: '¡Vocación humana! Tu motor es la empatía y la ayuda.', emoji: '🤝' },
  ARTISTIC: { text: '¡Sensibilidad creativa! Transformas ideas en arte.', emoji: '🎨' },
  ENTERPRISING: { text: '¡Liderazgo estratégico! Naciste para liderar metas.', emoji: '🚀' },
  CONVENTIONAL: { text: '¡Precisión y orden! Gestionas procesos con excelencia.', emoji: '📋' },
  REALISTIC: { text: '¡Acción constructiva! Creas y diseñas soluciones tangibles.', emoji: '🛠️' },
};
