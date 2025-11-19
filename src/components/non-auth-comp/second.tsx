"use client";

import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Facebook, Instagram, Linkedin, X as XIcon } from "lucide-react";
import { COMPANY_CONFIG } from "./company-config";
import { landing } from "@/lib/text/landing";
import { useRouter } from "next/navigation";

const Second = () => {
  const handleAboutClick = () => { };
  const router = useRouter();
  const handleBookConsultationClick = () => { router.push("/contact"); };
  const handleExploreServicesClick = () => { router.push("/services"); };
  const data = landing;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg2.webp"
          alt="Background"
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>

      <div className="mx-auto w-[1200px] max-w-[95%] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left textual content */}
          <div className="lg:col-span-5 text-black">
            <div className="flex items-center gap-3 text-cyan-600 font-semibold font-['Lora'] tracking-wide mb-4">
              <Image
                src="/icon.webp"
                width={28}
                height={28}
                alt="welcome icon"
              />
              <span className="text-3xl">{data.second.welcome}</span>
            </div>
            <h2 className="font-['Lora'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-6">
              {(data.second.whyTitle as string)
                .split("\n")
                .map((line: string, idx: number) =>
                  idx === 0 ? (
                    <span key={idx}>{line}</span>
                  ) : (
                    <span key={idx}>
                      <br />
                      {line}
                    </span>
                  )
                )}
            </h2>
            <p className="text-gray-700 leading-7 mb-8 max-w-2xl first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:pr-3 first-letter:leading-[0.8]">
              {data.second.whyText}
            </p>

            {/* <div className="flex items-start gap-4 mb-10">
              <div className="text-cyan-600 text-7xl lg:text-8xl leading-none select-none font-serif">
                “
              </div>
              <div>
                <p className="text-gray-800 font-medium">{data.second.quote}</p>
                <div className="mt-4 text-cyan-700 font-['Dancing_Script'] text-2xl">
                  {COMPANY_CONFIG.ceo.name}
                </div>
                <div className="text-gray-500 text-sm">
                  {COMPANY_CONFIG.ceo.title}
                </div>
              </div>
            </div> */}

            <InteractiveHoverButton
              onClick={handleAboutClick}
              className="!bg-white !border-black !text-black hover:!bg-black hover:!text-white hover:!border-black [&>div>div]:!bg-black [&>div:last-child]:!text-white"
            >
              About Us
            </InteractiveHoverButton>
          </div>

          {/* Right side - Vision/Mission/Value cards and Image */}
          <div className="lg:col-span-7 w-full mt-8 lg:mt-0">
            <div className="text-cyan-700 font-semibold font-['Lora'] tracking-wide mb-4 text-lg">
              We provide
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-0">
              {/* Cards column - Top on mobile, Left side on desktop */}
              <div className="w-full lg:w-1/2">
                {/* Trusted Online Consultation */}
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3l-3 4v-4H7a3 3 0 0 1-3-3V7Z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      Trusted Online Consultation
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      {
                        "Speak to our expert and verified experienced lawyers over a phone or video call before getting your documents drafted."
                      }
                    </p>
                  </div>
                </div>

                {/* End-to-End Services */}
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      End-to-End Services
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      {
                        "From drafting and reviewing to notarization and registration- Vakilfy takes care of everything."
                      }
                    </p>
                  </div>
                </div>

                {/* Transparency */}
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M12 5c-5 0-9 4-9 7s4 7 9 7 9-4 9-7-4-7-9-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      Transparency
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      {
                        "At Vakilfy, we ensure there is a clear pricing, multiple packages and no hidden costs."
                      }
                    </p>
                  </div>
                </div>
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 3a7 7 0 1 1-7 7 7.008 7.008 0 0 1 7-7Zm0 2.5a4.5 4.5 0 1 0 4.5 4.5A4.505 4.505 0 0 0 12 7.5Z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      Nationwide Access
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      {
                        "Whether you are in Mumbai, Delhi, Bangalore or a small town, Vakilfy brings legal expertise to your fingertips."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Image column - Bottom on mobile, Right side on desktop */}
              <div className="w-full lg:w-1/2 overflow-hidden shadow-2xl mt-4 lg:mt-0">
                <div className="relative h-full min-h-[400px] lg:min-h-[520px]">
                  <Image
                    src="/img4.webp"
                    alt="Lawyer portrait"
                    fill
                    className="object-cover grayscale"
                  />

                  {/* Contact panel at bottom */}
                  <div className="absolute left-0 bottom-0 w-[85%] bg-neutral-800/95 text-white px-6 py-5">
                    {/* Decorative notch */}
                    <div
                      className="absolute -top-8 left-0 w-40 h-10 bg-neutral-800/95"
                      style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
                    />
                    <div className="text-sm">
                      Tel:{" "}
                      <span className="font-semibold">{data.second.phone}</span>
                    </div>
                    <div className="text-sm">Email: {data.second.email}</div>
                    <div className="mt-3 text-xs tracking-wider">
                      {data.second.connect}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <Facebook className="w-4 h-4 text-white" />
                      </span>
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <XIcon className="w-4 h-4 text-white" />
                      </span>
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </span>
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <Linkedin className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>

                  {/* Cyan and purple accent squares */}
                  <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-cyan-500 rounded-sm" />
                  <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-purple-500 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons section */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <InteractiveHoverButton
              onClick={handleBookConsultationClick}
              className="!bg-cyan-400 !border-black !text-black hover:!bg-gradient-to-r hover:!from-yellow-400 hover:!to-amber-500 hover:!text-white hover:!border-black [&>div>div]:!bg-gradient-to-r [&>div>div]:!from-yellow-200 [&>div>div]:!to-amber-700 [&>div:last-child]:!text-white w-full sm:w-auto px-8 py-4 text-lg font-semibold"
            >
              {data.second.cta.book}
            </InteractiveHoverButton>

            <InteractiveHoverButton
              onClick={handleExploreServicesClick}
              className="!bg-cyan-400 !border-black !text-black hover:!bg-gradient-to-r hover:!from-yellow-400 hover:!to-amber-500 hover:!text-white hover:!border-black [&>div>div]:!bg-gradient-to-r [&>div>div]:!from-yellow-200 [&>div>div]:!to-amber-700 [&>div:last-child]:!text-white w-full sm:w-auto px-8 py-4 text-lg font-semibold"
            >
              {data.second.cta.explore}
            </InteractiveHoverButton>
          </div>

          {/* Random paragraph */}
          <div className="mt-12 max-w-4xl mx-auto">
            <p className="text-gray-800 font-['Lora'] leading-relaxed text-xl">
              {data.second.cta.paragraph}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Second;
