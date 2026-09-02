# Orientador Vocacional con IA
## Propuesta técnica + modelo de datos + ficha maestra UPC

**Versión:** 1.0  
**Fecha de investigación:** 02/09/2026  
**Alcance:** Universidad Peruana de Ciencias Aplicadas (UPC) como primera institución.

---

# 1. Objetivo

Diseñar una plataforma web pública de orientación vocacional, sin registro de usuarios, que permita:

- Landing page con el botón **“Empieza a conocer tu futuro”**.
- Cuestionario vocacional breve.
- Cálculo de perfil por intereses y habilidades.
- Recomendación de carreras.
- Exploración de universidades y sedes.
- Consulta de mallas, costos, becas y datos laborales.
- Chatbot de IA después del resultado.
- Respuestas del chatbot basadas en datos estructurados y fuentes verificables.
- Operación en Vercel + Supabase.
- Aproximadamente 20 estudiantes conectados simultáneamente durante el piloto.

**Principio central:** la IA no será la fuente primaria de hechos. Los datos de universidades, carreras, mallas, costos, becas y empleabilidad vendrán de una base verificada; la IA servirá para explicar, comparar y conversar.

---

# 2. Stack

## Frontend / aplicación

**Next.js + TypeScript + Tailwind CSS**

Next.js es la opción recomendada para desplegar en Vercel y permite tener interfaz, Server Components y Route Handlers en una sola aplicación.

## Base de datos

**Supabase PostgreSQL**

Se almacenarán:

- instituciones;
- sedes;
- carreras;
- oferta académica;
- mallas;
- cursos;
- costos;
- becas;
- indicadores de empleabilidad;
- habilidades;
- reglas vocacionales;
- fuentes;
- contenido para el chatbot.

No se necesita Supabase Auth para el MVP, porque la plataforma será pública y sin cuentas.

## ORM

**Drizzle ORM** o **Prisma**. Usar solo uno.

Recomendación: Drizzle si se quiere una capa ligera y cercana a SQL; Prisma si se prioriza productividad y ergonomía.

## Validación

**Zod**

## IA

API de un proveedor de modelos de lenguaje.

La clave de la IA nunca debe exponerse al navegador.

## Repositorio

**GitHub + Monorepo**

## Despliegue

```text
Next.js → Vercel
PostgreSQL → Supabase
IA → API externa
```

**Railway:** opcional para una etapa futura si se necesita un backend persistente, workers, scraping programado o procesos pesados.

---

# 3. Arquitectura

Se recomienda **Clean Architecture ligera + modularización por dominio + Repository Pattern + Use Cases**.

```text
Presentation
      ↓
Application
      ↓
Domain
      ↓
Infrastructure
```

## Presentation

- páginas;
- componentes;
- cuestionario;
- resultado;
- chatbot;
- Route Handlers.

## Application

Casos de uso:

- iniciar orientación;
- procesar respuestas;
- calcular perfil;
- obtener recomendaciones;
- consultar carrera;
- comparar carreras;
- consultar universidades;
- construir contexto del chatbot;
- generar respuesta de IA.

## Domain

Reglas:

- dimensiones vocacionales;
- scoring;
- afinidad carrera-perfil;
- carreras;
- becas;
- criterios de recomendación.

## Infrastructure

- Supabase/PostgreSQL;
- repositorios;
- cliente de IA;
- geolocalización/rutas;
- caché.

No se recomienda MVC puro para toda la plataforma porque la lógica vocacional y de IA terminaría fuertemente acoplada a controladores.

---

# 4. Monorepo

