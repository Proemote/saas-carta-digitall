import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageCircle,
  Sparkles,
  LogOut,
  Ship,
  Table2,
  Zap,
} from "lucide-react";
import { getUserOrganizations } from "@/lib/auth";
import OrgSwitcher from "@/components/admin/OrgSwitcher";
import BrandingCustomizer from "@/components/admin/BrandingCustomizer";
import { logout } from "@/app/admin/actions";
import { updateOrgBranding } from "@/app/api/orgs/actions";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    "org-slug": string;
  }>;
}

const NAV = [
  { href: "inicio", label: "Inicio", icon: LayoutDashboard },
  { href: "reservas", label: "Reservas", icon: CalendarDays },
  { href: "clientes", label: "Clientes", icon: Users },
  { href: "carta", label: "Carta", icon: UtensilsCrossed },
  { href: "mesas", label: "Mesas", icon: Table2 },
  { href: "promociones", label: "Promociones", icon: Zap },
  { href: "chatbot", label: "Chatbot", icon: MessageCircle },
  { href: "contenido", label: "Contenido ✦", icon: Sparkles },
];

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  // Dynamic colors from org
  const primaryColor = currentOrg.primary_color || "#8B5A3C";
  const secondaryColor = currentOrg.secondary_color || "#D4A574";
  const bgColor = currentOrg.primary_color + "08";

  return (
    <div
      className="min-h-dvh flex"
      style={{ backgroundColor: bgColor }}
    >
      {/* ===== Sidebar (desktop) ===== */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 text-cream min-h-dvh sticky top-0"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Header with branding and customizer */}
        <div
          className="px-5 py-6 border-b space-y-3"
          style={{ borderColor: `${primaryColor}40` }}
        >
          <div className="flex items-center gap-2.5">
            {currentOrg.logo_url ? (
              <img
                src={currentOrg.logo_url}
                alt={currentOrg.name}
                className="w-7 h-7 rounded"
              />
            ) : (
              <Ship className="w-7 h-7" strokeWidth={1.25} />
            )}
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase" style={{ opacity: 0.7 }}>
                Restaurant
              </p>
              <p className="font-script text-xl leading-tight">
                {currentOrg.name}
              </p>
            </div>
          </div>
          <BrandingCustomizer org={currentOrg} onSave={updateOrgBranding} />
        </div>

        {/* OrgSwitcher */}
        <div className="px-3 py-3 border-b" style={{ borderColor: `${primaryColor}40` }}>
          <OrgSwitcher
            currentOrg={currentOrg}
            organizations={organizations}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={`/admin/${orgSlug}/${href}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              style={{
                color: "inherit",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${secondaryColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 pb-5 space-y-1 border-t" style={{ borderColor: `${primaryColor}40` }}>
          <Link
            href={`/menu/${orgSlug}`}
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors"
            style={{ opacity: 0.7 }}
          >
            Ver carta pública ↗
          </Link>
          <form action={logout}>
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
              style={{
                color: "inherit",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#DC2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </form>
        </div>
      </aside>

      {/* ===== Main content ===== */}
      <div className="flex-1 min-w-0 pb-20 md:pb-0">{children}</div>

      {/* ===== Mobile nav ===== */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 text-cream border-t"
        style={{
          backgroundColor: primaryColor,
          borderColor: `${primaryColor}40`,
        }}
      >
        <ul className="flex justify-around">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={`/admin/${orgSlug}/${href}`}
                className="flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] transition-colors"
                style={{ opacity: 0.85 }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
                {label.replace(" ✦", "")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
