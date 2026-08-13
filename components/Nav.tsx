"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { FocusEvent, useEffect, useRef, useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const productMatrixHref = isHome ? "#products" : "/#products";
  const isProductPage = pathname === "/proposalpilot" || pathname === "/scholarpilot";
  const primaryCtaHref = isProductPage ? "#early-access" : productMatrixHref;
  const primaryCtaLabel = isProductPage ? "申请内测" : "选择产品";
  const previousPathname = useRef(pathname);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const [suppressProductHover, setSuppressProductHover] = useState(false);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;
    setProductsOpen(false);
    setSuppressProductHover(true);
    mobileMenuRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeProductsForNavigation = () => {
    setProductsOpen(false);
    setSuppressProductHover(true);
  };

  const handleProductsBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setProductsOpen(false);
    }
  };

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="site-nav__shell mx-auto max-w-[1440px] rounded-[28px] border border-border/75 bg-surface/40 shadow-[0_14px_42px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl backdrop-brightness-110 backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="group flex items-center rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-accent" aria-label="溥源智能首页">
            <span className="site-nav__brand-symbol" aria-hidden="true">
              <img className="site-nav__brand-symbol-dark" src="/brand-logo-symbol-dark.png?v=1" alt="" />
              <img className="site-nav__brand-symbol-accent" src="/brand-logo-symbol.png?v=2" alt="" />
            </span>
            <span className="font-mono text-sm font-semibold tracking-[0.12em] text-text transition-colors group-hover:text-accent">PRYOS AI</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="主导航">
            <Link href="/" className="nav-link">首页</Link>
            <div
              className="nav-products"
              data-open={productsOpen}
              onPointerEnter={() => {
                if (!suppressProductHover) setProductsOpen(true);
              }}
              onPointerLeave={() => {
                setProductsOpen(false);
                setSuppressProductHover(false);
              }}
              onFocusCapture={() => setProductsOpen(true)}
              onBlur={handleProductsBlur}
            >
              <button
                type="button"
                className="nav-link nav-products__trigger"
                aria-haspopup="true"
                aria-expanded={productsOpen}
                onClick={() => {
                  setSuppressProductHover(false);
                  setProductsOpen((open) => !open);
                }}
              >
                产品
              </button>
              <div className="nav-products__menu" aria-hidden={!productsOpen}>
                <Link href="/proposalpilot" className="nav-products__item" onClick={closeProductsForNavigation}>
                  <span><strong>智小申</strong><small>ProposalPilot Agent</small><em>企业项目申报 · 研发共创</em></span>
                </Link>
                <Link href="/scholarpilot" className="nav-products__item" onClick={closeProductsForNavigation}>
                  <span><strong>科小文</strong><small>ScholarPilot Agent</small><em>AI 科研工作台 · 内测中</em></span>
                </Link>
              </div>
            </div>
            <Link href="/about" className="nav-link">关于我们</Link>
            <Link href="/faq" className="nav-link">常见问题</Link>
          </nav>

          <details ref={mobileMenuRef} className="nav-mobile sm:hidden">
            <summary aria-label="打开主导航"><List size={22} weight="regular" aria-hidden="true" /></summary>
            <nav className="nav-mobile__menu" aria-label="移动端主导航">
              <Link href="/">首页</Link>
              <span>产品</span>
              <Link href="/proposalpilot" className="nav-mobile__product">智小申 <small>ProposalPilot Agent</small></Link>
              <Link href="/scholarpilot" className="nav-mobile__product">科小文 <small>ScholarPilot Agent</small></Link>
              <Link href="/about">关于我们</Link>
              <Link href="/faq">常见问题</Link>
              <Link href={primaryCtaHref} className="nav-mobile__cta">{primaryCtaLabel}</Link>
            </nav>
          </details>

          <Link href={primaryCtaHref} className="hidden min-h-10 items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg outline-none transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-glow focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 sm:inline-flex">
            {primaryCtaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
