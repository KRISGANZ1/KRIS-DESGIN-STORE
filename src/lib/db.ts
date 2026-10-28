import { Pool } from "pg";

declare global {
  var postgresPool: Pool | undefined;
}

const pool = globalThis.postgresPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
});

if (process.env.NODE_ENV !== "production") globalThis.postgresPool = pool;

export const db = new Proxy(pool, {
  get(target, property, receiver) {
    if (!process.env.DATABASE_URL && (property === "query" || property === "connect")) {
      return () => { throw new Error("DATABASE_URL must be configured before using database-backed pages or APIs."); };
    }
    const value: unknown = Reflect.get(target, property, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
}) as Pool;
