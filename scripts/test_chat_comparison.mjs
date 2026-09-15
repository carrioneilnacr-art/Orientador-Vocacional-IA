import dotenv from 'dotenv';
dotenv.config();

async function testChat() {
  console.log('=== TEST DE CHAT: COMPARACIÓN DE UNIVERSIDADES EN LIMA NORTE ===\n');
  
  // Test local dev server running on port 3000
  try {
    const res = await fetch('http://127.0.0.1:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: '¿Qué universidad es mejor para estudiar Ingeniería de Sistemas en Lima Norte, UPN, UTP o UCH? Compara sus mallas y dime cuál me conviene.'
          }
        ],
        profileContext: '\n\n=== PERFIL VOCACIONAL DEL USUARIO ===\nDimensiones RIASEC:\nTECH: 90%, LOGIC: 85%, INVESTIGATIVE: 80%\n=====================================\n'
      })
    });

    if (!res.ok) {
      console.log('Chat API status:', res.status);
      const errText = await res.text();
      console.log('Error text:', errText);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'text-delta' && parsed.delta) {
            fullText += parsed.delta;
          }
        } catch {}
      }
    }

    console.log('--- RESPUESTA GENERADA POR CHASKI ---');
    console.log(fullText);
    console.log('-------------------------------------\n');

    // Quality assertions
    const hasHashHeaders = /###|##|#/.test(fullText);
    const hasDividers = /---|\*\*\*/.test(fullText);
    const mentionsLimaNorte = /lima norte|los olivos|comas/i.test(fullText);
    const hasRecommendation = /recomiendo|conviene|opción|perfil/i.test(fullText);

    console.log('¿Contiene símbolos ### rotos?:', hasHashHeaders ? 'SÍ (FALLÓ)' : 'NO (CORRECTO)');
    console.log('¿Contiene líneas --- divisorias?:', hasDividers ? 'SÍ (FALLÓ)' : 'NO (CORRECTO)');
    console.log('¿Menciona sedes de Lima Norte?:', mentionsLimaNorte ? 'SÍ (CORRECTO)' : 'NO (FALLÓ)');
    console.log('¿Emite recomendación / postura?:', hasRecommendation ? 'SÍ (CORRECTO)' : 'NO (FALLÓ)');

  } catch (err) {
    console.error('Error during test:', err.message);
  }
}

testChat();
