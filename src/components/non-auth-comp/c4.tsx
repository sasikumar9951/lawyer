"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const C4: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isRinging, setIsRinging] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    setEmail("");
    // Trigger bell animation
    setIsRinging(true);
    setTimeout(() => setIsRinging(false), 2000);
  };

  return (
    <footer className="w-full bg-[#1e1e1e] text-white py-16 font-[Lora] px-4 md:px-32">
      <div className="container mx-auto px-10 md:px-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-start font-[Lora] lg:col-span-1">
          <div className="mb-4">
            <img src="/logo.svg" alt="Vakilfy" className="h-16 w-auto" />
          </div>
          <p className="text-gray-400 mb-6">
            Create high-quality, style-consistent, proprietary assets for your
            games.
          </p>
        </div>

        {/* Download Links */}
        <div className="flex flex-col lg:col-span-1">
          <h3 className="text-xl font-semibold mb-6">Download:</h3>
          <div className="flex flex-col">
            <a href="#" className="flex items-center transition-colors">
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="relative h-12 w-auto object-contain left-[-9]"
              />
            </a>
            <a href="#" className="flex items-center transition-colors">
              <img
                src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="relative h-9 w-auto object-contain"
              />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col lg:col-span-1">
          <h3 className="text-xl font-semibold mb-6">Links:</h3>
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Careers
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Blog
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col font-[Lora] lg:col-span-1">
          <div className="flex items-center mb-6">
            <motion.div
              className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-2 mr-4 shadow-lg"
              animate={{
                rotate: isRinging ? [0, 15, -15, 10, -10, 5, -5, 0] : 0,
                scale: isRinging ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.6,
                repeat: isRinging ? 3 : 0,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300/50 to-amber-500/50 rounded-lg blur-sm"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white relative z-10"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold">
              Sign Up For Our Newsletter
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-row w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="bg-[#333] text-white px-4 py-3 rounded-l outline-none flex-grow min-w-0"
              required
            />
            <button
              type="submit"
              className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-4 py-3 rounded-r transition-colors flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
          <div className="mt-4 flex items-center">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the Terms, Privacy Policy.
            </label>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-10 md:px-16 mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center font-[Lora]">
        <p className="text-gray-500 text-sm">© 2025 design by Vakilfy</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-gray-500 hover:text-white text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-white text-sm">
            Term of Use
          </a>
        </div>
      </div>
    </footer>
  );
};

export default C4;
