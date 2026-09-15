import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  const unis = await sql`
    SELECT 
      i.id,
      i.short_name,
      i.name,
      COUNT(DISTINCT c.id) as campus_count,
      COUNT(DISTINCT ao.id) as offers_count,
      COUNT(DISTINCT ao.career_id) as careers_count,
      COUNT(DISTINCT cc.id) as courses_count
    FROM institutions i
    LEFT JOIN campuses c ON i.id = c.institution_id
    LEFT JOIN academic_offers ao ON i.id = ao.institution_id
    LEFT JOIN curricula cur ON ao.id = cur.academic_offer_id
    LEFT JOIN curriculum_courses cc ON cur.id = cc.curriculum_id
    WHERE i.is_active = true
    GROUP BY i.id, i.short_name, i.name
    ORDER BY i.id
  `;

  console.log('=== UNIVERSIDADES ACTIVAS EN SUPABASE ===\n');
  unis.forEach(u => {
    console.log(`• ${u.short_name} - ${u.name} (ID: ${u.id})`);
    console.log(`  - Sedes/Campus: ${u.campus_count}`);
    console.log(`  - Carreras con oferta: ${u.careers_count}`);
    console.log(`  - Ofertas académicas: ${u.offers_count}`);
    console.log(`  - Cursos auditados en mallas: ${u.courses_count}\n`);
  });

  const [totals] = await sql`
    SELECT 
      (SELECT COUNT(*) FROM institutions WHERE is_active = true) as total_unis,
      (SELECT COUNT(*) FROM campuses) as total_campuses,
      (SELECT COUNT(*) FROM careers) as total_careers,
      (SELECT COUNT(*) FROM academic_offers) as total_offers,
      (SELECT COUNT(*) FROM curriculum_courses) as total_courses
  `;
  console.log('=== TOTALES CONSOLIDADOS ===');
  console.log(totals);

  await sql.end();
}

main().catch(console.error);
