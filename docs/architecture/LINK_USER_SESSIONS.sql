-- Reconcile the two nullable ownership columns already declared by schema.ts.
-- Existing rows stay anonymous; no historical student is inferred or assigned.
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES public.students(id) ON DELETE SET NULL;
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_school_created ON public.user_sessions(school_id, created_at);
