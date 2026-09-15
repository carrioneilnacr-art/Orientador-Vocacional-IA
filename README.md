<div align="center">

# 🧭 Orientador Vocacional IA

**Plataforma inteligente de orientación vocacional y exploración académica basada en IA con datos oficiales verificados.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.39-c5f74f?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-729b1b?style=for-the-badge&logo=vitest)](https://vitest.dev/)

---

[Descripción](#-acerca-del-proyecto) •
[Características](#-características-principales) •
[Arquitectura y Tecnologías](#-stack-tecnológico) •
[Estructura](#-estructura-del-proyecto) •
[Instalación](#-instalación-y-configuración) •
[Base de Datos y Universidades](#-datos-verificados-y-universidades) •
[Pruebas](#-pruebas-y-calidad)

</div>

---

## 📖 Acerca del Proyecto

**Orientador Vocacional IA** es una solución web integral diseñada para guiar a estudiantes de educación secundaria y postulantes preuniversitarios en la elección de su carrera profesional y universidad ideal.

A diferencia de los tests vocacionales convencionales o los chatbots con riesgo de alucinación, esta plataforma combina:
1. **Psicometría Rigurosa:** Evaluación de 16 preguntas basada en el modelo **RIASEC** (*Realista, Investigador, Artístico, Social, Emprendedor, Convencional*) de John Holland complementado con factores de afinidad tecnológica y lógica.
2. **Grounded AI (Cero Alucinaciones):** Toda recomendación, duración de carrera, malla curricular ciclo a ciclo, créditos, sedes, costos y tasas de empleabilidad proviene estrictamente de registros auditados en nuestra base de datos relacional PostgreSQL en Supabase.
3. **Experiencia Gamificada y Accesible:** Interfaz interactiva acompañada por el avatar guía **Chaski**, transiciones fluidas, feedback en tiempo real y descarga de informe vocacional personalizado en formato PDF.

---

## ✨ Características Principales

- **🎮 Cuestionario Interactivo por Misiones:** 16 preguntas agrupadas en 4 fases vocacionales con acompañamiento de avatar, indicador de avance segmentado y persistencia en sesión.
- **📊 Radar Psicométrico RIASEC:** Visualización gráfica del perfil vocacional del estudiante mediante gráficos radiales dinámicos generados con Recharts.
- **🎯 Algoritmo de Matching Vocacional:** Inferencia ponderada que clasifica las mejores carreras afines con porcentaje de compatibilidad y explicación contextualizada.
- **🏛️ Catálogo Multi-Universitario:** Información oficial y comparativa de las principales universidades peruanas en Lima Norte y a nivel nacional (UPN, UTP, UCV, UCH, UCSUR, USMP).
- **📚 Visor de Mallas Curriculares Oficiales:** Visualización estructurada por ciclos académicos, asignaturas formativas, créditos y certificaciones progresivas.
- **📄 Exportación de Informe Vocacional PDF:** Generación nativa en cliente de un reporte profesional descargable con el resumen del perfil vocacional y las carreras sugeridas.
- **🔒 Seguridad y Gobernanza de Datos:** Persistencia anonimizada en Supabase con Row Level Security (RLS) habilitado en todas las tablas.

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Propósito / Uso |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework React con Server Components, Streaming y Route Handlers optimizados. |
| **React 19** | Biblioteca de UI con las últimas características concurrentes y de renderizado. |
| **TypeScript 5** | Tipado estático estricto en toda la aplicación para máxima robustez y mantenibilidad. |
| **Tailwind CSS v4** | Motor de estilos utilitarios ultrarrápido con diseño responsivo y tema moderno. |
| **Framer Motion** | Animaciones fluidas, transiciones de pantalla e interactividad en el cuestionario. |
| **Recharts** | Generación de gráficos de radar interactivos para la visualización del perfil RIASEC. |
| **Lucide React** | Biblioteca de iconos moderna, ligera y estilizada. |
| **jsPDF & dom-to-image-more** | Renderizado y exportación de reportes vocacionales a PDF en alta fidelidad. |

### Backend, IA y Base de Datos
| Tecnología | Propósito / Uso |
| :--- | :--- |
| **Supabase (PostgreSQL 15+)** | Base de datos relacional en la nube con RLS, extensiones UUID y pooler transaccional. |
| **Drizzle ORM & Drizzle Kit** | ORM TypeScript-first para modelado seguro de esquemas relacionales y migraciones. |
| **Vercel AI SDK (`ai`)** | Abstracción para streaming de IA, tool calling y manejo de prompts estructurados. |
| **Google Gemini API (@google/genai)** | Modelos Gemini 2.0 Flash / Pro para síntesis y fundamentación de resultados vocacionales. |
| **Zod & drizzle-zod** | Validación declarativa de esquemas, tipos y payloads de API en runtime. |
| **postgres.js** | Driver nativo de PostgreSQL de alto rendimiento para scripts de migración y seeding. |

### Herramientas de Extracción y Calidad
| Tecnología | Propósito / Uso |
| :--- | :--- |
| **Vitest 5** | Suite de pruebas unitarias ultrarrápida para calibración psicométrica y scoring. |
| **Python & pypdfium2** | Scripts especializados de extracción espacial de mallas curriculares desde PDFs oficiales. |
| **ESLint 9** | Linter de código adaptado para Next.js y TypeScript. |

---

## 📂 Estructura del Proyecto

```text
Orientador-Vocacional-IA/
├── archivos u/                  # Folletos y mallas curriculares oficiales en PDF (UPN, UTP, UCV, UCH, UCSUR, USMP)
├── docs/
│   ├── architecture/            # Esquemas de BD (DATABASE_SCHEMA.md) y migraciones SQL (001 a 012)
│   ├── data/                    # Fichas maestras de fuentes verificadas (UPN, UTP, UCV, UCH, UCSUR, USMP)
│   ├── rules/                   # Reglas de desarrollo y directivas Grounded AI
│   └── tracking/                # Tablero Kanban y Definition of Done (PROJECT_TRACKING.md)
├── public/                      # Assets estáticos, logos institucionales e ilustraciones de Chaski
├── scripts/                     # Scripts de ingesta de datos, migraciones SQL y verificación
│   ├── apply_upn_migration.mjs
│   ├── apply_utp_migration.mjs
│   ├── generate_upn_sql.py
│   ├── generate_utp_sql.py
│   ├── parse_all_upn_careers.py
│   └── parse_all_utp_careers.py
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/vocacional/      # API Route Handler para scoring RIASEC y persistencia
│   │   ├── cuestionario/        # Pantalla del test vocacional interactivo
│   │   ├── resultados/          # Pantalla de visualización de perfil y top carreras
│   │   ├── layout.tsx           # Root layout con metadata SEO
│   │   └── page.tsx             # Landing Page principal
│   ├── components/              # Componentes modulares reutilizables de UI
│   ├── db/                      # Modelos Drizzle ORM y cliente de base de datos
│   │   ├── index.ts             # Instancia de conexión a Supabase / PostgreSQL
│   │   └── schema.ts            # Definición completa de tablas relacionales
│   ├── lib/                     # Utilidades, algoritmos y funciones de apoyo
│   └── __tests__/               # Pruebas automatizadas con Vitest
├── .env.example                 # Plantilla de variables de entorno requeridas
├── package.json                 # Dependencias y scripts de ejecución
├── tsconfig.json                # Configuración de compilación TypeScript
└── vitest.config.ts             # Configuración de pruebas Vitest
```

---

## 🏛️ Datos Verificados y Universidades

El proyecto garantiza trazabilidad absoluta respaldada en documentos de pregrado oficiales:

| Institución | Carreras Registradas | Cursos en Malla | Campus Registrados | Fuente Oficial |
| :--- | :---: | :---: | :---: | :--- |
| **UPN** | 13 carreras | 895 cursos | 6 campus (Los Olivos, Comas, Breña, Chorrillos, SJL, Trujillo) | [`docs/data/UPN_VERIFIED_SOURCES.md`](docs/data/UPN_VERIFIED_SOURCES.md) |
| **UTP** | 13 carreras | 737 cursos | 15 campus (Lima Norte - Los Olivos, Lima Centro, SJL, etc.) | [`docs/data/UTP_VERIFIED_SOURCES.md`](docs/data/UTP_VERIFIED_SOURCES.md) |
| **UCV** | 11 carreras | 535 cursos | 13 campus (Lima Norte - Los Olivos, SJL, Ate, etc.) | [`docs/data/UCV_VERIFIED_SOURCES.md`](docs/data/UCV_VERIFIED_SOURCES.md) |
| **UCH** | 9 carreras | 576 cursos | 1 campus (Los Olivos, Lima) | [`docs/data/UCH_VERIFIED_SOURCES.md`](docs/data/UCH_VERIFIED_SOURCES.md) |
| **UCSUR** | 15 carreras | 853 cursos | 4 campus (Campus Norte - Los Olivos, Villa, Aramburú, Ate) | [`docs/data/UCSUR_VERIFIED_SOURCES.md`](docs/data/UCSUR_VERIFIED_SOURCES.md) |
| **USMP** | 14 carreras | 954 cursos | 6 campus (Sede Lima Norte - Comas, Santa Anita, La Molina, Surquillo, Chiclayo, Arequipa) | [`docs/data/USMP_VERIFIED_SOURCES.md`](docs/data/USMP_VERIFIED_SOURCES.md) |

> **Total en Base de Datos:** 522 ofertas académicas, 28 carreras parametrizadas y 4,629 cursos con asignación exacta de ciclo, créditos y horas formativas auditadas por SUNEDU, con foco prioritario en las sedes de la **Zona Norte de Lima**.

---

## 🚀 Instalación y Configuración

### 1. Prerrequisitos
- **Node.js:** Versión `18.18.0` o superior (recomendado Node 20 LTS o 22 LTS).
- **npm** o **pnpm** instalado.
- Cuenta activa en [Supabase](https://supabase.com/) con un proyecto PostgreSQL creado.
- Llave API de [Google AI Studio](https://aistudio.google.com/app/apikey) para Gemini.

### 2. Clonar el Repositorio
```bash
git clone https://github.com/carrioneilnacr-art/Orientador-Vocacional-IA.git
cd Orientador-Vocacional-IA
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno
Copia el archivo de ejemplo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Configura tus credenciales en `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-clave-publica-anon"
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"

# Google Gemini AI Key
GOOGLE_GENERATIVE_AI_API_KEY="tu_clave_gemini_api"
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🧪 Pruebas y Calidad

Para ejecutar la suite de pruebas unitarias psicométricas con Vitest:
```bash
npm run test -- --run
```

Para verificar el diagnóstico de conexión con Supabase y Google Gemini:
```bash
node test-db.mjs
```

Para construir el bundle de producción:
```bash
npm run build
```

---

## 📄 Licencia y Autores

Este proyecto ha sido desarrollado siguiendo principios de Arquitectura Limpia (*Clean Architecture*), accesibilidad web y estándares de IA Verificable (*Grounded AI*).

Licencia bajo los términos acordados para el proyecto **Orientador Vocacional IA**.
