/** Compress the walkable ground in screen space while retaining collision coordinates. */
export function plazaScreenY(y: number): number {
  return y < 238 ? y * 380 / 238 : 380 + (y - 238) * .6;
}
export function plazaWorldY(y: number): number {
  return y < 380 ? y * 238 / 380 : 238 + (y - 380) / .6;
}
