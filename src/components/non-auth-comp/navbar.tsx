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
            className={`flex items-center gap-24 justify-between transition-all duration-300 ${
              isScrolled ? "py-1" : "py-4"
            }`}
          >
            {/* Logo - Left side */}
            <div className="flex items-center space-x-3">
              <Link href="/" aria-label="Go to home">
                <Image
                  src="/bgg.png"
                  alt="Vakilfy Logo"
                  width={180}
                  height={180}
                />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-24 justify-between flex-1">
              {/* White Container with Navigation Links and Lawyer Register - Center (takes remaining space) */}
              <div
                className={`rounded-full shadow-lg flex items-center flex-1 mx-8 px-2 transition-all duration-300 ${
                  isScrolled ? "bg-gray-100 py-2" : "bg-white py-3"
                }`}
              >
                {/* Navigation Links - Left side of white container (70% width) */}
                <div className="flex items-center justify-between w-[70%] px-8 xl:px-12 2xl:px-16">
                  {/* Home */}
                  <div className="relative group">
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-gray-300 group-hover:bg-cyan-500 transition-all duration-300 mr-2 overflow-hidden">
                        <div className="w-full h-full bg-cyan-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                      <Link
                        href="/"
                        className="text-gray-800 group-hover:text-cyan-500 transition-all duration-300 font-bold font-['Lora'] whitespace-nowrap"
                      >
                        Home
                      </Link>
                    </div>
                  </div>

                  {/* Services with Dropdown */}
                  <div
                    className="relative group"
                    onMouseEnter={handleServicesDropdownEnter}
                    onMouseLeave={handleServicesDropdownLeave}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-gray-300 group-hover:bg-cyan-500 transition-all duration-300 mr-2 overflow-hidden">
                        <div className="w-full h-full bg-cyan-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                      <Link href="/services" className="cursor-pointer text-gray-800 group-hover:text-cyan-500 transition-all duration-300 font-bold font-['Lora'] whitespace-nowrap flex items-center space-x-1" aria-label="Go to services">
                        <span>Services</span>
                        {categories.length > 0 && (
                          <svg
                            className={`w-3 h-3 transition-transform duration-300 ${
                              isServicesDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </Link>
                    </div>

                    {/* Transparent bridge to prevent hover loss */}
                    {isServicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-full h-6 bg-transparent"></div>
                    )}

                    {/* Services Dropdown */}
                    {isServicesDropdownOpen && categories.length > 0 && (
                      <div
                        className="absolute top-full left-0 w-64 bg-white border border-cyan-500 rounded-lg shadow-lg z-50"
                        onMouseEnter={handleServicesDropdownEnter}
                        onMouseLeave={handleServicesDropdownLeave}
                      >
                        <div className="py-2">
                          {categories.map((category) => {
                              const categoryServices = getServicesForCategory(
                                category.name
                              );
                              const hasServices = categoryServices.length > 0;

                              return (
                                <div
                                  key={category.id}
                                  className="relative"
                                  onMouseEnter={() =>
                                    handleCategoryEnter(category.name)
                                  }
                                  onMouseLeave={handleCategoryLeave}
                                >
                                  <div className="flex items-center px-4 py-2 text-gray-800 transition-colors group/item cursor-pointer">
                                    <div className="w-3 h-0.5 bg-gray-300 mr-3 overflow-hidden group-hover/item:bg-cyan-500 transition-all duration-300">
                                      <div className="w-full h-full bg-cyan-500 transform origin-left scale-x-0 group-hover/item:scale-x-110 transition-transform duration-300"></div>
                                    </div>
                                    <Link
                                      href={`/services/${category.slug}`}
                                      className="group-hover/item:text-cyan-500 transition-colors duration-300 font-['Lora'] font-bold flex-1"
                                      onClick={() =>
                                        setIsServicesDropdownOpen(false)
                                      }
                                    >
                                      {category.name}
                                    </Link>
                                    {hasServices && (
                                      <svg
                                        className="w-3 h-3 transition-transform duration-300 group-hover/item:rotate-90"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}

                                    {/* Services Submenu */}
                                    {hoveredCategory === category.name &&
                                      hasServices && (
                                        <div
                                          className="absolute left-full top-0 w-64 bg-white border border-cyan-500 rounded-lg shadow-lg z-50 overflow-hidden"
                                          onMouseEnter={() =>
                                            handleCategoryEnter(category.name)
                                          }
                                          onMouseLeave={handleCategoryLeave}
                                        >
                                          <div className="py-2 submenu-animate">
                                            {categoryServices.map((service) => (
                                              <Link
                                                key={service.id}
                                                href={`/services/${service.categorySlug}/${service.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center px-4 py-2 text-gray-800 transition-colors group/subitem cursor-pointer"
                                                onClick={() =>
                                                  setIsServicesDropdownOpen(
                                                    false
                                                  )
                                                }
                                              >
                                                <div className="w-3 h-0.5 bg-gray-300 mr-3 overflow-hidden group-hover/subitem:bg-cyan-500 transition-all duration-300">
                                                  <div className="w-full h-full bg-cyan-500 transform origin-left scale-x-0 group-hover/subitem:scale-x-110 transition-transform duration-300"></div>
                                                </div>
                                                <span className="group-hover/subitem:text-cyan-500 transition-colors duration-300 font-['Lora'] font-bold">
                                                  {service.name}
                                                </span>
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Us */}
                  <div className="relative group">
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-gray-300 group-hover:bg-cyan-500 transition-all duration-300 mr-2 overflow-hidden">
                        <div className="w-full h-full bg-cyan-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                      <Link
                        href="/contact"
                        className="text-gray-800 group-hover:text-cyan-500 transition-all duration-300 font-bold font-['Lora'] whitespace-nowrap"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Lawyer Register Button with green dot - Right side of white container (30% width) */}
                <div className="flex items-center w-[30%] justify-center">
                  <Link
                    className={`bg-black text-white px-8 rounded-full hover:bg-gray-800 transition-all duration-300 font-bold font-['Lora'] flex items-center space-x-2 ${
                      isScrolled ? "py-2" : "py-3"
                    }`}
                    href="/lawyer-registration"
                  >
                    <span>Lawyer Register</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </Link>
                </div>
              </div>

              {/* Social Media Icons - Right side */}
              {/* <div className="flex items-center space-x-3">
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
              </div> */}
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
              <div className="space-y-4">
                <div className="text-cyan-400 font-semibold">Services</div>
                <div className="space-y-3 ml-4">
                  {categories.map((category) => {
                    const categoryServices = getServicesForCategory(
                      category.name
                    );
                    const hasServices = categoryServices.length > 0;
                    const isExpanded = expandedMobileCategories.includes(
                      category.name
                    );

                    return (
                      <div key={category.id} className="space-y-2">
                        <div
                          className={`flex items-center justify-between w-full ${
                            isExpanded ? "text-cyan-300" : "text-gray-300"
                          } font-medium`}
                        >
                          <Link
                            href={`/services/${category.slug}`}
                            className="hover:text-cyan-300 transition-colors"
                            onClick={handleMobileMenuClose}
                          >
                            {category.name}
                          </Link>
                          {hasServices && (
                            <button
                              onClick={() =>
                                handleMobileCategoryToggle(category.name)
                              }
                              aria-label={`Toggle ${category.name} services`}
                              className="p-1 text-gray-400 hover:text-cyan-300 transition-colors"
                            >
                              <svg
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isExpanded ? "rotate-90" : "rotate-0"
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
                          )}
                        </div>
                        {hasServices && isExpanded && (
                          <div className="space-y-2 ml-4 border-l border-gray-600 pl-4">
                            {categoryServices.map((service) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.categorySlug}/${service.slug}`}
                                className="block text-gray-400 hover:text-cyan-300 transition-colors text-sm py-1"
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
              </div>
            )}

            <Link
              href="/contact"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={handleMobileMenuClose}
            >
              Contact Us
            </Link>
          </div>

          {/* Lawyer Register Button for Mobile */}
          <div className="mt-8">
            <Link
              href="/lawyer-registration"
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors w-full"
              onClick={handleMobileMenuClose}
            >
              Lawyer Register
            </Link>
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

export default Navbar;