"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landing } from "@/lib/text/landing";

const First = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const handleFeatureClick = (index: number) => {
    if (index !== activeFeature) {
      setActiveFeature(index);
      setAnimationKey((prev) => prev + 1);
    }
  };

  const features = landing.first.features; 

  // Auto-rotate features every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
      setAnimationKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="relative h-[780px] flex items-center overflow-hidden">
      {/* Static Navy Blue Background */}
      <div className="absolute inset-0 z-0 bg-[#435469]" />

      {/* Image with circular reveal animation */}
      <motion.div
        key={animationKey}
        className="absolute inset-0 z-0"
        initial={{
          clipPath: "circle(15% at 65% 50%)",
        }}
        animate={{
          clipPath: "circle(55% at 65% 50%)",
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      >
        <Image
          src={features[activeFeature].image}
          alt="Legal office background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-10 lg:px-40 h-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center h-full py-16">
          {/* Left Side */}
          <div className="text-white space-y-8 lg:col-span-8">
            <motion.div
              key={animationKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold leading-tight whitespace-pre-line font-serif">
                {features[activeFeature].heading}
              </h1>
            </motion.div>

            <motion.p
              key={animationKey + 1}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg lg:text-xl text-gray-300 max-w-lg leading-relaxed font-serif"
            >
              {features[activeFeature].description}
            </motion.p>

            {/* Bullet points with loading circle */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => handleFeatureClick(index)}
                  className={`flex items-center space-x-4 cursor-pointer transition-all duration-300 ${activeFeature === index
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                    }`}
                >
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    {/* White dot */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeFeature === index ? "bg-white" : "bg-gray-400"
                        }`}
                    />

                    {/* Animated loading ring */}
                    {activeFeature === index && (
                      <motion.svg
                        key={animationKey}
                        className="absolute w-8 h-8 origin-center -rotate-90"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <motion.circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="88"
                          strokeDashoffset="88"
                          animate={{ strokeDashoffset: 0 }}
                          transition={{
                            duration: 5,
                            ease: "linear",
                          }}
                        />
                      </motion.svg>
                    )}
                  </div>
                  <span
                    className={`text-lg font-medium transition-all duration-300 font-serif ${activeFeature === index ? "text-white" : "text-gray-400"
                      }`}
                  >
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center lg:justify-end items-center lg:col-span-4">
            <motion.a
              aria-label="Call us at +91 8979096507"
              className="relative inline-block group focus:outline-none w-1/2 max-w-xl min-w-[280px]"
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400/90"
                variants={{
                  rest: { x: 10, opacity: 1 },
                  hover: {
                    x: 0,
                    opacity: 0,
                    transition: { duration: 0.35, ease: "easeInOut" },
                  },
                }}
              />

              <div className="relative z-10 bg-violet-600 rounded-full pl-20 pr-8 py-5 shadow-xl">
                <p className="text-white font-bold text-3xl leading-none font-serif">
                  {landing.first.call.label}
                </p>
                <p className="text-white/90 text-lg leading-tight font-serif">
                  {landing.first.call.phone}
                </p>
              </div>

              <motion.div
                className="absolute -left-7 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-xl flex items-center justify-center z-30"
                variants={{
                  rest: { rotate: 0 },
                  hover: {
                    rotate: [0, -15, 15, -10, 10, 0],
                    transition: { duration: 0.8, repeat: Infinity },
                  },
                }}
              >
                <svg
                  className="w-7 h-7 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </motion.div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default First;