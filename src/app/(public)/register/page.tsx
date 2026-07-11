import { signUp } from "../actions";

export const metadata = {
  title: "Create Account — Carta Digital",
  description: "Sign up for Carta Digital",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    passwords_dont_match: "Passwords do not match",
    password_too_short: "Password must be at least 8 characters",
    user_already_exists: "An account with this email already exists",
  };
  const error = params.error ? errorMessages[params.error] || params.error : null;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-wood-dark flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-cream mb-4">
              Create Account
            </h1>
            <p className="text-cream/70 text-lg">
              Join Carta Digital and start managing your digital menu today
            </p>
          </div>

          <form action={signUp} className="space-y-6">
            {error && (
              <p className="text-sm text-teja bg-teja/10 border border-teja/30 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold text-cream mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-cream/20 bg-cream/10 px-4 py-3 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-teja focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cream mb-2">
                Password (min. 8 characters)
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-cream/20 bg-cream/10 px-4 py-3 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-teja focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cream mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-cream/20 bg-cream/10 px-4 py-3 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-teja focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cream hover:bg-parchment text-wood-dark font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-wood-dark text-cream/70">Or continue with</span>
            </div>
          </div>

          <button className="w-full border border-cream/20 hover:border-cream/40 text-cream font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center text-sm text-cream/70">
            Already have an account?{' '}
            <a href="/login" className="text-teja hover:text-teja-dark font-medium transition">
              Sign in
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-900"></div>
    </div>
  );
}
