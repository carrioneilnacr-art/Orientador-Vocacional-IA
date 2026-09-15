-- ==============================================================================
-- MIGRACIÓN / SEED: Universidad Tecnológica del Perú (UTP)
-- Carreras UTP Pregrado 2026: 13 Carreras Oficiales en 15 Campus a Nivel Nacional
-- Fuentes: Brochures Oficiales UTP 2026 (archivos u/utp/)
-- ==============================================================================

-- 1. Sincronizar secuencias de tablas
SELECT setval(pg_get_serial_sequence('institutions', 'id'), COALESCE(MAX(id), 1)) FROM institutions;
SELECT setval(pg_get_serial_sequence('sources', 'id'), COALESCE(MAX(id), 1)) FROM sources;
SELECT setval(pg_get_serial_sequence('campuses', 'id'), COALESCE(MAX(id), 1)) FROM campuses;
SELECT setval(pg_get_serial_sequence('careers', 'id'), COALESCE(MAX(id), 1)) FROM careers;
SELECT setval(pg_get_serial_sequence('academic_offers', 'id'), COALESCE(MAX(id), 1)) FROM academic_offers;
SELECT setval(pg_get_serial_sequence('curricula', 'id'), COALESCE(MAX(id), 1)) FROM curricula;
SELECT setval(pg_get_serial_sequence('curriculum_courses', 'id'), COALESCE(MAX(id), 1)) FROM curriculum_courses;

-- 2. REGISTRAR INSTITUCIÓN: UNIVERSIDAD TECNOLÓGICA DEL PERÚ (UTP)
INSERT INTO institutions (name, short_name, institution_type, description, website_url, is_active)
VALUES (
  'Universidad Tecnológica del Perú',
  'UTP',
  'PRIVADA_SOCIETARIA',
  'Universidad licenciada por SUNEDU, acreditada internacionalmente en calidad educativa (IAC-CINDA) e ICACIT, miembro del grupo Intercorp con más de 15 campus a nivel nacional y moderna infraestructura tecnológica.',
  'https://www.utp.edu.pe',
  true
)
ON CONFLICT (short_name) DO UPDATE SET
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url;

-- 3. REGISTRAR LOS 15 CAMPUS DE LA UTP A NIVEL NACIONAL
DO $$
DECLARE
  v_utp_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';

  INSERT INTO campuses (institution_id, name, address, district, city, is_active)
  VALUES
    (v_utp_id, 'Lima Centro', 'Jr. Hernán Velarde 289', 'Lima', 'Lima', true),
    (v_utp_id, 'Lima Norte', 'Av. Alfredo Mendiola 6377', 'Los Olivos', 'Lima', true),
    (v_utp_id, 'Lima Sur', 'Carretera Panamericana Sur km 16', 'Villa El Salvador', 'Lima', true),
    (v_utp_id, 'Lima Este - San Juan de Lurigancho', 'Av. El Sol 235', 'San Juan de Lurigancho', 'Lima', true),
    (v_utp_id, 'Lima Este - Ate', 'Carretera Central km 11.6', 'Ate', 'Lima', true),
    (v_utp_id, 'Arequipa', 'Av. Parra 201', 'Arequipa', 'Arequipa', true),
    (v_utp_id, 'Chiclayo', 'Esquina Prol. Augusto B. Leguía con av. Herman Meiner', 'Chiclayo', 'Lambayeque', true),
    (v_utp_id, 'Chimbote', 'Km 424 Panamericana Norte', 'Nuevo Chimbote', 'Áncash', true),
    (v_utp_id, 'Huancayo', 'Av. Circunvalación 449, El Tambo', 'El Tambo', 'Junín', true),
    (v_utp_id, 'Ica', 'Av. Ayabaca S/N', 'Ica', 'Ica', true),
    (v_utp_id, 'Iquitos', 'Av. José Abelardo Quiñones 1478', 'San Juan Bautista', 'Loreto', true),
    (v_utp_id, 'Piura', 'Av. Vice cuadra 1', 'Piura', 'Piura', true),
    (v_utp_id, 'Pucallpa', 'Av. Centenario 3915', 'Calleria', 'Ucayali', true),
    (v_utp_id, 'Tacna', 'Av. Billinghurst 800', 'Tacna', 'Tacna', true),
    (v_utp_id, 'Trujillo', 'Av. Nicolás de Piérola 1221', 'Trujillo', 'La Libertad', true)
  ON CONFLICT DO NOTHING;
