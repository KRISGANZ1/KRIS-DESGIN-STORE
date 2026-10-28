import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/http";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(true);
  if (!admin) return unauthorized();
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Data password tidak valid." }, { status: 400 });
  }
  const { currentPassword, newPassword } = body as { currentPassword?: unknown; newPassword?: unknown };
  if (typeof currentPassword !== "string" || currentPassword.length > 256 || typeof newPassword !== "string" || newPassword.length < 12 || newPassword.length > 128) {
    return NextResponse.json({ error: "Password baru harus memiliki 12 hingga 128 karakter." }, { status: 400 });
  }
  const result = await db.query<{ password_hash: string }>(
    "SELECT password_hash FROM admins WHERE id = $1",
    [admin.id],
  );
  if (!result.rows[0] || !(await argon2.verify(result.rows[0].password_hash, currentPassword))) {
    return NextResponse.json({ error: "Password saat ini tidak sesuai." }, { status: 400 });
  }
  const hash = await argon2.hash(newPassword, { type: argon2.argon2id });
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE admins SET password_hash = $1, must_change_password = FALSE, password_changed_at = NOW() WHERE id = $2",
      [hash, admin.id],
    );
    await client.query("DELETE FROM admin_sessions WHERE admin_id = $1 AND id <> $2", [admin.id, admin.session_id]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return NextResponse.json({ ok: true });
}
