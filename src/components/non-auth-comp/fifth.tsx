"use client";

import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { landing } from "@/lib/text/landing";

const Fifth = () => {
    const data = landing;
    const testimonials = [
        {
            id: 1,
            text: "These lawyers helped us solve our problem and got us the best possible results! They also acted very quickly and followed up every step.",
            name: "Alfred Benz",
            position: "CEO, total group",
            image: "/dp1.webp",
        },
        {
            id: 2,
            text: "These lawyers helped us solve our problem and got us the best possible results! They also acted very quickly and followed up every step.",
            name: "Richard Will",
            position: "Manager",
            image: "/dp2.webp",
        },
        {
            id: 3,
            text: "These lawyers helped us solve our problem and got us the best possible results! They also acted very quickly and followed up every step.",
            name: "Andii Moris",
            position: "Lawyer",
            image: "/dp1.webp",
        },
        {
            id: 4,
            text: "A fantastic team! They handled our case professionally, kept us informed, and achieved excellent results.",
            name: "Clara Smith",
            position: "Entrepreneur",
            image: "/dp2.webp",
        },
    ];

    return (
        <section className="py-16 bg-gray-50 font-['Lora'] overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Why Choose Section */}
                <div className="mb-16">
                    <div className="relative rounded-2xl overflow-hidden bg-white/95 shadow-lg border border-gray-200">
                        {/* Background image */}
                        <div className="absolute inset-0 z-10">
                            <Image
                                src="/why_vakilfy.jpg"
                                alt=""
                                fill
                                className="object-cover opacity-15"
                                priority
                            />
                        </div>
                        <div className="bg-[#0b2a3a] text-white px-6 sm:px-8 py-4 flex items-center justify-between">
                            <h3 className="text-xl sm:text-2xl font-bold">{data.fifth.why.title}</h3>
                        </div>
                        <div className="px-6 sm:px-8 py-6">
                            <p className="text-black mb-8 leading-relaxed font-['Lora'] text-xl">
                                {data.fifth.why.intro}
                            </p>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 text-cyan-600" aria-hidden="true">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 text-lg">{data.fifth.why.points[0]}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 text-cyan-600" aria-hidden="true">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 text-lg">{data.fifth.why.points[1]}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 text-cyan-600" aria-hidden="true">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 text-lg">{data.fifth.why.points[2]}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 text-cyan-600" aria-hidden="true">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 text-lg">{data.fifth.why.points[3]}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 text-cyan-600" aria-hidden="true">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 text-lg">{data.fifth.why.points[4]}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 text-cyan-600" aria-hidden="true">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 text-lg">{data.fifth.why.points[5]}</span>
                                </li>
                            </ul>
                        </div>
                         {/* Decorative bottom-right gradient */}
                         <div
                             aria-hidden="true"
                             className="pointer-events-none absolute -bottom-6 -right-6 w-64 h-64"
                             style={{
                                 background:
                                     "radial-gradient(ellipse 140px 140px at bottom right, rgba(11,42,58,0.18) 0%, rgba(11,42,58,0.10) 35%, rgba(11,42,58,0.05) 60%, transparent 80%)",
                             }}
                         />
                    </div>
                </div>

				{/* Who We Serve Section */}
				<div className="mb-16">
					<div className="relative rounded-2xl overflow-hidden bg-white/95 shadow-lg border border-gray-200">
						{/* Background image */}
						<div className="absolute inset-0 z-10">
							<Image
								src="/who_serve.jpg"
								alt=""
								fill
								className="object-cover opacity-15"
								priority
							/>
						</div>
						<div className="bg-[#0b2a3a] text-white px-6 sm:px-8 py-4">
                            <h3 className="text-xl sm:text-2xl font-bold">{data.fifth.whoServe.title}</h3>
						</div>
						<div className="px-6 sm:px-8 py-6">
                            <p className="text-gray-800 mb-8 leading-relaxed font-['Lora'] text-xl">{data.fifth.whoServe.intro}</p>
							<div className="flex flex-col gap-6">
								<div className="flex items-start gap-3">
									<span className="mt-1 text-cyan-600" aria-hidden="true">
										<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z"/></svg>
									</span>
                                    <p className="text-gray-900 font-['Lora'] text-lg">{data.fifth.whoServe.points[0]}</p>
								</div>
								<div className="flex items-start gap-3">
									<span className="mt-1 text-cyan-600" aria-hidden="true">
										<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z"/></svg>
									</span>
                                    <p className="text-gray-900 font-['Lora'] text-lg">{data.fifth.whoServe.points[1]}</p>
								</div>
								<div className="flex items-start gap-3">
									<span className="mt-1 text-cyan-600" aria-hidden="true">
										<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z"/></svg>
									</span>
                                    <p className="text-gray-900 font-['Lora'] text-lg">{data.fifth.whoServe.points[2]}</p>
								</div>
								<div className="flex items-start gap-3">
									<span className="mt-1 text-cyan-600" aria-hidden="true">
										<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z"/></svg>
									</span>
                                    <p className="text-gray-900 font-['Lora'] text-lg">{data.fifth.whoServe.points[3]}</p>
								</div>
							</div>
						</div>
                    </div>
                </div>
                {/* Header Section */}
                <div className="flex items-start justify-between mb-16">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-cyan-500 font-semibold mb-4">
                            <Image
                                src="/icon.webp"
                                width={32}
                                height={32}
                                alt="testimonial icon"
                            />
                            <span className="text-3xl font-['Lora']">{data.fifth.testimonial.cta}</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-black font-['Lora']">
                            {data.fifth.testimonial.heading}
                        </h2>
                    </div>

                    <div className="text-right">
                        <div className="text-gray-600 text-sm mb-2 font-['Lora'] leading-tight flex flex-col items-end">
                            <span>{data.fifth.testimonial.overall}</span>
                            <span>/ 46 Rating</span>
                        </div>
                        <div className="text-6xl font-bold text-purple-600 font-['Lora']">4</div>
                    </div>
                </div>



                {/* Continuous Scrolling Testimonials */}
                <div className="relative overflow-hidden">
                    <div className="flex animate-testimonial-marquee" style={{ paddingTop: '30px' }}>
                        {/* First track */}
                        {testimonials.map((testimonial) => (
                            <div
                                key={`set1-${testimonial.id}`}
                                className="flex-shrink-0 mx-8 group cursor-pointer overflow-visible"
                                style={{ width: "400px" }}
                            >
                                <div className="bg-white rounded-2xl p-8 relative mb-8 h-[250px] transition-all duration-300 shadow-lg group-hover:shadow-cyan-200 group-hover:shadow-2xl overflow-visible">
                                    {/* Bottom and Right Shadow Effect */}
                                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-200 rounded-2xl -z-10 transition-all duration-300 group-hover:bg-cyan-200"></div>

                                    <div className="absolute font-extrabold top-[-24px] left-8 text-gray-300 text-8xl font-['Lora'] leading-none transition-colors duration-300 group-hover:text-yellow-500">
                                        “
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-6 mt-10 font-['Lora']">
                                        {testimonial.text}
                                    </p>
                                    <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"></div>
                                </div>

                                <div className="flex items-center gap-4 ml-4">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800 font-['Lora'] transition-colors duration-300 group-hover:text-cyan-500">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-gray-600 text-sm font-['Lora'] transition-colors duration-300 group-hover:text-gray-700">
                                            {testimonial.position}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Second track (duplicate for seamless loop) */}
                        {testimonials.map((testimonial) => (
                            <div
                                key={`set2-${testimonial.id}`}
                                className="flex-shrink-0 mx-8 group cursor-pointer overflow-visible"
                                style={{ width: "400px" }}
                            >
                                <div className="bg-white font-extrabold rounded-2xl p-8 relative mb-8 h-[250px] transition-all duration-300 shadow-lg group-hover:shadow-cyan-200 group-hover:shadow-2xl overflow-visible">
                                    {/* Bottom and Right Shadow Effect */}
                                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-200 rounded-2xl -z-10 transition-all duration-300 group-hover:bg-cyan-200"></div>

                                    <div className="absolute top-[-24px] left-8 text-gray-300 text-8xl font-['Lora'] leading-none transition-colors duration-300 group-hover:text-yellow-500">
                                        “
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-6 mt-10 font-['Lora']">
                                        {testimonial.text}
                                    </p>
                                    <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"></div>
                                </div>

                                <div className="flex items-center gap-4 ml-4">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800 font-['Lora'] transition-colors duration-300 group-hover:text-cyan-500">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-gray-600 text-sm font-['Lora'] transition-colors duration-300 group-hover:text-gray-700">
                                            {testimonial.position}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
                    <div className="text-gray-700 font-medium font-['Lora']">
                        Check what client&apos;s say about us!
                    </div>
                    <InteractiveHoverButton
                        onClick={() => { }}
                        className="!bg-white !border-black !text-black hover:!bg-black hover:!text-white hover:!border-black [&>div>div]:!bg-black [&>div:last-child]:!text-white"
                    >
                        <span className="flex items-center gap-2">Testimonial</span>
                    </InteractiveHoverButton>
                </div>
            </div>

            <style jsx>{`
                @keyframes testimonial-marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-testimonial-marquee {
                    width: max-content;
                    animation: testimonial-marquee 20s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default Fifth;