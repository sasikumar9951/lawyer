export const COMPANY_CONFIG = {
  // Company Information
  name: "Vakilfy",
  description:
    "Vakilfy is a leading law firm in the India, providing legal services & corporates in commercial & family matters.",

  // Contact Information
  contact: {
    email: "hello@vakilfy.com",
    phone: "+91 8979096507",
    address: [
      "Space No. 2/2, MD Tower",
      "Awas Vikas Colony 1st",
      "Ward 2(3)(2)",
      "Bulandshahr, Uttar Pradesh 203001",
    ],
  },

  // Lawyer-specific contact
  lawyerContact: {
    email: "hello@vakilfy.com",
  },

  // CEO Information
  ceo: {
    name: "Albert Homer",
    title: "CEO, Vakilfy Law firm",
  },

  // Copyright
  copyright: "© 2025 developd by 3RP-Technetium",


  // Social Media (if needed in future)
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
};

export type CompanyConfig = typeof COMPANY_CONFIG;
