-- Synthetic demonstration data for Colegio Matematico Honores.
-- Names, grades, attendance and observations below are fictional.
with target_school as (
  select id from public.schools where name = 'Colegio Matematico Honores' limit 1
)
insert into public.classrooms (id, school_id, year, grade, section)
select 'c1000000-0000-4000-8000-000000000001'::uuid, id, 2026, 5, 'A'
from target_school
on conflict (school_id, year, grade, section) do update set section = excluded.section;

with target_school as (
  select id from public.schools where name = 'Colegio Matematico Honores' limit 1
), demo_students(id, student_code, full_name) as (
  values
    ('d0000000-0000-4000-8000-000000000001'::uuid, 'CMH-2026-001', 'Adriana Salazar Ríos'),
    ('d0000000-0000-4000-8000-000000000002'::uuid, 'CMH-2026-002', 'Bruno Mendoza Paredes'),
    ('d0000000-0000-4000-8000-000000000003'::uuid, 'CMH-2026-003', 'Camila Torres Huamán'),
    ('d0000000-0000-4000-8000-000000000004'::uuid, 'CMH-2026-004', 'Diego Ramos Cárdenas'),
    ('d0000000-0000-4000-8000-000000000005'::uuid, 'CMH-2026-005', 'Elena Vargas Quispe'),
    ('d0000000-0000-4000-8000-000000000006'::uuid, 'CMH-2026-006', 'Fabio Castro Medina'),
    ('d0000000-0000-4000-8000-000000000007'::uuid, 'CMH-2026-007', 'Gabriela Flores Núñez'),
    ('d0000000-0000-4000-8000-000000000008'::uuid, 'CMH-2026-008', 'Hugo León Valdivia'),
    ('d0000000-0000-4000-8000-000000000009'::uuid, 'CMH-2026-009', 'Isabel Chávez Soto'),
    ('d0000000-0000-4000-8000-000000000010'::uuid, 'CMH-2026-010', 'Joaquín Herrera Luna'),
    ('d0000000-0000-4000-8000-000000000011'::uuid, 'CMH-2026-011', 'Kiara Ponce Cabrera'),
    ('d0000000-0000-4000-8000-000000000012'::uuid, 'CMH-2026-012', 'Luis Gutiérrez Peña'),
    ('d0000000-0000-4000-8000-000000000013'::uuid, 'CMH-2026-013', 'Mariana Rojas Espinoza'),
    ('d0000000-0000-4000-8000-000000000014'::uuid, 'CMH-2026-014', 'Nicolás Silva Aguilar'),
    ('d0000000-0000-4000-8000-000000000015'::uuid, 'CMH-2026-015', 'Olivia Díaz Campos'),
    ('d0000000-0000-4000-8000-000000000016'::uuid, 'CMH-2026-016', 'Pedro Navarro Reyes'),
    ('d0000000-0000-4000-8000-000000000017'::uuid, 'CMH-2026-017', 'Renata Morales Vega'),
    ('d0000000-0000-4000-8000-000000000018'::uuid, 'CMH-2026-018', 'Sebastián Ortiz Lozano'),
    ('d0000000-0000-4000-8000-000000000019'::uuid, 'CMH-2026-019', 'Valentina Cruz Palomino'),
    ('d0000000-0000-4000-8000-000000000020'::uuid, 'CMH-2026-020', 'Ximena Fuentes Acosta')
)
insert into public.students (
  id, school_id, classroom_id, student_code, full_name,
  is_demo, active, consent_status
)
select d.id, s.id, c.id,
  d.student_code, d.full_name, true, true, 'PENDING'
from demo_students d cross join target_school s
join public.classrooms c on c.school_id = s.id
  and c.year = 2026 and c.grade = 5 and c.section = 'A'
on conflict (school_id, student_code) do update
set full_name = excluded.full_name, classroom_id = excluded.classroom_id,
    is_demo = true, active = true;

