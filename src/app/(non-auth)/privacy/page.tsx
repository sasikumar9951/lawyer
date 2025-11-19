import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Privacy Policy" breadcrumbLabel="Privacy Policy" />

      {/* Privacy Policy Content */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lora']">
                Privacy Policy
              </h2>
              <p className="text-gray-600">
                Effective Date: 02 OCTOBER 2025
              </p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
              <p>
                MD Legal Tech Solutions, a company having its registered office
                at 2nd Floor, MD Tower, Plot No. 2C2, Awas Vikas 1st, DM Road,
                Bulandshahr (hereinafter “we”, “us”, “our”) operates the website
                Vakilfy.com (the “Website”).
              </p>
              <p>
                This Privacy Policy describes how we collect, use, disclose, and
                safeguard your information when you use our Website and avail
                our services (collectively, the “Services”).
              </p>
              <p>
                By accessing or using Vakilfy.com, you agree to the terms of
                this Privacy Policy and to the collection, use, disclosure, and
                storage of your information as described herein.
              </p>
              <p>If you do not agree, please do not use our Services.</p>
              <p>
                We may modify this Privacy Policy from time to time. When we
                do, we will post the updated version on the Website, and in
                cases of “material changes,” we may notify you via email or by a
                notice on the Website prior to the change becoming effective.
              </p>

              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  1. Information We Collect
                </h3>
                <p className="mb-3">
                  When you use our Website or Services, we may collect various
                  kinds of information, including:
                </p>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  1.1 Information You Provide Directly
                </h4>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    Personal identifiers: your name, email address, mobile
                    phone number, postal address, etc.
                  </li>
                  <li>
                    Company / business details (if applicable): business name,
                    registration details, address, etc.
                  </li>
                  <li>
                    Mandate or case-specific information: details you provide
                    regarding legal matters or service requests (e.g. property
                    details, agreements, dispute particulars).
                  </li>
                  <li>
                    Communication content: when you fill forms, send messages,
                    ask queries, or correspond with support.
                  </li>
                  <li>
                    Billing and contact information: when you purchase or
                    subscribe to services, we may collect billing address,
                    invoicing name, etc.
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  1.2 Log & Usage Data
                </h4>
                <p className="mb-3">
                  We automatically collect certain information when you
                  interact with our Website:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    Log data: your IP address, browser type & version,
                    operating system, pages visited, time stamps, referring
                    URLs, duration on pages, click streams, device
                    information.
                  </li>
                  <li>
                    Usage analytics: we may use analytics tools (e.g. Google
                    Analytics or similar) to understand how Visitors use our
                    Website, track page views, navigation paths, and improve
                    performance.
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  1.3 Cookies, Tracking & Advertising Data
                </h4>
                <p className="mb-3">
                  We and our service providers may use cookies, web beacons,
                  local storage, pixel tags, and similar tracking technologies
                  to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Maintain your login session and user preferences</li>
                  <li>Recognize returning visitors</li>
                  <li>Understand traffic sources and user behavior</li>
                  <li>Serve tailored content or advertisements</li>
                  <li>Evaluate effectiveness of promotional campaigns</li>
                </ul>
                <p className="mt-3">
                  You may be able to disable or control cookies via your
                  browser settings, but doing so may limit your access to
                  certain features.
                </p>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  1.4 Information from Third Parties
                </h4>
                <p className="mb-3">
                  We may receive information about you from third parties, for
                  example, when:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    A third-party service provider (analytics, marketing,
                    verification) shares data.
                  </li>
                  <li>
                    Publicly available sources or partner services provide
                    supplementary data (e.g. business directories).
                  </li>
                </ul>
                <p className="mt-3">
                  We may combine these with information we already have to
                  enrich or improve our Services.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  2. Use of Your Information
                </h3>
                <p className="mb-3">
                  We use collected data for various purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    To operate, maintain, and improve the Website and Services
                  </li>
                  <li>
                    To provide you the core functionality and features you
                    request
                  </li>
                  <li>To personalize your user experience and tailor content</li>
                  <li>
                    To communicate with you (e.g. confirmations, updates,
                    newsletters, service alerts)
                  </li>
                  <li>
                    For billing, invoicing, payment processing, and related
                    financial operations
                  </li>
                  <li>
                    To conduct internal research, analytics, and performance
                    monitoring
                  </li>
                  <li>
                    To detect, prevent, and respond to fraud, security issues,
                    or misuse of the Services
                  </li>
                  <li>
                    To enforce our terms and protect our rights, property, or
                    safety and that of others
                  </li>
                  <li>
                    In connection with legal obligations, government requests,
                    or legal proceedings
                  </li>
                  <li>
                    To send marketing or promotional communications (subject to
                    your consent or opt-out)
                  </li>
                </ul>
                <p className="mt-3">
                  We will not use your personal information for purposes
                  incompatible with those listed above without notifying you.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  3. Storage, Security & Retention
                </h3>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  3.1 Storage and Processing
                </h4>
                <p className="mb-3">
                  Your data may be stored and processed using cloud servers or
                  other third-party infrastructure (e.g. AWS, Google Cloud,
                  Azure, or equivalent).
                </p>
                <p>
                  By using our Services, you consent to such storage and
                  processing.
                </p>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  3.2 Security Measures
                </h4>
                <p className="mb-3">
                  We adopt commercially reasonable technical, administrative,
                  and physical safeguards, such as encryption (TLS/SSL),
                  access controls, firewalls, and security audits, to protect
                  your information.
                </p>
                <p>
                  However, no method of transmission or storage is absolutely
                  secure, and we cannot guarantee total security.
                </p>

                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  3.3 Retention of Data
                </h4>
                <p className="mb-3">
                  We retain personal data as long as necessary to fulfill the
                  purposes for which it was collected, comply with legal
                  obligations, resolve disputes, and enforce agreements.
                </p>
                <p className="mb-3">
                  If you deactivate or request deletion of your account, we
                  will remove or anonymize personal identifiers from our
                  active systems, except as needed for fraud prevention, legal
                  claims, or obligations.
                </p>
                <p>
                  Aggregated or anonymized data (which does not personally
                  identify you) may be retained indefinitely for analytical
                  purposes.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  4. Disclosure & Sharing of Information
                </h3>
                <p className="mb-3">
                  We may share or disclose your personal data in the following
                  scenarios:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    With service providers, contractors, and business partners
                    who assist in providing our Services (e.g. hosting,
                    analytics, email, marketing).
                  </li>
                  <li>
                    To comply with legal obligations, court orders, or
                    government requests.
                  </li>
                  <li>
                    To enforce or protect our rights, property, or safety, or
                    those of users.
                  </li>
                  <li>
                    In connection with a merger, acquisition, reorganization,
                    or sale of assets (your personal data may be transferred in
                    such transactions under corresponding confidentiality
                    obligations).
                  </li>
                  <li>With your consent or direction.</li>
                  <li>
                    In anonymized or aggregated form that does not identify
                    you personally.
                  </li>
                </ul>
                <p className="mt-3">
                  We will not sell your personal identifiable information to
                  unaffiliated third parties.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  5. Rights of Users
                </h3>
                <p className="mb-3">
                  Depending on your jurisdiction, you may have the following
                  rights concerning your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    <strong>Access / Data Portability:</strong> request a copy
                    of your personal data in a structured, commonly used
                    format
                  </li>
                  <li>
                    <strong>Correction / Update:</strong> request correction of
                    inaccuracies or incomplete data
                  </li>
                  <li>
                    <strong>Deletion:</strong> ask us to remove your personal
                    data (subject to retention for legal or security reasons)
                  </li>
                  <li>
                    <strong>Objection / Restriction:</strong> object to or
                    restrict processing of your data in certain cases
                  </li>
                  <li>
                    <strong>Opt-out of marketing:</strong> decline receiving
                    promotional or marketing messages
                  </li>
                  <li>
                    <strong>Withdraw consent:</strong> if processing is based
                    on consent, you may withdraw it (subject to effect on
                    Services)
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, you may write to us at our
                  privacy contact (see Section 8).
                </p>
                <p className="mt-3">
                  We will respond subject to applicable law.
                </p>
                <p className="mt-3">
                  In some cases, we may decline your request if it affects
                  others’ rights or interferes with legal or contractual
                  obligations.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  6. International or Cross-Border Transfers & GDPR
                </h3>
                <p className="mb-3">
                  If users from the European Union or other jurisdictions use
                  our Website, we may process their data under applicable laws
                  (e.g. GDPR).
                </p>
                <p className="mb-3">In such cases:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    The legal bases for processing include consent, legitimate
                    interest, contract, or compliance with legal obligations
                  </li>
                  <li>
                    Users in the EU or applicable regions have the rights
                    described above
                  </li>
                  <li>
                    Cross-border transfers of data will be done under lawful
                    mechanisms (e.g. standard contractual clauses, adequate
                    protections)
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  7. Cookies & Tracking / Advertising
                </h3>
                <p className="mb-3">
                  We use cookies and similar technologies to track and store
                  users’ preferences, usage data, login sessions, and for
                  advertising and analytics purposes.
                </p>
                <p className="mb-3">
                  Third-party advertising services may use anonymized tracking
                  to serve ads relevant to your interests.
                </p>
                <p className="mb-3">
                  You may disable cookies via browser settings, but this may
                  degrade your experience or limit certain features.
                </p>
                <p>
                  We do not honor all “Do Not Track” browser signals due to
                  lack of uniform industry standards.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  8. Contact & Privacy Inquiries
                </h3>
                <p className="mb-3">
                  If you have any questions, concerns, or requests relating to
                  this Privacy Policy or your personal data, you may contact
                  us at{" "}
                  <a
                    href="mailto:hello@vakilfy.com"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    hello@vakilfy.com
                  </a>
                  .
                </p>
                <p>
                  We will respond to privacy requests as required under
                  applicable laws.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  9. Changes to This Policy
                </h3>
                <p className="mb-3">
                  We may update this Privacy Policy from time to time.
                </p>
                <p className="mb-3">
                  The revised version will be effective as of the “Effective
                  Date” shown above.
                </p>
                <p className="mb-3">
                  For material changes, we may notify you via email or
                  prominent notice on our Website before implementation.
                </p>
                <p className="mb-3">
                  Your continued use of the Website after such changes signify
                  acceptance of the revised policy.
                </p>
                <p>
                  If you disagree with changes, discontinue use of our
                  Services.
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