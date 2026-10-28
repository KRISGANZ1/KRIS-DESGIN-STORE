import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/http";
import { db } from "@/lib/db";

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(5000),
  price: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  image_url: z.string().trim().max(500),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { rows } = await db.query("SELECT id, slug, name, description, price, image_url, is_active FROM products ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Data produk tidak valid." }, { status: 400 });
  const { name, slug, description, price, image_url } = parsed.data;
  try {
    const { rows } = await db.query(
      `INSERT INTO products (name, slug, description, price, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, slug, name, description, price, image_url, is_active`,
      [name, slug, description, price, image_url],
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "Slug produk sudah digunakan." }, { status: 409 });
    }
    throw error;
  }
}
