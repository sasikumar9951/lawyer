import { NextRequest, NextResponse } from "next/server";
import { updateTemplateStatusByTwilioSid } from "@/lib/messaging/templates-service";
import type {
  TwilioTemplateWebhookRequest,
  GenericResponse,
} from "@/types/api/templates";

export const POST = async (req: NextRequest) => {
  const body = (await req.formData()) as any;
  const sid: string | undefined = body.get?.("Sid") ?? body.Sid;
  const statusRaw: string | undefined = body.get?.("Status") ?? body.Status;

  if (!sid || !statusRaw) {
    const r: GenericResponse = {
      success: false,
      error: "Missing Sid or Status",
    };
    return NextResponse.json(r, { status: 400 });
  }

  const normalized = statusRaw.toString().toUpperCase();
  const allowed = ["PENDING", "APPROVED", "REJECTED"] as const;
  const status = allowed.includes(normalized as any)
    ? (normalized as (typeof allowed)[number])
    : "PENDING";

  await updateTemplateStatusByTwilioSid(sid, status);
  const r: GenericResponse = { success: true };
  return NextResponse.json(r);
};
