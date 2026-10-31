import { describe, expect, it } from 'vitest';
import { plazaSolid } from './PlazaWorld';
import { plazaNpcs } from '@/game/plazaNpcs';

describe('Plaza navigation', () => {
  it('blocks every NPC separately and the bus body', () => {
    for (const npc of plazaNpcs) expect(plazaSolid(npc.x, npc.y)).toBe(true);
    expect(plazaSolid(920, 500)).toBe(true);
    expect(plazaSolid(970, 562)).toBe(false);
  });

  it('provides a continuous route from spawn to all six interaction zones and the bus door', () => {
    const queue = [{ x: 500, y: 570 }];
    const seen = new Set(['500,570']);
    for (let head = 0; head < queue.length; head++) {
      const point = queue[head];
      for (const [dx, dy] of [[10,0],[-10,0],[0,10],[0,-10]]) {
        const x = point.x + dx, y = point.y + dy, key = `${x},${y}`;
        if (x < 20 || x > 980 || y < 250 || y > 590 || seen.has(key) || plazaSolid(x, y)) continue;
        seen.add(key); queue.push({ x, y });
      }
    }
    for (const npc of plazaNpcs) expect(queue.some(p => Math.hypot(p.x-npc.x,p.y-npc.y)<70), npc.name).toBe(true);
    expect(queue.some(p => Math.hypot(p.x-970,p.y-562)<25)).toBe(true);
    expect(queue.some(p => p.x === 170 && p.y === 260)).toBe(true);
  });
});
