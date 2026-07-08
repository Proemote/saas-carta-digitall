import { login } from "../actions";
import { Ship } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-dvh bg-wood-dark flex items-center justify-center px-4 paper-texture">
      <div className="w-full max-w-sm">
        <div className="text-center text-cream mb-8">
          <Ship className="w-10 h-10 mx-auto text-gold-soft" strokeWidth={1.25} />
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold-soft mt-3">
            Bodega
          </p>
          <h1 className="font-script text-4xl">Las Tres Carabelas</h1>
          <p className="text-cream/60 text-sm mt-2">Panel de gestión</p>
        </div>

        <form
          action={login}
          className="bg-cream rounded-2xl shadow-xl p-6 space-y-4"
        >
          {params.error && (
            <p className="text-sm text-teja bg-teja/10 border border-teja/30 rounded-lg px-3 py-2">
              Email o contraseña incorrectos. Inténtalo de nuevo.
            </p>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teja/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-wood mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-wood/25 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teja/50"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-teja hover:bg-teja-dark text-cream font-semibold py-2.5 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
