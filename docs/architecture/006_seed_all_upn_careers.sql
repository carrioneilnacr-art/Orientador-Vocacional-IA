-- ==============================================================================
-- MIGRACIÓN / SEED: Universidad Privada del Norte (UPN)
-- Carreras UPN Pregrado 2026: 12 Carreras Oficiales
-- Fuentes: Brochures Oficiales UPN 2026 (archivos u/)
-- ==============================================================================

-- 1. Sincronizar secuencias de tablas
SELECT setval(pg_get_serial_sequence('institutions', 'id'), COALESCE(MAX(id), 1)) FROM institutions;
SELECT setval(pg_get_serial_sequence('sources', 'id'), COALESCE(MAX(id), 1)) FROM sources;
SELECT setval(pg_get_serial_sequence('campuses', 'id'), COALESCE(MAX(id), 1)) FROM campuses;
SELECT setval(pg_get_serial_sequence('careers', 'id'), COALESCE(MAX(id), 1)) FROM careers;
SELECT setval(pg_get_serial_sequence('academic_offers', 'id'), COALESCE(MAX(id), 1)) FROM academic_offers;
SELECT setval(pg_get_serial_sequence('curricula', 'id'), COALESCE(MAX(id), 1)) FROM curricula;
SELECT setval(pg_get_serial_sequence('curriculum_courses', 'id'), COALESCE(MAX(id), 1)) FROM curriculum_courses;

