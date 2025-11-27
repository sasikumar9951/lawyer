// ==========================================
// Categories & Sub-Categories
// ==========================================

export interface ApiServiceSubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiServiceCategory {
  id: string;
  name: string;
  slug: string;
  subCategories: ApiServiceSubCategory[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Components (Price, FAQ, Rating)
// ==========================================

export type ApiServicePrice = {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  discountAmount?: number | null;
  isCompulsory: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiServiceFAQ = {
  id: string;
  serviceId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiServiceRating = {
  id: string;
  serviceId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiServiceTestimonial = {
  id: string;
  serviceId: string;
  author?: string | null;
  role?: string | null;
  text: string;
  rating?: number | null;
  isFeatured: boolean;
  order?: number | null;
  createdAt: string;
  updatedAt: string;
};

// ==========================================
// Main Service Type (Updated)
// ==========================================

export type ApiService = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  contentJson?: ServiceContent | null;

  // Category Relations
  categoryName: string;
  category?: ApiServiceCategory;

  // ⭐ NEW: Sub-Category Relation
  subCategoryId?: string | null;
  subCategory?: ApiServiceSubCategory | null;

  formId: string;
  form?: {
    id: string;
    name: string;
    description?: string | null;
    schemaJson?: any;
  };

  // ⭐ NEW: Hero & Content Images
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: string | null;
  contentImage?: string | null;
  // ⭐ SEO Meta
  metaTitle?: string | null;
  metaDescription?: string | null;

  faqs?: ApiServiceFAQ[];
  price?: ApiServicePrice[];
  rating?: ApiServiceRating[];
  testimonials?: ApiServiceTestimonial[];

  createdAt: string;
  updatedAt: string;
};

// ==========================================
// Request Types
// ==========================================

export type CreateServiceCategoryRequest = {
  name: string;
  parentId?: string;
  type: "CATEGORY" | "SUB_CATEGORY";
};

export type UpdateServiceCategoryRequest = {
  name?: string;
};

export type CreateServicePriceRequest = {
  name: string;
  price: number;
  discountAmount?: number;
  isCompulsory?: boolean;
};

export type CreateServiceFAQRequest = {
  question: string;
  answer: string;
};

// ⭐ Updated: Added new fields here
export type CreateServiceRequest = {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;

  categoryName: string;
  subCategoryId?: string; // New

  formId: string;

  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  contentImage?: string;
  // SEO Meta
  metaTitle?: string;
  metaDescription?: string;

  faqs?: CreateServiceFAQRequest[];
  prices?: CreateServicePriceRequest[];
  content?: ServiceContent;
};

// ⭐ Updated: Added new fields here
export type UpdateServiceRequest = {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;

  categoryName?: string;
  subCategoryId?: string; // New

  formId?: string;

  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  contentImage?: string;
  // SEO Meta
  metaTitle?: string;
  metaDescription?: string;

  faqs?: CreateServiceFAQRequest[];
  prices?: CreateServicePriceRequest[];
  content?: ServiceContent;
};

// ==========================================
// Response Types
// ==========================================

export type ServiceCategoriesResponse = {
  success: boolean;
  data: ApiServiceCategory[];
  message?: string;
};

export type ServiceCategoryResponse = {
  success: boolean;
  data: ApiServiceCategory | ApiServiceSubCategory;
  message?: string;
};

export type ServicesResponse = {
  success: boolean;
  data: ApiService[];
  message?: string;
};

export type ServiceResponse = {
  success: boolean;
  data: ApiService;
  message?: string;
};

// ==========================================
// Builder Data Types
// ==========================================

export type BuilderFormOption = {
  id: string;
  name: string;
};

export type BuilderSubCategoryOption = {
  id: string;
  name: string;
};

// ⭐ Updated: Include subCategories for dropdown
export type BuilderCategoryOption = {
  id: string;
  name: string;
  subCategories: BuilderSubCategoryOption[];
};

export type ServiceBuilderDataResponse = {
  success: boolean;
  data: {
    categories: BuilderCategoryOption[];
    forms: BuilderFormOption[];
  };
  message?: string;
};

// ==========================================
// Table Data Types
// ==========================================

export type ServiceTableData = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categoryName: string;
  categorySlug: string;
  subCategoryName?: string | null; // ⭐ New
  formName: string;
  createdAt: string;
};

export type ServicesTableResponse = {
  success: boolean;
  data: ServiceTableData[];
  message?: string;
};

// ==========================================
// Content Block Types (No Changes)
// ==========================================

export type ListContentBlock = {
  type: "list";
  title: string;
  description?: string;
  points: string[];
};

export type TextContentBlock = {
  type: "text";
  title: string;
  content: string;
};

export type DeliverablesContentBlock = {
  type: "deliverables";
  title: string;
  description?: string;
  items: string[];
};

export type ContentBlock =
  | ListContentBlock
  | TextContentBlock
  | DeliverablesContentBlock;

export type ServiceContent = {
  blocks: ContentBlock[];
};
