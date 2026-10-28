import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { createAdminSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const LOCK_MINUTES = 15;

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",").at(-1)?.trim();
  return address && address.length <= 64 ? address : "unknown";
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
  }
  const { username, password } = body as { username?: unknown; password?: unknown };
  if (typeof username !== "string" || typeof password !== "string" || !username || !password || username.length > 80 || password.length > 256) {
    return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
  }
  const normalizedUsername = username.trim().toUpperCase();
  const ip = clientIp(request);
  const limit = await db.query<{ locked: boolean }>(
    `SELECT locked_until > NOW() AS locked FROM login_attempts
     WHERE username = $1 AND ip_address = $2`,
    [normalizedUsername, ip],
  );
  if (limit.rows[0]?.locked) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }, { status: 429 });
  }

  const adminResult = await db.query<{
    id: string;
    username: string;
    password_hash: string;
    must_change_password: boolean;
  }>("SELECT id, username, password_hash, must_change_password FROM admins WHERE username = $1", [normalizedUsername]);
  const admin = adminResult.rows[0];
  const valid = admin ? await argon2.verify(admin.password_hash, password) : false;
  if (!admin || !valid) {
    await db.query(
      `INSERT INTO login_attempts (username, ip_address, attempts, window_started_at, locked_until)
       VALUES ($1, $2, 1, NOW(), NULL)
       ON CONFLICT (username, ip_address) DO UPDATE SET
         attempts = CASE WHEN login_attempts.window_started_at < NOW() - INTERVAL '${WINDOW_MINUTES} minutes'
                         THEN 1 ELSE login_attempts.attempts + 1 END,
         locked_until = CASE
           WHEN login_attempts.window_started_at < NOW() - INTERVAL '${WINDOW_MINUTES} minutes' THEN NULL
           WHEN login_attempts.attempts + 1 >= $3 THEN NOW() + INTERVAL '${LOCK_MINUTES} minutes'
           ELSE login_attempts.locked_until END,
         window_started_at = CASE
           WHEN login_attempts.window_started_at < NOW() - INTERVAL '${WINDOW_MINUTES} minutes'
           THEN NOW() ELSE login_attempts.window_started_at END`,
      [normalizedUsername, ip, MAX_ATTEMPTS],
    );
    return NextResponse.json({ error: "Username atau password tidak sesuai." }, { status: 401 });
  }

  await db.query("DELETE FROM login_attempts WHERE username = $1 AND ip_address = $2", [normalizedUsername, ip]);
  const token = await createAdminSession(admin.id);
  const response = NextResponse.json({
    username: admin.username,
    mustChangePassword: admin.must_change_password,
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
