import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import MenuManager from "@/components/admin/MenuManager";
import type { Category, Product } from "@/lib/types";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function MenuPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();

  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*"),
  ]);

  const categories = (categoriesRes.data as Category[]) || [];
  const products = (productsRes.data as Product[]) || [];

  return <MenuManager categories={categories} products={products} />;
}
