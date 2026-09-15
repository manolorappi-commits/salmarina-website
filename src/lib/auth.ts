import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE_NAME = "salmarina_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (min. 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  username: string;
  userId: string;
};

export async function createSession(payload: AdminSession): Promise<void> {
  const token = await new SignJWT({ username: payload.username, userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const username = String(payload.username || "");
    const userId = String(payload.userId || "");
    if (!username || !userId) return null;
    return { username, userId };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<AdminSession | null> {
  const envUser = process.env.ADMIN_USERNAME || "admin";
  const envPass = process.env.ADMIN_PASSWORD;

  // Prefer DB user if present
  const dbUser = await prisma.adminUser.findUnique({ where: { username } });
  if (dbUser) {
    const ok = await bcrypt.compare(password, dbUser.passwordHash);
    if (!ok) return null;
    return { username: dbUser.username, userId: dbUser.id };
  }

  // Fallback: env-only admin (no DB row yet)
  if (username === envUser && envPass && password === envPass) {
    return { username: envUser, userId: "env-admin" };
  }

  return null;
}

export { COOKIE_NAME };
