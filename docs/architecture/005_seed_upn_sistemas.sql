-- ==============================================================================
-- MIGRACIÓN / SEED: Universidad Privada del Norte (UPN)
-- Carrera: Ingeniería de Sistemas Computacionales
-- Fuente oficial: ug-ingenieria-de-sistemas-computacionales.pdf (ICACIT / ACM-IEEE)
-- ==============================================================================

-- Sincronizar secuencias
SELECT setval(pg_get_serial_sequence('institutions', 'id'), COALESCE(MAX(id), 1)) FROM institutions;
SELECT setval(pg_get_serial_sequence('sources', 'id'), COALESCE(MAX(id), 1)) FROM sources;
SELECT setval(pg_get_serial_sequence('campuses', 'id'), COALESCE(MAX(id), 1)) FROM campuses;
SELECT setval(pg_get_serial_sequence('careers', 'id'), COALESCE(MAX(id), 1)) FROM careers;
SELECT setval(pg_get_serial_sequence('academic_offers', 'id'), COALESCE(MAX(id), 1)) FROM academic_offers;
SELECT setval(pg_get_serial_sequence('curricula', 'id'), COALESCE(MAX(id), 1)) FROM curricula;
SELECT setval(pg_get_serial_sequence('curriculum_courses', 'id'), COALESCE(MAX(id), 1)) FROM curriculum_courses;

-- 1. REGISTRAR FUENTE OFICIAL
INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  'Brochure Oficial UPN - Ingeniería de Sistemas Computacionales Pregrado 2026',
  'Universidad Privada del Norte',
  'https://www.upn.edu.pe/carrera/ingenieria-de-sistemas-computacionales',
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026 / ICACIT / ACM-IEEE',
  'Malla oficial de 10 ciclos y 200 créditos, acreditada por ICACIT y alineada a estándares ACM/IEEE'
)
ON CONFLICT DO NOTHING;

-- 2. REGISTRAR INSTITUCIÓN: UNIVERSIDAD PRIVADA DEL NORTE (UPN)
INSERT INTO institutions (name, short_name, institution_type, description, website_url, is_active)
VALUES (
  'Universidad Privada del Norte',
  'UPN',
  'PRIVADA_SOCIETARIA',
  'Universidad licenciada por SUNEDU, acreditada internacionalmente por ICACIT con estándares ACM/IEEE y miembro de la red internacional con más de 70,000 graduados.',
  'https://www.upn.edu.pe',
  true
)
ON CONFLICT (short_name) DO UPDATE SET
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url;

-- 3. REGISTRAR CAMPUSES PRINCIPALES DE LA UPN
DO $$
DECLARE
  v_upn_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';

  INSERT INTO campuses (institution_id, name, address, district, city, is_active)
  VALUES
    (v_upn_id, 'Los Olivos', 'Av. Alfredo Mendiola 6062', 'Los Olivos', 'Lima', true),
    (v_upn_id, 'Breña', 'Av. Tingo María 1122', 'Breña', 'Lima', true),
    (v_upn_id, 'San Juan de Lurigancho', 'Av. El Sol 461', 'San Juan de Lurigancho', 'Lima', true),
    (v_upn_id, 'Chorrillos', 'Av. Defensores del Morro 1435', 'Chorrillos', 'Lima', true),
    (v_upn_id, 'Comas', 'Av. Universitaria con Panamericana Norte', 'Comas', 'Lima', true),
    (v_upn_id, 'Trujillo El Molino', 'Av. El Ejército 920', 'Trujillo', 'La Libertad', true)
  ON CONFLICT DO NOTHING;
END $$;

-- 4. REGISTRAR CARRERA: INGENIERÍA DE SISTEMAS COMPUTACIONALES
INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  'Ingeniería de Sistemas Computacionales',
  'ingenieria-de-sistemas-computacionales',
  'Facultad de Ingeniería',
  'Durante la carrera aprenderás sobre arquitectura de sistemas, administración de redes, seguridad informática, bases de datos y servicios en la nube. Serás capaz de diseñar, implementar y gestionar infraestructuras tecnológicas eficientes con estándares globales ACM/IEEE.',
  10,
  5.00,
  'Bachiller en Ingeniería de Sistemas Computacionales',
  'Acreditado por ICACIT • Alineado 100% a estándares internacionales ACM/IEEE',
  'Experto en diseñar, implementar y gestionar soluciones tecnológicas, impulsando la transformación digital y la evolución tecnológica en organizaciones. Preparado con certificaciones especializadas en Data Analytics y Bootcamp Web desde los primeros ciclos.',
  ARRAY[
    'Empresas o consultoras de tecnología, telecomunicaciones, ciberseguridad o transformación digital',
    'Organismos públicos y privados',
    'Centros de investigación y desarrollo en computación, inteligencia artificial, sistemas distribuidos y redes',
    'Instituciones educativas en áreas de tecnologías de la información, redes y sistemas computacionales'
  ],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  faculty = EXCLUDED.faculty,
  description = EXCLUDED.description,
  license_or_accreditation = EXCLUDED.license_or_accreditation,
  general_profile = EXCLUDED.general_profile,
  general_work_fields = EXCLUDED.general_work_fields;

