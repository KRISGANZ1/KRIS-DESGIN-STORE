import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/http";
import { db } from "@/lib/db";

const statusSchema = z.object({ status: z.enum(["pending", "paid", "fulfilled", "cancelled"]) });

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await context.params;
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Status pesanan tidak valid." }, { status: 400 });
  const result = await db.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status",
    [parsed.data.status, id],
  );
  if (!result.rowCount) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}
