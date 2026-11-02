import {describe,it,expect} from 'vitest';
import {nearestRpgNpc,rpgNpcs,npcCrop} from './plazaRpgNpcs';
import {blocked} from './plazaPhysics';
describe('NPC RPG fases A/B',()=>{
 it('solo selecciona NPC dentro del rango',()=>{expect(nearestRpgNpc(850,749)).toBe(null);expect(nearestRpgNpc(450,675)).toBe('mateo');expect(nearestRpgNpc(850,680)).toBe(null);});
 it('los cinco grupos tienen huella sólida y recorte de sprite válido',()=>{for(const npc of rpgNpcs){expect(blocked(npc.x,npc.y),npc.name).toBe(true);const crop=npcCrop(npc.id);expect(crop).toHaveLength(4);expect(crop[2]).toBeGreaterThan(0);expect(crop[3]).toBeGreaterThan(0);}});
 it('permite acercarse a cada NPC sin pisar su sprite',()=>{for(const npc of rpgNpcs){let reachable=false;for(let angle=0;angle<Math.PI*2;angle+=Math.PI/12){const x=npc.x+Math.cos(angle)*85,y=npc.y+Math.sin(angle)*85;if(!blocked(x,y)&&nearestRpgNpc(x,y)===npc.id)reachable=true;}expect(reachable,npc.name).toBe(true);}});
});
