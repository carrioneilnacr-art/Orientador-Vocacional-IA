import { NextRequest, NextResponse } from 'next/server';
import { AnswerVocationalChatUseCase, IChatDataRepository } from '../../../application/use-cases/answerVocationalChatUseCase';

// MOCK Data Repo (hasta que la BD esté conectada por el Agente 1)
const mockDataRepo: IChatDataRepository = {
  async getCareerDetails(slug: string) {
    if (slug === 'ingenieria-de-software') {
      return { 
        name: 'Ingeniería de Software', 
        faculty: 'Ingeniería', 
        description: 'Construye el futuro digital con arquitectura de software.',
        courses: ['Programación', 'Bases de Datos', 'Arquitectura de Software'] 
      };
    }
    return { name: slug, description: 'Información general de la carrera.' };
  },
  async compareCareers(slugs: string[]) {
    return { 
      comparison: `Comparación entre ${slugs.join(' y ')}.`,
      differences: 'Una se enfoca en hardware, otra en software puramente.' 
    };
  },
  async getTuition(slug: string, campus: string) {
    return { 
      career: slug, 
      campus: campus, 
      scales: [
        { scale: 'T', price: 1600 },
        { scale: 'U', price: 1900 },
        { scale: 'V', price: 2300 }
      ],
      scholarships: ['Beca Honor', 'Beca Deportiva'] 
    };
  },
  async getCampusInfo(campus: string, schoolId?: string) {
    return { 
      campus: campus, 
      location: 'Av. La Marina 2810, San Miguel',
      features: ['Laboratorios Apple', 'Biblioteca moderna']
    };
  }
};

const chatUseCase = new AnswerVocationalChatUseCase(mockDataRepo);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const reply = await chatUseCase.execute(history, message);
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
