"use client";

import { useState, useTransition } from "react";
import type { RestaurantTable } from "@/lib/types";
import { saveTable, deleteTable, toggleTableActive } from "@/app/admin/actions";
import { Plus, X, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function TablesManager({ tables }: { tables: RestaurantTable[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<RestaurantTable> | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <main className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Mesas</h1>
        <p className="text-sm text-wood/70 mt-1">
          Gestiona las mesas del restaurante. El bot las consulta para
          disponibilidad.
        </p>
      </header>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-teja hover:bg-teja-dark text-cream px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva mesa
        </button>
      </div>

      {tables.length === 0 ? (
        <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
          Sin mesas aún.
        </p>
      ) : (
        <div className="grid gap-2">
          {tables.map((table) => (
            <div
              key={table.id}
              className="flex items-center justify-between gap-3 bg-cream rounded-xl border border-wood/10 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">
                  {table.name} · {table.capacity} pax
                </p>
                {table.location && (
                  <p className="text-xs text-wood/70">{table.location}</p>
                )}
                {table.notes && (
                  <p className="text-xs text-wood/60 italic">{table.notes}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() =>
                    startTransition(() =>
                      toggleTableActive(table.id, !table.is_active)
                    )
                  }
                  className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
                  title={table.is_active ? "Desactivar" : "Activar"}
                >
                  {table.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditing(table);
                    setShowForm(true);
                  }}
                  className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar mesa "${table.name}"?`))
                      startTransition(() => deleteTable(table.id));
                  }}
                  className="p-1.5 rounded-md text-wood/60 hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15">
              <h3 className="font-semibold text-wood-dark">
                {editing?.id ? "Editar mesa" : "Nueva mesa"}
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
                  await saveTable(fd);
                  setShowForm(false);
                })
              }
              className="p-5 space-y-4"
            >
              {editing?.id && <input type="hidden" name="id" value={editing.id} />}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Nombre de la mesa
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editing?.name ?? ""}
                  placeholder="Terraza 4"
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Capacidad (personas)
                </label>
                <input
                  name="capacity"
                  type="number"
                  required
                  min="1"
                  defaultValue={editing?.capacity ?? ""}
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Ubicación (opcional)
                </label>
                <input
                  name="location"
                  defaultValue={editing?.location ?? ""}
                  placeholder="Terraza, Salón principal, etc."
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editing?.notes ?? ""}
                  placeholder="Cerca de ventana, junto a mostrador..."
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <button
                disabled={pending}
                className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
              >
                {pending ? "Guardando…" : "Guardar mesa"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
