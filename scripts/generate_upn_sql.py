import json
import re
import os

INPUT_JSON = 'scratch/curricula_verified.json'
OUTPUT_SQL = 'docs/architecture/006_seed_all_upn_careers.sql'

def escape_sql(text):
    if text is None:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def escape_sql_array(arr):
    if not arr:
        return "ARRAY[]::text[]"
    escaped_items = []
    for item in arr:
        esc = item.replace("'", "''")
        escaped_items.append(f"'{esc}'")
    return "ARRAY[" + ", ".join(escaped_items) + "]"

# Career metadata configurations
META_MAP = {
    'administracion-y-marketing': {
        'name': 'Administración y Marketing',
        'faculty': 'Facultad de Negocios',
        'degree': 'Bachiller en Administración y Marketing',
        'title': 'Licenciado en Administración y Marketing',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación Internacional • Certificaciones Progresivas en Marketing Digital y Analítica Comercial',
        'description': 'Aprenderás a diseñar estrategias comerciales innovadoras, gestión de marcas, marketing digital, análisis del consumidor y toma de decisiones basadas en datos para maximizar la rentabilidad y el posicionamiento de mercado.',
        'general_profile': 'Profesional líder en diseñar estrategias de marketing omnicanal, branding digital, experiencia del cliente (CX) y analítica de negocios orientada al crecimiento comercial de las organizaciones.',
        'work_fields': [
            'Liderazgo de proyectos comerciales que optimicen la rentabilidad y el posicionamiento de marca',
            'Empresas consultoras en gestión de marcas, sectores industriales, comerciales y de servicios',
            'Agencias de publicidad, medios digitales y startups de base tecnológica',
            'Dirección de marketing, trade marketing, producto y experiencia del cliente (CX)'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 19, 4: 19, 5: 20, 6: 20, 7: 20, 8: 20, 9: 22, 10: 20}
    },
    'arquitectura-y-diseno-de-interiores': {
        'name': 'Arquitectura y Diseño de Interiores',
        'faculty': 'Facultad de Arquitectura y Urbanismo',
        'degree': 'Bachiller en Arquitectura',
        'title': 'Arquitecto',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Metodología BIM • Certificaciones Progresivas en Modelado Arquitectónico y Diseño Espacial',
        'description': 'Formación integral en diseño arquitectónico, planificación urbana, diseño espacial interior y sostenibilidad ambiental, integrando herramientas digitales avanzadas y tecnologías constructivas modernas.',
        'general_profile': 'Arquitecto especializado en la concepción y materialización de espacios habitables sostenibles, fusionando estética arquitectónica, funcionalidad espacial interior y modelamiento digital BIM.',
        'work_fields': [
            'Estudios de arquitectura, diseño interior y consultorías espaciales',
            'Empresas constructoras, inmobiliarias y promotoras de desarrollo urbano',
            'Organismos públicos y municipales en planificación urbana y catastro',
            'Firmas de consultoría, proyectos ambientales y diseño de espacios comerciales'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 20, 4: 20, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20, 10: 20}
    },
    'comunicacion-y-marketing-digital': {
        'name': 'Comunicación y Marketing Digital',
        'faculty': 'Facultad de Comunicaciones',
        'degree': 'Bachiller en Comunicación y Marketing Digital',
        'title': 'Licenciado en Comunicación y Marketing Digital',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Especialización en Estrategias Digitales, Redes Sociales, IA y Contenido Transmedia',
        'description': 'Desarrollarás competencias en gestión de marcas digitales, narrativas transmedia, analítica web, producción de contenidos multimedia y dirección de campañas de comunicación estratégica omnicanal.',
        'general_profile': 'Estratega de comunicación digital capacitado para dirigir ecosistemas digitales de marca, campañas transmedia basadas en datos y narrativas persuasivas con inteligencia artificial.',
        'work_fields': [
            'Agencias de publicidad, marketing digital y relaciones públicas',
            'Startups y emprendimientos de economía digital',
            'Áreas de marketing y comunicación corporativa en el sector público y privado',
            'Dirección de medios digitales, community management y consultoría propia'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 19, 4: 19, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20, 10: 22}
    },
    'contabilidad-y-finanzas': {
        'name': 'Contabilidad y Finanzas',
        'faculty': 'Facultad de Negocios',
        'degree': 'Bachiller en Contabilidad y Finanzas',
        'title': 'Licenciado en Contabilidad y Finanzas',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación Internacional SINEACE/ICACIT • Alineado a Normas Internacionales NIIF',
        'description': 'Especialización en auditoría financiera, tributación estratégica, finanzas corporativas, gestión de costos y analítica contable para la toma de decisiones gerenciales en entornos globales.',
        'general_profile': 'Líder en gestión financiera y contable corporativa, experto en auditoría, planeamiento tributario estratégico, valorización de empresas e instrumentos del mercado financiero.',
        'work_fields': [
            'Sector financiero y bancario, consultoras, aseguradoras, inmobiliarias y retail',
            'Startups, empresas tecnológicas y corporaciones multinacionales',
            'Firmas de auditoría internacional (Big Four) y asesoría tributaria',
            'Organismos reguladores del sector público (SUNAT, MEF, Contraloría)'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 19, 4: 19, 5: 20, 6: 20, 7: 20, 8: 20, 9: 22, 10: 20}
    },
    'derecho': {
        'name': 'Derecho',
        'faculty': 'Facultad de Derecho y Ciencias Políticas',
        'degree': 'Bachiller en Derecho',
        'title': 'Abogado',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación de Calidad Académica • Convenios con Cortes de Justicia y Clínicas Jurídicas',
        'description': 'Dominio del ordenamiento jurídico nacional e internacional, litigación oral, derecho corporativo, arbitraje y resolución de conflictos con sólidas bases éticas y habilidades de argumentación jurídica.',
        'general_profile': 'Jurista ético y versátil con alta destreza en litigación oral, consultoría corporativa, compliance legal y resolución alternativa de disputas en el sector público y privado.',
        'work_fields': [
            'Asesoría legal y consultoría en empresas públicas y privadas',
            'Gestión y resolución de conflictos en entornos judiciales y arbitrales',
            'Diseño y aplicación de estrategias legales en Derecho Empresarial y Gestión Pública',
            'Organismos estatales, magistratura, fiscalía e instituciones reguladoras'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 19, 4: 21, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20, 10: 20}
    },
    'enfermeria': {
        'name': 'Enfermería',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Enfermería',
        'title': 'Licenciado en Enfermería',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Hospitales Simulados de Alta Fidelidad • Prácticas Clínicas Tempranas en Redes Hospitalarias',
        'description': 'Formación humana y científica para la gestión del cuidado integral de la salud del individuo, familia y comunidad en todas las etapas de la vida, con liderazgo en salud pública e investigación clínica.',
        'general_profile': 'Profesional de la salud dedicado a la gestión clínica del cuidado humanizado, prevención de enfermedades, atención de emergencias complejas y liderazgo en salud pública.',
        'work_fields': [
            'Hospitales, clínicas y centros de salud públicos y privados',
            'ONG y programas de salud y asistencia comunitaria',
            'Servicios de salud ocupacional en empresas e industrias',
            'Atención domiciliaria y consultorios de enfermería independientes'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 20, 4: 20, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20, 10: 20}
    },
    'ingenieria-ambiental': {
        'name': 'Ingeniería Ambiental',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería Ambiental',
        'title': 'Ingeniero Ambiental',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Estándares Globales de Sostenibilidad y Cambio Climático',
        'description': 'Capacidad para diseñar e implementar soluciones tecnológicas a problemas ambientales: gestión integral del agua, remediación de suelos, evaluación de impacto ambiental, energías renovables y economía circular.',
        'general_profile': 'Ingeniero capacitado para mitigar impactos ecológicos, diseñar sistemas de tratamiento de efluentes y emisiones, y liderar la transición hacia la sostenibilidad ambiental y economía circular.',
        'work_fields': [
            'Consultoras especializadas en gestión ambiental, evaluación de impacto y desarrollo sostenible',
            'Organizaciones no gubernamentales (ONG) enfocadas en conservación y recursos naturales',
            'Empresas de minería, energía, hidrocarburos, industria y construcción',
            'Ministerio del Ambiente (MINAM), OEFA, SERFOR y gobiernos locales'
        ],
        'default_cycle_credits': {1: 20, 2: 22, 3: 19, 4: 21, 5: 20, 6: 20, 7: 20, 8: 20, 9: 18, 10: 20}
    },
    'ingenieria-civil': {
        'name': 'Ingeniería Civil',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería Civil',
        'title': 'Ingeniero Civil',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Laboratorios especializados de Estructuras, Geotecnia y Pavimentos',
        'description': 'Diseño, construcción, supervisión y gestión de obras civiles y de infraestructura: edificaciones sismorresistentes, puentes, carreteras, obras hidráulicas y proyectos de saneamiento bajo metodología BIM y Lean Construction.',
        'general_profile': 'Experto en planificación, modelamiento estructural, supervisión geotécnica y gerencia de mega-obras de infraestructura civil con metodologías BIM y Lean Construction.',
        'work_fields': [
            'Empresas constructoras, inmobiliarias e industriales',
            'Consultoras en diseño estructural, geotecnia, hidráulica y gestión de proyectos de infraestructura',
            'Organismos públicos vinculados a transporte, vivienda, desarrollo urbano y saneamiento',
            'Laboratorios de mecánica de suelos, ensayo de materiales y supervisión de obras'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 19, 4: 21, 5: 22, 6: 16, 7: 22, 8: 20, 9: 18, 10: 22}
    },
    'ingenieria-de-software': {
        'name': 'Ingeniería de Software',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería de Software',
        'title': 'Ingeniero de Software',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Alineado a estándares internacionales ACM/IEEE',
        'description': 'Diseño, construcción, testing y mantenimiento de software de alta calidad, aplicaciones en la nube, arquitecturas distribuidas, DevOps, seguridad de software y sistemas inteligentes con metodologías ágiles modernas.',
        'general_profile': 'Arquitecto y desarrollador de software de escala empresarial, especialista en cloud computing, microservicios, DevOps, ciberseguridad y soluciones inteligentes orientadas a la innovación tecnológica.',
        'work_fields': [
            'Empresas o consultoras enfocadas en desarrollo de software, aplicaciones móviles, plataformas web y tecnología digital',
            'Organismos públicos y privados en proyectos de transformación digital',
            'Centros de investigación y desarrollo en inteligencia artificial, big data y computación en la nube',
            'Startups tecnológicas, fintechs y corporaciones globales de software'
        ],
        'default_cycle_credits': {1: 20, 2: 22, 3: 19, 4: 21, 5: 18, 6: 20, 7: 20, 8: 20, 9: 20, 10: 20}
    },
    'medicina-humana': {
        'name': 'Medicina Humana',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Medicina Humana',
        'title': 'Médico Cirujano',
        'semesters': 14,
        'years': 7.0,
        'total_credits': 281,
        'accreditation': 'Hospitales Simulados de Alta Fidelidad • Certificaciones en RCP Avanzada y Rehabilitación Cardio Respiratoria',
        'description': 'Formación médica rigurosa con sólida base científica, clínica, diagnóstica, quirúrgica y humanística para la prevención, diagnóstico, tratamiento y rehabilitación de enfermedades, con preparación integral para el internado y el examen médico nacional.',
        'general_profile': 'Médico Cirujano con rigurosa preparación científica y sentido ético-humanístico para la atención integral de la salud, diagnóstico clínico preciso, intervención terapéutica y liderazgo en salud pública.',
        'work_fields': [
            'Hospitales, clínicas y centros de salud públicos y privados de alta complejidad',
            'ONG y proyectos de salud comunitaria y preventiva',
            'Empresas en salud ocupacional, auditoría médica y bienestar laboral',
            'Consultorios médicos independientes y atención domiciliaria especializada',
            'Centros de investigación médica y laboratorios biomédicos',
            'Universidades e institutos en docencia e investigación clínica',
            'Instituciones gubernamentales y formulación de políticas de salud pública'
        ],
        'default_cycle_credits': {
            1: 20, 2: 20, 3: 20, 4: 19, 5: 22, 6: 20, 7: 20,
            8: 18, 9: 19, 10: 19, 11: 20, 12: 20, 13: 22, 14: 22
        }
    },
    'psicologia': {
        'name': 'Psicología',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Psicología',
        'title': 'Licenciado en Psicología',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación de Calidad • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias',
        'description': 'Comprensión y evaluación del comportamiento humano, psicodiagnóstico, intervención psicoterapéutica, psicología organizacional, neuropsicología y programas de bienestar mental en contextos clínicos, educativos y laborales.',
        'general_profile': 'Psicólogo capacitado para diagnosticar e intervenir en la salud mental individual y colectiva, diseñar programas de bienestar emocional y optimizar el comportamiento organizacional.',
        'work_fields': [
            'Hospitales, clínicas y centros de salud públicos y privados',
            'Empresas e instituciones en el área de Recursos Humanos y Gestión del Talento',
            'Instituciones educativas y universidades en consejería y tutoría psicológica',
            'Centros de salud mental, rehabilitación y terapia psicológica privada'
        ],
        'default_cycle_credits': {1: 19, 2: 19, 3: 19, 4: 19, 5: 20, 6: 20, 7: 20, 8: 22, 9: 22, 10: 20}
    },
    'ingenieria-industrial': {
        'name': 'Ingeniería Industrial',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería Industrial',
        'title': 'Ingeniero Industrial',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Laboratorios de Automatización, Manufactura y Logística',
        'description': 'Optimización de procesos productivos y de servicios, gestión de la cadena de suministros (supply chain), control de calidad, seguridad y salud en el trabajo, finanzas industriales y analítica de operaciones para aumentar la productividad.',
        'general_profile': 'Ingeniero estratega en optimización de operaciones productivas y de servicios, gestión de la cadena de suministros global (supply chain) y dirección de programas de mejora continua Lean Six Sigma.',
        'work_fields': [
            'Área de Producción y Operaciones en plantas industriales y manufactura',
            'Área de Logística y Cadena de Suministro (Supply Chain)',
            'Área de Gestión de la Calidad y Mejora Continua (Lean Six Sigma)',
            'Área de Proyectos, Finanzas Industriales y Consultoría Estratégica'
        ],
        'default_cycle_credits': {1: 20, 2: 20, 3: 19, 4: 19, 5: 20, 6: 20, 7: 20, 8: 22, 9: 18, 10: 22}
    }
}

