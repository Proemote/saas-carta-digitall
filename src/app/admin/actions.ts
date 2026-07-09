"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateMenuItem, translateCategoryName } from "@/lib/translate";

// ---------------- AUTH ----------------
export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------- RESERVAS ----------------
export async function saveReservation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;

  const payload = {
    customer_name: String(formData.get("customer_name")),
    date: String(formData.get("date")),
    time: String(formData.get("time")),
    party_size: Number(formData.get("party_size")),
    status: String(formData.get("status")) as "pending" | "confirmed" | "cancelled",
    notes: (formData.get("notes") as string) || null,
  };

  if (id) {
    await supabase.from("reservations").update(payload).eq("id", id);
  } else {
    // vincula o crea cliente por nombre/teléfono
    const phone = (formData.get("phone") as string) || null;
    let customer_id: string | null = null;
    if (phone) {
      const { data: existing } = await supabase
        .from("customers").select("id").eq("phone", phone).maybeSingle();
      if (existing) {
        customer_id = existing.id;
      } else {
        const { data: created } = await supabase
          .from("customers")
          .insert({ name: payload.customer_name, phone, source: "manual" })
          .select("id").single();
        customer_id = created?.id ?? null;
      }
    }
    await supabase.from("reservations").insert({ ...payload, customer_id, source: "manual" });
  }
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
}

export async function setReservationStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("reservations").update({ status }).eq("id", id);
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
}

export async function deleteReservation(id: string) {
  const supabase = await createClient();
  await supabase.from("reservations").delete().eq("id", id);
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
}

// ---------------- CLIENTES ----------------
export async function saveCustomer(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: String(formData.get("name")),
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };
  if (id) {
    await supabase.from("customers").update(payload).eq("id", id);
    revalidatePath(`/admin/clientes/${id}`);
  } else {
    await supabase.from("customers").insert({ ...payload, source: "manual" });
  }
  revalidatePath("/admin/clientes");
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();
  await supabase.from("customers").delete().eq("id", id);
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function addVisit(formData: FormData) {
  const supabase = await createClient();
  const customer_id = String(formData.get("customer_id"));
  await supabase.from("visits").insert({
    customer_id,
    visit_date: String(formData.get("visit_date")),
    amount: formData.get("amount") ? Number(formData.get("amount")) : null,
    notes: (formData.get("notes") as string) || null,
  });
  revalidatePath(`/admin/clientes/${customer_id}`);
}

// ---------------- CARTA ----------------
export async function saveProduct(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const price_type = String(formData.get("price_type"));

  const num = (k: string) => {
    const v = formData.get(k) as string;
    return v ? Number(v.replace(",", ".")) : null;
  };

  const payload: Record<string, unknown> = {
    category_id: String(formData.get("category_id")),
    name: String(formData.get("name")),
    description: (formData.get("description") as string) || null,
    price_type,
    price: price_type === "single" ? num("price") : null,
    price_tapa: price_type === "double" ? num("price_tapa") : null,
    price_plato: price_type === "double" ? num("price_plato") : null,
    price_unit: price_type === "per_unit" ? num("price_unit") : null,
    image_url: (formData.get("image_url") as string) || null,
  };

  // Retraduce solo si el nombre o la descripción cambian (o el plato es nuevo)
  let needsTranslation = true;
  if (id) {
    const { data: current } = await supabase
      .from("products").select("name, description").eq("id", id).maybeSingle();
    needsTranslation =
      current?.name !== payload.name || current?.description !== payload.description;
  }
  if (needsTranslation) {
    const t = await translateMenuItem(
      payload.name as string,
      payload.description as string | null
    );
    if (t) Object.assign(payload, t);
  }

  if (id) {
    await supabase.from("products").update(payload).eq("id", id);
  } else {
    await supabase.from("products").insert(payload);
  }
  revalidatePath("/admin/carta");
  revalidatePath("/");
}

export async function toggleProductAvailability(id: string, available: boolean) {
  const supabase = await createClient();
  await supabase.from("products").update({ is_available: available }).eq("id", id);
  revalidatePath("/admin/carta");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/carta");
  revalidatePath("/");
}

