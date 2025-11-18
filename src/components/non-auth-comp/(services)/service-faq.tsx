"use client";

import { ApiServiceFAQ } from "@/types/api/services";
import { useState } from "react";

interface ServiceFAQProps {
  faqs: ApiServiceFAQ[];
}

const ServiceFAQ = ({ faqs }: ServiceFAQProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => handleFaqToggle(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              aria-expanded={openFaq === index}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <span className="font-semibold text-gray-800">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openFaq === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id={`faq-answer-${faq.id}`}
              className={`px-6 pb-4 transition-all duration-300 ${
                openFaq === index ? "block" : "hidden"
              }`}
            >
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceFAQ;
