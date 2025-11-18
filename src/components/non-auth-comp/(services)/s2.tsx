"use client";

import { useMemo, useState } from "react";

type Slide = {
  id: string;
  quote: string;
  author: string;
  location: string;
};

const S2 = () => {
  const slides: Slide[] = useMemo(
    () => [
      {
        id: "1",
        quote:
          "I had purchased a flat in Bangalore. The builder had delayed possession from the committed date. I was paying a high EMI and rent which increased my monthly cash outflow and this left me with no money at the end of the month. I was very stressed and didn’t know what to do. I came across LegalKart and their Property Expert Lawyer advised me to send a legal notice to the Builder and also appeal to the RERA for the delayed possession. I got compensation from the builder for the delay and finally also got possession of my flat.",
        author: "B. Sivakumar",
        location: "Bangalore",
      },
      {
        id: "2",
        quote:
          "Dummy testimonial: We received timely guidance and clear documentation support. The overall process felt seamless and professional. Highly recommended for anyone looking to start fast with confidence.",
        author: "A. Sharma",
        location: "Mumbai",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        What our users have to say
      </h2>

      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-sm">
        <div
          className="flex w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full shrink-0 px-6 py-10 sm:px-10 sm:py-14">
              <div className="mx-auto max-w-3xl text-center">
                <p className="mt-4 text-lg leading-8 text-gray-700">{slide.quote}</p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 font-bold text-gray-800">
                    {slide.author.charAt(0)}
                  </div>
                  <p className="font-semibold text-gray-900">
                    {slide.author}, <span className="text-gray-600">{slide.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 pb-8 pt-2">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  currentIndex === index ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default S2;
