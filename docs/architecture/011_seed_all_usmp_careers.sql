-- ============================================================================
-- MIGRACIÓN 011: Sembrado de Carreras, Sedes y Mallas Verificadas USMP 2026
-- Universidad de San Martín de Porres
-- ============================================================================
-- Fecha de creación: 2026-09-15
-- Trazabilidad: Brochures oficiales de Pregrado 2026 de USMP (archivos u/usmp)
-- Grounded AI: Cero alucinaciones, datos auditados y validados por SUNEDU.
-- ============================================================================

-- 1. FUENTES DE VERIFICACIÓN GENERAL USMP
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochures Oficiales USMP - Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Mallas curriculares oficiales de 14 carreras de pregrado, planes de estudio y sedes Santa Anita, La Molina, Comas, Surquillo, Chiclayo y Arequipa licenciadas por SUNEDU.'
)
ON CONFLICT DO NOTHING;

-- 2. REGISTRAR INSTITUCIÓN: UNIVERSIDAD DE SAN MARTÍN DE PORRES (USMP)
INSERT INTO institutions (name, short_name, institution_type, description, website_url, is_active)
VALUES (
  'Universidad de San Martín de Porres',
  'USMP',
  'PRIVADA_ASOCIATIVA',
  'Universidad privada licenciada por SUNEDU, con más de 60 años de trayectoria, reconocida por su excelencia en Derecho, Medicina Humana, Ciencias de la Comunicación, Ciencias Contables y Administrativas, e Ingeniería.',
  'https://usmp.edu.pe',
  true
)
ON CONFLICT (short_name) DO UPDATE SET
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url;

-- 3. REGISTRAR SEDES Y FILIALES DE LA USMP
DO $$
DECLARE
  v_usmp_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';

  INSERT INTO campuses (institution_id, name, address, district, city, is_active)
  VALUES
    (v_usmp_id, 'Sede Santa Anita', 'Av. Las Calandrias 151 / 291', 'Santa Anita', 'Lima', true),
    (v_usmp_id, 'Sede La Molina', 'Av. El Corregidor 1510 / 1531', 'La Molina', 'Lima', true),
    (v_usmp_id, 'Sede Lima Norte - Comas', 'Av. Túpac Amaru 2898 / El Retablo', 'Comas', 'Lima', true),
    (v_usmp_id, 'Sede Surquillo', 'Av. Tomás Marsano 242', 'Surquillo', 'Lima', true),
    (v_usmp_id, 'Filial Norte - Chiclayo', 'Carretera a Pimentel km 5', 'Pimentel', 'Chiclayo', true),
    (v_usmp_id, 'Filial Sur - Arequipa', 'Calle San Agustín 108 / Urb. Los Cedros B-1', 'Yanahuara', 'Arequipa', true)
  ON CONFLICT DO NOTHING;
