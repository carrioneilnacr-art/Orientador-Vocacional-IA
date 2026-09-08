import { NextRequest, NextResponse } from 'next/server';
import { CalculateProfileUseCase } from '@/application/use-cases/calculateProfileUseCase';
import { CareerProfile } from '@/domain/vocational/scoring';

// MOCK Repository para Fase 3 (luego Agente 1 inyectará Drizzle DB)
const mockCareers: CareerProfile[] = [
  { id: '1', slug: 'ingenieria-de-software', name: 'Ingeniería de Software', weights: { R: 0, I: 0.8, A: 0, S: 0, E: 0.2, C: 0, T: 1, M: 0.9 } },
  { id: '2', slug: 'ciencias-de-la-computacion', name: 'Ciencias de la Computación', weights: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0, T: 1, M: 1 } },
  { id: '3', slug: 'diseno-grafico', name: 'Diseño Gráfico', weights: { R: 0, I: 0, A: 1, S: 0.5, E: 0, C: 0, T: 0.5, M: 0 } },
  { id: '4', slug: 'psicologia', name: 'Psicología', weights: { R: 0, I: 0.5, A: 0, S: 1, E: 0, C: 0, T: 0, M: 0 } },
  { id: '5', slug: 'administracion', name: 'Administración y Negocios', weights: { R: 0, I: 0, A: 0, S: 0.8, E: 1, C: 0.8, T: 0.2, M: 0.5 } }
];

const mockCareerRepo = {
  async getAllCareerProfiles() {
    return mockCareers;
  }
};

const calculateUseCase = new CalculateProfileUseCase(mockCareerRepo);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const responses = body.responses; // Record<string, number>

    if (!responses) {
      return NextResponse.json({ error: 'Faltan las respuestas del cuestionario' }, { status: 400 });
    }

    const result = await calculateUseCase.execute(responses);
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
