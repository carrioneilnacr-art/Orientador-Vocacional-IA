import postgres from 'postgres';

async function testDb() {
  console.log('Testing DB connection...');
  try {
    const connectionString = 'postgresql://postgres.ottyfzyfuayjomtucujy:iL68jLXvCaPpCQMB@aws-0-ca-central-1.pooler.supabase.com:6543/postgres';
    const client = postgres(connectionString, { prepare: false });
    const result = await client`SELECT 1 as test`;
    console.log('DB Connection OK:', result);
    
    const countResult = await client`SELECT COUNT(*) FROM questionnaire_questions`;
    console.log('Questions count:', countResult[0].count);
    
    await client.end();
  } catch (e) {
    console.error('DB Connection Error:', e);
  }
}

testDb();
