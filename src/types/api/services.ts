export type ApiServiceCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

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

export type ApiService = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  contentJson?: ServiceContent | null;
  categoryName: string;
  formId: string;
  createdAt: string;
  updatedAt: string;
  category?: ApiServiceCategory;
  form?: {
    id: string;
    name: string;
    description?: string | null;
    schemaJson?: any;
  };
  faqs?: ApiServiceFAQ[];
  price?: ApiServicePrice[];
  rating?: ApiServiceRating[];
};

// Request types
export type CreateServiceCategoryRequest = {
  name: string;
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

export type CreateServiceRequest = {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  categoryName: string;
  formId: string;
  faqs?: CreateServiceFAQRequest[];
  prices?: CreateServicePriceRequest[];
  content?: ServiceContent;
};

export type UpdateServiceRequest = {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  categoryName?: string;
  formId?: string;
  faqs?: CreateServiceFAQRequest[];
  prices?: CreateServicePriceRequest[];
  content?: ServiceContent;
};

// Response types
export type ServiceCategoriesResponse = {
  success: boolean;
  data: ApiServiceCategory[];
  message?: string;
};

export type ServiceCategoryResponse = {
  success: boolean;
  data: ApiServiceCategory;
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

// Builder-specific types for minimal data
export type BuilderFormOption = {
  id: string;
  name: string;
};

export type BuilderCategoryOption = {
  id: string;
  name: string;
};

export type ServiceBuilderDataResponse = {
  success: boolean;
  data: {
    categories: BuilderCategoryOption[];
    forms: BuilderFormOption[];
  };
  message?: string;
};

// Table-specific types for minimal data display
export type ServiceTableData = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categoryName: string;
  categorySlug: string;
  formName: string;
  createdAt: string;
};

export type ServicesTableResponse = {
  success: boolean;
  data: ServiceTableData[];
  message?: string;
};

// Content Block Types
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
