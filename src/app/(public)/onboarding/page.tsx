import { createOrganization } from "../actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Set Up Workspace — Carta Digital",
  description: "Create your restaurant workspace",
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
    missing_fields: "Please fill in all fields",
    not_authenticated: "You must be logged in",
    pgsql_error: "This workspace name is already taken, try another",
  };
  const error = params.error ? errorMessages[params.error] || params.error : null;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-wood-dark flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-cream mb-4">
              Set Up Workspace
            </h1>
            <p className="text-cream/70 text-lg">
              Give your restaurant a name and start managing your digital menu
            </p>
          </div>

          <form action={createOrganization} className="space-y-6">
            {error && (
              <p className="text-sm text-teja bg-teja/10 border border-teja/30 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold text-cream mb-2">
                Restaurant/Business Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., El Restaurante"
                className="w-full rounded-xl border border-cream/20 bg-cream/10 px-4 py-3 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-teja focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cream mb-2">
                Workspace URL Slug
              </label>
              <div className="flex items-center rounded-xl border border-cream/20 bg-cream/5 overflow-hidden">
                <span className="px-4 py-3 bg-cream/10 text-cream/70 text-sm whitespace-nowrap">
                  carta-digital.es/menu/
                </span>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="restaurant-name"
                  pattern="[a-z0-9-]+"
                  className="flex-1 px-4 py-3 bg-transparent text-cream placeholder:text-cream/50 focus:outline-none border-0"
                />
              </div>
              <p className="text-xs text-cream/50 mt-2">Use lowercase letters, numbers, and hyphens only</p>
            </div>

            <button
              type="submit"
              className="w-full bg-cream hover:bg-parchment text-wood-dark font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Create Workspace
            </button>
          </form>

          <p className="text-xs text-cream/50 text-center mt-8">
            7 days free trial. No credit card required.
          </p>
        </div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-900"></div>
    </div>
  );
}
