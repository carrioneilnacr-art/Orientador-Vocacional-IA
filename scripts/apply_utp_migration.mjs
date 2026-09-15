import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';

async function main() {
  const sqlFile = 'docs/architecture/007_seed_all_utp_careers.sql';
  console.log(`Reading SQL file: ${sqlFile}...`);
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  console.log(`Connecting to Supabase PostgreSQL at ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@')}...`);
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    connect_timeout: 30,
    idle_timeout: 30
  });

  console.log('Executing UTP migration...');
  const t0 = Date.now();
  try {
    await sql.unsafe(sqlContent);
    console.log(`✅ Migración UTP ejecutada con éxito en ${Date.now() - t0}ms!`);

    // Verify institutions
    const insts = await sql`
      SELECT i.id, i.name, i.short_name, COUNT(DISTINCT o.id) as offers, COUNT(DISTINCT ca.id) as campuses
      FROM institutions i
      LEFT JOIN academic_offers o ON o.institution_id = i.id
      LEFT JOIN campuses ca ON ca.institution_id = i.id
      GROUP BY i.id, i.name, i.short_name
      ORDER BY i.id
    `;
    console.log('\n🏛️ INSTITUCIONES EN SUPABASE:');
    console.log('------------------------------------------------------------');
    for (const inst of insts) {
      console.log(`- [ID: ${inst.id}] ${inst.name} (${inst.short_name}) | Campuses: ${inst.campuses} | Ofertas: ${inst.offers}`);
    }

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

    const totalOffers = await sql`SELECT COUNT(*) FROM academic_offers`;
    const totalCourses = await sql`SELECT COUNT(*) FROM curriculum_courses`;
    console.log(`\n📚 Total de ofertas académicas: ${totalOffers[0].count}`);
    console.log(`📚 Total de cursos en la base de datos: ${totalCourses[0].count}`);

  } catch (err) {
    console.error('❌ Error ejecutando migración:', err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
