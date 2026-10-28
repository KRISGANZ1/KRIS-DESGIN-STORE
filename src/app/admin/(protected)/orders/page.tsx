import Link from "next/link";
import { db } from "@/lib/db";
import { formatRupiah } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { rows } = await db.query(
    "SELECT id, order_number, customer_name, customer_email, status, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 200",
  );
  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">ORDER MANAGEMENT</p><h1>Pesanan</h1><p className="muted">Kelola pesanan pelanggan dan konfirmasi statusnya.</p></div><span className="count-pill">{rows.length} terakhir</span></div><section className="admin-panel">
    {rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Pesanan</th><th>Pelanggan</th><th>Email</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>{rows.map((order) => <tr key={order.id}><td><strong>{order.order_number}</strong><small>{new Date(order.created_at).toLocaleString("id-ID")}</small></td><td>{order.customer_name}</td><td>{order.customer_email}</td><td><span className={`order-status ${order.status}`}>{order.status}</span></td><td>{formatRupiah(order.total_amount)}</td><td><Link className="text-link" href={`/admin/orders/${order.id}`}>Detail ↗</Link></td></tr>)}</tbody></table></div> : <p className="muted panel-empty">Belum ada pesanan masuk.</p>}
  </section></div>;
}
