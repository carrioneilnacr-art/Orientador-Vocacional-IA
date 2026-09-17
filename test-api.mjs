import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '¿Qué universidad es mejor en Lima Norte?' }],
        profileContext: ''
      })
    });
    
    if (!res.ok) {
      console.log('Error:', res.status, await res.text());
      return;
    }
    
    const body = await res.text();
    console.log('Response body:', body);
  } catch (e) {
    console.error(e);
  }
}
test();
