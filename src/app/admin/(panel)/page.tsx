import Link from "next/link";
import {
  CalendarDays,
  Users,
  UtensilsCrossed,
  Sparkles,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import type { Reservation, Product } from "@/lib/types";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmada", cls: "bg-green-100 text-green-800" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800" },
  cancelled: { label: "Cancelada", cls: "bg-red-100 text-red-700" },
};

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function DashboardPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const inSevenDays = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [todayRes, upcomingRes, customersCount, latestRes, soldOut] =
    await Promise.all([
      supabase
        .from("reservations")
        .select("*")
        .eq("date", today)
        .neq("status", "cancelled")
        .order("time"),
      supabase
        .from("reservations")
        .select("*")
        .gt("date", today)
        .lte("date", inSevenDays)
        .neq("status", "cancelled")
        .order("date")
        .order("time"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("products")
        .select("id, name")
        .eq("is_available", false),
    ]);

  const reservasHoy = (todayRes.data as Reservation[]) ?? [];
  const proximas = (upcomingRes.data as Reservation[]) ?? [];
  const ultimas = (latestRes.data as Reservation[]) ?? [];
  const agotados = (soldOut.data as Pick<Product, "id" | "name">[]) ?? [];

  return (
    <main className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-script text-4xl text-wood-dark">Buenos días ⚓</h1>
        <p className="text-sm text-wood/70 mt-1">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {/* ===== Tarjetas resumen ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="rounded-2xl bg-teja text-cream p-4">
          <p className="text-3xl font-bold">{reservasHoy.length}</p>
          <p className="text-xs mt-1 text-cream/85">Reservas hoy</p>
        </div>
        <div className="rounded-2xl bg-wood text-cream p-4">
          <p className="text-3xl font-bold">{proximas.length}</p>
          <p className="text-xs mt-1 text-cream/85">Próximos 7 días</p>
        </div>
        <div className="rounded-2xl bg-cream border border-wood/15 p-4">
          <p className="text-3xl font-bold text-wood-dark">
            {customersCount.count ?? 0}
          </p>
          <p className="text-xs mt-1 text-wood/70">Clientes en la base</p>
        </div>
        <div className="rounded-2xl bg-cream border border-wood/15 p-4">
          <p className="text-3xl font-bold text-wood-dark">{agotados.length}</p>
          <p className="text-xs mt-1 text-wood/70">Productos agotados</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Reservas de hoy ===== */}
        <section className="rounded-2xl bg-cream border border-wood/15 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-wood-dark mb-3">
            <Clock className="w-4 h-4 text-teja" /> Hoy
          </h2>
          {reservasHoy.length === 0 ? (
            <p className="text-sm text-wood/60">Sin reservas para hoy.</p>
          ) : (
            <ul className="divide-y divide-wood/10">
              {reservasHoy.map((r) => (
                <li key={r.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{r.customer_name}</p>
                    <p className="text-xs text-wood/60">
                      {r.time.slice(0, 5)} · {r.party_size} pax
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

        {/* ===== Próximas ===== */}
        <section className="rounded-2xl bg-cream border border-wood/15 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-wood-dark mb-3">
            <CalendarDays className="w-4 h-4 text-teja" /> Próximos días
          </h2>
          {proximas.length === 0 ? (
            <p className="text-sm text-wood/60">Sin reservas próximas.</p>
          ) : (
            <ul className="divide-y divide-wood/10">
              {proximas.slice(0, 6).map((r) => (
                <li key={r.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{r.customer_name}</p>
                    <p className="text-xs text-wood/60">
                      {fmtDate(r.date)} · {r.time.slice(0, 5)} · {r.party_size} pax
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

        {/* ===== Agotados ===== */}
        <section className="rounded-2xl bg-cream border border-wood/15 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-wood-dark mb-3">
            <AlertTriangle className="w-4 h-4 text-teja" /> Agotados ahora mismo
          </h2>
          {agotados.length === 0 ? (
            <p className="text-sm text-wood/60">
              Todo disponible. La carta está completa. 🎉
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {agotados.map((p) => (
                <li
                  key={p.id}
                  className="text-xs font-medium bg-teja/10 text-teja border border-teja/25 rounded-full px-3 py-1"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/carta"
            className="inline-block mt-3 text-xs font-semibold text-teja hover:underline"
          >
            Gestionar carta →
          </Link>
        </section>

        {/* ===== Últimas reservas registradas ===== */}
        <section className="rounded-2xl bg-cream border border-wood/15 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-wood-dark mb-3">
            <Users className="w-4 h-4 text-teja" /> Últimas reservas registradas
          </h2>
          {ultimas.length === 0 ? (
            <p className="text-sm text-wood/60">Aún no hay reservas.</p>
          ) : (
            <ul className="divide-y divide-wood/10">
              {ultimas.map((r) => (
                <li key={r.id} className="py-2 text-sm flex justify-between gap-2">
                  <span className="font-medium">{r.customer_name}</span>
                  <span className="text-xs text-wood/60">
                    {fmtDate(r.date)} · {r.time.slice(0, 5)}
                    {r.source === "chatbot" && " · 🤖"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ===== Accesos rápidos ===== */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/reservas", label: "Nueva reserva", icon: CalendarDays },
          { href: "/admin/carta", label: "Editar carta", icon: UtensilsCrossed },
          { href: "/admin/clientes", label: "Clientes", icon: Users },
          { href: "/admin/contenido", label: "Generar contenido", icon: Sparkles },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-xl bg-wood-dark text-cream px-4 py-3.5 text-sm font-medium hover:bg-teja transition-colors"
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
