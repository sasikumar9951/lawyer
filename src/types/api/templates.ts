export type TemplateStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CreateTemplateRequest = {
  friendlyName: string;
  body: string;
  language: string;
  category: string;
};

export type CreateTemplateResponse =
  | { success: true; id: string }
  | { success: false; error: string };

export type ListTemplatesResponse = {
  success: true;
  data: Array<{
    id: string;
    friendlyName: string;
    category: string;
    language: string;
    body: string;
    status: TemplateStatus;
    isActive: boolean;
    twilioSid: string;
    createdAt: string;
    updatedAt: string;
    sentCount: number;
  }>;
};

export type ToggleTemplateActiveRequest = { isActive: boolean };
export type ToggleTemplateActiveResponse =
  | { success: true }
  | { success: false; error: string };

export type TwilioTemplateWebhookRequest = {
  Sid?: string;
  Status?: TemplateStatus | string;
};

export type GenericResponse =
  | { success: true }
  | { success: false; error: string };
