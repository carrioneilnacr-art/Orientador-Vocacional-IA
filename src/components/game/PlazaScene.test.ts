import { describe, expect, it } from 'vitest';
import { plazaBlocked } from './PlazaScene';

describe('Plaza de Lima: suelo transitable', () => {
  it('bloquea la fuente, los jardines, una banca, un edificio y el tronco', () => {
    for (const [x, y] of [[500, 350], [240, 350], [320, 475], [500, 180], [150, 290], [655, 465]]) {
      expect(plazaBlocked(x, y)).toBe(true);
    }
  });

  it('deja un recorrido alrededor de la fuente y detrás de la palmera', () => {
    for (const [x, y] of [[500, 415], [405, 415], [405, 295], [500, 289], [176, 256]]) {
      expect(plazaBlocked(x, y)).toBe(false);
    }
  });
});
