"use client";

import { useState, useTransition } from "react";
import type { Promotion } from "@/lib/types";
import {
  savePromotion,
  deletePromotion,
  togglePromotionActive,
} from "@/app/admin/actions";
import { Plus, X, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function PromotionsManager({
  promotions,
}: {
  promotions: Promotion[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Promotion> | null>(null);
  const [pending, startTransition] = useTransition();

  const getStatusBadge = (promo: Promotion) => {
    const today = new Date().toISOString().split("T")[0];
    if (!promo.is_active) return "Desactivada";
    if (promo.valid_from && promo.valid_from > today) return "Próxima";
    if (promo.valid_until && promo.valid_until < today) return "Expirada";
    return "Activa";
  };

  return (
    <main className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Promociones</h1>
        <p className="text-sm text-wood/70 mt-1">
          Las promociones activas se mostrarán al bot y a los clientes.
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
          <Plus className="w-4 h-4" /> Nueva promoción
        </button>
      </div>

      {promotions.length === 0 ? (
        <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
          Sin promociones.
        </p>
      ) : (
        <div className="grid gap-2">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="flex items-start justify-between gap-3 bg-cream rounded-xl border border-wood/10 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{promo.title}</p>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      promo.is_active && !getStatusBadge(promo).includes("Expirada")
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {getStatusBadge(promo)}
                  </span>
                </div>
                {promo.description && (
                  <p className="text-xs text-wood/70 mt-1">{promo.description}</p>
                )}
                {promo.discount_text && (
                  <p className="text-sm font-semibold text-teja mt-1">
                    {promo.discount_text}
                  </p>
                )}
                {(promo.valid_from || promo.valid_until) && (
                  <p className="text-xs text-wood/60 mt-1">
                    {promo.valid_from && `Desde ${promo.valid_from}`}
                    {promo.valid_from && promo.valid_until && " · "}
                    {promo.valid_until && `hasta ${promo.valid_until}`}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() =>
                    startTransition(() =>
                      togglePromotionActive(promo.id, !promo.is_active)
                    )
                  }
                  className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
                  title={promo.is_active ? "Desactivar" : "Activar"}
                >
                  {promo.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditing(promo);
                    setShowForm(true);
                  }}
                  className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar promoción "${promo.title}"?`))
                      startTransition(() => deletePromotion(promo.id));
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
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15 sticky top-0 bg-cream">
              <h3 className="font-semibold text-wood-dark">
                {editing?.id ? "Editar promoción" : "Nueva promoción"}
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
                  await savePromotion(fd);
                  setShowForm(false);
                })
              }
              className="p-5 space-y-4"
            >
              {editing?.id && <input type="hidden" name="id" value={editing.id} />}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Título
                </label>
                <input
                  name="title"
                  required
                  defaultValue={editing?.title ?? ""}
                  placeholder="Descuento 20% bebidas"
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editing?.description ?? ""}
                  placeholder="Detalles de la promoción"
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Texto de descuento
                </label>
                <input
                  name="discount_text"
                  defaultValue={editing?.discount_text ?? ""}
                  placeholder="20% en todas las bebidas"
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Descuento (%)
                </label>
                <input
                  name="discount_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  defaultValue={editing?.discount_percentage ?? ""}
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                    Válida desde
                  </label>
                  <input
                    name="valid_from"
                    type="date"
                    defaultValue={editing?.valid_from ?? ""}
                    className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                    Válida hasta
                  </label>
                  <input
                    name="valid_until"
                    type="date"
                    defaultValue={editing?.valid_until ?? ""}
                    className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={editing?.is_active ?? true}
                  className="rounded border border-wood/25"
                />
                <label htmlFor="is_active" className="text-sm text-wood-dark">
                  Promoción activa
                </label>
              </div>

              <button
                disabled={pending}
                className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
              >
                {pending ? "Guardando…" : "Guardar promoción"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
