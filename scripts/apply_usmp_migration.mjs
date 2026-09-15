import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  console.log('=== APLICANDO MIGRACIÓN 011_seed_all_usmp_careers.sql ===');
  
  const sqlFilePath = path.join(process.cwd(), 'docs', 'architecture', '011_seed_all_usmp_careers.sql');
  if (!fs.existsSync(sqlFilePath)) {
    throw new Error(`File not found: ${sqlFilePath}`);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`Executing SQL file (${sqlContent.length} bytes)...`);

  await sql.unsafe(sqlContent);
  console.log('SQL Migration executed successfully!\n');

  // Verify Results
  console.log('=== VERIFICACIÓN DE DATOS EN SUPABASE ===');
  const [inst] = await sql`SELECT id, name, short_name, website_url FROM institutions WHERE short_name = 'USMP'`;
  console.log('Institución:', inst);

  const campuses = await sql`SELECT id, name, district, city FROM campuses WHERE institution_id = ${inst.id} ORDER BY id`;
  console.log(`Campuses creados (${campuses.length}):`, campuses);

  const offers = await sql`
    SELECT ao.id, c.name as carrera, camp.name as campus, c.degree
    FROM academic_offers ao
    JOIN campuses camp ON ao.campus_id = camp.id
    JOIN careers c ON ao.career_id = c.id
    WHERE camp.institution_id = ${inst.id}
    ORDER BY c.name, camp.name
  `;
  console.log(`Ofertas académicas registradas (${offers.length}):`);
  const uniqueCareers = new Set(offers.map(o => o.carrera));
  console.log(`  -> Carreras únicas con ofertas USMP: ${uniqueCareers.size}`);

  const [coursesCount] = await sql`
    SELECT COUNT(cc.id) as count
    FROM curriculum_courses cc
    JOIN curricula cur ON cc.curriculum_id = cur.id
    JOIN academic_offers ao ON cur.academic_offer_id = ao.id
    JOIN campuses camp ON ao.campus_id = camp.id
    WHERE camp.institution_id = ${inst.id}
  `;
  console.log(`Cursos registrados en mallas USMP: ${coursesCount.count}`);

  const [globalOffers] = await sql`SELECT COUNT(id) as count FROM academic_offers`;
  const [globalCourses] = await sql`SELECT COUNT(id) as count FROM curriculum_courses`;
  const [globalCareers] = await sql`SELECT COUNT(id) as count FROM careers`;
  console.log('\n=== TOTALES GLOBALES EN LA BASE DE DATOS ===');
  console.log(`Carreras parametrizadas: ${globalCareers.count}`);
  console.log(`Ofertas académicas totales: ${globalOffers.count}`);
  console.log(`Cursos auditados en mallas: ${globalCourses.count}`);

  await sql.end();
}

main().catch(err => {
  console.error('Error executing migration:', err);
  process.exit(1);
});
