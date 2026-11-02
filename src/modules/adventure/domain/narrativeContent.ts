/**
 * Authored exploratory situations for the adventure, not a validated interest test.
 * Weights are editorial tags retained for the game's existing narrative summary.
 * A choice describes a preference in one situation, never an aptitude or a career.
 * Keep versioned copy immutable: saved choice indexes must retain their meaning.
 */
export type NarrativeContentVersion = 'legacy-v1' | 'adventure-v2';
export const CURRENT_NARRATIVE_VERSION: NarrativeContentVersion = 'adventure-v2';
export type NarrativeNpcId = 'mateo' | 'ernesto' | 'valeria' | 'luis' | 'estudiantes';
export type SchoolDialogueId = 'elena' | 'sofia';
type NarrativeWeights = Partial<Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', number>>;
type ThreeTexts = readonly [string, string, string];
export type NarrativeConversation = {
  question: string;
  choices: ThreeTexts;
  reactions: ThreeTexts;
  notes: ThreeTexts;
  weights: readonly [NarrativeWeights, NarrativeWeights, NarrativeWeights];
};

/** Frozen first-edition text, needed to interpret sessions created before v2. */
export const legacyRpgDialogues: Record<NarrativeNpcId, NarrativeConversation> = {
  mateo: {
    question: 'Me encanta crear, dibujar y expresar ideas a través del arte. ¿A ti también te gusta imaginar y crear cosas nuevas?',
    choices: ['Sí, bastante.', 'A veces.', 'No mucho.'],
    reactions: ['¡Entonces sigue explorando! Un dibujo, una historia o una idea pueden ser un buen comienzo.', 'La inspiración puede aparecer al probar algo nuevo. Puedes explorar a tu ritmo.', 'Está bien. Hay muchas maneras de descubrir lo que disfrutas; sigue conversando en la plaza.'],
    notes: ['Me gusta imaginar y crear cosas nuevas.', 'A veces disfruto imaginar y crear; quiero seguir probando.', 'Por ahora prefiero explorar actividades distintas al arte.'],
    weights: [{ A: 3 }, { A: 1 }, {}],
  },
  ernesto: {
    question: 'Cada foto de este álbum guarda una historia de la plaza. ¿Qué te gustaría hacer con ellas?',
    choices: ['Ordenarlas y anotar sus fechas.', 'Investigar qué cambió con el tiempo.', 'Escuchar los recuerdos de los vecinos.'],
    reactions: ['Cuidar los detalles ayuda a que otras personas encuentren una historia.', 'Comparar las fotos puede despertar preguntas muy interesantes.', 'Escuchar a los demás también es una forma de conservar nuestra memoria.'],
    notes: ['Me interesó ordenar fotos y registrar detalles.', 'Me dio curiosidad investigar los cambios de la plaza.', 'Preferí escuchar las historias de otras personas.'],
    weights: [{ C: 3 }, { I: 3 }, { S: 3 }],
  },
  valeria: {
    question: 'En mi colegio estamos preparando una actividad para recibir a estudiantes nuevos. ¿Qué parte disfrutarías más?',
    choices: ['Escucharlos y acompañarlos.', 'Diseñar una bienvenida creativa.', 'Organizar los horarios y materiales.'],
    reactions: ['Hacer que alguien se sienta acompañado puede cambiar su primer día.', 'Tu imaginación puede darle una bienvenida muy personal al grupo.', 'Un plan claro ayuda a que todos encuentren su lugar.'],
    notes: ['Me interesó acompañar a estudiantes nuevos.', 'Quise diseñar una bienvenida creativa.', 'Preferí organizar horarios y materiales.'],
    weights: [{ S: 3 }, { A: 3 }, { C: 3 }],
  },
  luis: {
    question: 'Quiero mejorar mi puesto sin perder lo que más les gusta a los vecinos. ¿Qué te daría curiosidad probar?',
    choices: ['Preparar algo con mis propias manos.', 'Preguntar qué necesitan y proponer una idea.', 'Revisar qué se vende y organizar el trabajo.'],
    reactions: ['Probar y ajustar una receta permite aprender haciendo.', 'Escuchar y proponer puede ayudar a que una idea sea útil para otros.', 'Observar y organizar el trabajo ayuda a tomar decisiones con cuidado.'],
    notes: ['Me interesó crear un producto con mis manos.', 'Quise escuchar necesidades y proponer una idea para el puesto.', 'Preferí revisar información y organizar el trabajo.'],
    weights: [{ R: 3 }, { E: 2, S: 1 }, { C: 2, I: 1 }],
  },
  estudiantes: {
    question: 'Camila y Diego: queremos preparar un proyecto para la feria del colegio. ¿Qué te gustaría aportar al equipo?',
    choices: ['Construir y probar un prototipo.', 'Investigar cómo funciona y comparar ideas.', 'Coordinar al equipo y presentar el proyecto.'],
    reactions: ['¡Podemos aprender mucho poniendo una idea a prueba!', 'Tus preguntas pueden ayudarnos a entender mejor el reto.', 'Compartir las ideas y coordinar al equipo también es parte del proyecto.'],
    notes: ['Me interesó construir y probar un prototipo.', 'Preferí investigar y comparar ideas.', 'Quise coordinar y presentar un proyecto en equipo.'],
    weights: [{ R: 3 }, { I: 3 }, { E: 2, S: 1 }],
  },
};

