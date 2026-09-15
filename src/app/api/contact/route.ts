import { NextResponse } from "next/server";
import { site } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vorname = String(body.vorname || "").trim();
    const nachname = String(body.nachname || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!vorname || !nachname || !email || !message) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const subject = `Kontaktanfrage von ${vorname} ${nachname}`;
    const mailBody = `Name: ${vorname} ${nachname}\nE-Mail: ${email}\n\nNachricht:\n${message}`;
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

    return NextResponse.json({ ok: true, mailto });
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
}
