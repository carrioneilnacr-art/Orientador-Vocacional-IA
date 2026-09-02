-- ============================================================================
-- MIGRACIÓN 001: ESQUEMA INICIAL COMPLETO DEL ORIENTADOR VOCACIONAL IA
-- Motor: PostgreSQL 17 (Supabase)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. FUENTES DE VERDAD Y TRAZABILIDAD
CREATE TABLE IF NOT EXISTS sources (
  id BIGSERIAL PRIMARY KEY,
  source_name TEXT NOT NULL,
  publisher TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  published_date DATE,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until DATE,
  document_version TEXT,
  notes TEXT
);

-- 2. INSTITUCIONES
CREATE TABLE IF NOT EXISTS institutions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT UNIQUE NOT NULL,
  institution_type TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SEDES / CAMPUS
CREATE TABLE IF NOT EXISTS campuses (
  id BIGSERIAL PRIMARY KEY,
  institution_id BIGINT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT DEFAULT 'Lima',
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  map_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campuses_institution ON campuses(institution_id);
CREATE INDEX IF NOT EXISTS idx_campuses_district ON campuses(district);

-- 4. CARRERAS PROFESIONALES
CREATE TABLE IF NOT EXISTS careers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  faculty TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_semesters INTEGER NOT NULL DEFAULT 10,
  duration_years NUMERIC(4,2) NOT NULL DEFAULT 5.0,
  degree TEXT NOT NULL,
  license_or_accreditation TEXT,
  general_profile TEXT,
  general_work_fields TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_faculty ON careers(faculty);

-- 5. OFERTA ACADÉMICA (Institución + Campus + Carrera + Modalidad)
CREATE TABLE IF NOT EXISTS academic_offers (
  id BIGSERIAL PRIMARY KEY,
  institution_id BIGINT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  campus_id BIGINT NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  career_id BIGINT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  modality TEXT NOT NULL DEFAULT 'PRESENCIAL',
  admission_status TEXT NOT NULL DEFAULT 'ACTIVE',
  official_url TEXT,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
  UNIQUE(institution_id, campus_id, career_id, modality)
);

CREATE INDEX IF NOT EXISTS idx_offers_institution ON academic_offers(institution_id);
CREATE INDEX IF NOT EXISTS idx_offers_campus ON academic_offers(campus_id);
CREATE INDEX IF NOT EXISTS idx_offers_career ON academic_offers(career_id);

-- 6. MALLAS CURRICULARES
CREATE TABLE IF NOT EXISTS curricula (
  id BIGSERIAL PRIMARY KEY,
  academic_offer_id BIGINT NOT NULL REFERENCES academic_offers(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  academic_year INTEGER NOT NULL,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
  published_at DATE,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_curricula_offer ON curricula(academic_offer_id);

-- 7. CURSOS DE LA MALLA
CREATE TABLE IF NOT EXISTS curriculum_courses (
  id BIGSERIAL PRIMARY KEY,
  curriculum_id BIGINT NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
  cycle INTEGER NOT NULL,
  course_code TEXT,
  course_name TEXT NOT NULL,
  credits NUMERIC(4,2),
  course_type TEXT DEFAULT 'OBLIGATORIO',
  prerequisite TEXT,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_curriculum ON curriculum_courses(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_courses_cycle ON curriculum_courses(curriculum_id, cycle);

-- 8. PENSIONES Y TARIFAS
CREATE TABLE IF NOT EXISTS tuition_fees (
  id BIGSERIAL PRIMARY KEY,
  academic_offer_id BIGINT NOT NULL REFERENCES academic_offers(id) ON DELETE CASCADE,
  category TEXT,
  concept TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PEN',
  academic_year INTEGER NOT NULL DEFAULT 2026,
  valid_from DATE,
  valid_until DATE,
  conditions TEXT,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tuition_offer ON tuition_fees(academic_offer_id);

-- 9. BECAS Y FINANCIAMIENTO
CREATE TABLE IF NOT EXISTS scholarships (
  id BIGSERIAL PRIMARY KEY,
  institution_id BIGINT REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  benefit TEXT NOT NULL,
  eligibility_summary TEXT,
  requirements TEXT,
  application_url TEXT,
  valid_from DATE,
  valid_until DATE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_scholarships_institution ON scholarships(institution_id);

-- 10. REGLAS ESPECÍFICAS DE BECAS
CREATE TABLE IF NOT EXISTS scholarship_rules (
  id BIGSERIAL PRIMARY KEY,
  scholarship_id BIGINT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL,
  operator TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scholarship_rules ON scholarship_rules(scholarship_id);

-- 11. INDICADORES DE EMPLEABILIDAD
CREATE TABLE IF NOT EXISTS employment_indicators (
  id BIGSERIAL PRIMARY KEY,
  institution_id BIGINT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  career_id BIGINT REFERENCES careers(id) ON DELETE CASCADE,
  indicator_type TEXT NOT NULL,
  indicator_value NUMERIC(12,4) NOT NULL,
  unit TEXT NOT NULL DEFAULT '%',
  year INTEGER NOT NULL,
  methodology TEXT,
  notes TEXT,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_employment_institution ON employment_indicators(institution_id);
CREATE INDEX IF NOT EXISTS idx_employment_career ON employment_indicators(career_id);

-- 12. HABILIDADES / COMPETENCIAS
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT
);

-- 13. RELACIÓN CARRERA - HABILIDADES
CREATE TABLE IF NOT EXISTS career_skills (
  id BIGSERIAL PRIMARY KEY,
  career_id BIGINT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  weight NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
  UNIQUE(career_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_career_skills ON career_skills(career_id, skill_id);

-- 14. PREGUNTAS DEL CUESTIONARIO VOCACIONAL
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  dimension TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'SINGLE_CHOICE',
  order_number INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_questions_dimension ON questionnaire_questions(dimension);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questionnaire_questions(order_number);

-- 15. OPCIONES DE RESPUESTA CON SCORING MULTIVARIADO (JSONB)
CREATE TABLE IF NOT EXISTS questionnaire_options (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  score_payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_options_question ON questionnaire_options(question_id);
CREATE INDEX IF NOT EXISTS idx_options_payload ON questionnaire_options USING gin(score_payload);

-- 16. REGLAS VOCACIONALES DE AFINIDAD
CREATE TABLE IF NOT EXISTS vocational_rules (
  id BIGSERIAL PRIMARY KEY,
  career_id BIGINT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL,
  weight NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  min_score NUMERIC(5,2) DEFAULT 0,
  max_score NUMERIC(5,2) DEFAULT 100,
  explanation_template TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vocational_career ON vocational_rules(career_id);
CREATE INDEX IF NOT EXISTS idx_vocational_dimension ON vocational_rules(dimension);

-- 17. SESIONES DE USUARIO SIN LOGIN
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  answers_payload JSONB DEFAULT '{}'::jsonb,
  profile_result JSONB DEFAULT '{}'::jsonb,
  recommended_career_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);

-- 18. CONOCIMIENTO ASISTENTE IA (GROUNDED KNOWLEDGE)
CREATE TABLE IF NOT EXISTS chat_knowledge (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id BIGINT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) STORED,
  source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_knowledge_fts ON chat_knowledge USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_chat_knowledge_entity ON chat_knowledge(entity_type, entity_id);

-- 19. COLEGIOS DE REFERENCIA PARA GEOLOCALIZACIÓN
CREATE TABLE IF NOT EXISTS school_reference (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  district TEXT NOT NULL,
  city TEXT DEFAULT 'Lima',
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7)
);

CREATE INDEX IF NOT EXISTS idx_schools_district ON school_reference(district);
