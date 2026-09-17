import { createClient } from "@supabase/supabase-js";
import type { ChargeSession } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single client instance (safe for both browser and Server Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Data helpers — all Supabase calls go through here, never from components
// ---------------------------------------------------------------------------

export async function getCharges(): Promise<ChargeSession[]> {
  const { data, error } = await supabase
    .from("charges")
    .select("*")
    .order("session_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCharge(id: string): Promise<ChargeSession | null> {
  const { data, error } = await supabase
    .from("charges")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createCharge(
  payload: Omit<ChargeSession, "id" | "created_at">
): Promise<ChargeSession> {
  const { data, error } = await supabase
    .from("charges")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCharge(
  id: string,
  payload: Partial<Omit<ChargeSession, "id" | "created_at">>
): Promise<ChargeSession> {
  const { data, error } = await supabase
    .from("charges")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCharge(id: string): Promise<void> {
  const { error } = await supabase.from("charges").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
