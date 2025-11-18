"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
    title?: string;
    breadcrumbLabel?: string;
};

const C1 = ({ title = "Contact Us", breadcrumbLabel = "Contact us" }: Props) => {
    return (
        <section className="relative w-full h-[500px] lg:h-[600px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/cbg1.webp"
                    alt="Contact background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left Content */}
                    <div className="flex-1">
                        <motion.h1 
                            className="text-4xl lg:text-6xl font-bold text-white font-['Lora'] mb-6"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {title}
                        </motion.h1>

                        {/* Breadcrumb Navigation */}
                        <div className="inline-flex bg-cyan-500 px-6 py-3 rounded-lg items-center space-x-3">
                            <Link
                                href="/"
                                className="text-black font-medium hover:text-gray-800 transition-colors"
                            >
                                Home
                            </Link>

                            {/* Arrow Separator */}
                            <ChevronRight className="w-4 h-4 text-black" />

                            <span className="text-black font-medium">{breadcrumbLabel}</span>
                        </div>
                    </div>

                    {/* Right Side Transparent Image */}
                    <div className="hidden lg:block absolute right-2.5 top-1/2 transform -translate-y-1/2">
                        <div className="w-64 h-80">
                            <Image
                                src="/c1.webp"
                                alt="Justice figure"
                                fill
                                className="object-contain opacity-30"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default C1;