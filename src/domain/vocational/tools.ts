import { z } from 'zod';
import { Type, FunctionDeclaration } from '@google/genai';

// Usaremos la definición nativa de genai de Google

export const getCareerDetailsTool: FunctionDeclaration = {
  name: 'getCareerDetails',
  description: 'Obtiene detalles específicos de una carrera (malla curricular, facultad, descripción) dado su slug (identificador).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      careerSlug: {
        type: Type.STRING,
        description: 'El identificador único de la carrera (ej. "ingenieria-de-software", "arquitectura").',
      },
    },
    required: ['careerSlug'],
  },
};

export const compareCareersTool: FunctionDeclaration = {
  name: 'compareCareers',
  description: 'Compara dos o más carreras destacando sus diferencias principales, similitudes y enfoques profesionales.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      careerSlugs: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Arreglo de slugs de las carreras a comparar.',
      },
    },
    required: ['careerSlugs'],
  },
};

export const getTuitionAndScholarshipsTool: FunctionDeclaration = {
  name: 'getTuitionAndScholarships',
  description: 'Consulta los costos (pensiones), escalas de pago y becas disponibles para una carrera en un campus específico.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      careerSlug: {
        type: Type.STRING,
        description: 'Identificador de la carrera.',
      },
      campusId: {
        type: Type.STRING,
        description: 'Identificador del campus (ej. "san-miguel", "monterrico", "villa", "san-isidro").',
      },
    },
    required: ['careerSlug', 'campusId'],
  },
};

export const getCampusInfoTool: FunctionDeclaration = {
  name: 'getCampusInfo',
  description: 'Devuelve información sobre un campus, y si se proporciona el colegio de origen, evalúa distancias o beneficios específicos de ese colegio.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      campusId: {
        type: Type.STRING,
        description: 'Identificador del campus.',
      },
      schoolOriginId: {
        type: Type.STRING,
        description: 'ID opcional del colegio de origen del alumno.',
      },
    },
    required: ['campusId'],
  },
};

export const vocationalChatTools = [
  getCareerDetailsTool,
  compareCareersTool,
  getTuitionAndScholarshipsTool,
  getCampusInfoTool
];
