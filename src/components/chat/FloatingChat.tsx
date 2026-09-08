"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { X, Send, Loader2, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "¡Hola! Estoy aquí para ayudarte a entender tus resultados y resolver tus dudas.\n\nPuedes preguntarme sobre:\n- Las carreras recomendadas\n- Tus habilidades\n- El mercado laboral\n- Consejos para tu futuro",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileContext, setProfileContext] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vocational_profile_context');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        const topCareers = profile.topCareers || [];
        const dimensions = (profile.radarData || []).map((d: any) => `${d.subject}: ${d.A}%`).join(', ');
        const careersText = topCareers.map((c: any) => `- ${c.name} (${c.match}% match, ${c.faculty})`).join('\n');
        const ctx = `\n\n=== PERFIL VOCACIONAL DEL USUARIO ===\nDimensiones RIASEC:\n${dimensions}\n\nCarreras recomendadas para este usuario:\n${careersText}\n=====================================\n`;
        setProfileContext(ctx);
      } catch {}
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

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
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Ocurrió un error de conexión." }
            : m
        )
      );
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-[#082A4A] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#00C2E0] transition-all z-50 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Abrir chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[520px] max-h-[calc(100vh-2rem)] bg-white border border-[#D6E5EF] rounded-[20px] shadow-xl flex flex-col transition-all duration-300 z-50 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6E5EF] bg-white rounded-t-[20px]">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-[#EAF6FF] overflow-hidden flex items-center justify-center border border-[#00C2E0]/30">
              <Image 
                src="/assets/analizando_perfil.png" 
                alt="Robot asistente" 
                width={30} 
                height={30} 
                className="object-contain translate-y-1" 
              />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#082A4A] leading-none mb-1">Asistente IA</h3>
              <span className="text-[12px] text-[#00C2E0] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2E0]"></span> En línea
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#4F6B85] hover:text-[#082A4A] transition-colors p-2 rounded-full hover:bg-[#F8FCFF]"
            aria-label="Cerrar chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FCFF]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="relative h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1 border border-[#D6E5EF] overflow-hidden">
                  <Image src="/assets/analizando_perfil.png" alt="Robot" width={24} height={24} className="object-contain" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-[16px] max-w-[82%] text-[14px] leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-[#082A4A] text-white rounded-br-sm"
                    : "bg-white border border-[#D6E5EF] text-[#082A4A] rounded-bl-sm whitespace-pre-wrap"
                }`}
              >
                {m.content || (
                  <span className="flex items-center gap-2 text-[#4F6B85]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#00C2E0]" />
                    Escribiendo...
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="p-4 border-t border-[#D6E5EF] bg-white rounded-b-[20px]"
        >
          <div className="flex gap-2 items-center bg-[#F8FCFF] border border-[#D6E5EF] focus-within:border-[#00C2E0] transition-colors rounded-full pr-2 pl-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-transparent border-none focus:outline-none text-[14px] h-12 text-[#082A4A] placeholder-[#4F6B85]"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-9 w-9 bg-[#00C2E0] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-[#0EA5C6] transition-colors flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 ml-0.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

