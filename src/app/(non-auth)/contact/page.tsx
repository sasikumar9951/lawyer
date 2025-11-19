import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import C2 from "@/components/non-auth-comp/c2";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function ContactPage() {
  const contactItems = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-cyan-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Office Address",
      content: COMPANY_CONFIG.contact.address.map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      )),
      link: null,
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-cyan-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email ID",
      content: COMPANY_CONFIG.contact.email,
      link: `mailto:${COMPANY_CONFIG.contact.email}`,
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-cyan-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.454 5.454l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C7.65 21 3 16.35 3 11V5z"
          />
        </svg>
      ),
      title: "Phone Number",
      content: COMPANY_CONFIG.contact.phone,
      link: `tel:${COMPANY_CONFIG.contact.phone}`,
    },
  ];

  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Contact Us" breadcrumbLabel="Contact us" />

      {/* FORM + IMAGE SECTION */}
      <C2 />

      {/* CONTACT CARDS (Exactly like screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:shadow-cyan-300 hover:shadow-xl"
            >
              <div className="mb-4 p-3 bg-cyan-100 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-['Lora']">
                {item.title}
              </h3>
              <p className="text-gray-600 text-base flex-1">
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-cyan-600 hover:text-cyan-800 font-medium"
                  >
                    {item.content}
                  </a>
                ) : (
                  item.content
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <Tenth
        companyName={COMPANY_CONFIG.name}
        companyDescription={COMPANY_CONFIG.description}
        contactInfo={{
          address: COMPANY_CONFIG.contact.address,
          phone: COMPANY_CONFIG.contact.phone,
          email: COMPANY_CONFIG.contact.email,
        }}
        copyrightText={COMPANY_CONFIG.copyright}
      />
    </main>
  );
}
