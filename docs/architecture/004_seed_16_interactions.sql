-- ============================================================================
-- MIGRACIÓN 004: SEMBRADO DE 16 INTERACCIONES EN 4 MISIONES (CHASKI AVENTURA)
-- ============================================================================

-- 1. Agregar columnas opcionales a questionnaire_questions si no existen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questionnaire_questions' AND column_name = 'mission_number'
  ) THEN
    ALTER TABLE questionnaire_questions ADD COLUMN mission_number INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questionnaire_questions' AND column_name = 'interaction_type'
  ) THEN
    ALTER TABLE questionnaire_questions ADD COLUMN interaction_type VARCHAR(50) DEFAULT 'CHOICE';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questionnaire_questions' AND column_name = 'helper_text'
  ) THEN
    ALTER TABLE questionnaire_questions ADD COLUMN helper_text TEXT;
  END IF;
END $$;

-- 2. Limpiar o desactivar preguntas previas del piloto para evitar mezcla de scoring
UPDATE questionnaire_questions SET is_active = false WHERE id > 16;

-- 3. Insertar / Actualizar las 16 preguntas
INSERT INTO questionnaire_questions (id, code, dimension, question_text, question_type, order_number, is_active, mission_number, interaction_type, helper_text)
VALUES
  -- Misión 1 (1 a 4)
  (1, 'Q01_FREE_AFTERNOON', 'TECH', 'Tienes una tarde libre. ¿Qué reto probarías?', 'SINGLE_CHOICE', 1, true, 1, 'CHOICE', 'Elige la actividad que harías por pura curiosidad.'),
  (2, 'Q02_MYSTERY_BOX', 'INVESTIGATIVE', 'Te entregan una caja misteriosa con piezas y mecanismos. ¿Qué haces primero?', 'SINGLE_CHOICE', 2, true, 1, 'SCENARIO', 'Sigue tu primer instinto frente a lo desconocido.'),
  (3, 'Q03_CURIOSITY_PROJECT', 'LOGIC', '¿Cuál de estos proyectos te daría más curiosidad desarrollar?', 'SINGLE_CHOICE', 3, true, 1, 'CHOICE', 'Imagina que tienes todas las herramientas para lograrlo.'),
  (4, 'Q04_PROUD_ACHIEVEMENT', 'ENTERPRISING', '¿Qué logro te haría pensar con orgullo: ''esto fue gracias a mí''?', 'SINGLE_CHOICE', 4, true, 1, 'CHOICE', 'Visualiza el impacto que más valoras.'),

  -- Misión 2 (5 a 8)
  (5, 'Q05_PROJECT_BLOCKED', 'LOGIC', 'Tu proyecto se bloquea con un error y nadie sabe por qué. ¿Qué haces?', 'SINGLE_CHOICE', 5, true, 2, 'SCENARIO', 'No hay camino incorrecto; responde cómo sueles actuar.'),
  (6, 'Q06_LEARN_NEW_TOOL', 'TECH', 'Tienes que aprender una herramienta o software nuevo. ¿Cómo prefieres?', 'SINGLE_CHOICE', 6, true, 2, 'CHOICE', 'Piensa en cómo aprendes mejor.'),
  (7, 'Q07_UNSEEN_CHALLENGE', 'REALISTIC', 'Aparece un desafío que nunca has visto. ¿Qué te motiva más?', 'SINGLE_CHOICE', 7, true, 2, 'SCENARIO', 'Lo que te genera chispa mental frente al reto.'),
  (8, 'Q08_THREE_PATHS_TIME', 'ENTERPRISING', 'Tu equipo tiene tres caminos posibles y muy poco tiempo para decidir.', 'SINGLE_CHOICE', 8, true, 2, 'CHOICE', '¿En qué criterio confías más bajo presión?'),

  -- Misión 3 (9 a 12)
  (9, 'Q09_TEAM_ROLE', 'REALISTIC', 'Tu equipo recibe un proyecto desde cero. ¿Qué rol escogerías?', 'SINGLE_CHOICE', 9, true, 3, 'ROLE', 'El papel donde sientes que aportas con más energía.'),
  (10, 'Q10_PEER_DIFFICULTY', 'SOCIAL', 'Una persona de tu equipo está teniendo dificultades para avanzar.', 'SINGLE_CHOICE', 10, true, 3, 'SCENARIO', '¿Cómo reaccionas naturalmente frente a esa situación?'),
  (11, 'Q11_ENJOY_ENVIRONMENT', 'ARTISTIC', '¿Dónde te imaginarías disfrutando más tu jornada en un proyecto?', 'SINGLE_CHOICE', 11, true, 3, 'CHOICE', 'El espacio que te inspiraría cada día.'),
  (12, 'Q12_DISORGANIZED_IDEA', 'CONVENTIONAL', 'Tu grupo tiene una gran idea, pero nadie la está ordenando.', 'SINGLE_CHOICE', 12, true, 3, 'SCENARIO', 'El paso que darías para ponerla en marcha.'),

  -- Misión 4 (13 a 16)
  (13, 'Q13_ONE_WEEK_IMMERSION', 'TECH', 'Puedes pasar una semana de inmersión en uno de estos lugares. ¿Cuál eliges?', 'SINGLE_CHOICE', 13, true, 4, 'FUTURE', 'La experiencia que no te querrías perder.'),
  (14, 'Q14_PROFESSION_FREEDOM', 'ENTERPRISING', 'Tu profesión te da libertad total para crear algo propio. ¿Qué crearías?', 'SINGLE_CHOICE', 14, true, 4, 'FUTURE', 'Tu legado profesional soñado.'),
  (15, 'Q15_GLOBAL_PROBLEM', 'SOCIAL', '¿Qué problema te gustaría ayudar a solucionar en el mundo?', 'SINGLE_CHOICE', 15, true, 4, 'CHOICE', 'La causa que te inspiraría levantarte cada mañana.'),
  (16, 'Q16_FINAL_DESTINY', 'LOGIC', 'Decisión final: Chaski te muestra 4 grandes caminos. ¿Hacia dónde te inclinas?', 'SINGLE_CHOICE', 16, true, 4, 'CHOICE', 'No lo pienses demasiado. Elige el sendero que más vibre contigo.')
