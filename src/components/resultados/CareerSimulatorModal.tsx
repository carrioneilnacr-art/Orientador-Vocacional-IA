'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Shield,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

interface SimulationScenario {
  careerSlug: string;
  careerName: string;
  roleTitle: string;
  badgeName: string;
  caseDescription: string;
  context: string;
  dilemma: {
    question: string;
    options: {
      id: string;
      title: string;
      description: string;
      score: number;
      feedback: string;
      competency: string;
    }[];
  };
}

const CAREER_SCENARIOS: Record<string, SimulationScenario> = {
  'psicologia': {
    careerSlug: 'psicologia',
    careerName: 'Psicología',
    roleTitle: 'Psicólogo(a) Clínico y Evaluador',
    badgeName: 'Maestría en Diagnóstico y Empatía Humana',
    context: 'Hospital de Emergencias / Consultorio Privado',
    caseDescription:
      'Un joven universitario llega a consulta manifestando insomnio severo y bloqueo ante sus exámenes finales. Siente que si reprueba un curso decepcionará a su familia, y está considerando abandonar la carrera.',
    dilemma: {
      question: '¿Cuál es tu estrategia de intervención psicológica prioritaria?',
      options: [
        {
          id: 'A',
          title: 'Escucha activa y reestructuración cognitiva',
          description:
            'Validas sus emociones para reducir la angustia inmediata y aplicas técnicas cognitivo-conductuales para desmontar la creencia catastrófica.',
          score: 95,
          feedback:
            '¡Excelente criterio clínico! Priorizaste la contención emocional y la evidencia científica en psicoterapia.',
          competency: 'Alianza Terapéutica y TCC',
        },
        {
          id: 'B',
          title: 'Consejo directivo y organización de horarios',
          description:
            'Le diseñas un horario estricto de estudio y le dices que solo necesita ser más disciplinado.',
          score: 60,
          feedback:
            'Atendiste la parte operativa, pero minimizaste el factor de ansiedad subyacente que requiere intervención profesional.',
          competency: 'Gestión Conductual Básica',
        },
        {
          id: 'C',
          title: 'Exploración psicodinámica profunda de la infancia',
          description:
            'Indagas extensamente sus primeros años de vida antes de estabilizar la crisis actual.',
          score: 75,
          feedback:
            'Es un abordaje teórico válido, pero en situaciones agudas es prioritario dotar al paciente de herramientas inmediatas de afrontamiento.',
          competency: 'Análisis Teórico',
        },
      ],
    },
  },
  'derecho': {
    careerSlug: 'derecho',
    careerName: 'Derecho',
    roleTitle: 'Abogado(a) y Negociador Corporativo',
    badgeName: 'Estratega en Litigios y Mediación Legal',
    context: 'Centro de Arbitraje y Cámara de Comercio',
    caseDescription:
      'Dos empresas socias enfrentan una controversia por un contrato de distribución. La contraparte amenaza con una demanda judicial de 2 años que paralizará la producción de tu cliente.',
    dilemma: {
      question: '¿Qué postura jurídica estratégica asumes para proteger a tu patrocinado?',
      options: [
        {
          id: 'A',
          title: 'Proponer una cláusula de conciliación extrajudicial con garantías reales',
          description:
            'Redactas un addendum con mediación vinculante y compensaciones escalonadas, resolviendo el conflicto en 15 días.',
          score: 95,
          feedback:
            '¡Brillante visión legal y comercial! Evitaste costos procesales y blindaste el patrimonio de tu cliente.',
          competency: 'Negociación y Derecho Contractual',
        },
        {
          id: 'B',
          title: 'Ir a juicio de inmediato con demanda por daños y perjuicios',
          description:
            'Inicias un litigio contencioso masivo buscando una indemnización millonaria.',
          score: 65,
          feedback:
            'Postura agresiva que genera incertidumbre temporal y altos costos legales que podrían asfixiar a tu cliente.',
          competency: 'Litigio Contencioso',
        },
        {
          id: 'C',
          title: 'Ceder en todas las exigencias de la contraparte para evitar el juicio',
          description:
            'Firmas un desistimiento rápido aceptando las condiciones del competidor.',
          score: 40,
          feedback:
            'Grave error de defensa. Dejaste desprotegidos los derechos contractuales de tu patrocinado.',
          competency: 'Defensa Pasiva',
        },
      ],
    },
  },
  'arquitectura': {
    careerSlug: 'arquitectura',
    careerName: 'Arquitectura',
    roleTitle: 'Arquitecto(a) Proyectista y Diseñador Sostenible',
    badgeName: 'Maestro del Espacio y Hábitat Urbano',
    context: 'Estudio de Arquitectura / Proyecto Comunitario Lima Norte',
    caseDescription:
      'Se te encarga el anteproyecto de un centro cultural en un terreno con pendiente pronunciada y alta radiación solar en Los Olivos, con un presupuesto limitado.',
    dilemma: {
      question: '¿Qué principio de diseño arquitectónico lidera tu propuesta?',
      options: [
        {
          id: 'A',
          title: 'Diseño bioclimático aterrazado con ventilación pasiva y materiales locales',
          description:
            'Aprovechas la topografía natural para crear plazas en niveles, celosías de sombra y materiales de bajo impacto que reducen el gasto energético.',
          score: 95,
          feedback:
            '¡Extraordinaria sensibilidad arquitectónica! Integraste estética, sostenibilidad y viabilidad constructiva.',
          competency: 'Diseño Bioclimático y Espacial',
        },
        {
          id: 'B',
          title: 'Nivelar todo el terreno con muros de contención masivos y fachada vidriada',
          description:
            'Creas un volumen cúbico moderno de vidrio que requiere aire acondicionado permanente.',
          score: 55,
          feedback:
            'Visualmente llamativo pero constructivamente costoso e ineficiente energéticamente para el clima local.',
          competency: 'Formalismo Estético',
        },
        {
          id: 'C',
          title: 'Copiar un modelo estándar sin adaptar al entorno',
          description:
            'Utilizas un plano genérico de aulas modulares sin considerar la pendiente ni el asoleamiento.',
          score: 45,
          feedback:
            'Falta de criterio proyectual. Un buen arquitecto responde a la identidad y topografía del lugar.',
          competency: 'Diseño Convencional',
        },
      ],
    },
  },
  'ingenieria-de-software': {
    careerSlug: 'ingenieria-de-software',
    careerName: 'Ingeniería de Software',
    roleTitle: 'Tech Lead & Arquitecto de Software',
    badgeName: 'Arquitecto de Sistemas de Alta Escala',
    context: 'Centro de Operaciones de Comercio Electrónico',
    caseDescription:
      'En pleno CyberDay, la pasarela de pagos experimenta una sobrecarga de 50,000 peticiones por minuto, provocando caídas intermitentes y quejas masivas.',
    dilemma: {
      question: '¿Qué arquitectura y acción técnica despliegas para restaurar el servicio en 5 minutos?',
      options: [
        {
          id: 'A',
          title: 'Activar colas asíncronas de mensajería (Kafka/RabbitMQ) y autoescalado',
          description:
            'Desacoplas las compras de la facturación en tiempo real, encolando pagos de forma segura y aumentando nodos de cómputo.',
          score: 98,
          feedback:
            '¡Impecable arquitectura distribuida! Protegiste la integridad de las transacciones y la experiencia del usuario.',
          competency: 'Sistemas Distribuidos y Resiliencia',
        },
        {
          id: 'B',
          title: 'Reiniciar el servidor principal repetidamente',
          description:
            'Envías comandos de reinicio forzado a las máquinas esperando que la carga baje sola.',
          score: 40,
          feedback:
            'Práctica riesgosa que puede corromper datos de pagos en vuelo e incrementar el tiempo de inactividad.',
          competency: 'Soporte Básico',
        },
        {
          id: 'C',
          title: 'Deshabilitar el 80% de los usuarios temporalmente con página de error',
          description:
            'Bloqueas el acceso general para que solo unos pocos puedan comprar.',
          score: 60,
          feedback:
            'Salva el servidor, pero causa un impacto económico severo para la empresa.',
          competency: 'Mitigación de Emergencia',
        },
      ],
    },
  },
  'administracion': {
    careerSlug: 'administracion',
    careerName: 'Administración',
    roleTitle: 'Director(a) de Operaciones y Estrategia',
    badgeName: 'Líder Ejecutivo de Negocios Globales',
    context: 'Corporación Comercial y Retail',
    caseDescription:
      'Un nuevo competidor internacional entra al mercado con precios 30% más bajos, amenazando con capturar el 40% de tus clientes en el próximo trimestre.',
    dilemma: {
      question: '¿Qué decisión estratégica de gestión corporativa ejecutas?',
      options: [
        {
          id: 'A',
          title: 'Diferenciación por valor, fidelización de clientes y optimización de costes operativos',
          description:
            'Reestructuras la cadena de suministro para ser más eficiente, lanzas servicios postventa exclusivos y personalizas la experiencia del cliente.',
          score: 95,
          feedback:
            '¡Visión ejecutiva de alto nivel! Evitaste una guerra de precios destructiva y consolidaste una ventaja competitiva sostenible.',
          competency: 'Estrategia Competitiva de Porter',
        },
        {
          id: 'B',
          title: 'Bajar los precios un 35% vendiendo a pérdida',
          description:
            'Inicias una guerra de precios agresiva sin importar el margen financiero.',
          score: 50,
          feedback:
            'Estrategia de alto riesgo que quema la caja de la empresa y destruye la rentabilidad.',
          competency: 'Guerra de Precios',
        },
        {
          id: 'C',
          title: 'Mantener todo igual y esperar que el competidor quiebre',
          description:
            'No realizas ningún cambio táctico en el producto ni en la comunicación.',
          score: 40,
          feedback:
            'Inacción gerencial. El mercado exige adaptación dinámica continua.',
          competency: 'Gestión Pasiva',
        },
      ],
    },
  },
};

