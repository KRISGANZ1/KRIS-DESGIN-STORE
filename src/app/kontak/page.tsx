import { getStoreSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const message = `Halo ${settings.store_name}, saya ingin bertanya mengenai produk digital yang tersedia.`;
  const support = `Halo ${settings.store_name}, saya membutuhkan bantuan pelanggan.`;
  return <section className="container page-section contact-page"><p className="eyebrow">KAMI SIAP MEMBANTU</p><h1>Mari terhubung.</h1><p className="page-intro muted">Punya pertanyaan produk, butuh bantuan checkout, atau ingin menyampaikan masukan? Hubungi kami melalui kanal berikut.</p>
    <div className="contact-grid"><a className="contact-card" href={whatsappLink(settings.whatsapp_number, message)} target="_blank" rel="noopener noreferrer"><span className="contact-icon">↗</span><span className="eyebrow">WHATSAPP ADMIN</span><h2>Chat dengan tim</h2><p className="muted">Untuk pertanyaan produk, dukungan, dan keluhan pelanggan.</p><span className="text-link">Buka WhatsApp ↗</span></a>
      <a className="contact-card" href={settings.instagram_url} target="_blank" rel="noopener noreferrer"><span className="contact-icon">◎</span><span className="eyebrow">INSTAGRAM</span><h2>{settings.instagram_username}</h2><p className="muted">Ikuti kabar terbaru dan inspirasi dari toko kami.</p><span className="text-link">Kunjungi Instagram ↗</span></a></div>
    <a className="text-link contact-support" href={whatsappLink(settings.whatsapp_number, support)} target="_blank" rel="noopener noreferrer">Butuh bantuan pesanan atau ingin menyampaikan keluhan? Chat dukungan pelanggan ↗</a>
  </section>;
}
