import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { schemaSql } from "../../../../../db/schema";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function isAuthorized(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected || expected.length < 32) return false;
  const providedHash = createHash("sha256").update(provided).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

export async function POST(request: Request) {
  const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!isAuthorized(request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null, expectedToken)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!initialPassword || initialPassword.length < 12 || initialPassword.length > 128) {
    return NextResponse.json({ error: "Initial admin password is not configured correctly." }, { status: 503 });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(731914202)");
    await client.query(schemaSql);

    const existing = await client.query("SELECT id FROM admins LIMIT 1");
    if (existing.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Admin account already exists." }, { status: 409 });
    }

    const passwordHash = await argon2.hash(initialPassword, { type: argon2.argon2id });
    await client.query(
      "INSERT INTO admins (username, password_hash, must_change_password) VALUES ($1, $2, TRUE)",
      ["KRISTIAN", passwordHash],
    );
    await client.query("COMMIT");
    return NextResponse.json({ ok: true, username: "KRISTIAN", mustChangePassword: true }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Admin bootstrap failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Admin setup failed. Check the database configuration and server logs." }, { status: 500 });
  } finally {
    client.release();
  }
}
