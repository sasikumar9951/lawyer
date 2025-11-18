import { Lawyer } from "@/generated/prisma";

// Base lawyer type without id and timestamps
export type CreateLawyerRequest = Omit<
  Lawyer,
  "id" | "createdAt" | "updatedAt" | "cases"
>;

// Update lawyer type (all fields optional except id)
export type UpdateLawyerRequest = Partial<
  Omit<Lawyer, "id" | "createdAt" | "updatedAt" | "cases">
> & {
  id: string;
};

// Lawyer response type
export type LawyerResponse = Lawyer & {
  cases: Array<{
    id: string;
    status: string;
    customerName: string;
    customerEmail: string;
    createdAt: Date;
  }>;
};

// API response types
export type GetLawyersResponse = {
  lawyers: LawyerResponse[];
  total: number;
};

export type GetLawyerResponse = {
  lawyer: LawyerResponse;
};

export type CreateLawyerResponse = {
  lawyer: LawyerResponse;
  message: string;
};

export type UpdateLawyerResponse = {
  lawyer: LawyerResponse;
  message: string;
};

export type AppendLawyerRemarkRequest = {
  remark: string;
};

export type AppendLawyerRemarkResponse = {
  remarks: string[];
  message: string;
};
