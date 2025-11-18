"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { landing } from "@/lib/text/landing";

const Seventh = () => {
    const data = landing;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const caseStudies = ((data?.seventh?.cards as Array<{ title: string; description: string }>) ?? [
        { title: "What is online legal consultation?", description: "Online legal consultation, also known as online lawyer consultation, is the process of connecting users to lawyers in a virtual manner. It could be by way of phone calls, video calls, or chat. It is a one-step solution for quick, easy and hassle free legal advice using our Vakilfy website (TBC if app is also being developed)." },
        { title: "How does Vakilfy’s online consultation work?", description: "We, at Vakilfy, have a 5 step simple process:\nStep 1. Choose Your Service\nStep 2. Book Online Consultation\nStep 3. Discuss Your Needs\nStep 4. Get Drafted / Reviewed\nStep 5. Delivery & Support" },
        { title: "How are fees determined for online legal consultation at Vakilfy?", description: "The initial consultation charge is ₹ 500 (TBC with client) for a 10 minute /20 (TBC with client) consultation slot. At Vakilfy, all charges are transparent and disclosed upfront." },
        { title: "How does availing Vakilfy services benefit you?", description: "At Vakilfy, we have 50+ legal experts (TBC) from different cities of India. You can seek advice online, in your preferred language, and receive timely, accurate legal documents." },
        { title: "Is seeking legal assistance on Vakilfy a safe and secure method?", description: "Yes. Vakilfy follows strict confidentiality and attorney-client privilege standards. Your data and documents remain private and secure." },
    ]).map((c, idx) => ({ id: idx + 1, image: idx % 2 === 0 ? "/img1.webp" : "/img2.webp", ...c }));

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % caseStudies.length);
                setIsAnimating(false);
            }, 600); // animation time
        }, 7000);

        return () => clearInterval(interval);
    }, [caseStudies.length]);

    const getVisibleCases = () => {
        const cases = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + caseStudies.length) % caseStudies.length;
            cases.push({
                ...caseStudies[index],
                position: i // -1 left, 0 center, 1 right
            });
        }
        return cases;
    };

    return (
        <section className="relative bg-black py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 text-cyan-400 font-semibold mb-6">
                                <Image src="/icon.webp" width={32} height={32} alt="case studies icon" className="invert" />
                                <span className="text-3xl font-['Lora']">{data.seventh.faqs}</span>
                            </div>
                        </div>

                        <div>
                            <InteractiveHoverButton
                                onClick={() => { }}
                                className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-cyan-400 hover:!text-black hover:!border-cyan-400 [&>div>div]:!bg-cyan-400 [&>div:last-child]:!text-black"
                            >
                                <span className="flex items-center gap-2">
                                    {data.seventh.cta}
                                </span>
                            </InteractiveHoverButton>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Carousel - Below lg screens */}
                <div className="block lg:hidden">
                    <div className="relative w-full h-96 mb-32">
                        <div 
                            className="relative w-full h-full overflow-visible transition-all duration-700 ease-in-out"
                            style={{
                                transform: isAnimating ? "scale(0.97)" : "scale(1)",
                                opacity: isAnimating ? 0.8 : 1
                            }}
                        >
                            <Image
                                src={caseStudies[currentIndex].image}
                                alt={caseStudies[currentIndex].title}
                                fill
                                className="object-cover"
                            />

                            {/* Content Card - Same as desktop center card */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4/5 max-w-md z-30">
                                <div className="bg-black/95 backdrop-blur-sm p-6 text-center shadow-2xl border border-gray-700 rounded-lg">
                                    <h3 className="text-xl lg:text-2xl font-bold font-['Lora'] mb-3 text-white">
                                        {caseStudies[currentIndex].title}
                                    </h3>
                                    
                                    <div className="w-12 h-px bg-gray-500 mx-auto mb-4"></div>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                        {caseStudies[currentIndex].description}
                                    </p>
                                    <InteractiveHoverButton
                                        onClick={() => { }}
                                        className="!bg-cyan-400 !border-cyan-400 !text-black hover:!bg-black hover:!text-cyan-400 hover:!border-cyan-400 [&>div>div]:!bg-black [&>div:last-child]:!text-cyan-400"
                                    >
                                        <span className="flex items-center gap-2">
                                            Read More
                                        </span>
                                    </InteractiveHoverButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Carousel */}
            </div>
            <div className="hidden lg:block relative h-96 w-full mb-32">
                <div className="flex w-full h-full -space-x-20">
                    {getVisibleCases().map((caseStudy) => (
                        <div
                            key={`${caseStudy.id}-${currentIndex}`}
                            className={`relative transition-all duration-700 ease-in-out h-full flex-1 z-10`}
                            style={{
                                clipPath:
                                    caseStudy.position === -1
                                        ? "inset(0 20% 0 0)"
                                        : caseStudy.position === 1
                                            ? "inset(0 0 0 20%)"
                                            : "none",
                                transform: isAnimating ? "scale(0.97)" : "scale(1)",
                                opacity: isAnimating ? 0.8 : 1
                            }}
                        >
                            <div className="relative w-full h-full overflow-visible cursor-pointer">
                                <div className="group w-full h-full">
                                    <Image
                                        src={caseStudy.image}
                                        alt={caseStudy.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Card only on center */}
                                {caseStudy.position === 0 && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4/5 max-w-md z-30">
                                        <div className="bg-black/95 backdrop-blur-sm p-6 text-center shadow-2xl border border-gray-700 rounded-lg">
                                            <h3 className="text-xl lg:text-2xl font-bold font-['Lora'] mb-3 text-white">
                                                {caseStudy.title}
                                            </h3>
                                            
                                            <div className="w-12 h-px bg-gray-500 mx-auto mb-4"></div>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                                {caseStudy.description}
                                            </p>
                                            <InteractiveHoverButton
                                                onClick={() => { }}
                                                className="!bg-cyan-400 !border-cyan-400 !text-black hover:!bg-black hover:!text-cyan-400 hover:!border-cyan-400 [&>div>div]:!bg-black [&>div:last-child]:!text-cyan-400"
                                            >
                                                <span className="flex items-center gap-2">
                                                    Read More
                                                </span>
                                            </InteractiveHoverButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
        </section>
    );
};

export default Seventh;
