import Link from "next/link";
import { db } from "@/lib/db";
import { Product, ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = process.env.DATABASE_URL
    ? (await db.query<Product>(
        "SELECT id, slug, name, description, price, image_url FROM products WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 6",
      )).rows
    : [];
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> TOKO PRODUK DIGITAL</span>
          <h1>Digital essentials.<br /><span>Designed for you.</span></h1>
          <p>Temukan produk digital pilihan untuk mendukung kreativitas, produktivitas, dan kebutuhan online Anda.</p>
          <div className="hero-actions"><Link href="/produk" className="button">Jelajahi produk <span>↗</span></Link><Link href="/tentang" className="text-link">Kenali toko kami</Link></div>
          <div className="hero-note"><span>01</span><span>Praktis, cepat, dan sepenuhnya digital.</span></div>
        </div>
        <div className="hero-art" aria-label="Grafik abstrak ungu dan biru">
          <div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-ring" />
          <div className="floating-card"><span className="eyebrow">KRIS DESIGN</span><strong>Make it<br />digital.</strong><span className="card-spark">✳</span></div>
          <span className="art-caption">CREATIVE GOODS / 2026</span>
        </div>
      </section>
      <section className="section container" id="produk">
        <div className="section-heading"><div><p className="eyebrow">PILIHAN KAMI</p><h2>Produk unggulan</h2></div><Link href="/produk" className="text-link">Lihat semua produk ↗</Link></div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span className="empty-icon">✳</span><h3>Koleksi segera hadir</h3><p className="muted">Produk digital baru sedang disiapkan. Hubungi kami jika Anda mencari sesuatu yang spesifik.</p><Link href="/kontak" className="text-link">Hubungi toko ↗</Link></div>}
      </section>
      <section className="callout container"><div><p className="eyebrow">BUTUH BANTUAN?</p><h2>Ada yang ingin ditanyakan?</h2><p className="muted">Tim kami siap membantu memilih produk yang sesuai kebutuhan Anda.</p></div><Link href="/kontak" className="button button-outline">Hubungi tim kami ↗</Link></section>
    </>
  );
}
