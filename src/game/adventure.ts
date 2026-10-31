import { z } from 'zod';
import { plazaNpcs, type PlazaNpcId, type RiasecDimension, type RiasecWeights } from './plazaNpcs';

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
  npcDecisions: z.array(z.object({ npcId: z.enum(['tecnico', 'inventor', 'artista', 'vecino', 'emprendedor', 'guia']), choice: z.number().int().min(0).max(2), evidenceVersion: z.literal(1).optional(), note: z.string().max(240).optional() })).max(6).default([]),
}).refine(value => new Set(value.decisions.map(d => d.missionId)).size === value.decisions.length && new Set(value.npcDecisions.map(d => d.npcId)).size === value.npcDecisions.length);
export type Progress = z.infer<typeof progressSchema>;
export const initialProgress: Progress = { version: 1, started: false, reducedMotion: false, decisions: [], npcDecisions: [] };
export const SAVE_KEY = 'chaski-adventure-v1';
export function readProgress(raw: string | null): Progress {
  if (!raw || raw.length > 10000) return { ...initialProgress, decisions: [] };
  try {
    const value: unknown = JSON.parse(raw);
    if (value && typeof value === 'object' && 'npcDecisions' in value && Array.isArray(value.npcDecisions)) {
      value.npcDecisions = value.npcDecisions.map((entry: unknown) => {
        if (!entry || typeof entry !== 'object' || !('npcId' in entry)) return entry;
        return entry.npcId === 'estudiantes' ? { ...entry, npcId: 'emprendedor' } : entry;
      });
    }
    const result = progressSchema.safeParse(value);
    if (!result.success) return { ...initialProgress, decisions: [], npcDecisions: [] };
    return { ...result.data, npcDecisions: result.data.npcDecisions.map(entry => ({ ...entry, note: entry.evidenceVersion === 1 ? getNpcJournalNote(entry.npcId, entry.choice) : legacyNote(entry.npcId, entry.choice) })) };
  }
  catch { return { ...initialProgress, decisions: [] }; }
}
export function recordPreference(progress: Progress, id: MissionId, preference: Progress['decisions'][number]['preference']): Progress {
  return { ...progress, decisions: [...progress.decisions.filter(d => d.missionId !== id), { missionId: id, preference }] };
}
export function recordNpcChoice(progress: Progress, npcId: PlazaNpcId, choice: number): Progress {
  if (!plazaNpcs.some(npc => npc.id === npcId) || !Number.isInteger(choice) || choice < 0 || choice > 2) return progress;
  return { ...progress, npcDecisions: [...progress.npcDecisions.filter(entry => entry.npcId !== npcId), { npcId, choice, evidenceVersion: 1, note: getNpcJournalNote(npcId, choice) }] };
}

const legacyChoices: Partial<Record<PlazaNpcId, readonly string[]>> = {
  inventor: ['Construir un prototipo', 'Entender cómo funciona', 'Escuchar otras ideas'],
  artista: ['Dibujarla', 'Diseñar una experiencia', 'Conversar con su gente'],
  vecino: ['Investigar su historia', 'Conservar sus lugares', 'Escuchar los recuerdos'],
  emprendedor: ['Resolver el reto', 'Crear la presentación', 'Organizar al equipo'],
  guia: ['Tecnología y ciencia', 'Arte y comunicación', 'Comunidad y servicio'],
};
function legacyNote(npcId: PlazaNpcId, choice: number): string {
  return `De mi exploración anterior: ${legacyChoices[npcId]?.[choice] ?? 'una conversación en la plaza'}.`;
}
export function getNpcJournalNote(npcId: PlazaNpcId, choice: number): string {
  return plazaNpcs.find(npc => npc.id === npcId)?.notes[choice] ?? '';
}
/** Derive private design weights from the latest versioned choice, never from saved totals. */
export function getPlazaRiasec(progress: Progress): Record<RiasecDimension, number> {
  const totals: Record<RiasecDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const latest = new Map(progress.npcDecisions.map(entry => [entry.npcId, entry]));
  for (const entry of latest.values()) {
    if (entry.evidenceVersion !== 1) continue;
    const weights: RiasecWeights | undefined = plazaNpcs.find(npc => npc.id === entry.npcId)?.weights[entry.choice];
    if (!weights) continue;
    for (const dimension of Object.keys(totals) as RiasecDimension[]) totals[dimension] += weights[dimension] ?? 0;
  }
  return totals;
}
export function isPlazaComplete(progress: Progress): boolean {
  return plazaNpcs.every(npc => progress.npcDecisions.some(entry => entry.npcId === npc.id && entry.evidenceVersion === 1));
}