export const rpgDialogues: Record<NarrativeNpcId, NarrativeConversation> = {
  mateo: {
    question: 'La muestra del colegio llegará a esta plaza. Tengo materiales para una sola propuesta de afiche: debe despertar curiosidad sin contarlo todo. ¿Qué parte te atrae más preparar?',
    choices: [
      'Crear una imagen que sorprenda y deje una pregunta abierta.',
      'Investigar una historia de la plaza y convertirla en una escena.',
      'Probar una maqueta con cartón y texturas antes de dibujar.',
    ],
    reactions: [
      'Probemos dos bocetos y elijamos qué detalle dejar sin explicar. Ganaremos sorpresa, aunque habrá que comprobar si se entiende la invitación.',
      'Busquemos un detalle con Don Ernesto. Tendremos una historia concreta; el reto será resumirla sin perder lo que la hace especial.',
      'Podemos probar relieves con el cartón que ya tenemos. Veremos cómo se siente la idea antes del afiche; después tocará simplificarla para reproducirla.',
    ],
    notes: [
      'En esta situación elegí crear una imagen que despertara curiosidad.',
      'En esta situación elegí investigar una historia antes de representarla.',
      'En esta situación elegí probar materiales para dar forma a una idea.',
    ],
    weights: [{ A: 3 }, { I: 2, A: 1 }, { R: 2, A: 1 }],
  },
  ernesto: {
    question: 'Quieren mostrar mis fotos en la feria, pero dos tienen fechas distintas escritas al dorso. Hoy solo puedo empezar una tarea. ¿Cuál te gustaría hacer conmigo?',
    choices: [
      'Crear un registro: qué sabemos y qué dato falta en cada foto.',
      'Comparar edificios y detalles para investigar cuándo se tomaron.',
      'Conversar con vecinos y recoger sus versiones de la historia.',
    ],
    reactions: [
      'Separaremos lo confirmado de lo pendiente. La colección quedará más clara, aunque algunas fechas seguirán abiertas hasta buscar más información.',
      'Miremos qué cambió entre las imágenes. Podremos proponer una explicación, pero anotaremos qué otra evidencia hace falta para sostenerla.',
      'Escuchemos a más de una persona y anotemos quién recuerda cada cosa. Si las versiones difieren, conservaremos la diferencia en vez de borrarla.',
    ],
    notes: [
      'En esta situación elegí organizar información y dejar visibles las dudas.',
      'En esta situación elegí comparar pistas para investigar una fecha.',
      'En esta situación elegí escuchar distintas memorias de la comunidad.',
    ],
    weights: [{ C: 3 }, { I: 3 }, { S: 3 }],
  },
  valeria: {
    question: 'Dos estudiantes nuevos quieren ir a la muestra, pero no conocen las aulas ni quieren hablar ante todo el grupo. Podemos preparar una ayuda primero. ¿Cuál te gustaría desarrollar?',
    choices: [
      'Conversar con ellos y acordar cómo prefieren participar.',
      'Diseñar una invitación visual con distintas formas de participar.',
      'Preparar un recorrido con horarios y puntos de encuentro claros.',
    ],
    reactions: [
      'Podremos ajustar el acompañamiento a lo que nos cuenten. Empezaremos con dos personas; luego veremos cómo ofrecer esa ayuda a más estudiantes.',
      'La invitación puede mostrar que observar, hacer preguntas o presentar son formas de participar. Después la probaremos con quienes aún no conocen el colegio.',
      'Un recorrido claro les permitirá organizarse. Dejemos también un espacio para preguntar: el plano no reemplaza lo que cada persona necesita.',
    ],
    notes: [
      'En esta situación elegí escuchar antes de proponer un acompañamiento.',
      'En esta situación elegí comunicar distintas maneras de participar.',
      'En esta situación elegí organizar una ruta que otras personas pudieran seguir.',
    ],
    weights: [{ S: 3 }, { A: 2, S: 1 }, { C: 2, S: 1 }],
  },
  luis: {
    question: 'Cuando termina la visita a la plaza, se forma cola y a veces sobra comida. Puedo probar un cambio pequeño esta tarde. ¿Qué parte te gustaría llevar?',
    choices: [
      'Armar y probar una bandeja para preparar pedidos por etapas.',
      'Proponer un pedido anticipado y conseguir voluntarios para probarlo.',
      'Registrar pedidos y sobrantes para ajustar las cantidades.',
    ],
    reactions: [
      'Usaremos los materiales del puesto y probaremos con una tanda. Podría hacer más cómodo el trabajo; habrá que observar si realmente cambia la espera.',
      'Haremos una prueba con pocas personas y explicaremos sus condiciones. No sabremos si funciona hasta escuchar también a quienes prefieren pedir al llegar.',
      'Anotaremos lo que pasa en cada tanda antes de cambiar las cantidades. Llevará registro, pero evitaremos decidir solo por la impresión de un día.',
    ],
    notes: [
      'En esta situación elegí construir y probar una mejora práctica.',
      'En esta situación elegí proponer una prueba y convocar participantes.',
      'En esta situación elegí registrar pedidos para planificar con información.',
    ],
    weights: [{ R: 3 }, { E: 2, S: 1 }, { C: 2, I: 1 }],
  },
  estudiantes: {
    question: 'Para la feria queremos reducir el agua que se pierde al regar el huerto escolar. La primera prueba será con materiales reutilizados. ¿Qué responsabilidad te gustaría asumir?',
    choices: [
      'Construir un modelo y ajustar cómo sale el agua.',
      'Comparar observaciones y decidir qué necesitamos medir.',
      'Acordar tareas y explicar la propuesta a quienes cuidan el huerto.',
    ],
    reactions: [
      'Empezaremos con un modelo pequeño que podamos modificar. Cada cambio tendrá que probarse; que se vea terminado no significa que ya funcione como esperamos.',
      'Elegiremos qué observar y cómo registrar una comparación. Quizá tardemos más en construir, pero podremos explicar mejor qué aprendimos de la prueba.',
      'Haremos espacio para escuchar a quienes usarían la idea y repartir el trabajo. Tendremos que ajustar el plan si sus necesidades cambian nuestra propuesta.',
    ],
    notes: [
      'En esta situación elegí construir y ajustar un modelo del equipo.',
      'En esta situación elegí comparar observaciones y planear qué medir.',
      'En esta situación elegí coordinar tareas y conversar con quienes usarían la idea.',
    ],
    weights: [{ R: 2, I: 1 }, { I: 2, C: 1 }, { E: 2, S: 1 }],
  },
};

