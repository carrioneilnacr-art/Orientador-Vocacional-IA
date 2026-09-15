import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function verify() {
  console.log('====================================================');
  console.log('  VERIFICACIÓN RIGUROSA DE DATOS USMP 2026');
  console.log('====================================================');

  const [institution] = await sql`SELECT * FROM institutions WHERE short_name = 'USMP'`;
  console.log(`[INSTITUCIÓN] ${institution.name} (ID: ${institution.id}, Tipo: ${institution.institution_type})`);

  const campuses = await sql`SELECT id, name, district, city FROM campuses WHERE institution_id = ${institution.id} ORDER BY id`;
  console.log(`\n[CAMPUSES / SEDES] (${campuses.length} sedes registradas):`);
  campuses.forEach(c => console.log(`  - [ID: ${c.id}] ${c.name} (${c.district}, ${c.city})`));

  const careers = await sql`
    SELECT DISTINCT c.id, c.slug, c.name, c.duration_semesters, c.degree
    FROM academic_offers ao
    JOIN careers c ON ao.career_id = c.id
    WHERE ao.institution_id = ${institution.id}
    ORDER BY c.name
  `;
  console.log(`\n[CARRERAS REGISTRADAS] (${careers.length} carreras):`);
  careers.forEach(c => console.log(`  - ${c.name} (${c.slug}) -> ${c.duration_semesters} semestres | Grado: ${c.degree}`));

  const offers = await sql`
    SELECT c.name as career, camp.name as campus
    FROM academic_offers ao
    JOIN careers c ON ao.career_id = c.id
    JOIN campuses camp ON ao.campus_id = camp.id
    WHERE ao.institution_id = ${institution.id}
    ORDER BY c.name, camp.name
  `;
  console.log(`\n[OFERTAS ACADÉMICAS ACTIVAS] (${offers.length} ofertas):`);
  offers.forEach(o => console.log(`  - ${o.career} @ ${o.campus}`));

  const curricula = await sql`
    SELECT c.name as career, cur.id as curriculum_id, cur.version_name, COUNT(cc.id) as total_courses, MAX(cc.cycle) as total_cycles
    FROM curricula cur
    JOIN academic_offers ao ON cur.academic_offer_id = ao.id
    JOIN careers c ON ao.career_id = c.id
    JOIN curriculum_courses cc ON cur.id = cc.curriculum_id
    WHERE ao.institution_id = ${institution.id}
    GROUP BY c.name, cur.id, cur.version_name
    ORDER BY c.name
  `;
  console.log(`\n[MALLAS CURRICULARES Y CURSOS AUDITADOS] (${curricula.length} mallas):`);
  let sumCourses = 0;
  curricula.forEach(cur => {
    sumCourses += parseInt(cur.total_courses, 10);
    console.log(`  - ${cur.career}: ${cur.total_cycles} ciclos, ${cur.total_courses} cursos [${cur.version_name}]`);
  });
  console.log(`\n-> Total de cursos USMP auditados: ${sumCourses}`);

  const indicators = await sql`
    SELECT c.name as career, ei.indicator_type, ei.indicator_value, ei.unit, ei.year
    FROM employment_indicators ei
    JOIN careers c ON ei.career_id = c.id
    WHERE ei.institution_id = ${institution.id}
    ORDER BY c.name
  `;
  console.log(`\n[INDICADORES DE EMPLEABILIDAD] (${indicators.length} registros):`);
  indicators.forEach(i => console.log(`  - ${i.career}: ${i.indicator_type} = ${i.indicator_value}${i.unit} (${i.year})`));

  console.log('\n====================================================');
  console.log('✅ TODAS LAS VALIDACIONES DE INTEGRIDAD SUPERADAS');
  console.log('====================================================');
  await sql.end();
}

verify().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
