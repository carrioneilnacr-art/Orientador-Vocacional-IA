import { plazaPoint } from './plazaLayout';
import scene from './plaza-reference.json';

export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type RiasecWeights = Partial<Record<RiasecDimension, number>>;
export type PlazaChoiceIcon = 'wrench' | 'search' | 'brush' | 'heart' | 'briefcase' | 'archive' | 'gear';

interface PlazaNpcDefinition {
  id: string; name: string; role: string; dimension: RiasecDimension;
  sprite: string; icon: 'wrench' | 'search' | 'brush' | 'heart' | 'briefcase' | 'archive';
  x: number; y: number; color: string; question: string;
  choices: readonly [string, string, string];
  choiceIcons: readonly [PlazaChoiceIcon, PlazaChoiceIcon, PlazaChoiceIcon];
  reactions: readonly [string, string, string];
  notes: readonly [string, string, string];
  weights: readonly [RiasecWeights, RiasecWeights, RiasecWeights];
}

// Narrative exploration only. These weights are design rules, not a validated assessment.
export const plazaNpcs = [
  {
    id: 'tecnico', name: 'Luis', role: 'Técnico del Metropolitano', dimension: 'R',
    sprite: 'tecnico', icon: 'wrench', ...plazaPoint(scene.npcs.tecnico[0], scene.npcs.tecnico[1]), color: '#b99c61',
    question: 'Este indicador de la puerta dejó de encender. Con el bus detenido y el equipo a salvo, ¿qué parte del trabajo te gustaría conocer?',
    choices: ['Probar una pieza y observar qué cambia.', 'Revisar el registro de fallas anteriores.', 'Explicar al equipo lo que vamos descubriendo.'],
    choiceIcons: ['wrench', 'archive', 'heart'],
    reactions: ['Observar lo que pasa al probar una pieza ayuda a entender el mecanismo.', 'Un registro ordenado puede revelar detalles que antes pasaron desapercibidos.', 'Compartir lo que encontramos ayuda a que todos trabajemos coordinados.'],
    notes: ['Me dio curiosidad probar mecanismos y observar sus cambios.', 'Me interesó organizar y revisar registros de fallas.', 'Me interesó explicar hallazgos y colaborar con un equipo.'],
    weights: [{ R: 3, I: 1 }, { C: 3, I: 1 }, { S: 2, E: 1 }],
  },
  {
    id: 'inventor', name: 'Nayra', role: 'Inventora de la plaza', dimension: 'I',
    sprite: 'inventor', icon: 'search', ...plazaPoint(scene.npcs.inventor[0], scene.npcs.inventor[1]), color: '#d6864f',
    question: 'Mi robot ordena las piezas por color, pero hoy se volvió loco. ¿Cómo lo resolverías?',
    choices: ['Revisaría los cables y probaría una pieza a la vez.', 'Diseñaría otra forma creativa de usar el robot.', 'Le preguntaría a las personas qué problema necesitan resolver.'],
    choiceIcons: ['wrench', 'search', 'brush'],
    reactions: ['Me gusta esa idea de observar una cosa a la vez. Podemos comparar lo que cambia.', '¡Podríamos descubrir un uso que todavía no imaginamos! Quiero escuchar tu propuesta.', 'Conocer lo que las personas necesitan puede darle un nuevo propósito al robot.'],
    notes: ['Con Nayra elegí probar piezas y buscar la causa del problema.', 'Con Nayra imaginé un uso creativo para un robot.', 'Con Nayra preferí escuchar necesidades antes de proponer una solución.'],
    weights: [{ R: 2, I: 2 }, { A: 3 }, { S: 2, E: 1 }],
  },
  {
    id: 'artista', name: 'Luna', role: 'Artista del caballete', dimension: 'A',
    sprite: 'artista', icon: 'brush', ...plazaPoint(scene.npcs.artista[0], scene.npcs.artista[1]), color: '#ad6379',
    question: 'Quiero pintar una historia de esta plaza. ¿Por dónde te gustaría empezar?',
    choices: ['Experimentaría con colores y formas.', 'Investigaría qué cambió en la plaza con el tiempo.', 'Invitaría a los vecinos a contar sus historias.'],
    choiceIcons: ['brush', 'search', 'heart'],
    reactions: ['Cada combinación puede expresar algo distinto. Podemos probar sin buscar una única respuesta.', 'Las pistas del pasado pueden transformar lo que vemos hoy.', 'Escuchar otras voces puede convertir una pintura en una historia compartida.'],
    notes: ['Me interesó experimentar visualmente con colores y formas.', 'Me dio curiosidad investigar la historia antes de crear.', 'Me interesó escuchar a los vecinos para construir una historia.'],
    weights: [{ A: 3 }, { I: 2, C: 1 }, { S: 3 }],
  },
  {
    id: 'guia', name: 'Valeria', role: 'Guía y voluntaria', dimension: 'S',
    sprite: 'guia', icon: 'heart', ...plazaPoint(scene.npcs.guia[0], scene.npcs.guia[1]), color: '#9c7154',
    question: 'Un grupo llega por primera vez y quiere conocer los trabajos de la plaza. ¿Qué te gustaría aportar?',
    choices: ['Escuchar qué les interesa y acompañarlos.', 'Proponer una ruta y animar al grupo a participar.', 'Preparar un mapa claro con los puntos de encuentro.'],
    choiceIcons: ['heart', 'briefcase', 'archive'],
    reactions: ['Una buena conversación puede ayudar a que cada persona encuentre su propia pregunta.', 'Tu iniciativa puede dar al grupo un punto de partida compartido.', 'Un mapa claro ayuda a que todas las personas puedan orientarse.'],
    notes: ['Preferí escuchar intereses y acompañar a otras personas.', 'Me interesó proponer una ruta y movilizar a un grupo.', 'Me interesó organizar información para orientar a otras personas.'],
    weights: [{ S: 3 }, { E: 3, S: 1 }, { C: 2, A: 1 }],
  },
  {
    id: 'emprendedor', name: 'Mateo', role: 'Estudiantes del proyecto', dimension: 'E',
    sprite: 'estudiantes', icon: 'briefcase', ...plazaPoint(scene.npcs.emprendedor[0], scene.npcs.emprendedor[1]), color: '#c68a4e',
    question: 'Estamos preparando un proyecto para la feria del colegio. ¿Qué parte disfrutarías más?',
    choices: ['Resolver el reto práctico.', 'Crear la presentación visual.', 'Organizar y coordinar al equipo.'],
    choiceIcons: ['wrench', 'brush', 'briefcase'],
    reactions: ['Poner una idea a prueba puede ayudarnos a descubrir si funciona en la práctica.', 'Una presentación puede hacer que otras personas comprendan y conecten con una idea.', 'Coordinar al equipo ayuda a que las ideas de cada persona tengan un lugar.'],
    notes: ['Me interesó resolver un reto práctico dentro de un proyecto.', 'Me interesó crear una presentación para comunicar una idea.', 'Me interesó organizar a un equipo para hacer avanzar un proyecto.'],
    weights: [{ R: 2, I: 1 }, { A: 2, E: 1 }, { E: 3, S: 1 }],
  },
  {
    id: 'vecino', name: 'Don Julián', role: 'Vecino archivista', dimension: 'C',
    sprite: 'vecino', icon: 'archive', ...plazaPoint(scene.npcs.vecino[0], scene.npcs.vecino[1]), color: '#75867c',
    question: 'Tengo fotos de muchas épocas mezcladas en este álbum. ¿Qué te gustaría hacer con ellas?',
    choices: ['Ordenarlas por fecha y registrar datos.', 'Compararlas para investigar cambios.', 'Reunir vecinos y escuchar recuerdos.'],
    choiceIcons: ['archive', 'search', 'heart'],
    reactions: ['Cada dato bien registrado puede ayudar a otra persona a encontrar una historia.', 'Comparar detalles puede abrir preguntas que todavía no nos habíamos hecho.', 'Los recuerdos de otras personas dan vida a las fotos que conservamos.'],
    notes: ['Me interesó clasificar fotos y registrar información con cuidado.', 'Me interesó comparar evidencias e investigar cambios del barrio.', 'Me interesó reunir personas y escuchar la memoria de la comunidad.'],
    weights: [{ C: 3 }, { I: 3 }, { S: 3 }],
  },
] as const satisfies readonly PlazaNpcDefinition[];

export type PlazaNpcId = typeof plazaNpcs[number]['id'];

export function plazaNpcSpritePath(npc: (typeof plazaNpcs)[number]): string {
  const files = { artista: 'artista', vecino: 'vecino', emprendedor: 'estudiantes', guia: 'guia', inventor: 'inventor', tecnico: 'tecnico' };
  return `/game/plaza-lima/fiel/${files[npc.id]}.png`;
}
