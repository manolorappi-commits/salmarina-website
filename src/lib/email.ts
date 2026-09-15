import { Resend } from "resend";
import { site } from "@/lib/content";

export type ReservationEmailData = {
  code: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  notes: string;
  status: string;
};

function restaurantEmail(): string {
  return process.env.RESTAURANT_EMAIL || site.email || "info@salmarina.ch";
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || "Salmarina <onboarding@resend.dev>";
}

function formatDateDe(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return new Intl.DateTimeFormat("de-CH", {
      timeZone: "Europe/Zurich",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    cancelled: "Storniert",
    completed: "Abgeschlossen",
  };
  return map[status] || status;
}

function guestHtml(data: ReservationEmailData, headline: string, intro: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><title>${headline}</title></head>
<body style="font-family:Georgia,serif;background:#FAF8F5;color:#1A2A33;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #B8E2FF;">
    <h1 style="color:#0A74AE;font-size:24px;margin:0 0 12px;">${headline}</h1>
    <p style="line-height:1.6;">Guten Tag ${escapeHtml(data.name)},</p>
    <p style="line-height:1.6;">${intro}</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:15px;">
      <tr><td style="padding:8px 0;color:#0A74AE;">Referenz</td><td style="padding:8px 0;"><strong>${escapeHtml(data.code)}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#0A74AE;">Datum</td><td style="padding:8px 0;">${escapeHtml(formatDateDe(data.date))}</td></tr>
      <tr><td style="padding:8px 0;color:#0A74AE;">Uhrzeit</td><td style="padding:8px 0;">${escapeHtml(data.time)} Uhr</td></tr>
      <tr><td style="padding:8px 0;color:#0A74AE;">Personen</td><td style="padding:8px 0;">${data.partySize}</td></tr>
      <tr><td style="padding:8px 0;color:#0A74AE;">Status</td><td style="padding:8px 0;">${statusLabel(data.status)}</td></tr>
      ${data.notes ? `<tr><td style="padding:8px 0;color:#0A74AE;">Bemerkungen</td><td style="padding:8px 0;">${escapeHtml(data.notes)}</td></tr>` : ""}
    </table>
    <p style="line-height:1.6;font-size:14px;color:#555;">
      ${site.name}<br>${site.address.full}<br>
      <a href="tel:+41783150315" style="color:#0A74AE;">${site.phone}</a> ·
      <a href="mailto:${restaurantEmail()}" style="color:#0A74AE;">${restaurantEmail()}</a>
    </p>
  </div>
</body>
</html>`;
}

function guestText(data: ReservationEmailData, headline: string, intro: string): string {
  return [
    headline,
    "",
    `Guten Tag ${data.name},`,
    intro,
    "",
    `Referenz: ${data.code}`,
    `Datum: ${formatDateDe(data.date)}`,
    `Uhrzeit: ${data.time} Uhr`,
    `Personen: ${data.partySize}`,
    `Status: ${statusLabel(data.status)}`,
    data.notes ? `Bemerkungen: ${data.notes}` : "",
    "",
    `${site.name}, ${site.address.full}`,
    `${site.phone} · ${restaurantEmail()}`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

function restaurantHtml(data: ReservationEmailData, title: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;padding:24px;color:#1A2A33;">
  <h1 style="color:#0A74AE;">${title}</h1>
  <ul>
    <li><strong>Code:</strong> ${escapeHtml(data.code)}</li>
    <li><strong>Name:</strong> ${escapeHtml(data.name)}</li>
    <li><strong>E-Mail:</strong> ${escapeHtml(data.email)}</li>
    <li><strong>Telefon:</strong> ${escapeHtml(data.phone || "—")}</li>
    <li><strong>Personen:</strong> ${data.partySize}</li>
    <li><strong>Datum:</strong> ${escapeHtml(data.date)} ${escapeHtml(data.time)}</li>
    <li><strong>Status:</strong> ${statusLabel(data.status)}</li>
    <li><strong>Bemerkungen:</strong> ${escapeHtml(data.notes || "—")}</li>
  </ul>
  <p>Admin: /admin/reservierungen</p>
</body>
</html>`;
}

function restaurantText(data: ReservationEmailData, title: string): string {
  return [
    title,
    `Code: ${data.code}`,
    `Name: ${data.name}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone || "—"}`,
    `Personen: ${data.partySize}`,
    `Datum: ${data.date} ${data.time}`,
    `Status: ${statusLabel(data.status)}`,
    `Bemerkungen: ${data.notes || "—"}`,
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type SendResult = {
  sent: boolean;
  warning?: string;
  logged?: boolean;
};

async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[email:dev] No RESEND_API_KEY — logging payload:");
    console.log(JSON.stringify({ from: fromAddress(), ...opts }, null, 2));
    return { sent: false, logged: true, warning: "E-Mail im Dev-Modus nur geloggt (kein RESEND_API_KEY)." };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { sent: false, warning: `E-Mail-Versand fehlgeschlagen: ${error.message}` };
  }
  return { sent: true };
}

export async function sendReservationCreatedEmails(
  data: ReservationEmailData,
): Promise<{ guest: SendResult; restaurant: SendResult; warning?: string }> {
  const pending = data.status === "pending";
  const guestHeadline = pending ? "Reservierungsanfrage erhalten" : "Reservierung bestätigt";
  const guestIntro = pending
    ? "Vielen Dank für Ihre Anfrage. Wir prüfen die Verfügbarkeit und melden uns zur Bestätigung."
    : "Ihre Reservierung ist bestätigt. Wir freuen uns auf Ihren Besuch!";

  const guest = await sendMail({
    to: data.email,
    subject: `${guestHeadline} — ${data.code} | ${site.name}`,
    html: guestHtml(data, guestHeadline, guestIntro),
    text: guestText(data, guestHeadline, guestIntro),
  });

  const restaurant = await sendMail({
    to: restaurantEmail(),
    subject: `Neue Reservierung ${data.code} — ${data.partySize} Pers., ${data.date} ${data.time}`,
    html: restaurantHtml(data, "Neue Reservierung"),
    text: restaurantText(data, "Neue Reservierung"),
  });

  const warning = [guest.warning, restaurant.warning].filter(Boolean).join(" ") || undefined;
  return { guest, restaurant, warning };
}

export async function sendStatusChangeEmail(
  data: ReservationEmailData,
): Promise<SendResult> {
  if (data.status === "confirmed") {
    return sendMail({
      to: data.email,
      subject: `Reservierung bestätigt — ${data.code} | ${site.name}`,
      html: guestHtml(
        data,
        "Reservierung bestätigt",
        "Gute Nachrichten: Ihre Reservierung ist bestätigt. Wir freuen uns auf Ihren Besuch!",
      ),
      text: guestText(
        data,
        "Reservierung bestätigt",
        "Gute Nachrichten: Ihre Reservierung ist bestätigt. Wir freuen uns auf Ihren Besuch!",
      ),
    });
  }
  if (data.status === "cancelled") {
    return sendMail({
      to: data.email,
      subject: `Reservierung storniert — ${data.code} | ${site.name}`,
      html: guestHtml(
        data,
        "Reservierung storniert",
        "Ihre Reservierung wurde storniert. Bei Fragen melden Sie sich gerne bei uns.",
      ),
      text: guestText(
        data,
        "Reservierung storniert",
        "Ihre Reservierung wurde storniert. Bei Fragen melden Sie sich gerne bei uns.",
      ),
    });
  }
  return { sent: false };
}
