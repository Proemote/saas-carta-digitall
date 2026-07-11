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
    <div className="min-h-dvh bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">CD</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Set Up Workspace</h1>
          <p className="text-gray-600 text-sm mt-2">Create your first restaurant space</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <form action={createOrganization} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Restaurant/Business Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., El Restaurante"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Workspace URL Slug
              </label>
              <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
                <span className="px-3 py-2.5 bg-gray-50 text-gray-600 text-sm whitespace-nowrap">
                  carta-digital.es/menu/
                </span>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="restaurant-name"
                  pattern="[a-z0-9-]+"
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens only</p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition-colors"
            >
              Create Workspace
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            7 days free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
