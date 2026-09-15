import json
import os

# Complete, verified curricula for all 11 UCV pregraduate careers extracted from official 2026 brochures

ucv_careers = [
    {
        "slug": "administracion-y-marketing",
        "name": "Administración y Marketing",
        "faculty": "Facultad de Ciencias Empresariales",
        "degree": "Bachiller en Administración y Marketing",
        "title": "Licenciado en Administración y Marketing",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Certificado en Inteligencia de Mercados",
            "VIII ciclo: Analista en Marketing Digital",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos de Marketing", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Administración", "Cátedra Vallejo", "Economía", "Inglés II"],
            3: ["Creatividad e Innovación", "Gestión Organizacional y Talento Humano", "Comportamiento del Consumidor y Neuromarketing", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Matemática para las Finanzas", "Investigación Cualitativa e Insights", "Gestión de Producto y Marca", "Inglés IV"],
            5: ["Investigación Cuantitativa", "Contabilidad y Finanzas", "Marketing Digital", "Constitución y Derechos Humanos", "Inglés V"],
            6: ["Inteligencia Comercial y Métricas de Marketing", "Estrategias de Distribución y Precio", "Redes Sociales y Marketing de Contenidos", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Gerencia de Ventas y Trademarketing", "Estrategias de Comunicación y Promoción", "Marketing de Servicios y Relacional", "Filosofía y Ética", "Inglés VII"],
            8: ["Marketing Estratégico", "Gestión de Negocios y Campañas Digitales", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "arquitectura",
        "name": "Arquitectura",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Arquitectura",
        "title": "Arquitecto",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Analista CAD y Sistema BIM",
            "VIII ciclo: Asistente de Residente en Obras de Edificaciones",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos en Arquitectura", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Historia y Teoría de la Arquitectura", "Cátedra Vallejo", "Expresión Gráfica", "Inglés II"],
            3: ["Creatividad e Innovación", "Dibujo Arquitectónico", "Topografía", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "El Hombre y su Contexto", "Modelamiento BIM en Edificaciones", "Orientación Estructural", "Inglés IV"],
            5: ["Arquitectura y Habilitación Urbana", "Accesibilidad y Diseño Universal", "Construcción I", "Constitución y Derechos Humanos", "Inglés V"],
            6: ["Arquitectura y Equipamiento Metropolitano", "Tecnología Ambiental I", "Acondicionamiento Territorial", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Ciudad y Patrimonio Histórico", "Construcción II", "Planificación Urbana, Desarrollo Territorial y Rural", "Filosofía y Ética", "Inglés VII"],
            8: ["Arquitectura e Intervención Urbana", "Tecnología Ambiental II", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "ciencias-de-la-comunicacion",
        "name": "Ciencias de la Comunicación",
        "faculty": "Facultad de Derecho y Humanidades",
        "degree": "Bachiller en Ciencias de la Comunicación",
        "title": "Licenciado en Ciencias de la Comunicación",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Realización Audiovisual",
            "VIII ciclo: Analista de Medios Digitales",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos de la Comunicación", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Tecnologías Emergentes y sus Aplicaciones", "Cátedra Vallejo", "Comunicación, Sociedad y Cultura", "Inglés II"],
            3: ["Inclusión y Accesibilidad", "Creatividad e Innovación", "Comunicación Corporativa", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Semiótica", "Sociología de la Comunicación", "Lenguaje Audiovisual y Cinematográfico", "Inglés IV"],
            5: ["Constitución y Derechos Humanos", "Periodismo Multimedial", "Diseño y Producción Publicitaria", "Fotografía", "Inglés V"],
            6: ["Taller de Guion Audiovisual", "Planeación Estratégica de la Comunicación Organizacional", "Comunicación para el Cambio Social", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Filosofía y Ética", "Diseño y Desarrollo de Proyectos de Comunicación para el Cambio Social", "Responsabilidad Social Corporativa", "Taller de Edición y Montaje", "Inglés VII"],
            8: ["Comunicación Digital y Gestión de Redes Sociales", "Producción Audiovisual Digital", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "contabilidad",
        "name": "Contabilidad",
        "faculty": "Facultad de Ciencias Empresariales",
        "degree": "Bachiller en Contabilidad",
        "title": "Contador Público",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Asistente Contable",
            "VIII ciclo: Analista Financiero",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos de Contabilidad", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Cátedra Vallejo", "Economía", "Contabilidad Empresarial", "Inglés II"],
            3: ["Creatividad e Innovación", "Administración", "Comercio Internacional", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Tributación", "Contabilidad Gubernamental", "Matemática para las Finanzas", "Inglés IV"],
            5: ["Normas Contables", "Tributación Aplicada", "Constitución y Derechos Humanos", "Costos y Presupuestos", "Inglés V"],
            6: ["Control Interno", "Planeamiento Tributario", "Costos Industriales", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Auditoría Financiera", "Finanzas", "Análisis e Interpretación de Estados Financieros", "Filosofía y Ética", "Inglés VII"],
            8: ["Auditoría Integral", "Tendencias en Contabilidad", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "derecho",
        "name": "Derecho",
        "faculty": "Facultad de Derecho y Humanidades",
        "degree": "Bachiller en Derecho",
        "title": "Abogado",
        "total_cycles": 12,
        "total_credits": 240,
        "certifications": [
            "VIII ciclo: Analista Legal Corporativo",
            "X ciclo: Analista en Proceso Judicial",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos del Derecho y Sistema Jurídico", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Teoría General del Derecho", "Cátedra Vallejo", "Tecnologías Emergentes y sus Aplicaciones", "Inglés II"],
            3: ["Creatividad e Innovación", "Derecho Constitucional y Ciencia Política", "Inclusión y Accesibilidad", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Derecho de Personas", "Derecho Administrativo", "Mecanismos Alternativos de Resolución de Conflictos", "Inglés IV"],
            5: ["Derecho Penal I", "Constitución y Derechos Humanos", "Acto Jurídico", "Derecho del Proceso Administrativo y Contencioso", "Inglés V"],
            6: ["Derecho Penal II", "Derechos Reales", "Derecho Tributario", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Filosofía y Ética", "Derecho Procesal Penal", "Derecho de los Contratos y Obligaciones", "Derecho Corporativo I", "Inglés VII"],
            8: ["Derecho Procesal Civil", "Derecho Corporativo II", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Derecho Internacional Público", "Derecho Procesal Constitucional", "Derecho de Familia y Sucesiones", "Derecho Laboral", "Inglés IX"],
            10: ["Derecho Internacional Privado", "Argumentación Jurídica y Destrezas Legales", "Derecho Procesal Laboral", "Práctica Preliminar", "Inglés X"],
            11: ["Trabajo de Investigación I", "Práctica Preprofesional I"],
            12: ["Trabajo de Investigación II", "Práctica Preprofesional II"]
        }
    },
    {
        "slug": "ingenieria-ambiental",
        "name": "Ingeniería Ambiental",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería Ambiental",
        "title": "Ingeniero Ambiental",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Analista en Gestión de Riesgos",
            "VIII ciclo: Analista en Sistemas de Gestión Integrado",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos en Ingeniería Ambiental", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Química Orgánica e Inorgánica", "Cátedra Vallejo", "Expresión Gráfica", "Inglés II"],
            3: ["Creatividad e Innovación", "Biología y Ecología", "Matemática para la Ingeniería", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Física General", "Cálculo Integral y Ecuaciones Diferenciales", "Química Analítica y Ambiental", "Inglés IV"],
            5: ["Gestión y Tratamiento de Suelos", "Constitución y Derechos Humanos", "Gestión de Riesgos Ambientales y Desastres", "Accesibilidad y Diseño Universal", "Inglés V"],
            6: ["Gestión y Tratamiento de la Contaminación Atmosférica", "Gestión y Tratamiento de Aguas", "Sistema de Gestión Integrado y Política Ambiental", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Filosofía y Ética", "Evaluación de Impacto Ambiental", "Gestión y Tratamiento de los Residuos Sólidos", "Monitoreo Ambiental y Resolución de Conflicto", "Inglés VII"],
            8: ["Biotecnología y Remediación Ambiental", "Cartografía y Aplicaciones Geoespacial", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "ingenieria-civil",
        "name": "Ingeniería Civil",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería Civil",
        "title": "Ingeniero Civil",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Asistente en Geomática",
            "VIII ciclo: Asistente en Obras Civiles",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos en Ingeniería Civil", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Tecnología del Concreto y Materiales", "Cátedra Vallejo", "Expresión Gráfica", "Inglés II"],
            3: ["Creatividad e Innovación", "Topografía y Geodesia", "Matemática para la Ingeniería", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Cálculo Integral y Ecuaciones Diferenciales", "Física General", "Mecánica de Suelos", "Inglés IV"],
            5: ["Accesibilidad y Diseño Universal", "Mecánica Estructural", "Caminos y Pavimentos", "Constitución y Derechos Humanos", "Inglés V"],
            6: ["Mecánica de Fluidos e Hidráulica", "Análisis Estructural", "Ingeniería de Transportes y Diseño Vial", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Ingeniería Sanitaria", "Ingeniería de la Construcción", "Diseño de Concreto Armado", "Filosofía y Ética", "Inglés VII"],
            8: ["Ingeniería de Obras Hidráulicas", "BIM Aplicado a Obras Civiles", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "ingenieria-de-sistemas",
        "name": "Ingeniería de Sistemas",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería de Sistemas",
        "title": "Ingeniero de Sistemas",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Analista en Ciencia de Datos",
            "VIII ciclo: Desarrollador de Soluciones Tecnológicas con Inteligencia Artificial",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III", "Computación IV", "Computación V"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos en Ingeniería de Sistemas", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Algoritmos y Programación", "Cátedra Vallejo", "Expresión Gráfica", "Inglés II"],
            3: ["Creatividad e Innovación", "Fundamentos de Modelado y Animación", "Matemática para la Ingeniería", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Cálculo Integral y Ecuaciones Diferenciales", "Física General", "Programación Orientada a Objetos", "Inglés IV"],
            5: ["Accesibilidad y Diseño Universal", "Constitución y Derechos Humanos", "Gestión de Datos e Información", "Redes Inalámbricas y Telefonía IP", "Inglés V"],
            6: ["Ingeniería de Software", "Administración de Servidores Multiplataforma", "Inteligencia de Negocios", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Filosofía y Ética", "Machine Learning", "Ciberseguridad", "Tecnología Web y Cloud Computing", "Inglés VII"],
            8: ["Patrones de Diseño de Realidad Virtual", "Programación de Aplicaciones Móviles", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "ingenieria-industrial",
        "name": "Ingeniería Industrial",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería Industrial",
        "title": "Ingeniero Industrial",
        "total_cycles": 10,
        "total_credits": 200,
        "certifications": [
            "VI ciclo: Analista en Sistemas de Producción",
            "VIII ciclo: Analista en Sistemas Integrados de Gestión",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos en Ingeniería Industrial", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Química General", "Cátedra Vallejo", "Expresión Gráfica", "Inglés II"],
            3: ["Creatividad e Innovación", "Economía y Finanzas", "Matemática para la Ingeniería", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Cálculo Integral y Ecuaciones Diferenciales", "Física General", "Contabilidad Gerencial y Costos", "Inglés IV"],
            5: ["Accesibilidad y Diseño Universal", "Estudio del Trabajo", "Investigación de Operaciones", "Constitución y Derechos Humanos", "Inglés V"],
            6: ["Simulación e Inteligencia de Datos", "Tecnología y Sistemas de Producción", "Ergonomía, Seguridad y Salud Ocupacional", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Dirección Táctica de Operaciones", "Gestión y Control de Calidad", "Logística Integrada y Cadena de Suministro", "Filosofía y Ética", "Inglés VII"],
            8: ["Dirección Estratégica de Operaciones", "Sistemas Integrados de Gestión", "Experiencia Curricular Electiva", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Trabajo de Investigación I", "Práctica Preprofesional I", "Inglés IX"],
            10: ["Trabajo de Investigación II", "Práctica Preprofesional II", "Inglés X"]
        }
    },
    {
        "slug": "medicina-humana",
        "name": "Medicina Humana",
        "faculty": "Facultad de Ciencias de la Salud",
        "degree": "Bachiller en Medicina",
        "title": "Médico Cirujano",
        "total_cycles": 14,
        "total_credits": 284,
        "certifications": [
            "VII ciclo: Promotor en Salud Familiar y Comunitaria",
            "IX ciclo: Certificado en Primeros Auxilios",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos de Medicina", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Salud Pública", "Cátedra Vallejo", "Química", "Inglés II"],
            3: ["Creatividad e Innovación", "Salud Pública y Atención Primaria", "Biofísica", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Epidemiología", "Biología Celular, Molecular y Bioquímica", "Embriología y Genética", "Inglés IV"],
            5: ["Constitución y Derechos Humanos", "Anatomía", "Fisiología", "Histología", "Inglés V"],
            6: ["Microbiología y Parasitología", "Fisiopatología", "Laboratorio Clínico", "Farmacología", "Inglés VI"],
            7: ["Semiología", "Integración de Ciencias Básicas y Clínicas", "Filosofía y Ética", "Experiencia Curricular Electiva", "Inglés VII"],
            8: ["Medicina", "Habilidades Clínicas", "Inmunología Clínica", "Gestión de Proyectos", "Inglés VIII"],
            9: ["Cirugía", "Técnicas Quirúrgicas", "Medicina Legal", "Experiencia Curricular Electiva", "Inglés IX"],
            10: ["Ginecología y Obstetricia", "Habilidades en Ginecología y Obstetricia", "Psiquiatría", "Imagenología", "Inglés X"],
            11: ["Sistemas de Salud", "Pediatría", "Habilidades en Pediatría", "Trabajo de Investigación I"],
            12: ["Farmacología Clínica", "Preinternado", "Trabajo de Investigación II"],
            13: ["Internado Primer Nivel de Atención", "Internado Medicina", "Internado Cirugía"],
            14: ["Internado Pediatría", "Internado Ginecología y Obstetricia", "Trabajo de Investigación III"]
        }
    },
    {
        "slug": "psicologia",
        "name": "Psicología",
        "faculty": "Facultad de Ciencias de la Salud",
        "degree": "Bachiller en Psicología",
        "title": "Licenciado en Psicología",
        "total_cycles": 11,
        "total_credits": 220,
        "certifications": [
            "VI ciclo: Certificado en Aplicación de Instrumentos de Evaluación Psicológica",
            "VIII ciclo: Promotor en Salud Mental",
            "Emprendimiento Innovador con Rostro Humano"
        ],
        "complementary": [
            "Computación I", "Computación II", "Computación III"
        ],
        "cycles": {
            1: ["Pensamiento Lógico", "Habilidades Comunicativas", "Objetivos de Desarrollo Sostenible", "Fundamentos de la Psicología", "Inglés I"],
            2: ["Cambio Climático y Gestión de Riesgos", "Cátedra Vallejo", "Salud Pública", "Bases Biológicas del Comportamiento", "Inglés II"],
            3: ["Creatividad e Innovación", "Psicología de las Organizaciones", "Psicología del Desarrollo", "Estadística y Análisis de Datos", "Inglés III"],
            4: ["Metodología de la Investigación Científica", "Epidemiología", "Psicología Educativa", "Técnicas de la Entrevista y la Observación Psicológica", "Inglés IV"],
            5: ["Constitución y Derechos Humanos", "Técnicas Proyectivas", "Neuropsicología", "Psicología Clínica", "Inglés V"],
            6: ["Programas de Promoción, Prevención e Intervención en Psicología", "Pruebas Psicométricas para Niños", "Psicopatología", "Experiencia Curricular Electiva", "Inglés VI"],
            7: ["Pruebas Psicométricas para Adultos", "Diagnóstico e Informe Psicológico", "Filosofía y Ética", "Psicología Experimental", "Inglés VII"],
            8: ["Gestión de Proyectos", "Prácticas Departamentales I", "Psicoterapia Individual", "Experiencia Curricular Electiva", "Inglés VIII"],
            9: ["Psicoterapia de Grupo y de Familia", "Psicometría", "Evaluación y Selección de Personas", "Prácticas Departamentales II", "Inglés IX"],
            10: ["Trabajo de Investigación I", "Internado I", "Inglés X"],
            11: ["Trabajo de Investigación II", "Internado II"]
        }
    }
]

out_file = "scratch/ucv_curricula_verified.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(ucv_careers, f, ensure_ascii=False, indent=2)

print(f"[OK] Extracted & verified {len(ucv_careers)} UCV careers into {out_file}!")

# Total course summary
total_courses = 0
for c in ucv_careers:
    c_courses = sum(len(courses) for courses in c["cycles"].values())
    total_courses += c_courses
    print(f"- {c['name']} ({c['slug']}): {c['total_cycles']} ciclos | {c_courses} cursos | {c['total_credits']} creditos")

print(f"\nTotal de cursos UCV extraidos: {total_courses}")
