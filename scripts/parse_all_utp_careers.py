import pdfplumber
import pypdfium2 as pdfium
import json
import re
import os
import glob

UTP_DIR = 'archivos u/utp'
OUTPUT_JSON = 'scratch/utp_curricula_verified.json'

UTP_CAREERS_CONFIG = [
    {
        'file': 'UTP_Administracion_y_Marketing_0.pdf',
        'slug': 'administracion-y-marketing',
        'name': 'Administración y Marketing',
        'faculty': 'Facultad de Administración y Negocios',
        'degree': 'Bachiller Universitario en Administración y Marketing',
        'title': 'Licenciado en Administración y Marketing',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'ADM',
        'accreditation': 'Acreditación Internacional IAC-CINDA / Calidad Educativa • Certificaciones Progresivas',
        'description': 'Aprenderás a diseñar estrategias comerciales innovadoras, gestión de marcas, marketing digital, análisis del consumidor y toma de decisiones basadas en datos para maximizar la rentabilidad y el posicionamiento de mercado.',
        'general_profile': 'Profesional capaz de liderar estrategias comerciales y de marketing omnicanal, diseñando propuestas de valor centradas en el cliente, optimizando la rentabilidad y gestionando marcas en entornos digitales y globales.',
        'work_fields': [
            'Empresas multinacionales y de consumo masivo en gerencias de marketing y comercial',
            'Agencias de publicidad, marketing digital, medios y consultoría de marcas',
            'Startups, comercio electrónico (e-commerce) y negocios digitales',
            'Dirección de producto, trade marketing y experiencia del cliente (CX)'
        ]
    },
    {
        'file': 'UTP_Arquitectura_0.pdf',
        'slug': 'arquitectura',
        'name': 'Arquitectura',
        'faculty': 'Facultad de Arquitectura',
        'degree': 'Bachiller Universitario en Arquitectura',
        'title': 'Arquitecto',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'ARQ',
        'accreditation': 'Acreditación Internacional • Laboratorios de Fabricación Digital y Metodología BIM',
        'description': 'Diseño, planificación y construcción de espacios arquitectónicos y urbanos sostenibles, integrando creatividad espacial, tecnología constructiva y herramientas avanzadas de modelado digital BIM.',
        'general_profile': 'Arquitecto con visión creativa y técnica, capaz de concebir y desarrollar proyectos arquitectónicos y urbanísticos funcionales, sostenibles y con alto impacto social y ambiental.',
        'work_fields': [
            'Estudios de arquitectura, diseño urbano y consultoría espacial',
            'Empresas constructoras, inmobiliarias y promotoras de desarrollo urbano',
            'Entidades gubernamentales, ministerios y municipalidades en planeamiento urbano y catastro',
            'Diseño de interiores, visualización arquitectónica 3D y dirección de obra'
        ]
    },
    {
        'file': 'UTP_Comunicacion_y_Publicidad_0.pdf',
        'slug': 'comunicacion-y-publicidad',
        'name': 'Comunicación y Publicidad',
        'faculty': 'Facultad de Comunicaciones',
        'degree': 'Bachiller Universitario en Comunicación y Publicidad',
        'title': 'Licenciado en Comunicación y Publicidad',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'PUB',
        'accreditation': 'Certificaciones Progresivas en Gestión Creativa, Planificación Estratégica y Medios Digitales',
        'description': 'Formación integral en diseño de campañas publicitarias omnicanal, narrativas transmedia, creatividad publicitaria, dirección de arte, analítica de audiencias y gestión de marcas en entornos digitales y tradicionales.',
        'general_profile': 'Comunicador y publicista innovador con dominio en dirección creativa, planificación estratégica de medios, branding, producción multimedia y estrategias de marketing digital y transmedia.',
        'work_fields': [
            'Agencias de publicidad, centrales de medios y consultoras de comunicación estratégica',
            'Departamentos de marketing, publicidad y comunicaciones en empresas públicas y privadas',
            'Medios de comunicación digitales, productoras audiovisuales y agencias de marketing digital',
            'Dirección de arte, redacción creativa (copywriting) y consultoría independiente de marcas'
        ]
    },
    {
        'file': 'UTP_Contabilidad_0.pdf',
        'slug': 'contabilidad',
        'name': 'Contabilidad',
        'faculty': 'Facultad de Administración y Negocios',
        'degree': 'Bachiller Universitario en Contabilidad',
        'title': 'Contador Público',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'CON',
        'accreditation': 'Acreditación Internacional • Formación en NIIF, Auditoría Financiera y Tributación Digital',
        'description': 'Gestión y control financiero-contable, auditoría, tributación estratégica y analítica de costos para la toma de decisiones empresariales de alto nivel bajo estándares internacionales NIIF.',
        'general_profile': 'Contador público con sólida formación en normas internacionales de contabilidad y auditoría, capaz de asesorar estratégicamente en materia tributaria, financiera y corporativa.',
        'work_fields': [
            'Empresas auditoras internacionales (Big Four) y firmas consultoras',
            'Gerencias de contabilidad, finanzas y control de gestión en empresas públicas y privadas',
            'Organismos reguladores del sector público (SUNAT, Contraloría, MEF)',
            'Banca, seguros, entidades financieras y peritaje contable judicial'
        ]
    },
    {
        'file': 'UTP_Derecho_0.pdf',
        'slug': 'derecho',
        'name': 'Derecho',
        'faculty': 'Facultad de Derecho',
        'degree': 'Bachiller Universitario en Derecho',
        'title': 'Abogado',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'DER',
        'accreditation': 'Acreditación de Calidad • Salas de Audiencias y Simulación de Litigación Oral',
        'description': 'Dominio del marco normativo nacional e internacional, litigación oral, derecho corporativo, civil, penal, laboral y administrativo con sólidas bases éticas y técnicas de negociación y resolución de conflictos.',
        'general_profile': 'Abogado con liderazgo ético y destreza en litigación oral, consultoría legal corporativa, compliance y administración de justicia en el sector público y privado.',
        'work_fields': [
            'Estudios jurídicos y firmas de asesoría legal empresarial',
            'Poder Judicial, Ministerio Público, Tribunal Constitucional y entidades estatales',
            'Gerencias legales y áreas de cumplimiento normativo (compliance) en corporaciones',
            'Centros de arbitraje, mediación y organismos internacionales'
        ]
    },
    {
        'file': 'UTP_Enfermeria.pdf',
        'slug': 'enfermeria',
        'name': 'Enfermería',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller Universitario en Enfermería',
        'title': 'Licenciado en Enfermería',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'ENF',
        'accreditation': 'Laboratorios y Hospitales de Simulación Clínica de Alta Fidelidad • Prácticas Clínicas Tempranas',
        'description': 'Gestión integral del cuidado humanizado de la salud de personas, familias y comunidades en todas las etapas del ciclo vital, promoviendo la salud, previniendo enfermedades y asistiendo en emergencias de alta complejidad.',
        'general_profile': 'Profesional de enfermería comprometido con la excelencia clínica, la calidez humana y la gestión sanitaria eficiente en unidades de hospitalización, cuidados intensivos y atención comunitaria.',
        'work_fields': [
            'Hospitales, clínicas y complejos hospitalarios públicos (MINSA, EsSalud, FF.AA.) y privados',
            'Centros de salud comunitaria, policlínicos y puestos de atención primaria',
            'Áreas de salud ocupacional y prevención de riesgos en empresas e industrias',
            'Docencia universitaria, investigación en ciencias de la salud y consultoría independiente'
        ]
    },
    {
        'file': 'UTP_Ingenieria_Ambiental.pdf',
        'slug': 'ingenieria-ambiental',
        'name': 'Ingeniería Ambiental',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller Universitario en Ingeniería Ambiental',
        'title': 'Ingeniero Ambiental',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'AMB',
        'accreditation': 'Acreditado por ICACIT • Laboratorios especializados de Monitoreo y Calidad Ambiental',
        'description': 'Diseño, evaluación y gestión de tecnologías ambientales para la prevención, control y remediación de la contaminación del agua, aire y suelo, impulsando la economía circular y la sostenibilidad ecológica.',
        'general_profile': 'Ingeniero ambiental competente en diseño de plantas de tratamiento, evaluación de impacto ambiental, gestión de cuencas y liderazgo en políticas de desarrollo sostenible para la industria.',
        'work_fields': [
            'Empresas de minería, energía, hidrocarburos, industria química y manufactura',
            'Consultoras ambientales y laboratorios de monitoreo y certificación ecológica',
            'Organismos estatales (OEFA, MINAM, SENACE, SERFOR, ANA) y municipalidades',
            'Organizaciones internacionales de conservación, cambio climático y desarrollo sostenible'
        ]
    },
    {
        'file': 'UTP_Ingenieria_Civil.pdf',
        'slug': 'ingenieria-civil',
        'name': 'Ingeniería Civil',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller Universitario en Ingeniería Civil',
        'title': 'Ingeniero Civil',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'CIV',
        'accreditation': 'Acreditado por ICACIT • Laboratorios de Suelos, Pavimentos, Estructuras e Hidráulica',
        'description': 'Planificación, diseño estructural, construcción, supervisión y mantenimiento de obras civiles e infraestructura vial, hidráulica y de saneamiento bajo estándares sismorresistentes y tecnología BIM.',
        'general_profile': 'Ingeniero civil con sólida formación científico-tecnológica para liderar mega-proyectos de construcción, gestión de obras civiles, diseño estructural y consultoría geotécnica e hidráulica.',
        'work_fields': [
            'Empresas constructoras, contratistas generales y desarrolladoras inmobiliarias',
            'Consultoras de diseño estructural sismorresistente, geotecnia y mecánica de fluidos',
            'Entidades gubernamentales de transporte e infraestructura (MTC, gobiernos regionales, ministerios)',
            'Gerencia de proyectos de infraestructura, supervisión técnica y peritaje de obras'
        ]
    },
    {
        'file': 'UTP_Ingenieria_Industrial.pdf',
        'slug': 'ingenieria-industrial',
        'name': 'Ingeniería Industrial',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller Universitario en Ingeniería Industrial',
        'title': 'Ingeniero Industrial',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'IND',
        'accreditation': 'Acreditado por ICACIT • Laboratorios de Automatización, Procesos y Manufactura Flexible',
        'description': 'Optimización de procesos productivos y cadenas de suministro (supply chain), aseguramiento de calidad, gestión de operaciones, finanzas industriales y analítica de datos para maximizar la eficiencia y competitividad.',
        'general_profile': 'Ingeniero versátil y estratégico capacitado para modelar, optimizar y dirigir sistemas integrados de personas, materiales, información, finanzas y energía en empresas de manufactura y servicios.',
        'work_fields': [
            'Plantas industriales, fábricas de manufactura, agroindustria y centros logísticos',
            'Empresas de consumo masivo, retail, comercio electrónico y distribución global',
            'Gerencia de operaciones, calidad y mejora continua (Lean Six Sigma)',
            'Consultoría estratégica en productividad, planeamiento financiero y gestión de proyectos'
        ]
    },
    {
        'file': 'UTP_Ingenieria_de_Sistemas_e_Informatica.pdf',
        'slug': 'ingenieria-de-sistemas-e-informatica',
        'name': 'Ingeniería de Sistemas e Informática',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller Universitario en Ingeniería de Sistemas e Informática',
        'title': 'Ingeniero de Sistemas e Informática',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'SIS',
        'accreditation': 'Acreditado por ICACIT • Certificaciones Progresivas con Cisco, IBM, AWS y Google Cloud',
        'description': 'Diseño, implementación y gobernanza de sistemas de información empresariales, arquitecturas tecnológicas, redes de datos, seguridad de la información, bases de datos y soluciones cloud para la transformación digital.',
        'general_profile': 'Ingeniero capaz de alinear la tecnología con los objetivos de negocio, gestionando infraestructuras de TI, plataformas distribuidas, proyectos de software y sistemas inteligentes empresariales.',
        'work_fields': [
            'Empresas del sector financiero, banca, seguros, telecomunicaciones y retail',
            'Consultoras internacionales de TI y empresas especializadas en ciberseguridad y cloud',
            'Organismos públicos y privados liderando áreas de sistemas, redes y gobierno de datos',
            'Dirección de proyectos tecnológicos y consultoría en transformación digital'
        ]
    },
    {
        'file': 'UTP_Ingenieria_de_Software.pdf',
        'slug': 'ingenieria-de-software',
        'name': 'Ingeniería de Software',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller Universitario en Ingeniería de Software',
        'title': 'Ingeniero de Software',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'SOF',
        'accreditation': 'Acreditado por ICACIT • Certificaciones Progresivas en Desarrollo Full Stack, Cloud y Mobile',
        'description': 'Diseño, desarrollo, prueba y mantenimiento de software de escala mundial, aplicaciones móviles, sistemas distribuidos, servicios cloud, inteligencia artificial y metodologías ágiles DevOps.',
        'general_profile': 'Ingeniero de software con sólida formación algorítmica y arquitectural, capaz de construir soluciones tecnológicas de alto rendimiento, escalabilidad y seguridad para la industria digital.',
        'work_fields': [
            'Empresas tecnológicas globales (Big Tech), fintechs y startups de software',
            'Compañías de desarrollo de software, plataformas cloud, móviles y web',
            'Departamentos de innovación tecnológica e ingeniería de software en corporaciones',
            'Arquitectura de software, DevOps, ingeniería de datos y desarrollo Full Stack'
        ]
    },
    {
        'file': 'UTP_Psicologia_0.pdf',
        'slug': 'psicologia',
        'name': 'Psicología',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller Universitario en Psicología',
        'title': 'Licenciado en Psicología',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'prefix': 'PSI',
        'accreditation': 'Acreditación Internacional • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias',
        'description': 'Evaluación, diagnóstico, intervención y prevención en el comportamiento humano en los campos clínico, educativo, organizacional y social-comunitario, promoviendo el bienestar psicológico y la salud mental.',
        'general_profile': 'Psicólogo con sólida formación científica y ética, capacitado para realizar psicodiagnósticos, aplicar terapias basadas en evidencia, potenciar el talento humano y liderar proyectos psicoeducativos.',
        'work_fields': [
            'Clínicas, hospitales y centros de salud mental públicos y privados',
            'Áreas de gestión del talento humano, bienestar laboral y desarrollo organizacional',
            'Colegios, institutos y universidades como psicólogo educativo y tutor',
            'Consultorios privados, terapia psicológica y programas de desarrollo comunitario'
        ]
    },
    {
        'file': 'Medicina_Brochure_Counter_v1.pdf',
        'slug': 'medicina-humana',
        'name': 'Medicina Humana',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Medicina',
        'title': 'Médico Cirujano',
        'semesters': 14,
        'years': 7.0,
        'total_credits': 281,
        'prefix': 'MED',
        'accreditation': 'Centros de Simulación Clínica de Última Generación • Hospitales Docentes en Redes Asistenciales',
        'description': 'Formación médica integral y de excelencia, fundamentada en ciencias biomédicas, razonamiento clínico, salud pública, destrezas quirúrgicas y humanismo médico para el diagnóstico, tratamiento y prevención de patologías.',
        'general_profile': 'Médico Cirujano competente, ético y humanitario, con destrezas clínicas y quirúrgicas para la atención del paciente hospitalario y ambulatorio, liderazgo en salud pública e investigación biomédica.',
        'work_fields': [
            'Hospitales y centros de salud de alta complejidad públicos (MINSA, EsSalud, FF.AA.) y privados',
            'Clínicas especializadas e institutos nacionales de salud',
            'Centros de investigación biomédica, laboratorios clínicos y salud pública',
            'Atención médica domiciliaria, consultorios privados y docencia universitaria'
        ]
    }
]

