import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';

async function main() {
  const sqlFile = 'docs/architecture/006_seed_all_upn_careers.sql';
  console.log(`Reading SQL file: ${sqlFile}...`);
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  console.log(`Connecting to Supabase PostgreSQL at ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@')}...`);
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    connect_timeout: 30,
    idle_timeout: 30
  });

  console.log('Executing migration...');
  const t0 = Date.now();
  try {
    await sql.unsafe(sqlContent);
    console.log(`✅ Migración ejecutada con éxito en ${Date.now() - t0}ms!`);

    // Verify careers in Supabase
    const careers = await sql`
      SELECT c.id, c.name, c.slug, c.faculty, COUNT(DISTINCT o.id) as offers, COUNT(DISTINCT cc.id) as courses
      FROM careers c
      LEFT JOIN academic_offers o ON o.career_id = c.id
      LEFT JOIN curricula cu ON cu.academic_offer_id = o.id
      LEFT JOIN curriculum_courses cc ON cc.curriculum_id = cu.id
      GROUP BY c.id, c.name, c.slug, c.faculty
      ORDER BY c.id
    `;
    
    console.log('\n📊 ESTADO FINAL DE CARRERAS EN SUPABASE:');
    console.log('------------------------------------------------------------');
    for (const c of careers) {
      console.log(`- [ID: ${c.id}] ${c.name} (${c.slug}) | Fac: ${c.faculty} | Ofertas: ${c.offers} | Cursos en Malla: ${c.courses}`);
    }

    const totalCourses = await sql`SELECT COUNT(*) FROM curriculum_courses`;
    console.log(`\n📚 Total de cursos en la base de datos: ${totalCourses[0].count}`);

  } catch (err) {
    console.error('❌ Error ejecutando migración:', err);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
