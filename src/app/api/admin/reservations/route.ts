import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendStatusChangeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const VALID_STATUS = new Set(["pending", "confirmed", "cancelled", "completed"]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date")?.trim();
  const status = searchParams.get("status")?.trim();

  const where: { date?: string; status?: string } = {};
  if (date) where.date = date;
  if (status && VALID_STATUS.has(status)) where.status = status;

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: [{ date: "asc" }, { time: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ reservations });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();

    if (!id || !VALID_STATUS.has(status)) {
      return NextResponse.json({ error: "id und gültiger status erforderlich." }, { status: 400 });
    }

    const existing = await prisma.reservation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Reservierung nicht gefunden." }, { status: 404 });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    let emailWarning: string | null = null;
    if (
      (status === "confirmed" || status === "cancelled") &&
      existing.status !== status
    ) {
      const result = await sendStatusChangeEmail({
        code: reservation.code,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        partySize: reservation.partySize,
        date: reservation.date,
        time: reservation.time,
        notes: reservation.notes,
        status: reservation.status,
      });
      emailWarning = result.warning || null;
    }

    return NextResponse.json({ ok: true, reservation, emailWarning });
  } catch (err) {
    console.error("[admin/reservations PATCH]", err);
    return NextResponse.json({ error: "Aktualisierung fehlgeschlagen." }, { status: 500 });
  }
}
