import { NextResponse } from "next/server";
import { site } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const persons = String(body.persons || "").trim();
    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const notes = String(body.notes || "").trim();

    if (!persons || !date || !time) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const subject = `Reservierungsanfrage — ${persons} Pers., ${date} ${time}`;
    const mailBody = [
      `Personenzahl: ${persons}`,
      `Datum: ${date}`,
      `Uhrzeit: ${time}`,
      name ? `Name: ${name}` : null,
      phone ? `Telefon: ${phone}` : null,
      email ? `E-Mail: ${email}` : null,
      notes ? `\nBemerkungen:\n${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

    return NextResponse.json({ ok: true, mailto });
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
}