export async function moveCategory(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: cats } = await supabase
    .from("categories").select("id, sort_order, parent_id")
    .is("parent_id", null).order("sort_order");
  if (!cats) return;
  const idx = cats.findIndex((c) => c.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= cats.length) return;
  await Promise.all([
    supabase.from("categories").update({ sort_order: cats[swapWith].sort_order }).eq("id", cats[idx].id),
    supabase.from("categories").update({ sort_order: cats[idx].sort_order }).eq("id", cats[swapWith].id),
  ]);
  revalidatePath("/admin/carta");
  revalidatePath("/");
}

export async function saveCategory(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const name = String(formData.get("name"));
  const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const t = await translateCategoryName(name);
  if (id) {
    await supabase.from("categories").update({ name, ...t }).eq("id", id);
  } else {
    const { data: max } = await supabase
      .from("categories").select("sort_order").is("parent_id", null)
      .order("sort_order", { ascending: false }).limit(1).maybeSingle();
    await supabase.from("categories").insert({
      name, slug, sort_order: (max?.sort_order ?? 0) + 1, ...t,
    });
  }
  revalidatePath("/admin/carta");
  revalidatePath("/");
}

// ---------------- CHATBOT FAQs ----------------
export async function saveFaq(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    question: String(formData.get("question")),
    answer: String(formData.get("answer")),
  };
  if (id) {
    await supabase.from("chatbot_faqs").update(payload).eq("id", id);
  } else {
    await supabase.from("chatbot_faqs").insert(payload);
  }
  revalidatePath("/admin/chatbot");
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  await supabase.from("chatbot_faqs").delete().eq("id", id);
  revalidatePath("/admin/chatbot");
}

// -------- CHATBOT CONFIG --------
export async function saveChatbotConfig(formData: FormData) {
  const supabase = await createClient();
  const instructions = String(formData.get("instructions"));
  const isActive = formData.get("is_active") === "on";

  const { data: existing } = await supabase
    .from("chatbot_config")
    .select("id")
    .maybeSingle();

  if (existing) {
    await supabase
      .from("chatbot_config")
      .update({
        business_instructions: instructions,
        is_active: isActive,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("chatbot_config").insert({
      business_instructions: instructions,
      is_active: isActive,
    });
  }
  revalidatePath("/admin/chatbot");
}

// -------- MESAS --------
export async function saveTable(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: String(formData.get("name")),
    capacity: Number(formData.get("capacity")),
    location: (formData.get("location") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  if (id) {
    await supabase.from("tables").update(payload).eq("id", id);
  } else {
    await supabase.from("tables").insert(payload);
  }
  revalidatePath("/admin/mesas");
}

export async function deleteTable(id: string) {
  const supabase = await createClient();
  await supabase.from("tables").delete().eq("id", id);
  revalidatePath("/admin/mesas");
}

export async function toggleTableActive(id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("tables").update({ is_active: active }).eq("id", id);
  revalidatePath("/admin/mesas");
}

// -------- PROMOCIONES --------
export async function savePromotion(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    title: String(formData.get("title")),
    description: (formData.get("description") as string) || null,
    discount_text: (formData.get("discount_text") as string) || null,
    discount_percentage: formData.get("discount_percentage")
      ? Number(formData.get("discount_percentage"))
      : null,
    valid_from: (formData.get("valid_from") as string) || null,
    valid_until: (formData.get("valid_until") as string) || null,
    is_active: formData.get("is_active") === "on",
  };

  if (id) {
    await supabase.from("promotions").update(payload).eq("id", id);
  } else {
    await supabase.from("promotions").insert(payload);
  }
  revalidatePath("/admin/promociones");
}

export async function deletePromotion(id: string) {
  const supabase = await createClient();
  await supabase.from("promotions").delete().eq("id", id);
  revalidatePath("/admin/promociones");
}

export async function togglePromotionActive(id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("promotions").update({ is_active: active }).eq("id", id);
  revalidatePath("/admin/promociones");
}

// -------- RESERVAS: Marcar asistencia --------
export async function setReservationAttendance(
  id: string,
  attended: boolean | null
) {
  const supabase = await createClient();
  await supabase.from("reservations").update({ attended }).eq("id", id);
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
}
