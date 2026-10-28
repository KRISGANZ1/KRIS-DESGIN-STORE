import { Pool } from "pg";
import argon2 from "argon2";
import { loadEnvConfig } from "@next/env";

function promptSecret(label: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    throw new Error("Run this setup command in an interactive terminal so the password can be entered securely.");
  }
  process.stdout.write(label);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  return new Promise((resolve) => {
    let value = "";
    const onData = (key: string) => {
      if (key === "\u0003") {
        process.stdin.setRawMode(false);
        process.exit(130);
      }
      if (key === "\r" || key === "\n") {
        process.stdin.off("data", onData);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve(value);
      } else if (key === "\u007f" || key === "\b") {
        value = value.slice(0, -1);
      } else if (key >= " ") {
        value += key;
      }
    };
    process.stdin.on("data", onData);
  });
}

async function main() {
  loadEnvConfig(process.cwd());
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be configured.");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const username = "KRISTIAN";
    const existing = await pool.query("SELECT id FROM admins LIMIT 1");
    if (existing.rowCount) throw new Error("An admin account already exists; bootstrap creates only the initial account.");

    const password = await promptSecret("Initial admin password (input hidden): ");
    if (password.length < 12) throw new Error("Use an initial password with at least 12 characters.");
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await pool.query(
      "INSERT INTO admins (username, password_hash, must_change_password) VALUES ($1, $2, TRUE)",
      [username, passwordHash],
    );
    console.log("Admin account created. The initial password must be changed after login.");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Admin bootstrap failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
