-- Migration: Multi-School System Tables
-- Created: 013_multi_school_tables.sql

CREATE TABLE "schools" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "grade_scale" text NOT NULL DEFAULT 'VIGESIMAL'
);

CREATE TABLE "classrooms" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "school_id" uuid NOT NULL REFERENCES "schools"("id") ON DELETE CASCADE,
    "year" integer NOT NULL,
    "grade" integer NOT NULL,
    "section" text NOT NULL
);

CREATE TABLE "students" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "school_id" uuid NOT NULL REFERENCES "schools"("id") ON DELETE CASCADE,
    "classroom_id" uuid REFERENCES "classrooms"("id") ON DELETE SET NULL,
    "student_code" text NOT NULL,
    "full_name" text NOT NULL,
    "access_code_hash" text UNIQUE,
    "consent_status" text NOT NULL DEFAULT 'PENDING',
    "consent_at" timestamp with time zone,
    UNIQUE("school_id", "student_code")
);

CREATE TABLE "school_staff" (
    "user_id" uuid PRIMARY KEY,
    "school_id" uuid NOT NULL REFERENCES "schools"("id") ON DELETE CASCADE,
    "role" text NOT NULL
);

CREATE TABLE "grade_imports" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "school_id" uuid NOT NULL REFERENCES "schools"("id") ON DELETE CASCADE,
    "uploaded_by" uuid,
    "file_type" text NOT NULL,
    "storage_path" text,
    "status" text NOT NULL DEFAULT 'UPLOADED',
    "stats" jsonb DEFAULT '{}',
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "confirmed_at" timestamp with time zone
);

CREATE TABLE "academic_records" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "student_id" uuid NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "import_id" uuid REFERENCES "grade_imports"("id") ON DELETE SET NULL,
    "period" text NOT NULL,
    "subject" text NOT NULL,
    "area" text NOT NULL,
    "grade" numeric(4,2),
    "confirmed_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "career_area_weights" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "career_id" bigint NOT NULL REFERENCES "careers"("id") ON DELETE CASCADE,
    "area" text NOT NULL,
    "weight" numeric(3,2) NOT NULL
);

CREATE TABLE "grade_import_rows" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "import_id" uuid NOT NULL REFERENCES "grade_imports"("id") ON DELETE CASCADE,
    "raw_student_code" text,
    "raw_name" text,
    "subject" text,
    "period" text,
    "raw_grade" text,
    "parsed_grade" numeric(4,2),
    "status" text,
    "issues" jsonb DEFAULT '[]',
    "confidence" numeric(3,2)
);

CREATE TABLE "audit_log" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "actor_id" uuid,
    "action" text NOT NULL,
    "target_type" text NOT NULL,
    "target_id" text NOT NULL,
    "metadata" jsonb DEFAULT '{}',
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "tutoring_requests" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" uuid NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "school_id" uuid NOT NULL REFERENCES "schools"("id") ON DELETE CASCADE,
    "reason" text NOT NULL,
    "status" text NOT NULL DEFAULT 'PENDING',
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "resolved_at" timestamp with time zone,
    "resolved_by" uuid
);

CREATE TABLE "alumni_outcomes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" uuid NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "year" integer NOT NULL,
    "university" text NOT NULL,
    "career" text NOT NULL,
    "scholarship" text,
    "notes" text
);

ALTER TABLE "user_sessions" ADD COLUMN "student_id" uuid REFERENCES "students"("id") ON DELETE SET NULL;
ALTER TABLE "user_sessions" ADD COLUMN "school_id" uuid REFERENCES "schools"("id") ON DELETE SET NULL;

CREATE INDEX idx_students_school_code ON "students"("school_id", "student_code");
CREATE INDEX idx_academic_records_student ON "academic_records"("student_id");
CREATE INDEX idx_academic_records_import ON "academic_records"("import_id");
CREATE INDEX idx_school_staff_school ON "school_staff"("school_id");
CREATE INDEX idx_audit_log_actor ON "audit_log"("actor_id");
CREATE INDEX idx_audit_log_target ON "audit_log"("target_type", "target_id");
