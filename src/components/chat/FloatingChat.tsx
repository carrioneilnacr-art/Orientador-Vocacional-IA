"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Info } from "lucide-react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "¡Hola! Soy el asistente vocacional de la UPC. Pregúntame sobre pensiones, becas, mallas curriculares o sedes de cualquier carrera."
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock API response (Backend agent will wire this up with Vercel AI SDK)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Esta es una respuesta simulada. El Agente 2 conectará este chat con la API de OpenAI/Gemini usando Function Calling para responder con datos reales de Supabase. \n\nPor ejemplo: La carrera de **Ingeniería de Software** está disponible en los campus de San Miguel y Monterrico [1]."
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-50 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[calc(100vh-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold">Asistente UPC</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-blue-100 p-1"
            aria-label="Cerrar chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm whitespace-pre-wrap"
                }`}
              >
                {m.content}
                
                {/* Mock Citation rendering */}
                {m.role === "assistant" && m.content.includes("[1]") && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Fuente: Ficha Maestra UPC 2026 - Catálogo de Carreras y Sedes.</span>
                    </div>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t bg-white rounded-b-2xl">
          <div className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-full pr-1 pl-4 py-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta algo..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm h-10"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-400 hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
          </div>
          <div className="text-[10px] text-center text-slate-400 mt-2">
            La IA puede cometer errores. Verifica la información.
          </div>
        </form>
      </div>
    </>
  );
}
