import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckoutForm } from "@/components/checkout-form";
import { formatRupiah } from "@/components/product-card";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const { rows } = await db.query<{ id: string; name: string; price: string }>(
    "SELECT id, name, price FROM products WHERE id = $1 AND is_active = TRUE",
    [productId],
  );
  const product = rows[0];
  if (!product) notFound();
  const settings = await getStoreSettings();
  return <section className="container page-section checkout-page"><p className="eyebrow">CHECKOUT / 01</p><h1>Selesaikan pesanan.</h1><p className="page-intro muted">Isi detail kontak Anda. Tim kami akan mengonfirmasi langkah pembayaran melalui WhatsApp.</p><CheckoutForm product={product} priceLabel={formatRupiah(product.price)} settings={settings} /></section>;
}
