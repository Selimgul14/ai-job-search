// Edit an existing charge session. Loads the row server-side, then hands it to
// the shared client form.
import { notFound } from "next/navigation";
import { getCharge } from "@/lib/supabase";
import { AppFrame } from "@/components/AppFrame";
import { ChargeForm } from "@/components/ChargeForm";

export default async function EditChargePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let charge = null;
  try {
    charge = await getCharge(id);
  } catch {
    notFound();
  }
  if (!charge) notFound();

  return (
    <AppFrame>
      <ChargeForm initial={charge} />
    </AppFrame>
  );
}
