/** Schema.org JSON-LD helpers for GEO (Generative Engine Optimization).
 *  Usage: embed the return value in a <script type="application/ld+json"> tag.
 */

// 部署时在 Vercel 环境变量里设置 NEXT_PUBLIC_SITE_URL（无尾部斜杠）。
// 没设置时回退到下面的默认值；换域名只需改这里或改 Vercel 的环境变量，不用改代码。
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://puyuan-site.vercel.app"
).replace(/\/$/, "");

/** Organization schema — used on the homepage */
export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "溥源科技",
  alternateName: ["PuYuan Tech", "杭州溥源智能科技有限公司"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.svg`,
  description:
    "杭州溥源智能科技有限公司（溥源科技 / PuYuan Tech），AI-native 公司，旗下智小申（ProposalPilot Agent）覆盖政府项目申报全流程，科小文（ScholarPilot Agent）覆盖学术写作全流程，持续扩展中。",
  sameAs: [],
};

/** SoftwareApplication schema — used on each product page.
 *  @param name        Product name, e.g. "智小申 ProposalPilot Agent"
 *  @param description One-sentence GEO-friendly description
 *  @param url         Canonical product page URL
 */
export function softwareAppSchema(
  name: string,
  description: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    author: {
      "@type": "Organization",
      name: "溥源科技",
      url: SITE_URL,
    },
  };
}

/** FAQPage schema — used on homepage and product pages.
 *  @param faqs  Array of { question, answer } pairs
 */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
