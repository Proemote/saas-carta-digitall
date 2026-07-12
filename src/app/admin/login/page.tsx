import { login } from "../actions";
import { Eye, EyeOff } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-dvh flex">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 bg-black flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Access your account and continue your journey with us
          </p>

          <form action={login} className="space-y-6">
            {params.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                Email o contraseña incorrectos. Inténtalo de nuevo.
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm mb-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-400 text-sm">Keep me signed in</span>
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                Reset password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm text-center mb-4">
              Or continue with
            </p>
            <button className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
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
              Continue with Google
            </button>
          </div>

          <p className="text-gray-500 text-sm text-center mt-8">
            New to our platform?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300">
              Create Account
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Gradient background */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-blue-500 to-orange-400 flex-col justify-center items-center p-8 relative overflow-hidden">
        {/* Diagonal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/20 to-transparent" />

        {/* Testimonial card */}
        <div className="relative z-10 bg-gray-900/40 backdrop-blur border border-white/10 rounded-2xl p-8 max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
              SC
            </div>
            <div>
              <p className="font-semibold text-white">Sarah Chen</p>
              <p className="text-gray-300 text-sm">@sarahdigital</p>
            </div>
          </div>
          <p className="text-gray-100 text-sm leading-relaxed">
            Amazing platform! The user experience is seamless and the features
            are exactly what I needed.
          </p>
        </div>
      </div>
    </div>
  );
}
