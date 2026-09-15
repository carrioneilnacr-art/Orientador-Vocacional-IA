import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function check() {
  const allCampuses = await sql`
    SELECT c.id, i.short_name as uni, c.name, c.district, c.city, c.address
    FROM campuses c
    JOIN institutions i ON c.institution_id = i.id
    ORDER BY i.short_name, c.name
  `;

  const limaNorteDistricts = ['los olivos', 'comas', 'independencia', 'san martin de porres', 'puente piedra', 'carabayllo', 'ancon', 'santa rosa'];
  console.log('=== SEDES EN ZONA NORTE DE LIMA ===\n');
  
  const norteCampuses = [];
  const otherCampuses = [];

  for (const c of allCampuses) {
    const isNorte = limaNorteDistricts.some(d => c.district.toLowerCase().includes(d)) || 
                    c.name.toLowerCase().includes('norte') || 
                    c.name.toLowerCase().includes('comas') || 
                    c.name.toLowerCase().includes('olivos') ||
                    c.address.toLowerCase().includes('túpac amaru') ||
                    c.address.toLowerCase().includes('tupac amaru') ||
                    c.address.toLowerCase().includes('alfredo mendiola') ||
                    c.address.toLowerCase().includes('panamericana norte');

    if (isNorte) {
      norteCampuses.push(c);
      console.log(`[${c.uni}] ${c.name} | Distrito: ${c.district} | Dirección: ${c.address}`);
    } else {
      otherCampuses.push(c);
    }
  }

  console.log(`\nTotal sedes Zona Norte: ${norteCampuses.length}`);
  console.log(`Total otras sedes: ${otherCampuses.length}`);

  await sql.end();
}

check().catch(console.error);