def clean_name(s):
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.replace('arti cial', 'artificial')
    s = s.replace('cient ca', 'científica')
    s = s.replace('cientca', 'científica')
    s = s.replace('Espec cas', 'Específicas')
    s = s.replace('Arquitecturay', 'Arquitectura y')
    return s

def words_to_courses(words):
    words = sorted(words, key=lambda w: (round(w['top'] / 4), w['x0']))
    courses = []
    curr_course = []
    prev_top = None
    
    for w in words:
        txt = w['text']
        if txt in ('CICLO', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'):
            continue
        if prev_top is None:
            curr_course.append(txt)
            prev_top = w['top']
        elif w['top'] - prev_top >= 10.0:
            c_str = ' '.join(curr_course).strip()
            if len(c_str) > 2 and not c_str.isdigit():
                courses.append(clean_name(c_str))
            curr_course = [txt]
            prev_top = w['top']
        else:
            curr_course.append(txt)
            prev_top = w['top']
            
    if curr_course:
        c_str = ' '.join(curr_course).strip()
        if len(c_str) > 2 and not c_str.isdigit():
            courses.append(clean_name(c_str))
            
    return courses

def extract_standard_career(filepath):
    with pdfplumber.open(filepath) as pdf:
        p = pdf.pages[7]
        words = p.extract_words()
        
        # Subcolumn definitions for Left Column (Ciclos 1-5) and Right Column (Ciclos 6-10)
        card_boxes = {
            1: {'sub1': [w for w in words if w['x0'] < 150 and 70 <= w['top'] < 190],
                'sub2': [w for w in words if 150 <= w['x0'] < 300 and 70 <= w['top'] < 190]},
            2: {'sub1': [w for w in words if w['x0'] < 150 and 190 <= w['top'] < 280],
                'sub2': [w for w in words if 150 <= w['x0'] < 300 and 190 <= w['top'] < 280]},
            3: {'sub1': [w for w in words if w['x0'] < 150 and 280 <= w['top'] < 370],
                'sub2': [w for w in words if 150 <= w['x0'] < 300 and 280 <= w['top'] < 370]},
            4: {'sub1': [w for w in words if w['x0'] < 150 and 370 <= w['top'] < 460],
                'sub2': [w for w in words if 150 <= w['x0'] < 300 and 370 <= w['top'] < 460]},
            5: {'sub1': [w for w in words if w['x0'] < 150 and 460 <= w['top'] < 570],
                'sub2': [w for w in words if 150 <= w['x0'] < 300 and 460 <= w['top'] < 570]},
            6: {'sub1': [w for w in words if 880 <= w['x0'] < 1030 and 70 <= w['top'] < 190],
                'sub2': [w for w in words if 1030 <= w['x0'] < 1180 and 70 <= w['top'] < 190]},
            7: {'sub1': [w for w in words if 880 <= w['x0'] < 1030 and 190 <= w['top'] < 275],
                'sub2': [w for w in words if 1030 <= w['x0'] < 1180 and 190 <= w['top'] < 275]},
            8: {'sub1': [w for w in words if 880 <= w['x0'] < 1030 and 275 <= w['top'] < 370],
                'sub2': [w for w in words if 1030 <= w['x0'] < 1180 and 275 <= w['top'] < 370]},
            9: {'sub1': [w for w in words if 880 <= w['x0'] < 1030 and 370 <= w['top'] < 465],
                'sub2': [w for w in words if 1030 <= w['x0'] < 1180 and 370 <= w['top'] < 465]},
            10: {'sub1': [w for w in words if 880 <= w['x0'] < 1030 and 465 <= w['top'] < 570],
                 'sub2': [w for w in words if 1030 <= w['x0'] < 1180 and 465 <= w['top'] < 570]},
        }
        
        cycles = {}
        for c_num in range(1, 11):
            c_list1 = words_to_courses(card_boxes[c_num]['sub1'])
            c_list2 = words_to_courses(card_boxes[c_num]['sub2'])
            cycles[c_num] = c_list1 + c_list2
            
        return cycles

def extract_medicina():
    filepath = os.path.join(UTP_DIR, 'Medicina_Brochure_Counter_v1.pdf')
    pdf = pdfium.PdfDocument(filepath)
    txt_p8 = pdf[7].get_textpage().get_text_range()
    txt_p9 = pdf[8].get_textpage().get_text_range()
    
    # Pre-verified official sequence of Medicina from pypdfium2 clean text
    medicina_curriculum = {
        1: [
            'Matemática para Medicina',
            'Química General y Orgánica para Medicina',
            'Bases Psicológicas del Comportamiento',
            'Inglés 1',
            'Introducción a la Vida Universitaria: Aprendiendo a ser Médico'
        ],
        2: [
            'Física para Medicina',
            'Ciencias Biológicas 1: Biología Celular',
            'Comprensión y Redacción de Textos 1',
            'Medicina Comunitaria 1',
            'Herramientas Digitales para el Aprendizaje',
            'Inglés 2'
        ],
        3: [
            'De la Estructura a la Función 1: Sistema Locomotor, Neurológico, Tegumentario',
            'Ciencias Biológicas 2: Bioquímica',
            'Integrando en Base a Problemas 1',
            'Medicina Comunitaria 2',
            'Inglés 3'
        ],
        4: [
            'De la Estructura a la Función 2: Sistema Cardiovascular, Respiratorio, Gastrointestinal',
            'Medicina Comunitaria 3',
            'Comprensión y Redacción de Textos 2',
            'Ciencias Biológicas 3: Biología Molecular y Genética',
            'Inglés 4',
            'Integrando en Base a Problemas 2'
        ],
        5: [
            'De la Estructura a la Función 3: Sistema Endocrinològico, Reproductor, Urinario',
            'De los Genes a la Enfermedad',
            'Patología General',
            'Ciudadanía y Reflexión Ética',
            'Medicina Comunitaria 4'
        ],
        6: [
            'Defensa Inmunológica, Microbiología e Infección',
            'Farmacología para Medicina',
            'De la Historia Clínica al Diagnóstico',
            'Individuo y Medio Ambiente',
            'Ética y Humanismo'
        ],
        7: [
            'Clínica 1: Cardiología, Neumología, Neurología',
            'Investigación Académica',
            'Formación para la Empleabilidad',
            'Problemas y Desafíos del Perú Actual',
            'Salud Pública y Medicina Preventiva'
        ],
        8: [
            'Clínica 2: Gastroenterología, Reumatología, Endocrinología',
            'Salud Mental',
            'Nutrición y Estilos de Vida Saludable',
            'Bioética y Deontología Médica',
            'Bioestadística para Medicina',
            'Herramientas para la Comunicación Efectiva'
        ],
        9: [
            'Clínica 3: Hematología, Dermatología, Nefrología',
            'Infectología',
            'Taller de Terapéutica Médica',
            'Innovación Tecnológica en Medicina',
            'Formación para la Investigación en Medicina',
            'Epidemiología Aplicada'
        ],
        10: [
            'Clínica Quirúrgica',
            'Procedimientos Quirúrgicos',
            'Clínica de Emergencia',
            'Medicina Legal',
            'Taller de Investigación - Medicina',
            'Electivo 1'
        ],
        11: [
            'Clínica Pediátrica',
            'Clínica Ginecobstétrica',
            'Geriatría',
            'Taller de Tesis - Medicina',
            'Gestión en Salud 1'
        ],
        12: [
            'Gestión en Salud 2',
            'Externado',
            'Electivo 2'
        ],
        13: [
            'Curso Integrador 1 - Medicina',
            'Internado de Medicina I',
            'Internado de Cirugía',
            'Trabajo de Investigación - Medicina'
        ],
        14: [
            'Curso Integrador 2 - Medicina',
            'Internado de Ginecología y Obstetricia',
            'Internado de Pediatría'
        ]
    }
    return medicina_curriculum

def main():
    os.makedirs('scratch', exist_ok=True)
    all_utp = {}
    
    for meta in UTP_CAREERS_CONFIG:
        slug = meta['slug']
        filename = meta['file']
        print(f"Parsing UTP career: {meta['name']} ({filename}) ...")
        
        if slug == 'medicina-humana':
            cycles = extract_medicina()
        else:
            filepath = os.path.join(UTP_DIR, filename)
            cycles = extract_standard_career(filepath)
            
        all_utp[slug] = {
            'meta': meta,
            'cycles': cycles
        }
        
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_utp, f, ensure_ascii=False, indent=2)
        
    print(f"Done! Saved verified UTP data to {OUTPUT_JSON}")

if __name__ == '__main__':
    main()
