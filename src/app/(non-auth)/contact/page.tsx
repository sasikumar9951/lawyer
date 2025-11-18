import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import C2 from "@/components/non-auth-comp/c2";
import C3 from "@/components/non-auth-comp/c3";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Contact Us" breadcrumbLabel="Contact us" />
      <C2 />
      {/* <C3
        title="Our Offices"
        subtitle="Find us at these locations for legal consultation and support"
      /> */}
      <Tenth
        companyName={COMPANY_CONFIG.name}
        companyDescription={COMPANY_CONFIG.description}
        contactInfo={{
          address: COMPANY_CONFIG.contact.address,
          phone: COMPANY_CONFIG.contact.phone,
          email: COMPANY_CONFIG.contact.email,
        }}
        newsletterTitle={COMPANY_CONFIG.newsletter.title}
        newsletterDescription={COMPANY_CONFIG.newsletter.description}
        showNewsletter={true}
        copyrightText={COMPANY_CONFIG.copyright}
      />
    </main>
  );
}
