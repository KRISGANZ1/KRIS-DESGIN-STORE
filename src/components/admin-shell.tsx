"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const links = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/orders", label: "Pesanan" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/settings", label: "Pengaturan toko" },
  { href: "/admin/change-password", label: "Ganti password" },
];

export function AdminShell({ children, username, storeName, developerCredit }: {
  children: ReactNode;
  username: string;
  storeName: string;
  developerCredit: string;
}) {
  const router = useRouter();
  const path = usePathname();
  const [error, setError] = useState("");
  async function logout() {
    setError("");
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      setError("Logout gagal. Silakan muat ulang halaman.");
      return;
    }
    router.replace("/admin/login");
    router.refresh();
  }
  return <div className="admin-layout">
    <aside className="admin-sidebar">
      <Link href="/admin" className="brand admin-brand"><span className="brand-mark">K</span><span>{storeName}</span></Link>
      <div className="admin-profile"><span className="eyebrow">AKUN ADMIN</span><strong>Admin: {username}</strong><span>Developer Credit: {developerCredit}</span></div>
      <nav className="admin-nav">{links.map((link) => <Link key={link.href} className={path === link.href || (link.href !== "/admin" && path.startsWith(`${link.href}/`)) ? "active" : ""} href={link.href}>{link.label}<span>↗</span></Link>)}</nav>
      <button className="logout-button" onClick={logout}>Keluar <span>↗</span></button>
      {error && <p className="form-error">{error}</p>}
    </aside>
    <div className="admin-main"><header className="admin-topbar"><span>{storeName} <span className="muted">/ ADMIN</span></span><span className="admin-user-pill"><i /> {username}</span></header><main className="admin-content">{children}</main></div>
  </div>;
}
