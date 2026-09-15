import pdfplumber
import json
import os
import re

PDF_DIR = 'archivos u'

CAREER_CONFIGS = [
    {
        'file': 'ug-administracion-y-marketing_compressed.pdf',
        'slug': 'administracion-y-marketing',
        'default_name': 'Administración y Marketing',
        'faculty': 'Facultad de Negocios',
        'curricula_pages': [5, 6], # 0-indexed -> pages 6, 7
        'degree': 'Bachiller en Administración y Marketing',
        'title': 'Licenciado en Administración y Marketing',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación Internacional • Certificaciones Progresivas en Marketing Digital y Analítica Comercial',
        'description': 'Aprenderás a diseñar estrategias comerciales innovadoras, gestión de marcas, marketing digital, análisis del consumidor y toma de decisiones basadas en datos para maximizar la rentabilidad y el posicionamiento de mercado.',
        'work_fields': [
            'Agencias de marketing, publicidad y medios digitales',
            'Empresas multinacionales y de consumo masivo',
            'Áreas de planeamiento estratégico, producto y desarrollo comercial',
            'Emprendimientos propios y consultoría estratégica de negocios'
        ]
    },
    {
        'file': 'ug-arquitectura-y-diseno-de-interiores.pdf',
        'slug': 'arquitectura-y-diseno-de-interiores',
        'default_name': 'Arquitectura y Diseño de Interiores',
        'faculty': 'Facultad de Arquitectura y Urbanismo',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Arquitectura',
        'title': 'Arquitecto',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Enfoque en Sostenibilidad y Tecnologías BIM • Acreditación de Calidad',
        'description': 'Formación integral en diseño arquitectónico, planificación urbana, diseño espacial interior y sostenibilidad ambiental, integrando herramientas digitales avanzadas y tecnologías constructivas modernas.',
        'work_fields': [
            'Estudios de arquitectura, diseño interior y consultorías espaciales',
            'Empresas constructoras, inmobiliarias y promotoras de desarrollo urbano',
            'Gestión pública en planificación urbana, catastro y patrimonio cultural',
            'Diseño de espacios comerciales, hotelería y visual merchandising'
        ]
    },
    {
        'file': 'ug-comunicacion-y-marketing-digital.pdf',
        'slug': 'comunicacion-y-marketing-digital',
        'default_name': 'Comunicación y Marketing Digital',
        'faculty': 'Facultad de Comunicaciones',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Comunicación y Marketing Digital',
        'title': 'Licenciado en Comunicación y Marketing Digital',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Especialización en Estrategias Digitales, Redes Sociales y Contenido Transmedia',
        'description': 'Desarrollarás competencias en gestión de marcas digitales, narrativas transmedia, analítica web, producción de contenidos multimedia y dirección de campañas de comunicación estratégica omnicanal.',
        'work_fields': [
            'Agencias de publicidad, marketing digital y relaciones públicas',
            'Departamentos de comunicación corporativa y branding empresarial',
            'Medios digitales de comunicación, streaming y generación de contenidos',
            'Dirección de community management y estrategias de influenciadores'
        ]
    },
    {
        'file': 'ug-contabilidad-y-finanzas.pdf',
        'slug': 'contabilidad-y-finanzas',
        'default_name': 'Contabilidad y Finanzas',
        'faculty': 'Facultad de Negocios',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Contabilidad y Finanzas',
        'title': 'Licenciado en Contabilidad y Finanzas',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación Internacional SINEACE/ICACIT • Alineado a Normas Internacionales de Información Financiera (NIIF)',
        'description': 'Especialización en auditoría financiera, tributación estratégica, finanzas corporativas, gestión de costos y analítica contable para la toma de decisiones gerenciales en entornos globales.',
        'work_fields': [
            'Empresas de auditoría internacional (Big Four) y firmas consultoras',
            'Gerencias de finanzas, contabilidad y tesorería en corporaciones',
            'Entidades bancarias, fondos de inversión y mercado de valores',
            'Organismos reguladores del sector público (SUNAT, MEF, Contraloría)'
        ]
    },
    {
        'file': 'ug-derecho.pdf',
        'slug': 'derecho',
        'default_name': 'Derecho',
        'faculty': 'Facultad de Derecho y Ciencias Políticas',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Derecho',
        'title': 'Abogado',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación de Calidad Académica • Convenios con Cortes de Justicia y Clínicas Jurídicas',
        'description': 'Dominio del ordenamiento jurídico nacional e internacional, litigación oral, derecho corporativo, arbitraje y resolución de conflictos con sólidas bases éticas y habilidades de argumentación jurídica.',
        'work_fields': [
            'Estudios jurídicos y firmas de asesoría legal corporativa',
            'Poder Judicial, Ministerio Público y entidades del Estado',
            'Departamentos legales de empresas privadas e instituciones financieras',
            'Organizaciones no gubernamentales y organismos de derechos humanos'
        ]
    },
    {
        'file': 'ug-enfermeria.pdf',
        'slug': 'enfermeria',
        'default_name': 'Enfermería',
        'faculty': 'Facultad de Ciencias de la Salud',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Enfermería',
        'title': 'Licenciado en Enfermería',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Centros de Simulación Clínica de Alta Fidelidad • Prácticas Clínicas Tempranas en Redes Hospitalarias',
        'description': 'Formación humana y científica para la gestión del cuidado integral de la salud del individuo, familia y comunidad en todas las etapas de la vida, con liderazgo en salud pública e investigación clínica.',
        'work_fields': [
            'Hospitales, clínicas privadas y centros de atención médica especializada',
            'Centros de salud comunitaria, postas y programas de salud preventiva',
            'Gestión y dirección de servicios hospitalarios y salud ocupacional en empresas',
            'Docencia universitaria y proyectos de investigación en salud pública'
        ]
    },
    {
        'file': 'ug-ingenieria-ambiental.pdf',
        'slug': 'ingenieria-ambiental',
        'default_name': 'Ingeniería Ambiental',
        'faculty': 'Facultad de Ingeniería',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Ingeniería Ambiental',
        'title': 'Ingeniero Ambiental',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Estándares Globales de Sostenibilidad y Cambio Climático',
        'description': 'Capacidad para diseñar e implementar soluciones tecnológicas a problemas ambientales: gestión integral del agua, remediación de suelos, evaluación de impacto ambiental, energías renovables y economía circular.',
        'work_fields': [
            'Empresas de minería, energía, hidrocarburos, industria y construcción',
            'Consultoras ambientales especializadas en estudios de impacto y monitoreo',
            'Ministerio del Ambiente (MINAM), OEFA, SERFOR y gobiernos locales',
            'Organismos internacionales de conservación y gestión de recursos naturales'
        ]
    },
    {
        'file': 'ug-ingenieria-civil.pdf',
        'slug': 'ingenieria-civil',
        'default_name': 'Ingeniería Civil',
        'faculty': 'Facultad de Ingeniería',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Ingeniería Civil',
        'title': 'Ingeniero Civil',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Laboratorios especializados de Estructuras, Geotecnia y Pavimentos',
        'description': 'Diseño, construcción, supervisión y gestión de obras civiles y de infraestructura: edificaciones sismorresistentes, puentes, carreteras, obras hidráulicas y proyectos de saneamiento bajo metodología BIM y Lean Construction.',
        'work_fields': [
            'Empresas constructoras, concesionarias de infraestructura y consultoras de ingeniería',
            'Supervisión y gerencia de proyectos de edificación, transporte y obras hidráulicas',
            'Entidades gubernamentales de infraestructura (MTC, gobiernos regionales, ministerios)',
            'Laboratorios de mecánica de suelos, ensayo de materiales y consultoría geotécnica'
        ]
    },
    {
        'file': 'ug-ingenieria-de-software.pdf',
        'slug': 'ingenieria-de-software',
        'default_name': 'Ingeniería de Software',
        'faculty': 'Facultad de Ingeniería',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Ingeniería de Software',
        'title': 'Ingeniero de Software',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Alineado a estándares ACM/IEEE',
        'description': 'Diseño, construcción, testing y mantenimiento de software de alta calidad, aplicaciones en la nube, arquitecturas distribuidas, DevOps, seguridad de software y sistemas inteligentes con metodologías ágiles modernas.',
        'work_fields': [
            'Empresas tecnológicas globales, Big Tech, fintechs y startups de software',
            'Compañías de transformación digital, banca y telecomunicaciones',
            'Fábricas de software y consultoras internacionales de desarrollo de sistemas',
            'Liderazgo técnico, arquitecturas de software y dirección de ingeniería'
        ]
    },
    {
        'file': 'ug-medicina-humana.pdf',
        'slug': 'medicina-humana',
        'default_name': 'Medicina Humana',
        'faculty': 'Facultad de Ciencias de la Salud',
        'curricula_pages': [7, 8, 9], # pages 8, 9, 10
        'degree': 'Bachiller en Medicina Humana',
        'title': 'Médico Cirujano',
        'semesters': 14,
        'years': 7.0,
        'total_credits': 281,
        'accreditation': 'Hospital Simulado de Alta Fidelidad • Prácticas Clínicas e Internado Médico en Hospitales Docentes',
        'description': 'Formación médica rigurosa con sólida base científica, clínica, diagnóstica, quirúrgica y humanística para la prevención, diagnóstico, tratamiento y rehabilitación de enfermedades, con preparación integral para el internado y el examen médico nacional.',
        'work_fields': [
            'Hospitales del MINSA, EsSalud, Fuerzas Armadas y clínicas privadas de alta complejidad',
            'Institutos especializados de salud (Cardiología, Neoplásicas, Salud del Niño, etc.)',
            'Gestión de políticas de salud pública, epidemiología y atención médica primaria',
            'Centros de investigación biomédica, laboratorios clínicos y docencia universitaria'
        ]
    },
    {
        'file': 'ug-psicologia.pdf',
        'slug': 'psicologia',
        'default_name': 'Psicología',
        'faculty': 'Facultad de Ciencias de la Salud',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Psicología',
        'title': 'Licenciado en Psicología',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditación de Calidad • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias',
        'description': 'Comprensión y evaluación del comportamiento humano, psicodiagnóstico, intervención psicoterapéutica, psicología organizacional, neuropsicología y programas de bienestar mental en contextos clínicos, educativos y laborales.',
        'work_fields': [
            'Clínicas, hospitales y centros de salud mental públicos y privados',
            'Áreas de gestión del talento humano, bienestar laboral y cultura organizacional',
            'Instituciones educativas de nivel básico y superior como orientador y tutor',
            'Consultoría privada en psicoterapia, desarrollo personal y programas comunitarios'
        ]
    },
    {
        'file': 'ug_ingenieria-industrial.pdf',
        'slug': 'ingenieria-industrial',
        'default_name': 'Ingeniería Industrial',
        'faculty': 'Facultad de Ingeniería',
        'curricula_pages': [5, 6],
        'degree': 'Bachiller en Ingeniería Industrial',
        'title': 'Ingeniero Industrial',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'accreditation': 'Acreditado por ICACIT • Laboratorios de Automatización, Manufactura y Logística',
        'description': 'Optimización de procesos productivos y de servicios, gestión de la cadena de suministros (supply chain), control de calidad, seguridad y salud en el trabajo, finanzas industriales y analítica de operaciones para aumentar la productividad.',
        'work_fields': [
            'Plantas industriales, manufactura, agroindustria y operaciones logísticas',
            'Empresas de consumo masivo, retail, comercio electrónico y distribución',
            'Gerencia de operaciones, supply chain management y mejora continua (Lean Six Sigma)',
            'Consultoría en optimización de procesos, gestión ambiental y seguridad industrial'
        ]
    }
]

