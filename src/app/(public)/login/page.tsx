import { signIn } from "../actions";
import { Ship } from "lucide-react";

export const metadata = {
  title: "Sign In — Carta Digital",
  description: "Sign in to your Carta Digital workspace",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    invalid_credentials: "Email or password is incorrect",
    invalid_grant: "Email or password is incorrect",
  };
  const error = params.error ? errorMessages[params.error] || params.error : null;

  return (
    <div className="min-h-dvh bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">CD</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Carta Digital</h1>
          <p className="text-gray-600 text-sm mt-2">Digital menus for restaurants</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Don't have an account?</span>
            </div>
          </div>

          <a
            href="/register"
            className="block text-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
