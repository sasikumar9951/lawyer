import Navbar from "@/components/non-auth-comp/navbar";
import CursorEffect from "@/components/ui/cursor-effect";
import C1 from "@/components/non-auth-comp/c1";
import LawyerRegistrationForm from "@/components/non-auth-comp/lawyer-registration-form";
import C3 from "@/components/non-auth-comp/c3";
import Tenth from "@/components/non-auth-comp/tenth";
import { COMPANY_CONFIG } from "@/components/non-auth-comp/company-config";

export default function LawyerRegistrationPage() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <C1 title="Lawyer Registration" breadcrumbLabel="Lawyer registration" />
      <LawyerRegistrationForm />
      {/* <C3
        title="Join Our Network"
        subtitle="Connect with our team and become part of our growing legal network"
      /> */}
      <Tenth
        companyName={COMPANY_CONFIG.name}
        companyDescription="Join Vakilfy's network of qualified lawyers and expand your legal practice with our comprehensive platform."
        contactInfo={{
          address: COMPANY_CONFIG.contact.address,
          phone: COMPANY_CONFIG.contact.phone,
          email: COMPANY_CONFIG.lawyerContact.email,
        }}
        newsletterTitle="Stay Connected"
        newsletterDescription="Get updates about new opportunities and legal industry insights."
        showNewsletter={true}
        copyrightText="© 2025 Vakilfy - Lawyer Network"
      />
    </main>
  );
}
