import Link from "next/link";
import { db } from "@/lib/db";
import { formatRupiah } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products, revenue] = await Promise.all([
    db.query<{ count: string }>("SELECT COUNT(*) AS count FROM orders"),
    db.query<{ count: string }>("SELECT COUNT(*) AS count FROM products"),
    db.query<{ total: string }>("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status IN ('paid', 'fulfilled')"),
  ]);
  const { rows: recent } = await db.query(
    "SELECT id, order_number, customer_name, status, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 5",
  );
  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">STORE OVERVIEW</p><h1>Ringkasan</h1><p className="muted">Pantau toko dan aktivitas terbaru Anda.</p></div><Link className="button button-small" href="/admin/settings">Pengaturan toko ↗</Link></div>
    <div className="stats-grid"><article className="stat-card"><span>Total pesanan</span><strong>{orders.rows[0].count}</strong><small>Pesanan tercatat</small></article><article className="stat-card"><span>Produk</span><strong>{products.rows[0].count}</strong><small>Item katalog</small></article><article className="stat-card"><span>Pendapatan terkonfirmasi</span><strong>{formatRupiah(revenue.rows[0].total)}</strong><small>Dari pesanan dibayar dan selesai</small></article></div>
    <section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">AKTIVITAS</p><h2>Pesanan terbaru</h2></div><Link className="text-link" href="/admin/orders">Semua pesanan ↗</Link></div>
      {recent.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nomor pesanan</th><th>Pelanggan</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>{recent.map((order) => <tr key={order.id}><td><strong>{order.order_number}</strong></td><td>{order.customer_name}</td><td><span className={`order-status ${order.status}`}>{order.status}</span></td><td>{formatRupiah(order.total_amount)}</td><td><Link className="text-link" href={`/admin/orders/${order.id}`}>Detail ↗</Link></td></tr>)}</tbody></table></div> : <p className="muted panel-empty">Belum ada pesanan masuk.</p>}
    </section>
  </div>;
}
