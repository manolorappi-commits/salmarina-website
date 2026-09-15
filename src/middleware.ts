import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "salmarina_admin_session";

const PROTECTED_PREFIXES = ["/admin/reservierungen", "/admin/speisekarten"];

/** Minimal HS256 JWT verify for Edge (avoids jose CompressionStream warning). */
async function verifyHs256(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const sig = Uint8Array.from(
    atob(sigB64.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
  const ok = await crypto.subtle.verify("HMAC", key, sig, data);
  if (!ok) return false;
  try {
    const json = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    if (json.exp && json.exp * 1000 < Date.now()) return false;
  } catch {
    return false;
  }
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret || !(await verifyHs256(token, secret))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/reservierungen/:path*", "/admin/speisekarten/:path*"],
};
