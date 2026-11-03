-- Additive server-only rate limit store. Apply before deploying async limiter.
BEGIN;
CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  bucket_key text PRIMARY KEY,
  hits integer NOT NULL CHECK (hits > 0),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_expiry ON public.rate_limit_buckets (expires_at);
ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.rate_limit_buckets FROM PUBLIC, anon, authenticated;
COMMIT;
-- Verification: verify RLS, no public grants and atomic counters through server role.
-- Maintenance: expired counters can be retained safely (upsert resets them).
-- Schedule a bounded expired-row cleanup separately if distinct identities grow.
