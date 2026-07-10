import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export interface CurrentUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface CurrentOrg {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  role: "owner" | "admin" | "staff";
  plan: "basic" | "intermediate" | "advanced";
  subscription_status: "active" | "trial" | "past_due" | "canceled";
}

/**
 * Get current authenticated user from Supabase Auth
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || "",
      user_metadata: user.user_metadata,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get all organizations for current user
 */
export async function getUserOrganizations(): Promise<CurrentOrg[]> {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users_organizations")
      .select(
        `
        role,
        organizations (
          id,
          name,
          slug,
          logo_url,
          primary_color,
          secondary_color
        ),
        subscriptions (
          plan,
          status
        )
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;

    return (data || [])
      .filter((item) => item.organizations && item.subscriptions)
      .map((item: any) => ({
        id: item.organizations.id,
        name: item.organizations.name,
        slug: item.organizations.slug,
        logo_url: item.organizations.logo_url,
        primary_color: item.organizations.primary_color,
        secondary_color: item.organizations.secondary_color,
        role: item.role,
        plan: item.subscriptions[0]?.plan || "basic",
        subscription_status: item.subscriptions[0]?.status || "trial",
      }));
  } catch (error) {
    console.error("Error getting user organizations:", error);
    return [];
  }
}

/**
 * Get current organization from session
 */
export async function getCurrentOrg(): Promise<CurrentOrg | null> {
  try {
    const orgs = await getUserOrganizations();
    if (orgs.length === 0) return null;
    return orgs[0];
  } catch (error) {
    console.error("Error getting current org:", error);
    return null;
  }
}

/**
 * Create new organization
 */
export async function createOrganization(data: {
  name: string;
  slug: string;
  description?: string;
}): Promise<{ id: string; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { id: "", error: "Not authenticated" };

    const supabase = await createClient();

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
      })
      .select()
      .single();

    if (orgError) throw orgError;

    const { error: linkError } = await supabase
      .from("users_organizations")
      .insert({
        user_id: user.id,
        org_id: org.id,
        role: "owner",
      });

    if (linkError) throw linkError;

    const { error: subError } = await supabase
      .from("subscriptions")
      .insert({
        org_id: org.id,
        plan: "basic",
        status: "trial",
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    if (subError) throw subError;

    return { id: org.id };
  } catch (error) {
    console.error("Error creating organization:", error);
    return {
      id: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if user has feature access based on subscription plan
 */
export async function hasFeature(
  feature: string,
  org?: CurrentOrg
): Promise<boolean> {
  try {
    const currentOrg = org || (await getCurrentOrg());
    if (!currentOrg) return false;

    const featureMap: Record<string, string[]> = {
      basic: ["menu", "tables", "reservations"],
      intermediate: [
        "menu",
        "tables",
        "reservations",
        "chatbot",
        "promotions",
      ],
      advanced: [
        "menu",
        "tables",
        "reservations",
        "chatbot",
        "promotions",
        "qr",
        "whatsapp",
      ],
    };

    return featureMap[currentOrg.plan]?.includes(feature) || false;
  } catch (error) {
    console.error("Error checking feature:", error);
    return false;
  }
}

export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function requireOrg(): Promise<CurrentOrg> {
  const org = await getCurrentOrg();
  if (!org) throw new Error("No organization context");
  return org;
}
