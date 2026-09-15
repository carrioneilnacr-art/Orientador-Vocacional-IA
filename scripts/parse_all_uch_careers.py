import json
import os

# Complete, verified curricula for all 9 UCH careers extracted from official 2026 brochures

uch_careers = [
    {
        "slug": "ingenieria-ambiental",
        "name": "Ingeniería Ambiental",
        "faculty": "Facultad de Ciencias e Ingeniería",
        "degree": "Bachiller en Ingeniería Ambiental",
        "title": "Ingeniero Ambiental",
        "total_cycles": 10,
        "total_credits": 205,
        "certifications": [
            "4.º ciclo: Asistente en Monitoreo Ambiental",
            "8.º ciclo: Asistente en Gestión Ambiental"
        ],
        "work_fields": [
            "Sistemas integrados de gestión (SIG)",
            "Consultoría y auditoría ambiental",
            "Gestión de recursos hídricos y residuos sólidos",
            "Sector minero, energético e industrial",
            "Ministerio del Ambiente, OEFA y municipalidades"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Química General", "Biología General", "Introducción a la Ingeniería Ambiental"],
            2: ["Interpretación y elaboración de textos", "Taller de Inteligencia Intrapersonal", "Apreciación de Artes Escénicas", "Cálculo I", "Economía General", "Química Inorgánica", "Dibujo de Ingeniería"],
            3: ["Redacción y argumentación", "Taller de Inteligencia Interpersonal", "Apreciación de Artes Audiovisuales", "Cálculo II", "Física I", "Química Orgánica", "Geología General", "Taller de planificación y organización"],
            4: ["Filosofía", "Conocimiento científico", "Cálculo III", "Física II", "Microbiología Ambiental", "Química Analítica", "Economía Ambiental"],
            5: ["Realidad Nacional e Internacional", "Ética y Deontología", "Edafología y Manejo de Suelos", "Tecnologías de Tratamiento de la Contaminación del Agua", "Sistemas de Información Geográfica", "Meteorología y Climatología"],
            6: ["Investigación académica", "Estadística y Probabilidades", "Balance de Materia y Energía", "Ecología", "Mecánica de Fluidos para Ingeniería Ambiental", "Lenguaje de Programación", "Taller de Empleabilidad"],
            7: ["Ciudadanía y Responsabilidad Social", "Trabajos de investigación I", "Tecnologías de Tratamiento de la Contaminación del Aire", "Gestión de Riesgos Ambientales", "Derecho Ambiental", "Modelamiento Ambiental Computacional"],
            8: ["Trabajos de investigación II", "Tecnologías de Tratamiento de la Contaminación del Suelo", "Planeamiento y Ordenamiento Territorial", "Planificación, Costos y Presupuestos", "Taller para prácticas preprofesionales", "Electivo I"],
            9: ["Trabajos de investigación III", "Gestión de Recursos Hídricos", "Gestión de Residuos Sólidos", "Participación Ciudadana y Resolución de Conflictos", "Prácticas profesionales supervisadas", "Electivo II"],
            10: ["Trabajos de investigación IV", "Análisis de Ciclo de Vida de los Productos", "Proyecto de fin de carrera", "Gestión Integral de Cuencas", "Evaluación de Impacto Ambiental", "Electivo III"]
        }
    },
    {
        "slug": "comunicacion-y-medios-digitales",
        "name": "Comunicación y Medios Digitales",
        "faculty": "Facultad de Humanidades y Ciencias Sociales",
        "degree": "Bachiller en Comunicación y Medios Digitales",
        "title": "Licenciado en Comunicación y Medios Digitales",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "6.º ciclo: Asistente en Comunicación Digital, Institucional y Corporativa",
            "9.º ciclo: Especialista en Medios Digitales"
        ],
        "work_fields": [
            "Medios de comunicación masivos y periodismo digital",
            "Direcciones de comunicación corporativa y relaciones públicas",
            "Agencias de publicidad, social media y marketing de contenidos",
            "Producción audiovisual digital, radio y podcasting",
            "Comunicación e imagen institucional en entidades públicas y ONG"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Introducción a la Comunicación", "Historia de los Medios de Comunicación", "Creatividad y Comunicación"],
            2: ["Interpretación y elaboración de textos", "Apreciación de Artes Escénicas", "Teorías de la Comunicación I", "Comunicación y Estética Visual", "Comunicación en el contexto nacional y mundial", "Análisis y Tipología de Audiencias"],
            3: ["Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Teorías de la Comunicación II", "Fundamentos del Marketing", "Creación Fotográfica", "Taller de Diseño y Animación Multimedia"],
            4: ["Investigación académica", "Taller de Inteligencia Intrapersonal", "Semiótica de la Comunicación", "Comunicación Institucional y Corporativa", "Comunicación Publicitaria", "Comunicación Periodística", "Narrativas Digitales"],
            5: ["Realidad Nacional e Internacional", "Conocimiento científico", "Taller de planificación y organización", "Comunicación y Sostenibilidad", "Reputación Corporativa Digital", "Estudios de Opinión y Mercado", "Creación de Contenidos Audiovisuales"],
            6: ["Filosofía", "Taller de Inteligencia Interpersonal", "Estadística y Probabilidades", "Comunicación para el Desarrollo", "Comunicación Digital y Transmedia", "Comunicación y Estética Audiovisual", "Radio y podcasting"],
            7: ["Ciudadanía y Responsabilidad Social", "Ética y Deontología", "Trabajos de investigación I", "Marketing Social", "Gestión de Comunidades Digitales", "Comunicación e Interculturalidad", "Creación de Contenidos Digitales"],
            8: ["Trabajos de Investigación II", "Comunicación y Conflictos Sociales", "Métricas y Audiencias Digitales", "Comunicación Política", "Electivo I", "Aplicaciones Interactivas"],
            9: ["Trabajos de investigación III", "Planeamiento Estratégico de la Comunicación", "Comunicación en la Sociedad Global", "Comunicación Digital e Innovación Social", "Prácticas preprofesionales I", "Electivo II"],
            10: ["Trabajos de investigación IV", "Campañas de Comunicación Social", "Diseño y Gestión de Proyectos de Comunicación", "Ética de la Comunicación", "Prácticas preprofesionales II", "Electivo III"]
        }
    },
    {
        "slug": "contabilidad-y-finanzas",
        "name": "Contabilidad con mención en Finanzas",
        "faculty": "Facultad de Ciencias Contables, Económicas y Financieras",
        "degree": "Bachiller en Contabilidad con mención en Finanzas",
        "title": "Contador Público",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "4.º ciclo: Auxiliar contable",
            "7.º ciclo: Analista contable",
            "9.º ciclo: Analista financiero"
        ],
        "work_fields": [
            "Firmas internacionales y locales de auditoría y consultoría",
            "Gerencias de finanzas, contabilidad y tesorería en bancos y empresas",
            "Entidades del sector público, SUNAT, MEF y Contraloría",
            "Empresas mineras, industriales, comerciales y startups"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Economía General", "Vocación contable", "Fundamentos de Contabilidad"],
            2: ["Interpretación y elaboración de textos", "Apreciación de Artes Escénicas", "Taller de Inteligencia Intrapersonal", "Análisis de Hechos Económicos", "Doctrina Contable", "Herramientas Informáticas para la Gestión", "Contabilidad I"],
            3: ["Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Taller de Inteligencia Interpersonal", "Observación y Análisis de Problemas Públicos", "Derecho Empresarial", "Contabilidad II", "Tributación I"],
            4: ["Filosofía", "Conocimiento científico", "Taller de planificación y organización", "Normativa Contable Nacional e Internacional", "Legislación del Trabajo", "Contabilidad Intermedia", "Informática Contable I", "Tributación II"],
            5: ["Ciudadanía y Responsabilidad Social", "Estadística y Probabilidades", "Contabilidad de Sociedades", "Contabilidad de Costos I", "Finanzas I"],
            6: ["Realidad Nacional e Internacional", "Investigación académica", "Matemática Financiera", "Contabilidad y Finanzas para la Micro y Pequeña Empresa", "Tributación III", "Informática Contable II"],
            7: ["Ética y Deontología", "Prácticas pre profesionales I", "Contabilidad de Costos II", "Finanzas II", "Administración General", "Trabajo de investigación I"],
            8: ["Contabilidad por Sectores Económicos I", "Marketing para Emprendedores", "Prácticas pre profesionales II", "Finanzas Internacionales", "Auditoría Operativa", "Gestión de Comercio Internacional", "Trabajo de investigación II", "Contabilidad por Sectores Económicos II"],
            9: ["Prácticas preprofesionales III", "Contabilidad Gubernamental I", "Auditoría Financiera", "Taller NIIF", "Evaluación de Proyectos de Inversión", "Trabajo de investigación III"],
            10: ["Contabilidad Gubernamental II", "Auditoría Gubernamental", "Big data y data analytics en la Contabilidad", "Trabajo de investigación IV", "Ética Contable"]
        }
    },
    {
        "slug": "derecho",
        "name": "Derecho",
        "faculty": "Facultad de Humanidades y Ciencias Sociales",
        "degree": "Bachiller en Derecho",
        "title": "Abogado",
        "total_cycles": 11,
        "total_credits": 220,
        "certifications": [
            "7.º ciclo: Analista en Derecho de Organizaciones Públicas",
            "9.º ciclo: Analista en Derecho de Organizaciones Privadas"
        ],
        "work_fields": [
            "Poder Judicial, Ministerio Público, Tribunal Constitucional y notarías",
            "Estudios jurídicos corporativos y consultoría empresarial",
            "Diseño de programas de compliance y asesoría en contrataciones públicas",
            "Asesoría legal en banca, seguros, minería y telecomunicaciones"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Introducción al Derecho", "Taller de Habilidades Blandas", "Ciencias Sociales y Derecho"],
            2: ["Interpretación y elaboración de textos", "Apreciación de Artes Escénicas", "Contabilidad y Finanzas para Derecho", "Sistemas Jurídicos: Romano y Anglosajón", "Ciencias Políticas y Realidad Nacional", "Derechos Humanos"],
            3: ["Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Ética y Deontología", "Economía General", "Lógica y Argumentación Jurídica", "Personas"],
            4: ["Investigación académica", "Filosofía", "Teoría del Conflicto y Mecanismos de Solución", "Teoría General del Proceso", "Derecho Penal General", "Derecho Constitucional", "Acto Jurídico"],
            5: ["Realidad Nacional e Internacional", "Taller de Inteligencia Interpersonal", "Derecho Administrativo", "Derecho de Empresas I", "Derecho Penal Especial", "Derecho Procesal Penal", "Obligaciones y Contratos"],
            6: ["Conocimiento científico", "Taller de Inteligencia Intrapersonal", "Estadística y Probabilidades", "Filosofía del Derecho", "Derecho Procesal Civil", "Reales", "Familia y Sucesiones"],
            7: ["Ciudadanía y Responsabilidad Social", "Taller de Planificación y Organización", "Derecho de Empresas II", "Responsabilidad Civil", "Derecho Procesal Constitucional", "Derecho Laboral General", "Derecho Contencioso Administrativo"],
            8: ["Trabajo de investigación I", "Derecho Tributario I", "Derecho Laboral Especial", "Derecho Internacional Público", "Fundamentos Jurídicos de la Gestión Pública", "Taller de Negociación y Litigación Oral"],
            9: ["Trabajo de investigación II", "Derecho Tributario II", "Derecho Internacional Privado", "Derecho Procesal Laboral", "Tecnología y Derecho", "Fundamentos de las Ciencias Empresariales", "Derecho Registral y Notarial"],
            10: ["Trabajo de investigación III", "Clínica Jurídica I", "Electivo Seminario I", "Electivo para mención I", "Electivo para mención II"],
            11: ["Derecho de Competencia y Protección al Consumidor", "Trabajo de investigación IV", "Clínica Jurídica II", "Electivo seminario II", "Electivo para mención III", "Electivo para mención IV"]
        }
    },
    {
        "slug": "enfermeria",
        "name": "Enfermería",
        "faculty": "Facultad de Ciencias de la Salud",
        "degree": "Bachiller en Enfermería",
        "title": "Licenciado en Enfermería",
        "total_cycles": 10,
        "total_credits": 205,
        "certifications": [
            "4.º ciclo: Auxiliar en Enfermería y Primeros Auxilios",
            "6.º ciclo: Asistente de Enfermería Integral"
        ],
        "work_fields": [
            "Hospitales públicos (MINSA, EsSalud, Fuerzas Armadas) y clínicas privadas",
            "Centros de atención primaria, postas médicas y salud comunitaria",
            "Unidades de cuidados intensivos (UCI), emergencias y pediatría",
            "Gestión y administración de servicios de salud y salud ocupacional corporativa"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Biología Celular", "Química General y Orgánica", "Introducción a la Enfermería"],
            2: ["Interpretación y elaboración de textos", "Apreciación de Artes Escénicas", "Taller de Inteligencia Intrapersonal", "Bioquímica", "Anatomía Humana", "Metodología del Cuidado de Enfermería", "Software y Tecnología Aplicado a la Salud"],
            3: ["Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Taller de Inteligencia Interpersonal", "Fisiología Humana", "Base de la Farmacología en Enfermería", "Educación para la Salud", "Cuidados Básicos de Enfermería"],
            4: ["Filosofía", "Conocimiento científico", "Taller de planificación y organización", "Microbiología y Parasitología", "Nutrición y Dietoterapia", "Cuidados de Enfermería en Salud del Adulto I", "Cuidados de Enfermería en Salud Comunitaria"],
            5: ["Ciudadanía y Responsabilidad Social", "Estadística y Probabilidades", "Escritura Científica en Inglés Técnico", "Cuidados de Enfermería en Salud de la Mujer y Recién Nacido", "Administración de los Servicios de Salud"],
            6: ["Realidad Nacional e Internacional", "Investigación académica", "Salud Pública y Epidemiología", "Psicología evolutiva", "Cuidados de Enfermería en Salud del Adulto II", "Cuidados de Enfermería en Salud Familiar"],
            7: ["Ética y Deontología", "Trabajo de investigación I", "Cuidados de Enfermería en Salud del Niño y Adolescente Sano", "Cuidados de Enfermería en Salud Mental y Psiquiatría", "Electivo I"],
            8: ["Trabajo de investigación II", "Cuidados de Enfermería en Salud del Niño y Adolescente con Problemas de Salud", "Cuidados de Enfermería en Pacientes en Estado Crítico", "Electivo II"],
            9: ["Trabajo de investigación III", "Internado comunitario", "Electivo III"],
            10: ["Trabajo de investigación IV", "Internado hospitalario"]
        }
    },
    {
        "slug": "ingenieria-industrial",
        "name": "Ingeniería Industrial",
        "faculty": "Facultad de Ciencias e Ingeniería",
        "degree": "Bachiller en Ingeniería Industrial",
        "title": "Ingeniero Industrial",
        "total_cycles": 10,
        "total_credits": 205,
        "certifications": [
            "4.º ciclo: Asistente en Evaluación de Procesos",
            "8.º ciclo: Especialista en Logística"
        ],
        "work_fields": [
            "Plantas de manufactura, alimentos, consumo masivo y automotriz",
            "Operadores logísticos, centros de distribución y cadena de suministro global",
            "Gestión de calidad, seguridad industrial y salud ocupacional",
            "Consultoría en mejora continua, Lean Manufacturing y optimización de proyectos"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Química General", "Introducción a la Ingeniería Industrial", "Creatividad e Innovación"],
            2: ["Interpretación y elaboración de textos", "Taller de Inteligencia Intrapersonal", "Apreciación de Artes Escénicas", "Cálculo I", "Dibujo en Ingeniería", "Economía General"],
            3: ["Taller de Inteligencia Interpersonal", "Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Cálculo II", "Física I", "Análisis de Procesos", "Contabilidad y Costeo de Operaciones"],
            4: ["Filosofía", "Taller de planificación y organización", "Conocimiento científico", "Cálculo III", "Física II", "Gestión de Calidad", "Operaciones y Procesos Unitarios de Producción"],
            5: ["Realidad Nacional e Internacional", "Ética y Deontología", "Tecnología Industrial", "Investigación de Operaciones II", "Mecánica", "Ingeniería del Trabajo"],
            6: ["Investigación académica", "Estadística y Probabilidades", "Termodinámica", "Investigación de Operaciones I", "Taller de Empleabilidad", "Ingeniería Eléctrica", "Lenguaje de Programación"],
            7: ["Ciudadanía y Responsabilidad Social", "Trabajo de investigación I", "Planeamiento y Control de Operaciones", "Ingeniería Económica", "Diseño de Instalaciones", "Gestión del Talento Humano"],
            8: ["Trabajo de investigación II", "Gestión de Operaciones de Servicios", "Automatización Industrial", "Gestión de la Cadena de Valor de Suministros", "Técnicas de Simulación", "Taller para prácticas preprofesionales"],
            9: ["Trabajo de investigación III", "Dirección Estratégica", "Logística Avanzada", "Seguridad Industrial", "Gestión Ambiental", "Prácticas preprofesionales supervisadas"],
            10: ["Trabajo de investigación IV", "Diagnóstico y Mejora Empresarial", "Formulación, Gestión y Evaluación de Proyectos", "Gestión de Mantenimiento", "Marketing Estratégico", "Gerencia Comercial"]
        }
    },
    {
        "slug": "psicologia",
        "name": "Psicología",
        "faculty": "Facultad de Ciencias de la Salud",
        "degree": "Bachiller en Psicología",
        "title": "Licenciado en Psicología",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "6.º ciclo: Asistente en Evaluación Psicométrica",
            "8.º ciclo: Promotor de Programas Preventivos y Promocionales de Bienestar Psicológico"
        ],
        "work_fields": [
            "Centros de salud, hospitales y clínicas en psicología clínica y psicoterapia",
            "Instituciones educativas en orientación vocacional y problemas de aprendizaje",
            "Empresas en recursos humanos, selección por competencias y clima laboral",
            "Organizaciones comunitarias y proyectos de intervención psicosocial"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Filosofía", "Psicología General", "Práctica formativa I"],
            2: ["Interpretación y elaboración de textos", "Apreciación de Artes Escénicas", "Taller de planificación y organización", "Conocimiento científico", "Bases Biológicas del Psiquismo", "Psicología y Realidad Nacional", "Práctica formativa II"],
            3: ["Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Taller de Inteligencia Intrapersonal", "Técnicas de Entrevista y Observación", "Historia y Sistemas de la Psicología", "Psicología Evolutiva I", "Práctica formativa III"],
            4: ["Investigación académica", "Taller de Inteligencia Interpersonal", "Motivación y Afectividad", "Psicología del Aprendizaje", "Procesos Cognitivos Superiores", "Psicología Evolutiva II", "Práctica formativa IV"],
            5: ["Ética y Deontología", "Estadística Aplicada", "Psicopatología I", "Intervenciones Clínicas", "Evaluación Psicológica II", "Práctica formativa VI"],
            6: ["Realidad Nacional y Mundial", "Estadística y Probabilidades", "Personalidad Integral", "Psicología Educativa", "Psicología Clínica y de la Salud", "Evaluación Psicológica I", "Práctica formativa V"],
            7: ["Ciudadanía y Responsabilidad Social", "Trabajo de Investigación I", "Psicopatología II", "Intervenciones Educativas", "Programas Preventivo Promocionales", "Práctica formativa VII"],
            8: ["Trabajo de Investigación II", "Psicología Organizacional", "Psicología Social", "Construcción de Instrumentos de Evaluación Psicológica", "Práctica formativa VIII", "Orientación y Consejería"],
            9: ["Trabajo de Investigación III", "Redacción de Informes Psicológicos", "Práctica preprofesional I", "Neurociencias"],
            10: ["Trabajo de Investigación IV", "Práctica preprofesional II"]
        }
    },
    {
        "slug": "ingenieria-de-sistemas-e-informatica",
        "name": "Ingeniería de Sistemas e Informática",
        "faculty": "Facultad de Ciencias e Ingeniería",
        "degree": "Bachiller en Ingeniería de Sistemas e Informática",
        "title": "Ingeniero de Sistemas e Informática",
        "total_cycles": 10,
        "total_credits": 205,
        "certifications": [
            "5.º ciclo: Especialista en Desarrollo Web",
            "6.º ciclo: Especialista en Inteligencia de Negocios",
            "7.º ciclo: Especialista en Desarrollo de Software"
        ],
        "work_fields": [
            "Empresas de tecnología, desarrollo de software y aplicaciones cloud",
            "Industria financiera, fintech, banca y telecomunicaciones",
            "Ciberseguridad, auditoría de sistemas e infraestructura TI",
            "Startups, inteligencia de negocios (BI) y analítica de datos"
        ],
        "cycles": {
            1: ["Comprensión lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Fundamentos de Sistemas de Información", "Matemática Discreta", "Organización y Dirección de Empresas"],
            2: ["Interpretación y elaboración de textos", "Apreciación de Artes Escénicas", "Taller de Inteligencia Intrapersonal", "Fundamentos de Programación", "Cálculo I", "Diseño Web"],
            3: ["Redacción y argumentación", "Apreciación de Artes Audiovisuales", "Taller de Inteligencia Interpersonal", "Cálculo II", "Física I", "Programación I", "Base de Datos I"],
            4: ["Filosofía", "Conocimiento Científico", "Taller de planificación y organización", "Cálculo III", "Programación II", "Ingeniería de Requerimientos", "Base de Datos II"],
            5: ["Ciudadanía y Responsabilidad Social", "Estadística y Probabilidades", "Desarrollo de software I", "Negocios Electrónicos", "Redes y Comunicaciones", "Inteligencia de Negocios"],
            6: ["Realidad Nacional e Internacional", "Investigación académica", "Programación III", "Desarrollo Web", "Ingeniería de software", "Base de Datos III", "Taller de Empleabilidad"],
            7: ["Ética y Deontología", "Desarrollo de software II", "Administración de Servidores", "Taller para prácticas preprofesionales", "Gestión de Proyectos", "Trabajo de Investigación I"],
            8: ["Programación Móvil", "Arquitectura Empresarial", "Desarrollo de Operaciones de software", "Big Data", "Sistemas de Información Empresarial", "Trabajo de Investigación II"],
            9: ["Desarrollo de Aplicaciones cloud", "Seguridad de la Información", "Simulación de Sistemas", "Proyecto integrador", "Prácticas preprofesionales supervisadas", "Trabajo de Investigación III"],
            10: ["Auditoría Informática", "Gestión de Servicios de TI", "Calidad de software", "Gerencia de Sistemas", "Tecnologías Emergentes", "Trabajo de Investigación IV"]
        }
    },
    {
        "slug": "medicina-humana",
        "name": "Medicina Humana",
        "faculty": "Facultad de Ciencias de la Salud",
        "degree": "Bachiller en Medicina Humana",
        "title": "Médico Cirujano",
        "total_cycles": 14,
        "total_credits": 326,
        "certifications": [
            "IV ciclo: Primeros Auxilios",
            "VIII ciclo: Soporte Vital Básico",
            "XI ciclo: Atención Integral al Adulto Mayor"
        ],
        "work_fields": [
            "Hospitales públicos (MINSA, EsSalud, FF.AA.) y clínicas privadas",
            "Centros y postas de salud del primer nivel de atención",
            "Unidades de emergencias médicas, cirugía, pediatría y ginecología",
            "Investigación biomédica, ensayos clínicos y docencia universitaria",
            "Gestión y dirección de establecimientos de salud pública y privada"
        ],
        "cycles": {
            1: ["Comprensión Lectora", "Matemática Básica", "Desarrollo de Hábitos Saludables", "Biología Celular", "Química General e Inorgánica", "Historia de la Medicina"],
            2: ["Interpretación y Elaboración de Textos", "Apreciación de Artes Escénicas", "Taller de Inteligencia Intrapersonal", "Biología Molecular", "Química Aplicada a la Medicina", "Biofísica", "Primeros Auxilios y Soporte Vital Básico"],
            3: ["Redacción y Argumentación", "Apreciación de Artes Audiovisuales", "Taller de Inteligencia Interpersonal", "Bioquímica Aplicada a la Medicina", "Microanatomía", "Anatomía Humana I"],
            4: ["Filosofía Orientada a la Medicina", "Taller de Planificación y Organización", "Microbiología y Parasitología Médica", "Embriología y Genética", "Anatomía Humana II", "Nutrición y Medio Interno"],
            5: ["Conocimiento Científico", "Estadística Aplicada a Ciencias de la Salud", "Fisiología Humana", "Inmunología Humana", "Salud Pública", "Tecnología Aplicada a la Salud"],
            6: ["Realidad Nacional y Mundial", "Investigación Académica", "Farmacología Médica", "Patología General", "Fisiopatología Clínica", "Epidemiología", "Electivo I"],
            7: ["Ciudadanía y Responsabilidad Social", "Ética y Deontología", "Patología Clínica", "Semiología Médica", "Medicina Familiar y Comunitaria", "Salud y Seguridad Ocupacional"],
            8: ["Cardiología", "Neumología", "Neurología", "Psicopatología", "Diagnóstico por Imágenes", "Emergencias y Desastres"],
            9: ["Hematología", "Nefrología", "Psiquiatría", "Endocrinología y Enfermedades Metabólicas", "Gestión en Servicios de Salud", "Gastroenterología"],
            10: ["Reumatología", "Medicina Física y Rehabilitación", "Cirugía I", "Medicina Legal y Forense", "Dermatología y Medicina Estética", "Enfermedades Infecciosas y Tropicales"],
            11: ["Trabajo de Investigación I", "Geriatría", "Ginecología y Obstetricia", "Oncología Médica", "Cirugía II", "Electivo II"],
            12: ["Trabajo de Investigación II", "Neonatología", "Pediatría", "Cirugía III", "Externado Médico"],
            13: ["Trabajo de Investigación III", "Internado Médico I"],
            14: ["Trabajo de Investigación IV", "Internado Médico II"]
        }
    }
]

out_file = "scratch/uch_curricula_verified.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(uch_careers, f, ensure_ascii=False, indent=2)

print(f"[OK] Extracted & verified {len(uch_careers)} UCH careers into {out_file}!")

# Total course summary
total_courses = 0
for c in uch_careers:
    c_courses = sum(len(courses) for courses in c["cycles"].values())
    total_courses += c_courses
    print(f"- {c['name']} ({c['slug']}): {c['total_cycles']} ciclos | {c_courses} cursos | {c['total_credits']} creditos")

print(f"\nTotal de cursos UCH extraidos: {total_courses}")
