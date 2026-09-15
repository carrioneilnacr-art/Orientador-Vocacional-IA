import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function check() {
  const cs = await sql`
    SELECT c.id, c.name, c.slug, array_agg(DISTINCT i.short_name) as unis
    FROM careers c
    JOIN academic_offers ao ON c.id = ao.career_id
    JOIN institutions i ON ao.institution_id = i.id
    WHERE c.name ILIKE '%sistema%' OR c.slug ILIKE '%sistema%'
    GROUP BY c.id, c.name, c.slug
  `;
  console.log('Sistemas careers by uni:', cs);
  await sql.end();
}

check();
