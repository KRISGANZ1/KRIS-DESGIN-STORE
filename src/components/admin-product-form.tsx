"use client";

import { FormEvent, useState } from "react";

export type AdminProduct = { id: string; name: string; slug: string; price: string | number; is_active: boolean };

export function AdminProductForm({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        description: form.get("description"),
        price: Number(form.get("price")),
        image_url: form.get("image_url"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Produk tidak dapat disimpan.");
      return;
    }
    formElement.reset();
    setNotice("Produk berhasil ditambahkan.");
    setProducts((current) => [data as AdminProduct, ...current]);
  }
  return <div className="admin-product-layout"><form className="settings-form product-admin-form" onSubmit={submit}>
    <h2>Tambah produk</h2>
    <label>Nama produk<input name="name" required minLength={2} maxLength={120} /></label>
    <label>Slug URL <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="nama-produk" /></label>
    <label>Deskripsi<textarea name="description" rows={4} maxLength={5000} /></label>
    <label>Harga (Rupiah)<input name="price" type="number" min="0" step="1" required /></label>
    <label>URL gambar <input name="image_url" type="url" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success">{notice}</p>}
    <button className="button">Tambah ke katalog ↗</button>
  </form><div className="admin-table-wrap"><h2>Produk tersimpan</h2>{products.length ? <table className="admin-table"><thead><tr><th>Produk</th><th>Harga</th><th>Status</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>/{product.slug}</small></td><td>Rp{new Intl.NumberFormat("id-ID").format(Number(product.price))}</td><td>{product.is_active ? "Aktif" : "Nonaktif"}</td></tr>)}</tbody></table> : <p className="muted">Belum ada produk.</p>}</div></div>;
}
