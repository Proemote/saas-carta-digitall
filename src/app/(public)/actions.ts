"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirmPassword"));

  if (password !== confirmPassword) {
    redirect("/register?error=passwords_dont_match");
  }

  if (password.length < 8) {
    redirect("/register?error=password_too_short");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect("/register?error=" + encodeURIComponent(error.message));
  }

  redirect("/onboarding");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/admin");
}

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/onboarding?error=not_authenticated");
  }

  const name = String(formData.get("name"));
  const slug = String(formData.get("slug")).toLowerCase().trim();

  if (!name || !slug) {
    redirect("/onboarding?error=missing_fields");
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      primary_color: "#2563eb",
      secondary_color: "#1e40af",
    })
    .select()
    .single();

  if (orgError) {
    redirect("/onboarding?error=" + encodeURIComponent(orgError.message));
  }

  const { error: linkError } = await supabase.from("users_organizations").insert({
    user_id: user.id,
    org_id: org.id,
    role: "owner",
  });

  if (linkError) {
    redirect("/onboarding?error=" + encodeURIComponent(linkError.message));
  }

  const { error: subError } = await supabase.from("subscriptions").insert({
    org_id: org.id,
    plan: "basic",
    status: "trial",
    trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  if (subError) {
    redirect("/onboarding?error=" + encodeURIComponent(subError.message));
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
