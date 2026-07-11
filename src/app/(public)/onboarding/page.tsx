import { createOrganization } from "../actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Configurar Workspace — Carta Digital",
  description: "Crea tu workspace de restaurante",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/register");
  }

  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    missing_fields: "Por favor completa todos los campos",
    not_authenticated: "Debes estar autenticado",
    pgsql_error: "Este nombre de workspace ya está en uso, intenta otro",
  };
  const error = params.error ? errorMessages[params.error] || params.error : null;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Configura tu Workspace
            </h1>
            <p className="text-gray-600 text-lg">
              Dale un nombre a tu restaurante y comienza a gestionar tu carta digital
            </p>
          </div>

          <form action={createOrganization} className="space-y-6">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre del Restaurante/Negocio
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej: El Restaurante"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                URL del Workspace
              </label>
              <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 overflow-hidden">
                <span className="px-4 py-3 bg-gray-100 text-gray-600 text-sm whitespace-nowrap">
                  carta-digital.es/menu/
                </span>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="nombre-restaurante"
                  pattern="[a-z0-9-]+"
                  className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none border-0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Usa solo minúsculas, números y guiones</p>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Crear Workspace
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-8">
            7 días de prueba gratis. No se requiere tarjeta de crédito.
          </p>
        </div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-900"></div>
    </div>
  );
}
