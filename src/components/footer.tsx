import Link from "next/link";
import { StoreSettings } from "@/lib/settings-shared";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer({ settings }: { settings: StoreSettings }) {
  const inquiry = `Halo ${settings.store_name}, saya ingin bertanya mengenai produk digital yang tersedia.`;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" href="/"><span className="brand-mark">K</span><span>{settings.store_name}</span></Link>
          <p className="muted footer-copy">{settings.footer_info}</p>
        </div>
        <div className="footer-links">
          <Link href="/produk">Semua produk</Link>
          <Link href="/tentang">Tentang kami</Link>
          <Link href="/kontak">Kontak & bantuan</Link>
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">Instagram {settings.instagram_username} ↗</a>
          <a href={whatsappLink(settings.whatsapp_number, inquiry)} target="_blank" rel="noopener noreferrer">WhatsApp admin ↗</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {settings.store_name}. Hak cipta dilindungi.</span>
        <span>Dirancang dan dikembangkan oleh <strong>{settings.developer_credit}</strong></span>
      </div>
    </footer>
  );
}