ON CONFLICT (id) DO UPDATE SET 
  code = EXCLUDED.code,
  dimension = EXCLUDED.dimension,
  question_text = EXCLUDED.question_text,
  order_number = EXCLUDED.order_number,
  is_active = EXCLUDED.is_active,
  mission_number = EXCLUDED.mission_number,
  interaction_type = EXCLUDED.interaction_type,
  helper_text = EXCLUDED.helper_text;

-- 4. Opciones de respuesta para las 16 preguntas (64 opciones en total)
DELETE FROM questionnaire_options WHERE question_id BETWEEN 1 AND 16;

INSERT INTO questionnaire_options (id, question_id, option_text, score_payload)
VALUES
  -- Q01
  (101, 1, 'Crear una aplicación o herramienta digital que solucione algo.', '{"TECH": 3, "LOGIC": 1}'::jsonb),
  (102, 1, 'Diseñar algo que sorprenda visualmente o comunique una idea.', '{"ARTISTIC": 3, "TECH": 1}'::jsonb),
  (103, 1, 'Investigar por qué ocurre un fenómeno intrigante hasta entenderlo.', '{"INVESTIGATIVE": 3, "LOGIC": 1}'::jsonb),
  (104, 1, 'Crear una idea de negocio o proyecto para emprender.', '{"ENTERPRISING": 3, "CONVENTIONAL": 1}'::jsonb),

  -- Q02
  (201, 2, 'Intentar abrirla y probar cómo funciona su mecanismo.', '{"REALISTIC": 3, "TECH": 1}'::jsonb),
  (202, 2, 'Buscar pistas y deducir qué contiene antes de abrirla.', '{"INVESTIGATIVE": 3, "LOGIC": 1}'::jsonb),
  (203, 2, 'Imaginar qué podría ser y construir una historia a su alrededor.', '{"ARTISTIC": 2, "INVESTIGATIVE": 2}'::jsonb),
  (204, 2, 'Preguntar a los demás y contrastar teorías en grupo.', '{"SOCIAL": 3, "INVESTIGATIVE": 1}'::jsonb),

  -- Q03
  (301, 3, 'Construir un prototipo funcional físico o electrónico.', '{"REALISTIC": 3, "TECH": 1}'::jsonb),
  (302, 3, 'Analizar datos y estadísticas para descubrir un patrón.', '{"LOGIC": 3, "INVESTIGATIVE": 1}'::jsonb),
  (303, 3, 'Crear una campaña publicitaria o experiencia visual memorable.', '{"ARTISTIC": 3, "ENTERPRISING": 1}'::jsonb),
  (304, 3, 'Organizar una iniciativa para ayudar y orientar a personas.', '{"SOCIAL": 3, "ENTERPRISING": 1}'::jsonb),

  -- Q04
  (401, 4, 'Haber creado una solución técnica innovadora y útil.', '{"TECH": 2, "REALISTIC": 1, "LOGIC": 1}'::jsonb),
  (402, 4, 'Haber descubierto una respuesta que nadie lograba ver.', '{"INVESTIGATIVE": 3, "LOGIC": 1}'::jsonb),
  (403, 4, 'Haber creado una obra, diseño o mensaje de gran impacto.', '{"ARTISTIC": 3, "TECH": 1}'::jsonb),
  (404, 4, 'Haber liderado a un equipo para alcanzar una meta ambiciosa.', '{"ENTERPRISING": 2, "SOCIAL": 2}'::jsonb),

  -- Q05
  (501, 5, 'Revisar paso a paso y de forma metódica hasta hallar el error.', '{"LOGIC": 3, "CONVENTIONAL": 1}'::jsonb),
  (502, 5, 'Hacer pruebas prácticas directas hasta dar con lo que funciona.', '{"REALISTIC": 2, "TECH": 2}'::jsonb),
  (503, 5, 'Investigar si alguien resolvió un problema similar en la literatura.', '{"INVESTIGATIVE": 3, "CONVENTIONAL": 1}'::jsonb),
  (504, 5, 'Reunir al equipo y buscar una solución compartida.', '{"SOCIAL": 3, "ENTERPRISING": 1}'::jsonb),

  -- Q06
  (601, 6, 'Experimentar directamente con sus botones y opciones.', '{"REALISTIC": 2, "TECH": 2}'::jsonb),
  (602, 6, 'Entender primero la lógica y fundamentos de cómo fue diseñada.', '{"INVESTIGATIVE": 2, "LOGIC": 2}'::jsonb),
  (603, 6, 'Buscar una forma creativa de usarla para un diseño o idea.', '{"ARTISTIC": 3, "TECH": 1}'::jsonb),
  (604, 6, 'Pedir consejos a personas que la dominen y aprender juntos.', '{"SOCIAL": 3, "CONVENTIONAL": 1}'::jsonb),

  -- Q07
  (701, 7, 'Descubrir la lógica y los patrones ocultos detrás del problema.', '{"LOGIC": 3, "INVESTIGATIVE": 1}'::jsonb),
  (702, 7, 'Construir una solución práctica tangible con tus manos o código.', '{"REALISTIC": 3, "TECH": 1}'::jsonb),
  (703, 7, 'Encontrar una solución fuera de lo común que nadie haya pensado.', '{"ARTISTIC": 2, "INVESTIGATIVE": 2}'::jsonb),
  (704, 7, 'Conseguir que otras personas se entusiasmen y se sumen al reto.', '{"ENTERPRISING": 3, "SOCIAL": 1}'::jsonb),

  -- Q08
  (801, 8, 'Comparar datos objetivos, probabilidades y evaluar riesgos.', '{"LOGIC": 2, "INVESTIGATIVE": 2}'::jsonb),
  (802, 8, 'Elegir la ruta más práctica, segura y de ejecución directa.', '{"REALISTIC": 3, "CONVENTIONAL": 1}'::jsonb),
  (803, 8, 'Proponer una alternativa ingeniosa que reformule el problema.', '{"ARTISTIC": 3, "ENTERPRISING": 1}'::jsonb),
  (804, 8, 'Alinear criterios en el equipo, mediar y tomar la decisión final.', '{"ENTERPRISING": 2, "SOCIAL": 2}'::jsonb),

  -- Q09
  (901, 9, 'Constructor: diseñar la arquitectura técnica y hacer que opere.', '{"REALISTIC": 2, "TECH": 2}'::jsonb),
  (902, 9, 'Estratega: analizar los requerimientos y planificar las fases.', '{"LOGIC": 2, "CONVENTIONAL": 2}'::jsonb),
  (903, 9, 'Creativo: darle una identidad única y una experiencia atractiva.', '{"ARTISTIC": 3, "TECH": 1}'::jsonb),
  (904, 9, 'Líder: organizar las prioridades y motivar al equipo al objetivo.', '{"ENTERPRISING": 3, "SOCIAL": 1}'::jsonb),

  -- Q10
  (1001, 10, 'Sentarte con ella a escucharla con empatía y brindarle apoyo.', '{"SOCIAL": 3, "CONVENTIONAL": 1}'::jsonb),
  (1002, 10, 'Explicarle un método ordenado paso a paso para destrabarla.', '{"LOGIC": 2, "SOCIAL": 2}'::jsonb),
  (1003, 10, 'Sugerirle otra forma creativa de encarar la tarea más fácil.', '{"ARTISTIC": 2, "SOCIAL": 1, "TECH": 1}'::jsonb),
  (1004, 10, 'Reorganizar responsabilidades del grupo para cumplir a tiempo.', '{"ENTERPRISING": 3, "SOCIAL": 1}'::jsonb),

  -- Q11
  (1101, 11, 'Frente a una estación tecnológica creando soluciones y software.', '{"TECH": 3, "LOGIC": 1}'::jsonb),
  (1102, 11, 'En un centro de investigación analizando teorías y evidencia.', '{"INVESTIGATIVE": 3, "CONVENTIONAL": 1}'::jsonb),
  (1103, 11, 'En un estudio de diseño o agencia conceptualizando proyectos.', '{"ARTISTIC": 3, "TECH": 1}'::jsonb),
  (1104, 11, 'En reuniones de trabajo coordinando con personas y negociando.', '{"SOCIAL": 2, "ENTERPRISING": 2}'::jsonb),

  -- Q12
  (1201, 12, 'Crear un cronograma ordenado y estructurar tareas claras.', '{"CONVENTIONAL": 3, "LOGIC": 1}'::jsonb),
  (1202, 12, 'Tomar una parte y construir un prototipo rápido para probar.', '{"REALISTIC": 2, "TECH": 2}'::jsonb),
  (1203, 12, 'Diseñar la parte visual o comunicacional para que se entienda.', '{"ARTISTIC": 3, "ENTERPRISING": 1}'::jsonb),
  (1204, 12, 'Asumir la iniciativa, delegar funciones y comprometer al grupo.', '{"ENTERPRISING": 3, "SOCIAL": 1}'::jsonb),

  -- Q13
  (1301, 13, 'En una empresa de tecnología o desarrollo de inteligencia artificial.', '{"TECH": 3, "LOGIC": 1}'::jsonb),
  (1302, 13, 'En un laboratorio de investigación científica o data science.', '{"INVESTIGATIVE": 3, "LOGIC": 1}'::jsonb),
  (1303, 13, 'En una agencia de publicidad, branding o producción de contenidos.', '{"ARTISTIC": 3, "ENTERPRISING": 1}'::jsonb),
  (1304, 13, 'En una organización social o de desarrollo del talento humano.', '{"SOCIAL": 3, "ENTERPRISING": 1}'::jsonb),

  -- Q14
  (1401, 14, 'Una herramienta digital o sistema tecnológico que simplifique vidas.', '{"TECH": 3, "LOGIC": 1}'::jsonb),
  (1402, 14, 'Un modelo científico o estudio riguroso que revele algo nuevo.', '{"INVESTIGATIVE": 3, "LOGIC": 1}'::jsonb),
  (1403, 14, 'Una marca, propuesta estética o contenido que emocione e inspire.', '{"ARTISTIC": 3, "SOCIAL": 1}'::jsonb),
  (1404, 14, 'Una empresa rentable con impacto positivo y expansión de mercado.', '{"ENTERPRISING": 3, "SOCIAL": 1}'::jsonb),

  -- Q15
  (1501, 15, 'Problemas complejos de automatización, ciberseguridad y datos.', '{"TECH": 2, "LOGIC": 2}'::jsonb),
  (1502, 15, 'Enigmas científicos o fenómenos que aún no se comprenden bien.', '{"INVESTIGATIVE": 3, "LOGIC": 1}'::jsonb),
  (1503, 15, 'Desafíos de comunicación, cultura e innovación de experiencias.', '{"ARTISTIC": 3, "ENTERPRISING": 1}'::jsonb),
  (1504, 15, 'Problemas que afectan directamente el bienestar y salud de personas.', '{"SOCIAL": 3, "ENTERPRISING": 1}'::jsonb),

  -- Q16
  (1601, 16, 'Crear y construir: diseñar soluciones prácticas y tecnología.', '{"REALISTIC": 2, "TECH": 2}'::jsonb),
  (1602, 16, 'Descubrir y comprender: profundizar en el saber y la evidencia.', '{"INVESTIGATIVE": 2, "LOGIC": 2}'::jsonb),
  (1603, 16, 'Imaginar y expresar: dar vida a ideas originales e inspiradoras.', '{"ARTISTIC": 3, "SOCIAL": 1}'::jsonb),
  (1604, 16, 'Liderar y transformar: dirigir proyectos, innovar y emprender.', '{"ENTERPRISING": 3, "SOCIAL": 1}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  option_text = EXCLUDED.option_text,
  score_payload = EXCLUDED.score_payload;
