"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { Customer } from "@/lib/types";
import { saveCustomer } from "@/app/admin/actions";
import { Search, Plus, X, Phone } from "lucide-react";

export default function CustomersView({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <main className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teja hover:bg-teja-dark text-cream px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo cliente
        </button>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wood/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email…"
          className="w-full rounded-xl border border-wood/25 bg-cream pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teja/50"
        />
      </div>

      <p className="text-xs text-wood/60 mb-3">
        {filtered.length} cliente{filtered.length !== 1 && "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
          No hay clientes que coincidan con la búsqueda.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/clientes/${c.id}`}
                className="flex items-center justify-between gap-3 bg-cream rounded-xl border border-wood/10 px-4 py-3 hover:border-teja/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-wood-dark text-cream flex items-center justify-center text-sm font-semibold uppercase">
                    {c.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {c.name}
                      {c.source === "chatbot" && (
                        <span className="ml-1.5 text-xs" title="Creado por el chatbot">🤖</span>
                      )}
                    </p>
                    {c.phone && (
                      <p className="text-xs text-wood/60 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </p>
                    )}
                  </div>
                </div>
                {c.notes && (
                  <p className="hidden sm:block text-xs text-wood/50 italic truncate max-w-[40%]">
                    {c.notes}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15">
              <h3 className="font-semibold text-wood-dark">Nuevo cliente</h3>
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
                  await saveCustomer(fd);
                  setShowForm(false);
                })
              }
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Nombre
                </label>
                <input
                  name="name"
                  required
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                    Teléfono
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Notas internas
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Alérgico a marisco, mesa preferida en terraza…"
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
              <button
                disabled={pending}
                className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
              >
                {pending ? "Guardando…" : "Guardar cliente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
