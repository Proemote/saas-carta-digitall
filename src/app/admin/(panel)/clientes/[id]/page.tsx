import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { saveCustomer, deleteCustomer, addVisit } from "@/app/admin/actions";
import type { Customer, Reservation, Visit } from "@/lib/types";
import { ArrowLeft, CalendarDays, Receipt, Trash2 } from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmada", cls: "bg-green-100 text-green-800" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800" },
  cancelled: { label: "Cancelada", cls: "bg-red-100 text-red-700" },
};

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseConfigured()) return <SetupNotice />;

  const { id } = await params;
  const supabase = await createClient();

  const [{ data: customer }, { data: reservations }, { data: visits }] =
    await Promise.all([
      supabase.from("customers").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("reservations")
        .select("*")
        .eq("customer_id", id)
        .order("date", { ascending: false }),
      supabase
        .from("visits")
        .select("*")
        .eq("customer_id", id)
        .order("visit_date", { ascending: false }),
    ]);

  if (!customer) notFound();
  const c = customer as Customer;
  const resList = (reservations as Reservation[]) ?? [];
  const visitList = (visits as Visit[]) ?? [];

  const deleteWithId = deleteCustomer.bind(null, c.id);

  return (
    <main className="p-5 md:p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-wood/70 hover:text-teja mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a clientes
      </Link>

      <header className="flex items-center gap-4 mb-6">
        <span className="w-14 h-14 rounded-full bg-wood-dark text-cream flex items-center justify-center text-xl font-semibold uppercase">
          {c.name.charAt(0)}
        </span>
        <div>
          <h1 className="font-script text-4xl text-wood-dark leading-tight">
            {c.name}
          </h1>
          <p className="text-sm text-wood/70">
            {c.phone && <>📞 {c.phone} · </>}
            {c.email && <>✉️ {c.email} · </>}
            {c.source === "chatbot" ? "Alta vía chatbot 🤖" : "Alta manual"}
          </p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Ficha editable ===== */}
        <section className="rounded-2xl bg-cream border border-wood/15 p-5">
          <h2 className="font-semibold text-wood-dark mb-3">Datos y notas</h2>
          <form action={saveCustomer} className="space-y-3">
            <input type="hidden" name="id" value={c.id} />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                Nombre
              </label>
              <input
                name="name"
                defaultValue={c.name}
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
                  defaultValue={c.phone ?? ""}
                  className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
                  Email
                </label>
                <input
                  name="email"
                  defaultValue={c.email ?? ""}
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
                rows={3}
                defaultValue={c.notes ?? ""}
                placeholder="Alérgico a marisco, mesa preferida en terraza, cliente habitual…"
                className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
            </div>
            <button className="w-full rounded-lg bg-wood-dark hover:bg-teja text-cream font-semibold py-2.5 transition-colors">
              Guardar cambios
            </button>
          </form>

          <form action={deleteWithId} className="mt-3">
            <button className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-300 text-red-700 text-sm font-medium py-2 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" /> Eliminar cliente
            </button>
          </form>
        </section>

        <div className="space-y-6">
          {/* ===== Historial de reservas ===== */}
          <section className="rounded-2xl bg-cream border border-wood/15 p-5">
            <h2 className="flex items-center gap-2 font-semibold text-wood-dark mb-3">
              <CalendarDays className="w-4 h-4 text-teja" /> Historial de reservas
              <span className="text-xs font-normal text-wood/50">
                ({resList.length})
              </span>
            </h2>
            {resList.length === 0 ? (
              <p className="text-sm text-wood/60">Sin reservas registradas.</p>
            ) : (
              <ul className="divide-y divide-wood/10 max-h-56 overflow-y-auto">
                {resList.map((r) => (
                  <li key={r.id} className="py-2 flex justify-between items-center gap-2 text-sm">
                    <span>
                      {new Date(r.date + "T00:00:00").toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {r.time.slice(0, 5)} · {r.party_size} pax
                    </span>
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

          {/* ===== Visitas y consumo ===== */}
          <section className="rounded-2xl bg-cream border border-wood/15 p-5">
            <h2 className="flex items-center gap-2 font-semibold text-wood-dark mb-3">
              <Receipt className="w-4 h-4 text-teja" /> Visitas y consumo
              <span className="text-xs font-normal text-wood/50">
                ({visitList.length})
              </span>
            </h2>
            {visitList.length > 0 && (
              <ul className="divide-y divide-wood/10 max-h-40 overflow-y-auto mb-3">
                {visitList.map((v) => (
                  <li key={v.id} className="py-2 flex justify-between text-sm">
                    <span>
                      {new Date(v.visit_date + "T00:00:00").toLocaleDateString("es-ES")}
                      {v.notes && <span className="text-wood/60"> · {v.notes}</span>}
                    </span>
                    {v.amount != null && (
                      <span className="font-semibold">{v.amount.toFixed(2)} €</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <form action={addVisit} className="grid grid-cols-[1fr_90px] gap-2">
              <input type="hidden" name="customer_id" value={c.id} />
              <input
                type="date"
                name="visit_date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="amount"
                step="0.01"
                placeholder="€"
                className="rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
              <input
                name="notes"
                placeholder="Nota (opcional)"
                className="col-span-2 rounded-lg border border-wood/25 bg-white px-3 py-2 text-sm"
              />
              <button className="col-span-2 rounded-lg border border-teja/40 text-teja text-sm font-semibold py-2 hover:bg-teja hover:text-cream transition-colors">
                Registrar visita
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
