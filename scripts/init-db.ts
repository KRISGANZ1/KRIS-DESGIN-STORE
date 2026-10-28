import { Pool } from "pg";
import { loadEnvConfig } from "@next/env";
import { schemaSql } from "../db/schema";

async function main() {
  loadEnvConfig(process.cwd());
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be configured.");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(schemaSql);
    console.log("Database schema initialized.");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Database initialization failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
