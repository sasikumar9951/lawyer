"use client";

import Image from "next/image";

interface TenthProps {
  companyName?: string;
  companyDescription?: string;
  contactInfo?: {
    address: string[];
    phone: string;
    email: string;
  };
  copyrightText?: string;
}

const Tenth: React.FC<TenthProps> = ({
  companyName = "Vakilfy",
  companyDescription = "Vakilfy offers online consultation and legal drafting services that are fast, reliable, and affordable. Let experts handle your paperwork while you focus on what matters most.",
  contactInfo = {
    address: [],
    phone: "+91 8979096507",
    email: "hello@vakilfy.com",
  },
  copyrightText = "©️ 2025 developd by 3RP-Technetium",
}) => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* LEFT — LOGO + DESCRIPTION */}
          <div>
            <div className="flex items-center mb-6">
              <Image
                src="/tick.png"
                width={60}
                height={60}
                alt={`${companyName} Logo`}
              />
              <span className="text-2xl font-bold font-['Lora'] ml-2">
                {companyName}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold font-['Lora']">
              Your Trusted Lawyer. Just one Click Away.
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-2 font-['Lora'] max-w-sm">
              {companyDescription}
            </p>
          </div>

          {/* MIDDLE — CONTACT */}
          <div>
            <h3 className="text-lg font-bold font-['Lora'] mb-6 text-white">
              Contact:
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="text-gray-400 text-sm">
                  {contactInfo.email}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span className="text-gray-400 text-sm">
                  {contactInfo.phone}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold font-['Lora'] mb-6 text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              <a
                href="/about"
                className="text-gray-400 text-sm hover:text-amber-400 transition"
              >
                About Us
              </a>
              <a
                href="/contact"
                className="text-gray-400 text-sm hover:text-amber-400 transition"
              >
                Contact Us
              </a>
              <a
                href="/privacy"
                className="text-gray-400 text-sm hover:text-amber-400 transition"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 text-sm hover:text-amber-400 transition"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-gray-400 text-sm">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Tenth;
