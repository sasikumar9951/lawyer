import Image from "next/image";

const S4 = () => {
  const clients = [
    { name: "OLA", logo: "/ola.png" },
    { name: "Shadowfax", logo: "/ola.png" },
    { name: "Rivigo", logo: "/ola.png" },
    { name: "ZoomCar", logo: "/ola.png" },
    { name: "Module Innovations", logo: "/ola.png" },
    { name: "P Logo", logo: "/ola.png" },
    { name: "Basic Home Loans", logo: "/ola.png" },
    { name: "SpringRole", logo: "/ola.png" },
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 lg:mb-16 font-['Lora']">
          Our Clients
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {clients.map((client, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 flex items-center justify-center hover:shadow-md transition-shadow duration-300 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]"
            >
              <div className="relative w-full h-16 sm:h-20 lg:h-24">
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default S4;