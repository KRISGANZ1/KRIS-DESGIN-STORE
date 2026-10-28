import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderStatus } from "@/components/admin-order-status";
import { formatRupiah } from "@/components/product-card";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await db.query<{
    id: string; order_number: string; customer_name: string; customer_email: string;
    customer_phone: string; status: string; total_amount: string; created_at: Date;
    product_name: string; quantity: number; unit_price: string;
  }>(
    `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
            o.status, o.total_amount, o.created_at, i.product_name, i.quantity, i.unit_price
     FROM orders o JOIN order_items i ON i.order_id = o.id WHERE o.id = $1`,
    [id],
  );
  const order = rows[0];
  if (!order) notFound();
  const settings = await getStoreSettings();
  const message = `Halo ${order.customer_name}, saya dari ${settings.store_name}. Terkait pesanan ${order.order_number} (${order.product_name} × ${order.quantity}) dengan total ${formatRupiah(order.total_amount)}.`;
  return <div className="admin-page"><Link href="/admin/orders" className="text-link">← Kembali ke pesanan</Link><div className="admin-page-heading order-detail-heading"><div><p className="eyebrow">ORDER DETAILS</p><h1>{order.order_number}</h1><p className="muted">Dibuat {new Date(order.created_at).toLocaleString("id-ID")}</p></div><AdminOrderStatus orderId={order.id} initialStatus={order.status} /></div>
    <div className="order-detail-grid"><section className="admin-panel"><p className="eyebrow">RINGKASAN PESANAN</p><h2>{order.product_name}</h2><div className="order-recap"><span>Jumlah × {order.quantity}</span><strong>{formatRupiah(Number(order.unit_price) * order.quantity)}</strong></div><div className="order-recap total-line"><span>Total</span><strong>{formatRupiah(order.total_amount)}</strong></div><p className="small-note">Jangan menyertakan password, token, atau kode redeem rahasia dalam pesan WhatsApp.</p></section>
      <section className="admin-panel customer-panel"><p className="eyebrow">INFORMASI PELANGGAN</p><h2>{order.customer_name}</h2><p>{order.customer_email}</p><p>{order.customer_phone}</p><a className="button button-small" href={whatsappLink(order.customer_phone, message)} target="_blank" rel="noopener noreferrer">Hubungi pelanggan via WhatsApp ↗</a><p className="small-note">WhatsApp akan dibuka dengan pesan siap kirim; pesan hanya terkirim setelah admin menekan tombol kirim.</p></section></div>
  </div>;
}
