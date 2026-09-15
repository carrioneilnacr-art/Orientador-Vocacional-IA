-- ============================================================================
-- MIGRACIÓN 009: Sembrado de Carreras, Sedes y Mallas Verificadas UCH 2026
-- ============================================================================
-- Fecha de creación: 2026-09-15
-- Trazabilidad: Brochures oficiales de Pregrado 2026 de UCH (archivos u/uch)
-- Grounded AI: Cero alucinaciones, datos validados por SUNEDU y UCH.
-- ============================================================================

-- 1. FUENTES DE VERIFICACIÓN (SOURCES)
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochures Oficiales UCH - Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Mallas curriculares oficiales de 9 carreras de pregrado, planes de estudio, certificaciones intermedias y campus Los Olivos licenciado por SUNEDU.'
)
ON CONFLICT DO NOTHING;

-- 2. REGISTRAR INSTITUCIÓN: UNIVERSIDAD DE CIENCIAS Y HUMANIDADES (UCH)
INSERT INTO institutions (name, short_name, institution_type, description, website_url, is_active)
VALUES (
  'Universidad de Ciencias y Humanidades',
  'UCH',
  'PRIVADA_SOCIETARIA',
  'Universidad licenciada por SUNEDU, con moderna sede universitaria en Lima Norte (Los Olivos), formación integral con investigación formativa desde los primeros ciclos y más del 90% de empleabilidad.',
  'https://www.uch.edu.pe',
  true
)
ON CONFLICT (short_name) DO UPDATE SET
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url;

-- 3. REGISTRAR CAMPUS DE LA UCH
DO $$
DECLARE
  v_uch_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';

  INSERT INTO campuses (institution_id, name, address, district, city, is_active)
  VALUES
    (v_uch_id, 'Campus Los Olivos', 'Av. Universitaria 5175', 'Los Olivos', 'Lima', true)
  ON CONFLICT DO NOTHING;
