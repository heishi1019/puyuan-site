import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.puyuan.tech"),
  title: {
    default: "溥源科技 · PuYuan Tech",
    template: "%s · 溥源科技",
  },
  description:
    "溥源科技（PuYuan Tech）是一家 AI-native 公司，专注构建专业场景 agent，持续扩展中。",
  /* NOTE: do NOT set alternates.canonical here. Next.js metadata inherits
     downward, so a site-wide canonical makes every child page declare itself
     a duplicate of "/" — a deindexing risk. Each page sets its own. */
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "溥源科技",
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
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
