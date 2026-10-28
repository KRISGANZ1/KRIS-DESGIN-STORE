import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/http";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { rows } = await db.query(
    `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
            o.status, o.total_amount, o.created_at,
            COALESCE(json_agg(json_build_object(
              'product_name', i.product_name, 'quantity', i.quantity, 'unit_price', i.unit_price
            )) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT 200`,
  );
  return NextResponse.json(rows);
}
