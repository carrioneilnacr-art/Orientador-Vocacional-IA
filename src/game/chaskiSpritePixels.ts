/** Remove alpha fringe and detached extraction debris without blurring pixel art. */
export function cleanChaskiPixels(data: Uint8ClampedArray, width: number, height: number): void {
 const size=width*height,seen=new Uint8Array(size),queue=new Int32Array(size);
 const components:number[][]=[];
 for(let i=0;i<size;i++)if(data[i*4+3]<128)data[i*4+3]=0;
 for(let start=0;start<size;start++){
  if(seen[start]||!data[start*4+3])continue;
  let head=0,tail=1;queue[0]=start;seen[start]=1;const pixels:number[]=[];
  while(head<tail){const at=queue[head++];pixels.push(at);const x=at%width,y=Math.floor(at/width);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const nx=x+dx,ny=y+dy;if(nx<0||nx>=width||ny<0||ny>=height)continue;
    const next=ny*width+nx;if(!seen[next]&&data[next*4+3]){seen[next]=1;queue[tail++]=next;}
   }
  }
  components.push(pixels);
 }
 const largest=components.reduce((max,c)=>Math.max(max,c.length),0);
 for(const component of components){const keep=component.length>=Math.max(12,largest*.003);
  for(const index of component)data[index*4+3]=keep?255:0;
 }
}
