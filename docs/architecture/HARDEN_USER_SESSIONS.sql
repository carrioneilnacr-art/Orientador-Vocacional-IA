-- Applied 2026-11-02 after confirming the app uses server-owned Drizzle routes.
-- This closes public Data API access; it does not delete or alter session rows.
-- Execute inside a transaction as the table owner. Audit existing grants first.
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.user_sessions FROM PUBLIC, anon, authenticated;
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_sessions' AND policyname='sessions_backend_only') THEN
  CREATE POLICY sessions_backend_only ON public.user_sessions AS RESTRICTIVE
   FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
 END IF;
END $$;
