import {
  pgTable,
  bigserial,
  text,
  boolean,
  integer,
  numeric,
  date,
  timestamp,
  jsonb,
  uuid,
  index,
  unique,
  customType,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom tsvector type for PostgreSQL full-text search
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

// 1. Sources
export const sources = pgTable('sources', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sourceName: text('source_name').notNull(),
  publisher: text('publisher').notNull(),
  url: text('url').notNull(),
  sourceType: text('source_type').notNull(),
  publishedDate: date('published_date'),
  accessedAt: timestamp('accessed_at', { withTimezone: true }).notNull().defaultNow(),
  validUntil: date('valid_until'),
  documentVersion: text('document_version'),
  notes: text('notes'),
});

// 2. Institutions
export const institutions = pgTable('institutions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull().unique(),
  institutionType: text('institution_type').notNull(),
  description: text('description'),
  websiteUrl: text('website_url'),
  logoUrl: text('logo_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 3. Campuses
export const campuses = pgTable(
  'campuses',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    institutionId: bigserial('institution_id', { mode: 'number' })
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    address: text('address').notNull(),
    district: text('district').notNull(),
    city: text('city').default('Lima'),
    latitude: numeric('latitude', { precision: 10, scale: 7 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),
    mapUrl: text('map_url'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_campuses_institution').on(table.institutionId),
    index('idx_campuses_district').on(table.district),
  ]
);

// 4. Careers
export const careers = pgTable(
  'careers',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    faculty: text('faculty').notNull(),
    description: text('description').notNull(),
    durationSemesters: integer('duration_semesters').notNull().default(10),
    durationYears: numeric('duration_years', { precision: 4, scale: 2 }).notNull().default('5.0'),
    degree: text('degree').notNull(),
    licenseOrAccreditation: text('license_or_accreditation'),
    generalProfile: text('general_profile'),
    generalWorkFields: text('general_work_fields').array(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_careers_slug').on(table.slug),
    index('idx_careers_faculty').on(table.faculty),
  ]
);

// 5. Academic Offers
export const academicOffers = pgTable(
  'academic_offers',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    institutionId: bigserial('institution_id', { mode: 'number' })
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    campusId: bigserial('campus_id', { mode: 'number' })
      .notNull()
      .references(() => campuses.id, { onDelete: 'cascade' }),
    careerId: bigserial('career_id', { mode: 'number' })
      .notNull()
      .references(() => careers.id, { onDelete: 'cascade' }),
    modality: text('modality').notNull().default('PRESENCIAL'),
    admissionStatus: text('admission_status').notNull().default('ACTIVE'),
    officialUrl: text('official_url'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    unique().on(table.institutionId, table.campusId, table.careerId, table.modality),
    index('idx_offers_institution').on(table.institutionId),
    index('idx_offers_campus').on(table.campusId),
    index('idx_offers_career').on(table.careerId),
  ]
);

// 6. Curricula
export const curricula = pgTable(
  'curricula',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    academicOfferId: bigserial('academic_offer_id', { mode: 'number' })
      .notNull()
      .references(() => academicOffers.id, { onDelete: 'cascade' }),
    versionName: text('version_name').notNull(),
    academicYear: integer('academic_year').notNull(),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
    publishedAt: date('published_at'),
    isCurrent: boolean('is_current').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_curricula_offer').on(table.academicOfferId)]
);

// 7. Curriculum Courses
export const curriculumCourses = pgTable(
  'curriculum_courses',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    curriculumId: bigserial('curriculum_id', { mode: 'number' })
      .notNull()
      .references(() => curricula.id, { onDelete: 'cascade' }),
    cycle: integer('cycle').notNull(),
    courseCode: text('course_code'),
    courseName: text('course_name').notNull(),
    credits: numeric('credits', { precision: 4, scale: 2 }),
    courseType: text('course_type').default('OBLIGATORIO'),
    prerequisite: text('prerequisite'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('idx_courses_curriculum').on(table.curriculumId),
    index('idx_courses_cycle').on(table.curriculumId, table.cycle),
  ]
);

// 8. Tuition Fees
export const tuitionFees = pgTable(
  'tuition_fees',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    academicOfferId: bigserial('academic_offer_id', { mode: 'number' })
      .notNull()
      .references(() => academicOffers.id, { onDelete: 'cascade' }),
    category: text('category'),
    concept: text('concept').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('PEN'),
    academicYear: integer('academic_year').notNull().default(2026),
    validFrom: date('valid_from'),
    validUntil: date('valid_until'),
    conditions: text('conditions'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [index('idx_tuition_offer').on(table.academicOfferId)]
);

// 9. Scholarships
export const scholarships = pgTable(
  'scholarships',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    institutionId: bigserial('institution_id', { mode: 'number' }).references(
      () => institutions.id,
      { onDelete: 'cascade' }
    ),
    name: text('name').notNull(),
    description: text('description'),
    benefit: text('benefit').notNull(),
    eligibilitySummary: text('eligibility_summary'),
    requirements: text('requirements'),
    applicationUrl: text('application_url'),
    validFrom: date('valid_from'),
    validUntil: date('valid_until'),
    status: text('status').notNull().default('ACTIVE'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [index('idx_scholarships_institution').on(table.institutionId)]
);

// 10. Scholarship Rules
export const scholarshipRules = pgTable(
  'scholarship_rules',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    scholarshipId: bigserial('scholarship_id', { mode: 'number' })
      .notNull()
      .references(() => scholarships.id, { onDelete: 'cascade' }),
    ruleType: text('rule_type').notNull(),
    operator: text('operator').notNull(),
    value: text('value').notNull(),
    description: text('description').notNull(),
  },
  (table) => [index('idx_scholarship_rules').on(table.scholarshipId)]
);

// 11. Employment Indicators
export const employmentIndicators = pgTable(
  'employment_indicators',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    institutionId: bigserial('institution_id', { mode: 'number' })
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    careerId: bigserial('career_id', { mode: 'number' }).references(() => careers.id, {
      onDelete: 'cascade',
    }),
    indicatorType: text('indicator_type').notNull(),
    indicatorValue: numeric('indicator_value', { precision: 12, scale: 4 }).notNull(),
    unit: text('unit').notNull().default('%'),
    year: integer('year').notNull(),
    methodology: text('methodology'),
    notes: text('notes'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('idx_employment_institution').on(table.institutionId),
    index('idx_employment_career').on(table.careerId),
  ]
);

// 12. Skills
export const skills = pgTable('skills', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description'),
});

// 13. Career Skills
export const careerSkills = pgTable(
  'career_skills',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    careerId: bigserial('career_id', { mode: 'number' })
      .notNull()
      .references(() => careers.id, { onDelete: 'cascade' }),
    skillId: bigserial('skill_id', { mode: 'number' })
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    weight: numeric('weight', { precision: 3, scale: 2 }).notNull().default('1.0'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    unique().on(table.careerId, table.skillId),
    index('idx_career_skills').on(table.careerId, table.skillId),
  ]
);

// 14. Questionnaire Questions
export const questionnaireQuestions = pgTable(
  'questionnaire_questions',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    code: text('code').notNull().unique(),
    dimension: text('dimension').notNull(),
    questionText: text('question_text').notNull(),
    questionType: text('question_type').notNull().default('SINGLE_CHOICE'),
    orderNumber: integer('order_number').notNull(),
    missionNumber: integer('mission_number').default(1),
    interactionType: text('interaction_type').default('CHOICE'),
    helperText: text('helper_text'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    index('idx_questions_dimension').on(table.dimension),
    index('idx_questions_order').on(table.orderNumber),
    index('idx_questions_mission').on(table.missionNumber),
  ]
);

// 15. Questionnaire Options
export const questionnaireOptions = pgTable(
  'questionnaire_options',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    questionId: bigserial('question_id', { mode: 'number' })
      .notNull()
      .references(() => questionnaireQuestions.id, { onDelete: 'cascade' }),
    optionText: text('option_text').notNull(),
    scorePayload: jsonb('score_payload').notNull().default({}),
  },
  (table) => [index('idx_options_question').on(table.questionId)]
);

// 16. Vocational Rules
export const vocationalRules = pgTable(
  'vocational_rules',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    careerId: bigserial('career_id', { mode: 'number' })
      .notNull()
      .references(() => careers.id, { onDelete: 'cascade' }),
    dimension: text('dimension').notNull(),
    weight: numeric('weight', { precision: 3, scale: 2 }).notNull().default('1.0'),
    minScore: numeric('min_score', { precision: 5, scale: 2 }).default('0'),
    maxScore: numeric('max_score', { precision: 5, scale: 2 }).default('100'),
    explanationTemplate: text('explanation_template').notNull(),
  },
  (table) => [
    index('idx_vocational_career').on(table.careerId),
    index('idx_vocational_dimension').on(table.dimension),
  ]
);

// 17. User Sessions
export const userSessions = pgTable(
  'user_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionToken: text('session_token').notNull().unique(),
    answersPayload: jsonb('answers_payload').default({}),
    profileResult: jsonb('profile_result').default({}),
    recommendedCareerIds: integer('recommended_career_ids').array(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [index('idx_sessions_token').on(table.sessionToken)]
);

// 18. Chat Knowledge
export const chatKnowledge = pgTable(
  'chat_knowledge',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    entityType: text('entity_type').notNull(),
    entityId: bigserial('entity_id', { mode: 'number' }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    keywords: text('keywords').array(),
    searchVector: tsvector('search_vector'),
    sourceId: bigserial('source_id', { mode: 'number' }).references(() => sources.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [index('idx_chat_knowledge_entity').on(table.entityType, table.entityId)]
);

// 19. School Reference
export const schoolReference = pgTable(
  'school_reference',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    district: text('district').notNull(),
    city: text('city').default('Lima'),
    latitude: numeric('latitude', { precision: 10, scale: 7 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),
  },
  (table) => [index('idx_schools_district').on(table.district)]
);

// ----------------------------------------------------------------------------
// Relations
// ----------------------------------------------------------------------------
export const institutionsRelations = relations(institutions, ({ many }) => ({
  campuses: many(campuses),
  scholarships: many(scholarships),
  employmentIndicators: many(employmentIndicators),
  academicOffers: many(academicOffers),
}));

export const campusesRelations = relations(campuses, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [campuses.institutionId],
    references: [institutions.id],
  }),
  academicOffers: many(academicOffers),
}));