```text
orientador-vocacional/
│
├── apps/
│   └── web/
│       ├── app/
│       │   ├── page.tsx
│       │   ├── orientacion/
│       │   ├── resultado/
│       │   ├── carreras/
│       │   └── api/
│       │
│       ├── src/
│       │   ├── components/
│       │   ├── features/
│       │   │   ├── landing/
│       │   │   ├── questionnaire/
│       │   │   ├── results/
│       │   │   ├── career-explorer/
│       │   │   └── ai-chat/
│       │   └── lib/
│       └── package.json
│
├── packages/
│   ├── database/
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── repositories/
│   ├── domain/
│   │   ├── career/
│   │   ├── institution/
│   │   ├── scholarship/
│   │   ├── vocational/
│   │   └── chat/
│   ├── application/
│   │   ├── use-cases/
│   │   └── services/
│   ├── types/
│   ├── validation/
│   └── config/
│
├── data/
│   ├── 01-upc/
│   │   ├── institution/
│   │   ├── campuses/
│   │   ├── careers/
│   │   ├── curricula/
│   │   ├── costs/
│   │   ├── scholarships/
│   │   ├── employability/
│   │   └── sources/
│   ├── 02-ucv/
│   ├── 03-uch/
│   └── ...
│
├── scripts/
│   ├── import/
│   ├── validate/
│   └── normalize/
│
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

La carpeta `data/` es el repositorio de trabajo de la investigación. Supabase será la fuente operacional de la aplicación.

---

# 5. Modelo de base de datos

## 5.1 institutions

```text
id
name
short_name
institution_type
description
website_url
logo_url
is_active
created_at
updated_at
```

## 5.2 campuses

```text
id
institution_id
name
address
district
city
latitude
longitude
map_url
is_active
```

Una universidad puede tener múltiples sedes.

## 5.3 careers

```text
id
name
slug
faculty
description
duration_semesters
duration_years
degree
license_or_accreditation
general_profile
general_work_fields
is_active
```

## 5.4 academic_offers

Une institución + sede + carrera + modalidad.

```text
id
institution_id
campus_id
career_id
modality
admission_status
official_url
```

Restricción recomendada:

```text
UNIQUE(institution_id, campus_id, career_id, modality)
```

## 5.5 curricula

```text
id
academic_offer_id
version_name
academic_year
modality
source_id
published_at
is_current
```

## 5.6 curriculum_courses

```text
id
curriculum_id
cycle
course_code
course_name
credits
course_type
prerequisite
source_id
```

Esto permite comparar mallas.

## 5.7 tuition_fees

```text
id
academic_offer_id
category
concept
amount
currency
academic_year
valid_from
valid_until
conditions
source_id
```

No guardar un único precio fijo porque las pensiones pueden variar por categoría, modalidad, programa, campaña y fecha.

## 5.8 scholarships

```text
id
institution_id
name
description
benefit
eligibility_summary
requirements
application_url
valid_from
valid_until
status
source_id
```

## 5.9 scholarship_rules

```text
id
scholarship_id
rule_type
operator
value
description
```

## 5.10 employment_indicators

```text
id
institution_id
career_id nullable
indicator_type
indicator_value
unit
year
methodology
notes
source_id
```

`career_id` puede ser `NULL` cuando el indicador es institucional.

## 5.11 sources

```text
id
source_name
publisher
url
source_type
published_date
accessed_at
valid_until
document_version
notes
```

Esta tabla es crítica para la trazabilidad.

## 5.12 skills

```text
id
name
category
description
```

## 5.13 career_skills

```text
id
career_id
skill_id
weight
source_id
```

## 5.14 questionnaire_questions

```text
id
code
dimension
question_text
question_type
order_number
is_active
```

## 5.15 questionnaire_options

```text
id
question_id
option_text
score_payload
```

## 5.16 vocational_rules

```text
id
career_id
dimension
weight
min_score
max_score
explanation_template
```

## 5.17 chat_knowledge

```text
id
entity_type
entity_id
title
content
keywords
search_vector
embedding nullable
source_id
```

Primera etapa: Full Text Search de PostgreSQL.  
Segunda etapa: `pgvector` si se requiere búsqueda semántica.

---

# 6. Relaciones

```text
INSTITUTION
    │
    ├──< CAMPUS
    │
    ├──< SCHOLARSHIP
    │
    └──< ACADEMIC_OFFER >── CAREER
                              │
                              └── CURRICULUM
                                     │
                                     └── CURRICULUM_COURSE

CAREER
  │
  ├──< CAREER_SKILLS >── SKILLS
  ├──< VOCATIONAL_RULES
  └──< EMPLOYMENT_INDICATORS

