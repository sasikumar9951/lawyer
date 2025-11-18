"use client";

import Image from "next/image";
import { landing } from "@/lib/text/landing";

const Fourth = () => {
  const data = landing;
  const logos = [
    { id: 1, src: "/logo1.svg", alt: "Client Logo 1" },
    { id: 2, src: "/logo2.svg", alt: "Client Logo 2" },
    { id: 3, src: "/logo3.svg", alt: "Client Logo 3" },
    { id: 4, src: "/logo4.svg", alt: "Client Logo 4" },
    { id: 5, src: "/logo5.svg", alt: "Client Logo 5" },
  ];

  return (
    <section className="w-full bg-gray-900 py-10 overflow-hidden">
      {/* Responsive flex: row on large screens, column on small */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start">

        {/* Text section */}
        <div className="w-full lg:w-2/5 lg:pr-8 mb-6 lg:mb-0">
          <h2 className="text-3xl lg:text-4xl font-bold text-white font-['Lora'] leading-snug text-center lg:text-left">
            {(data.fourth.heading as string)
              .split("\n")
              .map((line: string, idx: number) => (
                idx === 0 ? (<span key={idx}>{line}</span>) : (<span key={idx}><br />{line}</span>)
              ))}
          </h2>
        </div>

        {/* Logo animation section */}
        <div className="w-full lg:w-3/5 relative h-14 overflow-hidden lg:top-5 ">
          {/* Fade gradients */}
          <div className="absolute top-0 left-0 w-1/6 h-full bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/6 h-full bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee container */}
          <div className="flex h-full animate-marquee items-center">
            {/* First track */}
            {logos.map((logo) => (
              <div
                key={`set1-${logo.id}`}
                className="flex-shrink-0 mx-6 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={90}
                  height={45}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
            {/* Second track */}
            {logos.map((logo) => (
              <div
                key={`set2-${logo.id}`}
                className="flex-shrink-0 mx-6 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={90}
                  height={45}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          width: max-content;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Fourth;