-- ------------------------------------------------------------------------------
-- CARRERA: Administración y Marketing (administracion-y-marketing)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Administración y Marketing Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/administracion-y-marketing',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación Internacional • Certificaciones Progresivas en Marketing Digital y Analítica Comercial'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Administración y Marketing',
  'administracion-y-marketing',
  'Facultad de Negocios',
  'Aprenderás a diseñar estrategias comerciales innovadoras, gestión de marcas, marketing digital, análisis del consumidor y toma de decisiones basadas en datos para maximizar la rentabilidad y el posicionamiento de mercado.',
  10,
  5.00,
  'Bachiller en Administración y Marketing',
  'Acreditación Internacional • Certificaciones Progresivas en Marketing Digital y Analítica Comercial',
  'Profesional líder en diseñar estrategias de marketing omnicanal, branding digital, experiencia del cliente (CX) y analítica de negocios orientada al crecimiento comercial de las organizaciones.',
  ARRAY['Liderazgo de proyectos comerciales que optimicen la rentabilidad y el posicionamiento de marca', 'Empresas consultoras en gestión de marcas, sectores industriales, comerciales y de servicios', 'Agencias de publicidad, medios digitales y startups de base tecnológica', 'Dirección de marketing, trade marketing, producto y experiencia del cliente (CX)'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'administracion-y-marketing';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Administración y Marketing Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/administracion-y-marketing', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-ADM-101', 'Interpretación de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ADM-102', 'Desarrollo del talento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ADM-103', 'Fundamentos de la sostenibilidad ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ADM-104', 'Taller de interpretación de textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ADM-105', 'Generación de ideas de negocios y formalización empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ADM-106', 'Historia de la administración contemporánea y buenas prácticas de gestión', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ADM-107', 'Principios de marketing moderno', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-ADM-201', 'Pensamiento numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-202', 'Empleabilidad y tendencias del mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-203', 'Liderazgo en gestión socioambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-204', 'Taller de pensamiento númerico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-205', 'Habilidades digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-206', 'Contabilidad y análisis financiero', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-207', 'Diseño global de productos y servicios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ADM-208', 'Comunicación efectiva', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-ADM-301', 'Economía general para los negocios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ADM-302', 'Ciudadanía y cambio climático', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ADM-303', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ADM-304', 'El valor del dinero y las operaciones financieras', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ADM-305', 'Derecho del consumidor y legislación comercial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ADM-306', 'Branding', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-ADM-401', 'Probabilidad y estadística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ADM-402', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ADM-403', 'Innovación y emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ADM-404', 'Inteligencia de mercados e IA', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ADM-405', 'Gestión de canales de ventas tradicionales y digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ADM-406', 'Publicidad comercial y diseño gráfico', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-ADM-501', 'Metodología de la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ADM-502', 'Ciencia de datos y vizualización', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ADM-503', 'Inteligencia artificial aplicada para la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ADM-504', 'Experiencia y análisis del consumidor', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ADM-505', 'Mercadotecnia internacional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ADM-506', 'Liderazgo empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ADM-507', 'Investigación cualitativa y cuantitativa de mercados', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-ADM-601', 'Formulación de proyectos interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ADM-602', 'Desarrollo y gestión del desempeño del personal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ADM-603', 'Ética y ciudadanía global', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ADM-604', 'Desarrollo de nuevos productos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ADM-605', 'Plan estratégico de marketing', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ADM-606', 'Community management y engagement digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ADM-607', 'Medios digitales y tecnología 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-ADM-701', 'Arte y cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ADM-702', 'Dilemas éticos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ADM-703', 'Lanzamiento de nuevos productos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ADM-704', 'Gestión financiera comercial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ADM-705', 'Data-Driven marketing', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ADM-706', 'Electivo especialidad 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ADM-707', 'Oportunidades de negocio en entornos internacionales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-ADM-801', 'Electivo 1', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-802', 'Marketing conversacional', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-803', 'Marketing digital y redes sociales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-804', 'Pricing', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-805', 'Medios digitales y tecnología 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-806', 'Electivo especialidad 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-807', 'Negocios globales y sostenibles', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ADM-808', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (5 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-ADM-901', 'Marketing predictivo', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ADM-902', 'Integración de competencias generales y habilidades blandas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ADM-903', 'Proyectos de investigación aplicada en negocios', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ADM-904', 'Electivo especialidad 3', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ADM-905', 'Innovación y transformación digital en las organizaciones', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-ADM-1001', 'Electivo 3', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ADM-1002', 'Integración de competencias específicas para la profesión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ADM-1003', 'Trabajo de investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ADM-1004', 'Electivo especialidad 4', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ADM-1005', 'Psicología positiva para líderes', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Arquitectura y Diseño de Interiores (arquitectura-y-diseno-de-interiores)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Arquitectura y Diseño de Interiores Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/arquitectura-y-diseno-de-interiores',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Metodología BIM • Certificaciones Progresivas en Modelado Arquitectónico y Diseño Espacial'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Arquitectura y Diseño de Interiores',
  'arquitectura-y-diseno-de-interiores',
  'Facultad de Arquitectura y Urbanismo',
  'Formación integral en diseño arquitectónico, planificación urbana, diseño espacial interior y sostenibilidad ambiental, integrando herramientas digitales avanzadas y tecnologías constructivas modernas.',
  10,
  5.00,
  'Bachiller en Arquitectura',
  'Metodología BIM • Certificaciones Progresivas en Modelado Arquitectónico y Diseño Espacial',
  'Arquitecto especializado en la concepción y materialización de espacios habitables sostenibles, fusionando estética arquitectónica, funcionalidad espacial interior y modelamiento digital BIM.',
  ARRAY['Estudios de arquitectura, diseño interior y consultorías espaciales', 'Empresas constructoras, inmobiliarias y promotoras de desarrollo urbano', 'Organismos públicos y municipales en planificación urbana y catastro', 'Firmas de consultoría, proyectos ambientales y diseño de espacios comerciales'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'arquitectura-y-diseno-de-interiores';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Arquitectura y Diseño de Interiores Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/arquitectura-y-diseno-de-interiores', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-ARQ-101', 'Taller de Diseño 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ARQ-102', 'Introducción a los Procesos Constructivos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ARQ-103', 'Interpretación de Textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ARQ-104', 'Desarrollo del Talento 18', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ARQ-105', 'Fundamentos de la Sostenibilidad Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ARQ-106', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-ARQ-201', 'Taller de Diseño 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ARQ-202', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ARQ-203', 'Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ARQ-204', 'Empleabilidad y Tendencias del Mercado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ARQ-205', 'Función Simbólica y Desarrollo de la Arquitectura y el Diseño', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ARQ-206', 'Liderazgo en Gestión Socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ARQ-207', 'Taller de Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-ARQ-301', 'Taller de Diseño 3', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ARQ-302', 'Representación del Diseño', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ARQ-303', 'Lógicas Constructivas 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ARQ-304', 'Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ARQ-305', 'Ciudadanía y Cambio Climático', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ARQ-306', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-ARQ-401', 'Taller de Diseño 4', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ARQ-402', 'Lógicas Constructivas 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ARQ-403', 'Innovación y Emprendimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ARQ-404', 'Probabilidad y Estadística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ARQ-405', 'Essentials 2', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-ARQ-501', 'Taller de Diseño 5', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ARQ-502', 'Modelado de la Información de la Construcción 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ARQ-503', 'Metodología de la Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ARQ-504', 'Expansión, Colonización y Urbanización', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ARQ-505', 'Inteligencia Artificial Aplicada para la Investigación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-ARQ-601', 'Taller de Diseño 6', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ARQ-602', 'Lógicas Constructivas 3', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ARQ-603', 'Formulación de Proyectos Interdisciplinarios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ARQ-604', 'Ciudad Contemporánea', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ARQ-605', 'Procesos de Diseño para Interiorismo 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ARQ-606', 'Ética y Ciudadanía Global', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-ARQ-701', 'Taller de Diseño 7', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ARQ-702', 'Modelado de la Información de la Construcción 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ARQ-703', 'Procesos de Diseño para Interiorismo 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ARQ-704', 'Arte y Cultura', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ARQ-705', 'Dilemas Éticos', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (4 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-ARQ-801', 'Taller de Diseño 8', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ARQ-802', 'Modelado de la Información de la Construcción 3', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ARQ-803', 'Proyecto de Tesis de Arquitectura y Diseño', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ARQ-804', 'Diseño de Iluminación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-ARQ-901', 'Taller de Diseño 9: PFC', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ARQ-902', 'Diseño de Mobiliario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ARQ-903', 'Regulación de la Construcción', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ARQ-904', 'Electivo 1', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ARQ-905', 'Integración de Competencias Generales y Habilidades Blandas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-ARQ-1001', 'Trabajo de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ARQ-1002', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ARQ-1003', 'Electivo Libre 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ARQ-1004', 'Electivo Libre 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ARQ-1005', 'Electivo 3', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ARQ-1006', 'Síntesis del Proyecto de Arquitectura y Diseño', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Comunicación y Marketing Digital (comunicacion-y-marketing-digital)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Comunicación y Marketing Digital Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/comunicacion-y-marketing-digital',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Especialización en Estrategias Digitales, Redes Sociales, IA y Contenido Transmedia'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Comunicación y Marketing Digital',
  'comunicacion-y-marketing-digital',
  'Facultad de Comunicaciones',
  'Desarrollarás competencias en gestión de marcas digitales, narrativas transmedia, analítica web, producción de contenidos multimedia y dirección de campañas de comunicación estratégica omnicanal.',
  10,
  5.00,
  'Bachiller en Comunicación y Marketing Digital',
  'Especialización en Estrategias Digitales, Redes Sociales, IA y Contenido Transmedia',
  'Estratega de comunicación digital capacitado para dirigir ecosistemas digitales de marca, campañas transmedia basadas en datos y narrativas persuasivas con inteligencia artificial.',
  ARRAY['Agencias de publicidad, marketing digital y relaciones públicas', 'Startups y emprendimientos de economía digital', 'Áreas de marketing y comunicación corporativa en el sector público y privado', 'Dirección de medios digitales, community management y consultoría propia'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'comunicacion-y-marketing-digital';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Comunicación y Marketing Digital Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/comunicacion-y-marketing-digital', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-CMD-101', 'Interpretación de Textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CMD-102', 'Desarrollo del Talento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CMD-103', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CMD-104', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CMD-105', 'Comunicación y Plataformas Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CMD-106', 'Inteligencia Artificial y Creatividad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CMD-107', 'Principios de Creación de Textos y Estructura Narrativa', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-CMD-201', 'Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CMD-202', 'Empleabilidad y Tendencias del Mercado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CMD-203', 'Liderazgo en Gestión Socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CMD-204', 'Taller de Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CMD-205', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CMD-206', 'Historia y Teoría de la Comunicación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CMD-207', 'Análisis de Audiencias y Comportamiento del Consumidor', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-CMD-301', 'Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CMD-302', 'Fundamentos de Storytelling', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CMD-303', 'Ciudadanía y Cambio Climático', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CMD-304', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CMD-305', 'Creación de Contenidos Digitales y Lenguaje Audiovisual', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CMD-306', 'Semiótica y Narrativas Inmersivas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CMD-307', 'Estrategias de Comunicación y Marketing Digital', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-CMD-401', 'Probabilidad y Estadística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CMD-402', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CMD-403', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CMD-404', 'Fundamentos del Diseño Gráfico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CMD-405', 'Medios y Analítica Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CMD-406', 'Herramientas Digitales para la Creación de Contenidos', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-CMD-501', 'Metodología de la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CMD-502', 'Diseño Web y Aplicaciones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CMD-503', 'Inteligencia Artificial Aplicada para la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CMD-504', 'Fundamentos de UI UX', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CMD-505', 'Gestión de Comunidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CMD-506', 'Fotografía y Composición Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CMD-507', 'Edición Audiovisual para Contenidos Digitales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-CMD-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CMD-602', 'Proyecto de Experiencia Usuario', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CMD-603', 'Ética y Ciudadanía Global', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CMD-604', 'Marketing e Innovación Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CMD-605', 'Gestión de Crisis en Medios Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CMD-606', 'Publicidad y Medios Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CMD-607', 'Proyecto de Creación y Gestión de Contenidos Digitales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-CMD-701', 'Arte y Cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CMD-702', 'Dilemas Éticos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CMD-703', 'Inteligencia Artificial Aplicada al Marketing Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CMD-704', 'Branded Content', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CMD-705', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CMD-706', 'Plan de Comunicación y Marketing Digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CMD-707', 'Creación y Producción de Podcast', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-CMD-801', 'Inbound y Growth Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CMD-802', 'Investigación en Comunicación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CMD-803', 'Electivo 2', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CMD-804', 'Realización de un Canal Digital', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CMD-805', 'Proyecto de Estrategia y Analítica en Medios Digitales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-CMD-901', 'Incubadora de Proyectos Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CMD-902', 'Inteligencia de Negocio y Toma de Decisiones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CMD-903', 'Fundamentos de Ecommerce y Negocios Digitales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CMD-904', 'Electivo 3', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CMD-905', 'Integración de Competencias Generales y Habilidades Blandas', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-CMD-1001', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CMD-1002', 'Marca Personal y Gestión de Influencers', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CMD-1003', 'Dirección Estratégica de Comunicación y Marketing', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CMD-1004', 'Electivo 4', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CMD-1005', 'Proyecto Integrador de Comunicación y Marketing Digital', 5.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Contabilidad y Finanzas (contabilidad-y-finanzas)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Contabilidad y Finanzas Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/contabilidad-y-finanzas',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación Internacional SINEACE/ICACIT • Alineado a Normas Internacionales NIIF'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Contabilidad y Finanzas',
  'contabilidad-y-finanzas',
  'Facultad de Negocios',
  'Especialización en auditoría financiera, tributación estratégica, finanzas corporativas, gestión de costos y analítica contable para la toma de decisiones gerenciales en entornos globales.',
  10,
  5.00,
  'Bachiller en Contabilidad y Finanzas',
  'Acreditación Internacional SINEACE/ICACIT • Alineado a Normas Internacionales NIIF',
  'Líder en gestión financiera y contable corporativa, experto en auditoría, planeamiento tributario estratégico, valorización de empresas e instrumentos del mercado financiero.',
  ARRAY['Sector financiero y bancario, consultoras, aseguradoras, inmobiliarias y retail', 'Startups, empresas tecnológicas y corporaciones multinacionales', 'Firmas de auditoría internacional (Big Four) y asesoría tributaria', 'Organismos reguladores del sector público (SUNAT, MEF, Contraloría)'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'contabilidad-y-finanzas';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Contabilidad y Finanzas Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/contabilidad-y-finanzas', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-CON-101', 'Interpretación de Textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CON-102', 'Desarrollo del Talento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CON-103', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CON-104', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CON-105', 'Generación de Ideas de Negocios y Formalización Empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CON-106', 'Fundamentos de Contabilidad y Gestión Financiera', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CON-107', 'Tecnología Contable y Financiero', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-CON-201', 'Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CON-202', 'Empleabilidad y Tendencias del Mercado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CON-203', 'Liderazgo en Gestión Socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CON-204', 'Taller de Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CON-205', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CON-206', 'Contabilidad y Análisis Financiero', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CON-207', 'Contabilidad Integral', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-CON-301', 'Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CON-302', 'Economía General para los Negocios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CON-303', 'Ciudadanía y Cambio Climático', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CON-304', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CON-305', 'El Valor del Dinero y las Operaciones Financieras', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CON-306', 'Operaciones y Optimización Contable', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CON-307', 'Estándares e Información Financiera', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (6 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-CON-401', 'Probabilidad y Estadística', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CON-402', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CON-403', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CON-404', 'Inteligencia de Mercados e IA', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CON-405', 'Cumplimiento Fiscal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CON-406', 'Contabilidad Digital', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-CON-501', 'Metodología de la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CON-502', 'Ciencia de Datos y Visualización', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CON-503', 'Inteligencia Artificial Aplicada para la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CON-504', 'Gestión Contable y Datos Financieros', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CON-505', 'Estrategia de Costeo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CON-506', 'Planificación Financiera Estratégica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CON-507', 'Tributación Corporativa', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-CON-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-602', 'Desarrollo y Gestión del Desempeño del Personal', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-603', 'Ética y Ciudadanía Global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-604', 'Análisis y Gestión de Inversiones', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-605', 'Costos para la Gestión Contable', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-606', 'Información Financiera Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-607', 'Gestión de Obligaciones Tributarias', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CON-608', 'Arte y Cultura', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-CON-701', 'Dilemas Éticos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CON-702', 'Optimización de Costos y Equilibrio Financiero', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CON-703', 'Gestión del Control Interno', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CON-704', 'Evaluación y Estrategia Financiera', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CON-705', 'Electivo Especialidad 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CON-706', 'Oportunidades de Negocio en Entornos Internacionales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-CON-801', 'Electivo 1', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-802', 'Fundamentos de Finanzas Públicas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-803', 'Auditoría Financiera y Compliance', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-804', 'Datos Financieros para la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-805', 'Análisis Financiero y Auditor Interno', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-806', 'Electivo Especialidad 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-807', 'Negocios Globales y Sostenibles', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CON-808', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (5 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-CON-901', 'Dirección Financiera Aplicada', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CON-902', 'Integración de Competencias Generales y Habilidades Blandas', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CON-903', 'Proyecto de Investigación Aplicada en Negocios', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CON-904', 'Electivo Especialidad 3', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CON-905', 'Innovación y Transformación Digital en las Organizaciones', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-CON-1001', 'Electivo 3', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CON-1002', 'Integración de Competencias Específicas para la Profesión', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CON-1003', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CON-1004', 'Electivo Especialidad 4', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CON-1005', 'Psicología Positiva para Líderes', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Derecho (derecho)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Derecho Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/derecho',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación de Calidad Académica • Convenios con Cortes de Justicia y Clínicas Jurídicas'
)
ON CONFLICT DO NOTHING;

INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Derecho',
  'derecho',
  'Facultad de Derecho y Ciencias Políticas',
  'Dominio del ordenamiento jurídico nacional e internacional, litigación oral, derecho corporativo, arbitraje y resolución de conflictos con sólidas bases éticas y habilidades de argumentación jurídica.',
  10,
  5.00,
  'Bachiller en Derecho',
  'Acreditación de Calidad Académica • Convenios con Cortes de Justicia y Clínicas Jurídicas',
  'Jurista ético y versátil con alta destreza en litigación oral, consultoría corporativa, compliance legal y resolución alternativa de disputas en el sector público y privado.',
  ARRAY['Asesoría legal y consultoría en empresas públicas y privadas', 'Gestión y resolución de conflictos en entornos judiciales y arbitrales', 'Diseño y aplicación de estrategias legales en Derecho Empresarial y Gestión Pública', 'Organismos estatales, magistratura, fiscalía e instituciones reguladoras'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'derecho';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Derecho Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/derecho', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-DER-101', 'Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-102', 'Desarrollo del Talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-103', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-104', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-105', 'Teoría del Derecho', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-106', 'Derecho de las Personas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-107', 'Fundamentos del Estado y Constitucionales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-DER-108', 'Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-DER-201', 'Empleabilidad y Tendencias del Mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-DER-202', 'Liderazgo en Gestión Socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-DER-203', 'Taller de Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-DER-204', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-DER-205', 'Función Pública: Principios y Responsabilidades', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-DER-206', 'Constitución Peruana y Derechos Humanos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-DER-207', 'Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-DER-301', 'Antecedentes Históricos y Filosóficos del Derecho', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-DER-302', 'Ciudadanía y Cambio Climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-DER-303', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-DER-304', 'Acto Jurídico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-DER-305', 'Aplicación de la Ley Penal, Teoría del Delito y Pena', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-DER-306', 'Principios de la Empresa y Modelos Societarios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-DER-307', 'Probabilidad y Estadística', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 21 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-DER-401', 'Principios del Proceso', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-DER-402', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-DER-403', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-DER-404', 'Régimen Jurídico de los Bienes', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-DER-405', 'Delitos y Sanciones Perspectiva del Derecho Penal Peruano', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-DER-406', 'Justicia Constitucional Procesos y Jurisprudencia', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-DER-407', 'Metodología de la Investigación', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-DER-501', 'Inteligencia Artificial Aplicada para la Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-DER-502', 'Procedimiento Administrativo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-DER-503', 'Estrategias de Reconfiguración Corporativa y Títulos Valores', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-DER-504', 'Medios Alternativos para Solución de Conflictos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-DER-505', 'Gestión de Obligaciones Teoría y Práctica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-DER-506', 'Proceso Civil: Conocimiento', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-DER-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-602', 'Competencia: Explorando las Regulaciones del Mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-603', 'Ética y Ciudadanía Global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-604', 'Relaciones Contractuales y Gestión Jurídica de los Contratos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-605', 'Litigación Penal: Principios Procesales e Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-606', 'Regulación Jurídica de las Relaciones Familiares', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-607', 'Razonamiento Legal Estratégico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-DER-608', 'Arte y Cultura', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-DER-701', 'Dilemas Éticos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-DER-702', 'Formulación y Evaluación Jurídica de Contratos Civiles y Comerciales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-DER-703', 'Justicia Internacional y Derecho de los Tratados', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-DER-704', 'Contratación Laboral', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-DER-705', 'Procesos Civiles Especiales y No Contenciosos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-DER-706', 'Litigación Penal: Estrategias y Técnicas en el Proceso Penal', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-DER-707', 'Proceso Contencioso Administrativo', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-DER-801', 'Innovación y Protección Propiedad Intelectual', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-DER-802', 'Régimen Jurídico de las Sucesiones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-DER-803', 'Tributación: Fundamentos, Obligaciones y Procedimientos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-DER-804', 'Litigación Laboral y Procesos Especiales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-DER-805', 'Consultorio y Práctica Jurídica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-DER-806', 'Medidas Cautelares', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-DER-901', 'Análisis Integral del Impuesto a la Renta', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-DER-902', 'Régimen Jurídico del Medio Ambiente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-DER-903', 'Análisis Integral del Impuesto a las Ventas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-DER-904', 'Argumentación Jurídica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-DER-905', 'Electivo de Especialidad 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-DER-906', 'Electivo de Especialidad 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-DER-907', 'Integración de Competencias Generales y Habilidades Blandas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-DER-1001', 'Regulación Jurídica de las Relaciones Privadas Internacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-DER-1002', 'Derecho de la Responsabilidad Patrimonial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-DER-1003', 'Derecho Registral y Fe Pública', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-DER-1004', 'Trabajo de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-DER-1005', 'Electivo de Especialidad 3', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-DER-1006', 'Clínica Legal', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Enfermería (enfermeria)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Enfermería Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/enfermeria',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Hospitales Simulados de Alta Fidelidad • Prácticas Clínicas Tempranas en Redes Hospitalarias'
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
  'Formación humana y científica para la gestión del cuidado integral de la salud del individuo, familia y comunidad en todas las etapas de la vida, con liderazgo en salud pública e investigación clínica.',
  10,
  5.00,
  'Bachiller en Enfermería',
  'Hospitales Simulados de Alta Fidelidad • Prácticas Clínicas Tempranas en Redes Hospitalarias',
  'Profesional de la salud dedicado a la gestión clínica del cuidado humanizado, prevención de enfermedades, atención de emergencias complejas y liderazgo en salud pública.',
  ARRAY['Hospitales, clínicas y centros de salud públicos y privados', 'ONG y programas de salud y asistencia comunitaria', 'Servicios de salud ocupacional en empresas e industrias', 'Atención domiciliaria y consultorios de enfermería independientes'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'enfermeria';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Enfermería Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/enfermeria', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-ENF-101', 'Interpretación de textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-102', 'Desarrollo del talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-103', 'Fundamentos de la sostenibilidad ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-104', 'Taller de interpretación de textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-105', 'Biología molecular y celular aplicada a salud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-106', 'Química general', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-107', 'Introducción a la salud comunitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-ENF-108', 'Introducción a la enfermería', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-ENF-201', 'Pensamiento numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ENF-202', 'Empleabilidad y tendencias del mercado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ENF-203', 'Liderazgo en gestión socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ENF-204', 'Taller de pensamiento numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ENF-205', 'Habilidades digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ENF-206', 'Morfología y fisiología 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-ENF-207', 'Proceso de cuidado en Enfermería', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-ENF-301', 'Comunicación efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ENF-302', 'Salud digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ENF-303', 'Ciudadanía y cambio climático', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ENF-304', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ENF-305', 'Morfología y fisiología 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ENF-306', 'Semiología en enfermería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-ENF-307', 'Procedimientos básicos en enfermería', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-ENF-401', 'Probabilidad y estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ENF-402', 'Gestión y búsqueda de información científica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ENF-403', 'Innovación y emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ENF-404', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ENF-405', 'Bases farmacológicas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ENF-406', 'Mecanismos de agreción y defensa biológica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-ENF-407', 'Cuidado de enfermería al adulto 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-ENF-501', 'Metodología de la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ENF-502', 'Promoción y prevención en salud', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ENF-503', 'Inteligencia artificial aplicada para la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ENF-504', 'Nutrición y dietética para la prevención de enfermedades', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ENF-505', 'Farmacología y terapéutica en enfermería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ENF-506', 'Cuidado de enfermería al adulto 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-ENF-507', 'Interacción clínica patológica', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-ENF-601', 'Formulación de proyectos interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-602', 'Genética y genómica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-603', 'Ética y ciudadanía global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-604', 'Ética y ciudadanía global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-605', 'Enfermería y neonatología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-606', 'Salud pública y epidemiología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-607', 'Cuidado de enfermería a la salud sexual y reproductiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-ENF-608', 'Arte y cultura', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-ENF-701', 'Dilemas éticos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ENF-702', 'Cuidado de enfermería en salud mental y adicciones', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ENF-703', 'Gestión estratégica en enfermería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ENF-704', 'Cuidado de enfermería al niño y adolescente de alta complejidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ENF-705', 'Salud basada en la evidencia científica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-ENF-706', 'Cuidado de enfermería en emergencia y urgencias', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-ENF-801', 'Tecnologías emergentes en salud', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-802', 'Cuidados paliativos y manejo del dolor', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-803', 'Normas técnicas en salud para la atención primaria', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-804', 'Gestión de enfermería en la salud familiar y comunitaria', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-805', 'Proyecto de investigación en enfermería 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-806', 'Enfermería y salud ocupacional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-807', 'Gestión de crisis y respuesta a emergencias sanitarias', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-ENF-808', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 9 (3 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-ENF-901', 'Proyecto de investigación en enfermería 2', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ENF-902', 'Internado en enfermería 1', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-ENF-903', 'Integración de competencias generales y habilidades blandas', 6.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (4 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-ENF-1001', 'Trabajo de investigación', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ENF-1002', 'Internado en enfermería 2', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ENF-1003', 'Electivo 2', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-ENF-1004', 'Seminario taller integrador de enfermería', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Ambiental (ingenieria-ambiental)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Ingeniería Ambiental Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/ingenieria-ambiental',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Estándares Globales de Sostenibilidad y Cambio Climático'
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
  'Capacidad para diseñar e implementar soluciones tecnológicas a problemas ambientales: gestión integral del agua, remediación de suelos, evaluación de impacto ambiental, energías renovables y economía circular.',
  10,
  5.00,
  'Bachiller en Ingeniería Ambiental',
  'Acreditado por ICACIT • Estándares Globales de Sostenibilidad y Cambio Climático',
  'Ingeniero capacitado para mitigar impactos ecológicos, diseñar sistemas de tratamiento de efluentes y emisiones, y liderar la transición hacia la sostenibilidad ambiental y economía circular.',
  ARRAY['Consultoras especializadas en gestión ambiental, evaluación de impacto y desarrollo sostenible', 'Organizaciones no gubernamentales (ONG) enfocadas en conservación y recursos naturales', 'Empresas de minería, energía, hidrocarburos, industria y construcción', 'Ministerio del Ambiente (MINAM), OEFA, SERFOR y gobiernos locales'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-ambiental';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Ingeniería Ambiental Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/ingenieria-ambiental', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-AMB-101', 'Interpretación de Textos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-102', 'Desarrollo del Talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-103', 'Principios de Seguridad', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-104', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-105', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-106', 'Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-107', 'Introducción a la Ingeniería Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-AMB-108', 'Biología General', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-AMB-201', 'Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-202', 'Empleabilidad y Tendencias del Mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-203', 'Dibujo de Ingeniería', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-204', 'Liderazgo en Gestión Socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-205', 'Taller de Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-206', 'Química Inorgánica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-207', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-AMB-208', 'Cálculo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-AMB-301', 'Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-AMB-302', 'Ecología General', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-AMB-303', 'Ciudadanía y Cambio Climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-AMB-304', 'Essentials 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-AMB-305', 'Química Orgánica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-AMB-306', 'Cálculo Diferencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-AMB-307', 'Física 1', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 21 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-AMB-401', 'Probabilidad y Estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-AMB-402', 'Microbiología Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-AMB-403', 'Química Analítica y Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-AMB-404', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-AMB-405', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-AMB-406', 'Cálculo Integral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-AMB-407', 'Física 2', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-AMB-501', 'Metodología de la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-AMB-502', 'Inteligencia Artificial Aplicada para la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-AMB-503', 'Estadística Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-AMB-504', 'Matemáticas Avanzadas para Ingenieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-AMB-505', 'Estática y Dinámica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-AMB-506', 'Topografía General', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-AMB-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-AMB-602', 'Gestión de Riesgos Ambientales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-AMB-603', 'Ética y Ciudadanía Global', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-AMB-604', 'Bioquímica Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-AMB-605', 'IA para la Toma de Decisiones', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-AMB-606', 'Resistencia de Materiales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-AMB-607', 'Saneamiento Ambiental', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-AMB-701', 'Arte y Cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-AMB-702', 'Dilemas Éticos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-AMB-703', 'Análisis de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-AMB-704', 'Control de la Contaminación de Suelos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-AMB-705', 'Mecánica de Fluidos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-AMB-706', 'Mecánica de Suelos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-AMB-707', 'Legislación Ambiental', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-AMB-801', 'Electivo de Hub', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-AMB-802', 'Control de la Contaminación del Aire', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-AMB-803', 'Formulación y Evaluación de Proyectos Ambientales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-AMB-804', 'Hidrología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-AMB-805', 'Evaluación de Impacto Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-AMB-806', 'Cartografía y SIG', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-AMB-807', 'Seguridad y Salud Ocupacional', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 18 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-AMB-901', 'Emprendimiento Integrador', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-AMB-902', 'Investigación en Ingeniería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-AMB-903', 'Electivo de Carrera 1', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-AMB-904', 'Control de la Contaminación de Aguas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-AMB-905', 'Abastecimiento de Agua Potable y Alcantarillado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-AMB-906', 'Gestión de Residuos Sólidos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-AMB-907', 'Integración de Competencias Generales y Habilidades Blandas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-AMB-1001', 'Trabajo de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-AMB-1002', 'Proyecto Integrador Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-AMB-1003', 'Manejo Integral de Cuencas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-AMB-1004', 'Integración de Competencias Específicas de Ingeniería Ambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-AMB-1005', 'Electivo de Carrera 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-AMB-1006', 'Modelamiento Ambiental', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Civil (ingenieria-civil)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Ingeniería Civil Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/ingenieria-civil',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Laboratorios especializados de Estructuras, Geotecnia y Pavimentos'
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
  'Diseño, construcción, supervisión y gestión de obras civiles y de infraestructura: edificaciones sismorresistentes, puentes, carreteras, obras hidráulicas y proyectos de saneamiento bajo metodología BIM y Lean Construction.',
  10,
  5.00,
  'Bachiller en Ingeniería Civil',
  'Acreditado por ICACIT • Laboratorios especializados de Estructuras, Geotecnia y Pavimentos',
  'Experto en planificación, modelamiento estructural, supervisión geotécnica y gerencia de mega-obras de infraestructura civil con metodologías BIM y Lean Construction.',
  ARRAY['Empresas constructoras, inmobiliarias e industriales', 'Consultoras en diseño estructural, geotecnia, hidráulica y gestión de proyectos de infraestructura', 'Organismos públicos vinculados a transporte, vivienda, desarrollo urbano y saneamiento', 'Laboratorios de mecánica de suelos, ensayo de materiales y supervisión de obras'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-civil';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Ingeniería Civil Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/ingenieria-civil', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-CIV-101', 'Interpretación de Textos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-102', 'Desarrollo del Talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-103', 'Principios de Seguridad', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-104', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-105', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-106', 'Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-107', 'Introducción a la Ingeniería Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-CIV-108', 'Representación Gráfica', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-CIV-201', 'Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-202', 'Empleabilidad y Tendencias del Mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-203', 'Geología General', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-204', 'Liderazgo en Gestión Socioambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-205', 'Taller de Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-206', 'Geometría Descriptiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-207', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-CIV-208', 'Cálculo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-CIV-301', 'Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CIV-302', 'Economía Constructiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CIV-303', 'Ciudadanía y Cambio Climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CIV-304', 'Essentials 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CIV-305', 'Tecnología de los Materiales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CIV-306', 'Cálculo Diferencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-CIV-307', 'Física 1', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 21 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-CIV-401', 'Probabilidad y Estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CIV-402', 'Modelado Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CIV-403', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CIV-404', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CIV-405', 'Cálculo Integral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CIV-406', 'Física 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-CIV-407', 'Tecnología del Concreto', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-CIV-501', 'Modelamiento Arquitectónico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CIV-502', 'Metodología de la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CIV-503', 'Inteligencia Artificial Aplicada para la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CIV-504', 'Estadística Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CIV-505', 'Matemáticas Avanzadas para Ingenieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CIV-506', 'Estática y Dinámica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-CIV-507', 'Topografía y Geomática', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 16 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-CIV-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CIV-602', 'Ética y Ciudadanía Global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CIV-603', 'Estructuras y Cargas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CIV-604', 'Ingeniería de Construcción', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CIV-605', 'Resistencia de Materiales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CIV-606', 'Curso Certificador de Competencias de Ingeniería Civil 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-CIV-607', 'Arte y Cultura', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-CIV-701', 'Dilemas Éticos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CIV-702', 'Modelamiento de Instalaciones - BIM', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CIV-703', 'Ingeniería de Transporte', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CIV-704', 'Mecánica de Fluidos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CIV-705', 'Análisis Estructural', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CIV-706', 'Mecánica de Suelos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-CIV-707', 'Ingeniería de Proyectos de Construcción', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-CIV-801', 'Programación de Obras', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CIV-802', 'Diseño de Pavimentos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CIV-803', 'Costos y Presupuestos de Obras', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CIV-804', 'Hidrología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CIV-805', 'Concreto Armado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-CIV-806', 'Curso Certificador de Competencias de Ingeniería Civil 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (6 cursos, 18 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-CIV-901', 'Investigación en Ingeniería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CIV-902', 'Electivo de Carrera 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CIV-903', 'Ingeniería Sismorresistente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CIV-904', 'Abastecimiento de Agua Potable y Alcantarillado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CIV-905', 'Gestión de Proyectos de Construcción', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-CIV-906', 'Integración de Competencias Generales y Habilidades Blandas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-CIV-1001', 'Gestión Integral BIM', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CIV-1002', 'Electivo de Carrera 2', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CIV-1003', 'Integración de Competencias Específicas de Ingeniería Civil', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CIV-1004', 'Trabajo de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CIV-1005', 'Diseño de Puentes', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-CIV-1006', 'Proyecto Integrador Civil', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería de Software (ingenieria-de-software)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Ingeniería de Software Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/ingenieria-de-software',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Alineado a estándares internacionales ACM/IEEE'
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
  'Diseño, construcción, testing y mantenimiento de software de alta calidad, aplicaciones en la nube, arquitecturas distribuidas, DevOps, seguridad de software y sistemas inteligentes con metodologías ágiles modernas.',
  10,
  5.00,
  'Bachiller en Ingeniería de Software',
  'Acreditado por ICACIT • Alineado a estándares internacionales ACM/IEEE',
  'Arquitecto y desarrollador de software de escala empresarial, especialista en cloud computing, microservicios, DevOps, ciberseguridad y soluciones inteligentes orientadas a la innovación tecnológica.',
  ARRAY['Empresas o consultoras enfocadas en desarrollo de software, aplicaciones móviles, plataformas web y tecnología digital', 'Organismos públicos y privados en proyectos de transformación digital', 'Centros de investigación y desarrollo en inteligencia artificial, big data y computación en la nube', 'Startups tecnológicas, fintechs y corporaciones globales de software'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-de-software';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Ingeniería de Software Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/ingenieria-de-software', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-SOF-101', 'Interpretación de textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-102', 'Desarrollo del talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-103', 'Principios de seguridad', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-104', 'Fundamentos de la sostenibilidad ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-105', 'Taller de interpretación de textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-106', 'Gestión empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-107', 'Introducción a la ingeniería de software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-SOF-108', 'Matemática discreta y geometría analítica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-SOF-201', 'Pensamiento numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-202', 'Empleabilidad y tendencias del mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-203', 'Especificación y análisis de requerimientos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-204', 'Liderazgo en gestión socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-205', 'Taller de pensamiento numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-206', 'Lenguajes de programación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-207', 'Habilidades digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-SOF-208', 'Fundamentos de programación', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-SOF-301', 'Comunicación efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-SOF-302', 'Programación web', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-SOF-303', 'Ciudadanía y cambio climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-SOF-304', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-SOF-305', 'Estructuras de datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-SOF-306', 'Cálculo', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-SOF-307', 'Base de datos', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 21 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-SOF-401', 'Probabilidad y estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-SOF-402', 'Análisis de datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-SOF-403', 'Essentials 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-SOF-404', 'Soluciones de inteligencia de negocios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-SOF-405', 'Innovación y emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-SOF-406', 'Cálculo diferencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-SOF-407', 'Ingeniería de software', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 18 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-SOF-501', 'Metodología de la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-SOF-502', 'Arquitectura del computador', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-SOF-503', 'Inteligencia artificial aplicada para la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-SOF-504', 'Metodologías ágiles', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-SOF-505', 'Análisis de algoritmos y estrategias de programación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-SOF-506', 'Física 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-SOF-507', 'Cálculo integral', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-SOF-601', 'Formulación de proyectos interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-SOF-602', 'Ética y ciudadanía global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-SOF-603', 'Física 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-SOF-604', 'Matemáticas avanzadas para ingenieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-SOF-605', 'Diseño y arquitectura de software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-SOF-606', 'Curso certificador 1 de ingeniería de software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-SOF-607', 'Ingeniería de rendimiento de software', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-SOF-701', 'Arte y cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-702', 'Dilemas éticos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-703', 'Fundamentos de infraestructuras de redes', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-704', 'Optimización y toma de decisiones en sistemas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-705', 'Desarrollo web full stack', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-706', 'Desarrollo basado en plataformas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-707', 'Estadística aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-SOF-708', 'Electivo de hub', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 8 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-SOF-801', 'DevOps', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-SOF-802', 'Electivo de carrera 1', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-SOF-803', 'Diseño y gestión avanzada de redes de datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-SOF-804', 'Sistemas inteligentes y machine learning', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-SOF-805', 'Construcción de software y experiencia UX', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-SOF-806', 'Curso certificador 2 de ingeniería de software', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-SOF-901', 'Investigación en ingeniería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-SOF-902', 'Emprendimiento integrador', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-SOF-903', 'Electivo de carrera 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-SOF-904', 'Calidad y pruebas integradas en el desarrollo de software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-SOF-905', 'Gestión de proyectos de software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-SOF-906', 'Infraestructura y seguridad en la nube', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-SOF-907', 'Integración de competencias generales y habilidades blandas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-SOF-1001', 'Sistemas basados en microservicios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-SOF-1002', 'Mantenimiento y evolución del software', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-SOF-1003', 'Ciberseguridad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-SOF-1004', 'Trabajo de investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-SOF-1005', 'Proyecto integrador de software', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-SOF-1006', 'Integración de competencias específicas de ingeniería de software', 3.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Medicina Humana (medicina-humana)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Medicina Humana Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/medicina-humana',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 14 ciclos y 281 créditos. Hospitales Simulados de Alta Fidelidad • Certificaciones en RCP Avanzada y Rehabilitación Cardio Respiratoria'
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
  'Formación médica rigurosa con sólida base científica, clínica, diagnóstica, quirúrgica y humanística para la prevención, diagnóstico, tratamiento y rehabilitación de enfermedades, con preparación integral para el internado y el examen médico nacional.',
  14,
  7.00,
  'Bachiller en Medicina Humana',
  'Hospitales Simulados de Alta Fidelidad • Certificaciones en RCP Avanzada y Rehabilitación Cardio Respiratoria',
  'Médico Cirujano con rigurosa preparación científica y sentido ético-humanístico para la atención integral de la salud, diagnóstico clínico preciso, intervención terapéutica y liderazgo en salud pública.',
  ARRAY['Hospitales, clínicas y centros de salud públicos y privados de alta complejidad', 'ONG y proyectos de salud comunitaria y preventiva', 'Empresas en salud ocupacional, auditoría médica y bienestar laboral', 'Consultorios médicos independientes y atención domiciliaria especializada', 'Centros de investigación médica y laboratorios biomédicos', 'Universidades e institutos en docencia e investigación clínica', 'Instituciones gubernamentales y formulación de políticas de salud pública'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'medicina-humana';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Medicina Humana Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/medicina-humana', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-MED-101', 'Interpretación de Textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-MED-102', 'Desarrollo del Talento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-MED-103', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-MED-104', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-MED-105', 'Biología Molecular y Celular Aplicada a Salud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-MED-106', 'Morfología y Fisiología 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-MED-107', 'Epidemiología y Demografía en Salud', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-MED-201', 'Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-MED-202', 'Empleabilidad y Tendencias del Mercado', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-MED-203', 'Liderazgo en Gestión Socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-MED-204', 'Taller de Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-MED-205', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-MED-206', 'Bioquímica Aplicada a la Salud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-MED-207', 'Morfología y Fisiología 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-MED-301', 'Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-302', 'Ciudadanía y Cambio Climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-303', 'Essentials 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-304', 'Salud Digital', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-305', 'Bases Farmacológicas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-306', 'Semiología General y Especializada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-307', 'Mecanismos de Agresión y Defensa Biológica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-MED-308', 'Sistema Tegumentario', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-MED-401', 'Probabilidad y Estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-MED-402', 'Essentials 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-MED-403', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-MED-404', 'Gestión y Búsqueda de Información Científica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-MED-405', 'Liderazgo y Gestión en Equipos Multidisciplinarios', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-MED-406', 'Sistema Nervioso', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-MED-407', 'Inmunidad e Infectología', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-MED-501', 'Metodología de la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-MED-502', 'Genética y Genómica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-MED-503', 'Inteligencia Artificial Aplicada para la Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-MED-504', 'Salud Pública y Epidemiología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-MED-505', 'Sistema Respiratorio', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-MED-506', 'Sistema Cardiovascular', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-MED-507', 'Sistema Excretor', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-MED-601', 'Formulación de Proyectos Interdisciplinarios', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-MED-602', 'Ética y Ciudadanía Global', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-MED-603', 'Sistema Hematopoyético', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-MED-604', 'Sistema Digestivo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-MED-605', 'Sistema Endocrino y Reproductor', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-MED-606', 'Sistema Locomotor', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-MED-701', 'Arte y Cultura', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-MED-702', 'Dilemas Éticos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-MED-703', 'Gestión y Administración de Servicios de Salud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-MED-704', 'Medicina Personalizada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-MED-705', 'Seminario Integrador de Medicina y Patología General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-MED-706', 'Práctica Clínica Integrada 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (4 cursos, 18 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-MED-801', 'Seminario Integrador en Medicina y Patología Especializada', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-MED-802', 'Imagenología', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-MED-803', 'Laboratorio Clínico', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-MED-804', 'Práctica Clínica Integrada 2', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (5 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-MED-901', 'Medicina Legal', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-MED-902', 'Oncología Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-MED-903', 'Externado en Medicina Interna', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-MED-904', 'Diagnóstico Comunitario', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-MED-905', 'Seminario Integrador en Cirugía General y Traumatología', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-MED-1001', 'Seminario Integrador en Ginecología y Obstetricia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-MED-1002', 'Salud Basada en la Evidencia Científica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-MED-1003', 'Terapéutica Médica', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-MED-1004', 'Externado en Cirugía General y Traumatología', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-MED-1005', 'Clínica Nutricional', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 11 (5 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 11, 'UPN-MED-1101', 'Proyecto de Investigación en Salud 1', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UPN-MED-1102', 'Externado en Ginecología y Obstetricia', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UPN-MED-1103', 'Externado en Emergencias', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UPN-MED-1104', 'Psiquiatría', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 11, 'UPN-MED-1105', 'Seminario Integrador en Pediatría', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 12 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 12, 'UPN-MED-1201', 'Proyecto de Investigación en Salud 2', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UPN-MED-1202', 'Externado en Medicina Comunitaria', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UPN-MED-1203', 'Externado en Salud Mental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UPN-MED-1204', 'Externado en Pediatría', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 12, 'UPN-MED-1205', 'Electivo 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 12, 'UPN-MED-1206', 'Electivo 2', 3.0, 'ELECTIVO', v_source_id);

  -- CICLO 13 (3 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 13, 'UPN-MED-1301', 'Internado de Medicina Interna', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 13, 'UPN-MED-1302', 'Internado de Cirugía General', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 13, 'UPN-MED-1303', 'Integración de Competencias Generales y Habilidades Blandas', 6.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 14 (3 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 14, 'UPN-MED-1401', 'Internado de Ginecología y Obstetricia', 8.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 14, 'UPN-MED-1402', 'Internado de Pediatría', 7.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 14, 'UPN-MED-1403', 'Trabajo de Investigación', 7.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Psicología (psicologia)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Psicología Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/psicologia',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditación de Calidad • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias'
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
  'Comprensión y evaluación del comportamiento humano, psicodiagnóstico, intervención psicoterapéutica, psicología organizacional, neuropsicología y programas de bienestar mental en contextos clínicos, educativos y laborales.',
  10,
  5.00,
  'Bachiller en Psicología',
  'Acreditación de Calidad • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias',
  'Psicólogo capacitado para diagnosticar e intervenir en la salud mental individual y colectiva, diseñar programas de bienestar emocional y optimizar el comportamiento organizacional.',
  ARRAY['Hospitales, clínicas y centros de salud públicos y privados', 'Empresas e instituciones en el área de Recursos Humanos y Gestión del Talento', 'Instituciones educativas y universidades en consejería y tutoría psicológica', 'Centros de salud mental, rehabilitación y terapia psicológica privada'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'psicologia';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Psicología Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/psicologia', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-PSI-101', 'Interpretación de textos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-PSI-102', 'Desarrollo del talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-PSI-103', 'Fundamentos de la sostenibilidad ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-PSI-104', 'Taller de interpretación de textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-PSI-105', 'Bases biológicas del comportamiento humano', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-PSI-106', 'Introducción a la psicología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-PSI-107', 'Psicología evolutiva', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-PSI-201', 'Pensamiento numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-PSI-202', 'Empleabilidad y tendencias del mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-PSI-203', 'Liderazgo en gestión socioambiental', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-PSI-204', 'Taller de pensamiento numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-PSI-205', 'Habilidades digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-PSI-206', 'Neuropsicología y cognición', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-PSI-207', 'Psicología de personalidad', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-PSI-301', 'Comunicación efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-PSI-302', 'Ciudadanía y cambio climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-PSI-303', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-PSI-304', 'Salud digital', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-PSI-305', 'Psicología clínica y de la salud', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-PSI-306', 'Aprendizaje y conducta adaptativa', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-PSI-307', 'Psicología social y comunitaria', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-PSI-401', 'Probabilidad y estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-PSI-402', 'Essentials 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-PSI-403', 'Innovación y emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-PSI-404', 'Gestión de búsqueda de información cientí ca', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-PSI-405', 'Bases farmacológicas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-PSI-406', 'Psicopatología del infante y adolescente', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-PSI-407', 'Medición y evaluación psicológica 1', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-PSI-501', 'Metodología de la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-PSI-502', 'Inteligencia artificial aplicada para la investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-PSI-503', 'Promoción y prevención en salud', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-PSI-504', 'Diagnóstico de problemas psicosociales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-PSI-505', 'Psicopatología del adulto y adulto mayor', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-PSI-506', 'Psicología educativa y del aprendizaje', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-PSI-507', 'Medición y evaluación psicológica 2', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-PSI-601', 'Formulación de proyectos interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-PSI-602', 'Ética y ciudadanía global', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-PSI-603', 'Genética y genómica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-PSI-604', 'Salud global y epidemiología', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-PSI-605', 'Psicología organizacional y del talento humano', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-PSI-606', 'Técnicas de observación y entrevista psicológica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-PSI-607', 'Construcción de pruebas psicológicas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-PSI-701', 'Arte y cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-702', 'Dilemas éticos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-703', 'Consultoría organizacional', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-704', 'Modelos psicoterapéuticos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-705', 'Diagnóstico e informe psicológico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-706', 'Salud basada en la evidencia cientí ca', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-707', 'Intervención en contextos educativos y problemas de aprendizaje', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-PSI-708', 'Tecnologías emergentes en salud', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (7 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-PSI-801', 'Intervención en personas con diversidad funcional', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-PSI-802', 'Gestión en proyectos psicológicos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-PSI-803', 'Programas de intervención psicoeducativa', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-PSI-804', 'Proyecto de investigación en psicología 1', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-PSI-805', 'Intervención psicoterapéutica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-PSI-806', 'Consejería y orientación psicológica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-PSI-807', 'Atracción y selección del capital humano', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (4 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-PSI-901', 'Internado en prevención y evaluación', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-PSI-902', 'Proyecto de investigación en psicología 2', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-PSI-903', 'Electivo 1', 5.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-PSI-904', 'Integración de competencias generales y habilidades blandas', 5.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (4 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-PSI-1001', 'Trabajo de investigación', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-PSI-1002', 'Internado en intervención', 6.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-PSI-1003', 'Electivo 2', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 10, 'UPN-PSI-1004', 'Taller integrador en prácticas psicológicas', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ------------------------------------------------------------------------------
-- CARRERA: Ingeniería Industrial (ingenieria-industrial)
-- ------------------------------------------------------------------------------
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Ingeniería Industrial Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/ingenieria-industrial',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  'Malla oficial de 10 ciclos y 200 créditos. Acreditado por ICACIT • Laboratorios de Automatización, Manufactura y Logística'
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
  'Optimización de procesos productivos y de servicios, gestión de la cadena de suministros (supply chain), control de calidad, seguridad y salud en el trabajo, finanzas industriales y analítica de operaciones para aumentar la productividad.',
  10,
  5.00,
  'Bachiller en Ingeniería Industrial',
  'Acreditado por ICACIT • Laboratorios de Automatización, Manufactura y Logística',
  'Ingeniero estratega en optimización de operaciones productivas y de servicios, gestión de la cadena de suministros global (supply chain) y dirección de programas de mejora continua Lean Six Sigma.',
  ARRAY['Área de Producción y Operaciones en plantas industriales y manufactura', 'Área de Logística y Cadena de Suministro (Supply Chain)', 'Área de Gestión de la Calidad y Mejora Continua (Lean Six Sigma)', 'Área de Proyectos, Finanzas Industriales y Consultoría Estratégica'],
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
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-industrial';
  SELECT id INTO v_source_id FROM sources WHERE source_name = 'Brochure Oficial UPN - Ingeniería Industrial Pregrado 2026' LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/ingenieria-industrial', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- Registrar Malla Curricular UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular UPN 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- Insertar cursos de la malla curricular por ciclos

  -- CICLO 1 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-IND-101', 'Interpretación de Textos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-102', 'Desarrollo del Talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-103', 'Principios de Seguridad', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-104', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-105', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-106', 'Química General', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-107', 'Introducción a la Ingeniería Industrial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-IND-108', 'Economía', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (8 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-IND-201', 'Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-202', 'Empleabilidad y Tendencias del Mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-203', 'Contabilidad', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-204', 'Liderazgo en Gestión Socioambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-205', 'Taller de Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-206', 'Herramientas Esenciales para Ingenieros', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-207', 'Habilidades Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-IND-208', 'Cálculo', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-IND-301', 'Comunicación Efectiva', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-IND-302', 'Costos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-IND-303', 'Ciudadanía y Cambio Climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-IND-304', 'Essentials 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-IND-305', 'Marketing Empresarial', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-IND-306', 'Cálculo Diferencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-IND-307', 'Química', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (7 cursos, 19 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-IND-401', 'Probabilidad y Estadística', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-IND-402', 'Ingeniería Económica', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-IND-403', 'Análisis de Datos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-IND-404', 'Essentials 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-IND-405', 'Innovación y Emprendimiento', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-IND-406', 'Cálculo Integral', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-IND-407', 'Física 1', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (6 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-IND-501', 'Metodología de la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-IND-502', 'Inteligencia Artificial Aplicada para la Investigación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-IND-503', 'Estadística Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-IND-504', 'Matemáticas Avanzadas para Ingenieros', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-IND-505', 'Física 2', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-IND-506', 'Mejora Continua del Trabajo', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-IND-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-IND-602', 'Finanzas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-IND-603', 'Ética y Ciudadanía Global', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-IND-604', 'Metodologías Ágiles', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-IND-605', 'Optimización de Recursos Empresariales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-IND-606', 'Filosofía Lean', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-IND-607', 'Localización y Sistribución de Plantas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (7 cursos, 20 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-IND-701', 'Arte y Cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-IND-702', 'Dilemas Éticos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-IND-703', 'Gestión de Procesos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-IND-704', 'Design Thinking', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-IND-705', 'Toma de Decisiones con Métodos Cuantitativos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-IND-706', 'Seguridad y Salud en el Trabajo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-IND-707', 'Planificación y Control de Operaciones', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (6 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-IND-801', 'Electivo de Hub', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-IND-802', 'Electivo de Carrera 1', 4.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-IND-803', 'Gestión de Mantenimiento', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-IND-804', 'Simulación de Procesos', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-IND-805', 'Logística y Cadena de Suministros', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-IND-806', 'Gestión Empresarial de Operaciones', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (7 cursos, 18 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-IND-901', 'Emprendimiento Integrador', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-IND-902', 'Investigación en Ingeniería', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-IND-903', 'Electivo de Carrera 2', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-IND-904', 'Gestión del Talento Humano', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-IND-905', 'Gestión de Proyectos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-IND-906', 'Gestión de la Calidad', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-IND-907', 'Integración de Competencias Generales y Habilidades Blandas', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (5 cursos, 22 créditos)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-IND-1001', 'Integración de Competencias Específicas de Ingeniería Industrial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-IND-1002', 'Trabajo de Investigación', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-IND-1003', 'Proyecto Integrador Industrial', 5.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-IND-1004', 'Gestión Ambiental', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-IND-1005', 'Control y Automatización Industrial', 4.0, 'OBLIGATORIO', v_source_id);

  -- Registrar Indicador de Empleabilidad IPSOS 2024
  INSERT INTO employment_indicators (
    career_id, institution_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id
  )
  VALUES (
    v_career_id, v_upn_id, 'TASA_EMPLEABILIDAD', 90.0000, '%', 2024,
    'Estudio de Empleabilidad IPSOS 2024 - Egresados UPN',
    '9 de cada 10 egresados de la Universidad Privada del Norte (UPN) trabajan.',
    v_source_id
  )
  ON CONFLICT DO NOTHING;

END $$;
