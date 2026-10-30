import { z } from 'zod';

export const missions = [
  { id: 'inventos', title: 'Enciende las ideas', place: 'Taller de inventos', person: 'Inti', role: 'Inventor del barrio', verb: 'Construir', color: '#f9bf69', description: 'La feria necesita luz. Arma una pequeña fuente de energía y haz brillar la plaza.', prompt: 'Prueba cómo conectar la energía. Activa las tres piezas para encender el farol.', actions: ['Fuente de energía', 'Cable conductor', 'Farol de la plaza'], discovery: 'Experimentar y construir soluciones', reflection: '¿Te gustaría seguir construyendo y probando cómo funcionan las cosas?' },
  { id: 'mural', title: 'Dale color al encuentro', place: 'Estudio del mural', person: 'Luna', role: 'Artista de la feria', verb: 'Crear', color: '#e7a4ce', description: 'Una pared vacía puede contar muchas historias. Crea la bienvenida de la feria con formas y colores.', prompt: 'Compón tu mural. Prueba los tres elementos; puedes cambiarlos cuantas veces quieras.', actions: ['Cambiar el cielo', 'Cambiar las montañas', 'Cambiar el símbolo'], discovery: 'Imaginar y expresarte visualmente', reflection: '¿Te gustaría seguir creando imágenes e historias propias?' },
  { id: 'comunidad', title: 'Haz que todos participen', place: 'Casa del encuentro', person: 'Mara', role: 'Coordinadora de la feria', verb: 'Conectar', color: '#9edcc3', description: 'Hay vecinos que quieren participar, pero no saben cómo. Ayúdalos a encontrar su lugar.', prompt: 'Conoce al equipo y elige cómo ayudar. Explora las tres conversaciones.', actions: ['Escuchar a quien llega', 'Invitar al equipo a colaborar', 'Organizar un punto de encuentro'], discovery: 'Escuchar, colaborar y organizar en equipo', reflection: '¿Te gustaría seguir ayudando a personas y coordinando ideas con otros?' },
  { id: 'observatorio', title: 'Sigue la pista del agua', place: 'Mirador de las pistas', person: 'Sol', role: 'Exploradora del valle', verb: 'Investigar', color: '#9bc8f0', description: 'El jardín de la feria se está secando. Observa el valle y descubre qué podría estar pasando.', prompt: 'Reúne evidencia antes de decidir. Examina las tres pistas del jardín.', actions: ['Observar la tierra', 'Revisar el canal', 'Comparar las hojas'], discovery: 'Observar, hacer preguntas y buscar evidencias', reflection: '¿Te gustaría seguir investigando y comparando explicaciones?' },
] as const;

export type Mission = typeof missions[number];
export type MissionId = Mission['id'];
export const reflectionLabels = { yes: 'Quiero explorar más', maybe: 'Todavía no lo sé', no: 'Prefiero probar otra cosa' } as const;
const missionId = z.enum(['inventos', 'mural', 'comunidad', 'observatorio']);
export const progressSchema = z.object({
  version: z.literal(1),
  started: z.boolean(),
  reducedMotion: z.boolean(),
  decisions: z.array(z.object({ missionId, preference: z.enum(['yes', 'maybe', 'no']) })).max(4),
}).refine(value => new Set(value.decisions.map(d => d.missionId)).size === value.decisions.length);
export type Progress = z.infer<typeof progressSchema>;
export const initialProgress: Progress = { version: 1, started: false, reducedMotion: false, decisions: [] };
export const SAVE_KEY = 'chaski-adventure-v1';
export function readProgress(raw: string | null): Progress {
  if (!raw || raw.length > 10000) return { ...initialProgress, decisions: [] };
  try { const result = progressSchema.safeParse(JSON.parse(raw)); return result.success ? result.data : { ...initialProgress, decisions: [] }; }
  catch { return { ...initialProgress, decisions: [] }; }
}
export function recordPreference(progress: Progress, id: MissionId, preference: Progress['decisions'][number]['preference']): Progress {
  return { ...progress, decisions: [...progress.decisions.filter(d => d.missionId !== id), { missionId: id, preference }] };
}
