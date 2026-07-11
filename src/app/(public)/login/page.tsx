import { signIn } from "../actions";

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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-wood-dark flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-cream mb-4">
              Welcome
            </h1>
            <p className="text-cream/70 text-lg">
              Access your account and continue your journey with us
            </p>
          </div>

          <form action={signIn} className="space-y-6">
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
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-cream/20 bg-cream/10 px-4 py-3 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-teja focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  className="w-4 h-4 rounded border-cream/20 bg-cream/10 accent-teja"
                />
                <span className="text-sm text-cream/70">Keep me signed in</span>
              </label>
              <a href="#" className="text-sm text-teja hover:text-teja-dark transition">
                Reset password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-cream hover:bg-parchment text-wood-dark font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Sign In
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
            New to our platform?{' '}
            <a href="/register" className="text-teja hover:text-teja-dark font-medium transition">
              Create Account
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-900"></div>
    </div>
  );
}
