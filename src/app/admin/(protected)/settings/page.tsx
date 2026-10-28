import { AdminSettingsForm } from "@/components/admin-settings-form";

export default function AdminSettingsPage() {
  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">STORE CONFIGURATION</p><h1>Identitas toko</h1><p className="muted">Perbarui identitas, kanal kontak, dan metadata website.</p></div></div><section className="admin-panel"><AdminSettingsForm /></section></div>;
}
