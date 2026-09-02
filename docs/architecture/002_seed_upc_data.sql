-- ============================================================================
-- MIGRACIÓN 002: SEMBRADO DE DATOS MAESTROS REALES UPC 2026 & TEST VOCACIONAL
-- ============================================================================

-- 1. FUENTES DE VERDAD OFICIALES
INSERT INTO sources (id, source_name, publisher, url, source_type, published_date, accessed_at, valid_until, notes)
VALUES
  (1, 'Transparencia UPC - Mallas Curriculares', 'Universidad Peruana de Ciencias Aplicadas', 'https://www.upc.edu.pe/transparencia-upc/mallas-curriculares/', 'PORTAL_OFICIAL', '2026-01-15', now(), '2027-12-31', 'Mallas vigentes por carrera y modalidad.'),
  (2, 'Transparencia UPC - Pensiones Pregrado 2026', 'Universidad Peruana de Ciencias Aplicadas', 'https://upc.edu.pe/transparencia-upc/pensiones-y-tarifas/pensiones-pregrado/', 'RESOLUCION', '2026-01-10', now(), '2026-12-31', 'Escala de pensiones y categorías aprobadas para el año académico 2026.'),
  (3, 'UPC Campus y Sedes Oficiales', 'Universidad Peruana de Ciencias Aplicadas', 'https://upc.edu.pe/nosotros/campus/', 'PORTAL_OFICIAL', '2026-01-01', now(), '2027-12-31', 'Direcciones oficiales de los 4 campus en Lima.'),
  (4, 'Estudio Empleabilidad Egresados UPC - IPSOS Perú 2022', 'IPSOS Perú / UPC', 'https://upc.edu.pe/nosotros/pilares-estrategicos/exigencia/', 'ESTUDIO_MERCADO', '2022-11-30', now(), '2026-12-31', '9 de cada 10 egresados trabajando a nivel institucional.'),
  (5, 'Portal Mi Carrera MTPE 2024', 'Ministerio de Trabajo y Promoción del Empleo', 'https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/', 'PORTAL_OFICIAL', '2024-06-01', now(), '2026-12-31', 'Ingreso promedio mensual de egresados de Comunicación y Publicidad.'),
  (6, 'Convocatoria Beca 18 y Alianzas de Financiamiento', 'PRONABEC / UPC', 'https://www.upc.edu.pe/admision/becas-y-financiamiento/', 'PORTAL_OFICIAL', '2026-01-05', now(), '2026-12-31', 'Becas para estudiantes de alto rendimiento y vulnerabilidad económica.'),
  (7, 'Transparencia UPC - Tarifas Administrativas 2026', 'Universidad Peruana de Ciencias Aplicadas', 'https://upc.edu.pe/transparencia-upc/pensiones-y-tarifas/tarifas-pregrado/', 'RESOLUCION', '2026-01-10', now(), '2026-12-31', 'Tarifas de carnet TIU, certificados y constancias.')
ON CONFLICT (id) DO UPDATE SET source_name = EXCLUDED.source_name;

