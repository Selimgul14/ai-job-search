import { NextRequest, NextResponse } from "next/server";
import {
  getCharges,
  createCharge,
  updateCharge,
  deleteCharge,
} from "@/lib/supabase";

// GET /api/charges — list all sessions
export async function GET() {
  try {
    const charges = await getCharges();
    return NextResponse.json(charges);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST /api/charges — create a new session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const charge = await createCharge(body);
    return NextResponse.json(charge, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH /api/charges?id=<uuid> — update a session
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const body = await req.json();
    const charge = await updateCharge(id, body);
    return NextResponse.json(charge);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE /api/charges?id=<uuid> — delete a session
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await deleteCharge(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