END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Administración y Marketing (administracion-y-marketing)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Administración y Marketing Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/administracion-y-marketing',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación Internacional IAC-CINDA / Calidad Educativa • Certificaciones Progresivas en Marketing Digital y Analítica Comercial'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Administración y Marketing',
  'administracion-y-marketing',
  'Facultad de Administración y Negocios',
  'Aprenderás a diseñar estrategias comerciales innovadoras, gestión de marcas, marketing digital, análisis del consumidor y toma de decisiones basadas en datos para maximizar la rentabilidad y el posicionamiento de mercado.',
  10,
  5.00,
  'Bachiller Universitario en Administración y Marketing',
  'Acreditación Internacional IAC-CINDA / Calidad Educativa • Certificaciones Progresivas en Marketing Digital y Analítica Comercial',
  'Profesional capaz de liderar estrategias comerciales y de marketing omnicanal, diseñando propuestas de valor centradas en el cliente, optimizando la rentabilidad y gestionando marcas en entornos digitales y globales.',
  ARRAY['Empresas multinacionales y de consumo masivo en gerencias de marketing y comercial', 'Agencias de publicidad, marketing digital, medios y consultoría de marcas', 'Startups, comercio electrónico (e-commerce) y negocios digitales', 'Dirección de producto, trade marketing y experiencia del cliente (CX)'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'administracion-y-marketing';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Administración y Marketing Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/administracion-y-marketing', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-ADM-101', 'Fundamentos de Contabilidad y Finanzas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ADM-102', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ADM-103', 'Matemática para los Negocios 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ADM-104', 'Introducción a la Administración', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ADM-105', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ADM-106', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-ADM-201', 'Derecho Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ADM-202', 'Gestión General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ADM-203', 'Contabilidad Financiera', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ADM-204', 'Matemática para los Negocios 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ADM-205', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ADM-206', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-ADM-301', 'Estadística Aplicada para los Negocios', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ADM-302', 'Informática para los Negocios', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ADM-303', 'Contabilidad Gerencial y de Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ADM-304', 'Individuo y Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ADM-305', 'Inglés 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-ADM-401', 'Costos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ADM-402', 'Comportamiento del Consumidor', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ADM-403', 'Fundamentos de Marketing', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ADM-404', 'Microeconomía y Macroeconomía', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ADM-405', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ADM-406', 'Finanzas Aplicadas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ADM-407', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-ADM-501', 'Macroeconomía', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ADM-502', 'Investigación Operativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ADM-503', 'Investigación de Mercados', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ADM-504', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ADM-505', 'Curso Integrador en Administración y Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ADM-506', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-ADM-601', 'Negocios Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ADM-602', 'Plan de Mercado', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ADM-603', 'Estrategias de Precio', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ADM-604', 'Ventas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ADM-605', 'Marketing Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ADM-606', 'Fundamentos de Gestión Retail', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-ADM-701', 'Diseño y Gestión de Marcas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ADM-702', 'Marketing Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ADM-703', 'Marketing Estratégico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ADM-704', 'Estrategias en Promoción y Ventas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ADM-705', 'Publicidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ADM-706', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-ADM-801', 'Normatividad Legal del Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ADM-802', 'Category Management', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ADM-803', 'Análisis y Estrategias del Marketing Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ADM-804', 'Customer Relationship Management (CRM)', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ADM-805', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ADM-806', 'Formación para la Investigación - Administración y Negocios', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-ADM-901', 'Retail Management', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ADM-902', 'G l o b a l iz a c i ó n y Consumidor M u l ti c u lt u r a l', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ADM-903', 'Marketing Internacional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ADM-904', 'Curso Integrador en Gestión d e l M a r k e t i n g', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ADM-905', 'É ti c a P r o f e s i o nal y Responsabilidad Social', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ADM-906', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-ADM-1001', 'Dirección Estratégica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ADM-1002', 'Gestión de Ferias y Promociones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ADM-1003', 'Herramientas de Desarrollo Profesional - Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ADM-1004', 'Taller de Investigación - Administración y Marketing', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ADM-1005', 'Electivo 3', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Arquitectura (arquitectura)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Arquitectura Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/arquitectura',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación Internacional • Laboratorios de Fabricación Digital y Metodología BIM'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Arquitectura',
  'arquitectura',
  'Facultad de Arquitectura',
  'Diseño, planificación y construcción de espacios arquitectónicos y urbanos sostenibles, integrando creatividad espacial, tecnología constructiva y herramientas avanzadas de modelado digital BIM.',
  10,
  5.00,
  'Bachiller Universitario en Arquitectura',
  'Acreditación Internacional • Laboratorios de Fabricación Digital y Metodología BIM',
  'Arquitecto con visión creativa y técnica, capaz de concebir y desarrollar proyectos arquitectónicos y urbanísticos funcionales, sostenibles y con alto impacto social y ambiental.',
  ARRAY['Estudios de arquitectura, diseño urbano y consultoría espacial', 'Empresas constructoras, inmobiliarias y promotoras de desarrollo urbano', 'Entidades gubernamentales, ministerios y municipalidades en planeamiento urbano y catastro', 'Diseño de interiores, visualización arquitectónica 3D y dirección de obra'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'arquitectura';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Arquitectura Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/arquitectura', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-ARQ-101', 'Geometría', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ARQ-102', 'Introducción a la Vida Universitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ARQ-103', 'Taller de Diseño Arquitectónico 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ARQ-104', 'Individuo y Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ARQ-105', 'Comprensión y Redacción de Textos 1', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-ARQ-201', 'Dibujo Arquitectónico 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ARQ-202', 'Física Conceptual', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ARQ-203', 'Historia y Teoría de la Arquitectura 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ARQ-204', 'Taller de Diseño Arquitectónico 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ARQ-205', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-ARQ-301', 'Sistema de Representación Geométrica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ARQ-302', 'Investigación Académica', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ARQ-303', 'Historia y Teoría de la Arquitectura 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ARQ-304', 'Taller de Diseño Arquitectónico 3', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ARQ-305', 'Dibujo Arquitectónico 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-ARQ-401', 'Herramientas Informáticas para la Toma de Decisiones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ARQ-402', 'Pintura y Escultura', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ARQ-403', 'Taller de Diseño Arquitectónico 4', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ARQ-404', 'Topografía - Arquitectura', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ARQ-405', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ARQ-406', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ARQ-407', 'Historia y Teoría de la Arquitectura 3', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-ARQ-501', 'Arquitectura Digital 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ARQ-502', 'Construcción 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ARQ-503', 'Orientación Estructural', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ARQ-504', 'Taller de Diseño Arquitectónico 5 (Curso Integrador 1)', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ARQ-505', 'Urbanismo 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ARQ-506', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-ARQ-601', 'Arquitectura Digital 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ARQ-602', 'Construcción 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ARQ-603', 'Estructuras 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ARQ-604', 'Taller de Diseño Arquitectónico 6', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ARQ-605', 'Urbanismo 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ARQ-606', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-ARQ-701', 'Arquitectura Digital 3', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ARQ-702', 'Construcción 3', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ARQ-703', 'Estructuras 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ARQ-704', 'Taller de Diseño Arquitectónico 7', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ARQ-705', 'Planos y Metrados de Obras de Construcción', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ARQ-706', 'Planeamiento y Territorio', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ARQ-707', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-ARQ-801', 'Equipos e Instalaciones Especiales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ARQ-802', 'Taller de Diseño Arquitectónico 8', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ARQ-803', 'Tecnología Arquitectónica 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ARQ-804', 'Territorio Sostenible 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ARQ-805', 'Estimación de Costos y Planificación de Obra', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ARQ-806', 'Estadística Descriptiva y Probabilidades', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ARQ-807', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-ARQ-901', 'Formación para la Investigación - Arquitectura e Interiores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ARQ-902', 'Tecnología Aquitectónica 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ARQ-903', 'Taller de Diseño Arquitectónico 9 (Curso Integrador 2)', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ARQ-904', 'Herramientas para la Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ARQ-905', 'Territorio Sostenible 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ARQ-906', 'Gestión de Proyectos de Construcción', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-ARQ-1001', 'Ética y Ejercicio Profesional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ARQ-1002', 'Taller de Investigación - Arquitectura e Interiores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ARQ-1003', 'Taller de Diseño Arquitectónico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ARQ-1004', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ARQ-1005', 'Sistema Integrado de Gestión en la Construcción', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ARQ-1006', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Comunicación y Publicidad (comunicacion-y-publicidad)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Comunicación y Publicidad Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/comunicacion-y-publicidad',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Certificaciones Progresivas en Gestión Creativa, Planificación Estratégica y Medios Digitales'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Comunicación y Publicidad',
  'comunicacion-y-publicidad',
  'Facultad de Comunicaciones',
  'Formación integral en diseño de campañas publicitarias omnicanal, narrativas transmedia, creatividad publicitaria, dirección de arte, analítica de audiencias y gestión de marcas en entornos digitales y tradicionales.',
  10,
  5.00,
  'Bachiller Universitario en Comunicación y Publicidad',
  'Certificaciones Progresivas en Gestión Creativa, Planificación Estratégica y Medios Digitales',
  'Comunicador y publicista innovador con dominio en dirección creativa, planificación estratégica de medios, branding, producción multimedia y estrategias de marketing digital y transmedia.',
  ARRAY['Agencias de publicidad, centrales de medios y consultoras de comunicación estratégica', 'Departamentos de marketing, publicidad y comunicaciones en empresas públicas y privadas', 'Medios de comunicación digitales, productoras audiovisuales y agencias de marketing digital', 'Dirección de arte, redacción creativa (copywriting) y consultoría independiente de marcas'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'comunicacion-y-publicidad';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Comunicación y Publicidad Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/comunicacion-y-publicidad', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-PUB-101', 'Comprensión y Redacción de Textos 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PUB-102', 'Fundamentos de la Comunicación Audiovisual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PUB-103', 'Tecnología y Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PUB-104', 'I n tr o d u c c i ó n a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PUB-105', 'Principios de la Comunicación Visual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PUB-106', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-PUB-201', 'Comprensión y Redacción de Textos 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PUB-202', 'Fundamentos de la Comunicación Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PUB-203', 'Historia de las Artes Visuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PUB-204', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PUB-205', 'Principios del Marketing', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PUB-206', 'Semiótica Visual', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-PUB-301', 'Digitalización 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PUB-302', 'Inglés 3', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PUB-303', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PUB-304', 'Psicología del Consumidor', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PUB-305', 'Publicidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PUB-306', 'Video Digital', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-PUB-401', 'Ciudadanía y Reflexión Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PUB-402', 'Digitalización 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PUB-403', 'Edición Digital', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PUB-404', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PUB-405', 'Pensamiento de Diseño y UX', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PUB-406', 'Relaciones Públicas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-PUB-501', 'Branding', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PUB-502', 'Fotografía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PUB-503', 'IA + Data', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PUB-504', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PUB-505', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PUB-506', 'Redacción y Dupla Creativa', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-PUB-601', 'Curso Integrador 1 - Comunicación y Publicidad', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PUB-602', 'Datos, Audiencias y Mercados', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PUB-603', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PUB-604', 'Identidad Visual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PUB-605', 'Legislación de las Comunicaciones ON/OFF', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PUB-606', 'Medios y Negociación Publicitaria', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-PUB-701', 'Estrategia Omnicanal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PUB-702', 'Marketing de Retail', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PUB-703', 'Neuromarketing Aplicado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PUB-704', 'Planificación Estratégica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PUB-705', 'Storytelling', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PUB-706', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-PUB-801', 'Creatividad Transmedia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PUB-802', 'Dirección de Arte', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PUB-803', 'Métricas y Analíticas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PUB-804', 'Sostenibilidad y Responsabilidad Social', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PUB-805', 'Taller de Cuentas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PUB-806', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-PUB-901', 'Content Management', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PUB-902', 'Curso Integrador 2 - Comunicación y Publicidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PUB-903', 'Formación para la Investigación - Comunicación y Publicidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PUB-904', 'Fotografía Conceptual y Persuasiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PUB-905', 'Gestión y Presupuestos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PUB-906', 'Electivo 3', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-PUB-1001', 'Comercio Electrónico y Negocios Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PUB-1002', 'Gestión de Promociones y Eventos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PUB-1003', 'Producción de Campañas Publicitarias', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PUB-1004', 'Taller de Investigación - Comunicación y Publicidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PUB-1005', 'Electivo 4', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PUB-1006', 'Taller de Innovación Multidisciplinar', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Contabilidad (contabilidad)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Contabilidad Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/contabilidad',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación Internacional • Formación en NIIF, Auditoría Financiera y Tributación Digital'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Contabilidad',
  'contabilidad',
  'Facultad de Administración y Negocios',
  'Gestión y control financiero-contable, auditoría, tributación estratégica y analítica de costos para la toma de decisiones empresariales de alto nivel bajo estándares internacionales NIIF.',
  10,
  5.00,
  'Bachiller Universitario en Contabilidad',
  'Acreditación Internacional • Formación en NIIF, Auditoría Financiera y Tributación Digital',
  'Contador público con sólida formación en normas internacionales de contabilidad y auditoría, capaz de asesorar estratégicamente en materia tributaria, financiera y corporativa.',
  ARRAY['Empresas auditoras internacionales (Big Four) y firmas consultoras', 'Gerencias de contabilidad, finanzas y control de gestión en empresas públicas y privadas', 'Organismos reguladores del sector público (SUNAT, Contraloría, MEF)', 'Banca, seguros, entidades financieras y peritaje contable judicial'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'contabilidad';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Contabilidad Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/contabilidad', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-CON-101', 'Introducción a la Administración', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CON-102', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CON-103', 'Matemática para los Negocios 1', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CON-104', 'Introducción a la Contabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CON-105', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CON-106', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-CON-201', 'Ciclo Contable', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CON-202', 'Gestión del Potencial Humano y Estrategias', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CON-203', 'Matemática para los Negocios 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CON-204', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CON-205', 'Informática Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CON-206', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-CON-301', 'Desarrollo de Habilidades Personales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CON-302', 'Contabilidad de Sociedades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CON-303', 'Matemática Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CON-304', 'Derecho Empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CON-305', 'Problemas y desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CON-306', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-CON-401', 'Estadística Aplicada para los Negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CON-402', 'Estados Financieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CON-403', 'Microeconomía y Macroeconomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CON-404', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CON-405', 'Legislación Comercial y Laboral', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CON-406', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-CON-501', 'Legislación Tributaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CON-502', 'Contabilidad de MYPES', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CON-503', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CON-504', 'Costos Comerciales y de Servicios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CON-505', 'Análisis de la Información Financiera', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CON-506', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-CON-601', 'Costos Industriales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CON-602', 'Normas Internacionales de Información Financiera', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CON-603', 'Tributación Empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CON-604', 'Gestión Financiera', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CON-605', 'Curso Integrador 1 Contabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CON-606', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-CON-701', 'Gestión de Costos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CON-702', 'Gestión Financiera Avanzada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CON-703', 'T r ib u t a c ió n Aduanera y E m p r e s a ri a l', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CON-704', 'Emprendimiento de Nuevos Negocios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CON-705', 'C o n t r o l I n t e r n o', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CON-706', 'C o n t a b i l i d a d In formática', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-CON-801', 'Impacto Tributario de las NIIF', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CON-802', 'Auditoría Financiera 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CON-803', 'Análisis de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CON-804', 'Mercado de Capitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CON-805', 'Banca y Seguros', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CON-806', 'Contabilidad Gubernamental', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-CON-901', 'Formación para la Investigación - Contabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CON-902', 'Finanzas Corporativas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CON-903', 'ERP - Planificación Recursos Empresariales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CON-904', 'Curso Integrador 2 Contabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CON-905', 'Auditoría Financiera 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CON-906', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-CON-1001', 'Auditoría Gubernamental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CON-1002', 'Costos Estratégicos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CON-1003', 'Gerencia y Estrategia', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CON-1004', 'Contabilidad Internacional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CON-1005', 'Taller de Investigación - Contabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CON-1006', 'Ética Profesional - CC', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Derecho (derecho)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Derecho Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/derecho',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación de Calidad • Salas de Audiencias y Simulación de Litigación Oral'
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
  'Dominio del marco normativo nacional e internacional, litigación oral, derecho corporativo, civil, penal, laboral y administrativo con sólidas bases éticas y técnicas de negociación y resolución de conflictos.',
  10,
  5.00,
  'Bachiller Universitario en Derecho',
  'Acreditación de Calidad • Salas de Audiencias y Simulación de Litigación Oral',
  'Abogado con liderazgo ético y destreza en litigación oral, consultoría legal corporativa, compliance y administración de justicia en el sector público y privado.',
  ARRAY['Estudios jurídicos y firmas de asesoría legal empresarial', 'Poder Judicial, Ministerio Público, Tribunal Constitucional y entidades estatales', 'Gerencias legales y áreas de cumplimiento normativo (compliance) en corporaciones', 'Centros de arbitraje, mediación y organismos internacionales'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'derecho';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Derecho Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/derecho', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-DER-101', 'Fundamentos Económicos del Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-DER-102', 'Historia del Derecho y Derecho Romano', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-DER-103', 'Introducción al Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-DER-104', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-DER-105', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-DER-106', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-DER-201', 'Ciencia Política', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-DER-202', 'Filosofía del Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-DER-203', 'Instituciones del Derecho Civil', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-DER-204', 'Derecho de Personas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-DER-205', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-DER-206', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-DER-301', 'Derecho Constitucional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-DER-302', 'Teoría General del Acto Jurídico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-DER-303', 'Derechos Humanos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-DER-304', 'Derecho de Familia y Sucesiones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-DER-305', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-DER-306', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-DER-401', 'Derecho Procesal Constitucional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-DER-402', 'Derecho Internacional Público', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-DER-403', 'Teoría General del Proceso', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-DER-404', 'Derechos Reales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-DER-405', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-DER-406', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-DER-501', 'Derecho Penal General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-DER-502', 'Derecho Administrativo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-DER-503', 'Derecho Procesal Civil y Litigación 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-DER-504', 'Derecho de Obligaciones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-DER-505', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-DER-506', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-DER-601', 'Derecho Penal Especial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-DER-602', 'Derecho Procesal Administrativo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-DER-603', 'Derecho Tributario General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-DER-604', 'Derecho Procesal Civil y Litigación 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-DER-605', 'Curso Integrador 1: Interdisciplinarias', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-DER-606', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-DER-701', 'Derecho Penal Económico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-DER-702', 'Derecho Tributario Especial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-DER-703', 'Contratos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-DER-704', 'Derecho Notarial y Registral', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-DER-705', 'Derecho Laboral', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-DER-706', 'Argumentación Jurídica', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-DER-801', 'Formación para la Investigación - Derecho', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-DER-802', 'Responsabilidad Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-DER-803', 'Derecho de la Propiedad Intelectual y Derecho del Consumidor', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-DER-804', 'Derecho Internacional Privado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-DER-805', 'Derecho Procesal Laboral', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-DER-806', 'Derecho Procesal Penal y Litigación Oral 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-DER-901', 'Metodología de la Investigación en Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-DER-902', 'Curso Integrador 2 - Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-DER-903', 'Derecho Procesal Penal y Litigación Oral 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-DER-904', 'Herramientas de Desarrollo Profesional - Derecho', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-DER-905', 'Derecho Corporativo 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-DER-906', 'Redacción Jurídica', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-DER-1001', 'Derecho de Ejecución Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-DER-1002', 'Derecho Corporativo 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-DER-1003', 'Taller de Investigación - Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-DER-1004', 'Ética Profesional - Derecho', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-DER-1005', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UTP-DER-1006', 'Clínica Jurídica', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Enfermería (enfermeria)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Enfermería Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/enfermeria',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Laboratorios y Hospitales de Simulación Clínica de Alta Fidelidad • Prácticas Clínicas Tempranas'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Enfermería',
  'enfermeria',
  'Facultad de Ciencias de la Salud',
  'Gestión integral del cuidado humanizado de la salud de personas, familias y comunidades en todas las etapas del ciclo vital, promoviendo la salud, previniendo enfermedades y asistiendo en emergencias de alta complejidad.',
  10,
  5.00,
  'Bachiller Universitario en Enfermería',
  'Laboratorios y Hospitales de Simulación Clínica de Alta Fidelidad • Prácticas Clínicas Tempranas',
  'Profesional de enfermería comprometido con la excelencia clínica, la calidez humana y la gestión sanitaria eficiente en unidades de hospitalización, cuidados intensivos y atención comunitaria.',
  ARRAY['Hospitales, clínicas y complejos hospitalarios públicos (MINSA, EsSalud, FF.AA.) y privados', 'Centros de salud comunitaria, policlínicos y puestos de atención primaria', 'Áreas de salud ocupacional y prevención de riesgos en empresas e industrias', 'Docencia universitaria, investigación en ciencias de la salud y consultoría independiente'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'enfermeria';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Enfermería Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/enfermeria', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-ENF-101', 'Comprensión y Redacción de Textos 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ENF-102', 'Matemática para CCSS', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ENF-103', 'Q u í m ic a G eneral y Orgánica pa r a C C S S', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ENF-104', 'Psicología para CCSS', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ENF-105', 'Tecnologías para el Aprendizaje en CCSS', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-ENF-106', 'Introducción a la Vida Universitaria', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-ENF-201', 'Salud y Comunidad 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ENF-202', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ENF-203', 'Física para CCSS', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ENF-204', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ENF-205', 'Biología Celular', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-ENF-206', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-ENF-301', 'Individuo y Medio Ambiente', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ENF-302', 'Salud y Comunidad 2', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ENF-303', 'Inglés 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ENF-304', 'Organización y Función del Cuerpo Humano 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-ENF-305', 'Bioquímica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-ENF-401', 'Biología Molecular y Genética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ENF-402', 'Enfermería Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ENF-403', 'O rg a n iz a c ió n y F u nción del Cu e rp o H u m a n o 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ENF-404', 'Salud y Comunidad 3', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ENF-405', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-ENF-406', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-ENF-501', 'Inmunología, Microbiología e Infección', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ENF-502', 'Bases Farmacológicas de la Terapéutica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ENF-503', 'Legislación y Deontología en Enfermería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ENF-504', 'Cuidados de Enfermería Básica y Cuidados del Adulto', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ENF-505', 'Bioestadística', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ENF-506', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-ENF-507', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-ENF-601', 'Nutrición para CCSS', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ENF-602', 'Cuidados de Enfermería en Salud Mental y Psiquiatría', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ENF-603', 'Cuidados de Enfermería Médico Quirúrgico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ENF-604', 'Salud y Comunidad 4 - Enfermería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ENF-605', 'Salud Pública: Situación de Salud en el Perú, Sistemas de Salud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ENF-606', 'Epidemiología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-ENF-607', 'Curso Integrador 1 - Enfermería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (4 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-ENF-701', 'Cuidados de Enfermería en Salud de la Mujer y del Recién Nacido', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ENF-702', 'Cuidados de Enfermería en el Adulto Mayor', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ENF-703', 'Formación para la Investigación en CCSS', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-ENF-704', 'Gestión 1', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-ENF-801', 'Formación para la Empleabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ENF-802', 'Cuidados de Enfermería del Niño y del Adolescente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ENF-803', 'Cuidados de Enfermería en Emergencia', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ENF-804', 'Bioética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ENF-805', 'Gestión del Cuidado de Enfermería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-ENF-806', 'Taller de Investigación - Enfermería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (4 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-ENF-901', 'Curso Integrador 2 - Enfermería', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ENF-902', 'Internado 1 - Enfermería', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ENF-903', 'Taller de Tesis - Enfermería', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-ENF-904', 'Electivo 1', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (2 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-ENF-1001', 'Internado 2 - Enfermería', 11.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-ENF-1002', 'Electivo 2', 9.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Ambiental (ingenieria-ambiental)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Ingeniería Ambiental Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/ingenieria-ambiental',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Laboratorios especializados de Monitoreo y Calidad Ambiental'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Ambiental',
  'ingenieria-ambiental',
  'Facultad de Ingeniería',
  'Diseño, evaluación y gestión de tecnologías ambientales para la prevención, control y remediación de la contaminación del agua, aire y suelo, impulsando la economía circular y la sostenibilidad ecológica.',
  10,
  5.00,
  'Bachiller Universitario en Ingeniería Ambiental',
  'Acreditado por ICACIT • Laboratorios especializados de Monitoreo y Calidad Ambiental',
  'Ingeniero ambiental competente en diseño de plantas de tratamiento, evaluación de impacto ambiental, gestión de cuencas y liderazgo en políticas de desarrollo sostenible para la industria.',
  ARRAY['Empresas de minería, energía, hidrocarburos, industria química y manufactura', 'Consultoras ambientales y laboratorios de monitoreo y certificación ecológica', 'Organismos estatales (OEFA, MINAM, SENACE, SERFOR, ANA) y municipalidades', 'Organizaciones internacionales de conservación, cambio climático y desarrollo sostenible'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-ambiental';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Ingeniería Ambiental Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/ingenieria-ambiental', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-AMB-101', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-AMB-102', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-AMB-103', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-AMB-104', 'Matemática 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-AMB-105', 'Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-AMB-106', 'Laboratorio de Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-AMB-107', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-AMB-201', 'Matemática 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-AMB-202', 'Química Inorgánica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-AMB-203', 'Laboratorio de Química Inorgánica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-AMB-204', 'Dibujo para Ingeniería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-AMB-205', 'Compresión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-AMB-206', 'P ro b l em a s y Desafíos en el Pe rú A ct u a l', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-AMB-207', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-AMB-301', 'Cálculo 1', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-AMB-302', 'Mecánica Clásica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-AMB-303', 'Laboratorio de Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-AMB-304', 'Estadística Descriptiva y Probabilidades', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-AMB-305', 'Biología General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-AMB-306', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-AMB-401', 'Ciudadanía y Reflexión Ética', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-AMB-402', 'Dibujo CAD', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-AMB-403', 'Química Orgánica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-AMB-404', 'Ecología y Recursos Naturales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-AMB-405', 'Ambiente y Sociedad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-AMB-406', 'Fundamentos de Electromagnetismo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-AMB-407', 'L ab o ra t o ri o d e F u n d a m entos de E le c t ro m a g n e ti s m o', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (9 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-AMB-501', 'Cálculo 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-502', 'Investigación Académica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-503', 'Curso Integrador 1 - Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-504', 'Microbiología', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-505', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-506', 'Meteorología y Climatología', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-507', 'Principios de Algoritmos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-508', 'Estadística Inferencial', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-AMB-509', 'Química Analítica', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-AMB-601', 'Contaminación Atmosférica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-AMB-602', 'Ecoeficiencia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-AMB-603', 'Sistemas de Información Geográfica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-AMB-604', 'Química Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-AMB-605', 'Conflictos Socioambientales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-AMB-606', 'Legislación y Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-AMB-701', 'Contaminación del Agua', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-AMB-702', 'Edafología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-AMB-703', 'Economía Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-AMB-704', 'Gestión Integral de Residuos Sólidos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-AMB-705', 'Servicios Ecosistémicos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-AMB-706', 'Hidrología', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-AMB-801', 'Formación para la Empleabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-AMB-802', 'Contaminación del Suelo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-AMB-803', 'Toxicología Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-AMB-804', 'Gestión Ambiental de Cuencas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-AMB-805', 'Contabilidad General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-AMB-806', 'Cambio Climático: Mitigación y Adaptación', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-AMB-901', 'Formación para la Investigación - Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-AMB-902', 'Sistemas Integrados de Gestión', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-AMB-903', 'E v a lu a c ió n de Impacto A m b ie n t a l', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-AMB-904', 'Gestión de la Sostenibilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-AMB-905', 'Herramientas para la Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-AMB-906', 'Curso Integrador 2 - Ambiental', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-AMB-1001', 'Taller de Investigación - Ambiental', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-AMB-1002', 'Ética Profesional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-AMB-1003', 'Formulación y Evaluación de Proyectos Ambientales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-AMB-1004', 'Economía Circular', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-AMB-1005', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UTP-AMB-1006', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Civil (ingenieria-civil)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Ingeniería Civil Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/ingenieria-civil',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Laboratorios de Suelos, Pavimentos, Estructuras e Hidráulica'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Civil',
  'ingenieria-civil',
  'Facultad de Ingeniería',
  'Planificación, diseño estructural, construcción, supervisión y mantenimiento de obras civiles e infraestructura vial, hidráulica y de saneamiento bajo estándares sismorresistentes y tecnología BIM.',
  10,
  5.00,
  'Bachiller Universitario en Ingeniería Civil',
  'Acreditado por ICACIT • Laboratorios de Suelos, Pavimentos, Estructuras e Hidráulica',
  'Ingeniero civil con sólida formación científico-tecnológica para liderar mega-proyectos de construcción, gestión de obras civiles, diseño estructural y consultoría geotécnica e hidráulica.',
  ARRAY['Empresas constructoras, contratistas generales y desarrolladoras inmobiliarias', 'Consultoras de diseño estructural sismorresistente, geotecnia y mecánica de fluidos', 'Entidades gubernamentales de transporte e infraestructura (MTC, gobiernos regionales, ministerios)', 'Gerencia de proyectos de infraestructura, supervisión técnica y peritaje de obras'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-civil';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Ingeniería Civil Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/ingenieria-civil', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-CIV-101', 'Química General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CIV-102', 'Laboratorio de Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CIV-103', 'Matemática 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CIV-104', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CIV-105', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CIV-106', 'Introducción a la Vida Universitaria', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-CIV-107', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-CIV-201', 'Dibujo para Ingeniería', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CIV-202', 'Matemática 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CIV-203', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CIV-204', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CIV-205', 'Principios de Algoritmos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CIV-206', 'E s ta d í st i c a D e scriptiva y P ro b a b il i d a d e s', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-CIV-207', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-CIV-301', 'Geología', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-302', 'Planos y Metrados de Obras de Construcción', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-303', 'Investigación Académica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-304', 'Mecánica Clásica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-305', 'Cálculo 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-306', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-307', 'Laboratorio de Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-CIV-308', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-CIV-401', 'Materiales de Construcción', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-402', 'Cálculo 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-403', 'Laboratorio de Fluidos y Termodinámica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-404', 'Laboratorio de Materiales de Construcción', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-405', 'Estática', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-406', 'Topografía - Ingeniería Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-407', 'Fluidos y Termodinámica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-CIV-408', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-CIV-501', 'Tecnología del Concreto', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CIV-502', 'Construcción', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CIV-503', 'Geomática', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CIV-504', 'Fundamentos de Dinámica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CIV-505', 'Cálculo Avanzado para Ingeniería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CIV-506', 'Cálculo para la Toma de Decisiones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-CIV-507', 'Herramientas Informáticas para la Toma de Decisiones', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-CIV-601', 'Curso Integrador 1 - Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-602', 'Mecánica de Suelos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-603', 'Construcciones Especiales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-604', 'Laboratorio de Elasticidad y Resistencia de Materiales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-605', 'Laboratorio de Mecánica de Fluidos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-606', 'Herramientas para la Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-607', 'Mecánica de Fluidos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-CIV-608', 'Elasticidad y Resistencia de Materiales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-CIV-701', 'Análisis Estructural 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-702', 'Ingeniería de Carreteras', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-703', 'Hidráulica de Canales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-704', 'Instalaciones en Edificaciones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-705', 'Laboratorio de Hidráulica de Canales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-706', 'Modelado de Información de Edificaciones - BIM', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-707', 'Ingeniería Geotécnica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-CIV-708', 'F o r m a c ió n p a ra la E m p le a b il id a d', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-CIV-801', 'Hidrología Aplicada', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-802', 'Análisis Estructural 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-803', 'Construcción de Carreteras', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-804', 'Administración y Organización de Empresas Constructoras', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-805', 'Estimación de Costos y Planificación de Obra', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-806', 'Mecánica de Suelos Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-807', 'Seminario de Ingeniería Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-CIV-808', 'Ética Profesional', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-CIV-901', 'Concreto Armado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CIV-902', 'Formación para la Investigación - Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CIV-903', 'Ingeniería de Cimentaciones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CIV-904', 'Sistema Integrado de Gestión', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CIV-905', 'Ingeniería de los Recursos Hidráulicos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CIV-906', 'Pavimentos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-CIV-907', 'Gestión de Proyectos de Construcción', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-CIV-1001', 'en la Construcción', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1002', 'Curso Integrador 2 - Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1003', 'Ingeniería Sismorresistente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1004', 'Taller de Investigación - Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1005', 'Gestión de Proyectos de Inversión Pública', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1006', 'Electivo 1', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1007', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UTP-CIV-1008', 'Electivo 3', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Industrial (ingenieria-industrial)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Ingeniería Industrial Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/ingenieria-industrial',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Laboratorios de Automatización, Procesos y Manufactura Flexible'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Industrial',
  'ingenieria-industrial',
  'Facultad de Ingeniería',
  'Optimización de procesos productivos y cadenas de suministro (supply chain), aseguramiento de calidad, gestión de operaciones, finanzas industriales y analítica de datos para maximizar la eficiencia y competitividad.',
  10,
  5.00,
  'Bachiller Universitario en Ingeniería Industrial',
  'Acreditado por ICACIT • Laboratorios de Automatización, Procesos y Manufactura Flexible',
  'Ingeniero versátil y estratégico capacitado para modelar, optimizar y dirigir sistemas integrados de personas, materiales, información, finanzas y energía en empresas de manufactura y servicios.',
  ARRAY['Plantas industriales, fábricas de manufactura, agroindustria y centros logísticos', 'Empresas de consumo masivo, retail, comercio electrónico y distribución global', 'Gerencia de operaciones, calidad y mejora continua (Lean Six Sigma)', 'Consultoría estratégica en productividad, planeamiento financiero y gestión de proyectos'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-industrial';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Ingeniería Industrial Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/ingenieria-industrial', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-IND-101', 'Ciudadanía y Reflexión Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-IND-102', 'Introducción a la Ingeniería Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-IND-103', 'Matemática 1', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-IND-104', 'Introducción a la Vida Universitaria', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-IND-105', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-IND-106', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-IND-201', 'Dibujo para Ingeniería', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-202', 'Matemática 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-203', 'Química General', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-204', 'Principios de Algoritmos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-205', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-206', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-207', 'Laboratorio de Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-IND-208', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-IND-301', 'Cálculo 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-302', 'Herramientas Informáticas para la Toma de Decisiones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-303', 'Mecánica Clásica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-304', 'Química Industrial', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-305', 'Economía General - IND', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-306', 'Laboratorio de Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-307', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-IND-308', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-IND-401', 'Estadística Descriptiva y Probabilidades', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-IND-402', 'Cálculo 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-IND-403', 'Laboratorio de Fundamentos de Electromagnetismo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-IND-404', 'Fundamentos de Electromagnetismo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-IND-405', 'Operaciones Unitarias y Procesos Industriales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-IND-406', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-IND-407', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (9 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-IND-501', 'Laboratorio de Fluidos y Termodinámica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-502', 'Procesos para Ingeniería', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-503', 'Ergonomía y Estudio del Trabajo', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-504', 'Administración y Organización de Empresas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-505', 'Fluidos y Termodinámica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-506', 'Estadística Inferencial', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-507', 'Contabilidad general', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-508', 'Cálculo para la Toma de Decisiones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-IND-509', 'Laboratorio de Ergonomía y Estudio del Trabajo', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-IND-601', 'Curso Integrador 1 - Escuela de Industrial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-IND-602', 'Costos y Presupuestos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-IND-603', 'Disposición de Planta', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-IND-604', 'Gestión de Personas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-IND-605', 'Gestión por Procesos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-IND-606', 'Teoría de Decisiones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-IND-607', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-IND-701', 'Tecnología Industrial', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-IND-702', 'Marketing', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-IND-703', 'Herramientas de Calidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-IND-704', 'Gestión de Operaciones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-IND-705', 'Ingeniería Económica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-IND-706', 'Investigación Operativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-IND-707', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-IND-801', 'Planeamiento Estratégico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-IND-802', 'Automatización de Procesos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-IND-803', 'Gestión de la Innovación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-IND-804', 'Sistemas de Gestión de Calidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-IND-805', 'Planeamiento y Control de Operaciones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-IND-806', 'Logística', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-IND-807', 'Electivo 3', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-IND-901', 'Herramientas para la Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-IND-902', 'Formulación y Evaluación de Proyectos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-IND-903', 'Formación para la Investigación - Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-IND-904', 'Simulación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-IND-905', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-IND-906', 'Seguridad y Salud Ocupacional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-IND-907', 'Electivo 4', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-IND-1001', 'Gestión de la Cadena de Abastecimiento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-IND-1002', 'Taller de Investigación - Industrial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-IND-1003', 'Gestión de Proyectos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-IND-1004', 'Ética Profesional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-IND-1005', 'Curso Integrador 2 - Emprendimiento Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-IND-1006', 'Gestión del Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-IND-1007', 'Electivo 5', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería de Sistemas e Informática (ingenieria-de-sistemas-e-informatica)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Ingeniería de Sistemas e Informática Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/ingenieria-de-sistemas-e-informatica',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Certificaciones Progresivas con Cisco, IBM, AWS y Google Cloud'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería de Sistemas e Informática',
  'ingenieria-de-sistemas-e-informatica',
  'Facultad de Ingeniería',
  'Diseño, implementación y gobernanza de sistemas de información empresariales, arquitecturas tecnológicas, redes de datos, seguridad de la información, bases de datos y soluciones cloud para la transformación digital.',
  10,
  5.00,
  'Bachiller Universitario en Ingeniería de Sistemas e Informática',
  'Acreditado por ICACIT • Certificaciones Progresivas con Cisco, IBM, AWS y Google Cloud',
  'Ingeniero capaz de alinear la tecnología con los objetivos de negocio, gestionando infraestructuras de TI, plataformas distribuidas, proyectos de software y sistemas inteligentes empresariales.',
  ARRAY['Empresas del sector financiero, banca, seguros, telecomunicaciones y retail', 'Consultoras internacionales de TI y empresas especializadas en ciberseguridad y cloud', 'Organismos públicos y privados liderando áreas de sistemas, redes y gobierno de datos', 'Dirección de proyectos tecnológicos y consultoría en transformación digital'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-de-sistemas-e-informatica';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Ingeniería de Sistemas e Informática Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/ingenieria-de-sistemas-e-informatica', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-SIS-101', 'Principios de Algoritmos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SIS-102', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SIS-103', 'Matemática 1', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SIS-104', 'Comprensión y Redacción de Textos 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SIS-105', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SIS-106', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-SIS-201', 'Introducción a las TIC', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SIS-202', 'Matemática Discreta', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SIS-203', 'Matemática 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SIS-204', 'Problemas y Desafíos en el Perú Actual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SIS-205', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SIS-206', 'Estadística Descriptiva y Probabilidades', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SIS-207', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-SIS-301', 'Taller de Programación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SIS-302', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SIS-303', 'Cálculo 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SIS-304', 'Estadística Inferencial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SIS-305', 'Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SIS-306', 'Laboratorio de Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SIS-307', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-SIS-401', 'Programación Orientada a Objetos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SIS-402', 'Análisis y Diseño de Algoritmos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SIS-403', 'Cálculo 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SIS-404', 'Base de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SIS-405', 'Fundamentos de Electromagnetismo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SIS-406', 'Laboratorio de Fundamentos de Electromagnetismo', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (9 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-SIS-501', 'Investigación Académica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-502', 'Algoritmos y Estructura de Datos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-503', 'Diseño de Patrones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-504', 'Taller de Programación Web', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-505', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-506', 'Redes y Comunicación de Datos 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-507', 'Sistemas Operativos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-508', 'Herramientas Informáticas para la Toma de Decisiones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SIS-509', 'Base de Datos 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-SIS-601', 'Análisis y Diseño de Sistemas de Información', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SIS-602', 'Java Script Avanzado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SIS-603', 'Marcos de Desarrollo Web', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SIS-604', 'Hoja de Estilo en Cascada Avanzado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SIS-605', 'Gestión de Proyectos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SIS-606', 'Administración y Organización de Empresas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SIS-607', 'Curso Integrador 1: Sistemas Software', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-SIS-701', 'Lenguajes de Programación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SIS-702', 'Teoría de Sistemas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SIS-703', 'Diseño de Productos y Servicios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SIS-704', 'Desarrollo Web Integrado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SIS-705', 'Herramientas de Desarrollo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SIS-706', 'Liderazgo y Gestión de Equipos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SIS-707', 'Seguridad Informática', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-SIS-801', 'Herramientas para la Comunicación Efectiva', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SIS-802', 'Innovación y Transformación Digital', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SIS-803', 'Herramientas de Prototipado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SIS-804', 'Negociación y Narrativa', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SIS-805', 'Diseño e Implementación de Arquitectura Empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SIS-806', 'Gestión del Servicio TI', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-SIS-901', 'F o r m a c i ó n p a r a l a In v e s ti g a c i ó n - S i s temas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SIS-902', 'Interacción Hombre Máquina', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SIS-903', 'Curso Integrador 2: Sistemas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SIS-904', 'Inteligencia de Negocios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SIS-905', 'Planeamiento Estratégico de la s T IC s', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SIS-906', 'Sistemas de Información Empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SIS-907', 'Gestión del Conocimiento', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-SIS-1001', 'Ética Profesional', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SIS-1002', 'Herramientas de Desarrollo Profesional - TIC', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SIS-1003', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SIS-1004', 'Servicios Cloud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SIS-1005', 'Ingeniería Económica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SIS-1006', 'Taller de Investigación - Sistemas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SIS-1007', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería de Software (ingenieria-de-software)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Ingeniería de Software Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/ingenieria-de-software',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Certificaciones Progresivas en Desarrollo Full Stack, Cloud y Mobile'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería de Software',
  'ingenieria-de-software',
  'Facultad de Ingeniería',
  'Diseño, desarrollo, prueba y mantenimiento de software de escala mundial, aplicaciones móviles, sistemas distribuidos, servicios cloud, inteligencia artificial y metodologías ágiles DevOps.',
  10,
  5.00,
  'Bachiller Universitario en Ingeniería de Software',
  'Acreditado por ICACIT • Certificaciones Progresivas en Desarrollo Full Stack, Cloud y Mobile',
  'Ingeniero de software con sólida formación algorítmica y arquitectural, capaz de construir soluciones tecnológicas de alto rendimiento, escalabilidad y seguridad para la industria digital.',
  ARRAY['Empresas tecnológicas globales (Big Tech), fintechs y startups de software', 'Compañías de desarrollo de software, plataformas cloud, móviles y web', 'Departamentos de innovación tecnológica e ingeniería de software en corporaciones', 'Arquitectura de software, DevOps, ingeniería de datos y desarrollo Full Stack'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-de-software';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Ingeniería de Software Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/ingenieria-de-software', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-SOF-101', 'Principios de Algoritmos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SOF-102', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SOF-103', 'Matemática 1', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SOF-104', 'Comprensión y Redacción de Textos 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SOF-105', 'Individuo y Medio Ambiente', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-SOF-106', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-SOF-201', 'Introducción a las TIC', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SOF-202', 'Matemática Discreta', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SOF-203', 'Matemática 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SOF-204', 'P ro b l em a s y Desafíos en el Pe rú A ct u a l', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SOF-205', 'Comprensión y Redacción de Textos 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SOF-206', 'E s ta d í st i c a D e scriptiva y P ro b a b il i d a d e s', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-SOF-207', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-SOF-301', 'Taller de Programación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SOF-302', 'Ciudadanía y Reflexión Ética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SOF-303', 'Cálculo 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SOF-304', 'Laboratorio de Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SOF-305', 'Estadística Inferencial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SOF-306', 'Mecánica Clásica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-SOF-307', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-SOF-401', 'Programación Orientada a Objetos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SOF-402', 'Análisis y Diseño de Algoritmos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SOF-403', 'C á l c u l o 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SOF-404', 'Fundamentos de Electromagnetismo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SOF-405', 'Base de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-SOF-406', 'L ab o ra t o ri o d e F u n d a m entos de E le c t ro m a g n e ti s m o', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (9 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-SOF-501', 'Investigación Académica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-502', 'Algoritmos y Estructura de Datos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-503', 'Diseño de Patrones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-504', 'Taller de Programación Web', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-505', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-506', 'Sistemas Operativos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-507', 'Herramientas Informáticas para la Toma de Decisiones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-508', 'Base de Datos 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-SOF-509', 'Redes y Comunicación de Datos 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-SOF-601', 'Análisis y Diseño de Sistemas de Información', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SOF-602', 'Java Script Avanzado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SOF-603', 'Marcos de Desarrollo Web', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SOF-604', 'Hoja de Estilo en Cascada Avanzado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SOF-605', 'Gestión de Proyectos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SOF-606', 'Administración y Organización de Empresas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-SOF-607', 'Curso Integrador 1: Sistemas Software', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-SOF-701', 'Lenguajes de Programación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SOF-702', 'Teoría en Computación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SOF-703', 'Desarrollo de Software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SOF-704', 'Desarrollo Web Integrado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SOF-705', 'Herramientas de Desarrollo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SOF-706', 'Seguridad Informática', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-SOF-707', 'Diseño de Productos y Servicios', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-SOF-801', 'Herramientas para la Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-802', 'Desarrollo de Aplicaciones Móviles', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-803', 'Calidad de Software', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-804', 'Servicios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-805', 'Inteligencia de Negocios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-806', 'Negociación y Narrativa', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-807', 'Innovación y Transformación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-SOF-808', 'Digital', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-SOF-901', 'Desarrollo Full Stack', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SOF-902', 'Formación para la Investigación - Sistemas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SOF-903', 'P r u e b a s d e S o f tw ar e', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SOF-904', 'C u r so In t e g r a d o r 2 : S oftware', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SOF-905', 'Inteligencia Artificial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SOF-906', 'Sistemas de Información E m p r e s a ri a l', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-SOF-907', 'In te r a c c ió n Hombre Máquina', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-SOF-1001', 'Ética Profesional', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SOF-1002', 'Taller de Investigación - Software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SOF-1003', 'Formación para la Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SOF-1004', 'Servicios Cloud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SOF-1005', 'Ingeniería Económica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SOF-1006', 'Herramientas de Desarrollo Profesional - TIC', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-SOF-1007', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Psicología (psicologia)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Psicología Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/psicologia',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación Internacional • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Psicología',
  'psicologia',
  'Facultad de Ciencias de la Salud',
  'Evaluación, diagnóstico, intervención y prevención en el comportamiento humano en los campos clínico, educativo, organizacional y social-comunitario, promoviendo el bienestar psicológico y la salud mental.',
  10,
  5.00,
  'Bachiller Universitario en Psicología',
  'Acreditación Internacional • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias',
  'Psicólogo con sólida formación científica y ética, capacitado para realizar psicodiagnósticos, aplicar terapias basadas en evidencia, potenciar el talento humano y liderar proyectos psicoeducativos.',
  ARRAY['Clínicas, hospitales y centros de salud mental públicos y privados', 'Áreas de gestión del talento humano, bienestar laboral y desarrollo organizacional', 'Colegios, institutos y universidades como psicólogo educativo y tutor', 'Consultorios privados, terapia psicológica y programas de desarrollo comunitario'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'psicologia';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Psicología Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/psicologia', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-PSI-101', 'Comprensión y Redacción de Textos 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PSI-102', 'Individuo y Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PSI-103', 'Introducción a la Vida Universitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PSI-104', 'Introducción a la Psicología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PSI-105', 'Observación del Comportamiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-PSI-106', 'Inglés 1', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-PSI-201', 'Comprensión y Redacción de Textos 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PSI-202', 'Bases Biológicas del Comportamiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PSI-203', 'Tecnologías del Aprendizaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PSI-204', 'Psicología del Desarrollo 1: Aprendizaje de Servicio', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PSI-205', 'Observación y Entrevista', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-PSI-206', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-PSI-301', 'Problemas y Desafíos en el Perú Actual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PSI-302', 'Neuropsicología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PSI-303', 'Personalidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PSI-304', 'Psicología del Desarrollo 2: Aprendizaje de Servicio', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PSI-305', 'Psicología Experimental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-PSI-306', 'Inglés 3', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-PSI-401', 'Ciudadanía y Reflexión Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PSI-402', 'Pruebas Psicométricas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PSI-403', 'Psicopatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PSI-404', 'Estadística Descriptiva para Psicología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PSI-405', 'Psicología Social - Comunitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-PSI-406', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-PSI-501', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PSI-502', 'Motivación y Emoción', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PSI-503', 'Estadística Inferencial para Psicología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PSI-504', 'Pruebas Proyectivas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PSI-505', 'Curso Integrador 1: Portafolio 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-PSI-506', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-PSI-601', 'Psicología de las Organizaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PSI-602', 'Dinámica de Grupos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PSI-603', 'Diagnóstico Diferencial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PSI-604', 'Psicología Educativa', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PSI-605', 'Psicología Cultural', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-PSI-606', 'Construcción de Pruebas Psicológicas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-PSI-701', 'Dificultades del Aprendizaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PSI-702', 'Diagnóstico Vocacional y Educacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PSI-703', 'Creatividad e Innovación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PSI-704', 'Gestión Humana en las Organizaciones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PSI-705', 'Técnicas Psicoterapéuticas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-PSI-706', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-PSI-801', 'Diagnóstico y Desarrollo Organizacional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PSI-802', 'Ética en Psicología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PSI-803', 'Intervención Psicoeducativa', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PSI-804', 'Formación para la Investigación en Psicología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PSI-805', 'Salud Mental y Rehabilitación Social', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-PSI-806', 'Curso Integrador 2: Portafolio 2', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (3 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-PSI-901', 'Consultoría en Organizaciones', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PSI-902', 'Investigación Aplicada a la Psicología', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-PSI-903', 'Internado 1', 7.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (3 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-PSI-1001', 'Formación para la Empleabilidad', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PSI-1002', 'Taller de Investigación - Psicología', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-PSI-1003', 'Internado 2', 7.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Medicina Humana (medicina-humana)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UTP - Medicina Humana Pregrado 2026',
  'Universidad Tecnológica del Perú',
  'https://www.utp.edu.pe/carrera/medicina-humana',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 14 ciclos y 281 créditos. Centros de Simulación Clínica de Última Generación • Hospitales Docentes en Redes Asistenciales'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Medicina Humana',
  'medicina-humana',
  'Facultad de Ciencias de la Salud',
  'Formación médica integral y de excelencia, fundamentada en ciencias biomédicas, razonamiento clínico, salud pública, destrezas quirúrgicas y humanismo médico para el diagnóstico, tratamiento y prevención de patologías.',
  14,
  7.00,
  'Bachiller en Medicina',
  'Centros de Simulación Clínica de Última Generación • Hospitales Docentes en Redes Asistenciales',
  'Médico Cirujano competente, ético y humanitario, con destrezas clínicas y quirúrgicas para la atención del paciente hospitalario y ambulatorio, liderazgo en salud pública e investigación biomédica.',
  ARRAY['Hospitales y centros de salud de alta complejidad públicos (MINSA, EsSalud, FF.AA.) y privados', 'Clínicas especializadas e institutos nacionales de salud', 'Centros de investigación biomédica, laboratorios clínicos y salud pública', 'Atención médica domiciliaria, consultorios privados y docencia universitaria'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  duration_semesters = EXCLUDED.duration_semesters,
  duration_years = EXCLUDED.duration_years,
  degree = EXCLUDED.degree,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

DO $$
DECLARE
  v_utp_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_utp_id FROM institutions WHERE short_name = 'UTP';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'medicina-humana';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UTP - Medicina Humana Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UTP
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_utp_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_utp_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.utp.edu.pe/carrera/medicina-humana', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_utp_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UTP 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UTP 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UTP-MED-101', 'Matemática para Medicina', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-MED-102', 'Química General y Orgánica para Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-MED-103', 'Bases Psicológicas del Comportamiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-MED-104', 'Inglés 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UTP-MED-105', 'Introducción a la Vida Universitaria: Aprendiendo a ser Médico', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UTP-MED-201', 'Física para Medicina', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-MED-202', 'Ciencias Biológicas 1: Biología Celular', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-MED-203', 'Comprensión y Redacción de Textos 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-MED-204', 'Medicina Comunitaria 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-MED-205', 'Herramientas Digitales para el Aprendizaje', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UTP-MED-206', 'Inglés 2', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UTP-MED-301', 'De la Estructura a la Función 1: Sistema Locomotor, Neurológico, Tegumentario', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-MED-302', 'Ciencias Biológicas 2: Bioquímica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-MED-303', 'Integrando en Base a Problemas 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-MED-304', 'Medicina Comunitaria 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UTP-MED-305', 'Inglés 3', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UTP-MED-401', 'De la Estructura a la Función 2: Sistema Cardiovascular, Respiratorio, Gastrointestinal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-MED-402', 'Medicina Comunitaria 3', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-MED-403', 'Comprensión y Redacción de Textos 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-MED-404', 'Ciencias Biológicas 3: Biología Molecular y Genética', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-MED-405', 'Inglés 4', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UTP-MED-406', 'Integrando en Base a Problemas 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UTP-MED-501', 'De la Estructura a la Función 3: Sistema Endocrinològico, Reproductor, Urinario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-MED-502', 'De los Genes a la Enfermedad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-MED-503', 'Patología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-MED-504', 'Ciudadanía y Reflexión Ética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UTP-MED-505', 'Medicina Comunitaria 4', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UTP-MED-601', 'Defensa Inmunológica, Microbiología e Infección', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-MED-602', 'Farmacología para Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-MED-603', 'De la Historia Clínica al Diagnóstico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-MED-604', 'Individuo y Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UTP-MED-605', 'Ética y Humanismo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UTP-MED-701', 'Clínica 1: Cardiología, Neumología, Neurología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-MED-702', 'Investigación Académica', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-MED-703', 'Formación para la Empleabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-MED-704', 'Problemas y Desafíos del Perú Actual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UTP-MED-705', 'Salud Pública y Medicina Preventiva', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UTP-MED-801', 'Clínica 2: Gastroenterología, Reumatología, Endocrinología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-MED-802', 'Salud Mental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-MED-803', 'Nutrición y Estilos de Vida Saludable', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-MED-804', 'Bioética y Deontología Médica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-MED-805', 'Bioestadística para Medicina', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UTP-MED-806', 'Herramientas para la Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UTP-MED-901', 'Clínica 3: Hematología, Dermatología, Nefrología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-MED-902', 'Infectología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-MED-903', 'Taller de Terapéutica Médica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-MED-904', 'Innovación Tecnológica en Medicina', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-MED-905', 'Formación para la Investigación en Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UTP-MED-906', 'Epidemiología Aplicada', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UTP-MED-1001', 'Clínica Quirúrgica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-MED-1002', 'Procedimientos Quirúrgicos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-MED-1003', 'Clínica de Emergencia', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-MED-1004', 'Medicina Legal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-MED-1005', 'Taller de Investigación - Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UTP-MED-1006', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 11 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 11, 'UTP-MED-1101', 'Clínica Pediátrica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UTP-MED-1102', 'Clínica Ginecobstétrica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UTP-MED-1103', 'Geriatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UTP-MED-1104', 'Taller de Tesis - Medicina', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UTP-MED-1105', 'Gestión en Salud 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 12 (3 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 12, 'UTP-MED-1201', 'Gestión en Salud 2', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UTP-MED-1202', 'Externado', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UTP-MED-1203', 'Electivo 2', 6.0, 'ELECTIVO', v_source_id);

  -- CICLO 13 (4 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 13, 'UTP-MED-1301', 'Curso Integrador 1 - Medicina', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 13, 'UTP-MED-1302', 'Internado de Medicina I', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 13, 'UTP-MED-1303', 'Internado de Cirugía', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 13, 'UTP-MED-1304', 'Trabajo de Investigación - Medicina', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 14 (3 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 14, 'UTP-MED-1401', 'Curso Integrador 2 - Medicina', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 14, 'UTP-MED-1402', 'Internado de Ginecología y Obstetricia', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 14, 'UTP-MED-1403', 'Internado de Pediatría', 7.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UTP 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_utp_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Informe DQE / Estudio de Empleabilidad Egresados UTP',
    '9 de cada 10 egresados de la Universidad Tecnológica del Perú (UTP) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;