interface CareerSimulatorModalProps {
  career: {
    slug: string;
    name: string;
  };
  onClose: () => void;
}

export function CareerSimulatorModal({ career, onClose }: CareerSimulatorModalProps) {
  const scenario =
    CAREER_SCENARIOS[career.slug] || CAREER_SCENARIOS['psicologia'];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedOption = scenario.dilemma.options.find(
    (opt) => opt.id === selectedOptionId
  );

  const handleSelect = (id: string) => {
    setSelectedOptionId(id);
  };

  const handleFinish = () => {
    if (selectedOptionId) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#D6E5EF] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Superior Gamificado */}
        <div className="bg-gradient-to-r from-[#082A4A] to-[#0D3B66] text-white p-6 sm:p-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#00C2E0]">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C2E0]/20 text-[#00C2E0] text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Simulador de Desafío Profesional</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {scenario.roleTitle}
              </h2>
              <p className="text-xs text-[#C4D9EB]">
                {scenario.context} • Desafío en Tiempo Real
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {!isCompleted ? (
            <>
              {/* Descripción del Caso */}
              <div className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-[#00C2E0] uppercase tracking-wider block">
                  Situación de la Vida Real:
                </span>
                <p className="text-sm text-[#082A4A] leading-relaxed font-medium">
                  {scenario.caseDescription}
                </p>
              </div>

              {/* Dilema y Opciones */}
              <div>
                <h3 className="text-base font-bold text-[#082A4A] mb-4">
                  {scenario.dilemma.question}
                </h3>

                <div className="space-y-3">
                  {scenario.dilemma.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E8F7FB] border-[#00C2E0] ring-2 ring-[#00C2E0]/30 shadow-sm'
                            : 'bg-white border-[#E1EDF3] hover:border-[#CBDDE6] hover:bg-[#FAFDFE]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#00C2E0] text-white'
                                : 'bg-[#F0F5F9] text-[#4F6B85]'
                            }`}
                          >
                            {opt.id}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[#082A4A]">
                              {opt.title}
                            </h4>
                            <p className="text-xs text-[#4F6B85] leading-relaxed">
                              {opt.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Pantalla de Veredicto y Logro Profesional */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00C2E0] to-[#18A86B] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#00C2E0]/30">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#00C2E0] uppercase tracking-wider">
                  Evaluación de Criterio Profesional
                </span>
                <h3 className="text-2xl font-black text-[#082A4A]">
                  {selectedOption?.score && selectedOption.score >= 85
                    ? '¡Aptitud Profesional Sobresaliente!'
                    : '¡Buen intento de aproximación!'}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Puntuación de Desempeño: {selectedOption?.score}%</span>
                </div>
              </div>

              {/* Feedback y Competencia Demostrada */}
              <div className="bg-[#F8FCFF] border border-[#D6E5EF] rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-[#E1EDF3] pb-2">
                  <span className="text-xs font-bold text-[#4F6B85] uppercase">
                    Competencia Evaluada:
                  </span>
                  <span className="text-xs font-bold text-[#00C2E0]">
                    {selectedOption?.competency}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#082A4A] leading-relaxed">
                  {selectedOption?.feedback}
                </p>
              </div>

              {/* Badge Desbloqueado */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                    Insignia Desbloqueada:
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#5C4516]">
                    {scenario.badgeName}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer de Acciones */}
        <div className="bg-[#F8FCFF] border-t border-[#E1EDF3] p-5 sm:p-6 flex items-center justify-between gap-4">
          {!isCompleted ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#D6E5EF] text-[#4F6B85] hover:text-[#082A4A] text-xs font-bold transition-colors"
              >
                Cerrar Simulador
              </button>

              <button
                type="button"
                onClick={handleFinish}
                disabled={!selectedOptionId}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00C2E0] hover:bg-[#0EA5C6] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <span>Evaluar Decisión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D6E5EF] text-[#082A4A] text-xs font-bold hover:bg-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Intentar Otra Decisión</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#082A4A] hover:bg-[#0D3B66] text-white text-xs font-bold transition-colors"
              >
                Continuar con el Reporte
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