with target_school as (
  select id from public.schools where name = 'Colegio Matematico Honores' limit 1
), periods(id, bimester, label, starts_on, ends_on, status) as (
  values
    ('b1000000-0000-4000-8000-000000000001'::uuid, 1, 'Primer bimestre', '2026-03-09'::date, '2026-05-08'::date, 'CLOSED'),
    ('b1000000-0000-4000-8000-000000000002'::uuid, 2, 'Segundo bimestre', '2026-05-18'::date, '2026-07-24'::date, 'CLOSED'),
    ('b1000000-0000-4000-8000-000000000003'::uuid, 3, 'Tercer bimestre', '2026-08-10'::date, '2026-10-09'::date, 'CLOSED'),
    ('b1000000-0000-4000-8000-000000000004'::uuid, 4, 'Cuarto bimestre', '2026-10-19'::date, '2026-12-18'::date, 'OPEN')
)
insert into public.academic_periods (
  id, school_id, academic_year, bimester, label, starts_on, ends_on, status
)
select p.id, s.id, 2026, p.bimester, p.label, p.starts_on, p.ends_on, p.status
from periods p cross join target_school s
on conflict (school_id, academic_year, bimester) do update
set label = excluded.label, starts_on = excluded.starts_on,
    ends_on = excluded.ends_on, status = excluded.status;

with subjects(subject, area, subject_no) as (
  values
    ('Matemática', 'Matemática', 1),
    ('Comunicación', 'Comunicación', 2),
    ('Ciencia y Tecnología', 'Ciencia y Tecnología', 3),
    ('Ciencias Sociales', 'Personal Social', 4),
    ('Inglés', 'Inglés', 5),
    ('Educación Física', 'Educación Física', 6),
    ('Arte y Cultura', 'Arte y Cultura', 7),
    ('Educación Religiosa', 'Educación Religiosa', 8)
), demo_students as (
  select id, row_number() over (order by student_code)::integer as student_no
  from public.students where school_id = (select id from public.schools where name = 'Colegio Matematico Honores' limit 1)
    and is_demo = true and student_code like 'CMH-2026-%'
), periods as (
  select id, bimester from public.academic_periods where academic_year = 2026
    and school_id = (select id from public.schools where name = 'Colegio Matematico Honores' limit 1)
)
insert into public.academic_records (
  student_id, period_id, period, subject, area, grade, confirmed_at
)
select d.id, p.id, 'B' || p.bimester, s.subject, s.area,
  least(20, 11 + ((d.student_no * 3 + p.bimester * 2 + s.subject_no) % 10))::numeric(4,2),
  now()
from demo_students d cross join periods p cross join subjects s
on conflict (student_id, period_id, subject) do update
set grade = excluded.grade, area = excluded.area, confirmed_at = now();

with averages as (
  select r.student_id, r.period_id, round(avg(r.grade), 2) as average,
    dense_rank() over (partition by r.period_id order by avg(r.grade) desc)::integer as class_rank,
    row_number() over (partition by r.period_id order by st.student_code)::integer as student_no
  from public.academic_records r
  join public.students st on st.id = r.student_id and st.is_demo = true
    and st.school_id = (select id from public.schools where name = 'Colegio Matematico Honores' limit 1)
  group by r.student_id, r.period_id, st.student_code
)
insert into public.student_period_summaries (
  student_id, period_id, average, class_rank, attendance_days,
  absence_days, late_count, punctuality_rating, uniform_rating,
  behavior_rating, responsibility_rating, observation, confirmed_at
)
select student_id, period_id, average, class_rank,
  45 - (student_no % 3), student_no % 3, student_no % 4,
  case when student_no % 7 = 0 then 'B' when student_no % 3 = 0 then 'AD' else 'A' end,
  case when student_no % 9 = 0 then 'B' else 'A' end,
  case when student_no % 8 = 0 then 'B' when student_no % 4 = 0 then 'AD' else 'A' end,
  case when student_no % 6 = 0 then 'AD' else 'A' end,
  'Registro sintético para demostración del sistema.', now()
from averages
on conflict (student_id, period_id) do update
set average = excluded.average, class_rank = excluded.class_rank,
    attendance_days = excluded.attendance_days,
    absence_days = excluded.absence_days, late_count = excluded.late_count,
    punctuality_rating = excluded.punctuality_rating,
    uniform_rating = excluded.uniform_rating,
    behavior_rating = excluded.behavior_rating,
    responsibility_rating = excluded.responsibility_rating,
    observation = excluded.observation, confirmed_at = now();
