"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

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
      content: "Soy el asistente de la UPC. Puedo ayudarte con carreras, pensiones y sedes. ¿Qué deseas saber?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileContext, setProfileContext] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's vocational profile from localStorage when the chat opens
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
        // Update welcome message
        setMessages([{
          id: "0",
          role: "assistant",
          content: `Ya veo tu perfil vocacional. Tienes alta afinidad con ${topCareers[0]?.name || 'las carreras recomendadas'}. ¿Quieres que te explique más sobre alguna de ellas?`,
        }]);
      } catch {
        // ignore parse errors
      }
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
          profileContext, // send the user's vocational profile
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
        // Keep the last (possibly incomplete) line in the buffer
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
          } catch {
            // skip non-JSON lines
          }
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
            ? { ...m, content: "Ocurrio un error de conexion. Verifica tu internet e intenta de nuevo." }
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
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:bg-zinc-800 transition-all z-50 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Abrir chat"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[520px] max-h-[calc(100vh-2rem)] bg-white border border-zinc-200 rounded-xl shadow-xl flex flex-col transition-all duration-300 z-50 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-black flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 leading-none">Asistente UPC</h3>
              <span className="text-[10px] text-zinc-400">En linea</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded-md hover:bg-zinc-100"
            aria-label="Cerrar chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
              )}
              <div
                className={`px-3.5 py-2.5 rounded-2xl max-w-[82%] text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm shadow-sm whitespace-pre-wrap"
                }`}
              >
                {m.content || (
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Pensando...
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
          className="p-3 border-t border-zinc-100 bg-white rounded-b-xl"
        >
          <div className="flex gap-2 items-center bg-zinc-100 border border-transparent focus-within:border-zinc-300 focus-within:bg-white transition-all rounded-full pr-1.5 pl-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm h-10 text-zinc-900 placeholder-zinc-400"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-25 hover:bg-zinc-800 transition-colors flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-center text-zinc-400 mt-2">
            La informacion es referencial. Verifica con la UPC.
          </p>
        </form>
      </div>
    </>
  );
}
