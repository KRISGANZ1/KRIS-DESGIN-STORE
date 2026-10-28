import { db } from "@/lib/db";
import { Product, ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { rows: products } = await db.query<Product>(
    "SELECT id, slug, name, description, price, image_url FROM products WHERE is_active = TRUE ORDER BY created_at DESC",
  );
  return <section className="section container page-section"><p className="eyebrow">KATALOG</p><h1>Produk digital</h1><p className="page-intro muted">Pilihan praktis untuk kebutuhan digital sehari-hari.</p>
    {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h3>Belum ada produk aktif</h3><p className="muted">Silakan kembali lagi nanti atau hubungi kami untuk informasi produk.</p></div>}
  </section>;
}
