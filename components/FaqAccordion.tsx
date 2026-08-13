import { Plus } from "@phosphor-icons/react/dist/ssr";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({
  items,
  tone = "light",
}: {
  items: readonly FaqItem[];
  tone?: "light" | "dark";
}) {
  return (
    <div className={`faq-accordion faq-accordion--${tone}`}>
      {items.map(({ question, answer }) => (
        <details key={question}>
          <summary>
            <span>{question}</span>
            <Plus size={24} weight="light" aria-hidden="true" />
          </summary>
          <div className="faq-accordion__answer"><p>{answer}</p></div>
        </details>
      ))}
    </div>
  );
}
