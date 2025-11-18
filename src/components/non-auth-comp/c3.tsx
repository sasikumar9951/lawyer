import React from "react";

interface Office {
  address: string;
  email: string;
  phones: string[];
}

interface C3Props {
  title?: string;
  subtitle?: string;
  offices?: Office[];
  mapSrc?: string;
  mapTitle?: string;
}

const defaultOffices: Office[] = [
  {
    address: "2084 Hayes St, San Francisco, CA 94117",
    email: "willie.jennings@example.com",
    phones: ["(480) 555-0103", "(684) 555-0102"],
  },
  {
    address: "1901 Thornridge Cir., Hawaii 81063",
    email: "curtis.weaver@example.com",
    phones: ["(480) 555-0103", "(684) 555-0102"],
  },
  {
    address: "6391 Elgin St. Celina, Delaware 10299",
    email: "dolores.chambers@example.com",
    phones: ["(480) 555-0103", "(684) 555-0102"],
  },
];

const C3: React.FC<C3Props> = ({
  title = "Our Offices",
  subtitle = "Find us at these locations",
  offices = defaultOffices,
  mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9935.658355237862!2d-0.12174413722545518!3d51.50305715209124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2slastminute.com%20London%20Eye!5e0!3m2!1sen!2sus!4v1654789542549!5m2!1sen!2sus",
  mapTitle = "London Eye Location",
}) => (
  <div className="w-full bg-white">
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Lora'] mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {offices.map((office, idx) => (
          <div
            key={idx}
            className="bg-white w-full rounded shadow-none flex flex-col"
          >
            <img
              src="/img1.webp"
              alt="Office"
              className="w-full h-[200px] sm:h-[220px] md:h-[260px] lg:h-[300px] object-cover rounded"
            />
            <div className="pt-6 px-0">
              <div className="text-[#b97a3c] text-sm tracking-widest font-medium uppercase mb-1">
                Address
              </div>
              <div className="text-[17px] text-[#222] mb-3">
                {office.address}
              </div>
              <div className="text-[#b97a3c] text-sm tracking-widest font-medium uppercase mb-1">
                Email
              </div>
              <div className="text-[17px] text-[#222] mb-3">
                <a
                  href={`mailto:${office.email}`}
                  className="hover:text-[#b97a3c] cursor-pointer transition-colors"
                >
                  {office.email}
                </a>
              </div>
              <div className="text-[#b97a3c] text-sm tracking-widest font-medium uppercase mb-1">
                Phone
              </div>
              <div className="text-[17px] text-[#222] mb-1">
                {office.phones.map((phone, i) => (
                  <div key={i}>
                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                      className="hover:text-[#b97a3c] cursor-pointer transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={mapTitle}
      />
    </div>
  </div>
);

export default C3;
