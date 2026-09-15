import 'dotenv/config';
import postgres from 'postgres';

async function main() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const rules = await sql`
    SELECT r.career_id, c.name, r.dimension, r.weight, r.min_score 
    FROM questionnaire_career_rules r
    JOIN careers c ON c.id = r.career_id
    ORDER BY r.career_id, r.dimension
  `;
  console.log('Total rules in BD:', rules.length);
  const careerMap = {};
  for (const r of rules) {
    if (!careerMap[r.name]) careerMap[r.name] = [];
    careerMap[r.name].push(`${r.dimension} (w: ${r.weight}, min: ${r.min_score})`);
  }
  for (const [name, dims] of Object.entries(careerMap)) {
    console.log(`- ${name}: ${dims.join(', ')}`);
  }
  await sql.end();
}

main().catch(console.error);
