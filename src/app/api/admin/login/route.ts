import { NextResponse } from "next/server";
import { createSession, verifyAdminCredentials } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json({ error: "Benutzername und Passwort erforderlich." }, { status: 400 });
    }

    const session = await verifyAdminCredentials(username, password);
    if (!session) {
      return NextResponse.json({ error: "Ungültige Anmeldedaten." }, { status: 401 });
    }

    await createSession(session);
    return NextResponse.json({ ok: true, username: session.username });
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen." }, { status: 500 });
  }
}
