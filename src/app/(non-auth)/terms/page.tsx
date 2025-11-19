import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";
import Link from "next/link"; // Import Link component

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Terms of Use" breadcrumbLabel="Terms of Use" />

      {/* Terms & Conditions Content */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Lora']">
                Terms of Use
              </h2>
              <p className="text-gray-600">
                Effective Date: 02 OCTOBER 2025
              </p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
              <p>
                Welcome to Vakilfy.com (the “Site” or “Website”), operated by MD
                Legal Tech Solutions, having its registered office at 2nd Floor,
                MD Tower, Plot No. 2C2, Awas Vikas 1st, DM Road, Bulandshahr
                (“we”, “us”, “our”).
              </p>
              <p>
                These Terms of Use (“Terms”) govern your access to and use of
                the Website and the services made available through it
                (collectively, the “Services”).
              </p>
              <p>
                By accessing or using the Services, registering an account, or
                otherwise interacting with Vakilfy, you agree to be bound by
                these Terms (and any amendments thereto).
              </p>
              <p>
                If you do not agree with any of these Terms, you should
                immediately stop using or accessing the Site or Services.
              </p>
              <p>
                These Terms are to be read together with our{" "}
                <Link
                  href="/privacy"
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  Privacy Policy
                </Link>{" "}
                (which is incorporated by reference) and any other policies,
                guidelines or disclaimers posted on the Website.
              </p>

              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  1. Definitions
                </h3>
                <p className="mb-3">
                  In these Terms, unless the context otherwise requires:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    <strong>“User”</strong> or <strong>“you”</strong> means any
                    person who accesses or uses the Site or Services.
                  </li>
                  <li>
                    <strong>“Account”</strong> means a registered user account
                    on the Site.
                  </li>
                  <li>
                    <strong>“Lawyer / Legal Expert / Service Provider”</strong>{" "}
                    means a legal professional who offers or provides legal
                    services through our platform.
                  </li>
                  <li>
                    <strong>“Content”</strong> means any text, images, audio,
                    video, documents, files, data, or other materials you or
                    others post, upload or transmit via the Site.
                  </li>
                  <li>
                    <strong>“Permissible Use”</strong> means using the Site to
                    find lawyers, obtain legal information, engage legal
                    services, and use features expressly permitted under these
                    Terms.
                  </li>
                  <li>
                    <strong>“Impermissible Use”</strong> means any use of the
                    Site or Services beyond Permissible Use (see Section 4).
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  2. Eligibility & Account Registration
                </h3>
                <p className="mb-3">You represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    You are at least 18 years of age (or the legal age in your
                    jurisdiction) and have the capacity to enter into binding
                    agreements;
                  </li>
                  <li>
                    You will use the Site in compliance with applicable laws,
                    rules, and these Terms;
                  </li>
                  <li>
                    If acting on behalf of a legal entity or another person,
                    you have authority to bind them to these Terms.
                  </li>
                </ul>
                <p className="mt-3">
                  To use certain features, you may need to create an Account.
                </p>
                <p className="mt-3">
                  During registration you must provide true, accurate, current,
                  and complete information. You agree to keep your account
                  information updated.
                </p>
                <p className="mt-3">
                  You are responsible for safeguarding your password and login
                  credentials. You must not share your credentials with others.
                </p>
                <p className="mt-3">
                  You agree to notify us immediately of any unauthorized use of
                  your account or any other breach of security.
                </p>
                <p className="mt-3">
                  We reserve the right to suspend, restrict or terminate
                  accounts, or refuse registration, at our discretion,
                  including for violations of these Terms or extended
                  inactivity.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  3. Scope of Services & Our Role
                </h3>
                <p className="mb-3">
                  The Site is a platform that connects Users (clients) with
                  Lawyers / Legal Experts to obtain legal advice, drafting,
                  consultations, dispute resolution services, and related legal
                  services (“Legal Services”).
                </p>
                <p className="mb-3">
                  We facilitate the connection and certain operational features
                  (messaging, document upload, scheduling, etc.).
                </p>
                <p className="mb-3">
                  We are <strong>not</strong> the provider of legal services
                  ourselves.
                </p>
                <p className="mb-3">
                  Lawyers listed on the platform are independent professionals,
                  not employees, agents, or partners of MD Legal Tech
                  Solutions.
                </p>
                <p className="mb-3">
                  We have no direct control over their conduct or performance.
                </p>
                <p className="mb-3">
                  Any dispute, claim, professional negligence, or other issue
                  arising from the legal services provided must be addressed
                  directly between you and the Lawyer.
                </p>
                <p className="mb-3">
                  We disclaim liability for any damages or costs arising out of
                  or in connection with the legal services you obtain via the
                  Site.
                </p>
                <p className="mb-3">
                  All content on the Site (articles, FAQs, blogs, etc.) is for
                  general informational or educational purposes only, and does
                  not constitute legal advice.
                </p>
                <p>
                  Use of such content does not create a lawyer-client
                  relationship.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  4. User Conduct & Restrictions
                </h3>
                <p className="mb-3">
                  You agree not to engage in any of the following:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    Use the Site for any unlawful, fraudulent, or harmful
                    purpose.
                  </li>
                  <li>
                    Post, upload, or transmit content that is false,
                    misleading, defamatory, harassing, or violates any third
                    party rights (intellectual property, privacy, etc.).
                  </li>
                  <li>
                    Impersonate others, misrepresent your affiliation, or use
                    deceptive trade practices.
                  </li>
                  <li>
                    Use the Site to harvest, collect or store personal data
                    about other users except as part of permitted
                    functionality.
                  </li>
                  <li>
                    Use viruses, bots, scrapers, or other automated or
                    malicious tools to access or harm the Site, or interfere
                    with its functioning.
                  </li>
                  <li>
                    Attempt to reverse engineer, decompile, disassemble, or
                    access the underlying code or architecture of the Site.
                  </li>
                  <li>
                    Use the site for non-permitted commercial purposes
                    (selling, reselling, or exploiting the platform) without
                    prior written consent.
                  </li>
                  <li>
                    Interfere with other users’ use or access to the Site.
                  </li>
                  <li>
                    Violate any applicable laws, regulations or ethical rules
                    of legal practice including solicitation rules.
                  </li>
                </ul>
                <p className="mt-3">
                  If you breach these rules, we may suspend or terminate your
                  access and seek legal remedies.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  5. Content, Intellectual Property & Licensing
                </h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  Your Content
                </h4>
                <p className="mb-3">
                  By posting, uploading, or submitting Content via the Site,
                  you grant us a nonexclusive, worldwide, royalty-free,
                  sublicensable license to use, reproduce, adapt, publish,
                  translate, distribute, display, and make derivative works of
                  such content in connection with the Site and our business,
                  subject to applicable rights.
                </p>
                <p className="mb-3">
                  You represent and warrant that you own or have rights to the
                  Content you upload, and that its use does not violate any
                  third-party rights.
                </p>
                <p className="mb-3">
                  We may remove or refuse any Content that violates these Terms
                  or is objectionable, in our discretion, without liability.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-4 font-['Lora']">
                  Site Content & Materials
                </h4>
                <p className="mb-3">
                  All content, features, text, graphics, software, logos,
                  trademarks, designs and other intellectual property on the
                  Site (“Site Materials”) are owned by us or our licensors,
                  except where otherwise indicated.
                </p>
                <p>
                  You may access and view the Site Materials for personal,
                  noncommercial use only, subject to these Terms (i.e., you
                  cannot copy, modify, distribute, or exploit them without our
                  written permission).
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  6. Payments, Fees & Refunds
                </h3>
                <p className="mb-3">
                  (This section should be adapted based on your business
                  model.)
                </p>
                <p className="mb-3">
                  Some services on the Site may be chargeable (consultations,
                  document drafting, packages, etc.).
                </p>
                <p className="mb-3">
                  You agree to pay all fees as per the pricing displayed at the
                  time of purchase, plus any applicable taxes.
                </p>
                <p className="mb-3">
                  Payment processing will be handled by third-party payment
                  service providers (e.g. Razorpay, Stripe, etc.) and is
                  subject to their terms.
                </p>
                <p className="mb-3">
                  We reserve the right to change the pricing or fees from time
                  to time.
                </p>
                <p className="mb-3">
                  In case of any change, existing users will be notified or
                  bound as per the then-current terms.
                </p>
                <p className="mb-3">
                  Refunds or cancellations will be governed by our separate
                  Refund Policy (if you have one).
                </p>
                <p>
                  Unless specified otherwise, fees are non-refundable after
                  services have commenced.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  7. Disclaimers & Limitation of Liability
                </h3>
                <p className="mb-3">
                  The Site and Services are provided <strong>“as is”</strong>{" "}
                  and <strong>“as available,”</strong> with no representations
                  or warranties of any kind, whether express or implied.
                </p>
                <p className="mb-3">
                  We disclaim warranties including but not limited to
                  merchantability, fitness for a particular purpose, accuracy,
                  completeness, and noninfringement.
                </p>
                <p className="mb-3">
                  We do not guarantee that the Site will be uninterrupted,
                  error-free, secure, or free from harmful components or data
                  breaches.
                </p>
                <p className="mb-3">
                  In no event shall MD Legal Tech Solutions, its affiliates,
                  proprietors, employees, officers, or licensors be liable for
                  any indirect, incidental, special, punitive or consequential
                  damages, including loss of profits, data, goodwill, or
                  business interruption, arising out of or related to your use
                  (or inability to use) the Site or Services, even if we have
                  been advised of the possibility of such damages.
                </p>
                <p className="mb-3">
                  Our aggregate liability, in any circumstance, is limited to
                  the amount you paid, if any, for the particular service that
                  gave rise to the claim.
                </p>
                <p className="mb-3">
                  Some jurisdictions do not allow exclusion or limitation of
                  liability or certain damages; so some of the above exclusions
                  may not apply to you to the extent prohibited by applicable
                  law.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  8. Indemnification
                </h3>
                <p className="mb-3">
                  You agree to defend, indemnify and hold harmless MD Legal
                  Tech Solutions (and its officers, directors, proprietors,
                  employees, agents, affiliates) from any claims, liabilities,
                  losses, damages, costs, or expenses (including reasonable
                  legal fees) arising out of or relating to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>Your use or misuse of the Site or Services;</li>
                  <li>Your violation of these Terms;</li>
                  <li>
                    Your violation of any third-party rights (intellectual
                    property, privacy, etc.);
                  </li>
                  <li>Any content you post or transmit via the Site.</li>
                </ul>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  9. Termination
                </h3>
                <p className="mb-3">
                  We may suspend or terminate your account or access to the
                  Site (or any portion thereof) at our discretion, with or
                  without notice, for conduct we believe violates these Terms
                  or is harmful to others, our business, or third parties.
                </p>
                <p className="mb-3">
                  Upon termination, all rights granted to you under these Terms
                  immediately cease. You must cease all use of the Site.
                </p>
                <p className="mb-3">
                  We may delete or disable access to your account and Content.
                </p>
                <p>
                  Sections regarding liability, indemnification, intellectual
                  property, disclaimers, and such will survive termination.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  10. Modifications to Terms
                </h3>
                <p className="mb-3">
                  We may revise or modify these Terms from time to time.
                </p>
                <p className="mb-3">
                  The updated version will be posted on the Site with a revised
                  effective date.
                </p>
                <p className="mb-3">
                  For material changes, we may provide additional notice (e.g.
                  via email).
                </p>
                <p>
                  Continued use after changes constitutes your acceptance of
                  the updated Terms.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  11. Governing Law & Dispute Resolution
                </h3>
                <p className="mb-3">
                  These Terms shall be governed by and construed in accordance
                  with the laws of India, without regard to its conflict-of-law
                  provisions.
                </p>
                <p className="mb-3">
                  Any dispute, claim or controversy arising out of or relating
                  to these Terms, the Site, or Services shall be subject to the
                  exclusive jurisdiction of the courts located in Bulandshahr,
                  Uttar Pradesh, India.
                </p>
                <p className="mb-3">
                  You agree that any legal action must be initiated within one
                  (1) year from the date the cause of action arises, else it is
                  waived.
                </p>
                <p>
                  If any provision of these Terms is found invalid or
                  unenforceable, the remaining provisions shall remain in full
                  force and effect.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  12. Miscellaneous
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-amber-700">
                  <li>
                    <strong>No Waiver:</strong> Failure to enforce any right
                    under these Terms does not constitute a waiver of that
                    right.
                  </li>
                  <li>
                    <strong>Severability:</strong> If a court finds any
                    provision of these Terms invalid, the remainder will
                    continue in effect.
                  </li>
                  <li>
                    <strong>Assignment:</strong> You may not assign your rights
                    under these Terms. We may assign or transfer our rights or
                    obligations.
                  </li>
                  <li>
                    <strong>Notices:</strong> Any notices or communications
                    under these Terms must be in writing and may be delivered
                    via email or posted on the Site.
                  </li>
                  <li>
                    <strong>Entire Agreement:</strong> These Terms, together
                    with the Privacy Policy and any other referenced policies,
                    constitute the entire agreement between you and us
                    regarding the subject matter and supersede prior
                    agreements.
                  </li>
                </ul>
              </div>

              {/* Contact Info from old file (if needed, or remove if not in new doc) */}
              {/* <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Lora']">
                  Contact Information
                </h3>
                <p>
                  If you have any questions about these Terms & Conditions,
                  please contact us at{" "}
                  <a
                    href={`mailto:${COMPANY_CONFIG.contact.email}`}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    {COMPANY_CONFIG.contact.email}
                  </a>{" "}
                  or call us at{" "}
                  <a
                    href={`tel:${COMPANY_CONFIG.contact.phone}`}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    {COMPANY_CONFIG.contact.phone}
                  </a>
                  .
                </p>
              </div> */}
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