export const careersRelations = relations(careers, ({ many }) => ({
  academicOffers: many(academicOffers),
  vocationalRules: many(vocationalRules),
  careerSkills: many(careerSkills),
  employmentIndicators: many(employmentIndicators),
}));

export const academicOffersRelations = relations(academicOffers, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [academicOffers.institutionId],
    references: [institutions.id],
  }),
  campus: one(campuses, {
    fields: [academicOffers.campusId],
    references: [campuses.id],
  }),
  career: one(careers, {
    fields: [academicOffers.careerId],
    references: [careers.id],
  }),
  curricula: many(curricula),
  tuitionFees: many(tuitionFees),
}));

export const curriculaRelations = relations(curricula, ({ one, many }) => ({
  academicOffer: one(academicOffers, {
    fields: [curricula.academicOfferId],
    references: [academicOffers.id],
  }),
  courses: many(curriculumCourses),
}));

export const curriculumCoursesRelations = relations(curriculumCourses, ({ one }) => ({
  curriculum: one(curricula, {
    fields: [curriculumCourses.curriculumId],
    references: [curricula.id],
  }),
}));

export const tuitionFeesRelations = relations(tuitionFees, ({ one }) => ({
  academicOffer: one(academicOffers, {
    fields: [tuitionFees.academicOfferId],
    references: [academicOffers.id],
  }),
  source: one(sources, {
    fields: [tuitionFees.sourceId],
    references: [sources.id],
  }),
}));

export const questionnaireQuestionsRelations = relations(
  questionnaireQuestions,
  ({ many }) => ({
    options: many(questionnaireOptions),
  })
);

export const questionnaireOptionsRelations = relations(questionnaireOptions, ({ one }) => ({
  question: one(questionnaireQuestions, {
    fields: [questionnaireOptions.questionId],
    references: [questionnaireQuestions.id],
  }),
}));

export const vocationalRulesRelations = relations(vocationalRules, ({ one }) => ({
  career: one(careers, {
    fields: [vocationalRules.careerId],
    references: [careers.id],
  }),
}));
