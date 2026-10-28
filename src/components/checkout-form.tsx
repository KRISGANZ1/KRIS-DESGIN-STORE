"use client";

import { FormEvent, useState } from "react";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { StoreSettings } from "@/lib/settings-shared";

type CreatedOrder = {
  order_number: string;
  product: string;
  quantity: number;
  total_amount: number;
};

export function CheckoutForm({ product, priceLabel, settings }: {
  product: { id: string; name: string };
  priceLabel: string;
  settings: StoreSettings;
}) {
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customerName: form.get("customerName"),
          customerEmail: form.get("customerEmail"),
          customerPhone: form.get("customerPhone"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pesanan tidak dapat dibuat.");
      setCreated(data as CreatedOrder);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Terjadi kesalahan. Silakan coba kembali.");
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    const message = orderMessage(created, settings.store_name);
    return <div className="order-success">
      <span className="success-mark">✓</span><p className="eyebrow">PESANAN TERCATAT</p><h2>Terima kasih!</h2>
      <p className="muted">Nomor pesanan Anda <strong>{created.order_number}</strong>. Pesanan masih menunggu konfirmasi pembayaran.</p>
      <div className="order-recap"><span>{created.product} × {created.quantity}</span><strong>Rp{new Intl.NumberFormat("id-ID").format(created.total_amount)}</strong></div>
      <p className="small-note">WhatsApp akan terbuka dengan pesan yang sudah disiapkan. Pesan hanya terkirim setelah Anda menekan tombol kirim di WhatsApp.</p>
      <a className="button" href={whatsappLink(settings.whatsapp_number, message)} target="_blank" rel="noopener noreferrer">Konfirmasi melalui WhatsApp ↗</a>
    </div>;
  }

  return <form className="checkout-form" onSubmit={submit}>
    <div className="checkout-summary"><span>{product.name}</span><strong>{priceLabel}</strong></div>
    <label>Nama lengkap<input name="customerName" autoComplete="name" required minLength={2} maxLength={100} /></label>
    <div className="form-row"><label>Email<input name="customerEmail" type="email" autoComplete="email" required maxLength={200} /></label><label>Nomor WhatsApp<input name="customerPhone" type="tel" autoComplete="tel" placeholder="+62 atau 08..." required minLength={8} maxLength={30} /><small className="muted">Gunakan nomor aktif, awalan 08 akan disesuaikan ke +62.</small></label></div>
    <label>Jumlah<input type="number" min={1} max={20} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <p className="small-note">Pembuatan pesanan belum memproses pembayaran otomatis. Tim toko akan mengonfirmasi langkah pembayaran melalui WhatsApp.</p>
    <button className="button" disabled={busy}>{busy ? "Memproses..." : "Buat pesanan"} <span>↗</span></button>
  </form>;
}
