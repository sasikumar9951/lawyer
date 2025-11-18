export type CaseStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type CaseMeeting = {
  id: string;
  linkOrNumber: string;
  startTime?: string | null;
  endTime?: string | null;
  duration?: number | null;
  meetingNotes?: string | null;
  meetingName?: string | null;
  caseId: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiCase = {
  id: string;
  status: CaseStatus;
  isActive: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isAutoNotificationOn: boolean;
  createdAt: string;
  updatedAt: string;
  lawyerId?: string | null;
  serviceId: string;
  formResponseId?: string | null;
  service?: {
    id: string;
    name: string;
    slug: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  lawyer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  formResponse?: {
    id: string;
    rawJson: any;
  } | null;
  meetings?: CaseMeeting[];
};

export type CreateCaseRequest = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  formData?: any;
  lawyerId?: string | null;
  selectedPrices?: any[];
};

export type UpdateCaseRequest = {
  status?: CaseStatus;
  isActive?: boolean;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  lawyerId?: string | null;
  formResponseId?: string | null;
  isAutoNotificationOn?: boolean;
};

export type CasesResponse = {
  success: boolean;
  data: ApiCase[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
};

export type CaseResponse = {
  success: boolean;
  data: ApiCase;
  message?: string;
};

export type CreateMeetingRequest = {
  linkOrNumber: string;
  startTime?: string | null;
  endTime?: string | null;
  duration?: number | null;
  meetingNotes?: string | null;
  meetingName?: string | null;
};

export type MeetingResponse = {
  success: boolean;
  data: CaseMeeting;
  message?: string;
};

export type MeetingsResponse = {
  success: boolean;
  data: CaseMeeting[];
  message?: string;
};
