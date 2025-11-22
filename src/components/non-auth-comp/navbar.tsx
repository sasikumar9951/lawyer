"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<
    string[]
  >([]);
  const closeDropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const fetchData = async () => {
    try {
      const response = await fetch("/api/navbar");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.categories);
        setServices(data.data.services);
      }
    } catch (error) {
      console.error("Error fetching navbar data:", error);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileCategories([]);
  };

  const handleMobileCategoryToggle = (categoryName: string) => {
    setExpandedMobileCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleServicesDropdownEnter = () => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
      closeDropdownTimeoutRef.current = null;
    }
    setIsServicesDropdownOpen(true);
  };

  const handleServicesDropdownLeave = () => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  const handleCategoryEnter = (categoryName: string) => {
    setHoveredCategory(categoryName);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const getServicesForCategory = (categoryName: string) => {
    return services.filter((service) => service.categoryName === categoryName);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);

      if (scrollTop > lastScrollY && scrollTop > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (closeDropdownTimeoutRef.current) {
        clearTimeout(closeDropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .submenu-animate {
          animation: slideInFromTop 0.3s ease-out;
        }
      `}</style>

      {/* Sticky Navbar */}
      <nav
        data-navbar="true"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? "bg-white shadow-lg" : "bg-transparent"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="w-full max-w-7xl mx-auto px-4">
          <div
            className={`flex items-center gap-6 justify-between transition-all duration-300 ${
              isScrolled ? "py-1" : "py-4"
            }`}
          >
            {/* Logo - Left side */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" aria-label="Go to home">
                <Image
                  src="/bgg.png"
                  alt="Vakilfy Logo"
                  width={180}
                  height={180}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex w-full">
              {/* CENTER — WHITE CAPSULE MENU */}
              <div
                className={`flex items-center bg-white shadow-lg rounded-full 
    px-8 gap-6 
    ${isScrolled ? "py-2" : "py-3"} 
    w-[1100px] ml-24`}
              >
                <span className="w-6 h-[2px] bg-gray-300"></span>

                {/* Home */}
                <Link
                  href="/"
                  className="font-bold text-gray-800 hover:text-cyan-500 font-['Lora']"
                >
                  Home
                </Link>

                <span className="text-gray-400">—</span>

                {/* Dynamic Categories */}
                {categories.map((category, index) => {
                  const categoryServices = services.filter(
                    (s) => s.categoryName === category.name
                  );

                  return (
                    <div
                      key={category.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <button className="flex items-center font-bold text-gray-800 hover:text-cyan-500 font-['Lora'] whitespace-nowrap">
                        {category.name}
                        {categoryServices.length > 0 && (
                          <svg
                            className={`w-3 h-3 ml-1 transition-transform duration-300 ${
                              hoveredCategory === category.name
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.25 7.293l4.75 4.75 4.75-4.75" />
                          </svg>
                        )}
                      </button>

                      {/* Dropdown - if category has subCategories render grouped menu */}
                      {hoveredCategory === category.name && categoryServices.length > 0 && (
                        <div className="absolute top-full left-0 bg-white border border-cyan-500 rounded-lg shadow-lg w-[520px] py-4 z-50 submenu-animate">
                          <div className="max-h-72 overflow-auto px-4">
                            {category.subCategories && category.subCategories.length > 0 ? (
                              <div className="grid grid-cols-2 gap-4">
                                {category.subCategories.map((sub: any) => (
                                  <div key={sub.id} className="min-w-0">
                                    <div className="text-sm font-semibold text-cyan-700 mb-2">{sub.name}</div>
                                    <div className="space-y-1">
                                      {categoryServices
                                        .filter((s) => s.subCategoryId === sub.id)
                                        .map((service) => (
                                          <Link
                                            key={service.id}
                                            href={`/services/${service.categorySlug}/${service.slug}`}
                                            className="block px-2 py-1 text-gray-800 hover:text-cyan-500"
                                          >
                                            {service.name}
                                          </Link>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {categoryServices.map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.categorySlug}/${service.slug}`}
                                    className="block px-4 py-2 text-gray-800 hover:text-cyan-500 font-['Lora']"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* SEPARATOR */}
                <span className="text-gray-400">—</span>

                {/* QUICK CONSULT — NOW INSIDE CAPSULE */}
                <Link
                  href="/lawyer-registration"
                  className="bg-black text-white px-6 py-2 rounded-full font-bold font-['Lora'] hover:bg-gray-800 flex items-center gap-2 whitespace-nowrap"
                >
                  Quick Consult
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </Link>
                <span className="w-6 h-[2px] bg-gray-300"></span>
              </div>
            </div>

            {/* Mobile Menu Button - Hamburger */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 text-gray-800"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`w-5 h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-cyan-500" : "bg-gray-800"
                  } ${
                    isMobileMenuOpen
                      ? "rotate-45 translate-y-1"
                      : "-translate-y-1"
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-cyan-500" : "bg-gray-800"
                  } ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`w-5 h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-cyan-500" : "bg-gray-800"
                  } ${
                    isMobileMenuOpen
                      ? "-rotate-45 -translate-y-1"
                      : "translate-y-1"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Always mounted for slide animation */}
      <div
        className={`fixed inset-0 z-60 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Sliding panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-black p-6 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Image
                src="/tick.png"
                alt="Vakilfy Logo"
                width={32}
                height={32}
              />
              <span className="text-white text-lg font-semibold">Vakilfy</span>
            </div>
            {/* Close Button */}
            <button
              onClick={handleMobileMenuClose}
              className="text-white hover:text-cyan-400 transition-colors p-2"
              aria-label="Close mobile menu"
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
            <Link
              href="/"
              className="flex items-center justify-between text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={handleMobileMenuClose}
            >
              <span>Home</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            {/* Mobile Services with Categories */}
            {categories.length > 0 && (
              <div className="space-y-4 ml-2">
                {categories.map((category) => {
                  const isExpanded = expandedMobileCategories.includes(
                    category.name
                  );
                  const categoryServices = services.filter(
                    (s) => s.categoryName === category.name
                  );

                  return (
                    <div key={category.id} className="space-y-2">
                      {/* Category Header */}
                      <div className="flex items-center justify-between text-gray-300 hover:text-cyan-300 transition-colors font-medium cursor-pointer">
                        <span>{category.name}</span>

                        {/* Arrow Icon (This toggles dropdown) */}
                        <button
                          onClick={() =>
                            handleMobileCategoryToggle(category.name)
                          }
                          className="text-gray-300 hover:text-cyan-300"
                        >
                          <svg
                            className={`w-4 h-4 transform transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Sub-category List */}
                      {isExpanded && (
                        <div className="ml-4 border-l border-gray-700 pl-4 space-y-2">
                          {categoryServices.map((service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.categorySlug}/${service.slug}`}
                              className="block text-gray-400 hover:text-cyan-300"
                              onClick={handleMobileMenuClose}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lawyer Register Button for Mobile */}
          <div className="mt-8">
            <Link
              href="/lawyer-registration"
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors w-full"
              onClick={handleMobileMenuClose}
            >
              Quick Consult
            </Link>
          </div>

          {/* Social Media Section */}
          {/* <div className="absolute bottom-8 left-6">
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Navbar;