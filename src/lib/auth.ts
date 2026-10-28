import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "kris_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(adminId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.query(
    "INSERT INTO admin_sessions (admin_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [adminId, hashToken(token), expiresAt],
  );
  return token;
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { rows } = await db.query<{
    id: string;
    username: string;
    must_change_password: boolean;
    session_id: string;
  }>(
    `SELECT a.id, a.username, a.must_change_password, s.id AS session_id
     FROM admin_sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export async function requireAdmin(allowPasswordChange = false) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || (admin.must_change_password && !allowPasswordChange)) return null;
  return admin;
}

export async function requireAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.must_change_password) redirect("/admin/change-password");
  return admin;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.SESSION_COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
