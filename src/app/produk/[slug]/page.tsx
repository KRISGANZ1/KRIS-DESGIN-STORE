import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/whatsapp";
import { formatRupiah } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { rows } = await db.query<{ id: string; slug: string; name: string; description: string; price: string; image_url: string }>(
    "SELECT id, slug, name, description, price, image_url FROM products WHERE slug = $1 AND is_active = TRUE",
    [slug],
  );
  const product = rows[0];
  if (!product) notFound();
  const settings = await getStoreSettings();
  const message = `Halo ${settings.store_name}, saya ingin bertanya mengenai produk ${product.name}.`;
  return <section className="container detail-layout page-section">
    <div className="detail-image">{product.image_url ? <Image src={product.image_url} alt={product.name} width={1200} height={1200} unoptimized /> : <span className="product-placeholder">DIGITAL<br />GOODS</span>}</div>
    <div className="detail-copy"><p className="eyebrow">PRODUK DIGITAL / {product.slug.toUpperCase()}</p><h1>{product.name}</h1><p className="muted detail-description">{product.description || "Produk digital pilihan dari KRIS DESIGN X STORE."}</p><div className="detail-price">{formatRupiah(product.price)}</div><p className="detail-support">Produk digital. Detail pemenuhan akan dikonfirmasi setelah pembayaran.</p><div className="detail-actions"><Link className="button" href={`/checkout/${product.id}`}>Lanjut checkout <span>↗</span></Link><a className="button button-outline" href={whatsappLink(settings.whatsapp_number, message)} target="_blank" rel="noopener noreferrer">Tanya via WhatsApp ↗</a></div><Link className="text-link" href="/produk">← Kembali ke katalog</Link></div>
  </section>;
}
