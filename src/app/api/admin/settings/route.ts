import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/http";
import { db } from "@/lib/db";
import { defaultSettings } from "@/lib/settings-shared";

function isInstagramUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "www.instagram.com" || url.hostname === "instagram.com");
  } catch {
    return false;
  }
}

const settingsSchema = z.object({
  store_name: z.string().trim().min(1).max(100),
  logo_url: z.string().trim().max(500).refine((value) => value === "" || value.startsWith("https://")),
  instagram_username: z.string().trim().max(50),
  instagram_url: z.string().url().max(500).refine(isInstagramUrl),
  whatsapp_number: z.string().regex(/^\d{8,15}$/),
  developer_credit: z.string().trim().min(1).max(100),
  footer_info: z.string().trim().max(500),
  site_title: z.string().trim().min(1).max(120),
  site_description: z.string().trim().max(300),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { rows } = await db.query("SELECT key, value FROM store_settings WHERE key = ANY($1)", [Object.keys(defaultSettings)]);
  return NextResponse.json({ ...defaultSettings, ...Object.fromEntries(rows.map(({ key, value }) => [key, value])) });
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const body: unknown = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Pengaturan tidak valid. Periksa kembali isian dan format URL." }, { status: 400 });
  }
  const values = Object.entries(parsed.data);
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    for (const [key, value] of values) {
      await client.query(
        "INSERT INTO store_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, value],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return NextResponse.json(parsed.data);
}
