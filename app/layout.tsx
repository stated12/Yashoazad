import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsGate from "@/components/AnalyticsGate";
import ConsentManager from "@/components/ConsentManager";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Experience that informs. Ideas that educate.`, template: `%s | ${SITE.name}` },
  description:
    "Yashovardhan Jha Azad, IPS (Retd.), former Special Director of the Intelligence Bureau and former Central Information Commissioner. Insights on national security, policing, governance and RTI; speaking, learning and consulting enquiries.",
  openGraph: { siteName: SITE.name, type: "website", url: SITE.url, images: [{ url: "/yashovardhan-azad-portrait.jpg", width: 922, height: 1024, alt: SITE.name }] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 bg-white px-3 py-2 rounded">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <ConsentManager />
        <AnalyticsGate />
      </body>
    </html>
  );
}