-- 2. INSTITUCIÓN: UPC
INSERT INTO institutions (id, name, short_name, institution_type, description, website_url, logo_url, is_active)
VALUES
  (1, 'Universidad Peruana de Ciencias Aplicadas', 'UPC', 'PRIVADA_SOCIETARIA', 'Universidad privada líder en innovación, licenciada por SUNEDU, con acreditación institucional internacional por WASC Senior College and University Commission.', 'https://www.upc.edu.pe', 'https://upc.edu.pe/static/img/logo.svg', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. CAMPUS UPC (4 SEDES CONFIRMADAS)
INSERT INTO campuses (id, institution_id, name, address, district, city, latitude, longitude, map_url, is_active)
VALUES
  (1, 1, 'Monterrico', 'Prolongación Primavera 2390', 'Santiago de Surco', 'Lima', -12.1039800, -76.9631200, 'https://maps.google.com/?q=-12.1039800,-76.9631200', true),
  (2, 1, 'San Isidro', 'Av. General Salaverry 2255', 'San Isidro', 'Lima', -12.0886500, -77.0494400, 'https://maps.google.com/?q=-12.0886500,-77.0494400', true),
  (3, 1, 'San Miguel', 'Av. La Marina 2810', 'San Miguel', 'Lima', -12.0768200, -77.0934700, 'https://maps.google.com/?q=-12.0768200,-77.0934700', true),
  (4, 1, 'Villa', 'Av. Alameda San Marcos s/n', 'Chorrillos', 'Lima', -12.2038900, -77.0093800, 'https://maps.google.com/?q=-12.2038900,-77.0093800', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. CARRERAS PRINCIPALES DEL PILOTO
INSERT INTO careers (id, name, slug, faculty, description, duration_semesters, duration_years, degree, license_or_accreditation, general_profile, general_work_fields, is_active)
VALUES
  (1, 'Ingeniería de Software', 'ingenieria-de-software', 'Ingeniería', 'Forma ingenieros capaces de concebir, diseñar, implementar y operar sistemas de software de gran escala, aplicando metodologías ágiles, cloud computing e inteligencia artificial.', 10, 5.0, 'Bachiller en Ingeniería de Software', 'Acreditada por ABET', 'Perfil orientado a la arquitectura de software, calidad, desarrollo full-stack y gestión de proyectos tecnológicos.', ARRAY['Desarrollo Cloud & Web', 'Arquitectura de Software', 'Inteligencia Artificial', 'DevOps & Ciberseguridad'], true),
  (2, 'Ingeniería de Sistemas de Información', 'ingenieria-de-sistemas-de-informacion', 'Ingeniería', 'Integra la tecnología con los objetivos estratégicos empresariales, optimizando procesos de negocio mediante el uso intensivo de datos, ERPs y gobernanza de TI.', 10, 5.0, 'Bachiller en Ingeniería de Sistemas de Información', 'Acreditada por ABET', 'Profesional estratega en transformación digital, consultoría de TI y alineamiento de sistemas con la alta dirección.', ARRAY['Transformación Digital', 'Gestión de Proyectos TI', 'Business Intelligence', 'Gobernanza y Ciberseguridad'], true),
  (3, 'Ciencias de la Computación', 'ciencias-de-la-computacion', 'Ingeniería', 'Enfocada en los fundamentos matemáticos y computacionales, algoritmos complejos, procesamiento de datos a gran escala, visión computacional y modelos de IA avanzados.', 10, 5.0, 'Bachiller en Ciencias de la Computación', 'Licenciada por SUNEDU', 'Investigador y científico de datos capaz de crear nuevos algoritmos y tecnologías disruptivas.', ARRAY['Investigación en IA & Deep Learning', 'Algoritmos y Optimización', 'Big Data', 'Computación Científica'], true),
  (4, 'Administración', 'administracion', 'Negocios', 'Desarrolla líderes con visión global capaces de gestionar organizaciones de forma sostenible, innovadora y rentable, con opciones de triple especialización.', 10, 5.0, 'Bachiller en Administración', 'Acreditación SINEACE / Licenciada', 'Visión integral del negocio con énfasis en estrategia directiva, innovación y emprendimiento corporativo.', ARRAY['Dirección Estratégica', 'Consultoría Empresarial', 'Emprendimiento', 'Gestión de Operaciones'], true),
  (5, 'Administración y Marketing', 'administracion-y-marketing', 'Negocios', 'Combina la ciencia de la administración con la psicología del consumidor, branding, analítica digital de mercado y estrategias comerciales multicanal.', 10, 5.0, 'Bachiller en Administración y Marketing', 'Licenciada por SUNEDU', 'Profesional creativo y analítico enfocado en la generación de valor de marca y experiencia del cliente.', ARRAY['Marketing Digital & Growth', 'Brand Management', 'Consumer Insights', 'E-commerce & Ventas'], true),
  (6, 'Administración y Finanzas', 'administracion-y-finanzas', 'Negocios', 'Especializada en la toma de decisiones financieras corporativas, mercados de capitales, valoración de empresas, gestión de riesgos e inversiones fintech.', 10, 5.0, 'Bachiller en Administración y Finanzas', 'Licenciada por SUNEDU', 'Experto analítico en maximización del valor económico, tesorería, banca y finanzas cuantitativas.', ARRAY['Banca de Inversión', 'Finanzas Corporativas', 'Fintech & Riesgos', 'Auditoría Financiera'], true),
  (7, 'Psicología', 'psicologia', 'Psicología', 'Formación humanística y científica para la comprensión, diagnóstico e intervención en la conducta humana en áreas clínica, educativa y organizacional.', 10, 5.0, 'Bachiller en Psicología', 'Licenciada por SUNEDU', 'Profesional empático con sólida preparación diagnóstica e investigativa en bienestar mental y del comportamiento.', ARRAY['Psicología Clínica', 'Gestión del Talento Organizacional', 'Psicología Educativa', 'Investigación Psicosocial'], true),
  (8, 'Derecho', 'derecho', 'Derecho', 'Prepara abogados con criterio jurídico riguroso y visión empresarial, dominando el derecho corporativo, ambiental, litigios, compliance y regulación digital.', 10, 5.0, 'Bachiller en Derecho', 'Licenciada por SUNEDU', 'Abogado estratega en prevención de conflictos, negociación y asesoría jurídica de alto nivel.', ARRAY['Derecho Corporativo & M&A', 'Litigios y Arbitraje', 'Compliance y Regulación', 'Derecho Digital & Fintech'], true),
  (9, 'Comunicación y Publicidad', 'comunicacion-y-publicidad', 'Comunicaciones', 'Integra la creatividad publicitaria, redacción persuasiva, planificación de medios y campañas transmedia de alto impacto comercial y social.', 10, 5.0, 'Bachiller en Comunicación y Publicidad', 'Licenciada por SUNEDU', 'Estratega creativo en agencias de publicidad, productoras y departamentos de comunicación corporativa.', ARRAY['Dirección Creativa Publicitaria', 'Estrategia de Medios & Medios Digitales', 'Storytelling & Contenido', 'Cuentas y Planificación'], true),
  (10, 'Arquitectura', 'arquitectura', 'Arquitectura', 'Formación proyectual con énfasis en diseño sostenible, urbanismo bioclimático, tecnología constructiva y patrimonio.', 10, 5.0, 'Bachiller en Arquitectura', 'Acreditación RIBA', 'Diseñador integral de espacios habitables y proyectos urbanos sostenibles.', ARRAY['Diseño Arquitectónico', 'Urbanismo y Territorio', 'Gestión de Proyectos BIM', 'Interiorismo Sostenible'], true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 5. OFERTAS ACADÉMICAS (CARRERA + CAMPUS UPC)
INSERT INTO academic_offers (id, institution_id, campus_id, career_id, modality, admission_status, official_url, source_id)
VALUES
  -- Ing. Software en los 4 campus
  (1, 1, 1, 1, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/carrera-de-ingenieria-de-software/', 1),
  (2, 1, 2, 1, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/carrera-de-ingenieria-de-software/', 1),
  (3, 1, 3, 1, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/carrera-de-ingenieria-de-software/', 1),
  (4, 1, 4, 1, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/carrera-de-ingenieria-de-software/', 1),
  -- Ing. Sistemas en los 4 campus
  (5, 1, 1, 2, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/', 1),
  (6, 1, 2, 2, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/', 1),
  (7, 1, 3, 2, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/', 1),
  (8, 1, 4, 2, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/', 1),
  -- Administración en los 4 campus
  (9, 1, 1, 4, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-negocios/administracion/', 1),
  (10, 1, 2, 4, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-negocios/administracion/', 1),
  (11, 1, 3, 4, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-negocios/administracion/', 1),
  (12, 1, 4, 4, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-negocios/administracion/', 1),
  -- Comunicación y Publicidad en los 4 campus
  (13, 1, 1, 9, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/', 1),
  (14, 1, 2, 9, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/', 1),
  (15, 1, 3, 9, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/', 1),
  (16, 1, 4, 9, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/', 1),
  -- Psicología en Monterrico, San Isidro, San Miguel y Villa
  (17, 1, 1, 7, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-psicologia/psicologia/', 1),
  (18, 1, 2, 7, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-psicologia/psicologia/', 1),
  (19, 1, 3, 7, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-psicologia/psicologia/', 1),
  (20, 1, 4, 7, 'PRESENCIAL', 'ACTIVE', 'https://pregrado.upc.edu.pe/facultad-de-psicologia/psicologia/', 1)
ON CONFLICT (id) DO UPDATE SET admission_status = EXCLUDED.admission_status;

-- 6. MALLA CURRICULAR Y CURSOS REPRESENTATIVOS DE ING. DE SOFTWARE
INSERT INTO curricula (id, academic_offer_id, version_name, academic_year, source_id, published_at, is_current)
VALUES
  (1, 1, 'Malla Curricular 2024-2026', 2026, 1, '2026-01-01', true)
ON CONFLICT (id) DO UPDATE SET version_name = EXCLUDED.version_name;

INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, prerequisite, source_id)
VALUES
  (1, 1, 'SI101', 'Introducción a la Ingeniería de Software', 3.0, 'OBLIGATORIO', 'Ninguno', 1),
  (1, 1, 'MA101', 'Cálculo Diferencial', 4.0, 'OBLIGATORIO', 'Ninguno', 1),
  (1, 1, 'HU101', 'Comprensión y Producción de Lenguaje I', 4.0, 'GENERAL', 'Ninguno', 1),
  (1, 2, 'SI201', 'Fundamentos de Programación y Algoritmos', 4.0, 'OBLIGATORIO', 'SI101', 1),
  (1, 2, 'MA201', 'Cálculo Integral', 4.0, 'OBLIGATORIO', 'MA101', 1),
  (1, 3, 'SI301', 'Estructuras de Datos y Algoritmos Avanzados', 4.0, 'OBLIGATORIO', 'SI201', 1),
  (1, 3, 'SI302', 'Bases de Datos Relacionales y NoSQL', 4.0, 'OBLIGATORIO', 'SI201', 1),
  (1, 4, 'SI401', 'Diseño y Patrones de Arquitectura de Software', 4.0, 'OBLIGATORIO', 'SI301', 1),
  (1, 4, 'SI402', 'Desarrollo de Aplicaciones Web y Cloud', 4.0, 'OBLIGATORIO', 'SI302', 1),
  (1, 5, 'SI501', 'Ingeniería de Requerimientos y Metodologías Ágiles', 3.0, 'OBLIGATORIO', 'SI401', 1),
  (1, 6, 'SI601', 'Desarrollo Móvil y Sistemas Distribuidos', 4.0, 'OBLIGATORIO', 'SI402', 1),
  (1, 7, 'SI701', 'DevOps y Entrega Continua de Software', 3.0, 'OBLIGATORIO', 'SI601', 1),
  (1, 8, 'SI801', 'Inteligencia Artificial Aplicada al Software', 4.0, 'OBLIGATORIO', 'SI701', 1),
  (1, 9, 'SI901', 'Proyecto Capstone de Software I', 5.0, 'OBLIGATORIO', 'SI801', 1),
  (1, 10, 'SI902', 'Proyecto Capstone de Software II', 5.0, 'OBLIGATORIO', 'SI901', 1)
ON CONFLICT DO NOTHING;

-- 7. PENSIONES 2026 REFERENCIALES UPC (Resolución oficial DAF)
INSERT INTO tuition_fees (academic_offer_id, category, concept, amount, currency, academic_year, valid_from, valid_until, conditions, source_id)
VALUES
  -- Ing. Software Monterrico
  (1, 'Categoría T-U (Mínima referencial)', 'Pensión Mensual (5 cuotas por ciclo)', 1980.00, 'PEN', 2026, '2026-01-01', '2026-12-31', 'Sujeto a evaluación socioeconómica en admisión.', 2),
  (1, 'Categoría T-V (Media referencial)', 'Pensión Mensual (5 cuotas por ciclo)', 2850.00, 'PEN', 2026, '2026-01-01', '2026-12-31', 'Tarifa estándar según colegio de procedencia.', 2),
  (1, 'Categoría T-W (Máxima referencial)', 'Pensión Mensual (5 cuotas por ciclo)', 4150.00, 'PEN', 2026, '2026-01-01', '2026-12-31', 'Colegios del Grupo A / Bachillerato Internacional.', 2),
  -- Ing. Software San Miguel
  (3, 'Categoría T-U (Mínima referencial)', 'Pensión Mensual (5 cuotas por ciclo)', 1980.00, 'PEN', 2026, '2026-01-01', '2026-12-31', 'Sujeto a evaluación socioeconómica en admisión.', 2),
  (3, 'Categoría T-V (Media referencial)', 'Pensión Mensual (5 cuotas por ciclo)', 2850.00, 'PEN', 2026, '2026-01-01', '2026-12-31', 'Tarifa estándar según colegio de procedencia.', 2),
  -- Matrícula anual
  (1, 'General', 'Derecho de Matrícula por Semestre', 350.00, 'PEN', 2026, '2026-01-01', '2026-12-31', 'Pago único al inicio de cada semestre académico.', 2)
ON CONFLICT DO NOTHING;

-- 8. BECAS Y FINANCIAMIENTO VIGENTES
INSERT INTO scholarships (id, institution_id, name, description, benefit, eligibility_summary, requirements, application_url, valid_from, valid_until, status, source_id)
VALUES
  (1, 1, 'Beca 18 (PRONABEC)', 'Beca integral del Estado peruano en convenio con la UPC para jóvenes sobresalientes en condición de pobreza o vulnerabilidad.', 'Cobertura del 100% de costos de admisión, matrícula, pensión mensual completa, laptop y asignación de manutención mensual.', 'Egresados de 5to de secundaria o últimos años de colegio público/privado con alto rendimiento y clasificación SISFOH.', 'Pertenecer al tercio o quinto superior del colegio y preselección oficial de PRONABEC.', 'https://www.pronabec.gob.pe/beca-18/', '2026-01-01', '2026-12-31', 'ACTIVE', 6),
  (2, 1, 'Beca Patronato BCP', 'Programa del Banco de Crédito del Perú en alianza con la UPC para carreras de ingeniería, negocios y tecnología.', 'Financiamiento del 100% de la carrera universitaria, mentoría personalizada y plan de acompañamiento para empleabilidad.', 'Alumnos con excelencia académica comprobada y necesidad económica que ingresen a carreras priorizadas.', 'Tercio superior escolar y superación del proceso riguroso de selección del Patronato BCP.', 'https://www.viabcp.com/becas-bcp', '2026-01-01', '2026-12-31', 'ACTIVE', 6),
  (3, 1, 'Beca de Rendimiento Académico UPC', 'Reconocimiento semestral otorgado a los estudiantes regulares de pregrado con los promedios ponderados más altos de su facultad.', 'Descuento porcentual sobre la pensión mensual que oscila entre el 25% y 50% de la cuota durante el periodo de vigencia.', 'Estudiantes con matrícula completa que alcancen el primer o segundo puesto de su respectiva carrera.', 'No registrar desaprobaciones ni sanciones disciplinarias en el semestre anterior.', 'https://upc.edu.pe/admision/becas-y-financiamiento/', '2026-01-01', '2026-12-31', 'ACTIVE', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 9. INDICADORES DE EMPLEABILIDAD VERIFICADOS
INSERT INTO employment_indicators (institution_id, career_id, indicator_type, indicator_value, unit, year, methodology, notes, source_id)
VALUES
  (1, NULL, 'EGRESADOS_TRABAJANDO_GENERAL', 90.0, '%', 2022, 'IPSOS Perú - Estudio de Empleabilidad de Egresados UPC', '9 de cada 10 egresados de la UPC se encuentran laborando formalmente.', 4),
  (1, NULL, 'AFINIDAD_LABORAL_CARRERA', 94.0, '%', 2022, 'IPSOS Perú - Estudio de Empleabilidad de Egresados UPC', '94% de los egresados que trabajan lo hacen en su profesión o especialidad afín.', 4),
  (1, 9, 'SALARIO_PROMEDIO_EGRESADO', 3417.0, 'PEN/mes', 2024, 'MTPE - Portal Oficial Mi Carrera', 'Ingreso promedio mensual de egresados de la carrera de Comunicación y Publicidad.', 5)
ON CONFLICT DO NOTHING;

-- 10. PREGUNTAS DEL CUESTIONARIO VOCACIONAL (RIASEC + TECH + LOGIC)
INSERT INTO questionnaire_questions (id, code, dimension, question_text, question_type, order_number, is_active)
VALUES
  (1, 'Q01_TECH_LOGIC', 'TECH', 'Cuando te enfrentas a un problema nuevo, ¿qué actividad disfrutas más hacer?', 'SINGLE_CHOICE', 1, true),
  (2, 'Q02_INTERPERSONAL', 'SOCIAL', 'En un trabajo grupal en el colegio o con amigos, ¿cuál es el rol que asumes con mayor entusiasmo?', 'SINGLE_CHOICE', 2, true),
  (3, 'Q03_CREATIVITY', 'ARTISTIC', 'Al pensar en tu futuro proyecto profesional, ¿qué te entusiasma más diseñar?', 'SINGLE_CHOICE', 3, true),
  (4, 'Q04_BUSINESS', 'ENTERPRISING', 'Si organizaran una feria escolar o evento para recaudar fondos, ¿en qué te gustaría liderar?', 'SINGLE_CHOICE', 4, true),
  (5, 'Q05_INVESTIGATION', 'INVESTIGATIVE', 'Frente a un avance científico o fenómeno tecnológico reciente, ¿cómo sueles reaccionar?', 'SINGLE_CHOICE', 5, true),
  (6, 'Q06_ORGANIZATION', 'CONVENTIONAL', 'En tus rutinas de estudio o actividades personales, ¿cómo prefieres organizarte?', 'SINGLE_CHOICE', 6, true),
  (7, 'Q07_DIGITAL_BUILD', 'TECH', '¿Qué tipo de proyectos digitales te atrae más aprender a construir?', 'SINGLE_CHOICE', 7, true),
  (8, 'Q08_HELP_PEOPLE', 'SOCIAL', '¿Qué tipo de impacto en la sociedad te gustaría generar con tu trabajo diario?', 'SINGLE_CHOICE', 8, true)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text;

-- 11. OPCIONES DE RESPUESTA CON SCORING MULTIVARIADO (JSONB)
INSERT INTO questionnaire_options (question_id, option_text, score_payload)
VALUES
  -- Q1
  (1, 'Programar una aplicación, automatizar un proceso o usar herramientas de software.', '{"TECH": 5, "LOGIC": 4, "INVESTIGATIVE": 2}'::jsonb),
  (1, 'Calcular datos numéricos, analizar estadísticas o resolver enigmas matemáticos.', '{"LOGIC": 5, "INVESTIGATIVE": 4, "TECH": 2}'::jsonb),
  (1, 'Conversar con las personas afectadas para entender sus necesidades emocionales.', '{"SOCIAL": 5, "ENTERPRISING": 2}'::jsonb),
  (1, 'Diseñar una propuesta visual o crear una narración atractiva sobre el tema.', '{"ARTISTIC": 5, "ENTERPRISING": 3}'::jsonb),

  -- Q2
  (2, 'Guiar al equipo, negociar responsabilidades y presentar la propuesta ante todos.', '{"ENTERPRISING": 5, "SOCIAL": 3}'::jsonb),
  (2, 'Escuchar a cada integrante, asegurar un buen ambiente y apoyar a quien le cuesta más.', '{"SOCIAL": 5, "INVESTIGATIVE": 2}'::jsonb),
  (2, 'Construir el modelo técnico, la estructura digital o las presentaciones interactivas.', '{"TECH": 4, "LOGIC": 3}'::jsonb),
  (2, 'Revisar la coherencia de datos, verificar el cronograma y validar el cumplimiento.', '{"CONVENTIONAL": 5, "LOGIC": 3}'::jsonb),

  -- Q3
  (3, 'Una campaña publicitaria multimedia o una experiencia de marca impactante.', '{"ARTISTIC": 5, "ENTERPRISING": 4}'::jsonb),
  (3, 'Una plataforma digital que solucione un problema crítico de millones de usuarios.', '{"TECH": 5, "ENTERPRISING": 3, "LOGIC": 3}'::jsonb),
  (3, 'Un modelo de negocio rentable o una estrategia de inversión financiera.', '{"ENTERPRISING": 5, "LOGIC": 4}'::jsonb),
  (3, 'Un programa de intervención comunitaria para mejorar la calidad de vida de personas.', '{"SOCIAL": 5, "INVESTIGATIVE": 3}'::jsonb),

  -- Q4
  (4, 'Definir los precios, calcular el margen de ganancia y negociar con proveedores.', '{"ENTERPRISING": 5, "LOGIC": 4, "CONVENTIONAL": 3}'::jsonb),
  (4, 'Crear los afiches digitales, reels en redes sociales y la estética del evento.', '{"ARTISTIC": 5, "ENTERPRISING": 3}'::jsonb),
  (4, 'Implementar el sistema de cobro digital, registro en línea y soporte tecnológico.', '{"TECH": 5, "LOGIC": 4}'::jsonb),
  (4, 'Coordinar la atención al público, resolución de quejas y la satisfacción de asistentes.', '{"SOCIAL": 5, "ENTERPRISING": 2}'::jsonb),

  -- Q5
  (5, 'Investigo a fondo la lógica detrás, leo documentación técnica y busco cómo funciona por dentro.', '{"INVESTIGATIVE": 5, "TECH": 4, "LOGIC": 3}'::jsonb),
  (5, 'Pienso inmediatamente en qué oportunidad de negocio o servicio se puede crear.', '{"ENTERPRISING": 5, "TECH": 3}'::jsonb),
  (5, 'Reflexiono sobre el impacto ético y psicológico que tendrá en las relaciones humanas.', '{"SOCIAL": 5, "INVESTIGATIVE": 3}'::jsonb),
  (5, 'Analizo cómo afectará los marcos legales, regulaciones o derechos ciudadanos.', '{"INVESTIGATIVE": 4, "ENTERPRISING": 3, "CONVENTIONAL": 3}'::jsonb),

  -- Q6
  (6, 'Me gusta estructurar listas detalladas, presupuestos exactos y seguir métodos claros.', '{"CONVENTIONAL": 5, "LOGIC": 3}'::jsonb),
  (6, 'Prefiero experimentar con herramientas tecnológicas que optimicen mis tareas automáticamente.', '{"TECH": 5, "LOGIC": 3}'::jsonb),
  (6, 'Soy muy flexible y prefiero adaptarme según la inspiración del momento o la dinámica de grupo.', '{"ARTISTIC": 4, "SOCIAL": 3}'::jsonb),
  (6, 'Defino objetivos ambiciosos y me enfoco en liderar el avance hacia el resultado final.', '{"ENTERPRISING": 5, "CONVENTIONAL": 2}'::jsonb),

  -- Q7
  (7, 'Software, aplicaciones web modernas, inteligencia artificial y arquitecturas cloud.', '{"TECH": 5, "LOGIC": 4, "INVESTIGATIVE": 3}'::jsonb),
  (7, 'Paneles de control financiero, modelos de predicción económica y análisis de riesgo.', '{"LOGIC": 5, "ENTERPRISING": 4, "TECH": 3}'::jsonb),
  (7, 'Contenidos audiovisuales virales, animación y diseño de identidad visual de marcas.', '{"ARTISTIC": 5, "ENTERPRISING": 3}'::jsonb),
  (7, 'Plataformas de gestión de recursos humanos y herramientas de bienestar psicológico.', '{"SOCIAL": 4, "TECH": 3}'::jsonb),

  -- Q8
  (8, 'Construir tecnología confiable y segura que transforme industrias y simplifique la vida.', '{"TECH": 5, "LOGIC": 4}'::jsonb),
  (8, 'Orientar, acompañar y mejorar la salud mental y emocional de niños, jóvenes o adultos.', '{"SOCIAL": 5, "INVESTIGATIVE": 3}'::jsonb),
  (8, 'Generar empresas sólidas, crear puestos de trabajo y liderar el crecimiento del país.', '{"ENTERPRISING": 5, "CONVENTIONAL": 3}'::jsonb),
  (8, 'Defender la justicia, resolver controversias complejas y proteger los derechos fundamentales.', '{"INVESTIGATIVE": 4, "SOCIAL": 4, "ENTERPRISING": 3}'::jsonb)
ON CONFLICT DO NOTHING;

-- 12. REGLAS VOCACIONALES DE AFINIDAD (DIMENSIÓN -> CARRERA)
INSERT INTO vocational_rules (career_id, dimension, weight, min_score, max_score, explanation_template)
VALUES
  -- Ing. Software
  (1, 'TECH', 1.00, 10, 100, 'Tu alta afinidad tecnológica coincide con el diseño y construcción de sistemas de software avanzados en la UPC.'),
  (1, 'LOGIC', 0.85, 8, 100, 'Tu pensamiento analítico y estructurado te permitirá dominar algoritmos complejos y arquitectura de datos.'),
  -- Ing. Sistemas
  (2, 'TECH', 0.90, 8, 100, 'Tu interés en tecnología aplicada a procesos te posiciona idealmente para liderar la transformación digital empresarial.'),
  (2, 'ENTERPRISING', 0.80, 7, 100, 'Tu visión de negocio te permitirá alinear los sistemas informáticos con los objetivos estratégicos corporativos.'),
  -- Ciencias de la Computación
  (3, 'INVESTIGATIVE', 1.00, 10, 100, 'Tu perfil investigador te impulsa a comprender los fundamentos matemáticos y desarrollar algoritmos innovadores de IA.'),
  (3, 'LOGIC', 0.95, 9, 100, 'Tu rigurosidad lógica es esencial para resolver problemas complejos de computación científica.'),
  -- Administración
  (4, 'ENTERPRISING', 1.00, 10, 100, 'Tu liderazgo natural y visión estratégica encajan con la dirección de organizaciones competitivas en la UPC.'),
  (4, 'CONVENTIONAL', 0.70, 6, 100, 'Tu capacidad de orden y organización respalda la gestión eficiente de recursos y proyectos.'),
  -- Administración y Finanzas
  (6, 'LOGIC', 0.95, 9, 100, 'Tu afinidad por el análisis cuantitativo te permitirá destacar en finanzas corporativas y mercados de inversión.'),
  (6, 'ENTERPRISING', 0.85, 8, 100, 'Tu orientación al logro te prepara para liderar decisiones financieras de alto valor empresarial.'),
  -- Psicología
  (7, 'SOCIAL', 1.00, 10, 100, 'Tu profunda empatía y vocación de ayuda te conectan con la evaluación e intervención en el bienestar humano.'),
  (7, 'INVESTIGATIVE', 0.75, 7, 100, 'Tu curiosidad por el comportamiento complementa tu formación científica en diagnóstico psicológico.'),
  -- Comunicación y Publicidad
  (9, 'ARTISTIC', 1.00, 10, 100, 'Tu creatividad e imaginación son clave para diseñar campañas publicitarias transmedia y conceptos de marca memorables.'),
  (9, 'ENTERPRISING', 0.80, 7, 100, 'Tu capacidad persuasiva te permite negociar y conectar emocionalmente con audiencias masivas.')
ON CONFLICT DO NOTHING;

-- 13. CONOCIMIENTO ASISTENTE IA (GROUNDED KNOWLEDGE PARA CHATBOT)
INSERT INTO chat_knowledge (entity_type, entity_id, title, content, keywords, source_id)
VALUES
  ('CAMPUS', 1, 'Campus Monterrico UPC', 'El Campus Monterrico se ubica en Prolongación Primavera 2390, Santiago de Surco. Es la sede principal de la UPC, con laboratorios de computación de alto rendimiento, aulas interactivas, biblioteca central y centros de innovación para ingeniería y negocios.', ARRAY['monterrico', 'surco', 'campus', 'sede principal', 'laboratorios'], 3),
  ('CAMPUS', 2, 'Campus San Isidro UPC', 'El Campus San Isidro se ubica en Av. General Salaverry 2255, San Isidro. Se sitúa en el centro empresarial de Lima, especializado en programas de negocios, derecho, ingeniería y postgrado.', ARRAY['san isidro', 'salaverry', 'campus', 'centro financiero'], 3),
  ('CAMPUS', 3, 'Campus San Miguel UPC', 'El Campus San Miguel se encuentra en Av. La Marina 2810, San Miguel. Atiende a estudiantes de Lima Oeste y Callao, con moderna infraestructura deportiva, laboratorios de ingeniería y comunicaciones.', ARRAY['san miguel', 'la marina', 'campus', 'lima oeste'], 3),
  ('CAMPUS', 4, 'Campus Villa UPC', 'El Campus Villa está ubicado en Av. Alameda San Marcos, Chorrillos. Destaca por sus amplias áreas verdes, complejos deportivos, clínica universitaria y laboratorios biomédicos.', ARRAY['villa', 'chorrillos', 'campus', 'deportes', 'salud'], 3),
  ('TUITION', 1, 'Costos y Pensiones 2026 en UPC', 'Las pensiones en la UPC se estructuran en cuotas semestrales (5 cuotas por ciclo) y varían según la categoría socioeconómica asignada al postulante (T-U, T-V, T-W, etc.) y la carrera elegida. Por ejemplo, en Ingeniería de Software las cuotas referenciales 2026 inician desde aproximadamente S/ 1,980 en categorías accesibles. La pensión definitiva se determina durante el proceso de admisión.', ARRAY['pension', 'costo', 'precio', 'cuota', 'mensualidad', '2026'], 2),
  ('SCHOLARSHIP', 1, 'Beca 18 y Beca BCP en UPC', 'La UPC mantiene convenios con PRONABEC para Beca 18 (cobertura al 100% de matrícula, pensión completa, laptop y manutención) y con el Patronato BCP para carreras de ingeniería y tecnología. Los postulantes deben acreditar alto rendimiento académico escolar y superar los filtros socioeconómicos oficiales.', ARRAY['beca 18', 'beca bcp', 'pronabec', 'financiamiento', 'descuento'], 6),
  ('CAREER', 1, 'Acreditación ABET en Ingeniería de Software UPC', 'La carrera de Ingeniería de Software de la UPC cuenta con acreditación internacional ABET, lo que certifica que el programa cumple con los más altos estándares mundiales de calidad y facilita la convalidación profesional internacional.', ARRAY['abet', 'acreditacion', 'ingenieria de software', 'internacional', 'calidad'], 1)
ON CONFLICT DO NOTHING;

-- 14. COLEGIOS DE REFERENCIA PARA GEOLOCALIZACIÓN
INSERT INTO school_reference (name, address, district, city, latitude, longitude)
VALUES
  ('Colegio Mayor Secundario Presidente del Perú', 'Carretera Central Km 24.5', 'Chaclacayo', 'Lima', -11.9782000, -76.7643000),
  ('Colegio San Agustín', 'Av. Javier Prado Este 980', 'San Isidro', 'Lima', -12.0911000, -77.0223000),
  ('Colegio De la Inmaculada', 'Calle Hermano Santos García 108', 'Santiago de Surco', 'Lima', -12.1158000, -76.9721000),
  ('Colegio Claretiano', 'Calle Parque de las Leyendas 555', 'San Miguel', 'Lima', -12.0725000, -77.0864000),
  ('Colegio Villa María', 'Av. La Planicie 285', 'La Molina', 'Lima', -12.0833000, -76.9212000),
  ('Colegio Markham College', 'Calle Augusto Angulo 291', 'Miraflores', 'Lima', -12.1246000, -77.0163000)
ON CONFLICT DO NOTHING;
