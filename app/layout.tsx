import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import RouteTransition from "@/components/RouteTransition";
import SiteLayerEntrance from "@/components/SiteLayerEntrance";
import SmoothScroll from "@/components/SmoothScroll";
import SiteTextReveal from "@/components/SiteTextReveal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/brand-logo-mark.png" },
  metadataBase: new URL("https://pryos.cn"),
  title: {
    default: "溥源智能 · Pryos AI",
    template: "%s · 溥源智能",
  },
  description:
    "溥源智能（Pryos AI）专注专业智能体产品研发与产品化，让智能体走进真实的专业世界。",
  /* NOTE: do NOT set alternates.canonical here. Next.js metadata inherits
     downward, so a site-wide canonical makes every child page declare itself
     a duplicate of "/" — a deindexing risk. Each page sets its own. */
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "溥源智能",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="bg-bg text-text antialiased">
        <SmoothScroll />
        <SiteLayerEntrance />
        <SiteTextReveal />
        <RouteTransition />
        <Nav />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
