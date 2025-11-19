import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="About Us" breadcrumbLabel="About Us" />

      {/* About Us Content */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lora']">
                About Us
              </h2>
              <p className="text-xl text-gray-700 font-['Lora']">
                Welcome to Vakilfy – Your Trusted Legal Partner
              </p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
              <div>
                <p className="mb-3">
                  Vakilfy.com is an innovative legal tech platform operated by
                  MD Legal Tech Solutions, designed to make quality legal
                  assistance simple, accessible, and reliable for everyone.
                </p>
                <p className="mb-3">
                  We act as a neutral intermediary platform that connects
                  customers with experienced and verified legal professionals.
                </p>
                <p className="mb-3">Through Vakilfy, you can access:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    <strong>Specialised Drafting Services</strong> –
                    Professionally prepared agreements, petitions, notices,
                    contracts, and other legal documents tailored to your needs.
                  </li>
                  <li>
                    <strong>On-Call Consultations</strong> – Quick, hassle-free
                    interactions with registered lawyers for resolving queries
                    and getting guidance on legal matters.
                  </li>
                  <li>
                    <strong>Document Review Services</strong> – Expert review of
                    your contracts, property papers, and other important
                    documents to ensure accuracy and safeguard your interests.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  Why Vakilfy?
                </h3>
                <p className="mb-3">
                  At Vakilfy, we understand that legal issues require trust,
                  precision, and timely assistance.
                </p>
                <p className="mb-3">
                  That’s why we follow strict checks and compliance measures
                  before onboarding any legal professional on our platform.
                </p>
                <p className="mb-3">
                  Each lawyer undergoes a careful verification process to ensure
                  authenticity, expertise, and professional ethics.
                </p>
                <p className="mb-3">
                  This ensures that every service you avail through Vakilfy is:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>✅ Reliable</li>
                  <li>✅ Transparent</li>
                  <li>✅ In the best interest of our customers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  Direct Interaction, Personalised Solutions
                </h3>
                <p className="mb-3">
                  Unlike generic legal websites, Vakilfy empowers customers to
                  directly connect and interact with registered professionals.
                  This means:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>You explain your requirements directly to the expert.</li>
                  <li>
                    You get customised legal solutions, not one-size-fits-all
                    answers.
                  </li>
                  <li>You stay in control of your legal journey.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  Our Mission
                </h3>
                <p className="mb-3">
                  Our mission is simple: To bridge the gap between people and
                  quality legal assistance by combining technology,
                  transparency, and trusted expertise.
                </p>
                <p className="mb-3">We believe legal help should be:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    <strong>Accessible</strong> – Easy to reach without
                    geographical barriers
                  </li>
                  <li>
                    <strong>Affordable</strong> – Cost-effective without
                    compromising on quality
                  </li>
                  <li>
                    <strong>Accountable</strong> – Provided by professionals who
                    adhere to strict ethical standards
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  Our Vision
                </h3>
                <p>
                  To become India’s most customer-centric legal tech platform,
                  where individuals and businesses can confidently find the
                  right professional help for every legal requirement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
