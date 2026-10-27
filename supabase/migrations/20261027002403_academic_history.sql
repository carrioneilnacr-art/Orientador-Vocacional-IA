-- Academic history for school report cards. Additive and safe for existing access data.
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  year integer not null,
  grade integer not null check (grade between 1 and 6),
  section text not null,
  unique (school_id, year, grade, section)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  classroom_id uuid references public.classrooms(id) on delete set null,
  student_code text not null,
  full_name text not null,
  access_code_hash text unique,
  is_demo boolean not null default false,
  active boolean not null default true,
  consent_status text not null default 'PENDING',
  consent_at timestamptz,
  unique (school_id, student_code)
);

alter table public.students add column if not exists is_demo boolean not null default false;
alter table public.students add column if not exists active boolean not null default true;

create table if not exists public.grade_imports (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  uploaded_by uuid,
  file_type text not null check (file_type in ('CSV', 'XLSX', 'PDF')),
  file_name text,
  storage_path text,
  status text not null default 'UPLOADED',
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

alter table public.grade_imports add column if not exists file_name text;

create table if not exists public.academic_periods (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  academic_year integer not null check (academic_year between 2000 and 2200),
  bimester integer not null check (bimester between 1 and 4),
  label text not null,
  starts_on date,
  ends_on date,
  status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  unique (school_id, academic_year, bimester),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table if not exists public.academic_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  period_id uuid references public.academic_periods(id) on delete cascade,
  import_id uuid references public.grade_imports(id) on delete set null,
  period text,
  subject text not null,
  area text not null,
  grade numeric(4,2) check (grade between 0 and 20),
  confirmed_at timestamptz default now(),
  unique (student_id, period_id, subject)
);

alter table public.academic_records add column if not exists period_id uuid references public.academic_periods(id) on delete cascade;
alter table public.academic_records alter column period drop not null;

create table if not exists public.student_period_summaries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  period_id uuid not null references public.academic_periods(id) on delete cascade,
  average numeric(4,2) check (average between 0 and 20),
  class_rank integer check (class_rank > 0),
  attendance_days integer not null default 0 check (attendance_days >= 0),
  absence_days integer not null default 0 check (absence_days >= 0),
  late_count integer not null default 0 check (late_count >= 0),
  punctuality_rating text check (punctuality_rating in ('AD', 'A', 'B', 'C')),
  uniform_rating text check (uniform_rating in ('AD', 'A', 'B', 'C')),
  behavior_rating text check (behavior_rating in ('AD', 'A', 'B', 'C')),
  responsibility_rating text check (responsibility_rating in ('AD', 'A', 'B', 'C')),
  observation text,
  confirmed_at timestamptz default now(),
  unique (student_id, period_id)
);

create table if not exists public.grade_import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.grade_imports(id) on delete cascade,
  raw_student_code text,
  raw_name text,
  subject text,
  period text,
  raw_grade text,
  parsed_grade numeric(4,2),
  status text,
  issues jsonb not null default '[]'::jsonb,
  confidence numeric(3,2)
);

create table if not exists public.grade_import_changes (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.grade_imports(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  period_id uuid not null references public.academic_periods(id) on delete cascade,
  subject text not null,
  previous_grade numeric(4,2),
  previous_area text,
  previous_import_id uuid,
  was_existing boolean not null default false,
  unique (import_id, student_id, period_id, subject)
);

create index if not exists idx_classrooms_school on public.classrooms(school_id);
create index if not exists idx_students_school on public.students(school_id);
create index if not exists idx_students_classroom on public.students(classroom_id);
create index if not exists idx_grade_imports_school on public.grade_imports(school_id);
create index if not exists idx_academic_periods_school on public.academic_periods(school_id);
create index if not exists idx_academic_records_student on public.academic_records(student_id);
create index if not exists idx_academic_records_period on public.academic_records(period_id);
create index if not exists idx_academic_records_import on public.academic_records(import_id);
create index if not exists idx_student_period_summaries_student on public.student_period_summaries(student_id);
create index if not exists idx_student_period_summaries_period on public.student_period_summaries(period_id);
create index if not exists idx_grade_import_rows_import on public.grade_import_rows(import_id);
create index if not exists idx_grade_import_changes_import on public.grade_import_changes(import_id);
create index if not exists idx_grade_import_changes_student on public.grade_import_changes(student_id);
create index if not exists idx_grade_import_changes_period on public.grade_import_changes(period_id);

alter table public.classrooms enable row level security;
alter table public.students enable row level security;
alter table public.grade_imports enable row level security;
alter table public.academic_periods enable row level security;
alter table public.academic_records enable row level security;
alter table public.student_period_summaries enable row level security;
alter table public.grade_import_rows enable row level security;
alter table public.grade_import_changes enable row level security;

revoke all on public.classrooms, public.students, public.grade_imports,
  public.academic_periods, public.academic_records,
  public.student_period_summaries, public.grade_import_rows,
  public.grade_import_changes from anon, authenticated;
