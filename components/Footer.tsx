import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const PRODUCT_LINKS = [
  { label: "智小申", meta: "ProposalPilot Agent", href: "/proposalpilot" },
  { label: "科小文", meta: "ScholarPilot Agent", href: "/scholarpilot" },
];

export default function Footer() {
  return (
    <footer id="site-footer" className="site-footer">
      <div className="site-footer__main mx-auto max-w-6xl">
        <div className="site-footer__contact">
          <Link href="/" className="site-footer__brand" aria-label="溥源智能首页">
            <img src="/brand-logo-mark.png" alt="" width="38" height="38" />
            <span>PRYOS AI</span>
          </Link>
          <p className="site-footer__prompt">有问题想聊聊吗？</p>
          <a className="site-footer__email" href="mailto:hello@puyuan.tech">
            hello@puyuan.tech <ArrowUpRight size={20} weight="regular" aria-hidden="true" />
          </a>
        </div>

        <nav className="site-footer__links" aria-label="页脚导航">
          <div>
            <p>产品</p>
            {PRODUCT_LINKS.map(({ label, meta, href }) => <Link key={href} href={href}>{label}<small>{meta}</small></Link>)}
          </div>
          <div>
            <p>公司</p>
            <Link href="/about">关于溥源</Link>
            <Link href="/faq">常见问题</Link>
            <Link href="/">产品矩阵</Link>
          </div>
          <div>
            <p>联系</p>
            <a href="mailto:hello@puyuan.tech">hello@puyuan.tech</a>
          </div>
        </nav>
      </div>
      <div className="site-footer__bottom mx-auto max-w-6xl">
        <span>杭州溥源智能科技有限公司</span>
        <span>© {new Date().getFullYear()} Pryos AI</span>
      </div>
    </footer>
  );
}
