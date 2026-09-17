import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Map, ShieldCheck, GraduationCap, FileText, Menu } from "lucide-react";

/* ─────────────────────────────────────────────
   Decoración cartográfica SVG inline — muy sutil
───────────────────────────────────────────── */
function MapDecoration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Líneas de ruta */}
      <path
        d="M 80 340 Q 140 280 200 320 Q 260 360 310 290 Q 360 220 420 250"
        stroke="#08BBD5" strokeWidth="1.2" strokeDasharray="5 8"
        fill="none" opacity="0.12"
      />
      <path
        d="M 60 480 Q 100 440 160 460 Q 220 480 260 430"
        stroke="#0B2D4D" strokeWidth="1" strokeDasharray="4 7"
        fill="none" opacity="0.08"
      />
      {/* Puntos de ubicación */}
      <circle cx="200" cy="320" r="3.5" fill="#08BBD5" opacity="0.18" />
      <circle cx="310" cy="290" r="2.5" fill="#18A86B" opacity="0.22" />
      <circle cx="420" cy="250" r="3" fill="#08BBD5" opacity="0.15" />
      {/* Mini brújula */}
      <g transform="translate(68, 200)" opacity="0.10">
        <circle cx="0" cy="0" r="14" stroke="#0B2D4D" strokeWidth="1" fill="none" />
        <line x1="0" y1="-10" x2="0" y2="-4" stroke="#08BBD5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="4" x2="0" y2="10" stroke="#0B2D4D" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="-10" y1="0" x2="-4" y2="0" stroke="#0B2D4D" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="4" y1="0" x2="10" y2="0" stroke="#0B2D4D" strokeWidth="1.2" strokeLinecap="round" />
        <text x="-3" y="-15" fontSize="7" fill="#0B2D4D" fontWeight="bold">N</text>
      </g>
      {/* Líneas topográficas */}
      <ellipse cx="180" cy="560" rx="70" ry="22" stroke="#0B2D4D" strokeWidth="0.8" fill="none" opacity="0.06" />
      <ellipse cx="180" cy="560" rx="50" ry="15" stroke="#0B2D4D" strokeWidth="0.8" fill="none" opacity="0.06" />
      <ellipse cx="180" cy="560" rx="30" ry="9" stroke="#0B2D4D" strokeWidth="0.8" fill="none" opacity="0.06" />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      className="flex flex-col min-h-screen font-sans overflow-hidden relative"
      style={{ background: "#F5FAFD" }}
    >

      {/* ── NAVBAR FLOTANTE ── */}
      <header className="relative z-50 pt-5 pb-3 w-full flex items-center justify-between px-5 md:px-10 lg:px-16">
        {/* Logo (Ocupa 1/3 del espacio para centrar el Nav) */}
        <div className="flex-1 flex items-center gap-3 hidden md:flex">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E1EDF3] bg-[#F5FAFD] relative flex-shrink-0">
            <Image
              src="/assets/chaski/chaski-10.png"
              alt="Logo Chaski"
              fill
              className="object-cover object-top"
            />
          </div>
          <span className="text-[13px] font-bold tracking-wide text-[#0B2D4D] opacity-70">
            ORIENTADOR VOCACIONAL IA
          </span>
        </div>

        {/* Nav cápsula centrada */}
        <nav
          className="flex items-center gap-1 px-5 py-2 rounded-full border"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #E1EDF3",
            boxShadow: "0 4px 20px rgba(8,43,77,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link
            href="/"
            className="text-[13px] font-bold px-3 py-1.5 rounded-full transition-all"
            style={{ color: "#0B2D4D", background: "#E8F7FB" }}
          >
            Inicio
          </Link>
          <Link
            href="/como-funciona"
            className="text-[13px] font-medium px-3 py-1.5 rounded-full hover:bg-[#F0F8FF] transition-colors"
            style={{ color: "#355B78" }}
          >
            Cómo funciona
          </Link>
          <Link
            href="/universidades"
            className="hidden sm:block text-[13px] font-medium px-3 py-1.5 rounded-full hover:bg-[#F0F8FF] transition-colors"
            style={{ color: "#355B78" }}
          >
            Universidades
          </Link>
          <Link
            href="/sobre-el-proyecto"
            className="hidden md:block text-[13px] font-medium px-3 py-1.5 rounded-full hover:bg-[#F0F8FF] transition-colors"
            style={{ color: "#355B78" }}
          >
            Sobre el proyecto
          </Link>
        </nav>

        {/* Contenedor derecho (Hamburguesa en mobile, vacío en desktop para equilibrar) */}
        <div className="flex-1 flex justify-end">
          <button
            className="md:hidden p-2 rounded-full border border-[#E1EDF3] bg-white/90"
            aria-label="Menú"
          >
            <Menu className="w-4 h-4 text-[#0B2D4D]" />
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="relative z-10 flex-1 w-full flex flex-col md:flex-row items-center md:items-stretch overflow-hidden">

        {/* ── COLUMNA IZQUIERDA: contenido ── */}
        <div
          className="relative z-20 flex flex-col justify-center w-full md:w-[48%] lg:w-[45%]
                      px-6 md:pl-10 lg:pl-16 md:pr-6 pt-4 pb-10 md:py-12"
        >
          {/* Decoración cartográfica (detrás del texto) */}
          <MapDecoration />

          {/* Badge IA */}
          <div className="relative flex items-center gap-2 mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "rgba(24,168,107,0.10)", color: "#18A86B", border: "1px solid rgba(24,168,107,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#18A86B] animate-pulse" />
              Orientador Vocacional con IA
            </span>
          </div>

          {/* Título */}
          <h1
            className="relative font-extrabold tracking-tight leading-[1.02] mb-6"
            style={{ color: "#0B2D4D", fontSize: "clamp(38px, 5vw, 62px)" }}
          >
            Tu futuro<br />
            también es parte de<br />
            nuestra{" "}
            <span style={{ color: "#08BBD5" }}>historia.</span>
          </h1>

          {/* Descripción */}
          <p
            className="relative font-medium leading-relaxed mb-8"
            style={{
              color: "#355B78",
              fontSize: "clamp(15px, 1.5vw, 17px)",
              maxWidth: "480px",
            }}
          >
            Descubre hacia dónde puede llevarte tu curiosidad.
            Conoce tus intereses, descubre carreras que conectan
            contigo y explora dónde podrías estudiar.
          </p>

          {/* CTA */}
          <div className="relative flex items-center gap-4 mb-10">
            <Link
              href="/cuestionario"
              id="hero-cta"
              className="group inline-flex items-center gap-2 font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "#08BBD5",
                padding: "15px 28px",
                borderRadius: "14px",
                fontSize: "15px",
                boxShadow: "0 6px 24px rgba(8,187,213,0.32)",
              }}
            >
              Comenzar aventura
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Stats cards */}
          <div className="relative flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
            {/* 16 decisiones */}
            <StatCard
              icon={<Map className="w-4 h-4" style={{ color: "#08BBD5" }} />}
              value="16"
              label="decisiones"
              accent="#08BBD5"
            />
            {/* 8 dimensiones */}
            <StatCard
              icon={<ShieldCheck className="w-4 h-4" style={{ color: "#08BBD5" }} />}
              value="8"
              label="dimensiones"
              accent="#08BBD5"
            />
            {/* Universidades — verde */}
            <StatCard
              icon={<GraduationCap className="w-4 h-4" style={{ color: "#18A86B" }} />}
              value="Universidades"
              label="del Perú"
              accent="#18A86B"
              accentBg="rgba(24,168,107,0.08)"
            />
            {/* Reporte PDF */}
            <StatCard
              icon={<FileText className="w-4 h-4" style={{ color: "#08BBD5" }} />}
              value="Reporte"
              label="en PDF"
              accent="#08BBD5"
            />
          </div>
        </div>

        {/* ── COLUMNA DERECHA: imagen hero ── */}
        <div className="relative w-full md:w-[52%] lg:w-[55%] h-[360px] md:h-auto flex-shrink-0 order-last md:order-none">

          {/* Imagen Chaski + Machu Picchu */}
          <Image
            src="/assets/chaski-hero.png"
            alt="Chaski, el orientador vocacional IA, en Machu Picchu"
            fill
            className="object-cover object-[center_30%]"
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
          />

          {/* Máscara superior — difumina el corte recto de la imagen */}
          <div
            className="absolute top-0 left-0 right-0 h-[20%] pointer-events-none z-10"
            style={{
              background: "linear-gradient(to bottom, #F5FAFD 0%, transparent 100%)",
            }}
          />

          {/* Máscara lateral izquierda — integra la imagen con el fondo (suavizada) */}
          <div
            className="absolute inset-y-0 left-0 w-[20%] pointer-events-none z-10"
            style={{
              background: "linear-gradient(to right, #F5FAFD 0%, transparent 100%)",
            }}
          />

          {/* Máscara inferior en mobile */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 md:hidden pointer-events-none z-10"
            style={{ background: "linear-gradient(to top, #F5FAFD, transparent)" }}
          />

          {/* Anotación manuscrita de Chaski */}
          <div
            className="hidden lg:block absolute z-20"
            style={{ top: "10%", right: "50%", transform: "rotate(-3deg)" }}
          >
            <div
              className="relative animate-[float_5s_ease-in-out_infinite]"
              style={{ animation: "float 5s ease-in-out infinite" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  fontSize: "18px",
                  fontWeight: "800",
                  lineHeight: "1.4",
                  color: "#FFFFFF",
                  textShadow: "0 2px 8px rgba(11,45,77,0.9), 0 0 5px rgba(11,45,77,0.7)",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.02em",
                }}
              >
                ¡Hola!<br />
                Soy Chaski,<br />
                tu compañero<br />
                en esta aventura.
              </p>
              {/* Flecha dibujada */}
              <svg
                width="45" height="45" viewBox="0 0 52 52"
                fill="none" xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-10 -right-6"
                style={{ transform: "rotate(30deg)" }}
              >
                <path
                  d="M4 4 Q 16 32 44 42"
                  stroke="#FFFFFF" strokeWidth="3"
                  strokeLinecap="round" fill="none" opacity="0.95"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(11,45,77,0.5))" }}
                />
                <path
                  d="M36 42 L 44 42 L 41 34"
                  stroke="#FFFFFF" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(11,45,77,0.5))" }}
                />
              </svg>
            </div>
          </div>

        </div>
      </main>

      {/* Keyframe para la animación del texto de Chaski */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-col > * {
          animation: fadeInUp 0.7s ease both;
        }
        .hero-col > *:nth-child(1) { animation-delay: 0.05s; }
        .hero-col > *:nth-child(2) { animation-delay: 0.15s; }
        .hero-col > *:nth-child(3) { animation-delay: 0.25s; }
        .hero-col > *:nth-child(4) { animation-delay: 0.35s; }
        .hero-col > *:nth-child(5) { animation-delay: 0.45s; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Componente de estadística/stat card
───────────────────────────────────────────── */
function StatCard({
  icon,
  value,
  label,
  accent,
  accentBg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
  accentBg?: string;
}) {
  return (
    <div
      className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 cursor-default"
      style={{
        background: accentBg ?? "rgba(8,187,213,0.06)",
        borderColor: accentBg ? "rgba(24,168,107,0.20)" : "rgba(8,187,213,0.20)",
        boxShadow: "0 2px 10px rgba(8,43,77,0.05)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accentBg ?? "rgba(8,187,213,0.12)" }}
      >
        {icon}
      </div>
      <div className="text-left">
        <p
          className="text-[13px] font-extrabold leading-none"
          style={{ color: accent }}
        >
          {value}
        </p>
        <p
          className="text-[10.5px] font-medium mt-0.5"
          style={{ color: "#7A96A8" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
