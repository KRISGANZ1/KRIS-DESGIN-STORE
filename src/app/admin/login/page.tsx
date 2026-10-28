import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const settings = await getStoreSettings();
  return <section className="admin-login-page">
    <Link href="/" className="brand"><span className="brand-mark">K</span><span>{settings.store_name}</span></Link>
    <div className="admin-login-card"><p className="eyebrow">AREA TERBATAS</p><h1>Admin sign in.</h1><p className="muted">Masuk untuk mengelola toko dan pesanan Anda.</p><AdminLoginForm /><Link className="text-link login-back" href="/">← Kembali ke toko</Link></div>
    <p className="admin-login-credit">{settings.developer_credit} / SYSTEM ACCESS</p>
  </section>;
}
