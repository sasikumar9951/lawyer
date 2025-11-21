import React from "react";
import Image from "next/image";

type ServiceData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  name?: string;
  description?: string;
};

type Props = {
  serviceData?: ServiceData;
};

const S1: React.FC<Props> = ({ serviceData }) => {
  const defaultTitle = (
    <>
      Do you want to start a
      <br />
      business with somebody
      <br />
      whom you trust?
    </>
  );

  const title = serviceData?.heroTitle ? (
    // allow newline markers in DB if any (use <br/> for explicit newlines)
    <span
      dangerouslySetInnerHTML={{
        __html: (serviceData.heroTitle || "").replace(/\n/g, "<br/>"),
      }}
    />
  ) : (
    defaultTitle
  );

  const subtitle = serviceData?.heroSubtitle ?? (
    <>
      Form a <span className="font-semibold">PARTNERSHIP FIRM</span> and get
      started
    </>
  );
  // Fix empty string issue: convert "" to null
  const rawHeroImage = serviceData?.heroImage;
  const heroSrc =
    rawHeroImage && rawHeroImage.trim() !== "" ? rawHeroImage : "/bg3.png";

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-center">
      {/* Left Side - Text Content */}
      <div className="space-y-6 text-center lg:text-left">
        <h1 className="text-2xl pt-10 sm:text-3xl md:text-4xl xl:text-5xl font-bold text-black leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-black">{subtitle}</p>
      </div>

      {/* Right Side - Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]">
        {/* Next/Image: if heroSrc is an external url, add unoptimized or configure domains in next.config.js */}
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={
              serviceData?.name
                ? `${serviceData.name} illustration`
                : "Hero illustration"
            }
            fill
            className="object-contain"
            priority
          />
        ) : null}
      </div>
    </div>
  );
};

export default S1;
