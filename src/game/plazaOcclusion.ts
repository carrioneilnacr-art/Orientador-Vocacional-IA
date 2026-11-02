/** Remove paving from atlas cutouts; collision footprints remain a separate ground-space concept. */
export function keepForegroundPixel(id:string,r:number,g:number,b:number):boolean {
  // Lamps contain cream/yellow highlights similar to paving. Their silhouette,
  // not a chroma key, decides opacity; otherwise the hero leaks through the glass.
  if(id.startsWith('farol-poste-'))return true;
  if(id==='estacion'||id==='caballete'||id==='jardin-busto')return true;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),saturation=max?(max-min)/max:0;
  if(id.startsWith('arbol')||id==='jacaranda'||id==='palmera'){
    const leaves=g>=r*.88&&g>b*1.12&&max-min>25;
    const wood=r<160&&r>g*1.24&&g>b*1.15&&saturation>.4;
    const purple=id==='jacaranda'&&b>g*1.15&&r>g*1.1;
    return leaves||wood||purple;
  }
  // Pink/tan paving and gray ground shadows must never cover the player.
  const paving=r>85&&r>=g&&g>=b&&r-g<48&&g-b<48&&saturation<.36;
  return !paving;
}

/** Restrict thin props to their silhouette before applying the color mask.
 * Coordinates are local to the atlas rectangle, never viewport coordinates. */
export function insideForegroundShape(id:string,x:number,y:number,w:number,h:number):boolean {
 const inPolygon=(points:readonly (readonly [number,number])[])=>{
  let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){
   const [ax,ay]=points[i],[bx,by]=points[j];
   if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
  }return inside;
 };
 if(id==='caballete'){
  // Three narrow wooden supports and the tray: retain the open gaps between legs.
  return inPolygon([[31,1],[37,1],[62,81],[55,85],[31,14],[9,85],[1,82]])
   ||inPolygon([[31,19],[38,19],[40,85],[33,85]])
   ||inPolygon([[13,55],[51,55],[54,63],[11,63]]);
 }
 if(id==='jardin-busto')return inPolygon([
  [0,3],[22,7],[35,0],[52,14],[75,9],[95,23],[122,14],[143,24],
  [166,11],[183,23],[211,0],[232,15],[242,43],[241,90],[235,121],[0,123],
 ]);
 // Large atlas regions include neighbouring architecture; only the physical tree silhouette
 // may be lifted in front of a character.
 if(id==='arbol-grande'){
  if(y<145)return true;
  if(y<285)return x<Math.max(205,490-(y-145)*1.65);
  return x<220;
 }
 if(id==='jacaranda')return y<205||Math.abs(x-48)<36;
 if(id.startsWith('banca'))return y>=12&&x>=4&&x<w-4;
 if(id==='puesto')return y>=2&&x>=8&&x<w-8;
 if(id.startsWith('farol-poste-')){
  const index=Number(id.slice('farol-poste-'.length)),cx=w/2;
  if(index>=7){
   // Bollard cap, narrow shaft and foot; exclude paving beside the post.
   return (y<13&&Math.abs(x-cx)<=8)||(y>=13&&y<h-10&&Math.abs(x-cx)<=5)||(y>=h-10&&Math.abs(x-cx)<=11);
  }
  const u=x/w,v=y/h;
  const polygon=(points:readonly (readonly number[])[])=>{
   let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [ax,ay]=points[i],[bx,by]=points[j];
    if((ay>v)!==(by>v)&&u<(bx-ax)*(v-ay)/(by-ay)+ax)inside=!inside;
   }return inside;
  };
  const lamp=(center:number,top:number,width:number)=>polygon([
   [center-.025,top],[center+.025,top],[center+.045,top+.035],
   [center+width/2,top+.067],[center+width/2,top+.087],
   [center+width*.34,top+.175],[center+.035,top+.193],
   [center-.035,top+.193],[center-width*.34,top+.175],
   [center-width/2,top+.087],[center-width/2,top+.067],[center-.045,top+.035],
  ]);
  const shaft=Math.abs(u-.5)<=.06&&v>.18;
  const base=polygon([[.435,.80],[.565,.80],[.59,.90],[.70,.94],[.74,.985],[.62,1],[.38,1],[.26,.985],[.30,.94],[.41,.90]]);
  const arms=polygon([[.12,.25],[.19,.25],[.24,.30],[.46,.32],[.54,.32],[.76,.30],[.81,.25],[.88,.25],[.84,.325],[.62,.355],[.38,.355],[.16,.325]]);
  const banner=[0,1,3,4].includes(index)&&polygon([[.3,.322],[.7,.322],[.7,.674],[.5,.63],[.3,.674]]);
  return shaft||base||arms||banner||lamp(.5,0,.31)||lamp(.18,.075,.29)||lamp(.82,.075,.29);
 }
 if(id==='estacion'){
  // The roof starts lower on its curved left end; the upper-left corner is open paving.
  if(y<40&&x<220)return false;
  if(y<72&&x<25)return false;
 }
 return true;
}

/** Fill only tiny enclosed holes created by chroma classification. Large gaps
 * (bench legs, branches, architecture) and the exterior stay transparent. */
export function fillForegroundPinholes(data:Uint8ClampedArray,width:number,height:number,maxHole=64):void {
 const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);
 for(let start=0;start<seen.length;start++){
  if(seen[start]||data[start*4+3])continue;
  let head=0,tail=1,touchesEdge=false;queue[0]=start;seen[start]=1;
  while(head<tail){const at=queue[head++],x=at%width,y=Math.floor(at/width);
   if(x===0||y===0||x===width-1||y===height-1)touchesEdge=true;
   for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){
    const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=width||ny>=height)continue;
    const next=ny*width+nx;if(!seen[next]&&!data[next*4+3]){seen[next]=1;queue[tail++]=next;}
   }
  }
  if(!touchesEdge&&tail<=maxHole)for(let i=0;i<tail;i++)data[queue[i]*4+3]=255;
 }
}
