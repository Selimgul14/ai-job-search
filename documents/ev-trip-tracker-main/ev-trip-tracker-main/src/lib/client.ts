"use client";

// Browser-side fetch wrappers around /api/charges. Components never touch
// Supabase directly — they go through the API route, which calls src/lib/supabase.

import type { ChargeSession, ChargeSessionInsert } from "@/types";

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchCharges(): Promise<ChargeSession[]> {
  return asJson(await fetch("/api/charges", { cache: "no-store" }));
}

export async function createCharge(
  payload: ChargeSessionInsert,
): Promise<ChargeSession> {
  return asJson(
    await fetch("/api/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateCharge(
  id: string,
  payload: ChargeSessionInsert,
): Promise<ChargeSession> {
  return asJson(
    await fetch(`/api/charges?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteCharge(id: string): Promise<void> {
  const res = await fetch(`/api/charges?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Delete failed (${res.status})`);
  }
}
