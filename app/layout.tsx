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
    "面向科研机构与企业的 AI-native 公司，用 agent 覆盖专业写作与政府项目申报两类高频刚需。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "溥源科技",
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
