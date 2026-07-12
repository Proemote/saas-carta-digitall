export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  Users,
  UtensilsCrossed,
  Sparkles,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getUserOrganizations } from "@/lib/auth";
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

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function DashboardPage({ params }: PageProps) {
  if (!supabaseConfigured()) return <SetupNotice />;

  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const inSevenDays = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .slice(0, 10);

  // TODO: Add org_id filter when RLS is implemented
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
      supabase.from("products").select("id, name").eq("is_available", false),
    ]);

  const reservasHoy = (todayRes.data as Reservation[]) ?? [];
  const proximas = (upcomingRes.data as Reservation[]) ?? [];
  const ultimas = (latestRes.data as Reservation[]) ?? [];
  const agotados = (soldOut.data as Pick<Product, "id" | "name">[]) ?? [];

  const primaryColor = currentOrg.primary_color || "#8B5A3C";

  return (
    <main className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-script text-4xl" style={{ color: primaryColor }}>
          Buenos días ⚓
        </h1>
        <p className="text-sm mt-1" style={{ color: `${primaryColor}70` }}>
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="rounded-2xl text-cream p-4" style={{ backgroundColor: primaryColor }}>
          <p className="text-3xl font-bold">{reservasHoy.length}</p>
          <p className="text-xs mt-1 opacity-85">Reservas hoy</p>
        </div>
        <div className="rounded-2xl bg-gray-800 text-cream p-4">
          <p className="text-3xl font-bold">{proximas.length}</p>
          <p className="text-xs mt-1 opacity-85">Próximos 7 días</p>
        </div>
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: `${primaryColor}08`,
            borderColor: `${primaryColor}30`,
            color: primaryColor,
          }}
        >
          <p className="text-3xl font-bold">{customersCount.count ?? 0}</p>
          <p className="text-xs mt-1 opacity-70">Clientes en la base</p>
        </div>
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: `${primaryColor}08`,
            borderColor: `${primaryColor}30`,
            color: primaryColor,
          }}
        >
          <p className="text-3xl font-bold">{agotados.length}</p>
          <p className="text-xs mt-1 opacity-70">Productos agotados</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's reservations */}
        <section
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: `${primaryColor}04`,
            borderColor: `${primaryColor}20`,
          }}
        >
          <h2
            className="flex items-center gap-2 font-semibold mb-3"
            style={{ color: primaryColor }}
          >
            <Clock className="w-4 h-4" /> Hoy
          </h2>
          {reservasHoy.length === 0 ? (
            <p className="text-sm" style={{ opacity: 0.6 }}>
              Sin reservas para hoy.
            </p>
          ) : (
            <ul style={{ borderColor: `${primaryColor}10` }} className="divide-y">
              {reservasHoy.map((r) => (
                <li
                  key={r.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-sm">{r.customer_name}</p>
                    <p className="text-xs opacity-60">
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

        {/* Upcoming reservations */}
        <section
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: `${primaryColor}04`,
            borderColor: `${primaryColor}20`,
          }}
        >
          <h2
            className="flex items-center gap-2 font-semibold mb-3"
            style={{ color: primaryColor }}
          >
            <CalendarDays className="w-4 h-4" /> Próximos días
          </h2>
          {proximas.length === 0 ? (
            <p className="text-sm" style={{ opacity: 0.6 }}>
              Sin reservas próximas.
            </p>
          ) : (
            <ul style={{ borderColor: `${primaryColor}10` }} className="divide-y">
              {proximas.slice(0, 6).map((r) => (
                <li
                  key={r.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-sm">{r.customer_name}</p>
                    <p className="text-xs opacity-60">
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

        {/* Sold out items */}
        <section
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: `${primaryColor}04`,
            borderColor: `${primaryColor}20`,
          }}
        >
          <h2
            className="flex items-center gap-2 font-semibold mb-3"
            style={{ color: primaryColor }}
          >
            <AlertTriangle className="w-4 h-4" /> Agotados ahora mismo
          </h2>
          {agotados.length === 0 ? (
            <p className="text-sm" style={{ opacity: 0.6 }}>
              Todo disponible. La carta está completa. 🎉
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {agotados.map((p) => (
                <li
                  key={p.id}
                  className="text-xs font-medium rounded-full px-3 py-1 border"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    borderColor: `${primaryColor}30`,
                  }}
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/admin/${orgSlug}/carta`}
            className="inline-block mt-3 text-xs font-semibold hover:underline"
            style={{ color: primaryColor }}
          >
            Gestionar carta →
          </Link>
        </section>

        {/* Latest reservations */}
        <section
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: `${primaryColor}04`,
            borderColor: `${primaryColor}20`,
          }}
        >
          <h2
            className="flex items-center gap-2 font-semibold mb-3"
            style={{ color: primaryColor }}
          >
            <Users className="w-4 h-4" /> Últimas reservas registradas
          </h2>
          {ultimas.length === 0 ? (
            <p className="text-sm" style={{ opacity: 0.6 }}>
              Aún no hay reservas.
            </p>
          ) : (
            <ul style={{ borderColor: `${primaryColor}10` }} className="divide-y">
              {ultimas.map((r) => (
                <li key={r.id} className="py-2 text-sm flex justify-between gap-2">
                  <span className="font-medium">{r.customer_name}</span>
                  <span className="text-xs opacity-60">
                    {fmtDate(r.date)} · {r.time.slice(0, 5)}
                    {r.source === "chatbot" && " · 🤖"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick access */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "reservas", label: "Nueva reserva", icon: CalendarDays },
          { href: "carta", label: "Editar carta", icon: UtensilsCrossed },
          { href: "clientes", label: "Clientes", icon: Users },
          { href: "contenido", label: "Generar contenido", icon: Sparkles },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={`/admin/${orgSlug}/${href}`}
            className="flex items-center gap-2.5 rounded-xl text-cream px-4 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
