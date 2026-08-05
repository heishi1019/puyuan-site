import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "智小申", href: "/proposalpilot" },
  { label: "科小文", href: "/scholarpilot" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="溥源科技 首页">
          <Image
            src="/logo-mark.svg"
            alt="溥源科技 logo"
            width={28}
            height={28}
            className="transition-opacity group-hover:opacity-80"
            priority
          />
          <span className="font-sans font-semibold text-base tracking-wide text-text group-hover:text-accent transition-colors">
            PUYUAN
          </span>
        </Link>

        {/* Product links */}
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted hover:text-text transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="https://app.puyuan.tech"
          className="hidden sm:inline-flex items-center rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-bg hover:bg-accent-hover glow-hover transition-all"
        >
          免费试用
        </Link>
      </div>
    </header>
  );
}