Todas las entidades académicas
             ↓
           SOURCES
```

---

# 7. Rendimiento para ~20 alumnos simultáneos

20 alumnos conectados simultáneamente no requiere una infraestructura compleja. El rendimiento se logrará principalmente evitando consultas y llamadas a IA innecesarias.

## 7.1 No hacer

```text
Pregunta
 ↓
Enviar toda la base a la IA
```

## 7.2 Hacer

```text
Pregunta
 ↓
Detectar intención
 ↓
Identificar carrera/universidad/tema
 ↓
Consulta SQL específica
 ↓
Construir contexto compacto
 ↓
IA
 ↓
Respuesta
```

## 7.3 Índices recomendados

```text
careers.name
careers.slug
academic_offers.institution_id
academic_offers.career_id
academic_offers.campus_id
curriculum_courses.curriculum_id
curriculum_courses.cycle
tuition_fees.academic_offer_id
scholarships.institution_id
employment_indicators.institution_id
employment_indicators.career_id
sources.valid_until
```

## 7.4 Caché

Datos como:

- carreras;
- sedes;
- mallas;
- descripciones;
- universidades;

pueden cachearse.

Los datos temporales, como becas y cronogramas, deben tener vencimiento.

## 7.5 Consultas agrupadas

Crear RPC/funciones para devolver contexto ya preparado, por ejemplo:

```text
get_career_context(career_ids)
```

Así una pregunta del chatbot no genera múltiples viajes innecesarios a la base.

---

# 8. Chatbot contextual

Después del resultado:

```text
Cuestionario
   ↓
Perfil
   ↓
Top 3 carreras
   ↓
Resultado
   ↓
Chatbot
```

La sesión puede mantener temporalmente:

```text
session_id
responses
dimensions
recommended_careers
chat_context
```

No es necesario crear una cuenta.

Ejemplo:

```text
Estudiante:
¿Por qué me salió Ingeniería de Sistemas?

Sistema:
→ consulta perfil
→ consulta reglas de la carrera
→ obtiene información oficial
→ genera respuesta
```

Otro ejemplo:

```text
¿Cuál tiene menos matemática?

→ obtiene cursos/malla de las 3 carreras
→ compara
→ IA explica
```

---

# 9. IA: seguridad y calidad

La IA sí puede:

- explicar carreras;
- comparar;
- resumir mallas;
- explicar costos;
- explicar becas;
- orientar siguientes pasos.

No debe:

- inventar precios;
- inventar becas;
- afirmar elegibilidad definitiva;
- emitir diagnósticos psicológicos;
- afirmar que una carrera es “la correcta”;
- inventar estadísticas.

Respuesta recomendada:

> Según la información registrada y la fuente consultada...

Para becas:

> Según los requisitos publicados y la información proporcionada, podrías revisar esta convocatoria. Verifica los requisitos y vigencia en la fuente oficial.

---

# 10. Geolocalización

La distancia debe calcularse:

```text
Colegio
   ↓
Campus
   ↓
distancia
   ↓
