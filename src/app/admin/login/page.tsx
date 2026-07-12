import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-dvh flex">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Bienvenido
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Accede a tu cuenta y continúa tu gestión con nosotros
          </p>

          <form action={login} className="space-y-6">
            {params.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                Email o contraseña incorrectos. Inténtalo de nuevo.
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Ingresa tu email"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Mantenerme conectado</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Acceder
            </button>
          </form>

          <p className="text-gray-600 text-sm text-center mt-8">
            ¿Nuevo en nuestra plataforma?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Crear cuenta
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Gradient background (no testimonial) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-blue-500 to-orange-400 flex-col justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/20 to-transparent" />
      </div>
    </div>
  );
}
