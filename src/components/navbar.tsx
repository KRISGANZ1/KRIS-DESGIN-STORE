import Link from "next/link";
import Image from "next/image";
import { StoreSettings } from "@/lib/settings-shared";
import { whatsappLink } from "@/lib/whatsapp";

export function Navbar({ settings }: { settings: StoreSettings }) {
  return (
    <header className="site-header">
      <nav className="nav-wrap container">
        <Link className="brand" href="/" aria-label={settings.store_name}>
          {settings.logo_url ? <Image src={settings.logo_url} alt="" className="brand-logo" width={68} height={68} unoptimized /> : <span className="brand-mark">K</span>}
          <span>{settings.store_name}</span>
        </Link>
        <div className="nav-links">
          <Link href="/#produk">Produk</Link>
          <Link href="/tentang">Tentang</Link>
          <Link href="/kontak">Kontak</Link>
          <a className="button button-small button-outline nav-contact" href={whatsappLink(settings.whatsapp_number, `Halo ${settings.store_name}, saya ingin bertanya mengenai produk digital yang tersedia.`)} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden>↗</span></a>
        </div>
      </nav>
    </header>
  );
}
