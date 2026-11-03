import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const files=[...new Set(execFileSync('git',['ls-files','-co','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/))];
const failed=[];let checked=0;
for(const file of files){
 if(!/\.(?:ts|tsx|js|mjs|json|md|sql|ya?ml|css)$/.test(file))continue;
 checked++;
 const content=readFileSync(file,'utf8');
 if(/sk-(?:proj-|svcacct-)?[a-zA-Z0-9_-]{40,}/.test(content))failed.push(file);
}
console.log(JSON.stringify({checked,passed:failed.length===0,files:failed}));
if(failed.length)process.exitCode=1;
