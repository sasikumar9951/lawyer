"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const defaultFaqs: FaqItem[] = [
  {
    id: "when-to-register",
    question: "When should we apply for registering our Partnership firm?",
    answer:
      "A partnership firm can be registered at the time of its formation or later. The application is to be made to the Registrar of Firms of the region in which the business is located. It is advisable to register as soon as the business starts to avail the rights and benefits available only to a registered firm.",
  },
  {
    id: "deed-compulsory",
    question: "Whether Partnership Deed registration is compulsory?",
    answer:
      "Registration of the partnership deed is not compulsory, however, an unregistered firm suffers several disabilities such as inability to sue third parties for enforcement of rights arising from a contract.",
  },
  {
    id: "not-register",
    question: "What happens if I do not register my Partnership Firm?",
    answer:
      "You can operate the business, but the firm cannot sue to enforce contractual rights and some statutory benefits are unavailable. Registration removes these disabilities.",
  },
  {
    id: "advantages-registering",
    question: "What are the advantages of registering a Partnership Firm?",
    answer:
      "A registered partnership firm can enforce contractual rights in court, create better credibility with vendors and banks, and provides official recognition of the partnership relationship.",
  },
  {
    id: "capital-requirement",
    question: "What is the minimum capital requirement to start a Partnership Firm?",
    answer:
      "There is no statutory minimum capital requirement. Partners can start with any mutually agreed capital contribution as recorded in the partnership deed.",
  },
  {
    id: "compliance",
    question: "What are the compliance requirements to be fulfilled by a Partnership firm?",
    answer:
      "Maintain books of accounts, file applicable income tax returns, comply with GST or other registrations if applicable, and adhere to conditions mentioned in the partnership deed.",
  },
];

const Faq = ({ serviceData }: { serviceData?: any }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(id);
    }
  };

  // Use service FAQs if available, otherwise use default FAQs
  const faqs = serviceData && serviceData.faqs && serviceData.faqs.length > 0 
    ? serviceData.faqs.map((faq: any, index: number) => ({
        id: `faq-${index}`,
        question: faq.question,
        answer: faq.answer
      }))
    : defaultFaqs;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Question</h2>
      <div className="space-y-4">
        {faqs.map((item: any) => {
          const isOpen = activeId === item.id;
          return (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => handleToggle(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-content`}
                className="w-full flex items-center gap-3 px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                tabIndex={0}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-gray-700 transition-colors ${
                    isOpen ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300"
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  )}
                </span>
                <span className="font-medium text-gray-800">{item.question}</span>
              </button>

              <div
                id={`${item.id}-content`}
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
