// One real chat request; validates stream completion rather than HTTP 200 alone.
const base=(process.env.BASE_URL||'http://localhost:3000').replace(/\/$/,'');
const started=Date.now();
try{
 const response=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'Hola, ¿cómo puedo explorar mis intereses?'}]}),signal:AbortSignal.timeout(40000)});
 const body=await response.text();
 const events=body.split('\n').filter(line=>line.startsWith('data:')&&!line.includes('[DONE]')).flatMap(line=>{try{return [JSON.parse(line.slice(5))];}catch{return [];}});
 const text=events.filter(event=>event.type==='text-delta').map(event=>event.delta||'').join('');
 const result={status:response.status,ms:Date.now()-started,requestId:response.headers.get('x-request-id'),hasText:!!text,characters:text.length,completed:events.some(event=>event.type==='finish'),error:events.some(event=>event.type==='error')};
 console.log(JSON.stringify(result));
 if(!response.ok||!result.hasText||!result.completed||result.error)process.exitCode=1;
}catch(error){console.log(JSON.stringify({networkError:true,name:error.name,ms:Date.now()-started}));process.exitCode=1;}
