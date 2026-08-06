import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "智小申 ProposalPilot Agent", href: "/proposalpilot" },
  { label: "科小文 ScholarPilot Agent",  href: "/scholarpilot"  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-section">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row items-start justify-between gap-8 text-sm text-muted">
        {/* Brand */}
        <div className="space-y-1">
          <p className="font-semibold text-text">溥源科技</p>
          <p>杭州溥源智能科技有限公司</p>
          <p>PuYuan Tech</p>
        </div>

        {/* Products */}
        <div className="space-y-2">
          <p className="font-medium text-text">产品</p>
          {PRODUCT_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="block hover:text-text transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="space-y-1 text-xs">
          <p>© {new Date().getFullYear()} 杭州溥源智能科技有限公司</p>
          <p className="text-muted/60">浙ICP备XXXXXXXX号</p>
        </div>
      </div>
    </footer>
  );
}
