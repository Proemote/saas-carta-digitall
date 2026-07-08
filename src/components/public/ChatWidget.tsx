"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import type { Lang } from "@/lib/i18n";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: number;
}

const LABELS: Record<Lang, { title: string; placeholder: string; send: string }> = {
  es: {
    title: "Asistente Bodega",
    placeholder: "Escribe tu pregunta…",
    send: "Enviar",
  },
  en: {
    title: "Bodega Assistant",
    placeholder: "Type your question…",
    send: "Send",
  },
  fr: {
    title: "Assistant Bodega",
    placeholder: "Posez votre question…",
    send: "Envoyer",
  },
  de: {
    title: "Bodega-Assistent",
    placeholder: "Stellen Sie Ihre Frage…",
    send: "Senden",
  },
};

export default function ChatWidget({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          lang,
          conversation_id: conversationId,
          customer_phone: null,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const { response, conversation_id: newConvId } = await res.json();
      setConversationId(newConvId);

      const botMsg: Message = {
        role: "bot",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error("Chat error:", e);
      const errorMsg: Message = {
        role: "bot",
        content:
          lang === "es"
            ? "Disculpa, hubo un error. Por favor intenta de nuevo."
            : lang === "en"
            ? "Sorry, there was an error. Please try again."
            : lang === "fr"
            ? "Désolé, une erreur s'est produite. Veuillez réessayer."
            : "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-teja hover:bg-teja-dark text-cream shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-80 max-h-[600px] bg-cream rounded-2xl shadow-2xl border border-wood/20 flex flex-col overflow-hidden">
      {/* Cabecera */}
      <div className="bg-wood-dark text-cream px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm">{LABELS[lang].title}</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-cream/70 hover:text-cream"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-sand/30">
        {messages.length === 0 && (
          <div className="text-center text-sm text-wood/60 py-6">
            {lang === "es"
              ? "Hola 👋 ¿En qué puedo ayudarte?"
              : lang === "en"
              ? "Hello 👋 How can I help?"
              : lang === "fr"
              ? "Bonjour 👋 Comment puis-je t'aider?"
              : "Hallo 👋 Wie kann ich dir helfen?"}
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "bot"
                  ? "bg-wood-dark text-cream"
                  : "bg-teja text-cream"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-wood-dark text-cream rounded-lg px-3 py-2 text-sm">
              {lang === "es"
                ? "Escribiendo…"
                : lang === "en"
                ? "Typing…"
                : lang === "fr"
                ? "Écriture…"
                : "Schreiben…"}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-wood/15 p-3 bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={LABELS[lang].placeholder}
          disabled={loading}
          className="flex-1 rounded-lg border border-wood/25 bg-cream px-3 py-2 text-sm focus:outline-none focus:border-teja"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-teja hover:bg-teja-dark text-cream px-3 py-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
