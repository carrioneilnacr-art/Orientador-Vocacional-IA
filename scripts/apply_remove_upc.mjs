import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  console.log('=== APLICANDO MIGRACIÓN 012: ELIMINACIÓN DE UPC ===');
  
  const sqlFilePath = path.join(process.cwd(), 'docs', 'architecture', '012_remove_upc_and_focus_lima_norte.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

  await sql.unsafe(sqlContent);
  console.log('✅ Migración 012 ejecutada con éxito.\n');

  console.log('=== VERIFICANDO ESTADO POST-DEPURACIÓN ===');
  const upcInst = await sql`SELECT * FROM institutions WHERE short_name = 'UPC'`;
  console.log('Institución UPC presente:', upcInst.length > 0 ? 'ERROR (aún presente)' : 'CORRECTO (eliminada)');

  const upcCampuses = await sql`SELECT * FROM campuses WHERE name IN ('Monterrico', 'San Isidro', 'San Miguel', 'Villa')`;
  console.log('Campuses de UPC presentes:', upcCampuses.length);

  const [activeInstCount] = await sql`SELECT COUNT(*) as count FROM institutions WHERE is_active = true`;
  console.log(`Instituciones activas restantes: ${activeInstCount.count}`);

  const activeInstitutions = await sql`SELECT id, name, short_name FROM institutions WHERE is_active = true ORDER BY id`;
  console.log('Instituciones en el sistema:');
  activeInstitutions.forEach(i => console.log(`  - [ID: ${i.id}] ${i.name} (${i.short_name})`));

  const [totalOffers] = await sql`SELECT COUNT(*) as count FROM academic_offers`;
  const [totalCourses] = await sql`SELECT COUNT(*) as count FROM curriculum_courses`;
  const [totalCareers] = await sql`SELECT COUNT(*) as count FROM careers`;
  console.log(`\n=== TOTALES GLOBALES ACTUALIZADOS ===`);
  console.log(`Carreras: ${totalCareers.count}`);
  console.log(`Ofertas académicas: ${totalOffers.count}`);
  console.log(`Cursos auditados: ${totalCourses.count}`);

  // Check Lima Norte campuses
  const limaNorteDistricts = ['Los Olivos', 'Comas', 'Independencia', 'San Martín de Porres'];
  const norteCampuses = await sql`
    SELECT c.id, i.short_name, c.name, c.district, c.address
    FROM campuses c
    JOIN institutions i ON c.institution_id = i.id
    WHERE c.district = ANY(${limaNorteDistricts}) OR c.name ILIKE '%norte%' OR c.name ILIKE '%comas%' OR c.name ILIKE '%olivos%'
    ORDER BY i.short_name, c.name
  `;
  console.log(`\n=== SEDES EN LIMA NORTE CONFIRMADAS (${norteCampuses.length}) ===`);
  norteCampuses.forEach(c => {
    console.log(`  - [${c.short_name}] ${c.name} (${c.district}) - ${c.address}`);
  });

  await sql.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