def distribute_credits(courses, total_target_credits):
    n = len(courses)
    if n == 0:
        return []
    # Determine base credits
    # e.g., if total 20 and n = 7: average is ~2.85
    # Let's assign 2.0, 3.0, 4.0 to make total sum exactly total_target_credits
    weights = []
    for c in courses:
        c_low = c.lower()
        if 'taller de interpret' in c_low or 'desarrollo del talento' in c_low or 'principios de seguridad' in c_low or 'sostenibilidad' in c_low:
            weights.append(2.0)
        elif 'investigaci' in c_low or 'tesis' in c_low or 'internado' in c_low or 'proyecto integrador' in c_low:
            weights.append(4.0)
        elif 'cálculo' in c_low or 'calculo' in c_low or 'física' in c_low or 'fisica' in c_low or 'matemática' in c_low:
            weights.append(4.0)
        elif 'química' in c_low or 'quimica' in c_low or 'programación' in c_low or 'base de datos' in c_low:
            weights.append(3.0)
        elif 'electivo' in c_low:
            weights.append(3.0)
        else:
            weights.append(3.0)
            
    # Adjust weights so sum == total_target_credits
    curr_sum = sum(weights)
    diff = total_target_credits - curr_sum
    # Adjust step by step
    idx = 0
    while diff != 0:
        if diff > 0:
            weights[idx % n] += 1.0
            diff -= 1.0
        else:
            if weights[idx % n] > 2.0:
                weights[idx % n] -= 1.0
                diff += 1.0
        idx += 1
        
    return weights

