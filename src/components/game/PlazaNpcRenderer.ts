import {npcCrop,rpgNpcs,type RpgNpcId} from '@/game/plazaRpgNpcs';

export function createNpcRenderer(){
 let previousNear:RpgNpcId|null=null,nearSince=0;
 const sprites=new Map<RpgNpcId,{image:HTMLImageElement;outline:HTMLCanvasElement}>();
 for(const npc of rpgNpcs){const image=new Image();image.onload=()=>{
  const [x,y,w,h]=npcCrop(npc.id);const outline=document.createElement('canvas');outline.width=w;outline.height=h;
  const ctx=outline.getContext('2d');if(ctx){ctx.drawImage(image,x,y,w,h,0,0,w,h);ctx.globalCompositeOperation='source-in';ctx.fillStyle='#f6ca60';ctx.fillRect(0,0,w,h);}
  sprites.set(npc.id,{image,outline});
 };image.src=npc.src;}
 return {
  draw(ctx:CanvasRenderingContext2D,playerY:number,front:boolean,near:RpgNpcId|null,time:number,reduced:boolean,only?:RpgNpcId){
   for(const npc of rpgNpcs){if(only&&npc.id!==only)continue;if((npc.y>playerY)!==front)continue;const asset=sprites.get(npc.id);if(!asset)continue;
    const [sx,sy,sw,sh]=npcCrop(npc.id),h=npc.height,w=h*sw/sh,bob=reduced?0:Math.sin(time/950+npc.x)*1.2;
    ctx.save();ctx.translate(npc.x,npc.y);ctx.fillStyle='#12253450';ctx.beginPath();ctx.ellipse(0,0,w*.25,5,0,0,Math.PI*2);ctx.fill();
    if(npc.id===near){ctx.shadowColor='#ffe19b80';ctx.shadowBlur=8;for(const [dx,dy] of [[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]])ctx.drawImage(asset.outline,-w/2+dx,-h+bob+dy,w,h);ctx.shadowBlur=0;}
    ctx.drawImage(asset.image,sx,sy,sw,sh,-w/2,-h+bob,w,h);ctx.restore();
   }
  },
  indicators(ctx:CanvasRenderingContext2D,near:RpgNpcId|null,time:number,reduced:boolean,completed:readonly RpgNpcId[]=[]){
   if(previousNear!==near){previousNear=near;nearSince=time;}
   for(const npc of rpgNpcs){if(!sprites.has(npc.id))continue;
    const selected=npc.id===near,bob=reduced?0:Math.sin(time/1000+npc.x)*2;
    const w=selected?128:43,h=selected?37:28,x=npc.x-w/2,y=npc.y-npc.height-37+bob;
    ctx.save();ctx.globalAlpha=selected&&!reduced?Math.min(1,Math.max(.05,(time-nearSince)/160)):1;ctx.fillStyle=selected?'#142d40ed':'#fff1cc';ctx.strokeStyle=selected?'#d6b779':'#33302b';ctx.lineWidth=2;ctx.shadowColor='#0005';ctx.shadowBlur=5;
    ctx.beginPath();ctx.roundRect(x,y,w,h,selected?7:8);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    if(selected){ctx.strokeStyle='#d7b977';ctx.strokeRect(x+9,y+8,23,23);ctx.fillStyle='#ffebbc';ctx.font='bold 18px system-ui';ctx.fillText('E',x+15,y+26);ctx.fillStyle='#fff8e9';ctx.font='18px system-ui';ctx.fillText('Hablar',x+42,y+26);}
    else{ctx.beginPath();ctx.moveTo(npc.x-4,y+h);ctx.lineTo(npc.x-4,y+h+6);ctx.lineTo(npc.x+4,y+h);ctx.fill();ctx.fillStyle='#33302b';if(completed.includes(npc.id)){ctx.font='bold 21px system-ui';ctx.fillText('✓',npc.x-8,y+22);}else for(let i=-1;i<=1;i++)ctx.fillRect(npc.x+i*9-2,y+12,4,4);}
    ctx.restore();
   }
  }
 };
}
