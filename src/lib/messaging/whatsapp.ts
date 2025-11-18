import twilio from "twilio";

type SendWhatsAppTemplateMessageInput = {
  toPhoneE164: string;
  templateSid: string;
  variables?: Record<string, string | number | boolean>;
};

type SendWhatsAppTemplateMessageResult =
  | {
      success: true;
      sid: string;
      status: string | null;
    }
  | {
      success: false;
      error: string;
    };

const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured");
  }

  return twilio(accountSid, authToken);
};

export const sendWhatsAppTemplateMessage = async (
  input: SendWhatsAppTemplateMessageInput
): Promise<SendWhatsAppTemplateMessageResult> => {
  try {
    const client = getTwilioClient();

    const fromNumber =
      process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
    const to = input.toPhoneE164.startsWith("whatsapp:")
      ? input.toPhoneE164
      : `whatsapp:${input.toPhoneE164}`;

    const message = await client.messages.create({
      from: fromNumber,
      to,
      contentSid: input.templateSid,
      contentVariables: input.variables
        ? JSON.stringify(input.variables)
        : undefined,
    } as any);

    return {
      success: true,
      sid: message.sid,
      status: (message as any).status ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to send WhatsApp message",
    };
  }
};

export type {
  SendWhatsAppTemplateMessageInput,
  SendWhatsAppTemplateMessageResult,
};
