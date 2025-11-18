export type FormSchemaJson = unknown; // SurveyJS JSON schema object

export type FormType = "LAWYER_REGISTRATION" | "CONTACT_FORM" | "SERVICE_FORM";

export type AssociatedService = {
  id: string;
  name: string;
  categoryName: string;
};

export type ApiForm = {
  id: string;
  name: string;
  description?: string | null;
  type: FormType;
  schemaJson: FormSchemaJson | null;
  createdAt: string;
  updatedAt: string;
  responsesCount: number;
  associatedServices: AssociatedService[];
};

export type CreateFormRequest = {
  name: string;
  description?: string;
  schemaJson?: FormSchemaJson;
};

export type UpdateFormRequest = Partial<CreateFormRequest>;

export type UpdateFormTypeRequest = {
  type: FormType;
};

// Enhanced Survey Response Types
export type SurveyPageInfo = {
  name: string;
  title: string;
  index: number;
  description?: string;
};

export type SurveyPanelInfo = {
  name: string;
  title: string;
  description?: string;
};

export type QuestionChoice = {
  value: string | number;
  text: string;
};

export type QuestionMetadata = {
  questionIndex: number;
  hasComment: boolean;
  hasOther: boolean;
  inputType?: string;
  placeholder?: string;
};

export type DetailedQuestionResponse = {
  questionName: string;
  questionTitle: string;
  questionType: string;
  value: unknown;
  displayValue: string;
  page: SurveyPageInfo | null;
  panel: SurveyPanelInfo | null;
  isRequired: boolean;
  choices?: QuestionChoice[];
  metadata: QuestionMetadata;
};

export type SurveyInfo = {
  title?: string;
  description?: string;
  logoPosition?: string;
  completedHtml?: string;
  totalPages: number;
  totalQuestions: number;
  completedAt: string;
};

export type EnhancedSurveyResponse = {
  surveyInfo: SurveyInfo;
  simpleData: Record<string, unknown>;
  detailedResponses: DetailedQuestionResponse[];
  surveySchema: FormSchemaJson;
};

export type ApiFormResponse = {
  id: string;
  formId: string;
  createdAt: string;
  rawJson: EnhancedSurveyResponse | Record<string, unknown> | null;
};

// Type guard function to check if rawJson is an EnhancedSurveyResponse
export const isEnhancedSurveyResponse = (
  rawJson: unknown
): rawJson is EnhancedSurveyResponse => {
  return (
    typeof rawJson === "object" &&
    rawJson !== null &&
    "detailedResponses" in rawJson &&
    "surveyInfo" in rawJson &&
    "simpleData" in rawJson &&
    Array.isArray((rawJson as any).detailedResponses)
  );
};
