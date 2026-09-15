import pdfplumber
import json
import re
import os

# Official career metadata
CAREERS_META = [
    {
        'slug': 'administracion-y-marketing',
        'name': 'Administración y Marketing',
        'faculty': 'Facultad de Negocios',
        'degree': 'Bachiller en Administración y Marketing',
        'title': 'Licenciado en Administración y Marketing',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-administracion-y-marketing_compressed.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'ADM',
        'accreditation': 'Acreditación Internacional • Certificaciones Progresivas en Marketing Digital y Analítica Comercial',
        'description': 'Aprenderás a diseñar estrategias comerciales innovadoras, gestión de marcas, marketing digital, análisis del consumidor y toma de decisiones basadas en datos para maximizar la rentabilidad y el posicionamiento de mercado.',
        'work_fields': [
            'Liderazgo de proyectos comerciales que optimicen la rentabilidad y el posicionamiento',
            'Empresas consultoras en gestión de marcas, sectores industriales, comerciales y de servicios',
            'Agencias de publicidad, medios digitales y startups de base tecnológica',
            'Dirección de marketing, trade marketing, producto y experiencia del cliente (CX)'
        ]
    },
    {
        'slug': 'arquitectura-y-diseno-de-interiores',
        'name': 'Arquitectura y Diseño de Interiores',
        'faculty': 'Facultad de Arquitectura y Urbanismo',
        'degree': 'Bachiller en Arquitectura',
        'title': 'Arquitecto',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-arquitectura-y-diseno-de-interiores.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'ARQ',
        'accreditation': 'Metodología BIM • Certificaciones Progresivas en Modelado Arquitectónico y Diseño Espacial',
        'description': 'Formación integral en diseño arquitectónico, planificación urbana, diseño espacial interior y sostenibilidad ambiental, integrando herramientas digitales avanzadas y tecnologías constructivas modernas.',
        'work_fields': [
            'Estudios de arquitectura, diseño interior y consultorías espaciales',
            'Empresas constructoras, inmobiliarias y promotoras de desarrollo urbano',
            'Organismos públicos y municipales en planificación urbana y catastro',
            'Firmas de consultoría, proyectos ambientales y diseño de espacios comerciales'
        ]
    },
    {
        'slug': 'comunicacion-y-marketing-digital',
        'name': 'Comunicación y Marketing Digital',
        'faculty': 'Facultad de Comunicaciones',
        'degree': 'Bachiller en Comunicación y Marketing Digital',
        'title': 'Licenciado en Comunicación y Marketing Digital',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-comunicacion-y-marketing-digital.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'CMD',
        'accreditation': 'Especialización en Estrategias Digitales, Redes Sociales, IA y Contenido Transmedia',
        'description': 'Desarrollarás competencias en gestión de marcas digitales, narrativas transmedia, analítica web, producción de contenidos multimedia y dirección de campañas de comunicación estratégica omnicanal.',
        'work_fields': [
            'Agencias de publicidad, marketing digital y relaciones públicas',
            'En startups y emprendimientos digitales',
            'Áreas de marketing y comunicación en el sector público y privado',
            'Dirección de medios digitales, community management y consultoría propia'
        ]
    },
    {
        'slug': 'contabilidad-y-finanzas',
        'name': 'Contabilidad y Finanzas',
        'faculty': 'Facultad de Negocios',
        'degree': 'Bachiller en Contabilidad y Finanzas',
        'title': 'Licenciado en Contabilidad y Finanzas',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-contabilidad-y-finanzas.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'CON',
        'accreditation': 'Acreditación Internacional SINEACE/ICACIT • Alineado a Normas Internacionales NIIF',
        'description': 'Especialización en auditoría financiera, tributación estratégica, finanzas corporativas, gestión de costos y analítica contable para la toma de decisiones gerenciales en entornos globales.',
        'work_fields': [
            'Sector financiero y bancario, consultoras, aseguradoras, inmobiliarias y retail',
            'Startups, empresas tecnológicas y corporaciones multinacionales',
            'Firmas de auditoría internacional (Big Four) y asesoría tributaria',
            'Organismos reguladores del sector público (SUNAT, MEF, Contraloría)'
        ]
    },
    {
        'slug': 'derecho',
        'name': 'Derecho',
        'faculty': 'Facultad de Derecho y Ciencias Políticas',
        'degree': 'Bachiller en Derecho',
        'title': 'Abogado',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-derecho.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'DER',
        'accreditation': 'Acreditación de Calidad Académica • Convenios con Cortes de Justicia y Clínicas Jurídicas',
        'description': 'Dominio del ordenamiento jurídico nacional e internacional, litigación oral, derecho corporativo, arbitraje y resolución de conflictos con sólidas bases éticas y habilidades de argumentación jurídica.',
        'work_fields': [
            'Asesoría legal y consultoría en empresas públicas y privadas',
            'Gestión y resolución de conflictos en entornos judiciales y extrajudiciales',
            'Diseño y aplicación de estrategias legales en Derecho Empresarial y Gestión Pública',
            'Organismos estatales, instituciones gubernamentales y organismos reguladores'
        ]
    },
    {
        'slug': 'enfermeria',
        'name': 'Enfermería',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Enfermería',
        'title': 'Licenciado en Enfermería',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-enfermeria.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'ENF',
        'accreditation': 'Hospitales Simulados de Alta Fidelidad • Prácticas Clínicas Tempranas en Redes Hospitalarias',
        'description': 'Formación humana y científica para la gestión del cuidado integral de la salud del individuo, familia y comunidad en todas las etapas de la vida, con liderazgo en salud pública e investigación clínica.',
        'work_fields': [
            'Hospitales, clínicas y centros de salud públicos y privados',
            'ONG en programas de salud y asistencia comunitaria',
            'Servicios de salud ocupacional en empresas e industrias',
            'Atención domiciliaria y consultorios de enfermería independientes'
        ]
    },
    {
        'slug': 'ingenieria-ambiental',
        'name': 'Ingeniería Ambiental',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería Ambiental',
        'title': 'Ingeniero Ambiental',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-ingenieria-ambiental.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'AMB',
        'accreditation': 'Acreditado por ICACIT • Estándares Globales de Sostenibilidad y Cambio Climático',
        'description': 'Capacidad para diseñar e implementar soluciones tecnológicas a problemas ambientales: gestión integral del agua, remediación de suelos, evaluación de impacto ambiental, energías renovables y economía circular.',
        'work_fields': [
            'Consultoras especializadas en gestión ambiental, evaluación de impacto y desarrollo sostenible',
            'Organizaciones no gubernamentales (ONG) enfocadas en conservación y recursos naturales',
            'Empresas de minería, energía, hidrocarburos, industria y construcción',
            'Ministerio del Ambiente (MINAM), OEFA, SERFOR y gobiernos locales'
        ]
    },
    {
        'slug': 'ingenieria-civil',
        'name': 'Ingeniería Civil',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería Civil',
        'title': 'Ingeniero Civil',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-ingenieria-civil.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'CIV',
        'accreditation': 'Acreditado por ICACIT • Laboratorios especializados de Estructuras, Geotecnia y Pavimentos',
        'description': 'Diseño, construcción, supervisión y gestión de obras civiles y de infraestructura: edificaciones sismorresistentes, puentes, carreteras, obras hidráulicas y proyectos de saneamiento bajo metodología BIM y Lean Construction.',
        'work_fields': [
            'Empresas constructoras, inmobiliarias e industriales',
            'Consultoras en diseño estructural, geotecnia, hidráulica y gestión de proyectos de infraestructura',
            'Organismos públicos vinculados a transporte, vivienda, desarrollo urbano y saneamiento',
            'Laboratorios de mecánica de suelos, ensayo de materiales y supervisión de obras'
        ]
    },
    {
        'slug': 'ingenieria-de-software',
        'name': 'Ingeniería de Software',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería de Software',
        'title': 'Ingeniero de Software',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-ingenieria-de-software.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'SOF',
        'accreditation': 'Acreditado por ICACIT • Alineado a estándares ACM/IEEE',
        'description': 'Diseño, construcción, testing y mantenimiento de software de alta calidad, aplicaciones en la nube, arquitecturas distribuidas, DevOps, seguridad de software y sistemas inteligentes con metodologías ágiles modernas.',
        'work_fields': [
            'Empresas o consultoras enfocadas en desarrollo de software, aplicaciones móviles, plataformas web y tecnología digital',
            'Organismos públicos y privados en transformación digital',
            'Centros de investigación y desarrollo en inteligencia artificial, big data y computación en la nube',
            'Startups tecnológicas, fintechs y empresas globales de software'
        ]
    },
    {
        'slug': 'medicina-humana',
        'name': 'Medicina Humana',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Medicina Humana',
        'title': 'Médico Cirujano',
        'semesters': 14,
        'years': 7.0,
        'total_credits': 281,
        'file': 'ug-medicina-humana.pdf',
        'pages': [7, 8, 9],
        'cycles_count': 14,
        'prefix': 'MED',
        'accreditation': 'Hospitales Simulados de Alta Fidelidad • Certificaciones en RCP Avanzada y Rehabilitación Cardio Respiratoria',
        'description': 'Formación médica rigurosa con sólida base científica, clínica, diagnóstica, quirúrgica y humanística para la prevención, diagnóstico, tratamiento y rehabilitación de enfermedades, con preparación integral para el internado y el examen médico nacional.',
        'work_fields': [
            'Hospitales, clínicas y centros de salud públicos y privados',
            'ONG y proyectos de salud comunitaria',
            'Empresas en salud ocupacional y bienestar laboral',
            'Consultorios médicos independientes y atención domiciliaria',
            'Centros de investigación médica y laboratorios biomédicos',
            'Universidades e institutos en docencia e investigación',
            'Instituciones gubernamentales y políticas de salud'
        ]
    },
    {
        'slug': 'psicologia',
        'name': 'Psicología',
        'faculty': 'Facultad de Ciencias de la Salud',
        'degree': 'Bachiller en Psicología',
        'title': 'Licenciado en Psicología',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug-psicologia.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'PSI',
        'accreditation': 'Acreditación de Calidad • Laboratorios de Psicología Experimental, Cámara Gesell y Neurociencias',
        'description': 'Comprensión y evaluación del comportamiento humano, psicodiagnóstico, intervención psicoterapéutica, psicología organizacional, neuropsicología y programas de bienestar mental en contextos clínicos, educativos y laborales.',
        'work_fields': [
            'Hospitales, clínicas y centros de salud públicos y privados',
            'Empresas e instituciones en el área de Recursos Humanos y Gestión del Talento',
            'Instituciones educativas y universidades en consejería y tutoría',
            'Centros de salud mental, rehabilitación y terapia psicológica'
        ]
    },
    {
        'slug': 'ingenieria-industrial',
        'name': 'Ingeniería Industrial',
        'faculty': 'Facultad de Ingeniería',
        'degree': 'Bachiller en Ingeniería Industrial',
        'title': 'Ingeniero Industrial',
        'semesters': 10,
        'years': 5.0,
        'total_credits': 200,
        'file': 'ug_ingenieria-industrial.pdf',
        'pages': [5, 6],
        'cycles_count': 10,
        'prefix': 'IND',
        'accreditation': 'Acreditado por ICACIT • Laboratorios de Automatización, Manufactura y Logística',
        'description': 'Optimización de procesos productivos y de servicios, gestión de la cadena de suministros (supply chain), control de calidad, seguridad y salud en el trabajo, finanzas industriales y analítica de operaciones para aumentar la productividad.',
        'work_fields': [
            'Área de Producción y Operaciones en plantas industriales y manufactura',
            'Área de Logística y Cadena de Suministro (Supply Chain)',
            'Área de Gestión de la Calidad y Mejora Continua (Lean Six Sigma)',
            'Área de Proyectos, Finanzas Industriales y Consultoría Estratégica'
        ]
    }
]

def clean_course(name):
    # Strip bullet and spaces
    s = re.sub(r'^\s*[-•]\s*', '', name)
    s = re.sub(r'\s+', ' ', s).strip()
    
    # Strip trailing/leading punctuation
    s = s.strip('-: ')
    
    # Fix broken words or characters
    s = s.replace('arti cial', 'artificial')
    s = s.replace('cient ca', 'científica')
    s = s.replace('cientca', 'científica')
    s = s.replace('Espec cas', 'Específicas')
    s = s.replace('Arquitecturay', 'Arquitectura y')
    
    return s

def extract_career_data(c_meta):
    filepath = os.path.join('archivos u', c_meta['file'])
    print(f"Extracting accurate data for {c_meta['name']} ...")
    
    with pdfplumber.open(filepath) as pdf:
        # Load raw text from curricula pages
        pages = [pdf.pages[idx] for idx in c_meta['pages']]
        
        # We will use the layout lines from each page
        # Note: in scratch/curricula_verified.json we already have the coordinate-parsed cycles
        # Let's inspect scratch/curricula_verified.json
        pass

def main():
    print("Ready to generate comprehensive SQL seed.")

if __name__ == '__main__':
    main()
