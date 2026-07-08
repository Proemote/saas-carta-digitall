import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageCircle,
  Sparkles,
  LogOut,
  Ship,
} from "lucide-react";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/carta", label: "Carta", icon: UtensilsCrossed },
  { href: "/admin/chatbot", label: "Chatbot", icon: MessageCircle },
  { href: "/admin/contenido", label: "Contenido ✦", icon: Sparkles },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-sand flex">
      {/* ===== Sidebar (desktop) ===== */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-wood-dark text-cream min-h-dvh sticky top-0">
        <div className="px-5 py-6 border-b border-cream/10">
          <div className="flex items-center gap-2.5">
            <Ship className="w-7 h-7 text-gold-soft" strokeWidth={1.25} />
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-gold-soft">
                Bodega
              </p>
              <p className="font-script text-xl leading-tight">
                Las Tres Carabelas
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/80 hover:bg-cream/10 hover:text-cream transition-colors"
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-cream/50 hover:text-cream transition-colors"
          >
            Ver carta pública ↗
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-cream/70 hover:bg-teja hover:text-cream transition-colors">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </form>
        </div>
      </aside>

      {/* ===== Contenido ===== */}
      <div className="flex-1 min-w-0 pb-20 md:pb-0">{children}</div>

      {/* ===== Nav inferior (móvil) ===== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-wood-dark text-cream border-t border-cream/10">
        <ul className="flex justify-around">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] text-cream/75 hover:text-cream"
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
