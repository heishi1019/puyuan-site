/** Schema.org JSON-LD helpers for GEO (Generative Engine Optimization).
 *  Usage: embed the return value in a <script type="application/ld+json"> tag.
 */

export const SITE_URL = "https://www.puyuan.tech";

/** Organization schema — used on the homepage */
export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "溥源科技",
  alternateName: ["PuYuan Tech", "杭州溥源智能科技有限公司"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.svg`,
  description:
    "面向科研机构与企业的 AI-native 公司，用 agent 覆盖专业写作与政府项目申报两类高频刚需。",
  sameAs: [],
};

/** SoftwareApplication schema — used on each product page.
 *  @param name        Product name, e.g. "智小申 ProposalPilot"
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
