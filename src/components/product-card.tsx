import Link from "next/link";
import Image from "next/image";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string | number;
  image_url: string;
};

export function formatRupiah(value: string | number) {
  return `Rp${new Intl.NumberFormat("id-ID").format(Number(value))}`;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/produk/${product.slug}`} className="product-image">
        {product.image_url ? <Image src={product.image_url} alt={product.name} width={1200} height={900} unoptimized /> : <span className="product-placeholder">DIGITAL<br />GOODS</span>}
        <span className="image-arrow">↗</span>
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">PRODUK DIGITAL</p>
        <h3><Link href={`/produk/${product.slug}`}>{product.name}</Link></h3>
        <p className="muted product-short">{product.description}</p>
        <div className="product-card-bottom"><strong>{formatRupiah(product.price)}</strong><Link href={`/produk/${product.slug}`} className="text-link">Lihat detail ↗</Link></div>
      </div>
    </article>
  );
}
