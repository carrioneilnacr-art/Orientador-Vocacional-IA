import sharp from 'sharp';
import {stat, writeFile} from 'node:fs/promises';

// Lossless encoding only: retain the original PNGs as source assets and verify
// decoded RGBA bytes before publishing each smaller alternate format.
const sources = [
  'public/game/plaza-lima/base/plaza-sin-bus.png',
  'public/game/colegio/patio-referencia.png',
  ...['laboratorio','taller','tecnologia'].map(room => `public/game/colegio/${room}-compacto.png`),
];
const results=[];
for (const source of sources) {
  const target=source.replace(/\.png$/,'.webp');
  const encoded=await sharp(source).webp({lossless:true,effort:6}).toBuffer();
  const originalPixels=await sharp(source).ensureAlpha().raw().toBuffer();
  const encodedPixels=await sharp(encoded).ensureAlpha().raw().toBuffer();
  if (!originalPixels.equals(encodedPixels)) throw new Error(`Pixels changed: ${source}`);
  const before=(await stat(source)).size;
  if(encoded.length>=before)throw new Error(`Not smaller: ${source}`);
  await writeFile(target,encoded);
  results.push({source,target,before,after:encoded.length,reductionPercent:Number((100*(1-encoded.length/before)).toFixed(2)),identicalRGBA:true});
}
const before=results.reduce((total,row)=>total+row.before,0),after=results.reduce((total,row)=>total+row.after,0);
const report={generatedAt:new Date().toISOString(),encoder:'sharp WebP lossless, effort 6',results,total:{before,after,reductionPercent:Number((100*(1-after/before)).toFixed(2))}};
await writeFile('docs/architecture/game-asset-optimization-2026-11-03.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
