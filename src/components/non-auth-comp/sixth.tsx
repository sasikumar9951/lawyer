"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { landing } from "@/lib/text/landing";

const Sixth = () => {
    const data = landing;
    const [scrollY, setScrollY] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const [sectionTop, setSectionTop] = useState(0);
    const [sectionHeight, setSectionHeight] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [animatedValues, setAnimatedValues] = useState({
        communication: 0,
        success: 0
    });

    const teamMembers = [
        { id: 1, image: "/dp5.webp", name: "John Smith", position: "Senior Partner" },
        { id: 2, image: "/dp6.webp", name: "Sarah Johnson", position: "Corporate Lawyer" },
        { id: 3, image: "/dp3.webp", name: "Michael Brown", position: "Criminal Defense" },
        { id: 4, image: "/dp4.webp", name: "Emily Davis", position: "Family Law Expert" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);

            // Check if section is in view for progress bar animation
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;

                if (isInView && !isVisible) {
                    setIsVisible(true);
                }
            }
        };

        const handleResize = () => {
            if (sectionRef.current) {
                setSectionTop(sectionRef.current.offsetTop);
                setSectionHeight(sectionRef.current.offsetHeight);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        if (sectionRef.current) {
            setSectionTop(sectionRef.current.offsetTop);
            setSectionHeight(sectionRef.current.offsetHeight);
        }

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, [isVisible]);

    // Animate progress bars when visible
    useEffect(() => {
        if (isVisible) {
            const duration = 4000; // 2 seconds
            const steps = 60; // 60 steps for smooth animation
            const interval = duration / steps;

            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setAnimatedValues({
                    communication: Math.min(95, Math.floor(95 * progress)),
                    success: Math.min(90, Math.floor(90 * progress))
                });

                if (currentStep >= steps) {
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [isVisible]);

    const getImageTransform = (index: number) => {
        if (typeof window === "undefined") {
            return { transform: "translateY(0%)", opacity: 1 };
        }

        const sectionBottom = sectionTop + sectionHeight;
        const startTrigger = sectionTop - window.innerHeight;
        const endTrigger = sectionBottom - window.innerHeight;

        const rawProgress = (scrollY - startTrigger) / (endTrigger - startTrigger);
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        const imageProgress = Math.max(
            0,
            Math.min(1, (clampedProgress - index * 0.15) / 0.4)
        );

        const translateY = (1 - imageProgress) * 100;
        const opacity = imageProgress;

        return {
            transform: `translateY(${translateY}%)`,
            opacity,
        };
    };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden h-auto sm:h-[850px] lg:h-[1000px] py-16"
        >
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg2.webp"
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center h-full">
                    {/* Left Content */}
                    <div className="text-white">
                        <div className="flex items-center gap-3 text-cyan-400 font-semibold mb-6">
                            <Image src="/icon.webp" width={32} height={32} alt="team icon" />
                            <span className="text-2xl font-['Lora']">{data.sixth.team.tag}</span>
                        </div>

                        <h2 className="text-3xl lg:text-5xl font-bold text-white font-['Lora'] leading-tight mb-6">
                            {(data.sixth.team.heading as string)
                                .split("\n")
                                .map((line: string, idx: number) => (
                                    idx === 0 ? (<span key={idx}>{line}</span>) : (<span key={idx}><br />{line}</span>)
                                ))}
                        </h2>

                        <p className="text-gray-200 text-base leading-relaxed mb-10 max-w-lg">
                            {data.sixth.team.desc}
                        </p>

                        {/* Progress Bars */}
                        <div className="space-y-6 mb-10">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium font-['Lora'] text-sm">{data.sixth.team.progress.communication}</span>
                                    <span className="text-cyan-600 font-bold text-sm">{animatedValues.communication}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full transition-all duration-75 ease-out"
                                        style={{ width: `${animatedValues.communication}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium font-['Lora'] text-sm">{data.sixth.team.progress.success}</span>
                                    <span className="text-cyan-600 font-bold text-sm">{animatedValues.success}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full transition-all duration-75 ease-out"
                                        style={{ width: `${animatedValues.success}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <InteractiveHoverButton
                            onClick={() => { }}
                            className="!bg-black !border-white !text-white hover:!bg-white hover:!text-black hover:!border-white [&>div>div]:!bg-white [&>div:last-child]:!text-black"
                        >
                            <span className="flex items-center gap-2">
                                {data.sixth.team.cta}
                            </span>
                        </InteractiveHoverButton>
                    </div>

                    {/* Right Side - Team Images */}
                    <div className="relative h-full">
                        {/* Mobile Layout - Vertical Stack */}
                        <div className="block lg:hidden space-y-6">
                            {teamMembers.map((member, index) => (
                                <div key={member.id} className="flex justify-center">
                                    <div className="relative group">
                                        <div
                                            className="w-40 h-40 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300 border-4 border-white/20 relative"
                                            style={{ transform: "rotate(45deg)" }}
                                        >
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                style={{ transform: "rotate(-45deg) scale(1.4)" }}
                                            />

                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="flex flex-col items-center justify-center" style={{ transform: "rotate(-45deg)" }}>
                                                    {/* Social Media Icons */}
                                                    <div className="flex gap-2 mb-3">
                                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                            </svg>
                                                        </div>

                                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                            </svg>
                                                        </div>

                                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <h3 className="text-white font-bold text-sm font-['Lora'] mb-1 border-b border-white pb-1 whitespace-nowrap">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-gray-300 text-xs font-['Lora'] whitespace-nowrap">
                                                            {member.position}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop/Tablet Layout - Overlapping */}
                        <div className="hidden lg:block">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="absolute transition-all duration-300 ease-out"
                                    style={{
                                        ...getImageTransform(index),
                                        right: `${index * 20}%`,
                                        top: `${index * 24}%`,
                                        zIndex: teamMembers.length - index,
                                    }}
                                >
                                    <div className="relative group">
                                        <div
                                            className="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300 border-4 border-white/20 relative"
                                            style={{ transform: "rotate(45deg)" }}
                                        >
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                style={{ transform: "rotate(-45deg) scale(1.4)" }}
                                            />

                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="flex flex-col items-center justify-center" style={{ transform: "rotate(-45deg)" }}>
                                                    {/* Social Media Icons */}
                                                    <div className="flex gap-2 mb-3">
                                                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                            </svg>
                                                        </div>

                                                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                            </svg>
                                                        </div>

                                                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <h3 className="text-white font-bold text-base font-['Lora'] mb-1 border-b border-white pb-1 whitespace-nowrap">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-gray-300 text-xs font-['Lora'] whitespace-nowrap">
                                                            {member.position}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sixth;
