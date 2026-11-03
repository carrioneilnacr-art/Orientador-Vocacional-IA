import dotenv from 'dotenv';
dotenv.config({path:'.env'});
dotenv.config({path:'.env.local',override:true});
import postgres from 'postgres';

async function runDiagnostic() {
  console.log('====================================================');
  console.log('  DIAGNÓSTICO DE CONEXIONES Y ESTADO EN SUPABASE');
  console.log('====================================================\n');

  let allOk = true;

  // 1. Supabase REST
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your_supabase_project_url')) {
    console.log('❌ [Supabase REST] Error: NEXT_PUBLIC_SUPABASE_URL no configurada.');
    allOk = false;
  } else {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/careers?select=count`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      });
      if (res.ok) {
        console.log(`✅ [Supabase REST] Conexión exitosa a ${supabaseUrl} (Status: ${res.status}).`);
      } else {
        console.log(`⚠️ [Supabase REST] Respuesta HTTP ${res.status}: ${await res.text()}`);
        allOk = false;
      }
    } catch (e) {
      console.log(`❌ [Supabase REST] Error: ${e.message}`);
      allOk = false;
    }
  }

  // 2. PostgreSQL & Datos de Tablas
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('[') || dbUrl.includes('your_')) {
    console.log('❌ [PostgreSQL] Error: DATABASE_URL inválida.');
    allOk = false;
  } else {
    try {
      const client = postgres(dbUrl, { prepare: false, connect_timeout: 5 });
      const careersCount = await client`SELECT COUNT(*) FROM careers`;
      const questions = await client`SELECT id, code, dimension FROM questionnaire_questions ORDER BY id`;
      const optionsCount = await client`SELECT COUNT(*) FROM questionnaire_options`;
      
      console.log(`✅ [PostgreSQL] Conexión exitosa a Supabase.`);
      console.log(`   - Carreras en BD: ${careersCount[0].count}`);
      console.log(`   - Preguntas en BD: ${questions.length} (IDs del ${questions[0]?.id || 0} al ${questions[questions.length - 1]?.id || 0})`);
      console.log(`   - Opciones en BD: ${optionsCount[0].count}`);
      await client.end();
    } catch (e) {
      console.log(`❌ [PostgreSQL] Error: ${e.message}`);
      allOk = false;
    }
  }

  // 3. GPT de OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey || openaiKey.includes('your_')) {
    console.log('❌ [OpenAI API] Error: OPENAI_API_KEY no configurada.');
    allOk = false;
  } else {
    try {
      const res = await fetch('https://api.openai.com/v1/models',{headers:{Authorization:`Bearer ${openaiKey}`},signal:AbortSignal.timeout(10000)});
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ [OpenAI API] Conexión exitosa. Modelos disponibles: ${data.data?.length}.`);
      } else {
        console.log(`❌ [OpenAI API] Error HTTP ${res.status}; código: ${data.error?.code || 'no disponible'}`);
        allOk = false;
      }
    } catch (e) {
      console.log(`❌ [OpenAI API] Error de conexión: ${e.name}`);
      allOk = false;
    }
  }

  console.log('\n====================================================\n');
}

runDiagnostic();
