import {describe,expect,it} from 'vitest';
import {schoolRooms,schoolRoomBlocked,roomTalkRadius,type SchoolRoomId} from './colegioRooms';

describe('interiores recreados del colegio',()=>{
 for(const id of Object.keys(schoolRooms) as SchoolRoomId[]){
  const room=schoolRooms[id];
  it(`${id}: todo el suelo libre conecta con la puerta (muestreo cada 5 px)`,()=>{
   const free=new Set<number>();
   const stride=2000;
   for(let y=335;y<=921;y+=5){
    for(let x=30;x<=1642;x+=5){
     if(!schoolRoomBlocked(id,x,y,room.objects))free.add(y*stride+x);
    }
   }
   const queue=[880*stride+835];
   expect(free.delete(queue[0])).toBe(true);
   for(let i=0;i<queue.length;i++){
    for(const delta of [-5,5,-5*stride,5*stride]){
     const next=queue[i]+delta;
     if(free.delete(next))queue.push(next);
    }
   }
   expect(free.size).toBe(0);
  });
  it(`${id} permite llegar desde la entrada al NPC y recorrer el suelo`,()=>{
   const start={x:835,y:880};
   expect(schoolRoomBlocked(id,start.x,start.y,room.objects)).toBe(false);
   const queue=[start],visited=new Set([`${start.x},${start.y}`]);
   let reachesNpc=false,reachesMiddle=false;
   for(let index=0;index<queue.length;index++){
    const point=queue[index];
    if(Math.hypot(point.x-room.objects[0].x,point.y-room.objects[0].y)<roomTalkRadius)reachesNpc=true;
    if(point.y<480&&point.x>750&&point.x<1150)reachesMiddle=true;
    for(const [dx,dy] of [[20,0],[-20,0],[0,20],[0,-20]]){
     const next={x:point.x+dx,y:point.y+dy},key=`${next.x},${next.y}`;
     if(visited.has(key)||schoolRoomBlocked(id,next.x,next.y,room.objects))continue;
     visited.add(key);queue.push(next);
    }
   }
   expect(reachesNpc).toBe(true);
   expect(reachesMiddle).toBe(true);
   // Each room needs room to approach the NPC from front, back and sides.
   const feet=room.objects[0];
   for(const [dx,dy] of [[-65,0],[65,0],[0,-55],[0,55]]){
    const x=start.x+20*Math.round((feet.x+dx-start.x)/20);
    const y=start.y+20*Math.round((feet.y+dy-start.y)/20);
    expect(visited.has(`${x},${y}`),`${id}: lado accesible del NPC (${dx}, ${dy})`).toBe(true);
   }
   expect(schoolRoomBlocked(id,200,900,room.objects)).toBe(true); // No rodear el muro por fuera.
   expect(schoolRoomBlocked(id,1550,900,room.objects)).toBe(true);
   for(const object of room.objects)expect(schoolRoomBlocked(id,object.x,object.y,room.objects)).toBe(true);
  });
 }
});
