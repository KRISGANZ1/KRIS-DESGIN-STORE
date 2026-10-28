import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { getStoreSettings } from "@/lib/settings";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    title: settings.site_title,
    description: settings.site_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getStoreSettings();
  return (
    <html lang="id">
      <body>
        <Navbar settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <Analytics />
      </body>
    </html>
  );
}
