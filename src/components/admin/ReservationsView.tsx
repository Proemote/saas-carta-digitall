"use client";

import { useMemo, useState, useTransition } from "react";
import type { Reservation, ReservationStatus } from "@/lib/types";
import {
  saveReservation,
  setReservationStatus,
  deleteReservation,
} from "@/app/admin/actions";
import {
  List,
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  Trash2,
  Check,
  Ban,
} from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

const STATUS: Record<
  ReservationStatus,
  { label: string; cls: string; dot: string }
> = {
  confirmed: { label: "Confirmada", cls: "bg-green-100 text-green-800", dot: "bg-green-600" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  cancelled: { label: "Cancelada", cls: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

function ReservationForm({
  initial,
  onClose,
}: {
  initial: Partial<Reservation> | null;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15">
          <h3 className="font-semibold text-wood-dark">
            {initial?.id ? "Editar reserva" : "Nueva reserva"}
          </h3>
          <button onClick={onClose} className="text-wood/60 hover:text-wood-dark">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          action={(fd) =>
            startTransition(async () => {
              await saveReservation(fd);
              onClose();
            })
          }
          className="p-5 space-y-4"
        >
          {initial?.id && <input type="hidden" name="id" value={initial.id} />}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Nombre del cliente
            </label>
            <input
              name="customer_name"
              required
              defaultValue={initial?.customer_name ?? ""}
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
            />
          </div>
          {!initial?.id && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Teléfono (opcional, vincula ficha de cliente)
              </label>
              <input
                name="phone"
                type="tel"
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={initial?.date ?? format(new Date(), "yyyy-MM-dd")}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Hora
              </label>
              <input
                type="time"
                name="time"
                required
                defaultValue={initial?.time?.slice(0, 5) ?? "13:30"}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Personas
              </label>
              <input
                type="number"
                name="party_size"
                min={1}
                required
                defaultValue={initial?.party_size ?? 2}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Estado
              </label>
              <select
                name="status"
                defaultValue={initial?.status ?? "confirmed"}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              >
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Notas
            </label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={initial?.notes ?? ""}
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              placeholder="Mesa en terraza, alérgico a marisco…"
            />
          </div>
          <button
            disabled={pending}
            className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar reserva"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ReservationsView({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editing, setEditing] = useState<Partial<Reservation> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [, startTransition] = useTransition();

  const byDay = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of reservations) {
      const list = map.get(r.date) ?? [];
      list.push(r);
      map.set(r.date, list);
    }
    return map;
  }, [reservations]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const upcoming = reservations.filter((r) => r.date >= format(new Date(), "yyyy-MM-dd"));
  const past = reservations.filter((r) => r.date < format(new Date(), "yyyy-MM-dd")).reverse();

  const dayDetail = selectedDay
    ? byDay.get(format(selectedDay, "yyyy-MM-dd")) ?? []
    : [];

  return (
    <main className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Reservas</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-wood/25 overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium ${
                view === "list" ? "bg-wood-dark text-cream" : "bg-cream text-wood"
              }`}
            >
              <List className="w-4 h-4" /> Lista
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium ${
                view === "calendar" ? "bg-wood-dark text-cream" : "bg-cream text-wood"
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendario
            </button>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-teja hover:bg-teja-dark text-cream px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Nueva
          </button>
        </div>
      </header>

      {view === "list" ? (
        <div className="space-y-6">
          {[
            { title: "Próximas", items: upcoming },
            { title: "Pasadas", items: past.slice(0, 20) },
          ].map(({ title, items }) => (
            <section key={title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-wood/60 mb-2">
                {title}
              </h2>
              {items.length === 0 ? (
                <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-4">
                  No hay reservas {title.toLowerCase()}.
                </p>
              ) : (
                <ul className="space-y-2">
                  {items.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-3 bg-cream rounded-xl border border-wood/10 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {r.customer_name}
                          {r.source === "chatbot" && (
                            <span className="ml-1.5 text-xs" title="Creada por el chatbot">🤖</span>
                          )}
                        </p>
                        <p className="text-xs text-wood/60">
                          {format(parseISO(r.date), "EEE d MMM", { locale: es })} ·{" "}
                          {r.time.slice(0, 5)} · {r.party_size} pax
                          {r.notes && ` · ${r.notes}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS[r.status].cls}`}
                        >
                          {STATUS[r.status].label}
                        </span>
                        {r.status === "pending" && (
                          <button
                            title="Confirmar"
                            onClick={() =>
                              startTransition(() => setReservationStatus(r.id, "confirmed"))
                            }
                            className="p-1.5 rounded-md text-green-700 hover:bg-green-100"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {r.status !== "cancelled" && (
                          <button
                            title="Cancelar"
                            onClick={() =>
                              startTransition(() => setReservationStatus(r.id, "cancelled"))
                            }
                            className="p-1.5 rounded-md text-wood/60 hover:bg-red-100 hover:text-red-700"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          title="Editar"
                          onClick={() => {
                            setEditing(r);
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => {
                            if (confirm("¿Eliminar esta reserva definitivamente?"))
                              startTransition(() => deleteReservation(r.id));
                          }}
                          className="p-1.5 rounded-md text-wood/60 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* ===== Calendario mensual ===== */}
          <div className="bg-cream rounded-2xl border border-wood/15 p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setMonth((m) => addMonths(m, -1))}
                className="p-2 rounded-lg hover:bg-wood/10"
              >
                <ChevronLeft className="w-5 h-5 text-wood" />
              </button>
              <p className="font-semibold text-wood-dark capitalize">
                {format(month, "MMMM yyyy", { locale: es })}
              </p>
              <button
                onClick={() => setMonth((m) => addMonths(m, 1))}
                className="p-2 rounded-lg hover:bg-wood/10"
              >
                <ChevronRight className="w-5 h-5 text-wood" />
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-wood/50 mb-1">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <span key={d} className="py-1">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const dayRes = (byDay.get(key) ?? []).filter(
                  (r) => r.status !== "cancelled"
                );
                const selected = selectedDay && isSameDay(day, selectedDay);
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition-colors
                      ${!isSameMonth(day, month) ? "text-wood/30" : "text-wood-dark"}
                      ${selected ? "bg-teja text-cream" : isToday(day) ? "bg-gold-soft/60" : "hover:bg-wood/10"}
                    `}
                  >
                    <span className="leading-none">{format(day, "d")}</span>
                    {dayRes.length > 0 && (
                      <span
                        className={`text-[9px] leading-none font-bold rounded-full px-1.5 py-0.5 ${
                          selected ? "bg-cream text-teja" : "bg-teja text-cream"
                        }`}
                      >
                        {dayRes.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===== Detalle del día ===== */}
          <div className="bg-cream rounded-2xl border border-wood/15 p-4">
            <h3 className="font-semibold text-wood-dark mb-3 capitalize">
              {selectedDay
                ? format(selectedDay, "EEEE d 'de' MMMM", { locale: es })
                : "Selecciona un día"}
            </h3>
            {selectedDay && dayDetail.length === 0 && (
              <p className="text-sm text-wood/60">Sin reservas este día.</p>
            )}
            <ul className="space-y-2">
              {dayDetail.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-wood/10 bg-white px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{r.customer_name}</p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS[r.status].cls}`}
                    >
                      {STATUS[r.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-wood/60 mt-0.5">
                    {r.time.slice(0, 5)} · {r.party_size} pax
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    <button
                      onClick={() => {
                        setEditing(r);
                        setShowForm(true);
                      }}
                      className="text-[11px] font-medium text-wood hover:text-teja"
                    >
                      Editar
                    </button>
                    {r.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          startTransition(() => setReservationStatus(r.id, "cancelled"))
                        }
                        className="text-[11px] font-medium text-wood/60 hover:text-red-600 ml-2"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {selectedDay && (
              <button
                onClick={() => {
                  setEditing({ date: format(selectedDay, "yyyy-MM-dd") });
                  setShowForm(true);
                }}
                className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-teja/40 text-teja text-sm font-semibold py-2 hover:bg-teja hover:text-cream transition-colors"
              >
                <Plus className="w-4 h-4" /> Reserva este día
              </button>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <ReservationForm initial={editing} onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}
