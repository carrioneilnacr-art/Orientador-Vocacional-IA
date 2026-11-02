import {describe,expect,it} from 'vitest';
import {readdirSync,readFileSync} from 'node:fs';
import {join,relative} from 'node:path';
function files(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)]);}
describe('module dependency boundaries',()=>{
 it('keeps domain and application independent of framework and storage adapters',()=>{
  for(const file of files(join(process.cwd(),'src/modules')).filter(file=>/[/\\](domain|application)[/\\]/.test(file)&&!file.endsWith('.test.ts'))){
   const imports=[...readFileSync(file,'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match=>match[1]);
   for(const dependency of imports)expect(dependency,relative(process.cwd(),file)).not.toMatch(/^(react|next|drizzle-orm|postgres|@supabase\/)|@\/db|infrastructure|presentation/);
  }
 });
});
