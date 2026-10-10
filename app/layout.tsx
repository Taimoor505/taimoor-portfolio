import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Header from "@/components/shell/Header";
import Footer from "@/components/shell/Footer";
import ScrollTop from "@/components/shell/ScrollTop";
import { SITE_URL } from "@/lib/site";

// Self-hosted and preloaded by Next, with a size-matched fallback (no layout shift).
// wght is included automatically for variable fonts; only extra axes are listed.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Taimoor Asif, AI Engineer", template: "%s · Taimoor Asif" },
  description: "AI agents, voice agents and automations that run real business operations. Remote from Lahore.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} antialiased`}>
        <a
          href="#main"
          className="tag sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <ScrollTop />
      </body>
    </html>
  );
}