const legacySchoolChoices: ThreeTexts = ['Cómo resolver problemas y experimentar.', 'Cómo crear y compartir mis ideas.', 'Cómo colaborar y ayudar a otras personas.'];
const legacySchoolReactions: ThreeTexts = ['Observar y probar puede ayudarte a descubrir lo que despierta tu curiosidad. Arriba puedes explorar el pasillo.', 'Crear también es una forma de aprender. Explora el patio y observa los espacios donde te gustaría trabajar.', 'Escuchar y colaborar son parte de la vida del colegio. Puedes recorrerlo a tu ritmo y volver a conversar conmigo.'];
const legacySchoolNotes: ThreeTexts = ['Quise resolver problemas y experimentar.', 'Quise crear y compartir mis ideas.', 'Quise colaborar y ayudar a otras personas.'];
const noWeights = [{}, {}, {}] as const;
export const legacySchoolDialogues: Record<SchoolDialogueId, NarrativeConversation> = {
  elena: {
    question: '¡Bienvenido al colegio! Puedes recorrer el patio y subir por la escalera de la derecha. ¿Qué te gustaría descubrir aquí?',
    choices: legacySchoolChoices, reactions: legacySchoolReactions, notes: legacySchoolNotes, weights: noWeights,
  },
  sofia: {
    question: 'Estamos organizando una actividad escolar. ¿Qué te gustaría aportar al equipo?',
    choices: legacySchoolChoices, reactions: legacySchoolReactions, notes: legacySchoolNotes, weights: noWeights,
  },
};