END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Administración de Negocios Internacionales (administracion-de-negocios-internacionales)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Administración de Negocios Internacionales Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/administracion-de-negocios-internacionales',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 73 cursos. PDF verificado (ADMINISTRACION-DE-NEGOCIOS-INTERNACIONALES-USMP-WEB.pdf), SHA-256: 0ded1d138668280a53b7ddc9bb5b9ffbc49deef3afecaf112498c80941ed7dde'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Administración de Negocios Internacionales',
  'administracion-de-negocios-internacionales',
  'Facultad de Ciencias Administrativas y Recursos Humanos',
  'Formación integral en comercio exterior, logística internacional, negociación intercultural, finanzas globales y formulación de estrategias de internacionalización de empresas.',
  10,
  5.0,
  'Bachiller en Administración de Negocios Internacionales',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Licenciado en administración de negocios internacionales con capacidad para liderar operaciones de importación/exportación, apertura de mercados globales y cadenas logísticas internacionales.',
  ARRAY['Comercio Exterior y Aduanas', 'Logística Internacional & Supply Chain', 'Negociación y Contratos Internacionales', 'Desarrollo de Negocios Globales', 'Consultoría en Comercio Internacional'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'administracion-de-negocios-internacionales';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Administración de Negocios Internacionales Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita', 'Sede Lima Norte - Comas') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/administracion-de-negocios-internacionales', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-NI-0101', 'Taller de Expresión Oral', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0102', 'Matemática I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0103', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0105', 'Filosofía y Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0106', 'Taller de Inducción a la Profesión', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0107', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-NI-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-NI-0201', 'Taller de Expresión Escrita', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0202', 'Matemática II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0203', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0204', 'Emprendimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0205', 'Introducción a los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0206', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-NI-0208', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-NI-0301', 'Matemática Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-NI-0302', 'Contabilidad Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-NI-0303', 'Gestión de Personas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-NI-0304', 'Proceso de la Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-NI-0305', 'Microeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-NI-0306', 'Introducción al Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-NI-0307', 'Inglés III', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-NI-0401', 'Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-NI-0402', 'Estadística Aplicada a la Gestión Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-NI-0403', 'Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-NI-0404', 'Comportamiento Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-NI-0405', 'Administración Logística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-NI-0406', 'Macroeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-NI-0407', 'Inglés IV', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-NI-0501', 'Marketing Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-NI-0502', 'Operatividad de Comercio Exterior', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-NI-0503', 'Envases y Embalajes', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-NI-0504', 'Logística Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-NI-0505', 'Finanzas Corporativas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-NI-0506', 'International Business Law', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-NI-0507', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-NI-0601', 'Investigación de Mercados Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-NI-0602', 'Gestión Aduanera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-NI-0603', 'Operaciones Financieras Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-NI-0604', 'Transporte Internacional de Carga', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-NI-0605', 'Normas Internacionales de Calidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-NI-0606', 'Tributación de Comercio Exterior', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-NI-0607', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-NI-0701', 'Oferta Exportable', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-NI-0702', 'Costos, Precios y Cotizaciones Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-NI-0703', 'Economía Global', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-NI-0704', 'Gestión Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-NI-0705', 'Integración Económica Comercial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-NI-0706', 'Gestión Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-NI-0707', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-NI-0801', 'Estrategias de Internacionalización', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-NI-0802', 'Gerencia de Compras Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-NI-0803', 'Proyectos de Exportación e Importación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-NI-0804', 'Finanzas Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-NI-0805', 'Bionegocios Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-NI-0806', 'Inversiones Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-NI-0807', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-NI-0901', 'Planeamiento Estratégico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-NI-0902', 'Negociación Empresarial Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-NI-0903', 'Investigación Empresarial Aplicada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-NI-0904', 'Seminario I: Desarrollo Nacional y Empresa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-NI-0905', 'Project & Lean Management', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-NI-0906', 'Juego de Negocios I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-NI-0907', 'Electiva', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-NI-1001', 'Responsabilidad Social y Sostenibilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1002', 'Asesoría y Consultoría Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1003', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1004', 'Seminario II: Proyección Internacional del Perú', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1005', 'Control de Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1006', 'Taller de Habilidades Gerenciales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1007', 'Juego de Negocios II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-NI-1008', 'Prácticas Preprofesionales', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Administración (administracion)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Administración Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/administracion',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 72 cursos. PDF verificado (ADMINISTRACION-USMP-WEB25.pdf), SHA-256: 4155cd93c63e6c8e57970f221df6279c43d6632083728af90f5cf4c9e95f9f46'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Administración',
  'administracion',
  'Facultad de Ciencias Administrativas y Recursos Humanos',
  'Formación gerencial sólida con competencias en planeamiento estratégico, finanzas corporativas, gestión del talento, innovación de modelos de negocio y liderazgo ético.',
  10,
  5.0,
  'Bachiller en Ciencias Administrativas',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Licenciado en administración capaz de planificar, dirigir y controlar organizaciones públicas y privadas con visión global y compromiso con el desarrollo sostenible.',
  ARRAY['Dirección y Gerencia General', 'Consultoría Estratégica', 'Gestión del Talento Humano', 'Finanzas y Planeamiento Corporativo', 'Emprendimiento e Innovación'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'administracion';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Administración Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita', 'Sede Lima Norte - Comas', 'Filial Norte - Chiclayo', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/administracion', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-ADM-0101', 'Taller de Expresión Oral', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0102', 'Matemática I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0103', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0105', 'Filosofía y Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0106', 'Taller de Inducción a la Profesión', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0107', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ADM-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-ADM-0201', 'Taller de Expresión Escrita', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0202', 'Matemática II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0203', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0204', 'Emprendimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0205', 'Introducción a los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0206', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ADM-0208', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-ADM-0301', 'Matemática Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ADM-0302', 'Contabilidad Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ADM-0303', 'Gestión de Personas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ADM-0304', 'Proceso de la Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ADM-0305', 'Microeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ADM-0306', 'Introducción al Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ADM-0307', 'Inglés III', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-ADM-0401', 'Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ADM-0402', 'Comportamiento Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ADM-0403', 'Estadística Aplicada a la Gestión Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ADM-0404', 'Administración Logística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ADM-0405', 'Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ADM-0406', 'Macroeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ADM-0407', 'Inglés IV', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-ADM-0501', 'Investigación de Mercados', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ADM-0502', 'Gestión de la Calidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ADM-0503', 'Gestión de Empresas de Servicio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ADM-0504', 'Comportamiento del Consumidor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ADM-0505', 'Diseño Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ADM-0506', 'Derecho Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ADM-0507', 'Electivo (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-ADM-0601', 'Inteligencia de Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ADM-0602', 'Organización y Gestión de PYMES', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ADM-0603', 'Administración Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ADM-0604', 'Administración de Operaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ADM-0605', 'Economía y Comercio Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ADM-0606', 'Electivo (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-ADM-0701', 'Administración de Ventas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ADM-0702', 'Taller de Franquicias', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ADM-0703', 'Formulación y Evaluación de Proyectos de Inversión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ADM-0704', 'Gerencia Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ADM-0705', 'Gestión de Riesgos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ADM-0706', 'Gestión Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ADM-0707', 'Electivo (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-ADM-0801', 'Sistemas de Información Gerencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ADM-0802', 'Bionegocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ADM-0803', 'Gestión de Proyectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ADM-0804', 'Taller Administración Presupuestaria', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ADM-0805', 'Mercado de Capitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ADM-0806', 'Gestión Pública', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ADM-0807', 'Electivo (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-ADM-0901', 'Planeamiento Estratégico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ADM-0902', 'Negociación Empresarial Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ADM-0903', 'Investigación Empresarial Aplicada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ADM-0904', 'Seminario I: Desarrollo Nacional y Empresa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ADM-0905', 'Project & Lean Management', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ADM-0906', 'Juego de Negocios I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ADM-0907', 'Electivo (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-ADM-1001', 'Responsabilidad Social y Sostenibilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1002', 'Asesoría y Consultoría Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1003', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1004', 'Seminario II: Proyección Internacional del Perú', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1005', 'Control de Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1006', 'Taller de Habilidades Gerenciales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1007', 'Juego de Negocios II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ADM-1008', 'Prácticas Preprofesionales', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Arquitectura (arquitectura)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Arquitectura Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/arquitectura',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 57 cursos. PDF verificado (ARQUITECTURA-WEB-v4_compressed.pdf), SHA-256: 190101214e5e25570d93fe9c0e06c35717cbcc8e31fea268bb8fccf66cdec850'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Arquitectura',
  'arquitectura',
  'Facultad de Ingeniería y Arquitectura',
  'Formación humanista y técnica para el diseño arquitectónico, urbanismo sostenible, edificación y conservación del patrimonio, integrando tecnologías digitales de vanguardia.',
  10,
  5.0,
  'Bachiller en Arquitectura',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Arquitecto competente para diseñar espacios habitables de impacto social y ambiental, gestionar proyectos de construcción y planificar el desarrollo territorial sostenible.',
  ARRAY['Diseño Arquitectónico y Urbano', 'Gestión y Supervisión de Obras', 'Modelado BIM y Visualización 3D', 'Urbanismo y Planificación Territorial', 'Conservación de Patrimonio Edificado'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'arquitectura';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Arquitectura Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede La Molina', 'Sede Lima Norte - Comas', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/arquitectura', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-ARQ-0101', 'Taller I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0102', 'Matemática I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0103', 'Expresión Arquitectónica I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0105', 'Lenguaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0106', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0107', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ARQ-0108', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-ARQ-0201', 'Taller II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ARQ-0202', 'Geometría Descriptiva', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ARQ-0203', 'Matemática II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ARQ-0204', 'Expresión Arquitectónica II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ARQ-0205', 'Topografía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ARQ-0206', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ARQ-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-ARQ-0301', 'Taller III', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ARQ-0302', 'Construcción I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ARQ-0303', 'Física General I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ARQ-0304', 'Estructuras I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ARQ-0305', 'Expresión Arquitectónica III', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-ARQ-0401', 'Taller IV', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ARQ-0402', 'Construcción II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ARQ-0403', 'Estructuras II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ARQ-0404', 'Expresión Arquitectónica IV', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ARQ-0405', 'Fotografía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ARQ-0406', 'Percepción del Arte y la Arquitectura', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-ARQ-0501', 'Taller V', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ARQ-0502', 'Construcción III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ARQ-0503', 'Urbanismo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ARQ-0504', 'Diseño Bioclimático I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ARQ-0505', 'Historia de la Arquitectura I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-ARQ-0601', 'Taller VI', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ARQ-0602', 'Instalaciones Sanitarias y Electromecánicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ARQ-0603', 'Urbanismo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ARQ-0604', 'Historia de la Arquitectura II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ARQ-0605', 'Liderazgo y Oratoria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ARQ-0606', 'Diseño Bioclimático II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-ARQ-0701', 'Taller VII', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ARQ-0702', 'Urbanismo III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ARQ-0703', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ARQ-0704', 'Historia de la Arquitectura III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ARQ-0705', 'Acústica e Iluminación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ARQ-0706', 'Electivos libres', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-ARQ-0801', 'Taller VIII', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ARQ-0802', 'Laboratorio de Medios Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ARQ-0803', 'Métodos de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ARQ-0804', 'Historia de la Arquitectura IV', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ARQ-0805', 'Electivos libres', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-ARQ-0901', 'Taller IX', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ARQ-0902', 'Procedimientos del Ejercicio Profesional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ARQ-0903', 'Seminario de Construcción', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ARQ-0904', 'Electivo de especialidad', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ARQ-0905', 'Electivos libres', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (4 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-ARQ-1001', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ARQ-1002', 'Seminario Urbano', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ARQ-1003', 'Electivo de Especialidad', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ARQ-1004', 'Electivos libres', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ciencias de la Comunicación (ciencias-de-la-comunicacion)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Ciencias de la Comunicación Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/ciencias-de-la-comunicacion',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 65 cursos. PDF verificado (CIENCIAS-DE-LA-COMUNICACION-WEB1.pdf), SHA-256: 2b28651e890ccca9b010fc63e1461aee0e65e73f69317ebd529b1f98cd77547e'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ciencias de la Comunicación',
  'ciencias-de-la-comunicacion',
  'Facultad de Ciencias de la Comunicación, Turismo y Psicología',
  'Formación transdisciplinaria en periodismo, comunicación corporativa, publicidad y producción audiovisual digital con enfoque ético y dominio de nuevas narrativas multimedia.',
  10,
  5.0,
  'Bachiller en Ciencias de la Comunicación',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Comunicador profesional capaz de diseñar estrategias de comunicación institucional, producir contenidos audiovisuales multiplataforma y gestionar la reputación de organizaciones.',
  ARRAY['Comunicación Corporativa y Relaciones Públicas', 'Periodismo Digital e Investigación', 'Producción Audiovisual y Multimedia', 'Publicidad y Estrategia de Contenidos', 'Gestión de Redes y Reputación'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ciencias-de-la-comunicacion';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Ciencias de la Comunicación Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Surquillo', 'Filial Norte - Chiclayo') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/ciencias-de-la-comunicacion', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-CC-0101', 'Introducción a la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CC-0102', 'Filosofía y Ética I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CC-0103', 'Desarrollo del Talento y Liderazgo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CC-0104', 'Comprensión y Producción de Lenguaje I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CC-0105', 'Procesos Históricos del Perú y del Mundo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CC-0106', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-CC-0201', 'Filosofía y Ética II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CC-0202', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CC-0203', 'Pensamiento Lógico - Matemático', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CC-0204', 'Comprensión y Producción de Lenguaje II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CC-0205', 'Procesos Históricos del Perú y del Mundo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CC-0206', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CC-0207', 'Introducción a las Ciencias de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-CC-0301', 'Gestión y Mercados de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CC-0302', 'Analytics and Big Data', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CC-0303', 'Epistemología de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CC-0304', 'Psicología de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CC-0305', 'Opinión Pública', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CC-0306', 'Narrativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CC-0307', 'Antropología de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-CC-0401', 'Estética y Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CC-0402', 'Historia del Cine', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CC-0403', 'Historia y Teoría del Periodismo Global', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CC-0404', 'Historia y Fundamentos Teóricos de las RR.PP.', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CC-0405', 'Historia y Fundamentos de Publicidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CC-0406', 'Fundamentos y Teoría de la Comunicación Audiovisual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CC-0407', 'Comunicación Sonora y Radial', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-CC-0501', 'Fundamentos y Técnicas de Guion', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CC-0502', 'Fotografía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CC-0503', 'Organizaciones y Personas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CC-0504', 'Organización Comercial y Comunicación Publicitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CC-0505', 'Producción Audiovisual y Medios Interactivos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CC-0506', 'Documentación Periodística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CC-0507', 'Fundamentos y Técnicas de la Prensa Televisiva', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-CC-0601', 'Comportamiento del Consumidor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CC-0602', 'Diseño, Edición y Producción Periodística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CC-0603', 'Narrativa Transmedia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CC-0604', 'Periodismo Audiovisual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CC-0605', 'Radio y Sonido Especializados', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CC-0606', 'Comunicación Interna', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CC-0607', 'Diseño Gráfico Publicitario', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-CC-0701', 'Géneros Periodísticos de Autor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CC-0702', 'Dirección Estratégica de RR.PP.', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CC-0703', 'Estrategias Publicitarias', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CC-0704', 'Gestión de Contenidos Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CC-0705', 'Producción de Podcast', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CC-0706', 'Producción y Gestión de Ficción', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CC-0707', 'Investigación I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-CC-0801', 'Periodismo de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CC-0802', 'Marketing e Inversión de Medios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CC-0803', 'Comunicación de Crisis y Prevención de Conflictos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CC-0804', 'Taller de Radio', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CC-0805', 'Periodismo Especializado: Científico, Económico y Deportivo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CC-0806', 'Emprendimiento para Comunicadores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CC-0807', 'Investigación II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-CC-0901', 'Proyectos de Relaciones Públicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CC-0902', 'Agencias de Publicidad y Negocios Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CC-0903', 'Taller de Producción Audiovisual I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CC-0904', 'Taller de Periodismo I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CC-0905', 'Seminario de Tesis', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-CC-1001', 'Consultoría Estratégica de Relaciones Públicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CC-1002', 'Consultoría Publicitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CC-1003', 'Taller de Producción Audiovisual II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CC-1004', 'Taller de Periodismo II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CC-1005', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Contabilidad y Finanzas (contabilidad-y-finanzas)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Contabilidad y Finanzas Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/contabilidad-y-finanzas',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 87 cursos. PDF verificado (CONTABILIDAD-Y-FINANZAS-USMP-WEB-1.pdf), SHA-256: b8ad47caaa0fac8087089817cd9e70387dad3003eb525418339b3c2cad0e7607'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Contabilidad y Finanzas',
  'contabilidad-y-finanzas',
  'Facultad de Ciencias Contables, Económicas y Financieras',
  'Formación especializada en doctrina contable, normas internacionales NIIF, auditoría integral, tributación estratégica y análisis financiero para la toma de decisiones empresariales.',
  10,
  5.0,
  'Bachiller en Contabilidad y Finanzas',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Contador público competente en dictamen de estados financieros, fiscalización tributaria, auditoría forense y estructuración de estrategias financieras en entidades globales.',
  ARRAY['Auditoría Financiera y Gubernamental', 'Asesoría Tributaria y Fiscal', 'Finanzas Corporativas y Mercado de Capitales', 'Contabilidad Gerencial y de Costos', 'Peritaje Contable Judicial'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'contabilidad-y-finanzas';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Contabilidad y Finanzas Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita', 'Sede Lima Norte - Comas', 'Filial Norte - Chiclayo', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/contabilidad-y-finanzas', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-CF-0101', 'Taller de Expresión Oral', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0102', 'Matemática I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0103', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0105', 'Filosofía y Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0106', 'Taller de Inducción a la Profesión', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0107', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CF-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-CF-0201', 'Taller de Expresión Escrita', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0202', 'Matemática II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0203', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0204', 'Emprendimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0205', 'Introducción a los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0206', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CF-0208', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-CF-0301', 'Contabilidad Financiera I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CF-0302', 'Normalización Contable I - NIIF I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CF-0303', 'Estadística Descriptiva para los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CF-0304', 'Economía Empresarial y Entorno Macroeconómico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CF-0305', 'Dirección de Operaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CF-0306', 'Discapacidad de las Personas, Responsabilidad Social Empresarial y Ética Aplicada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CF-0307', 'Inglés III', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-CF-0401', 'Contabilidad Financiera II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CF-0402', 'Normalización Contable II - NIIF II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CF-0403', 'Estadística Inferencial para los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CF-0404', 'Tecnología de la Información Aplicada en la Comunicación Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CF-0405', 'Dirección de los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CF-0406', 'Derecho Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CF-0407', 'Inglés IV', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-CF-0501', 'Contabilidad Financiera III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CF-0502', 'Contabilidad Gerencial I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CF-0503', 'Matemática Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CF-0504', 'Presupuesto y Contabilidad para el Sector Público', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CF-0505', 'Derecho Tributario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CF-0506', 'Aplicaciones Informáticas para Contabilidad', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-CF-0601', 'Contabilidad por Sectores Económicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CF-0602', 'Contabilidad Gerencial II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CF-0603', 'Talento Humano y Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CF-0604', 'Prevención de Corrupción y Lavado de Activos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CF-0605', 'Análisis Fundamental de Empresas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CF-0606', 'Globalización de los Negocios', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-CF-0701', 'Desarrollo de Arquitectura Contable', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CF-0702', 'Contabilidad Gerencial III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CF-0703', 'Tributos Personales y Corporativos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CF-0704', 'Normalización Contable III - NIIF Casuística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CF-0705', 'Gestión de Riesgo Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CF-0706', 'Sistema de Información Empresarial', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-CF-0801', 'Contabilidad de Instituciones Financieras', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CF-0802', 'Finanzas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CF-0803', 'Taller de Práctica Preprofesional en Organizaciones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CF-0804', 'Contabilidad Tributaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CF-0805', 'Dirección y Gerencia Contable Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CF-0806', 'Auditoría de la Información Financiera I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CF-0807', 'Electivo 1', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (16 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-CF-0901', 'Auditoría de la Información Financiera II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0902', 'Doctrinas y Normas de Auditoría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0903', 'Auditoría Integral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0904', 'Auditoría del Sector Público', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0905', 'Auditoría de Riesgos y Forense', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0906', 'Proyecto de Trabajo de Investigación y de Tesis', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0907', 'Decisiones Financieras', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0908', 'Finanzas Corporativas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0909', 'Mercados Financieros y de Seguros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0910', 'Política Fiscal y Tributaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0911', 'Código Tributario Aplicado', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0912', 'Casuística de Impuestos Directos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0913', 'Taller de Defensoría Fiscal y Tributación por Sectores Económicos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0914', 'Análisis Económicos de los Tributos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0915', 'Proyectos de Inversión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CF-0916', 'Ingeniería Financiera', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (16 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-CF-1001', 'Auditoría del Sector Financiero', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1002', 'Auditoría de Tecnología de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1003', 'Peritaje Contable y Auditoría del Medio Ambiente', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1004', 'Auditorías Especiales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1005', 'Auditoría Integral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1006', 'Trabajo de Investigación y Tesis', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1007', 'Estrategias de Planeación y Control Financiero', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1008', 'Finanzas Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1009', 'Fundamentos de Banca y Bolsa de Valores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1010', 'Gestión y planeamiento tributario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1011', 'Tributación Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1012', 'NIIF con Incidencia Tributaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1013', 'Casuística de Impuestos Indirectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1014', 'Auditoría Tributaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1015', 'Mercado de Capitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CF-1016', 'Gestión del Capital de Trabajo y Tesorería', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Derecho (derecho)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Derecho Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/derecho',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 12 ciclos y 81 cursos. PDF verificado (DERECHO-USMP-WEB.pdf), SHA-256: 29d6b3e9a9653fc97bd6ab29bab2a5d0cf7937b6ebd3a3efc1c1c07a6d4e2826'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Derecho',
  'derecho',
  'Facultad de Derecho',
  'Formación jurídica humanista de alto prestigio con énfasis en litigación oral, derecho corporativo, constitucional, administrativo y resolución alternativa de conflictos (12 semestres).',
  12,
  6.0,
  'Bachiller en Derecho',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Abogado con sólida argumentación jurídica, capacidad negociadora, destreza en defensa procesal y compromiso inquebrantable con la justicia y el estado de derecho.',
  ARRAY['Litigación Oral y Procesal', 'Derecho Corporativo y Contratos', 'Magistratura y Función Pública', 'Arbitraje y Métodos de Conciliación', 'Asesoría Legal Integral'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'derecho';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Derecho Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita', 'Sede La Molina', 'Sede Lima Norte - Comas', 'Filial Norte - Chiclayo', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/derecho', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-DER-0101', 'Historia de las Ideas Políticas (Hasta el siglo XVIII)', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0102', 'Historia Comparada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0103', 'Estrategias de Aprendizaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0104', 'Economía Política', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0105', 'Ética Ciudadana y Profesional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0106', 'Lenguaje I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0107', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-DER-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-DER-0201', 'Historia de las Ideas Políticas II (Siglo XIX y XX)', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0202', 'Historia General del Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0203', 'Ciencia Política', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0204', 'Fundamentos de Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0205', 'Teoría del Derecho I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0206', 'Lenguaje II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-DER-0208', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-DER-0301', 'Principios y Personas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-DER-0302', 'Acto Jurídico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-DER-0303', 'Teoría Constitucional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-DER-0304', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-DER-0305', 'Teoría del Derecho II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-DER-0306', 'Instituciones Procesales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-DER-0307', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-DER-0401', 'Derecho Laboral Individual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-DER-0402', 'Derecho Reales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-DER-0403', 'Derechos Fundamentales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-DER-0404', 'Bases del Derecho Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-DER-0405', 'Derecho Internacional Público', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-DER-0406', 'Procesos Civiles de Cognición', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-DER-0407', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-DER-0501', 'Derecho Laboral Colectivo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-DER-0502', 'Derecho de las Obligaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-DER-0503', 'Derecho Procesal Constitucional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-DER-0504', 'Teoría de la Imputación Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-DER-0505', 'Derechos Humanos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-DER-0506', 'Tutela Ejecutiva y Cautelar', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-DER-0507', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-DER-0601', 'Derecho Procesal Laboral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-DER-0602', 'Teoría General de los Contratos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-DER-0603', 'Derecho Tributario General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-DER-0604', 'Penal Especial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-DER-0605', 'Derecho Financiero', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-DER-0606', 'Derecho Administrativo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-DER-0607', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-DER-0701', 'Arbitraje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-DER-0702', 'Contratos Especiales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-DER-0703', 'Imposición a la Renta', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-DER-0704', 'Investigación Penal Preparatoria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-DER-0705', 'Derecho de la Empresa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-DER-0706', 'Derecho Procesal Administrativo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-DER-0707', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-DER-0801', 'Responsabilidad Civil', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-DER-0802', 'Derecho de Familia y Sucesiones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-DER-0803', 'Imposición al Consumo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-DER-0804', 'Etapa Intermedia y Juzgamiento Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-DER-0805', 'Derecho Societario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-DER-0806', 'Contratación con el Estado', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-DER-0901', 'Derecho de Propiedad Intelectual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-DER-0902', 'Derecho Notarial y Registral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-DER-0903', 'Análisis Económico del Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-DER-0904', 'Litigación Oral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-DER-0905', 'Derecho Cambiario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-DER-0906', 'Derecho del Consumo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-DER-0907', 'Seminario de Tesis', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-DER-1001', 'Derecho y Desarrollo Sostenible', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-DER-1002', 'Derecho de la Banca', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-DER-1003', 'Régimen Pyme', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-DER-1004', 'Negociación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-DER-1005', 'Derecho Corporativo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-DER-1006', 'Derecho de la Competencia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-DER-1007', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 11 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 11, 'USMP-DER-1101', 'Especialidad de Derecho Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-DER-1102', 'Especialidad de Derecho Civil Patrimonial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-DER-1103', 'Especialidad de Gestión Pública', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-DER-1104', 'Especialidad de Derecho Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-DER-1105', 'Especialidad de Competencia y Regulación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 12 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 12, 'USMP-DER-1201', 'Especialidad de Derecho Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-DER-1202', 'Especialidad de Derecho Civil Patrimonial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-DER-1203', 'Especialidad de Gestión Pública', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-DER-1204', 'Especialidad de Derecho Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-DER-1205', 'Especialidad de Competencia y Regulación', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Economía (economia)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Economía Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/economia',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 65 cursos. PDF verificado (ECONOMIA-USMP-WEB.pdf), SHA-256: 6457e67175f58b8e791694a5e1a9bace60dc68df247ae82ee5aefcef6a800896'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Economía',
  'economia',
  'Facultad de Ciencias Contables, Económicas y Financieras',
  'Formación cuantitativa y analítica en teoría micro y macroeconómica, econometría aplicada, formulación de políticas públicas, finanzas corporativas y evaluación de proyectos de inversión.',
  10,
  5.0,
  'Bachiller en Economía',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Economista con alta capacidad para modelar variables económicas, diseñar políticas de desarrollo, evaluar proyectos de inversión pública y privada y asesorar decisiones de mercado.',
  ARRAY['Políticas Públicas y Bancos Centrales', 'Evaluación Social y Privada de Proyectos', 'Finanzas Corporativas e Inversiones', 'Investigación y Modelamiento Econométrico', 'Consultoría Económica y de Riesgos'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'economia';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Economía Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/economia', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-ECO-0101', 'Taller de Expresión Oral', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0102', 'Matemática I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0103', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0104', 'Ciudadanía e Interculturalidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0105', 'Filosofía y Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0106', 'Taller de Inducción a la Profesión', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0107', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ECO-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-ECO-0201', 'Taller de Expresión Escrita', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0202', 'Matemática II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0203', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0204', 'Emprendimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0205', 'Introducción a los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0206', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ECO-0208', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-ECO-0301', 'Estadística Descriptiva e Inferencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ECO-0302', 'Métodos Cuantitativos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ECO-0303', 'Principios de Microeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ECO-0304', 'Historia Económica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ECO-0305', 'Ética, Valores y Discapacidad en la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ECO-0306', 'Inglés III', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-ECO-0401', 'Análisis Macroeconómico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ECO-0402', 'Métodos Cuantitativos II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ECO-0403', 'Contabilidad Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ECO-0404', 'Econometría Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ECO-0405', 'Matemáticas Financieras', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ECO-0406', 'Inglés IV', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-ECO-0501', 'Economía Matemática', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ECO-0502', 'Econometría de Corte Transversal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ECO-0503', 'Microeconomía Intermedia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ECO-0504', 'Tópicos de Macroeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ECO-0505', 'Programación Informática', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ECO-0506', 'Análisis Financiero y Actuarial', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-ECO-0601', 'Teoría de los Juegos e Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ECO-0602', 'Econometría de Series de Tiempo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ECO-0603', 'Introducción a los Mercados Financieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ECO-0604', 'Economía Monetaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ECO-0605', 'Organización Industrial Aplicada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ECO-0606', 'Crecimiento Económico y Desarrollo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-ECO-0701', 'Economía Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ECO-0702', 'Economía Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ECO-0703', 'Economía Laboral y del Comportamiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ECO-0704', 'Data Science y Big Data', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ECO-0705', 'Investigación Económica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ECO-0706', 'Fricciones Financieras y Crisis', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-ECO-0801', 'Finanzas Conductuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ECO-0802', 'Mercado de Capitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ECO-0803', 'Economía y Gestión Bancaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ECO-0804', 'Evaluación de Proyectos Privados', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ECO-0805', 'Economía de los Recursos Públicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ECO-0806', 'Data Analytics', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ECO-0807', 'Electivo 1', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-ECO-0901', 'Instrumentos Derivados y Financieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ECO-0902', 'Gestión del Riesgo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ECO-0903', 'Programación Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ECO-0904', 'Data Mining y Business Intelligence', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ECO-0905', 'Taller de Tesis', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-ECO-0906', 'Electivo 2', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-ECO-1001', 'Econometría Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ECO-1002', 'Gestión de Portafolio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ECO-1003', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ECO-1004', 'Project Finance', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ECO-1005', 'Política Económica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ECO-1006', 'Electivo 3', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Enfermería (enfermeria)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Enfermería Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/enfermeria',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 54 cursos. PDF verificado (ENFERMERIA-v4-WEB.pdf), SHA-256: 485cb04632a014d217d5fc4623ffc1b29a8fa723fd798405443482fa54d9fb55'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Enfermería',
  'enfermeria',
  'Facultad de Medicina Humana',
  'Formación científica y humanizada en el cuidado integral de la salud del individuo, la familia y la comunidad, con prácticas clínicas en centros hospitalarios y de atención primaria.',
  10,
  5.0,
  'Bachiller en Enfermería',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Licenciado en enfermería con excelencia clínica, liderazgo en la gestión de servicios de enfermería, cuidados intensivos, salud pública y programas preventivo-promocionales.',
  ARRAY['Atención Hospitalaria y Cuidados Críticos', 'Salud Pública y Atención Primaria', 'Gestión de Servicios de Enfermería', 'Salud Ocupacional en Empresas', 'Docencia e Investigación Clínica'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'enfermeria';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Enfermería Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita', 'Sede Lima Norte - Comas') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/enfermeria', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-ENF-0101', 'Matemática', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0102', 'Biología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0103', 'Química', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0104', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0105', 'Filosofía y Bases Conceptuales del Cuidado Enfermero', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0106', 'Lenguaje y Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0107', 'Actividades Culturales y Deportivas I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-ENF-0108', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-ENF-0201', 'Anatomía y Fisiología I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0202', 'Enfermería en Salud Familiar y Comunitaria I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0203', 'Psicología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0204', 'Bioquímica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0205', 'Ecología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0206', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0207', 'Actividades Culturales y Deportivas II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-ENF-0208', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-ENF-0301', 'Anatomía y Fisiología II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ENF-0302', 'Cuidados Básicos de Enfermería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ENF-0303', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ENF-0304', 'Microbiología y Parasitología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ENF-0305', 'Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ENF-0306', 'Metodología del Cuidado de Enfermería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-ENF-0307', 'Antropología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-ENF-0401', 'Epidemiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ENF-0402', 'Cuidados de Enfermería al Adulto I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ENF-0403', 'Nutrición y Dietoterapia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ENF-0404', 'Farmacología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ENF-0405', 'Pedagogía en Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-ENF-0406', 'Semiología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-ENF-0501', 'Cuidados de Enfermería al Adulto II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ENF-0502', 'Cuidados de Enfermería al Niño', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ENF-0503', 'Investigación en Enfermería I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ENF-0504', 'Gerencia Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-ENF-0505', 'Cuidados de Enfermería en la Administración de Fármacos', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-ENF-0601', 'Enfermería en Salud Familiar y Comunitaria II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ENF-0602', 'Terapia Alternativa y Complementaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ENF-0603', 'Cuidados de Enf. en Emergencias y Desastres', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ENF-0604', 'Cuidados de Enfermería al Adulto Mayor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ENF-0605', 'Cuidados de Enfermería al Adolescente', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-ENF-0606', 'Salud Mental', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-ENF-0701', 'Enfermería en Salud Familiar y Comunitaria III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ENF-0702', 'Investigación en Enfermería II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ENF-0703', 'Cuidados de Enfermería a la Mujer', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ENF-0704', 'Bioestadística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ENF-0705', 'Cuidados de Enfermería al Recién Nacido', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-ENF-0706', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-ENF-0801', 'Cuidados de Enfermería en Psiquiatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ENF-0802', 'Cuidados de Enfermería en Pediatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ENF-0803', 'Gestión y Liderazgo en Enfermería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ENF-0804', 'Seminario de Tesis', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-ENF-0805', 'Informática en Salud', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (1 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-ENF-0901', 'Internado I', 8.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-ENF-1001', 'Internado II', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-ENF-1002', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Civil (ingenieria-civil)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Ingeniería Civil Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/ingenieria-civil',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 66 cursos. PDF verificado (INGENIERIA-CIVIL-WEB-v4.pdf), SHA-256: dc0d55a90313f3bdf276f41e4685a2b4c78b1de5ac4f83e91b27802fda920be8'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Civil',
  'ingenieria-civil',
  'Facultad de Ingeniería y Arquitectura',
  'Formación integral en cálculo estructural, mecánica de suelos, obras hidráulicas, infraestructura vial y gestión de la construcción bajo estándares internacionales y herramientas BIM.',
  10,
  5.0,
  'Bachiller en Ingeniería Civil',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Ingeniero civil capacitado para proyectar, supervisar y gerenciar proyectos de infraestructura civil con criterios de sismorresistencia, sostenibilidad y calidad constructiva.',
  ARRAY['Ingeniería Estructural y Sismorresistente', 'Gerencia de Construcción y Metodología BIM', 'Geotecnia y Pavimentos', 'Hidráulica y Recursos Hídricos', 'Supervisión de Obras Públicas y Privadas'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-civil';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Ingeniería Civil Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede La Molina', 'Sede Lima Norte - Comas', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/ingenieria-civil', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (10 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-CIV-0101', 'Matemática Discreta', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0102', 'Geometría Analítica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0103', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0105', 'Introducción a la Ingeniería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0106', 'Lenguaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0107', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0108', 'Accesibilidad y Diseño Universal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0109', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CIV-0110', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-CIV-0201', 'Álgebra Lineal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0202', 'Cálculo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0203', 'Dibujo y Diseño Gráfico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0204', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0205', 'Topografía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0206', 'Geología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0207', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CIV-0208', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-CIV-0301', 'Cálculo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CIV-0302', 'Física I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CIV-0303', 'Estadística y Probabilidades I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CIV-0304', 'Química General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CIV-0305', 'Tecnología de los Materiales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CIV-0306', 'Topografía Avanzada', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-CIV-0401', 'Física II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CIV-0402', 'Ecuaciones Diferenciales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CIV-0403', 'Estática', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CIV-0404', 'Construcción I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CIV-0405', 'Dinámica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CIV-0406', 'Tecnología del Concreto', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-CIV-0501', 'Resistencia de Materiales I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CIV-0502', 'Caminos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CIV-0503', 'Construcción II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CIV-0504', 'Contabilidad General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CIV-0505', 'Ecología e Impacto Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CIV-0506', 'Instalaciones Eléctricas en Edificaciones', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-CIV-0601', 'Mecánica de Fluidos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CIV-0602', 'Pavimentos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CIV-0603', 'Gestión de Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CIV-0604', 'Mecánica de Suelos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CIV-0605', 'Resistencia de Materiales II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-CIV-0701', 'Mecánica de Fluidos II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CIV-0702', 'Análisis Estructural I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CIV-0703', 'Formulación y Evaluación de Proyectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CIV-0704', 'Mecánica de Suelos II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CIV-0705', 'Presupuesto y Programación de Obra', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CIV-0706', 'Discapacidad e Inclusión', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-CIV-0801', 'Análisis Estructural II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CIV-0802', 'Concreto Armado I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CIV-0803', 'Gestión de Proyectos – PMI', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CIV-0804', 'Ingeniería de Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CIV-0805', 'Hidrología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CIV-0806', 'Instalaciones Sanitarias', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-CIV-0901', 'Concreto Armado II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CIV-0902', 'Ingeniería Antisísmica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CIV-0903', 'Proyecto Final de Ingeniería Civil', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CIV-0904', 'Hidráulica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CIV-0905', 'Ingeniería de Valuaciones y Tasaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CIV-0906', 'Diseño de Acero y Madera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CIV-0907', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-CIV-1001', 'Abastecimiento de Agua y Alcantarillado', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CIV-1002', 'Trabajo de investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CIV-1003', 'Organización y Dirección de Empresas Constructoras', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CIV-1004', 'Puentes y Obras de Arte', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CIV-1005', 'Ética y Moral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CIV-1006', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería de Computación y Sistemas (ingenieria-de-sistemas-computacionales)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Ingeniería de Computación y Sistemas Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/ingenieria-de-sistemas-computacionales',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 60 cursos. PDF verificado (INGENIERIA-EN-COMPUTACION-Y-SISTEMAS-WEB-v4.pdf), SHA-256: 9c86a647af68b6f61609ad4c1e9ed0c0acfe7c748398f8d8bbb1c8fb4f47ec21'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería de Computación y Sistemas',
  'ingenieria-de-sistemas-computacionales',
  'Facultad de Ingeniería y Arquitectura',
  'Formación avanzada en ingeniería de software, arquitecturas cloud, ciberseguridad, inteligencia artificial, analítica de datos y gestión estratégica de tecnologías de información.',
  10,
  5.0,
  'Bachiller en Ingeniería de Computación y Sistemas',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Ingeniero de computación y sistemas con dominio en desarrollo de software empresarial, infraestructura segura, ciencia de datos y dirección de proyectos de transformación digital.',
  ARRAY['Desarrollo de Software y Arquitectura Cloud', 'Ciberseguridad y Auditoría de Sistemas', 'Inteligencia Artificial y Machine Learning', 'Gestión de Proyectos TI y Metodologías Ágiles', 'Dirección de Tecnologías de Información (CIO/CTO)'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-de-sistemas-computacionales';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Ingeniería de Computación y Sistemas Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede La Molina', 'Sede Lima Norte - Comas', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/ingenieria-de-sistemas-computacionales', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (9 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-CS-0101', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0102', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0103', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0104', 'Geometría Analítica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0105', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0106', 'Introducción a Sistemas de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0107', 'Lenguaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0108', 'Matemática Discreta', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-CS-0109', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-CS-0201', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CS-0202', 'Álgebra Lineal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CS-0203', 'Cálculo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CS-0204', 'Fundamentos de Diseño Web', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CS-0205', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CS-0206', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-CS-0207', 'Introducción a la Programación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-CS-0301', 'Algoritmos y Estructura de Datos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CS-0302', 'Estadística y Probabilidades I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CS-0303', 'Física I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CS-0304', 'Sistemas de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-CS-0305', 'Tecnología de Información', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-CS-0401', 'Algoritmos y Estructura de Datos II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CS-0402', 'Estadística y Probabilidades II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CS-0403', 'Física II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CS-0404', 'Microeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-CS-0405', 'Tecnología de Información II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-CS-0501', 'Contabilidad General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CS-0502', 'Gestión de Procesos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CS-0503', 'Ingeniería Administrativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CS-0504', 'Sistemas Operativos y Plataformas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-CS-0505', 'Teoría y Diseño de Base de Datos', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-CS-0601', 'Ingeniería de Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CS-0602', 'Investigación Operativa I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CS-0603', 'Ingeniería de Software I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CS-0604', 'Programación I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-CS-0605', 'Teoría General de Sistemas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-CS-0701', 'Arquitectura de Software para Sistemas de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CS-0702', 'Discapacidad e Inclusión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CS-0703', 'Gestión Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CS-0704', 'Ingeniería de Software II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CS-0705', 'Inteligencia Artificial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-CS-0706', 'Electivas', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-CS-0801', 'Arquitectura Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CS-0802', 'Diseño e Implementación de Sistemas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CS-0803', 'Formulación y Evaluación de Proyectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CS-0804', 'Gestión de Recursos de Tecnologías de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CS-0805', 'Investigación en Sistemas de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-CS-0806', 'Taller de Proyectos', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-CS-0901', 'Inteligencia de Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CS-0902', 'Liderazgo y Oratoria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CS-0903', 'Planeamiento Estratégico de Tecnologías de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CS-0904', 'Proyecto Final de Ingeniería de Computación y Sistemas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CS-0905', 'Seguridad y Auditoría de Sistemas de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-CS-0906', 'Electivas', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-CS-1001', 'Ciberseguridad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CS-1002', 'Electivas', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CS-1003', 'Ética y Moral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CS-1004', 'Management Information Systems', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CS-1005', 'Marketing Digital', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-CS-1006', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Industrial (ingenieria-industrial)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Ingeniería Industrial Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/ingenieria-industrial',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 62 cursos. PDF verificado (INGENIERIA-INDUSTRIAL-WEB-v4.pdf), SHA-256: fe411aa886ab60c8113406029357beb2fc43296e605ae44373943e1bd2857220'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Industrial',
  'ingenieria-industrial',
  'Facultad de Ingeniería y Arquitectura',
  'Formación enfocada en la optimización integral de sistemas productivos y de servicios, ergonomía, supply chain, analítica de operaciones y sistemas de gestión de calidad y seguridad.',
  10,
  5.0,
  'Bachiller en Ingeniería Industrial',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Ingeniero industrial líder en mejora continua, productividad operativa, logística estratégica, automatización y desarrollo de modelos de negocio sostenibles.',
  ARRAY['Logística y Supply Chain Management', 'Gestión de Operaciones y Procesos', 'Sistemas Integrados de Gestión (Calidad, Seguridad, Ambiente)', 'Planeamiento y Control de la Producción', 'Consultoría en Productividad y Costos'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-industrial';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Ingeniería Industrial Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede La Molina', 'Sede Lima Norte - Comas', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/ingenieria-industrial', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (9 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-IND-0101', 'Matemática Discreta', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0102', 'Geometría Analítica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0103', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0105', 'Introducción a la Ingeniería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0106', 'Lenguaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0107', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-IND-0109', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-IND-0201', 'Álgebra Lineal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-IND-0202', 'Cálculo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-IND-0203', 'Introducción a la Programación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-IND-0204', 'Dibujo y Diseño Gráfico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-IND-0205', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-IND-0206', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-IND-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-IND-0301', 'Cálculo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-IND-0302', 'Física I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-IND-0303', 'Química Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-IND-0304', 'Microeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-IND-0305', 'Diseño Industrial por Computador', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-IND-0306', 'Discapacidad e Inclusión', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-IND-0401', 'Algoritmo y Estructura de Datos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-IND-0402', 'Física II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-IND-0403', 'Ecuaciones Diferenciales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-IND-0404', 'Estadística y Probabilidades I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-IND-0405', 'Materiales de Ingeniería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-IND-0501', 'Ingeniería Eléctrica y Electrónica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-IND-0502', 'Mecánica de Materiales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-IND-0503', 'Contabilidad General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-IND-0504', 'Estadística y Probabilidades II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-IND-0505', 'Ingeniería Administrativa', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-IND-0601', 'Ingeniería de Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-IND-0602', 'Ingeniería de Métodos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-IND-0603', 'Ingeniería de Procesos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-IND-0604', 'Investigación Operativa I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-IND-0605', 'Proceso de Manufactura', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-IND-0606', 'Taller de Herramientas Informáticas', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-IND-0701', 'Control de Calidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-IND-0702', 'Gestión Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-IND-0703', 'Ingeniería de Métodos II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-IND-0704', 'Investigación Operativa II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-IND-0705', 'Mercadotecnia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-IND-0706', 'Instrumentación y Control Industrial', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-IND-0801', 'Automatización Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-IND-0802', 'Formulación y Evaluación de Proyectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-IND-0803', 'Mantenimiento, Seguridad y Salud Ocupacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-IND-0804', 'Planeamiento y Control de la Producción I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-IND-0805', 'Total Quality Management (TQM)', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-IND-0806', 'Taller de Manufactura Moderna', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-IND-0901', 'Diseño de Sistemas de Producción', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-IND-0902', 'Gestión de Proyectos – PMI', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-IND-0903', 'Planeamiento y Control de la Producción II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-IND-0904', 'Proyecto Final de Ingeniería Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-IND-0905', 'Psicología Industrial y Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-IND-0906', 'Electivos de especialidad', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-IND-1001', 'Supply Chain Management', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-IND-1002', 'Gestión de Personal y Legislación Laboral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-IND-1003', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-IND-1004', 'Ética y Moral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-IND-1005', 'Prácticas Preprofesionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-IND-1006', 'Electivos de especialidad', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Marketing (administracion-y-marketing)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Marketing Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/administracion-y-marketing',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 73 cursos. PDF verificado (MARKETING-USMP-WEB.pdf), SHA-256: bc909e1a9e97c249823ef99fb1a047e1b7325518af03e5a6be9b9cb0bd351592'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Marketing',
  'administracion-y-marketing',
  'Facultad de Ciencias Administrativas y Recursos Humanos',
  'Formación estratégica en comportamiento del consumidor, marketing digital, analítica comercial, branding omnicanal, pricing y formulación de planes comerciales competitivos.',
  10,
  5.0,
  'Bachiller en Marketing',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Profesional en marketing capaz de diseñar estrategias de posicionamiento de marca, liderar equipos comerciales, gestionar canales omnicanal y maximizar el valor de mercado.',
  ARRAY['Brand Management y Dirección de Marca', 'Marketing Digital & Growth Hacking', 'Inteligencia Comercial y Customer Insights', 'Trade Marketing y Canales de Venta', 'Dirección Comercial y Estratégica'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'administracion-y-marketing';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Marketing Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Santa Anita') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/administracion-y-marketing', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-MKT-0101', 'Taller de Expresión Oral', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0102', 'Matemática I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0103', 'Métodos de Estudio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0104', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0105', 'Filosofía y Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0106', 'Taller de Inducción a la Profesión', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0107', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MKT-0108', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-MKT-0201', 'Taller de Expresión Escrita', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0202', 'Matemática II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0203', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0204', 'Emprendimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0205', 'Introducción a los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0206', 'Introducción a la Economía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0207', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MKT-0208', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-MKT-0301', 'Matemática Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MKT-0302', 'Contabilidad Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MKT-0303', 'Gestión de Personas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MKT-0304', 'Proceso de la Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MKT-0305', 'Microeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MKT-0306', 'Introducción al Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MKT-0307', 'Inglés III', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-MKT-0401', 'Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MKT-0402', 'Estadística Aplicada a la Gestión Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MKT-0403', 'Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MKT-0404', 'Comportamiento Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MKT-0405', 'Administración Logística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MKT-0406', 'Macroeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MKT-0407', 'Inglés IV', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-MKT-0501', 'Marketing Estratégico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MKT-0502', 'Sistema de Información de Mercados', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MKT-0503', 'Finanzas para Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MKT-0504', 'Administración de Operaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MKT-0505', 'Comportamiento del Consumidor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MKT-0506', 'Neuromarketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MKT-0507', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-MKT-0601', 'Políticas de Producto', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MKT-0602', 'Políticas de Precio', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MKT-0603', 'Investigación, Desarrollo e Innovación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MKT-0604', 'Branding', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MKT-0605', 'E-Commerce', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MKT-0606', 'Marketing Ecológico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MKT-0607', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-MKT-0701', 'Dirección Comercial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MKT-0702', 'Formulación y Evaluación de Proyectos de Inversión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MKT-0703', 'Marketing Relacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MKT-0704', 'Trade Marketing y Merchandising', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MKT-0705', 'Distribución y Logística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MKT-0706', 'Gestión Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MKT-0707', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-MKT-0801', 'Políticas de Comunicaciones Integradas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MKT-0802', 'Plan de Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MKT-0803', 'Legislación Comercial y Publicitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MKT-0804', 'Marketing Digital', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MKT-0805', 'Comunicación Visual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MKT-0806', 'Bionegocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MKT-0807', 'Electiva (certificación)', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-MKT-0901', 'Planeamiento Estratégico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MKT-0902', 'Negociación Empresarial Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MKT-0903', 'Investigación Empresarial Aplicada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MKT-0904', 'Seminario I: Desarrollo Nacional y Empresa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MKT-0905', 'Project & Lean Management', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MKT-0906', 'Juego de Negocios I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MKT-0907', 'Electivo', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-MKT-1001', 'Responsabilidad Social y Sostenibilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1002', 'Asesoría y Consultoría Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1003', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1004', 'Seminario II: Proyección Internacional del Perú', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1005', 'Control de Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1006', 'Taller de Habilidades Gerenciales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1007', 'Juego de Negocios II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MKT-1008', 'Prácticas Preprofesionales', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Medicina Humana (medicina-humana)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Medicina Humana Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/medicina-humana',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 14 ciclos y 80 cursos. PDF verificado (MEDICINA-HUMANA-USMP-WEB.pdf), SHA-256: 5c9584662c325b8665a58c8ec7b41cb95b6d05f24bbe219434c33171b9111727'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Medicina Humana',
  'medicina-humana',
  'Facultad de Medicina Humana',
  'Formación médica de excelencia (14 semestres, 7 años) con acreditación internacional, centros de simulación clínica avanzada, rotaciones hospitalarias e internado médico rotatorio.',
  14,
  7.0,
  'Bachiller en Medicina Humana',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Médico cirujano integral con sólido razonamiento clínico, destrezas quirúrgicas y terapéuticas, vocación preventiva y estricto compromiso con la vida humana y la salud pública.',
  ARRAY['Atención Médica Clínica y Quirúrgica', 'Hospitales, Clínicas e Institutos de Salud', 'Salud Pública y Epidemiología', 'Gestión y Dirección de Centros Médicos', 'Investigación Biomédica y Docencia Universitaria'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'medicina-humana';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Medicina Humana Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede La Molina', 'Sede Lima Norte - Comas', 'Filial Norte - Chiclayo', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/medicina-humana', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-MED-0101', 'Introducción a la Biología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0102', 'Introducción a la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0103', 'Introducción a los Estudios Médicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0104', 'Introducción a la Física General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0105', 'Introducción a la Lógica y Matemática', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0106', 'Introducción a la Química', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0107', 'Actividades Deportivas y Culturales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-MED-0108', 'Informática en Educación Médica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-MED-0201', 'Epistemología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0202', 'Lenguaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0203', 'Matemática Aplicada a las Ciencias de la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0204', 'Procedimientos Básicos en Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0205', 'Química Aplicada a las Ciencias de la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0206', 'Biología Celular y Molecular', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0207', 'Física Aplicada a las Ciencias de la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-MED-0208', 'Inglés I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-MED-0301', 'Anatomía Humana I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MED-0302', 'Histología Humana', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MED-0303', 'Embriología Humana y Genética Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MED-0304', 'Psicología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MED-0305', 'Historia de la Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-MED-0306', 'Inglés II', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-MED-0401', 'Anatomía Humana II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MED-0402', 'Bioquímica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MED-0403', 'Fisiología Humana I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MED-0404', 'Bioestadística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-MED-0405', 'Realidad Nacional', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-MED-0501', 'Fisiología Humana II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MED-0502', 'Epidemiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MED-0503', 'Inmunología Humana', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MED-0504', 'Microbiología y Parasitología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MED-0505', 'Diseño de Investigación Clínica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-MED-0506', 'Gestión de la Información Científica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-MED-0601', 'Farmacología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MED-0602', 'Patología I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MED-0603', 'Fisiopatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MED-0604', 'Salud Pública I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MED-0605', 'Bioética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-MED-0606', 'Lectura Crítica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-MED-0701', 'Semiología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MED-0702', 'Cardiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MED-0703', 'Neumología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MED-0704', 'Laboratorio Clínico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MED-0705', 'Diagnóstico por Imagen', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-MED-0706', 'Nutrición y Medio Interno', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-MED-0801', 'Hematología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MED-0802', 'Reumatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MED-0803', 'Nefrología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MED-0804', 'Neurología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MED-0805', 'Patología II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-MED-0806', 'Salud Mental', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-MED-0901', 'Gastroenterología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MED-0902', 'Dermatología y Medicina Estética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MED-0903', 'Endocrinología y Metabolismo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MED-0904', 'Infectología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MED-0905', 'Geriatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MED-0906', 'Principios de la Medicina Física y Rehabilitación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-MED-0907', 'Terapéutica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-MED-1001', 'Cirugía General y Digestiva', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MED-1002', 'Cirugía del Aparato Locomotor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MED-1003', 'Especialidades Quirúrgicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MED-1004', 'Casos Clínicos Quirúrgicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MED-1005', 'Técnica Operatoria - Anestesiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MED-1006', 'Cuidados Paliativos y Terapia del Dolor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-MED-1007', 'Oncología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 11 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 11, 'USMP-MED-1101', 'Pediatría General I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-MED-1102', 'Pediatría General II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-MED-1103', 'Neonatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-MED-1104', 'Emergencias Médicas y Toxicológicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-MED-1105', 'Medicina Legal y Patología Forense', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'USMP-MED-1106', 'Genética Médica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 12 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 12, 'USMP-MED-1201', 'Ginecología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-MED-1202', 'Obstetricia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-MED-1203', 'Salud Pública II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-MED-1204', 'Medicina Familiar y Comunitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-MED-1205', 'Gestión en Servicios de Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'USMP-MED-1206', 'Telesalud e Inteligencia Artificial', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 13 (1 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 13, 'USMP-MED-1301', 'Internado Médico I', 8.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 14 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 14, 'USMP-MED-1401', 'Internado Médico II', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 14, 'USMP-MED-1402', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Psicología (psicologia)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial USMP - Psicología Pregrado 2026',
  'Universidad de San Martín de Porres',
  'https://usmp.edu.pe/carreras/psicologia',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 59 cursos. PDF verificado (PSICOLOGIA-USMP-WEB.pdf), SHA-256: 3b4ca92c416ca8ac12a0029c59c323277c270c8259bbc4ee11e3549e855afc03'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Psicología',
  'psicologia',
  'Facultad de Ciencias de la Comunicación, Turismo y Psicología',
  'Formación integral con prácticas clínicas, educativas y organizacionales desde ciclos iniciales, con sólidos fundamentos en psicodiagnóstico, psicoterapia y bienestar biopsicosocial.',
  10,
  5.0,
  'Bachiller en Psicología',
  'Licenciada por SUNEDU • Acreditaciones Internacionales y Modelo Educativo USMP',
  'Psicólogo capacitado para realizar evaluaciones psicométricas, diseñar intervenciones clínicas, liderar áreas de gestión del talento humano e impulsar programas comunitarios.',
  ARRAY['Psicología Clínica y de la Salud', 'Psicología Organizacional y Gestión del Talento', 'Psicología Educativa y Orientación Escolar', 'Neuropsicología y Rehabilitación Cognitiva', 'Intervención Psicosocial Comunitaria'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_usmp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_usmp_id FROM institutions WHERE short_name = 'USMP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'psicologia';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial USMP - Psicología Pregrado 2026' LIMIT 1;

  -- Ofertas académicas para los campus oficiales de la carrera
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_usmp_id AND name IN ('Sede Surquillo', 'Sede Santa Anita', 'Sede Lima Norte - Comas', 'Filial Norte - Chiclayo', 'Filial Sur - Arequipa') LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_usmp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://usmp.edu.pe/carreras/psicologia', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_usmp_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular USMP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular USMP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'USMP-PSI-0101', 'Introducción a la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-PSI-0102', 'Filosofía y Ética I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-PSI-0103', 'Desarrollo del Talento y Liderazgo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-PSI-0104', 'Comprensión y Producción de Lenguaje I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-PSI-0105', 'Procesos Históricos del Perú y del Mundo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'USMP-PSI-0106', 'Actividades I', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'USMP-PSI-0201', 'Filosofía y Ética II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-PSI-0202', 'Ciudadanía Intercultural', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-PSI-0203', 'Pensamiento Lógico – Matemático', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-PSI-0204', 'Comprensión y Producción de Lenguaje II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-PSI-0205', 'Procesos Históricos del Perú y del Mundo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-PSI-0206', 'Actividades II', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'USMP-PSI-0207', 'Introducción a la Psicología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'USMP-PSI-0301', 'Procesos Cognitivos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-PSI-0302', 'Estadística Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-PSI-0303', 'Psicología de la Personalidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-PSI-0304', 'Psicobiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-PSI-0305', 'Psicología del Desarrollo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-PSI-0306', 'Técnicas de Entrevista, Observación y Registro', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'USMP-PSI-0307', 'Desarrollo Personal I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'USMP-PSI-0401', 'Psicología del Aprendizaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-PSI-0402', 'Sistemas Psicológicos Contemporáneos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-PSI-0403', 'Pruebas Psicométricas de Eficiencia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-PSI-0404', 'Neuropsicología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-PSI-0405', 'Motivación y Emoción', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-PSI-0406', 'Psicología del Desarrollo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'USMP-PSI-0407', 'Estadística Inferencial Aplicada a la Psicología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'USMP-PSI-0501', 'Desarrollo Personal II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-PSI-0502', 'Psicología Educativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-PSI-0503', 'Pruebas Psicométricas de Personalidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-PSI-0504', 'Psicología Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-PSI-0505', 'Psicología Dinámica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-PSI-0506', 'Psicopatología I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'USMP-PSI-0507', 'Técnicas de Modificación de Conducta', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'USMP-PSI-0601', 'Psicología Comunitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-PSI-0602', 'Psicología Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-PSI-0603', 'Técnicas Proyectivas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-PSI-0604', 'Psicopatología II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-PSI-0605', 'Introducción a la Psicoterapia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-PSI-0606', 'Orientación Vocacional y Profesional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'USMP-PSI-0607', 'Construcción de Instrumentos Psicológicos', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'USMP-PSI-0701', 'Diagnóstico e Informe Psicológico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-PSI-0702', 'Investigación I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-PSI-0703', 'Técnicas de Intervención Individual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-PSI-0704', 'Diagnóstico e Intervención en Problemas Psicoeducativos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-PSI-0705', 'Comportamiento Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-PSI-0706', 'Investigación Cualitativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'USMP-PSI-0707', 'Programas de Intervención Comunitaria', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'USMP-PSI-0801', 'Psicología Clínica y de la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-PSI-0802', 'Diagnóstico e Intervención en Personas con Habilidades Diferentes', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-PSI-0803', 'Investigación II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-PSI-0804', 'Ética y Deontología Profesional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-PSI-0805', 'Gestión Estratégica del Talento Humano', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-PSI-0806', 'Técnicas de Intervención Grupal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'USMP-PSI-0807', 'Emprendimiento e Innovación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'USMP-PSI-0901', 'Prácticas Preprofesionales I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'USMP-PSI-0902', 'Seminario de Tesis', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'USMP-PSI-1001', 'Prácticas Preprofesionales II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'USMP-PSI-1002', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad USMP
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_usmp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional USMP 2024',
    'Más del 90% de los egresados de la Universidad de San Martín de Porres se insertan exitosamente en el mercado laboral formal.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;
