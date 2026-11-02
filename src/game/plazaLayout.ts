import scene from './plaza-reference.json';

/** Pixel landmarks measured on the user's 1672 × 941 reference PNG. */
export const PLAZA_REFERENCE = scene.reference;
export const PLAZA_WORLD = { width: 1000, height: 620 } as const;

const sx = PLAZA_WORLD.width / PLAZA_REFERENCE.width;
const sy = PLAZA_WORLD.height / PLAZA_REFERENCE.height;

export const plazaPoint = (x: number, y: number) => ({
  x: (x / PLAZA_REFERENCE.width) * PLAZA_WORLD.width,
  y: (y / PLAZA_REFERENCE.height) * PLAZA_WORLD.height,
});
/** Sprites use one scale factor on both axes; positions use normalized reference coordinates. */
export const plazaSpriteSize = (width: number, height: number) => ({ width: width * sx, height: height * sx });

export type PlazaRect = { kind: 'rect'; x: number; y: number; width: number; height: number };
export type PlazaEllipse = { kind: 'ellipse'; x: number; y: number; radiusX: number; radiusY: number };
export type PlazaCollider = PlazaRect | PlazaEllipse;
export type PlazaProp = {
  id: string;
  file: string;
  x: number;
  y: number;
  width: number;
  height: number;
  foot: number;
  collider?: PlazaCollider;
  sway?: boolean;
};

const rect = (x: number, y: number, width: number, height: number): PlazaRect =>
  ({ kind: 'rect', x: x * sx, y: y * sy, width: width * sx, height: height * sy });
const ellipse = (x: number, y: number, radiusX: number, radiusY: number): PlazaEllipse =>
  ({ kind: 'ellipse', x: x * sx, y: y * sy, radiusX: radiusX * sx, radiusY: radiusY * sy });

function prop(id: string, file: string, left: number, footY: number, width: number, height: number,
  collider?: PlazaCollider, sway = false): PlazaProp {
  const foot = plazaPoint(0, footY).y;
  const size = plazaSpriteSize(width, height);
  return { id, file, x: plazaPoint(left, 0).x, y: foot - size.height, ...size, foot, collider, sway };
}

/** Architecture stays behind the walkable plaza. Bounds and baseline come from the PNG. */
function sceneProp(id: keyof typeof scene.objects): PlazaProp {
  const item = scene.objects[id];
  const collider = item.collider ? rect(item.collider[0], item.collider[1], item.collider[2], item.collider[3]) : undefined;
  return prop(id, item.file, item.x, item.foot, item.width, item.height, collider, item.sway);
}

export const PLAZA_ARCHITECTURE = ['palacio', 'catedral', 'terraza'].map(id => sceneProp(id as keyof typeof scene.objects));
export const PLAZA_PROPS = (Object.keys(scene.objects) as (keyof typeof scene.objects)[])
  .filter(id => !['palacio', 'catedral', 'terraza', 'estacion', 'bus'].includes(id)).map(sceneProp);

const fountainFoot = plazaPoint(856, 626).y;
const fountainSize = plazaSpriteSize(500, 332);
export const PLAZA_FOUNTAIN = {
  x: plazaPoint(606, 0).x,
  y: fountainFoot - fountainSize.height,
  ...fountainSize,
  foot: fountainFoot,
  collider: ellipse(856, 577, 225, 49),
} as const;

const station = {
  ...sceneProp('estacion'),
  collider: rect(1177, 755, 495, 51),
};
const bus = {
  ...sceneProp('bus'),
  collider: rect(1340, 775, 332, 44),
};
export const PLAZA_TRANSPORT = {
  station,
  bus,
  door: plazaPoint(scene.door[0], scene.door[1]),
} as const;

export const PLAZA_COLLIDERS: readonly PlazaCollider[] = [
  rect(0, 385, 615, 29),
  rect(619, 347, 500, 29),
  rect(1373, 373, 299, 40),
  ...PLAZA_PROPS.flatMap(item => item.collider ? [item.collider] : []),
  PLAZA_FOUNTAIN.collider,
  station.collider,
  bus.collider,
];

export function plazaBlocked(x: number, y: number, playerRadius = 11): boolean {
  return PLAZA_COLLIDERS.some(shape => {
    if (shape.kind === 'rect') {
      return x + playerRadius > shape.x && x - playerRadius < shape.x + shape.width &&
        y + playerRadius > shape.y && y - playerRadius < shape.y + shape.height;
    }
    return ((x - shape.x) / (shape.radiusX + playerRadius)) ** 2 +
      ((y - shape.y) / (shape.radiusY + playerRadius)) ** 2 < 1;
  });
}
