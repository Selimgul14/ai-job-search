"use client";

// Data-fetching hook for the charge list. Wraps the client API and exposes a
// simple loading/error/refetch surface used by the home + stats views.

import { useCallback, useEffect, useState } from "react";
import type { ChargeSession } from "@/types";
import { deleteCharge, fetchCharges } from "@/lib/client";

interface UseChargesResult {
  charges: ChargeSession[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useCharges(): UseChargesResult {
  const [charges, setCharges] = useState<ChargeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCharges(await fetchCharges());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await deleteCharge(id);
      await refetch();
    },
    [refetch],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { charges, loading, error, refetch, remove };
}
