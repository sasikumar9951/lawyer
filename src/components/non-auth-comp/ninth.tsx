"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { COMPANY_CONFIG } from "./company-config";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { landing } from "@/lib/text/landing";

const Ninth = () => {
  const data = landing;
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleGoToContact = () => {
    router.push("/contact");
  };

  const handleGoToLawyerRegistration = () => {
    router.push("/lawyer-registration");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollTop = -rect.top;
      const scrollRange = rect.height - windowHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollRange));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const zoomFactor = 10; // Slow zoom
  const zoomScale = 1 + (scrollProgress / zoomFactor) * 650;

  const foregroundOpacity =
    scrollProgress < 0.98 ? 1 : 1 - (scrollProgress - 0.98) * 50;
  const gridOpacity = scrollProgress > 0.3 ? (scrollProgress - 0.3) * 1.43 : 0;

  // Helper function to calculate animation progress based on scroll
  const getAnimationProgress = (startPoint: number, endPoint: number) => {
    if (scrollProgress < startPoint) return 0;
    if (scrollProgress > endPoint) return 1;
    return (scrollProgress - startPoint) / (endPoint - startPoint);
  };

  // Animation progress for different elements - much longer scroll ranges
  const gridProgress = getAnimationProgress(0.3, 0.5);
  const spacingProgress = getAnimationProgress(0.35, 0.55);
  const mainGridProgress = getAnimationProgress(0.4, 0.65);
  const justiceProgress = getAnimationProgress(0.5, 0.7);
  const contactProgress = getAnimationProgress(0.55, 0.8);
  const addressProgress = getAnimationProgress(0.55, 0.8);
  const bottomSpacingProgress = getAnimationProgress(0.7, 0.9);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full -top-1 -left-1 -right-1 -bottom-1">
          <Image
            src="/fimg.webp"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
            style={{
              transform: "scale(1.1)",
              objectFit: "cover",
              objectPosition: "center center"
            }}
          />
        </div>

        {/* Foreground zooming image */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: "center 52%",
            opacity: foregroundOpacity,
          }}
        >
          <Image
            src="/last.webp"
            alt="Zoom Effect"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Grid Overlay with Scroll-based Animation */}
        {gridOpacity > 0 && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ opacity: gridProgress }}
          >
            {/* Desktop Grid */}
            <div
              className="hidden md:grid w-full h-full grid-cols-5"
              style={{ gridTemplateRows: "0.2fr 1fr 1fr 0.2fr" }}
            >
              {/* Top spacing row */}
              {Array.from({ length: 5 }, (_, colIndex) => {
                const cellProgress = getAnimationProgress(
                  0.35 + colIndex * 0.02,
                  0.55 + colIndex * 0.02
                );
                return (
                  <div
                    key={`spacing-top-${colIndex}`}
                    className="relative border border-white/20"
                    style={{
                      opacity: cellProgress,
                      transform: `translateY(${-20 * (1 - cellProgress)}px)`,
                    }}
                  ></div>
                );
              })}

              {/* Main 2x5 grid */}
              {Array.from({ length: 10 }, (_, index) => {
                const rowIndex = Math.floor(index / 5);
                const colIndex = index % 5;
                const cellProgress = getAnimationProgress(
                  0.4 + rowIndex * 0.05 + colIndex * 0.02,
                  0.65 + rowIndex * 0.05 + colIndex * 0.02
                );

                const isBlurredCell =
                  (rowIndex === 0 && colIndex === 2) || // 1-3
                  (rowIndex === 1 && colIndex === 1) || // 2-2
                  (rowIndex === 1 && colIndex === 3); // 2-4

                return (
                  <div
                    key={index}
                    className="relative border border-white/20"
                    style={{
                      opacity: cellProgress,
                      transform: `scale(${0.8 + 0.2 * cellProgress
                        }) translateY(${20 * (1 - cellProgress)}px)`,
                    }}
                  >
                    {/* Blur effect only appears when gridOpacity > 0 */}
                    {isBlurredCell && (
                      <div className="absolute inset-0 backdrop-blur-md bg-transparent z-0"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      {/* Justice image for 1-3 cell */}
                      {rowIndex === 0 && colIndex === 2 ? (
                        <div
                          className="absolute inset-0 mr-10 overflow-hidden mt-9"
                          style={{
                            opacity: justiceProgress,
                            transform: `scale(${0.69 + 0.69 * justiceProgress})`,
                          }}
                        >
                          <Image
                            src="/new-bg.png"
                            alt="Justice"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : /* Contact info for 2-2 cell */
                        rowIndex === 1 && colIndex === 1 ? (
                          <div
                            className="text-white p-4 text-left w-full"
                            style={{
                              opacity: contactProgress,
                              transform: `translateX(${-30 * (1 - contactProgress)}px)`,
                            }}
                          >
                            <h3
                              className="text-xl font-bold font-['Lora'] mb-4 text-white"
                              style={{
                                opacity: getAnimationProgress(0.6, 0.7),
                                transform: `translateY(${10 * (1 - getAnimationProgress(0.6, 0.7))}px)`,
                              }}
                            >
                              {data.ninth.labels.contactInfo}
                            </h3>
                            <h4
                              className="text-2xl font-bold font-['Lora'] mb-4 text-white"
                              style={{
                                opacity: getAnimationProgress(0.65, 0.75),
                                transform: `translateY(${10 * (1 - getAnimationProgress(0.65, 0.75))}px)`,
                              }}
                            >
                              {data.ninth.labels.reachUs}
                            </h4>
                            <div
                              className="h-px bg-white mb-4"
                              style={{
                                width: `${64 * getAnimationProgress(0.7, 0.8)}px`,
                              }}
                            ></div>
                            <div
                              className="space-y-2 text-base"
                              style={{
                                opacity: getAnimationProgress(0.75, 0.85),
                                transform: `translateY(${10 * (1 - getAnimationProgress(0.75, 0.85))}px)`,
                              }}
                            >
                              <p>
                                <span className="text-gray-300">{data.ninth.labels.tel}</span> +91
                                8979096507
                              </p>
                              <p>
                                <span className="text-gray-300">{data.ninth.labels.email}</span>{" "}
                                info@vakilfy.com
                              </p>
                            </div>
                          </div>
                        ) : /* Contact Us button for 2-3 cell */
                          rowIndex === 1 && colIndex === 2 ? (
                            <div
                              className="text-white p-4 text-center w-full flex items-center justify-center"
                              style={{
                                opacity: contactProgress,
                                transform: `translateY(${-20 * (1 - contactProgress)}px)`,
                              }}
                            >
                              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                                <InteractiveHoverButton
                                  onClick={handleGoToLawyerRegistration}
                                  aria-label="Register Lawyer"
                                  className="!bg-transparent !text-white border border-white hover:!bg-white hover:!text-black [&>div>div]:!bg-white/0 [&>div:last-child]:!text-black"
                                >
                                  <span className="flex items-center justify-center gap-2">{data.ninth.buttons.register}</span>
                                </InteractiveHoverButton>
                                <InteractiveHoverButton
                                  onClick={handleGoToContact}
                                  aria-label="Book your online consultation now"
                                  className="!bg-cyan-400 !text-black hover:!bg-black hover:!text-cyan-400 [&>div>div]:!bg-black [&>div:last-child]:!text-cyan-400"
                                >
                                  <span className="flex flex-col items-center leading-tight">
                                    <span>{data.ninth.buttons.bookLine1}</span>
                                    <span>{data.ninth.buttons.bookLine2}</span>
                                  </span>
                                </InteractiveHoverButton>
                              </div>
                            </div>
                          ) : /* Address info for 2-4 cell */
                            rowIndex === 1 && colIndex === 3 ? (
                              <div
                                className="text-white p-4 text-left w-full"
                                style={{
                                  opacity: addressProgress,
                                  transform: `translateX(${30 * (1 - addressProgress)}px)`,
                                }}
                              >
                                <h3
                                  className="text-xl font-bold font-['Lora'] mb-4 text-white"
                                  style={{
                                    opacity: getAnimationProgress(0.6, 0.7),
                                    transform: `translateY(${10 * (1 - getAnimationProgress(0.6, 0.7))}px)`,
                                  }}
                                >
                                  {data.ninth.labels.contactInfo}
                                </h3>
                                <h4
                                  className="text-2xl font-bold font-['Lora'] mb-4 text-white"
                                  style={{
                                    opacity: getAnimationProgress(0.65, 0.75),
                                    transform: `translateY(${10 * (1 - getAnimationProgress(0.65, 0.75))}px)`,
                                  }}
                                >
                                  {data.ninth.labels.address}
                                </h4>
                                <div
                                  className="h-px bg-white mb-4"
                                  style={{
                                    width: `${64 * getAnimationProgress(0.7, 0.8)}px`,
                                  }}
                                ></div>
                                <div
                                  className="space-y-2 text-base"
                                  style={{
                                    opacity: getAnimationProgress(0.75, 0.85),
                                    transform: `translateY(${10 * (1 - getAnimationProgress(0.75, 0.85))}px)`,
                                  }}
                                >
                                  {COMPANY_CONFIG.contact.address.map((line, idx) => (
                                    <p key={`addr-top-${idx}`}>{line}</p>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                    </div>
                  </div>
                );
              })}

              {/* Bottom spacing row */}
              {Array.from({ length: 5 }, (_, colIndex) => {
                const cellProgress = getAnimationProgress(
                  0.7 + colIndex * 0.02,
                  0.9 + colIndex * 0.02
                );
                return (
                  <div
                    key={`spacing-bottom-${colIndex}`}
                    className="relative border border-white/20"
                    style={{
                      opacity: cellProgress,
                      transform: `translateY(${20 * (1 - cellProgress)}px)`,
                    }}
                  ></div>
                );
              })}
            </div>

            {/* Mobile Grid - Single Column (4 rows) */}
            <div
              className="md:hidden w-full h-full grid grid-cols-1"
              style={{ gridTemplateRows: "1fr 1fr 1fr 1fr" }}
            >

              {/* Justice Image Row */}
              <div
                className="relative border border-white/20 backdrop-blur-md"
                style={{
                  opacity: mainGridProgress,
                  transform: `scale(${0.8 + 0.2 * mainGridProgress
                    }) translateY(${20 * (1 - mainGridProgress)}px)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className="absolute inset-0 p-4 mr-10 mt-6 overflow-hidden"
                    style={{
                      opacity: justiceProgress,
                      transform: `scale(${0.8 + 0.8 * justiceProgress})`,
                    }}
                  >
                    <Image
                      src="/new-bg.png"
                      alt="Justice"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Row (2-2 content) */}
              <div
                className="relative border border-white/20 backdrop-blur-md"
                style={{
                  opacity: mainGridProgress,
                  transform: `scale(${0.8 + 0.2 * mainGridProgress
                    }) translateY(${20 * (1 - mainGridProgress)}px)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className="text-white p-4 text-center w-full"
                    style={{
                      opacity: contactProgress,
                      transform: `translateY(${-20 * (1 - contactProgress)}px)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold font-['Lora'] mb-3 text-white"
                      style={{
                        opacity: getAnimationProgress(0.6, 0.7),
                        transform: `translateY(${10 * (1 - getAnimationProgress(0.6, 0.7))
                          }px)`,
                      }}
                    >
                      CONTACT INFO
                    </h3>
                    <h4
                      className="text-xl font-bold font-['Lora'] mb-3 text-white"
                      style={{
                        opacity: getAnimationProgress(0.65, 0.75),
                        transform: `translateY(${10 * (1 - getAnimationProgress(0.65, 0.75))
                          }px)`,
                      }}
                    >
                      REACH US
                    </h4>
                    <div
                      className="h-px bg-white mx-auto mb-3"
                      style={{
                        width: `${64 * getAnimationProgress(0.7, 0.8)}px`,
                      }}
                    ></div>
                    <div
                      className="space-y-1 text-sm"
                      style={{
                        opacity: getAnimationProgress(0.75, 0.85),
                        transform: `translateY(${10 * (1 - getAnimationProgress(0.75, 0.85))
                          }px)`,
                      }}
                    >
                      <p>
                        <span className="text-gray-300">Tel:</span> +91
                        8979096507
                      </p>
                      <p>
                        <span className="text-gray-300">Email:</span>{" "}
                        info@vakilfy.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Info Row (2-4 content) */}
              <div
                className="relative border border-white/20 backdrop-blur-md"
                style={{
                  opacity: mainGridProgress,
                  transform: `scale(${0.8 + 0.2 * mainGridProgress
                    }) translateY(${20 * (1 - mainGridProgress)}px)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className="text-white p-4 text-center w-full"
                    style={{
                      opacity: addressProgress,
                      transform: `translateY(${20 * (1 - addressProgress)}px)`,
                    }}
                  >
                    <h3
                      className="text-lg font-bold font-['Lora'] text-white"
                      style={{
                        opacity: getAnimationProgress(0.6, 0.7),
                        transform: `translateY(${10 * (1 - getAnimationProgress(0.6, 0.7))
                          }px)`,
                      }}
                    >
                      CONTACT INFO
                    </h3>
                    <h4
                      className="text-xl font-bold font-['Lora'] text-white"
                      style={{
                        opacity: getAnimationProgress(0.65, 0.75),
                        transform: `translateY(${10 * (1 - getAnimationProgress(0.65, 0.75))
                          }px)`,
                      }}
                    >
                      ADDRESS
                    </h4>
                    <div
                      className="h-px bg-white mx-auto mb-3"
                      style={{
                        width: `${64 * getAnimationProgress(0.7, 0.8)}px`,
                      }}
                    ></div>
                    <div
                      className="space-y-1 text-sm"
                      style={{
                        opacity: getAnimationProgress(0.75, 0.85),
                        transform: `translateY(${10 * (1 - getAnimationProgress(0.75, 0.85))
                          }px)`,
                      }}
                    >
                      {COMPANY_CONFIG.contact.address.map((line, idx) => (
                        <p key={`addr-bottom-${idx}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons Row */}
              <div
                className="relative border border-white/20 backdrop-blur-md"
                style={{
                  opacity: mainGridProgress,
                  transform: `scale(${0.8 + 0.2 * mainGridProgress
                    }) translateY(${20 * (1 - mainGridProgress)}px)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className="text-white p-4 text-center w-full flex items-center justify-center"
                    style={{
                      opacity: contactProgress,
                      transform: `translateY(${-20 * (1 - contactProgress)}px)`,
                    }}
                  >
                    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                      <InteractiveHoverButton
                        onClick={handleGoToLawyerRegistration}
                        aria-label="Register Lawyer"
                        className="!bg-transparent !text-white border border-white hover:!bg-white hover:!text-black [&>div>div]:!bg-white/0 [&>div:last-child]:!text-black"
                      >
                                  <span className="flex items-center justify-center gap-2">{data.ninth.buttons.register}</span>
                      </InteractiveHoverButton>
                      <InteractiveHoverButton
                        onClick={handleGoToContact}
                        aria-label="Book your online consultation now"
                        className="!bg-cyan-400 !text-black hover:!bg-black hover:!text-cyan-400 [&>div>div]:!bg-black [&>div:last-child]:!text-cyan-400"
                      >
                        <span className="flex flex-col items-center leading-tight">
                          <span>{data.ninth.buttons.bookLine1}</span>
                          <span>{data.ninth.buttons.bookLine2}</span>
                        </span>
                      </InteractiveHoverButton>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Ninth;