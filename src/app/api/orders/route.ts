import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const orderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email().max(200),
  customerPhone: z.string().trim().min(8).max(30),
});

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Periksa kembali data checkout." }, { status: 400 });
  }
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const productResult = await client.query<{ id: string; name: string; price: string }>(
      "SELECT id, name, price FROM products WHERE id = $1 AND is_active = TRUE FOR SHARE",
      [parsed.data.productId],
    );
    const product = productResult.rows[0];
    if (!product) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Produk tidak tersedia." }, { status: 404 });
    }
    const total = BigInt(product.price) * BigInt(parsed.data.quantity);
    if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error("Order total exceeds supported amount.");
    }
    const orderNumber = `KDX-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const orderResult = await client.query<{ id: string }>(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, total_amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [orderNumber, parsed.data.customerName, parsed.data.customerEmail, parsed.data.customerPhone, total.toString()],
    );
    await client.query(
      "INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)",
      [orderResult.rows[0].id, product.id, product.name, parsed.data.quantity, product.price],
    );
    await client.query("COMMIT");
    return NextResponse.json({
      order_number: orderNumber,
      product: product.name,
      quantity: parsed.data.quantity,
      total_amount: Number(total),
    }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
