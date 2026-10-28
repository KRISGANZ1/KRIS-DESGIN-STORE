import { AdminProductForm } from "@/components/admin-product-form";
import type { AdminProduct } from "@/components/admin-product-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { rows } = await db.query<AdminProduct>(
    "SELECT id, name, slug, price, is_active FROM products ORDER BY created_at DESC",
  );
  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">CATALOG MANAGEMENT</p><h1>Produk</h1><p className="muted">Tambahkan produk digital ke katalog toko.</p></div></div><section className="admin-panel"><AdminProductForm initialProducts={rows} /></section></div>;
}
