export type WorldPosition={x:number;y:number};
export type CollisionQuery=(x:number,y:number)=>boolean;

/** Move a feet position in small steps, resolving each axis independently.
 * Geometry and character radius belong to the supplied collision query.
 */
export function moveWithCollisions(position:WorldPosition,dx:number,dy:number,blocked:CollisionQuery):void{
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));
 for(let step=0;step<steps;step++){
  if(!blocked(position.x+dx/steps,position.y))position.x+=dx/steps;
  if(!blocked(position.x,position.y+dy/steps))position.y+=dy/steps;
 }
}
