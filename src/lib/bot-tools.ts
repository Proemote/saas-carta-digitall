/** Herramientas (tools) que el chatbot puede usar para consultar y actuar sobre la BD.
 *  Se pasan a Claude con tool_use, el bot decide cuándo usarlas. */

import { createClient } from "./supabase/server";
import type { RestaurantTable, Promotion, Customer, Reservation } from "./types";

/** Obtener disponibilidad de mesas para una fecha/hora específica. */
export async function getTableAvailability(
  date: string,
  time: string,
  party_size: number
): Promise<
  Array<{
    id: string;
    name: string;
    capacity: number;
    location: string | null;
  }>
> {
  const supabase = await createClient();

  // Mesas activas que caben la cantidad de personas
  const { data: tables } = await supabase
    .from("tables")
    .select("id, name, capacity, location")
    .eq("is_active", true)
    .gte("capacity", party_size);

  if (!tables) return [];

  // Filtrar las que NO tienen reservas confirmadas en ese horario
  const { data: bookings } = await supabase
    .from("reservations")
    .select("table_id")
    .eq("date", date)
    .neq("status", "cancelled");

  const bookedTableIds = (bookings ?? [])
    .map((b) => b.table_id)
    .filter((id): id is string => id !== null);

  return tables.filter((t) => !bookedTableIds.includes(t.id));
}

/** Obtener promociones activas. */
export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .or(
      `valid_from.is.null,valid_from.lte.${today}`,
      { foreignTable: undefined }
    )
    .or(
      `valid_until.is.null,valid_until.gte.${today}`,
      { foreignTable: undefined }
    );

  return (data ?? []) as Promotion[];
}

/** Obtener info de cliente (por teléfono). */
export async function getCustomerInfo(
  phone: string
): Promise<{
  id: string;
  name: string;
  email: string | null;
  notes: string | null;
  reservations_total: number;
  reservations_attended: number;
  no_show_count: number;
  no_show_percentage: number;
} | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (!data) return null;

  const no_show_percentage =
    data.reservations_total > 0
      ? Math.round((data.no_show_count / data.reservations_total) * 100)
      : 0;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    notes: data.notes,
    reservations_total: data.reservations_total,
    reservations_attended: data.reservations_attended,
    no_show_count: data.no_show_count,
    no_show_percentage,
  };
}

/** Proponer una reserva (insertar con status='pending' y bot_proposed=true). */
export async function proposeReservation(params: {
  customer_phone: string;
  customer_name: string;
  date: string;
  time: string;
  party_size: number;
  table_id?: string;
  notes?: string;
}): Promise<{ success: boolean; reservation_id?: string; error?: string }> {
  const supabase = await createClient();

  try {
    // Buscar o crear cliente
    let customer_id: string | null = null;
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", params.customer_phone)
      .maybeSingle();

    if (existing) {
      customer_id = existing.id;
    } else {
      const { data: created } = await supabase
        .from("customers")
        .insert({
          name: params.customer_name,
          phone: params.customer_phone,
          source: "chatbot",
        })
        .select("id")
        .single();
      customer_id = created?.id ?? null;
    }

    // Crear reserva
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        customer_id,
        customer_name: params.customer_name,
        date: params.date,
        time: params.time,
        party_size: params.party_size,
        table_id: params.table_id ?? null,
        status: "pending",
        bot_proposed: true,
        notes: params.notes ?? null,
        source: "chatbot",
      })
      .select("id")
      .single();

    if (error) throw error;

    return {
      success: true,
      reservation_id: data?.id,
    };
  } catch (e) {
    return {
      success: false,
      error: String(e),
    };
  }
}

/** Obtener todas las mesas (para el panel). */
export async function getAllTables(): Promise<RestaurantTable[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("tables").select("*").order("name");
  return (data ?? []) as RestaurantTable[];
}

/** Obtener disponibilidad por línea para mostrar al usuario. */
export async function formatTableAvailability(
  available: Array<{ name: string; capacity: number }>
): Promise<string> {
  if (available.length === 0) return "Sin disponibilidad en ese horario.";
  const names = available.map((t) => `${t.name} (${t.capacity} pax)`).join(", ");
  return `Mesas disponibles: ${names}`;
}