export const schoolDialogues: Record<SchoolDialogueId, NarrativeConversation> = {
  elena: {
    question: 'La feria empieza con pruebas en las aulas, no con una carrera elegida. Puedes necesitar ayuda y aun así disfrutar una tarea. ¿Qué te gustaría descubrir durante el recorrido?',
    choices: [
      'Qué actividad me da curiosidad aunque todavía no sepa hacerla.',
      'Qué disfruto más al volver a intentar algo que ya conozco.',
      'Qué tareas me interesa compartir con otras personas.',
    ],
    reactions: [
      'Guarda esa pregunta para comparar las tres aulas. Sube por la escalera derecha y pulsa E en una puerta: no necesitas experiencia para comenzar.',
      'Puedes mirar qué cambia cuando pruebas de otra manera. Arriba están las tres aulas; al terminar cada actividad podrás contar si quieres seguir explorándola.',
      'Observa qué parte querrías hacer con alguien y cuál prefieres probar a tu ritmo. Las aulas están en el segundo piso, por la escalera derecha.',
    ],
    notes: [
      'Para este recorrido elegí explorar algo nuevo sin exigir saber hacerlo antes.',
      'Para este recorrido elegí observar qué me interesa al volver a intentar una tarea.',
      'Para este recorrido elegí observar qué tareas me interesa compartir.',
    ],
    weights: noWeights,
  },
  sofia: {
    question: 'Las aulas quieren compartir sus proyectos en una sola tarde. El espacio es pequeño y algunas personas solo podrán venir un rato. ¿Qué parte de la organización te gustaría asumir?',
    choices: [
      'Acordar con cada grupo qué mostrar y repartir turnos.',
      'Probar un recorrido breve con quienes visitarán la muestra.',
      'Preparar una guía visual para explorar sin seguir un único orden.',
    ],
    reactions: [
      'Armaremos un primer acuerdo y dejaremos margen para cambios. Repartir turnos implica escuchar qué necesita cada grupo, no solo llenar una lista.',
      'Haremos una visita de prueba y recogeremos qué quedó confuso. No veremos todo con cada persona, así que habrá que elegir qué conservar en el recorrido.',
      'La guía dará libertad para elegir aulas. Después comprobaremos si sus señales se entienden sin que alguien tenga que explicarlas.',
    ],
    notes: [
      'En esta situación elegí coordinar acuerdos y turnos entre grupos.',
      'En esta situación elegí probar un recorrido con sus posibles visitantes.',
      'En esta situación elegí diseñar una guía con distintas rutas posibles.',
    ],
    weights: noWeights,
  },
};

export function getPlazaDialogue(id: NarrativeNpcId, version: NarrativeContentVersion = CURRENT_NARRATIVE_VERSION): NarrativeConversation {
  return (version === 'legacy-v1' ? legacyRpgDialogues : rpgDialogues)[id];
}

export function getSchoolDialogue(id: SchoolDialogueId, version: NarrativeContentVersion = CURRENT_NARRATIVE_VERSION): NarrativeConversation {
  return (version === 'legacy-v1' ? legacySchoolDialogues : schoolDialogues)[id];
}
