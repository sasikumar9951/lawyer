"use client";

import Image from "next/image";

interface ServiceNavbarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onMobileMenuClose: () => void;
}

const ServiceNavbar = ({
  isMobileMenuOpen,
  onMobileMenuToggle,
  onMobileMenuClose,
}: ServiceNavbarProps) => {
  return (
    <>
      {/* Responsive Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-lg">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo - Left side */}
            <div className="flex items-center space-x-3">
              <a href="/" aria-label="Go to home">
                <img
                  src="/logo.svg"
                  alt="Vakilfy Logo"
                  className="w-[60px] h-[60px] sm:w-[60px] sm:h-[60px] lg:w-[60px] lg:h-[60px]"
                />
              </a>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-24 justify-between flex-1">
              {/* White Container with Navigation Links and Lawyer Register - Center */}
              <div className="rounded-full shadow-lg flex items-center flex-1 mx-8 px-2 bg-gray-100 py-2">
                {/* Navigation Links - Left side of white container */}
                <div className="flex items-center justify-between w-[65%] px-24">
                  <a
                    href="/"
                    className="text-gray-800 hover:text-gray-600 transition-colors font-bold font-['Lora']"
                  >
                    Home
                  </a>
                  <a
                    href="/contact"
                    className="text-gray-800 hover:text-gray-600 transition-colors font-bold font-['Lora']"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/services"
                    className="text-gray-800 hover:text-gray-600 transition-colors font-bold font-['Lora']"
                  >
                    Services
                  </a>
                </div>

                {/* Lawyer Register Button - Right side of white container */}
                <div className="flex items-center w-[35%] justify-center">
                  <button className="bg-black text-white px-8 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 font-bold font-['Lora'] flex items-center space-x-2">
                    <span>Lawyer Register</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </button>
                </div>
              </div>

              {/* Social Media Icons - Right side */}
              <div className="flex items-center space-x-3">
                <a
                  href="#"
                  className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button - Hamburger */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-gray-800"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "rotate-45 translate-y-1"
                      : "-translate-y-1"
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "-rotate-45 -translate-y-1"
                      : "translate-y-1"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onMobileMenuClose}
        ></div>

        {/* Sliding panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-black p-6 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button and logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Vakilfy Logo"
                width={32}
                height={32}
              />
              <span className="text-white text-lg font-semibold">Vakilfy</span>
            </div>
            <button
              onClick={onMobileMenuClose}
              className="text-white p-2 hover:text-gray-300 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-6">
            <a
              href="/"
              className="flex items-center justify-between text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={onMobileMenuClose}
            >
              <span>Home</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="/services"
              className="flex items-center justify-between text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={onMobileMenuClose}
            >
              <span>Services</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="/contact"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={onMobileMenuClose}
            >
              Contact Us
            </a>
          </div>

          {/* Lawyer Register Button for Mobile */}
          <div className="mt-8">
            <button className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors w-full">
              Lawyer Register
            </button>
          </div>

          {/* Social Media Section */}
          <div className="absolute bottom-8 left-6">
            <p className="text-white font-serif mb-4">We're On Social Media:</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceNavbar;