-- 5. REGISTRAR ACADEMIC OFFERS PARA LA UPN
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
  SELECT id INTO v_career_id FROM careers WHERE slug = 'ingenieria-de-sistemas-computacionales';
  SELECT id INTO v_source_id FROM sources WHERE publisher = 'Universidad Privada del Norte' LIMIT 1;

  -- Crear oferta académica para cada campus
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      'https://www.upn.edu.pe/carrera/ingenieria-de-sistemas-computacionales', v_source_id
    )
    ON CONFLICT (institution_id, campus_id, career_id, modality) DO UPDATE SET
      admission_status = 'ACTIVE',
      official_url = EXCLUDED.official_url;
  END LOOP;

  -- Tomar la primera oferta para anclar la malla curricular
  SELECT id INTO v_offer_id FROM academic_offers 
  WHERE institution_id = v_upn_id AND career_id = v_career_id 
  LIMIT 1;

  -- 6. REGISTRAR MALLA CURRICULAR UPN 2026
  INSERT INTO curricula (
    academic_offer_id, version_name, academic_year, source_id, published_at, is_current
  )
  VALUES (
    v_offer_id, 'Malla Curricular ICACIT / ACM-IEEE 2026', 2026, v_source_id, '2026-01-15', true
  )
  RETURNING id INTO v_curriculum_id;

  -- 7. INSERTAR LOS 74 CURSOS DE LA MALLA CURRICULAR POR CICLOS
  
  -- CICLO 1 (20 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 1, 'UPN-101', 'Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-102', 'Desarrollo del Talento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-103', 'Principios de Seguridad', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-104', 'Fundamentos de la Sostenibilidad Ambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-105', 'Taller de Interpretación de Textos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-106', 'Arquitectura Empresarial de TI', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-107', 'Introducción a la Ingeniería de Sistemas Computacionales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 1, 'UPN-108', 'Matemática Discreta y Geometría Analítica', 4.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 2 (40 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 2, 'UPN-201', 'Pensamiento Numérico', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-202', 'Empleabilidad y Tendencias del Mercado', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-203', 'Teoría de la Computación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-204', 'Liderazgo en Gestión Socioambiental', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-205', 'Taller de Pensamiento Numérico', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-206', 'Lenguajes de Programación', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-207', 'Habilidades Digitales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 2, 'UPN-208', 'Fundamentos de Programación', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 3 (59 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 3, 'UPN-301', 'Comunicación Efectiva', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-302', 'Programación Web', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-303', 'Ciudadanía y Cambio Climático', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-304', 'Essentials 1', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-305', 'Estructuras de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-306', 'Cálculo', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 3, 'UPN-307', 'Base de Datos', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 4 (80 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 4, 'UPN-401', 'Probabilidad y Estadística', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-402', 'Análisis de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-403', 'Essentials 2', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-404', 'Base de Datos Avanzadas y Big Data', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-405', 'Innovación y Emprendimiento', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-406', 'Cálculo Diferencial', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 4, 'UPN-407', 'Modelado y Desarrollo de Aplicaciones', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 5 (100 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 5, 'UPN-501', 'Metodología de la Investigación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-502', 'Simulación y Análisis de Sistemas Computacionales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-503', 'Arquitectura del Computador', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-504', 'Inteligencia Artificial Aplicada para la Investigación', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-505', 'Metodologías Ágiles', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-506', 'Estructuras de Datos Avanzadas y Estrategias de Algoritmos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-507', 'Física 1', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 5, 'UPN-508', 'Cálculo Integral', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 6 (120 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 6, 'UPN-601', 'Formulación de Proyectos Interdisciplinarios', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-602', 'Ética y Ciudadanía Global', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-603', 'Física 2', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-604', 'Matemáticas Avanzadas para Ingenieros', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-605', 'Diseño y Arquitectura de Software', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-606', 'Diseño de Circuitos Digitales', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 6, 'UPN-607', 'Curso Certificador 1 de Ingeniería de Sistemas Computacionales', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 7 (142 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 7, 'UPN-701', 'Arte y Cultura', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-702', 'Dilemas Éticos', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-703', 'Diseño Centrado en el Usuario', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-704', 'Fundamentos de Infraestructuras de Redes', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-705', 'Sistemas Embebidos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-706', 'Desarrollo de Aplicaciones Móviles', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-707', 'Estadística Aplicada', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 7, 'UPN-708', 'Bootcamp Web', 3.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 8 (162 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 8, 'UPN-801', 'Electivo de Hub', 2.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-802', 'Soluciones de IOT y Robótica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-803', 'Electivo de Carrera 1', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 8, 'UPN-804', 'Diseño y Gestión Avanzada de Redes de Datos', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-805', 'Sistemas Inteligentes y Machine Learning', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-806', 'Aseguramiento de la Calidad en Sistemas Computacionales', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-807', 'Optimización y Toma de Decisiones en Sistemas', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 8, 'UPN-808', 'Curso Certificador 2 de Ingeniería de Sistemas Computacionales', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 9 (180 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 9, 'UPN-901', 'Investigación en Ingeniería', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-902', 'Emprendimiento Integrador', 2.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-903', 'Electivo de Carrera 2', 3.0, 'ELECTIVO', v_source_id),
    (v_curriculum_id, 9, 'UPN-904', 'Computación Gráfica', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-905', 'Proyectos y Gobernanza de TI', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-906', 'Infraestructura y Seguridad en la Nube', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 9, 'UPN-907', 'Integración de Competencias Generales y Habilidades Blandas', 2.0, 'OBLIGATORIO', v_source_id);

  -- CICLO 10 (200 créditos acumulados)
  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES
    (v_curriculum_id, 10, 'UPN-1001', 'Programación Competitiva y Modelos Inteligentes', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-1002', 'Compiladores', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-1003', 'Seguridad Integral de Sistemas', 3.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-1004', 'Trabajo de Investigación', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-1005', 'Proyecto Integrador de Sistemas Computacionales', 4.0, 'OBLIGATORIO', v_source_id),
    (v_curriculum_id, 10, 'UPN-1006', 'Integración de Competencias Específicas de Ingeniería de Sistemas Computacionales', 3.0, 'OBLIGATORIO', v_source_id);

  -- 8. REGISTRAR INDICADOR DE EMPLEABILIDAD IPSOS 2024 DE LA UPN
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