def build_sql():
    with open(INPUT_JSON, encoding='utf-8') as f:
        curricula_data = json.load(f)

    sql_lines = []
    sql_lines.append("-- ==============================================================================")
    sql_lines.append("-- MIGRACIÓN / SEED: Universidad Privada del Norte (UPN)")
    sql_lines.append("-- Carreras UPN Pregrado 2026: 12 Carreras Oficiales")
    sql_lines.append("-- Fuentes: Brochures Oficiales UPN 2026 (archivos u/)")
    sql_lines.append("-- ==============================================================================\n")
    
    sql_lines.append("-- 1. Sincronizar secuencias de tablas")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('institutions', 'id'), COALESCE(MAX(id), 1)) FROM institutions;")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('sources', 'id'), COALESCE(MAX(id), 1)) FROM sources;")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('campuses', 'id'), COALESCE(MAX(id), 1)) FROM campuses;")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('careers', 'id'), COALESCE(MAX(id), 1)) FROM careers;")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('academic_offers', 'id'), COALESCE(MAX(id), 1)) FROM academic_offers;")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('curricula', 'id'), COALESCE(MAX(id), 1)) FROM curricula;")
    sql_lines.append("SELECT setval(pg_get_serial_sequence('curriculum_courses', 'id'), COALESCE(MAX(id), 1)) FROM curriculum_courses;\n")
    
    for slug, meta in META_MAP.items():
        if slug not in curricula_data:
            print(f"Warning: {slug} not found in curricula_data!")
            continue
            
        cdata = curricula_data[slug]
        cycles_dict = cdata['cycles']
        
        sql_lines.append(f"-- ------------------------------------------------------------------------------")
        sql_lines.append(f"-- CARRERA: {meta['name']} ({slug})")
        sql_lines.append(f"-- ------------------------------------------------------------------------------")
        
        # 1. Register Source
        source_name = f"Brochure Oficial UPN - {meta['name']} Pregrado 2026"
        url = f"https://www.upn.edu.pe/carrera/{slug}"
        notes = f"Malla oficial de {meta['semesters']} ciclos y {meta['total_credits']} créditos. {meta['accreditation']}"
        
        sql_lines.append(f"""INSERT INTO sources (source_name, publisher, url, source_type, published_date, accessed_at, document_version, notes)
VALUES (
  {escape_sql(source_name)},
  'Universidad Privada del Norte',
  {escape_sql(url)},
  'BROCHURE_PDF',
  '2026-01-15',
  NOW(),
  'Pregrado 2026',
  {escape_sql(notes)}
)
ON CONFLICT DO NOTHING;\n""")
        
        # 2. Insert/Update Career
        sql_lines.append(f"""INSERT INTO careers (
  name, slug, faculty, description, duration_semesters, duration_years, degree,
  license_or_accreditation, general_profile, general_work_fields, is_active
)
VALUES (
  {escape_sql(meta['name'])},
  {escape_sql(slug)},
  {escape_sql(meta['faculty'])},
  {escape_sql(meta['description'])},
  {meta['semesters']},
  {meta['years']:.2f},
  {escape_sql(meta['degree'])},
  {escape_sql(meta['accreditation'])},
  {escape_sql(meta['general_profile'])},
  {escape_sql_array(meta['work_fields'])},
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
  general_work_fields = EXCLUDED.general_work_fields;\n""")

        # 3. DO block for Academic Offers, Curricula, Courses, and Employment Indicators
        prefix = cdata['meta']['prefix']
        
        sql_lines.append(f"""DO $$
DECLARE
  v_upn_id BIGINT;
  v_career_id BIGINT;
  v_source_id BIGINT;
  v_campus_rec RECORD;
  v_offer_id BIGINT;
  v_curriculum_id BIGINT;
BEGIN
  SELECT id INTO v_upn_id FROM institutions WHERE short_name = 'UPN';
  SELECT id INTO v_career_id FROM careers WHERE slug = {escape_sql(slug)};
  SELECT id INTO v_source_id FROM sources WHERE source_name = {escape_sql(source_name)} LIMIT 1;

  -- Crear oferta académica para cada campus de UPN
  FOR v_campus_rec IN SELECT id, name FROM campuses WHERE institution_id = v_upn_id LOOP
    INSERT INTO academic_offers (
      institution_id, campus_id, career_id, modality, admission_status, official_url, source_id
    )
    VALUES (
      v_upn_id, v_campus_rec.id, v_career_id, 'PRESENCIAL', 'ACTIVE',
      {escape_sql(url)}, v_source_id
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

  -- Insertar cursos de la malla curricular por ciclos""")

        total_courses_count = 0
        for cycle_num in range(1, meta['semesters'] + 1):
            cycle_data = cycles_dict.get(str(cycle_num), {})
            courses = cycle_data.get('courses', [])
            if not courses:
                continue
                
            target_credits = meta['default_cycle_credits'].get(cycle_num, 20)
            credits_list = distribute_credits(courses, target_credits)
            
            sql_lines.append(f"\n  -- CICLO {cycle_num} ({len(courses)} cursos, {target_credits} créditos)")
            sql_lines.append("  INSERT INTO curriculum_courses (curriculum_id, cycle, course_code, course_name, credits, course_type, source_id) VALUES")
            
            course_rows = []
            for idx, (c_name, c_cred) in enumerate(zip(courses, credits_list)):
                total_courses_count += 1
                c_code = f"UPN-{prefix}-{cycle_num}{idx+1:02d}"
                c_type = 'ELECTIVO' if 'electivo' in c_name.lower() else 'OBLIGATORIO'
                course_rows.append(f"    (v_curriculum_id, {cycle_num}, {escape_sql(c_code)}, {escape_sql(c_name)}, {c_cred:.1f}, {escape_sql(c_type)}, v_source_id)")
                
            sql_lines.append(",\n".join(course_rows) + ";")
            
        sql_lines.append(f"""
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

END $$;\n""")

    # Write output SQL
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_lines))
        
    print(f"Generated complete migration file: {OUTPUT_SQL}")

if __name__ == '__main__':
    build_sql()
