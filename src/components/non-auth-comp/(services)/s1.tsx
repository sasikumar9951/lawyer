import Image from "next/image";

const S1 = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-2 items-center">
      {/* Left Side - Text Content */}
      <div className="space-y-6 text-center lg:text-left">
        <h1 className="text-2xl pt-10 sm:text-3xl md:text-4xl xl:text-5xl font-bold text-black leading-tight">
          Do you want to start a<br />
          business with somebody<br />
          whom you trust?
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-black">
          Form a <span className="font-semibold">PARTNERSHIP FIRM</span> and get started
        </p>
      </div>

      {/* Right Side - Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]">
        <Image
          src="/bg3.png"
          alt="Business Partnership Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default S1;
