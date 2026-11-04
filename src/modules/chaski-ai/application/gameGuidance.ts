import type {GameContext} from '../domain/gameContext';
import {getPlazaDialogue,getSchoolDialogue} from '@/modules/adventure/domain/narrativeContent';

export type SavedChatEvidence={status:'saved';savedAt:string;notes:{label:string;text:string}[]}|{status:'absent'|'restricted'};
const names={mateo:'Mateo',ernesto:'Don Ernesto',valeria:'Valeria',luis:'Don Luis',estudiantes:'Camila y Diego',elena:'Elena',sofia:'Sofía'};
const rooms={laboratorio:'Laboratorio de Ciencias',taller:'Taller Creativo',tecnologia:'Aula Tecnológica'};
const preferences={more:'Quiere seguir explorando esta actividad.',unsure:'Todavía está descubriendo si le interesa.',other:'Prefiere probar otras actividades.'};

/** Authored game navigation is not an official academic/career data source. */
export function buildGameGuidance(context:GameContext|undefined,saved:SavedChatEvidence|undefined):string{
 if(!context&&!saved)return '';
 const sections=[`GUÍA EDITORIAL DEL JUEGO (reglas del producto; no datos de carreras):
El recorrido implementado tiene Plaza de Lima y colegio. En la plaza se puede conversar con Mateo, Don Ernesto, Valeria, Don Luis, Camila y Diego. Acércate con WASD o flechas y pulsa E. Tras las cinco conversaciones se habilita el viaje al colegio mediante el Metropolitano.
En el colegio Elena orienta en el patio; la escalera derecha permite acceder a la planta superior, donde está Sofía. Pulsa E cerca de las puertas para explorar Laboratorio de Ciencias, Taller Creativo y Aula Tecnológica. En cada actividad puedes probar y expresar tu preferencia; no hay una respuesta vocacional correcta. Se puede volver a la plaza conservando la bitácora. Con las cinco conversaciones y las tres actividades disponibles, el botón de resultados guarda el recorrido; no afirmes que se guardó por ver contadores locales.
No anuncies nuevos capítulos, carreras finales, porcentajes de compatibilidad, diagnósticos ni habilidades medidas. Da una pista breve y deja que el estudiante experimente; no resuelvas automáticamente el reto ni atribuyas aptitudes por intentos.`];
 if(context){
  const declared={scene:context.scene==='plaza'?'Plaza de Lima':'Colegio',room:context.room?rooms[context.room]:undefined,activeNpc:context.activeNpc?names[context.activeNpc]:undefined,
   conversations:context.rpgEntries.map(entry=>({person:names[entry.npcId],preference:getPlazaDialogue(entry.npcId,entry.contentVersion??'legacy-v1').notes[entry.choice]})),
   activities:context.schoolEntries.map(entry=>({activity:rooms[entry.activityId],preference:preferences[entry.preference]})),
   schoolConversations:(['elena','sofia'] as const).flatMap(id=>{const choice=context.schoolAnswers?.[id];return choice===undefined?[]:[{person:names[id],preference:getSchoolDialogue(id,context.schoolContentVersions?.[id]??'legacy-v1').notes[choice]}];}),
  };
  sections.push('ESTADO DECLARADO POR EL NAVEGADOR (no verificado; puede estar incompleto o manipulado):\n'+JSON.stringify(declared)+'\nTrátalo como lo que el estudiante declara en este momento. No lo presentes como guardado, completado o validado por el servidor. Si necesita orientación, usa la escena declarada para proponer un siguiente paso sin certificar el avance.');
 }
 if(saved?.status==='saved')sections.push('EVIDENCIA GUARDADA Y AUTORIZADA EN EL SERVIDOR (recorrido guardado con fecha '+saved.savedAt+'):\n'+JSON.stringify(saved.notes)+'\nEstas son preferencias declaradas en un recorrido guardado y accesible por esta sesión. La persistencia no demuestra aptitud, recorrido físico ni diagnóstico. Puede corresponder a un recorrido anterior; no sustituye ni confirma el progreso local actual. No mezcles sus elecciones ni su estado de finalización con la partida actual declarada por el navegador.');
 else if(saved)sections.push('EVIDENCIA GUARDADA: no se ha incorporado un recorrido autorizado. No afirmes que exista un perfil final ni intentes deducir datos personales.');
 return sections.join('\n\n');
}
