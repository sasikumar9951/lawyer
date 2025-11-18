import prisma from "@/lib/prisma";
import { sendWhatsAppTemplateMessage } from "@/lib/messaging/whatsapp";
import type { MessageType, RecipientType } from "@/generated/prisma";
import twilio from "twilio";

const getTwilioBasicAuthHeader = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return undefined;
  const creds = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  return `Basic ${creds}`;
};

type CreateTemplateInput = {
  friendlyName: string;
  body: string;
  language: string;
  category: string;
};

type CreateTemplateResult =
  | { success: true; id: string }
  | { success: false; error: string };

const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return undefined;
  return twilio(accountSid, authToken);
};

export const createWhatsAppTemplate = async (
  input: CreateTemplateInput
): Promise<CreateTemplateResult> => {
  const client = getTwilioClient();
  if (!client)
    return { success: false, error: "Twilio credentials are not configured" };

  try {
    const allowedCategories = [
      "UTILITY",
      "AUTHENTICATION",
      "MARKETING",
    ] as const;
    const normalizedCategory = (input.category || "UTILITY").toUpperCase();
    const category = (allowedCategories as readonly string[]).includes(
      normalizedCategory
    )
      ? normalizedCategory
      : "UTILITY";

    const originalBody = input.body || "";
    const nameVarRegex = /\{\{(.*?)\}\}/g;
    const uniqueNames: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = nameVarRegex.exec(originalBody)) !== null) {
      const name = match[1].trim();
      if (!uniqueNames.includes(name)) uniqueNames.push(name);
    }
    let index = 0;
    const numberizedBody = originalBody.replace(nameVarRegex, () => {
      index += 1;
      return `{{${index}}}`;
    });

    // Create via HTTP JSON to mirror working cURL (ensures friendly_name is respected in UI)
    const basicAuth = getTwilioBasicAuthHeader();
    if (!basicAuth)
      return { success: false, error: "Twilio credentials are not configured" };
    const createRes = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friendly_name: input.friendlyName,
        language: input.language,
        types: {
          "twilio/text": {
            body: numberizedBody,
          },
        },
      }),
    });
    if (!createRes.ok) {
      const errText = await createRes.text();
      return { success: false, error: errText || "Failed to create content" };
    }
    const content = (await createRes.json()) as { sid: string };

    const authHeader = getTwilioBasicAuthHeader();
    if (!authHeader)
      return { success: false, error: "Twilio credentials are not configured" };
    const approvalResp = await fetch(
      `https://content.twilio.com/v1/Content/${encodeURIComponent(
        content.sid
      )}/ApprovalRequests/whatsapp`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ Category: category }).toString(),
      }
    );
    if (!approvalResp.ok) {
      const errText = await approvalResp.text();
      return { success: false, error: errText || "Failed to submit approval" };
    }

    const created = await prisma.whatsAppTemplate.create({
      data: {
        twilioSid: content.sid,
        friendlyName: input.friendlyName,
        category: input.category,
        language: input.language,
        body: input.body,
        status: "PENDING",
        isActive: false,
      },
    });

    return { success: true, id: created.id };
  } catch (e: any) {
    const errPayload =
      e?.message || (typeof e === "string" ? e : "Unexpected error");
    return { success: false, error: errPayload };
  }
};

type SendWithTemplateInput = {
  templateId: string;
  toPhoneE164: string;
  recipientType: RecipientType;
  messageType: MessageType;
  caseId?: string | null;
  variables?: Record<string, string | number | boolean>;
};

export const sendWithApprovedActiveTemplate = async (
  input: SendWithTemplateInput
) => {
  const template = await prisma.whatsAppTemplate.findUnique({
    where: { id: input.templateId },
  });
  if (!template)
    return { success: false, error: "Template not found" } as const;
  if (template.status !== "APPROVED" || !template.isActive)
    return {
      success: false,
      error: "Template is not approved and active",
    } as const;

  const createdNotification = await prisma.whatsAppNotification.create({
    data: {
      recipientPhone: input.toPhoneE164,
      recipientType: input.recipientType,
      messageType: input.messageType,
      templateName: template.friendlyName,
      messageContent: JSON.stringify({
        body: template.body,
        variables: input.variables ?? {},
      }),
      status: "PENDING",
      templateId: template.id,
      caseId: input.caseId ?? null,
    },
  });

  const result = await sendWhatsAppTemplateMessage({
    toPhoneE164: input.toPhoneE164,
    templateSid: template.twilioSid,
    variables: input.variables,
  });

  if (result.success) {
    await prisma.whatsAppNotification.update({
      where: { id: createdNotification.id },
      data: {
        status: "SENT",
        twilioMessageSid: result.sid,
      },
    });
  } else {
    await prisma.whatsAppNotification.update({
      where: { id: createdNotification.id },
      data: {
        status: "FAILED",
        errorMessage: result.error,
        failedAt: new Date(),
      },
    });
  }

  return result;
};

export const updateTemplateStatusByTwilioSid = async (
  sid: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  await prisma.whatsAppTemplate.update({
    where: { twilioSid: sid },
    data: { status },
  });
};

export const setTemplateActive = async (id: string, isActive: boolean) => {
  await prisma.whatsAppTemplate.update({
    where: { id },
    data: { isActive },
  });
};

export const getTemplateMessageCount = async (templateId: string) => {
  return prisma.whatsAppNotification.count({ where: { templateId } });
};

export type { CreateTemplateInput };
