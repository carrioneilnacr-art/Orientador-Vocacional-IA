import { createOpenAI, openai } from '@ai-sdk/openai';
import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { checkRateLimit } from '@/lib/rateLimit';

export const maxDuration = 30;

import {fetchCareerContext} from '@/modules/chaski-ai/infrastructure/careerContext';
import {buildChaskiPrompt} from '@/modules/chaski-ai/application/buildPrompt';
import {chatRequestSchema} from '@/modules/chaski-ai/domain/chatRequest';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.retryAfter),
        },
      });
    }

    if (Number(req.headers.get('content-length')||0)>200000) return Response.json({error:'Solicitud demasiado grande.'},{status:413});
    let body:unknown;
    try {body=await req.json();} catch {return Response.json({error:'JSON inválido.'},{status:400});}
    const parsed=chatRequestSchema.safeParse(body);
    if(!parsed.success)return Response.json({error:'Mensajes inválidos o demasiado extensos.'},{status:400});
    const {messages}=parsed.data;
    const lastUserMsg=messages[messages.length-1];
    const careerContext=await fetchCareerContext(lastUserMsg.content);
    const systemPrompt=buildChaskiPrompt(careerContext);

    // 3. Selección y conmutación inteligente de modelo (Gemini / OpenAI)
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const customGoogle = geminiKey ? createGoogleGenerativeAI({ apiKey: geminiKey }) : google;
    const customOpenAI = openaiKey ? createOpenAI({ apiKey: openaiKey }) : openai;

    // Se prefiere Gemini si la clave está disponible o si no se ha definido OpenAI
    const preferGemini = process.env.AI_PROVIDER === 'gemini' || !!geminiKey || !openaiKey;

    let result;
    try {
      if (preferGemini) {
        result = streamText({
          model: customGoogle('gemini-2.0-flash'),
          messages,
          system: systemPrompt,
          temperature: 0.2,
        });
      } else {
        result = streamText({
          model: customOpenAI('gpt-4o-mini'),
          messages,
          system: systemPrompt,
          temperature: 0.2,
        });
      }
    } catch (modelErr) {
      console.warn('[Chat AI] Fallback a modelo secundario debido a:', modelErr);
      try {
        const fallbackModel = preferGemini ? customOpenAI('gpt-4o-mini') : customGoogle('gemini-1.5-flash');
        result = streamText({
          model: fallbackModel,
          messages,
          system: systemPrompt,
          temperature: 0.2,
        });
      } catch (finalErr) {
        console.warn('[Chat AI] Fallback final a gemini-1.5-flash:', finalErr);
        result = streamText({
          model: customGoogle('gemini-1.5-flash'),
          messages,
          system: systemPrompt,
          temperature: 0.2,
        });
      }
    }

    return result.toUIMessageStreamResponse();

  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Error desconocido';
    console.error('[Chat API Error]', errorMsg);
    return new Response(JSON.stringify({ error: 'No se pudo completar la conversación. Inténtalo nuevamente.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
