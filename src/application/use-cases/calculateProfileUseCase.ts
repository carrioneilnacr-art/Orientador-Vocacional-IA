import { UserProfile, findTopCareers, MatchResult, CareerProfile } from '../../domain/vocational/scoring';

// Interfaz para la dependencia de la base de datos de carreras
export interface ICareerRepository {
  getAllCareerProfiles(): Promise<CareerProfile[]>;
}

export class CalculateProfileUseCase {
  constructor(private careerRepository: ICareerRepository) {}

  async execute(responses: Record<string, number>): Promise<{ profile: UserProfile, recommendations: MatchResult[] }> {
    // 1. Map question responses to dimension scores
    // En un caso real, cada pregunta tiene un peso por dimensión. 
    // Aquí simularemos la suma de puntajes por dimensión de las respuestas.
    const userProfile: UserProfile = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0, T: 0, M: 0
    };
    
    // Suponemos que cada llave en `responses` tiene el formato "DIM_preguntaID", ej "R_1", "T_4".
    for (const [key, value] of Object.entries(responses)) {
      const dimensionMatch = key.split('_')[0];
      if (['R', 'I', 'A', 'S', 'E', 'C', 'T', 'M'].includes(dimensionMatch)) {
        userProfile[dimensionMatch as keyof UserProfile] += value;
      }
    }
    
    // 2. Obtener las carreras disponibles
    const careers = await this.careerRepository.getAllCareerProfiles();
    
    // 3. Calcular similitud y recomendar top 3
    const recommendations = findTopCareers(userProfile, careers, 3);
    
    return { profile: userProfile, recommendations };
  }
}
