import { describe, expect, it } from 'vitest';
import { plazaScreenY, plazaWorldY } from './plazaProjection';

describe('Plaza perspective', () => {
  it('maps pointer positions back to the same walkable coordinates', () => {
    for (const y of [0, 238, 245, 300, 399, 490, 562, 592, 620]) {
      expect(plazaWorldY(plazaScreenY(y))).toBeCloseTo(y, 8);
    }
  });
  it('keeps the skyline and compresses the pavement without reversing depth', () => {
    expect(plazaScreenY(238)).toBe(380);
    expect(plazaScreenY(620)).toBeLessThan(620);
    expect(plazaScreenY(490)).toBeLessThan(plazaScreenY(562));
  });
});