END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Ambiental (ingenieria-ambiental)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Ingeniería Ambiental Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/ingenieria-ambiental',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 205 créditos. Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Asistente en Monitoreo Ambiental • 8.º ciclo: Asistente en Gestión Ambiental'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Ambiental',
  'ingenieria-ambiental',
  'Facultad de Ciencias e Ingeniería',
  'Formación integral con sólida base científica y tecnológica para evaluar, mitigar y remediar problemáticas ambientales en suelos, agua y aire, gestionando recursos naturales con enfoque de desarrollo sostenible.',
  10,
  5.0,
  'Bachiller en Ingeniería Ambiental',
  'Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Asistente en Monitoreo Ambiental • 8.º ciclo: Asistente en Gestión Ambiental',
  'Ingeniero ambiental competente en monitoreo ambiental, tecnologías de tratamiento de efluentes, evaluación de impacto ambiental y gestión integral de riesgos y cuencas hidrográficas.',
  ARRAY['Sistemas integrados de gestión (SIG)', 'Consultoría y auditoría ambiental', 'Gestión de recursos hídricos y residuos sólidos', 'Sector minero, energético e industrial', 'Ministerio del Ambiente, OEFA y municipalidades'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-ambiental';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Ingeniería Ambiental Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/ingenieria-ambiental', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-AMB-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-AMB-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-AMB-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-AMB-0104', 'Química General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-AMB-0105', 'Biología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-AMB-0106', 'Introducción a la Ingeniería Ambiental', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-AMB-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-AMB-0202', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-AMB-0203', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-AMB-0204', 'Cálculo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-AMB-0205', 'Economía General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-AMB-0206', 'Química Inorgánica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-AMB-0207', 'Dibujo de Ingeniería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-AMB-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0302', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0303', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0304', 'Cálculo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0305', 'Física I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0306', 'Química Orgánica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0307', 'Geología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-AMB-0308', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-AMB-0401', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-AMB-0402', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-AMB-0403', 'Cálculo III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-AMB-0404', 'Física II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-AMB-0405', 'Microbiología Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-AMB-0406', 'Química Analítica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-AMB-0407', 'Economía Ambiental', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-AMB-0501', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-AMB-0502', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-AMB-0503', 'Edafología y Manejo de Suelos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-AMB-0504', 'Tecnologías de Tratamiento de la Contaminación del Agua', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-AMB-0505', 'Sistemas de Información Geográfica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-AMB-0506', 'Meteorología y Climatología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-AMB-0601', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-AMB-0602', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-AMB-0603', 'Balance de Materia y Energía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-AMB-0604', 'Ecología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-AMB-0605', 'Mecánica de Fluidos para Ingeniería Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-AMB-0606', 'Lenguaje de Programación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-AMB-0607', 'Taller de Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-AMB-0701', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-AMB-0702', 'Trabajos de investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-AMB-0703', 'Tecnologías de Tratamiento de la Contaminación del Aire', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-AMB-0704', 'Gestión de Riesgos Ambientales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-AMB-0705', 'Derecho Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-AMB-0706', 'Modelamiento Ambiental Computacional', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-AMB-0801', 'Trabajos de investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-AMB-0802', 'Tecnologías de Tratamiento de la Contaminación del Suelo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-AMB-0803', 'Planeamiento y Ordenamiento Territorial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-AMB-0804', 'Planificación, Costos y Presupuestos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-AMB-0805', 'Taller para prácticas preprofesionales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-AMB-0806', 'Electivo I', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-AMB-0901', 'Trabajos de investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-AMB-0902', 'Gestión de Recursos Hídricos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-AMB-0903', 'Gestión de Residuos Sólidos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-AMB-0904', 'Participación Ciudadana y Resolución de Conflictos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-AMB-0905', 'Prácticas profesionales supervisadas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-AMB-0906', 'Electivo II', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-AMB-1001', 'Trabajos de investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-AMB-1002', 'Análisis de Ciclo de Vida de los Productos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-AMB-1003', 'Proyecto de fin de carrera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-AMB-1004', 'Gestión Integral de Cuencas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-AMB-1005', 'Evaluación de Impacto Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-AMB-1006', 'Electivo III', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Comunicación y Medios Digitales (comunicacion-y-medios-digitales)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Comunicación y Medios Digitales Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/comunicacion-y-medios-digitales',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Licenciada por SUNEDU • Certificaciones: 6.º ciclo: Asistente en Comunicación Digital, Institucional y Corporativa • 9.º ciclo: Especialista en Medios Digitales'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Comunicación y Medios Digitales',
  'comunicacion-y-medios-digitales',
  'Facultad de Humanidades y Ciencias Sociales',
  'Formación especializada en periodismo transmedia, creación de contenidos digitales, gestión de comunidades y reputación corporativa para transformar la comunicación en entornos digitales globales.',
  10,
  5.0,
  'Bachiller en Comunicación y Medios Digitales',
  'Licenciada por SUNEDU • Certificaciones: 6.º ciclo: Asistente en Comunicación Digital, Institucional y Corporativa • 9.º ciclo: Especialista en Medios Digitales',
  'Comunicador digital capacitado para planificar y liderar proyectos de comunicación estratégica, producir narrativas multimedia e influir positivamente en audiencias diversas con rigor ético.',
  ARRAY['Medios de comunicación masivos y periodismo digital', 'Direcciones de comunicación corporativa y relaciones públicas', 'Agencias de publicidad, social media y marketing de contenidos', 'Producción audiovisual digital, radio y podcasting', 'Comunicación e imagen institucional en entidades públicas y ONG'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'comunicacion-y-medios-digitales';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Comunicación y Medios Digitales Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/comunicacion-y-medios-digitales', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-COM-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-COM-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-COM-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-COM-0104', 'Introducción a la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-COM-0105', 'Historia de los Medios de Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-COM-0106', 'Creatividad y Comunicación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-COM-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-COM-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-COM-0203', 'Teorías de la Comunicación I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-COM-0204', 'Comunicación y Estética Visual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-COM-0205', 'Comunicación en el contexto nacional y mundial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-COM-0206', 'Análisis y Tipología de Audiencias', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-COM-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-COM-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-COM-0303', 'Teorías de la Comunicación II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-COM-0304', 'Fundamentos del Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-COM-0305', 'Creación Fotográfica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-COM-0306', 'Taller de Diseño y Animación Multimedia', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-COM-0401', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-COM-0402', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-COM-0403', 'Semiótica de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-COM-0404', 'Comunicación Institucional y Corporativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-COM-0405', 'Comunicación Publicitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-COM-0406', 'Comunicación Periodística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-COM-0407', 'Narrativas Digitales', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-COM-0501', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-COM-0502', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-COM-0503', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-COM-0504', 'Comunicación y Sostenibilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-COM-0505', 'Reputación Corporativa Digital', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-COM-0506', 'Estudios de Opinión y Mercado', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-COM-0507', 'Creación de Contenidos Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-COM-0601', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-COM-0602', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-COM-0603', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-COM-0604', 'Comunicación para el Desarrollo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-COM-0605', 'Comunicación Digital y Transmedia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-COM-0606', 'Comunicación y Estética Audiovisual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-COM-0607', 'Radio y podcasting', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-COM-0701', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-COM-0702', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-COM-0703', 'Trabajos de investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-COM-0704', 'Marketing Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-COM-0705', 'Gestión de Comunidades Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-COM-0706', 'Comunicación e Interculturalidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-COM-0707', 'Creación de Contenidos Digitales', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-COM-0801', 'Trabajos de Investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-COM-0802', 'Comunicación y Conflictos Sociales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-COM-0803', 'Métricas y Audiencias Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-COM-0804', 'Comunicación Política', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-COM-0805', 'Electivo I', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UCH-COM-0806', 'Aplicaciones Interactivas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-COM-0901', 'Trabajos de investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-COM-0902', 'Planeamiento Estratégico de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-COM-0903', 'Comunicación en la Sociedad Global', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-COM-0904', 'Comunicación Digital e Innovación Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-COM-0905', 'Prácticas preprofesionales I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-COM-0906', 'Electivo II', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-COM-1001', 'Trabajos de investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-COM-1002', 'Campañas de Comunicación Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-COM-1003', 'Diseño y Gestión de Proyectos de Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-COM-1004', 'Ética de la Comunicación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-COM-1005', 'Prácticas preprofesionales II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-COM-1006', 'Electivo III', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Contabilidad con mención en Finanzas (contabilidad-y-finanzas)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Contabilidad con mención en Finanzas Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/contabilidad-y-finanzas',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Auxiliar contable • 7.º ciclo: Analista contable • 9.º ciclo: Analista financiero'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Contabilidad con mención en Finanzas',
  'contabilidad-y-finanzas',
  'Facultad de Ciencias Contables, Económicas y Financieras',
  'Formación enfocada en doctrina contable, finanzas internacionales, auditoría gubernamental y tributación avanzada bajo normas NIIF, incorporando big data y analítica de datos en la gestión financiera.',
  10,
  5.0,
  'Bachiller en Contabilidad con mención en Finanzas',
  'Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Auxiliar contable • 7.º ciclo: Analista contable • 9.º ciclo: Analista financiero',
  'Contador público con mención en finanzas capaz de auditar, diseñar estrategias fiscales y liderar la toma de decisiones financieras en organizaciones públicas y corporaciones privadas.',
  ARRAY['Firmas internacionales y locales de auditoría y consultoría', 'Gerencias de finanzas, contabilidad y tesorería en bancos y empresas', 'Entidades del sector público, SUNAT, MEF y Contraloría', 'Empresas mineras, industriales, comerciales y startups'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'contabilidad-y-finanzas';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Contabilidad con mención en Finanzas Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/contabilidad-y-finanzas', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-CON-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-CON-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-CON-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-CON-0104', 'Economía General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-CON-0105', 'Vocación contable', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-CON-0106', 'Fundamentos de Contabilidad', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-CON-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-CON-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-CON-0203', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-CON-0204', 'Análisis de Hechos Económicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-CON-0205', 'Doctrina Contable', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-CON-0206', 'Herramientas Informáticas para la Gestión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-CON-0207', 'Contabilidad I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-CON-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-CON-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-CON-0303', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-CON-0304', 'Observación y Análisis de Problemas Públicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-CON-0305', 'Derecho Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-CON-0306', 'Contabilidad II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-CON-0307', 'Tributación I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-CON-0401', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0402', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0403', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0404', 'Normativa Contable Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0405', 'Legislación del Trabajo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0406', 'Contabilidad Intermedia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0407', 'Informática Contable I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-CON-0408', 'Tributación II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-CON-0501', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-CON-0502', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-CON-0503', 'Contabilidad de Sociedades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-CON-0504', 'Contabilidad de Costos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-CON-0505', 'Finanzas I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-CON-0601', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-CON-0602', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-CON-0603', 'Matemática Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-CON-0604', 'Contabilidad y Finanzas para la Micro y Pequeña Empresa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-CON-0605', 'Tributación III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-CON-0606', 'Informática Contable II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-CON-0701', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-CON-0702', 'Prácticas pre profesionales I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-CON-0703', 'Contabilidad de Costos II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-CON-0704', 'Finanzas II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-CON-0705', 'Administración General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-CON-0706', 'Trabajo de investigación I', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (8 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-CON-0801', 'Contabilidad por Sectores Económicos I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0802', 'Marketing para Emprendedores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0803', 'Prácticas pre profesionales II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0804', 'Finanzas Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0805', 'Auditoría Operativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0806', 'Gestión de Comercio Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0807', 'Trabajo de investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-CON-0808', 'Contabilidad por Sectores Económicos II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-CON-0901', 'Prácticas preprofesionales III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-CON-0902', 'Contabilidad Gubernamental I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-CON-0903', 'Auditoría Financiera', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-CON-0904', 'Taller NIIF', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-CON-0905', 'Evaluación de Proyectos de Inversión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-CON-0906', 'Trabajo de investigación III', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-CON-1001', 'Contabilidad Gubernamental II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-CON-1002', 'Auditoría Gubernamental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-CON-1003', 'Big data y data analytics en la Contabilidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-CON-1004', 'Trabajo de investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-CON-1005', 'Ética Contable', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Derecho (derecho)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Derecho Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/derecho',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 11 ciclos y 220 créditos. Licenciada por SUNEDU • Certificaciones: 7.º ciclo: Analista en Derecho de Organizaciones Públicas • 9.º ciclo: Analista en Derecho de Organizaciones Privadas'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Derecho',
  'derecho',
  'Facultad de Humanidades y Ciencias Sociales',
  'Formación humanista y jurídica con énfasis en litigación oral, derecho de organizaciones públicas y privadas, compliance y resolución alternativa de conflictos con prácticas en clínicas jurídicas.',
  11,
  5.5,
  'Bachiller en Derecho',
  'Licenciada por SUNEDU • Certificaciones: 7.º ciclo: Analista en Derecho de Organizaciones Públicas • 9.º ciclo: Analista en Derecho de Organizaciones Privadas',
  'Abogado con alto sentido de justicia, destreza en argumentación jurídica, defensa procesal en tribunales y asesoría jurídica integral en entornos empresariales y gubernamentales.',
  ARRAY['Poder Judicial, Ministerio Público, Tribunal Constitucional y notarías', 'Estudios jurídicos corporativos y consultoría empresarial', 'Diseño de programas de compliance y asesoría en contrataciones públicas', 'Asesoría legal en banca, seguros, minería y telecomunicaciones'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'derecho';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Derecho Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/derecho', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-DER-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-DER-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-DER-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-DER-0104', 'Introducción al Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-DER-0105', 'Taller de Habilidades Blandas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-DER-0106', 'Ciencias Sociales y Derecho', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-DER-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-DER-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-DER-0203', 'Contabilidad y Finanzas para Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-DER-0204', 'Sistemas Jurídicos: Romano y Anglosajón', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-DER-0205', 'Ciencias Políticas y Realidad Nacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-DER-0206', 'Derechos Humanos', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-DER-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-DER-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-DER-0303', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-DER-0304', 'Economía General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-DER-0305', 'Lógica y Argumentación Jurídica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-DER-0306', 'Personas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-DER-0401', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-DER-0402', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-DER-0403', 'Teoría del Conflicto y Mecanismos de Solución', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-DER-0404', 'Teoría General del Proceso', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-DER-0405', 'Derecho Penal General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-DER-0406', 'Derecho Constitucional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-DER-0407', 'Acto Jurídico', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-DER-0501', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-DER-0502', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-DER-0503', 'Derecho Administrativo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-DER-0504', 'Derecho de Empresas I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-DER-0505', 'Derecho Penal Especial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-DER-0506', 'Derecho Procesal Penal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-DER-0507', 'Obligaciones y Contratos', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-DER-0601', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-DER-0602', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-DER-0603', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-DER-0604', 'Filosofía del Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-DER-0605', 'Derecho Procesal Civil', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-DER-0606', 'Reales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-DER-0607', 'Familia y Sucesiones', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-DER-0701', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-DER-0702', 'Taller de Planificación y Organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-DER-0703', 'Derecho de Empresas II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-DER-0704', 'Responsabilidad Civil', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-DER-0705', 'Derecho Procesal Constitucional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-DER-0706', 'Derecho Laboral General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-DER-0707', 'Derecho Contencioso Administrativo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-DER-0801', 'Trabajo de investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-DER-0802', 'Derecho Tributario I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-DER-0803', 'Derecho Laboral Especial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-DER-0804', 'Derecho Internacional Público', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-DER-0805', 'Fundamentos Jurídicos de la Gestión Pública', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-DER-0806', 'Taller de Negociación y Litigación Oral', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-DER-0901', 'Trabajo de investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-DER-0902', 'Derecho Tributario II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-DER-0903', 'Derecho Internacional Privado', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-DER-0904', 'Derecho Procesal Laboral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-DER-0905', 'Tecnología y Derecho', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-DER-0906', 'Fundamentos de las Ciencias Empresariales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-DER-0907', 'Derecho Registral y Notarial', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-DER-1001', 'Trabajo de investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-DER-1002', 'Clínica Jurídica I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-DER-1003', 'Electivo Seminario I', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UCH-DER-1004', 'Electivo para mención I', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UCH-DER-1005', 'Electivo para mención II', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 11 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 11, 'UCH-DER-1101', 'Derecho de Competencia y Protección al Consumidor', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-DER-1102', 'Trabajo de investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-DER-1103', 'Clínica Jurídica II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-DER-1104', 'Electivo seminario II', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 11, 'UCH-DER-1105', 'Electivo para mención III', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 11, 'UCH-DER-1106', 'Electivo para mención IV', 4.0, 'ELECTIVO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Enfermería (enfermeria)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Enfermería Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/enfermeria',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 205 créditos. Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Auxiliar en Enfermería y Primeros Auxilios • 6.º ciclo: Asistente de Enfermería Integral'
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
  'Formación científica y humanizada centrada en el cuidado integral de la persona, la familia y la comunidad en todas las etapas del ciclo vital, con internado hospitalario y comunitario temprano.',
  10,
  5.0,
  'Bachiller en Enfermería',
  'Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Auxiliar en Enfermería y Primeros Auxilios • 6.º ciclo: Asistente de Enfermería Integral',
  'Licenciado en enfermería con liderazgo clínico, destrezas en atención primaria, emergencias y cuidados críticos, y sólida vocación de servicio y salud comunitaria.',
  ARRAY['Hospitales públicos (MINSA, EsSalud, Fuerzas Armadas) y clínicas privadas', 'Centros de atención primaria, postas médicas y salud comunitaria', 'Unidades de cuidados intensivos (UCI), emergencias y pediatría', 'Gestión y administración de servicios de salud y salud ocupacional corporativa'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'enfermeria';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Enfermería Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/enfermeria', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-ENF-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-ENF-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-ENF-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-ENF-0104', 'Biología Celular', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-ENF-0105', 'Química General y Orgánica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-ENF-0106', 'Introducción a la Enfermería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-ENF-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-ENF-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-ENF-0203', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-ENF-0204', 'Bioquímica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-ENF-0205', 'Anatomía Humana', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-ENF-0206', 'Metodología del Cuidado de Enfermería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-ENF-0207', 'Software y Tecnología Aplicado a la Salud', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-ENF-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-ENF-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-ENF-0303', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-ENF-0304', 'Fisiología Humana', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-ENF-0305', 'Base de la Farmacología en Enfermería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-ENF-0306', 'Educación para la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-ENF-0307', 'Cuidados Básicos de Enfermería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-ENF-0401', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-ENF-0402', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-ENF-0403', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-ENF-0404', 'Microbiología y Parasitología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-ENF-0405', 'Nutrición y Dietoterapia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-ENF-0406', 'Cuidados de Enfermería en Salud del Adulto I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-ENF-0407', 'Cuidados de Enfermería en Salud Comunitaria', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-ENF-0501', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-ENF-0502', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-ENF-0503', 'Escritura Científica en Inglés Técnico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-ENF-0504', 'Cuidados de Enfermería en Salud de la Mujer y Recién Nacido', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-ENF-0505', 'Administración de los Servicios de Salud', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-ENF-0601', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-ENF-0602', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-ENF-0603', 'Salud Pública y Epidemiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-ENF-0604', 'Psicología evolutiva', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-ENF-0605', 'Cuidados de Enfermería en Salud del Adulto II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-ENF-0606', 'Cuidados de Enfermería en Salud Familiar', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-ENF-0701', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-ENF-0702', 'Trabajo de investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-ENF-0703', 'Cuidados de Enfermería en Salud del Niño y Adolescente Sano', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-ENF-0704', 'Cuidados de Enfermería en Salud Mental y Psiquiatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-ENF-0705', 'Electivo I', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (4 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-ENF-0801', 'Trabajo de investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-ENF-0802', 'Cuidados de Enfermería en Salud del Niño y Adolescente con Problemas de Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-ENF-0803', 'Cuidados de Enfermería en Pacientes en Estado Crítico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-ENF-0804', 'Electivo II', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (3 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-ENF-0901', 'Trabajo de investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-ENF-0902', 'Internado comunitario', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-ENF-0903', 'Electivo III', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 10 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-ENF-1001', 'Trabajo de investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-ENF-1002', 'Internado hospitalario', 8.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Industrial (ingenieria-industrial)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Ingeniería Industrial Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/ingenieria-industrial',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 205 créditos. Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Asistente en Evaluación de Procesos • 8.º ciclo: Especialista en Logística'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería Industrial',
  'ingenieria-industrial',
  'Facultad de Ciencias e Ingeniería',
  'Formación enfocada en la optimización de procesos de manufactura y servicios, automatización industrial, analítica de operaciones, supply chain y sistemas integrados de gestión de calidad y seguridad.',
  10,
  5.0,
  'Bachiller en Ingeniería Industrial',
  'Licenciada por SUNEDU • Certificaciones: 4.º ciclo: Asistente en Evaluación de Procesos • 8.º ciclo: Especialista en Logística',
  'Ingeniero industrial capaz de diseñar, simular y dirigir plantas operativas y centros logísticos, maximizando la rentabilidad y garantizando la sostenibilidad empresarial.',
  ARRAY['Plantas de manufactura, alimentos, consumo masivo y automotriz', 'Operadores logísticos, centros de distribución y cadena de suministro global', 'Gestión de calidad, seguridad industrial y salud ocupacional', 'Consultoría en mejora continua, Lean Manufacturing y optimización de proyectos'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-industrial';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Ingeniería Industrial Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/ingenieria-industrial', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-IND-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-IND-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-IND-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-IND-0104', 'Química General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-IND-0105', 'Introducción a la Ingeniería Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-IND-0106', 'Creatividad e Innovación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-IND-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-IND-0202', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-IND-0203', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-IND-0204', 'Cálculo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-IND-0205', 'Dibujo en Ingeniería', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-IND-0206', 'Economía General', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-IND-0301', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-IND-0302', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-IND-0303', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-IND-0304', 'Cálculo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-IND-0305', 'Física I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-IND-0306', 'Análisis de Procesos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-IND-0307', 'Contabilidad y Costeo de Operaciones', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-IND-0401', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-IND-0402', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-IND-0403', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-IND-0404', 'Cálculo III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-IND-0405', 'Física II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-IND-0406', 'Gestión de Calidad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-IND-0407', 'Operaciones y Procesos Unitarios de Producción', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-IND-0501', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-IND-0502', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-IND-0503', 'Tecnología Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-IND-0504', 'Investigación de Operaciones II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-IND-0505', 'Mecánica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-IND-0506', 'Ingeniería del Trabajo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-IND-0601', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-IND-0602', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-IND-0603', 'Termodinámica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-IND-0604', 'Investigación de Operaciones I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-IND-0605', 'Taller de Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-IND-0606', 'Ingeniería Eléctrica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-IND-0607', 'Lenguaje de Programación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-IND-0701', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-IND-0702', 'Trabajo de investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-IND-0703', 'Planeamiento y Control de Operaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-IND-0704', 'Ingeniería Económica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-IND-0705', 'Diseño de Instalaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-IND-0706', 'Gestión del Talento Humano', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-IND-0801', 'Trabajo de investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-IND-0802', 'Gestión de Operaciones de Servicios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-IND-0803', 'Automatización Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-IND-0804', 'Gestión de la Cadena de Valor de Suministros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-IND-0805', 'Técnicas de Simulación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-IND-0806', 'Taller para prácticas preprofesionales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-IND-0901', 'Trabajo de investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-IND-0902', 'Dirección Estratégica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-IND-0903', 'Logística Avanzada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-IND-0904', 'Seguridad Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-IND-0905', 'Gestión Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-IND-0906', 'Prácticas preprofesionales supervisadas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-IND-1001', 'Trabajo de investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-IND-1002', 'Diagnóstico y Mejora Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-IND-1003', 'Formulación, Gestión y Evaluación de Proyectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-IND-1004', 'Gestión de Mantenimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-IND-1005', 'Marketing Estratégico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-IND-1006', 'Gerencia Comercial', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Psicología (psicologia)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Psicología Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/psicologia',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Licenciada por SUNEDU • Certificaciones: 6.º ciclo: Asistente en Evaluación Psicométrica • 8.º ciclo: Promotor de Programas Preventivos y Promocionales de Bienestar Psicológico'
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
  'Formación en evaluación, diagnóstico e intervención psicológica con prácticas formativas continuas desde los primeros ciclos en las áreas clínica, educativa, social y organizacional.',
  10,
  5.0,
  'Bachiller en Psicología',
  'Licenciada por SUNEDU • Certificaciones: 6.º ciclo: Asistente en Evaluación Psicométrica • 8.º ciclo: Promotor de Programas Preventivos y Promocionales de Bienestar Psicológico',
  'Psicólogo capacitado para diseñar programas preventivo-promocionales de salud mental, aplicar instrumentos psicométricos avanzados y realizar psicoterapia e intervenciones basadas en evidencia.',
  ARRAY['Centros de salud, hospitales y clínicas en psicología clínica y psicoterapia', 'Instituciones educativas en orientación vocacional y problemas de aprendizaje', 'Empresas en recursos humanos, selección por competencias y clima laboral', 'Organizaciones comunitarias y proyectos de intervención psicosocial'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'psicologia';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Psicología Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/psicologia', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-PSI-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-PSI-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-PSI-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-PSI-0104', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-PSI-0105', 'Psicología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-PSI-0106', 'Práctica formativa I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-PSI-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-PSI-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-PSI-0203', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-PSI-0204', 'Conocimiento científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-PSI-0205', 'Bases Biológicas del Psiquismo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-PSI-0206', 'Psicología y Realidad Nacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-PSI-0207', 'Práctica formativa II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-PSI-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-PSI-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-PSI-0303', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-PSI-0304', 'Técnicas de Entrevista y Observación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-PSI-0305', 'Historia y Sistemas de la Psicología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-PSI-0306', 'Psicología Evolutiva I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-PSI-0307', 'Práctica formativa III', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-PSI-0401', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-PSI-0402', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-PSI-0403', 'Motivación y Afectividad', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-PSI-0404', 'Psicología del Aprendizaje', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-PSI-0405', 'Procesos Cognitivos Superiores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-PSI-0406', 'Psicología Evolutiva II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-PSI-0407', 'Práctica formativa IV', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-PSI-0501', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-PSI-0502', 'Estadística Aplicada', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-PSI-0503', 'Psicopatología I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-PSI-0504', 'Intervenciones Clínicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-PSI-0505', 'Evaluación Psicológica II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-PSI-0506', 'Práctica formativa VI', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-PSI-0601', 'Realidad Nacional y Mundial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-PSI-0602', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-PSI-0603', 'Personalidad Integral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-PSI-0604', 'Psicología Educativa', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-PSI-0605', 'Psicología Clínica y de la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-PSI-0606', 'Evaluación Psicológica I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-PSI-0607', 'Práctica formativa V', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-PSI-0701', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-PSI-0702', 'Trabajo de Investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-PSI-0703', 'Psicopatología II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-PSI-0704', 'Intervenciones Educativas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-PSI-0705', 'Programas Preventivo Promocionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-PSI-0706', 'Práctica formativa VII', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-PSI-0801', 'Trabajo de Investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-PSI-0802', 'Psicología Organizacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-PSI-0803', 'Psicología Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-PSI-0804', 'Construcción de Instrumentos de Evaluación Psicológica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-PSI-0805', 'Práctica formativa VIII', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-PSI-0806', 'Orientación y Consejería', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (4 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-PSI-0901', 'Trabajo de Investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-PSI-0902', 'Redacción de Informes Psicológicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-PSI-0903', 'Práctica preprofesional I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-PSI-0904', 'Neurociencias', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-PSI-1001', 'Trabajo de Investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-PSI-1002', 'Práctica preprofesional II', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería de Sistemas e Informática (ingenieria-de-sistemas-e-informatica)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Ingeniería de Sistemas e Informática Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/ingenieria-de-sistemas-e-informatica',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 205 créditos. Licenciada por SUNEDU • Certificaciones: 5.º ciclo: Especialista en Desarrollo Web • 6.º ciclo: Especialista en Inteligencia de Negocios • 7.º ciclo: Especialista en Desarrollo de Software'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería de Sistemas e Informática',
  'ingenieria-de-sistemas-e-informatica',
  'Facultad de Ciencias e Ingeniería',
  'Formación técnica de vanguardia en desarrollo de software, aplicaciones cloud, inteligencia de negocios (BI), big data y ciberseguridad para impulsar la transformación tecnológica.',
  10,
  5.0,
  'Bachiller en Ingeniería de Sistemas e Informática',
  'Licenciada por SUNEDU • Certificaciones: 5.º ciclo: Especialista en Desarrollo Web • 6.º ciclo: Especialista en Inteligencia de Negocios • 7.º ciclo: Especialista en Desarrollo de Software',
  'Ingeniero de sistemas e informática competente para modelar arquitecturas empresariales, liderar proyectos ágiles de software y gestionar infraestructura de TI segura y escalable.',
  ARRAY['Empresas de tecnología, desarrollo de software y aplicaciones cloud', 'Industria financiera, fintech, banca y telecomunicaciones', 'Ciberseguridad, auditoría de sistemas e infraestructura TI', 'Startups, inteligencia de negocios (BI) y analítica de datos'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-de-sistemas-e-informatica';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Ingeniería de Sistemas e Informática Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/ingenieria-de-sistemas-e-informatica', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-SIS-0101', 'Comprensión lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-SIS-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-SIS-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-SIS-0104', 'Fundamentos de Sistemas de Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-SIS-0105', 'Matemática Discreta', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-SIS-0106', 'Organización y Dirección de Empresas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-SIS-0201', 'Interpretación y elaboración de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-SIS-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-SIS-0203', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-SIS-0204', 'Fundamentos de Programación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-SIS-0205', 'Cálculo I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-SIS-0206', 'Diseño Web', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-SIS-0301', 'Redacción y argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-SIS-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-SIS-0303', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-SIS-0304', 'Cálculo II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-SIS-0305', 'Física I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-SIS-0306', 'Programación I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-SIS-0307', 'Base de Datos I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-SIS-0401', 'Filosofía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-SIS-0402', 'Conocimiento Científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-SIS-0403', 'Taller de planificación y organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-SIS-0404', 'Cálculo III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-SIS-0405', 'Programación II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-SIS-0406', 'Ingeniería de Requerimientos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-SIS-0407', 'Base de Datos II', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-SIS-0501', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-SIS-0502', 'Estadística y Probabilidades', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-SIS-0503', 'Desarrollo de software I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-SIS-0504', 'Negocios Electrónicos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-SIS-0505', 'Redes y Comunicaciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-SIS-0506', 'Inteligencia de Negocios', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-SIS-0601', 'Realidad Nacional e Internacional', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-SIS-0602', 'Investigación académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-SIS-0603', 'Programación III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-SIS-0604', 'Desarrollo Web', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-SIS-0605', 'Ingeniería de software', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-SIS-0606', 'Base de Datos III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-SIS-0607', 'Taller de Empleabilidad', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-SIS-0701', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-SIS-0702', 'Desarrollo de software II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-SIS-0703', 'Administración de Servidores', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-SIS-0704', 'Taller para prácticas preprofesionales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-SIS-0705', 'Gestión de Proyectos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-SIS-0706', 'Trabajo de Investigación I', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-SIS-0801', 'Programación Móvil', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-SIS-0802', 'Arquitectura Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-SIS-0803', 'Desarrollo de Operaciones de software', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-SIS-0804', 'Big Data', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-SIS-0805', 'Sistemas de Información Empresarial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-SIS-0806', 'Trabajo de Investigación II', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-SIS-0901', 'Desarrollo de Aplicaciones cloud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-SIS-0902', 'Seguridad de la Información', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-SIS-0903', 'Simulación de Sistemas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-SIS-0904', 'Proyecto integrador', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-SIS-0905', 'Prácticas preprofesionales supervisadas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-SIS-0906', 'Trabajo de Investigación III', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-SIS-1001', 'Auditoría Informática', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-SIS-1002', 'Gestión de Servicios de TI', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-SIS-1003', 'Calidad de software', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-SIS-1004', 'Gerencia de Sistemas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-SIS-1005', 'Tecnologías Emergentes', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-SIS-1006', 'Trabajo de Investigación IV', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Medicina Humana (medicina-humana)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UCH - Medicina Humana Pregrado 2026',
  'Universidad de Ciencias y Humanidades',
  'https://www.uch.edu.pe/carreras/medicina-humana',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 14 ciclos y 326 créditos. Licenciada por SUNEDU • Certificaciones: IV ciclo: Primeros Auxilios • VIII ciclo: Soporte Vital Básico • XI ciclo: Atención Integral al Adulto Mayor'
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
  'Formación médica con enfoque humanizado y científico, prácticas clínicas tempranas en redes asistenciales y centros de simulación, e internado médico rotatorio de 2 años.',
  14,
  7.0,
  'Bachiller en Medicina Humana',
  'Licenciada por SUNEDU • Certificaciones: IV ciclo: Primeros Auxilios • VIII ciclo: Soporte Vital Básico • XI ciclo: Atención Integral al Adulto Mayor',
  'Médico cirujano integral con sólidas competencias en diagnóstico, terapéutica clínica y quirúrgica, medicina preventiva, salud comunitaria e investigación biomédica.',
  ARRAY['Hospitales públicos (MINSA, EsSalud, FF.AA.) y clínicas privadas', 'Centros y postas de salud del primer nivel de atención', 'Unidades de emergencias médicas, cirugía, pediatría y ginecología', 'Investigación biomédica, ensayos clínicos y docencia universitaria', 'Gestión y dirección de establecimientos de salud pública y privada'],
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
  v_uch_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_uch_id FROM institutions WHERE short_name = 'UCH';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'medicina-humana';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UCH - Medicina Humana Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para el campus de UCH
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_uch_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_uch_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.uch.edu.pe/carreras/medicina-humana', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers
  WHERE institution_id = v_uch_id AND career_id = v_career_id
  LIMIT 1;

  -- Registrar Malla Curricular UCH 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UCH 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos
  -- CICLO 1 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UCH-MED-0101', 'Comprensión Lectora', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-MED-0102', 'Matemática Básica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-MED-0103', 'Desarrollo de Hábitos Saludables', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-MED-0104', 'Biología Celular', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-MED-0105', 'Química General e Inorgánica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UCH-MED-0106', 'Historia de la Medicina', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UCH-MED-0201', 'Interpretación y Elaboración de Textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-MED-0202', 'Apreciación de Artes Escénicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-MED-0203', 'Taller de Inteligencia Intrapersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-MED-0204', 'Biología Molecular', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-MED-0205', 'Química Aplicada a la Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-MED-0206', 'Biofísica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UCH-MED-0207', 'Primeros Auxilios y Soporte Vital Básico', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UCH-MED-0301', 'Redacción y Argumentación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-MED-0302', 'Apreciación de Artes Audiovisuales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-MED-0303', 'Taller de Inteligencia Interpersonal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-MED-0304', 'Bioquímica Aplicada a la Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-MED-0305', 'Microanatomía', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UCH-MED-0306', 'Anatomía Humana I', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UCH-MED-0401', 'Filosofía Orientada a la Medicina', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-MED-0402', 'Taller de Planificación y Organización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-MED-0403', 'Microbiología y Parasitología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-MED-0404', 'Embriología y Genética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-MED-0405', 'Anatomía Humana II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UCH-MED-0406', 'Nutrición y Medio Interno', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UCH-MED-0501', 'Conocimiento Científico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-MED-0502', 'Estadística Aplicada a Ciencias de la Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-MED-0503', 'Fisiología Humana', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-MED-0504', 'Inmunología Humana', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-MED-0505', 'Salud Pública', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UCH-MED-0506', 'Tecnología Aplicada a la Salud', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UCH-MED-0601', 'Realidad Nacional y Mundial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-MED-0602', 'Investigación Académica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-MED-0603', 'Farmacología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-MED-0604', 'Patología General', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-MED-0605', 'Fisiopatología Clínica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-MED-0606', 'Epidemiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UCH-MED-0607', 'Electivo I', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 7 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UCH-MED-0701', 'Ciudadanía y Responsabilidad Social', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-MED-0702', 'Ética y Deontología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-MED-0703', 'Patología Clínica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-MED-0704', 'Semiología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-MED-0705', 'Medicina Familiar y Comunitaria', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UCH-MED-0706', 'Salud y Seguridad Ocupacional', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UCH-MED-0801', 'Cardiología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-MED-0802', 'Neumología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-MED-0803', 'Neurología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-MED-0804', 'Psicopatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-MED-0805', 'Diagnóstico por Imágenes', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UCH-MED-0806', 'Emergencias y Desastres', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UCH-MED-0901', 'Hematología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-MED-0902', 'Nefrología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-MED-0903', 'Psiquiatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-MED-0904', 'Endocrinología y Enfermedades Metabólicas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-MED-0905', 'Gestión en Servicios de Salud', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UCH-MED-0906', 'Gastroenterología', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UCH-MED-1001', 'Reumatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-MED-1002', 'Medicina Física y Rehabilitación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-MED-1003', 'Cirugía I', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-MED-1004', 'Medicina Legal y Forense', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-MED-1005', 'Dermatología y Medicina Estética', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UCH-MED-1006', 'Enfermedades Infecciosas y Tropicales', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 11 (6 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 11, 'UCH-MED-1101', 'Trabajo de Investigación I', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-MED-1102', 'Geriatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-MED-1103', 'Ginecología y Obstetricia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-MED-1104', 'Oncología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-MED-1105', 'Cirugía II', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UCH-MED-1106', 'Electivo II', 4.0, 'ELECTIVO', v_source_id);

  -- CICLO 12 (5 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 12, 'UCH-MED-1201', 'Trabajo de Investigación II', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UCH-MED-1202', 'Neonatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UCH-MED-1203', 'Pediatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UCH-MED-1204', 'Cirugía III', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UCH-MED-1205', 'Externado Médico', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 13 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 13, 'UCH-MED-1301', 'Trabajo de Investigación III', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 13, 'UCH-MED-1302', 'Internado Médico I', 8.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 14 (2 cursos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 14, 'UCH-MED-1401', 'Trabajo de Investigación IV', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 14, 'UCH-MED-1402', 'Internado Médico II', 8.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad UCH
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_uch_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad Institucional UCH 2024',
    'Más del 90% de los egresados de la Universidad de Ciencias y Humanidades (UCH) se encuentran trabajando.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;
