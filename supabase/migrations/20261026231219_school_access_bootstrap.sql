-- Minimal institutional access; academic data is not changed.
create table if not exists public.schools (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text not null unique,
 grade_scale text not null default 'VIGESIMAL'
);
create table if not exists public.school_staff (
 user_id uuid primary key references auth.users(id) on delete cascade,
 school_id uuid not null references public.schools(id) on delete cascade,
 role text not null check (role in ('ADMIN','DIRECTOR','PSICOLOGO','TUTOR')),
 username text unique check (username = lower(username) and username ~ '^[a-z0-9._-]{3,64}$'),
 login_email text
);
alter table public.school_staff add column if not exists username text;
alter table public.school_staff add column if not exists login_email text;
create unique index if not exists idx_school_staff_username on public.school_staff(username);
create index if not exists idx_school_staff_school on public.school_staff(school_id);
create table if not exists public.audit_log (
 id uuid primary key default gen_random_uuid(),
 actor_id uuid,
 action text not null,
 target_type text not null,
 target_id text not null,
 metadata jsonb default '{}',
 created_at timestamptz not null default now()
);
create index if not exists idx_audit_log_actor on public.audit_log(actor_id);
create index if not exists idx_audit_log_target on public.audit_log(target_type,target_id);
alter table public.schools enable row level security;
alter table public.school_staff enable row level security;
alter table public.audit_log enable row level security;
-- Access goes through server routes which check school membership and role.
revoke all on public.schools, public.school_staff, public.audit_log from anon, authenticated;
