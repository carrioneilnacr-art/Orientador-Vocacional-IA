import crops from './plazaRpgCrops.json';

// Independent entities in the unchanged 1671 × 941 plaza coordinate system.
export const rpgNpcs = [
 // The source art is high-resolution. These are world-space display heights;
 // the soles stay at the same Y coordinate, so depth and hitboxes remain stable.
 {id:'mateo',name:'Mateo',role:'Pintor',x:390,y:660,height:120,radius:19,src:'/game/plaza-lima/rpg/mateo.png'},
 {id:'ernesto',name:'Don Ernesto',role:'Vecino lector',x:466,y:499,height:110,radius:21,src:'/game/plaza-lima/generated/vecino-archivista.png'},
 {id:'valeria',name:'Valeria',role:'Estudiante',x:1200,y:492,height:122,radius:19,src:'/game/plaza-lima/rpg/valeria.png'},
 {id:'luis',name:'Luis',role:'Vendedor',x:1555,y:588,height:120,radius:19,src:'/game/plaza-lima/rpg/luis.png'},
 {id:'estudiantes',name:'Camila y Diego',role:'Estudiantes',x:478,y:872,height:126,radius:43,src:'/game/plaza-lima/generated/estudiantes.png'},
] as const;
export type RpgNpcId = typeof rpgNpcs[number]['id'];
export function allPlazaNpcsCompleted(ids:readonly string[]):boolean{
 return rpgNpcs.every(npc=>ids.includes(npc.id));
}
export function plazaConversationPercent(ids:readonly string[]):number{
 return Math.round(rpgNpcs.filter(npc=>ids.includes(npc.id)).length/rpgNpcs.length*100);
}
export function npcCrop(id:RpgNpcId){return crops[id];}
export function nearestRpgNpc(x:number,y:number){
 return rpgNpcs.map(npc=>({npc,d:Math.hypot(x-npc.x,y-npc.y)})).filter(item=>item.d<=105)
 .sort((a,b)=>a.d-b.d)[0]?.npc.id??null;
}
