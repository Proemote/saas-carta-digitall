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

          <div className="mt-8 pt-8 border-t border-gray-300">
            <p className="text-gray-600 text-sm text-center mb-4">
              O continúa con
            </p>
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
          </div>

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
