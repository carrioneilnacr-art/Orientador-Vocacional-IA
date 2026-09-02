import { GoogleGenAI, Content, Part } from '@google/genai';
import { vocationalChatTools } from '../../domain/vocational/tools';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Interfaces para inyectar dependencias de datos (mocks en Phase 3, luego base de datos real)
export interface IChatDataRepository {
  getCareerDetails(slug: string): Promise<any>;
  compareCareers(slugs: string[]): Promise<any>;
  getTuition(slug: string, campus: string): Promise<any>;
  getCampusInfo(campus: string, schoolId?: string): Promise<any>;
}

export class AnswerVocationalChatUseCase {
  constructor(private dataRepo: IChatDataRepository) {}

  async execute(history: Content[], newMessage: string): Promise<string> {
    const SYSTEM_INSTRUCTION = `
Eres un orientador vocacional experto de la UPC (Universidad Peruana de Ciencias Aplicadas).
Tu objetivo es ayudar a los postulantes a resolver dudas sobre carreras, costos, mallas curriculares y sedes.
REGLAS ESTRICTAS:
1. NUNCA inventes costos, pensiones, becas o mallas curriculares de memoria. SIEMPRE usa las herramientas proporcionadas (getCareerDetails, getTuitionAndScholarships, etc.) para consultar los datos exactos.
2. Si un usuario te pregunta por algo y no tienes el dato tras usar la herramienta, di honestamente que no cuentas con esa información en este momento.
3. Sé empático, motivador y directo.
`;

    // 1. Añadir nuevo mensaje al historial (como usuario)
    const currentHistory = [...history];
    currentHistory.push({ role: 'user', parts: [{ text: newMessage }] });

    let finalResponseText = '';
    
    // Bucle para manejar function calling
    let isFunctionCalling = true;
    while (isFunctionCalling) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: currentHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: vocationalChatTools }],
          temperature: 0.2, // Baja temperatura para respuestas consistentes
        }
      });

      const responseMessage = response.candidates?.[0]?.content;
      if (!responseMessage) {
        throw new Error("No response from AI");
      }
      
      currentHistory.push(responseMessage); // Agregamos la respuesta del asistente (que puede ser llamada a función o texto)

      const functionCalls = responseMessage.parts?.filter(p => p.functionCall);
      
      if (functionCalls && functionCalls.length > 0) {
        // Manejar cada function call
        const functionResponsesParts: Part[] = [];
        
        for (const call of functionCalls) {
          const name = call.functionCall!.name;
          const args = call.functionCall!.args as any;
          let resultData: any = {};
          
          try {
            if (name === 'getCareerDetails') {
              resultData = await this.dataRepo.getCareerDetails(args.careerSlug);
            } else if (name === 'compareCareers') {
              resultData = await this.dataRepo.compareCareers(args.careerSlugs);
            } else if (name === 'getTuitionAndScholarships') {
              resultData = await this.dataRepo.getTuition(args.careerSlug, args.campusId);
            } else if (name === 'getCampusInfo') {
              resultData = await this.dataRepo.getCampusInfo(args.campusId, args.schoolOriginId);
            } else {
              resultData = { error: 'Function not implemented' };
            }
          } catch (e: any) {
            resultData = { error: e.message };
          }
          
          functionResponsesParts.push({
            functionResponse: {
              name: name!,
              response: { result: resultData }
            }
          });
        }
        
        // Agregamos el resultado de la función al historial simulando que viene del 'user' o 'tool'
        currentHistory.push({ role: 'user', parts: functionResponsesParts });
        
      } else {
        // Si no hay llamadas a función, hemos terminado
        isFunctionCalling = false;
        finalResponseText = responseMessage.parts?.[0]?.text || '';
      }
    }

    return finalResponseText;
  }
}
