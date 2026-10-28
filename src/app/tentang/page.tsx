import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getStoreSettings();
  return <section className="container page-section about-page"><p className="eyebrow">TENTANG TOKO</p><h1>{settings.store_name}</h1><p className="page-intro muted">Kami menghadirkan produk digital pilihan dengan proses pembelian yang sederhana dan layanan yang personal.</p>
    <div className="about-panel"><span className="about-number">01 / OUR APPROACH</span><h2>Digital, dengan sentuhan manusia.</h2><p className="muted">Setiap produk dirancang untuk membantu kebutuhan digital Anda. Jika Anda memiliki pertanyaan sebelum atau sesudah pembelian, tim kami siap membantu melalui WhatsApp.</p><span className="about-credit">Developer credit <strong>{settings.developer_credit}</strong></span></div>
  </section>;
}
