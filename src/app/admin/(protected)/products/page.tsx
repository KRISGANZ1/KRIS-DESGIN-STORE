import { AdminProductForm } from "@/components/admin-product-form";

export default function AdminProductsPage() {
  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">CATALOG MANAGEMENT</p><h1>Produk</h1><p className="muted">Tambahkan produk digital ke katalog toko.</p></div></div><section className="admin-panel"><AdminProductForm /></section></div>;
}
