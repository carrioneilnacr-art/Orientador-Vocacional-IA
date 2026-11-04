import {z} from 'zod';
import {gameContextSchema} from './gameContext';

export const chatRequestSchema=z.object({
 messages:z.array(z.object({role:z.enum(['user','assistant']),content:z.string().min(1).max(6000)}).strict()).min(1).max(30),
 profileContext:z.string().max(1500).optional(),
 gameContext:gameContextSchema.optional(),
}).strict().refine(value=>value.messages[value.messages.length-1].role==='user','El último mensaje debe ser del usuario.');
