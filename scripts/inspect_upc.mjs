import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function inspect() {
  const [inst] = await sql`SELECT * FROM institutions WHERE short_name = 'UPC'`;
  if (!inst) {
    console.log('No UPC institution found');
    await sql.end();
    return;
  }
  console.log('UPC institution:', inst);
  const campuses = await sql`SELECT id, name FROM campuses WHERE institution_id = ${inst.id}`;
  console.log('UPC campuses count:', campuses.length, campuses.map(c => c.name));
  
  const offers = await sql`SELECT id, career_id FROM academic_offers WHERE institution_id = ${inst.id}`;
  console.log('UPC offers count:', offers.length);
  
  const offerIds = offers.map(o => o.id);
  if (offerIds.length > 0) {
    const curricula = await sql`SELECT id FROM curricula WHERE academic_offer_id IN ${sql(offerIds)}`;
    console.log('UPC curricula count:', curricula.length);
    const curIds = curricula.map(c => c.id);
    if (curIds.length > 0) {
      const [crs] = await sql`SELECT COUNT(*) as count FROM curriculum_courses WHERE curriculum_id IN ${sql(curIds)}`;
      console.log('UPC courses count:', crs.count);
    }
  }

  const [fees] = await sql`
    SELECT COUNT(tf.id) as count 
    FROM tuition_fees tf 
    JOIN academic_offers ao ON tf.academic_offer_id = ao.id 
    WHERE ao.institution_id = ${inst.id}
  `;
  console.log('UPC tuition fees count:', fees.count);

  const [indicators] = await sql`SELECT COUNT(*) as count FROM employment_indicators WHERE institution_id = ${inst.id}`;
  console.log('UPC indicators count:', indicators.count);

  const [scholarships] = await sql`SELECT COUNT(*) as count FROM scholarships WHERE institution_id = ${inst.id}`;
  console.log('UPC scholarships count:', scholarships.count);

  const [chatK] = await sql`SELECT COUNT(*) as count FROM chat_knowledge WHERE title ILIKE '%UPC%' OR content ILIKE '%UPC%'`;
  console.log('UPC chat_knowledge count:', chatK.count);

  const vrRules = await sql`SELECT id, career_id, explanation_template FROM vocational_rules WHERE explanation_template ILIKE '%UPC%'`;
  console.log('Vocational rules mentioning UPC count:', vrRules.length);
  vrRules.forEach(r => console.log(`  - [ID: ${r.id}] Career ${r.career_id}: ${r.explanation_template}`));

  const [sources] = await sql`SELECT COUNT(*) as count FROM sources WHERE source_name ILIKE '%UPC%'`;
  console.log('UPC sources count:', sources.count);

  const upcCareers = await sql`
    SELECT c.id, c.slug, c.name,
           COUNT(ao.id) as total_offers,
           COUNT(CASE WHEN ao.institution_id = ${inst.id} THEN 1 END) as upc_offers,
           COUNT(CASE WHEN ao.institution_id != ${inst.id} THEN 1 END) as other_offers
    FROM careers c
    LEFT JOIN academic_offers ao ON c.id = ao.career_id
    GROUP BY c.id, c.slug, c.name
    HAVING COUNT(CASE WHEN ao.institution_id = ${inst.id} THEN 1 END) > 0
    ORDER BY c.id
  `;
  console.log('\nCareers with UPC offers:');
  upcCareers.forEach(o => {
    console.log(`  - [ID: ${o.id}] ${o.name} (${o.slug}): UPC offers: ${o.upc_offers}, other university offers: ${o.other_offers}`);
  });

  await sql.end();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
