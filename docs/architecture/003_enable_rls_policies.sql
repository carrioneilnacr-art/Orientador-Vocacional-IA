-- ============================================================================
-- MIGRACIÓN 003: ACTIVACIÓN DE ROW LEVEL SECURITY (RLS) Y POLÍTICAS DE LECTURA PÚBLICA
-- ============================================================================

-- 1. TABLAS INSTITUCIONALES Y ACADÉMICAS (Lectura pública)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (true);

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read institutions" ON institutions FOR SELECT USING (true);

ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read campuses" ON campuses FOR SELECT USING (true);

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read careers" ON careers FOR SELECT USING (true);

ALTER TABLE academic_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read academic_offers" ON academic_offers FOR SELECT USING (true);

ALTER TABLE curricula ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read curricula" ON curricula FOR SELECT USING (true);

ALTER TABLE curriculum_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read curriculum_courses" ON curriculum_courses FOR SELECT USING (true);

ALTER TABLE tuition_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tuition_fees" ON tuition_fees FOR SELECT USING (true);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read scholarships" ON scholarships FOR SELECT USING (true);

ALTER TABLE scholarship_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read scholarship_rules" ON scholarship_rules FOR SELECT USING (true);

ALTER TABLE employment_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read employment_indicators" ON employment_indicators FOR SELECT USING (true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);

ALTER TABLE career_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read career_skills" ON career_skills FOR SELECT USING (true);

-- 2. CUESTIONARIO Y REGLAS (Lectura pública)
ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questionnaire_questions" ON questionnaire_questions FOR SELECT USING (true);

ALTER TABLE questionnaire_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questionnaire_options" ON questionnaire_options FOR SELECT USING (true);

ALTER TABLE vocational_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read vocational_rules" ON vocational_rules FOR SELECT USING (true);

-- 3. SESIONES TEMPORALES DE ALUMNOS (Inserción y lectura anónima por token)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert sessions" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select sessions" ON user_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public update sessions" ON user_sessions FOR UPDATE USING (true);

-- 4. CONOCIMIENTO ASISTENTE Y COLEGIOS
ALTER TABLE chat_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chat_knowledge" ON chat_knowledge FOR SELECT USING (true);

ALTER TABLE school_reference ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read school_reference" ON school_reference FOR SELECT USING (true);
