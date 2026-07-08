"use client";

import { useState, useTransition } from "react";
import type {
  ChatbotFaq,
  ChatbotConversation,
  ChatbotMessage,
  Reservation,
} from "@/lib/types";
import { saveFaq, deleteFaq, saveChatbotConfig } from "@/app/admin/actions";
import type { ChatbotConfig } from "@/lib/chatbot";
import {
  MessageCircle,
  HelpCircle,
  CalendarCheck,
  Plus,
  X,
  Pencil,
  Trash2,
  Info,
} from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmada", cls: "bg-green-100 text-green-800" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800" },
  cancelled: { label: "Cancelada", cls: "bg-red-100 text-red-700" },
};

type Tab = "config" | "faqs" | "conversaciones" | "reservas";

export default function ChatbotManager({
  faqs,
  conversations,
  messages,
  botReservations,
  config,
}: {
  faqs: ChatbotFaq[];
  conversations: ChatbotConversation[];
  messages: ChatbotMessage[];
  botReservations: Reservation[];
  config: ChatbotConfig;
}) {
  const [tab, setTab] = useState<Tab>("faqs");
  const [editing, setEditing] = useState<Partial<ChatbotFaq> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [openConv, setOpenConv] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const TABS: { id: Tab; label: string; icon: typeof HelpCircle }[] = [
    { id: "config", label: "Configuración", icon: HelpCircle },
    { id: "faqs", label: "Preguntas frecuentes", icon: HelpCircle },
    { id: "conversaciones", label: "Conversaciones", icon: MessageCircle },
    { id: "reservas", label: "Reservas del bot", icon: CalendarCheck },
  ];

  return (
    <main className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Chatbot</h1>
        <p className="text-sm text-wood/70 mt-1">
          El asistente de WhatsApp que atiende consultas y recoge reservas.
        </p>
      </header>

      <div className="flex items-start gap-2.5 rounded-xl bg-gold-soft/40 border border-gold/40 px-4 py-3 mb-6 text-sm text-wood-dark">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-wood" />
        <p>
          La conexión con WhatsApp Business se activará en la siguiente fase.
          Todo lo que configures aquí (preguntas y respuestas) quedará listo
          para cuando el bot esté en marcha.
        </p>
      </div>

      {/* ===== Pestañas ===== */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              tab === id
                ? "bg-wood-dark text-cream"
                : "bg-cream text-wood-dark border border-wood/25"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ===== Configuración del System Prompt ===== */}
      {tab === "config" && (
        <section>
          <form action={saveChatbotConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-2">
                Instrucciones del negocio
              </label>
              <p className="text-xs text-wood/70 mb-2">
                El chatbot usará esto para responder preguntas. Incluye horario, dirección, cómo se gestionan las reservas, etc.
              </p>
              <textarea
                name="instructions"
                required
                defaultValue={config.business_instructions}
                rows={10}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked={config.is_active}
                className="rounded border border-wood/25"
              />
              <label htmlFor="is_active" className="text-sm text-wood-dark">
                Chatbot activo (aparece en la carta)
              </label>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
            >
              {pending ? "Guardando…" : "Guardar configuración"}
            </button>
          </form>
        </section>
      )}

      {/* ===== FAQs ===== */}
      {tab === "faqs" && (
        <section>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-teja hover:bg-teja-dark text-cream px-4 py-2 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva pregunta
            </button>
          </div>
          {faqs.length === 0 ? (
            <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
              Aún no hay preguntas configuradas.
            </p>
          ) : (
            <ul className="space-y-2">
              {faqs.map((f) => (
                <li
                  key={f.id}
                  className="bg-cream rounded-xl border border-wood/10 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{f.question}</p>
                      <p className="text-sm text-wood/70 mt-1">{f.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditing(f);
                          setShowForm(true);
                        }}
                        className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("¿Eliminar esta pregunta?"))
                            startTransition(() => deleteFaq(f.id));
                        }}
                        className="p-1.5 rounded-md text-wood/60 hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ===== Conversaciones ===== */}
      {tab === "conversaciones" && (
        <section>
          {conversations.length === 0 ? (
            <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
              Sin conversaciones todavía. Aparecerán aquí cuando el bot esté
              conectado a WhatsApp.
            </p>
          ) : (
            <ul className="space-y-2">
              {conversations.map((c) => {
                const convMsgs = messages.filter(
                  (m) => m.conversation_id === c.id
                );
                const isOpen = openConv === c.id;
                return (
                  <li
                    key={c.id}
                    className="bg-cream rounded-xl border border-wood/10 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenConv(isOpen ? null : c.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {c.customer_name ?? c.customer_phone ?? "Desconocido"}
                        </p>
                        <p className="text-xs text-wood/60">
                          {new Date(c.last_message_at).toLocaleString("es-ES")}
                          {" · "}
                          {convMsgs.length} mensajes
                        </p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-wood/40" />
                    </button>
                    {isOpen && (
                      <div className="border-t border-wood/10 px-4 py-3 space-y-2 bg-white/60 max-h-64 overflow-y-auto">
                        {convMsgs.map((m) => (
                          <div
                            key={m.id}
                            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                              m.role === "bot"
                                ? "bg-wood-dark text-cream ml-auto"
                                : "bg-parchment text-ink"
                            }`}
                          >
                            {m.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ===== Reservas gestionadas por el bot ===== */}
      {tab === "reservas" && (
        <section>
          {botReservations.length === 0 ? (
            <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
              El bot aún no ha gestionado ninguna reserva.
            </p>
          ) : (
            <ul className="space-y-2">
              {botReservations.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 bg-cream rounded-xl border border-wood/10 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-sm">🤖 {r.customer_name}</p>
                    <p className="text-xs text-wood/60">
                      {new Date(r.date + "T00:00:00").toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {r.time.slice(0, 5)} · {r.party_size} pax
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_LABEL[r.status].cls}`}
                  >
                    {STATUS_LABEL[r.status].label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ===== Formulario FAQ ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15">
              <h3 className="font-semibold text-wood-dark">
                {editing?.id ? "Editar pregunta" : "Nueva pregunta"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-wood/60 hover:text-wood-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              action={(fd) =>
                startTransition(async () => {
                  await saveFaq(fd);
                  setShowForm(false);
                })
              }
              className="p-5 space-y-4"
            >
              {editing?.id && <input type="hidden" name="id" value={editing.id} />}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Pregunta
                </label>
                <input
                  name="question"
                  required
                  defaultValue={editing?.question ?? ""}
                  placeholder="¿Tenéis terraza?"
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Respuesta automática
                </label>
                <textarea
                  name="answer"
                  required
                  rows={3}
                  defaultValue={editing?.answer ?? ""}
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
              <button
                disabled={pending}
                className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
              >
                {pending ? "Guardando…" : "Guardar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