def parse_courses_from_text(raw_pages_text):
    # Combines text from the curriculum pages and extracts courses cycle by cycle
    courses_by_cycle = {}
    
    # We will inspect each page and split into lines
    full_lines = []
    for txt in raw_pages_text:
        full_lines.extend(txt.splitlines())
        
    current_cycle = 1
    current_courses = []
    
    # Look for patterns
    # In UPN brochures, courses are prefixed with '-' or bullet
    pending_course = None
    
    for line in full_lines:
        s = line.strip()
        if not s:
            continue
            
        # Check if line is header or footer
        if 'PLAN DE ESTUDIOS' in s or 'Estructura curricular' in s or 'upn.edu.pe' in s or 'disponibilidad' in s:
            continue
            
        # Check if line indicates next cycle, e.g. "Ciclo" or "créditos" or number
        if s.lower() == 'ciclo':
            # A cycle marker!
            continue
            
        if re.search(r'^\d+\s*cr[ée]ditos', s, re.IGNORECASE) or re.search(r'cr[ée]ditos', s, re.IGNORECASE):
            # credit marker
            continue
            
        # Check if line starts a course item with '-'
        if s.startswith('-') or s.startswith('•'):
            if pending_course:
                current_courses.append(pending_course)
            pending_course = s.lstrip('-•').strip()
        else:
            # continuation of course name or stray text
            if pending_course and not s.startswith('*') and not re.match(r'^\d+$', s):
                pending_course += ' ' + s
            elif not pending_course and not re.match(r'^\d+$', s):
                # maybe course without bullet
                pass
                
    if pending_course:
        current_courses.append(pending_course)
        
    return current_courses

def test():
    print("Testing parse...")

if __name__ == '__main__':
    test()
