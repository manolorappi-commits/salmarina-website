import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canBook } from "@/lib/capacity";
import { generateReservationCode } from "@/lib/reservation-code";
import { isAutoConfirm } from "@/lib/hours";
import { sendReservationCreatedEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const notes = String(body.notes || "").trim();
    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();
    const partySize = Number(body.partySize ?? body.persons);

    if (!name || !email || !date || !time || !Number.isFinite(partySize)) {
      return NextResponse.json(
        { error: "Bitte Name, E-Mail, Datum, Uhrzeit und Personenzahl angeben." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse." }, { status: 400 });
    }

    const check = await canBook(date, time, partySize);
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    const status = isAutoConfirm() ? "confirmed" : "pending";
    let code = generateReservationCode();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.reservation.findUnique({ where: { code } });
      if (!exists) break;
      code = generateReservationCode();
    }

    const reservation = await prisma.reservation.create({
      data: {
        code,
        name,
        email,
        phone,
        partySize,
        date,
        time,
        notes,
        status,
      },
    });

    const emailResult = await sendReservationCreatedEmails({
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

    return NextResponse.json({
      ok: true,
      reservation: {
        id: reservation.id,
        code: reservation.code,
        status: reservation.status,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        name: reservation.name,
      },
      emailWarning: emailResult.warning || null,
    });
  } catch (err) {
    console.error("[POST /api/reservations]", err);
    return NextResponse.json({ error: "Reservierung konnte nicht erstellt werden." }, { status: 500 });
  }
}