tiempo estimado
```

No:

```text
Colegio → Universidad
```

porque una institución puede tener varias sedes.

Modelo adicional:

```text
school_reference
id
name
address
district
latitude
longitude
```

Para el piloto se puede calcular únicamente desde el colegio seleccionado hacia los campus relevantes.

---

# 11. Ficha maestra UPC: datos reales confirmados

## 11.1 Institución

**Nombre:** Universidad Peruana de Ciencias Aplicadas  
**Abreviatura:** UPC

Fuente oficial:
https://upc.edu.pe/nosotros/campus/

## 11.2 Campus

La UPC identifica cuatro campus:

1. **Monterrico**
   - Prolongación Primavera 2390.
   - Cuadra 23 de Av. Primavera.
   - Santiago de Surco.

2. **San Isidro**
   - Av. General Salaverry 2255.
   - San Isidro.

3. **San Miguel**
   - Av. La Marina 2810.
   - San Miguel.

4. **Villa**
   - Av. Alameda San Marcos.
   - Chorrillos.

Fuentes oficiales:
https://upc.edu.pe/nosotros/campus/
https://pregrado.upc.edu.pe/landings/tours-virtuales-campus/

## 11.3 Ingeniería de Sistemas de Información

Datos confirmados por la página oficial de la carrera:

- Duración: 10 semestres / 5 años.
- Grado: Bachiller en Ingeniería de Sistemas de Información.
- Campus: Monterrico, San Miguel, San Isidro y Villa.
- Acreditación indicada: ABET.
- Áreas formativas publicadas: Humanidades, Ciencias Básicas, Administración, Sistemas de Información, Tecnología de Información, Ciencias de la Computación, Ingeniería de Software, Práctica de la Profesión y Electivos.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/

## 11.4 Ingeniería de Software

- Duración: 10 semestres / 5 años.
- Grado: Bachiller en Ingeniería de Software.
- Campus: Monterrico, San Miguel, San Isidro y Villa.
- Acreditación indicada: ABET.

Fuente:
https://pregrado.upc.edu.pe/carrera-de-ingenieria-de-software/informacion-academica/

## 11.5 Administración

- Duración: 10 semestres / 5 años.
- Grado: Bachiller en Administración.
- Licenciatura: Administración.
- Campus: San Miguel, Monterrico, Villa y San Isidro.
- La UPC indica que permite personalizar la carrera con hasta 3 menciones de especialidad.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-negocios/administracion/

## 11.6 Psicología

- Duración: 10 semestres / 5 años.
- Campus: Villa, San Miguel, Monterrico y San Isidro.
- Grados publicados: Psicología Clínica, Psicología Educativa y Psicología Organizacional.
- Posibilidad de titularse como Licenciado en Psicología.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-psicologia/psicologia/

## 11.7 Derecho

- Duración: 10 semestres / 5 años.
- Grado: Bachiller en Derecho.
- Campus publicados: Monterrico, San Miguel, San Isidro y Villa.
- Formación publicada en ramas civil, penal, patrimonial, corporativa, ambiental, entre otras.
- La página informa modalidades presencial, semipresencial y virtual.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-derecho/derecho/

## 11.8 Comunicación y Publicidad

- Duración: 10 semestres / 5 años.
- Grado: Bachiller en Comunicación y Publicidad.
- Campus: Monterrico, San Miguel, San Isidro y Villa.
- La página publica un ingreso promedio mensual de S/ 3,417 y lo atribuye al portal Mi Carrera del MTPE (2024).

Este dato debe conservarse con:
```text
indicador
valor
año
fuente
metodología
```

Fuente:
https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/

## 11.9 Administración y Negocios Internacionales

- Duración: 10 semestres / 5 años.
- Campus: San Miguel, Monterrico, Villa y San Isidro.
- Campos laborales publicados: comercio exterior, comercio electrónico, empresas internacionales, operaciones/logística y emprendimiento.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-negocios/administracion-y-negocios-internacionales/

## 11.10 Administración y Finanzas

- Duración: 10 semestres / 5 años.
- Campus: San Miguel, Monterrico y San Isidro.
- Grado: Bachiller en Administración y Finanzas.
- Licenciatura: Administración y/o Finanzas.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-negocios/administracion-y-finanzas/

## 11.11 Administración y Marketing

- Duración: 10 semestres / 5 años.
- Campus: San Miguel, Monterrico, Villa y San Isidro.
- Grado: Bachiller en Administración y Marketing.
- Licenciaturas publicadas: Administración y Marketing.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-negocios/administracion-y-marketing/

## 11.12 Administración y Ciencia de Datos para Negocios

La UPC presenta la carrera como una propuesta orientada a analítica avanzada, datos e inteligencia artificial aplicada a negocios.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-negocios/administracion-y-ciencia-de-datos-para-negocios/

---

# 12. Catálogo inicial de carreras UPC

La página oficial de Transparencia UPC lista carreras y modalidades de malla.

## Ingeniería

1. Ciencias de la Computación
2. Ingeniería Biomédica
3. Ingeniería de Ciberseguridad
4. Ingeniería Civil
5. Ingeniería en Gestión Empresarial
6. Ingeniería de Gestión Minera
7. Ingeniería de Sistemas de Información
8. Ingeniería de Software
9. Ingeniería Electrónica
10. Ingeniería Industrial
11. Ingeniería Mecatrónica
12. Ingeniería Ambiental

## Negocios

13. Administración
14. Administración y Ciencia de Datos para Negocios
15. Administración y Agronegocios
16. Administración y Finanzas
17. Administración y Marketing
18. Administración y Negocios del Deporte
19. Administración y Negocios Digitales
20. Administración y Negocios Internacionales
21. Administración y Recursos Humanos
22. Contabilidad y Administración

## Otras áreas

23. Arquitectura
24. Psicología
25. Derecho
26. Relaciones Internacionales
27. Economía y Ciencia de Datos
28. Economía y Finanzas
29. Economía y Negocios Internacionales
30. Ciencias Políticas
31. Comunicación Audiovisual y Medios Interactivos
32. Comunicación en Imagen Empresarial
33. Comunicación y Marketing
34. Comunicación y Periodismo
35. Comunicación y Publicidad
36. Comunicación y Fotografía
37. Diseño Industrial
38. Diseño Profesional de Interiores
39. Diseño Profesional Gráfico
40. Diseño y Gestión de Moda
41. Medicina
42. Enfermería
43. Odontología
44. Farmacia y Bioquímica
45. Nutrición y Dietética
46. Medicina Veterinaria
47. Biología
48. Ciencias de la Actividad Física y el Deporte
49. Educación y Gestión del Aprendizaje
50. Traducción e Interpretación

Fuente:
https://www.upc.edu.pe/transparencia-upc/mallas-curriculares/

**Importante:** antes de poner una carrera como disponible en el sitio se debe validar su estado actual de admisión, modalidad y sede. La página también conserva carreras históricas sin admisión para nuevos alumnos.

---

# 13. Pensiones UPC 2026

La UPC publica pensiones 2026 aprobadas mediante resolución de la Dirección de Administración y Finanzas.

Las pensiones se presentan por categorías y carrera.

La propia UPC señala que los montos publicados son referenciales y pueden variar por campaña de admisión, fecha de matrícula, programa, modalidad, beneficios, convenios y otras condiciones.

Fuente:
https://upc.edu.pe/transparencia-upc/pensiones-y-tarifas/pensiones-pregrado/

La plataforma debe conservar:

```text
categoría
concepto
monto
moneda
año
vigencia
condiciones
fuente
```

No guardar un único “precio de UPC”.

---

# 14. Tarifas UPC 2026

La UPC publica tarifas administrativas 2026.

Ejemplos publicados:

- Carnet de identidad/TIU: S/ 30.
- Certificado de estudios con firma electrónica: S/ 108.
- Certificado de estudios con firma simple: S/ 81.
- Constancia académica con firma simple: S/ 76.
- Certificación de documentos individual: S/ 32.

Fuente:
https://upc.edu.pe/transparencia-upc/pensiones-y-tarifas/tarifas-pregrado/

Estas tarifas deben separarse de las pensiones.

---

# 15. Admisión UPC

La UPC publica opciones como:

- Admisión General.
- Admisión Selección Preferente.
- Admisión Medicina.
- Traslado externo.
- Programa UPC-NCUK.
- Otras modalidades.

La Admisión General está dirigida a estudiantes de quinto de secundaria o egresados.

Fuente:
https://www.upc.edu.pe/admision/

Cronograma:
https://www.upc.edu.pe/admision/cronograma-de-admision/

Las fechas de admisión deben almacenarse como datos temporales con año y periodo.

---

# 16. Empleabilidad UPC

La UPC publica como evidencia institucional:

- 9 de cada 10 egresados trabaja.
- 94% trabaja en una actividad relacionada con la carrera estudiada.

La página atribuye el dato al Estudio Empleabilidad Egresados UPC – IPSOS Perú 2022.

También menciona salarios promedio a través de Ponte en Carrera y enumera 20 carreras en ese contexto.

Fuente:
https://upc.edu.pe/nosotros/pilares-estrategicos/exigencia/

## Regla para la base

No registrar:

```text
Ingeniería de Sistemas = 90% empleabilidad
```

si la fuente no publica ese valor para esa carrera.

Registrar:

```text
institution = UPC
career = NULL
indicator = EGRESADOS_TRABAJANDO
value = 90%
year = 2022
methodology = IPSOS Perú
```

---

# 17. Becas y financiamiento

Para UPC se deben investigar y registrar convocatorias y programas vigentes, por ejemplo:

- Beca 18.
- Beca BCP.
- Beca Laureate Transforma.
- Otras becas/financiamientos publicados oficialmente.

Cada registro debe tener:

```text
nombre
beneficio
requisitos
cobertura
convocatoria
fecha de inicio
fecha de cierre
estado
fuente
```

No mostrar una beca como permanente.

---

# 18. Mallas curriculares UPC

La sección de Transparencia publica mallas por carrera y modalidad.

Fuente:
https://www.upc.edu.pe/transparencia-upc/mallas-curriculares/

La ficha de Ingeniería de Sistemas de Información confirma una estructura en diez ciclos.

Fuente:
https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/

Cada malla debe guardar:

```text
academic_year
modality
version_name
source_url
accessed_at
is_current
```

No usar un PDF antiguo simplemente porque está disponible.

---

# 19. Fuentes oficiales prioritarias UPC

1. Campus:
   https://upc.edu.pe/nosotros/campus/

2. Transparencia – Mallas:
   https://www.upc.edu.pe/transparencia-upc/mallas-curriculares/

3. Transparencia – Pensiones:
   https://upc.edu.pe/transparencia-upc/pensiones-y-tarifas/pensiones-pregrado/

4. Transparencia – Tarifas:
   https://upc.edu.pe/transparencia-upc/pensiones-y-tarifas/tarifas-pregrado/

5. Admisión:
   https://www.upc.edu.pe/admision/

6. Cronograma:
   https://www.upc.edu.pe/admision/cronograma-de-admision/

7. Ingeniería de Sistemas de Información:
   https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-de-sistemas-de-informacion/

8. Ingeniería de Software:
   https://pregrado.upc.edu.pe/carrera-de-ingenieria-de-software/informacion-academica/

9. Administración:
   https://pregrado.upc.edu.pe/facultad-de-negocios/administracion/

10. Psicología:
    https://pregrado.upc.edu.pe/facultad-de-psicologia/psicologia/

11. Derecho:
    https://pregrado.upc.edu.pe/facultad-de-derecho/derecho/

12. Comunicación y Publicidad:
    https://pregrado.upc.edu.pe/facultad-de-comunicaciones/comunicacion-y-publicidad/

13. Empleabilidad:
    https://upc.edu.pe/nosotros/pilares-estrategicos/exigencia/

---

# 20. SQL inicial

```sql
create table institutions (
  id bigserial primary key,
  name text not null,
  short_name text unique,
  institution_type text not null,
  description text,
  website_url text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table campuses (
  id bigserial primary key,
  institution_id bigint not null references institutions(id),
  name text not null,
  address text not null,
  district text,
  city text default 'Lima',
  latitude numeric(10,7),
  longitude numeric(10,7),
  map_url text,
  is_active boolean not null default true
);

create table careers (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  faculty text,
  description text,
  duration_semesters integer,
  duration_years numeric(4,2),
  degree text,
  license_or_accreditation text,
  general_profile text,
  general_work_fields text,
  is_active boolean not null default true
);

create table academic_offers (
  id bigserial primary key,
  institution_id bigint not null references institutions(id),
  campus_id bigint not null references campuses(id),
  career_id bigint not null references careers(id),
  modality text not null,
  admission_status text not null default 'ACTIVE',
  official_url text,
  unique (institution_id, campus_id, career_id, modality)
);

create table sources (
  id bigserial primary key,
  source_name text not null,
  publisher text,
  url text not null,
  source_type text,
  published_date date,
  accessed_at timestamptz not null default now(),
  valid_until date,
  document_version text,
  notes text
);

create index idx_careers_name on careers(name);
create index idx_offers_institution on academic_offers(institution_id);
create index idx_offers_career on academic_offers(career_id);
create index idx_offers_campus on academic_offers(campus_id);

create table curricula (
  id bigserial primary key,
  academic_offer_id bigint not null references academic_offers(id),
  version_name text not null,
  academic_year integer,
  modality text not null,
  source_id bigint references sources(id),
  published_at date,
  is_current boolean not null default false
);

create table curriculum_courses (
  id bigserial primary key,
  curriculum_id bigint not null references curricula(id),
  cycle integer not null,
  course_code text,
  course_name text not null,
  credits numeric(5,2),
  course_type text,
  prerequisite text,
  source_id bigint references sources(id)
);

create index idx_curriculum_courses_curriculum
  on curriculum_courses(curriculum_id);

create index idx_curriculum_courses_cycle
  on curriculum_courses(curriculum_id, cycle);

create table tuition_fees (
  id bigserial primary key,
  academic_offer_id bigint not null references academic_offers(id),
  category text,
  concept text not null,
  amount numeric(12,2) not null,
  currency text not null default 'PEN',
  academic_year integer,
  valid_from date,
  valid_until date,
  conditions text,
  source_id bigint references sources(id)
);

create index idx_tuition_offer on tuition_fees(academic_offer_id);

create table scholarships (
  id bigserial primary key,
  institution_id bigint references institutions(id),
  name text not null,
  description text,
  benefit text,
  eligibility_summary text,
  requirements text,
  application_url text,
  valid_from date,
  valid_until date,
  status text not null default 'ACTIVE',
  source_id bigint references sources(id)
);

create index idx_scholarships_institution
  on scholarships(institution_id);

create table employment_indicators (
  id bigserial primary key,
  institution_id bigint not null references institutions(id),
  career_id bigint references careers(id),
  indicator_type text not null,
  indicator_value numeric(12,4),
  unit text,
  year integer,
  methodology text,
  notes text,
  source_id bigint references sources(id)
);

create index idx_employment_institution
  on employment_indicators(institution_id);

create index idx_employment_career
  on employment_indicators(career_id);
```

---

# 21. Fases de implementación

1. Crear proyecto Supabase.
2. Aplicar esquema.
3. Crear monorepo.
4. Configurar Next.js + TypeScript + Tailwind.
5. Cargar UPC.
6. Cargar cuatro campus.
7. Cargar carreras activas seleccionadas.
8. Cargar mallas vigentes.
9. Cargar costos 2026.
10. Cargar becas vigentes.
11. Cargar indicadores de empleabilidad con año y fuente.
12. Construir motor vocacional.
13. Construir resultado.
14. Construir explorador de carreras.
15. Construir chatbot contextual.
16. Implementar caché e índices.
17. Realizar prueba con aproximadamente 20 usuarios simultáneos.
18. Validar respuestas del chatbot.
19. Preparar piloto escolar.

---

# 22. Decisión final

```text
Frontend / App:
Next.js + TypeScript + Tailwind

Hosting:
Vercel

Database:
Supabase PostgreSQL

ORM:
Drizzle o Prisma

Validation:
Zod

Architecture:
Clean Architecture ligera
+ modularización por dominio
+ Repository Pattern
+ Use Cases

Repository:
GitHub Monorepo

AI:
API externa protegida por server-side routes

Search:
PostgreSQL Full Text Search
→ pgvector como evolución

Users:
Sin registro en MVP

Data:
Estructurada, versionada y con fuentes
```

---

# 23. Criterio de calidad

Cada dato mostrado al alumno debe responder:

```text
¿Qué dato es?
¿Quién lo publicó?
¿De qué año es?
¿Cuándo se consultó?
¿Está vigente?
¿A qué carrera aplica?
¿A qué sede aplica?
¿Tiene condiciones?
¿Cuál es la fuente?
```

El sistema debe priorizar información oficial de cada institución y registrar la fecha de consulta. Los datos temporales deberán revisarse antes de cada piloto.

