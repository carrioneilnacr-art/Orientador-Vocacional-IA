import Link from "next/link";
import { ArrowRight, BrainCircuit, Compass, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl tracking-tight">Orientador IA</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Cómo funciona
          </Link>
          <Link href="#carreras" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Carreras UPC
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-white to-slate-50">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 mb-6">
          Desarrollado con Inteligencia Artificial
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mb-6">
          Descubre la carrera ideal para tu <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">futuro profesional</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
          Nuestro orientador vocacional analiza tu personalidad, intereses y habilidades para recomendarte las mejores opciones académicas en la UPC.
        </p>
        
        <Link 
          href="/cuestionario"
          className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group"
        >
          Empieza a conocer tu futuro
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full mt-24 text-left">
          <div className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Evaluación Psicométrica</h3>
            <p className="text-slate-600">Basado en el modelo Holland (RIASEC) adaptado para perfiles tecnológicos y de innovación.</p>
          </div>
          
          <div className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resultados Precisos</h3>
            <p className="text-slate-600">Obtén un radar de tu personalidad y un Top 3 de carreras recomendadas con justificación detallada.</p>
          </div>
          
          <div className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Asistente 24/7</h3>
            <p className="text-slate-600">Resuelve tus dudas sobre mallas curriculares, costos y sedes conversando con nuestra IA oficial.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-8 px-6 text-center text-slate-500">
        <p>© 2026 Orientador Vocacional IA - UPC. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
