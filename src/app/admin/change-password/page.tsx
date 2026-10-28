import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { PasswordChangeForm } from "@/components/password-change-form";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/admin/login");
  const settings = await getStoreSettings();
  return <section className="admin-login-page">
    <div className="brand"><span className="brand-mark">K</span><span>{settings.store_name}</span></div>
    <div className="admin-login-card"><p className="eyebrow">KEAMANAN AKUN</p><h1>Perbarui password.</h1><p className="muted">Gunakan password unik dengan minimal 12 karakter.</p><PasswordChangeForm mustChange={admin.must_change_password} /></div>
  </section>;
}
