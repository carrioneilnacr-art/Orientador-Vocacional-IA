import { describe, expect, it } from 'vitest';
import { plazaBlocked } from './PlazaScene';
import { PLAZA_ARCHITECTURE, PLAZA_FOUNTAIN, PLAZA_PROPS, PLAZA_REFERENCE, PLAZA_WORLD, plazaPoint, plazaSpriteSize } from '@/game/plazaLayout';

describe('Plaza de Lima: coordenadas de la referencia', () => {
  it('normaliza los puntos sobre 1672 × 941 y escala sprites sin deformarlos', () => {
    expect(plazaPoint(836, 470).x).toBe(PLAZA_WORLD.width / 2);
    expect(plazaPoint(836, 470).y).toBeCloseTo(470 / PLAZA_REFERENCE.height * PLAZA_WORLD.height);
    const size = plazaSpriteSize(120, 120);
    expect(size.width).toBe(size.height);
    for (const item of [...PLAZA_PROPS, ...PLAZA_ARCHITECTURE]) {
      expect(item.y + item.height).toBeCloseTo(item.foot);
    }
  });

  it('bloquea la base de fuente, jardines, bancas, edificios y troncos', () => {
    expect(plazaBlocked(PLAZA_FOUNTAIN.collider.x, PLAZA_FOUNTAIN.collider.y)).toBe(true);
    for (const id of ['jardin-oeste', 'jardin-este', 'banca-oeste', 'arbol-entrada', 'puesto']) {
      const shape = PLAZA_PROPS.find(item => item.id === id)?.collider;
      expect(shape?.kind, id).toBe('rect');
      if (shape?.kind === 'rect') expect(plazaBlocked(shape.x + shape.width / 2, shape.y + shape.height / 2), id).toBe(true);
    }
    expect(plazaBlocked(plazaPoint(850, 354).x, plazaPoint(850, 354).y)).toBe(true);
  });

  it('mantiene suelo transitable delante y detrás de la fuente', () => {
    for (const [rx, ry] of [[856, 680], [856, 480], [580, 620], [1150, 620]]) {
      const point = plazaPoint(rx, ry);
      expect(plazaBlocked(point.x, point.y), `${rx},${ry}`).toBe(false);
    }
  });
});
