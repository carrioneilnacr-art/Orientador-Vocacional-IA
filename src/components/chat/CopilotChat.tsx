"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Loader2, Sparkles, ShieldCheck, Banknote, MapPin, ChevronRight, MessageSquare } from "lucide-react";
import { Chaski } from "@/components/chaski/Chaski";
import { ChaskiPersonality, ChaskiState } from "@/components/chaski/chaski.config";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface CopilotChatProps {
  profileName?: string;
}

const QUICK_QUESTIONS = [
  { text: "¿Por qué esta carrera?", icon: ShieldCheck },
  { text: "¿Cuánto podría ganar?", icon: Banknote },
  { text: "¿Dónde puedo estudiarla?", icon: MapPin },
  { text: "¿Qué otras carreras se parecen?", icon: Sparkles },
];

export default function CopilotChat({ profileName = 'Vocacional' }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: `Hola. Ya analicé tus resultados.\nTu perfil principal es **${profileName}**.\n\nPuedo ayudarte a entender mejor tus carreras recomendadas, el campo laboral, habilidades necesarias y más.\n¿Qué te gustaría saber?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileContext, setProfileContext] = useState<string>("");
  const [chaskiState, setChaskiState] = useState<ChaskiState>('idle');
  const [chaskiPersonality, setChaskiPersonality] = useState<ChaskiPersonality>('default');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vocational_results');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        const topCareers = profile.topCareers || [];
        const dimensionScores = profile.dimensionScores || {};
        const dimensions = Object.entries(dimensionScores)
          .map(([dim, score]) => `${dim}: ${score}%`)
          .join(', ');
        const careersText = topCareers
          .map((c: any) => `- ${c.name} (${c.match}% match, ${c.faculty})`)
          .join('\n');
        const ctx = `\n\n=== PERFIL VOCACIONAL DEL USUARIO ===\nDimensiones RIASEC:\n${dimensions}\n\nCarreras recomendadas para este usuario:\n${careersText}\n=====================================\n`;
        setProfileContext(ctx);

        const topDim = Object.entries(dimensionScores).sort(
          ([, a], [, b]) => (b as number) - (a as number)
        )[0]?.[0];

        if (topDim === 'TECH' || topDim === 'LOGIC') setChaskiPersonality('analitico');
        else if (topDim === 'INVESTIGATIVE') setChaskiPersonality('explorador');
        else if (topDim === 'SOCIAL') setChaskiPersonality('social');
        else if (topDim === 'ARTISTIC') setChaskiPersonality('creativo');
        else if (topDim === 'ENTERPRISING') setChaskiPersonality('emprendedor');
      } catch {}
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const sendMessage = async (e?: FormEvent | string) => {
    if (e && typeof e !== 'string' && 'preventDefault' in e) {
      e.preventDefault();
    }
    const textToSend = typeof e === 'string' ? e : input;
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setChaskiState('thinking');

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          profileContext,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Error ${response.status}`);
      }

      setChaskiState('analyzing');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "text-delta" && parsed.delta) {
              fullText += parsed.delta;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullText } : m
                )
              );
            }
          } catch {}
        }
      }

      if (!fullText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "No pude obtener una respuesta. Intenta de nuevo." }
              : m
          )
        );
        setChaskiState('surprised');
      } else {
        setChaskiState('happy');
        setTimeout(() => setChaskiState('idle'), 3000);
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Ocurrió un error de conexión al consultar al copiloto." }
            : m
        )
      );
      setChaskiState('surprised');
      setTimeout(() => setChaskiState('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isInitialState = messages.length === 1;

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border border-[#D6E5EF] shadow-sm overflow-hidden font-sans">
      {/* Header del Copiloto */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6E5EF]/70 bg-white shrink-0">
        <div>
          <h3 className="font-bold text-[18px] text-[#082A4A] tracking-tight">Copiloto Vocacional</h3>
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#4F6B85] mt-0.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            Chaski en línea
          </div>
        </div>
        {!isInitialState && (
          <div className="w-10 h-10 shrink-0">
            <Chaski personality={chaskiPersonality} state={chaskiState} size="full" animate={true} />
          </div>
        )}
      </div>

      {/* Cuerpo del Copiloto */}
      {isInitialState ? (
        /* Estado Inicial: Mockup fiel con burbuja superior, robot al centro y 4 sugerencias */
        <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
          {/* Burbuja Asistente */}
          <div className="relative bg-white border-2 border-[#00C2E0] p-4 rounded-[20px] shadow-sm w-full shrink-0">
            <div className="text-[11px] text-[#00C2E0] font-bold tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C2E0] animate-pulse"></span>
              Respondiendo
            </div>
            <p className="text-[#082A4A] text-[13.5px] font-medium leading-relaxed">
              Hola. Ya analicé tus resultados.<br />
              Tu perfil principal es <strong className="font-bold text-[#082A4A]">{profileName}</strong>.<br /><br />
              Puedo ayudarte a entender mejor tus carreras recomendadas, el campo laboral, habilidades necesarias y más.<br />
              ¿Qué te gustaría saber?
            </p>
            {/* Puntero de la burbuja hacia abajo */}
            <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#00C2E0]" />
            <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
          </div>

          {/* Robot Chaski: Totalmente visible y centrado */}
          <div className="flex justify-center my-3 shrink-0">
            <div className="w-[105px] h-[105px]">
              <Chaski personality={chaskiPersonality} state={chaskiState} size="full" animate={true} />
            </div>
          </div>

          {/* 4 Preguntas Rápidas */}
          <div className="space-y-1.5 w-full shrink-0">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q.text)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-[#D6E5EF] hover:border-[#00C2E0] hover:bg-[#F0F9FF] rounded-[12px] transition-all group text-left cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <q.icon className="h-4 w-4 text-[#00C2E0] shrink-0" />
                  <span className="text-[12.5px] font-semibold text-[#082A4A] group-hover:text-[#00C2E0] transition-colors truncate">
                    {q.text}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#4F6B85] group-hover:text-[#00C2E0] shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Estado Conversacional Activo */
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-[#DCEAF2] scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-3 rounded-[18px] max-w-[88%] text-[13.5px] leading-relaxed shadow-xs ${
                      m.role === 'user'
                        ? 'bg-[#082A4A] text-white rounded-br-[4px]'
                        : 'bg-[#F8FCFF] border border-[#D6E5EF] text-[#082A4A] rounded-bl-[4px] whitespace-pre-wrap'
                    }`}
                  >
                    {m.role === 'user' && <div className="text-[10.5px] text-white/70 mb-1 font-medium">Tú</div>}
                    {m.role === 'assistant' && !m.content ? (
                      <div className="flex items-center gap-2 text-[#4F6B85] italic py-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00C2E0]" />
                        <span>Chaski está analizando...</span>
                      </div>
                    ) : (
                      m.content.split('\n').map((line, i) => {
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={i} className="min-h-[1em]">
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-bold text-[#082A4A]">{part.slice(2, -2)}</strong>;
                              }
                              return <span key={j}>{part}</span>;
                            })}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* Chips de sugerencias contextuales */}
          {!isLoading && (
            <div className="px-5 py-2 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-t border-[#D6E5EF]/40 bg-[#F8FCFF]/50">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q.text)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D6E5EF] hover:border-[#00C2E0] hover:text-[#00C2E0] text-[#4F6B85] text-[11.5px] font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  <MessageSquare className="h-3 w-3 text-[#00C2E0]" />
                  {q.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input de Preguntas */}
      <div className="p-4 border-t border-[#D6E5EF]/70 bg-white shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Chaski está respondiendo..." : "Escribe tu pregunta aquí..."}
            disabled={isLoading}
            autoComplete="off"
            className="w-full h-11 pl-4 pr-12 bg-[#F8FCFF] border border-[#D6E5EF] focus:border-[#00C2E0] rounded-[14px] text-[13.5px] text-[#082A4A] placeholder-[#4F6B85] focus:outline-none transition-all shadow-xs disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 top-1.5 h-8 w-8 bg-[#00C2E0] hover:bg-[#0EA5C6] disabled:bg-[#D6E5EF] text-white rounded-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            aria-label="Enviar"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
