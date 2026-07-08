"use client";

import { useMemo, useState, useTransition } from "react";
import type { Category, Product, PriceType } from "@/lib/types";
import {
  saveProduct,
  toggleProductAvailability,
  deleteProduct,
  moveCategory,
  saveCategory,
} from "@/app/admin/actions";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  FolderPlus,
} from "lucide-react";

const PRICE_TYPE_LABEL: Record<PriceType, string> = {
  single: "Precio único",
  double: "Tapa y plato",
  per_unit: "Por unidad (€/ud)",
  no_price: "Sin precio (S/P)",
};

function fmt(n: number | null) {
  if (n == null) return "—";
  return (
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n) + " €"
  );
}

function priceSummary(p: Product) {
  switch (p.price_type) {
    case "single":
      return fmt(p.price);
    case "double":
      return `Tapa ${fmt(p.price_tapa)} · Plato ${fmt(p.price_plato)}`;
    case "per_unit":
      return `${fmt(p.price_unit)}/ud`;
    case "no_price":
      return "S/P";
  }
}

function ProductForm({
  categories,
  initial,
  onClose,
}: {
  categories: Category[];
  initial: Partial<Product> | null;
  onClose: () => void;
}) {
  const [priceType, setPriceType] = useState<PriceType>(
    (initial?.price_type as PriceType) ?? "single"
  );
  const [pending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15">
          <h3 className="font-semibold text-wood-dark">
            {initial?.id ? "Editar producto" : "Nuevo producto"}
          </h3>
          <button onClick={onClose} className="text-wood/60 hover:text-wood-dark">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          action={(fd) =>
            startTransition(async () => {
              await saveProduct(fd);
              onClose();
            })
          }
          className="p-5 space-y-4"
        >
          {initial?.id && <input type="hidden" name="id" value={initial.id} />}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Nombre
            </label>
            <input
              name="name"
              required
              defaultValue={initial?.name ?? ""}
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Descripción (opcional)
            </label>
            <input
              name="description"
              defaultValue={initial?.description ?? ""}
              placeholder="21 días de maduración, D.O. Rioja…"
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Categoría
            </label>
            <select
              name="category_id"
              required
              defaultValue={initial?.category_id ?? ""}
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Elige categoría…
              </option>
              {categories
                .filter((c) => !categories.some((x) => x.parent_id === c.id))
                .map((c) => {
                  const parent = categories.find((x) => x.id === c.parent_id);
                  return (
                    <option key={c.id} value={c.id}>
                      {parent ? `${parent.name} → ` : ""}
                      {c.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Tipo de precio
            </label>
            <select
              name="price_type"
              value={priceType}
              onChange={(e) => setPriceType(e.target.value as PriceType)}
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
            >
              {Object.entries(PRICE_TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {priceType === "single" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Precio (€)
              </label>
              <input
                name="price"
                inputMode="decimal"
                required
                defaultValue={initial?.price ?? ""}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
          )}
          {priceType === "double" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Precio tapa (€)
                </label>
                <input
                  name="price_tapa"
                  inputMode="decimal"
                  defaultValue={initial?.price_tapa ?? ""}
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Precio plato (€)
                </label>
                <input
                  name="price_plato"
                  inputMode="decimal"
                  defaultValue={initial?.price_plato ?? ""}
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
          {priceType === "per_unit" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Precio por unidad (€/ud)
              </label>
              <input
                name="price_unit"
                inputMode="decimal"
                required
                defaultValue={initial?.price_unit ?? ""}
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
          )}
          {priceType === "no_price" && (
            <p className="text-xs text-wood/70 bg-parchment rounded-lg px-3 py-2">
              El producto se mostrará como <strong>S/P</strong> (precio a
              consultar) en la carta.
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              URL de foto (opcional)
            </label>
            <input
              name="image_url"
              type="url"
              defaultValue={initial?.image_url ?? ""}
              placeholder="https://…"
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
            />
          </div>

          <button
            disabled={pending}
            className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar producto"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MenuManager({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const topCategories = useMemo(
    () => categories.filter((c) => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  );
  const [activeCat, setActiveCat] = useState<string>(topCategories[0]?.id ?? "");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [, startTransition] = useTransition();

  const active = topCategories.find((c) => c.id === activeCat);
  const childCats = categories
    .filter((c) => c.parent_id === activeCat)
    .sort((a, b) => a.sort_order - b.sort_order);

  const productsOf = (catId: string) =>
    products
      .filter((p) => p.category_id === catId)
      .sort((a, b) => a.sort_order - b.sort_order);

  const renderProducts = (list: Product[]) => (
    <ul className="space-y-2">
      {list.map((p) => (
        <li
          key={p.id}
          className={`flex items-center justify-between gap-3 bg-cream rounded-xl border px-4 py-3 ${
            p.is_available ? "border-wood/10" : "border-teja/40 bg-teja/5"
          }`}
        >
          <div className="min-w-0">
            <p className={`font-medium text-sm ${!p.is_available ? "text-teja" : ""}`}>
              {p.name}
            </p>
            <p className="text-xs text-wood/60">
              {priceSummary(p)}
              {p.description && ` · ${p.description}`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Interruptor disponible/agotado */}
            <button
              role="switch"
              aria-checked={p.is_available}
              title={p.is_available ? "Marcar como agotado" : "Marcar como disponible"}
              onClick={() =>
                startTransition(() =>
                  toggleProductAvailability(p.id, !p.is_available)
                )
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                p.is_available ? "bg-green-600" : "bg-wood/30"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  p.is_available ? "left-5.5" : "left-0.5"
                }`}
              />
            </button>
            <button
              title="Editar"
              onClick={() => {
                setEditing(p);
                setShowForm(true);
              }}
              className="p-1.5 rounded-md text-wood/60 hover:bg-wood/10"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              title="Eliminar"
              onClick={() => {
                if (confirm(`¿Eliminar "${p.name}" de la carta?`))
                  startTransition(() => deleteProduct(p.id));
              }}
              className="p-1.5 rounded-md text-wood/60 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Gestión de la carta</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewCat(true)}
            className="flex items-center gap-1.5 rounded-lg border border-wood/30 text-wood-dark px-3 py-2 text-sm font-medium hover:bg-wood/10 transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> Categoría
          </button>
          <button
            onClick={() => {
              setEditing({ category_id: activeCat });
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-teja hover:bg-teja-dark text-cream px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Producto
          </button>
        </div>
      </header>

      {/* ===== Selector de categorías con reordenación ===== */}
      <div className="overflow-x-auto no-scrollbar mb-5 -mx-1 px-1">
        <div className="flex gap-2 w-max">
          {topCategories.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center rounded-full border transition-colors ${
                activeCat === c.id
                  ? "bg-wood-dark text-cream border-wood-dark"
                  : "bg-cream text-wood-dark border-wood/25"
              }`}
            >
              <button
                onClick={() => setActiveCat(c.id)}
                className="pl-4 pr-1.5 py-1.5 text-sm font-medium whitespace-nowrap"
              >
                {c.name}
              </button>
              {activeCat === c.id && (
                <span className="flex pr-1.5">
                  <button
                    title="Subir en la carta"
                    disabled={i === 0}
                    onClick={() => startTransition(() => moveCategory(c.id, "up"))}
                    className="p-1 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Bajar en la carta"
                    disabled={i === topCategories.length - 1}
                    onClick={() => startTransition(() => moveCategory(c.id, "down"))}
                    className="p-1 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== Productos de la categoría activa ===== */}
      {active && (
        <>
          {productsOf(active.id).length > 0 && renderProducts(productsOf(active.id))}
          {childCats.map((child) => (
            <div key={child.id} className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-wood/60 mb-2">
                {child.name}
              </h3>
              {renderProducts(productsOf(child.id))}
            </div>
          ))}
          {productsOf(active.id).length === 0 && childCats.length === 0 && (
            <p className="text-sm text-wood/60 bg-cream rounded-xl border border-wood/10 p-6 text-center">
              Esta categoría aún no tiene productos.
            </p>
          )}
        </>
      )}

      {showForm && (
        <ProductForm
          categories={categories}
          initial={editing}
          onClose={() => setShowForm(false)}
        />
      )}

      {showNewCat && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-wood/15">
              <h3 className="font-semibold text-wood-dark">Nueva categoría</h3>
              <button
                onClick={() => setShowNewCat(false)}
                className="text-wood/60 hover:text-wood-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              action={(fd) =>
                startTransition(async () => {
                  await saveCategory(fd);
                  setShowNewCat(false);
                })
              }
              className="p-5 space-y-4"
            >
              <input
                name="name"
                required
                placeholder="Nombre de la categoría"
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
              <button className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors">
                Crear categoría
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
