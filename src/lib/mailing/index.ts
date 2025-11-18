import { transporter, createTransporter, MailConfig } from "./config";
import {
  generatePaymentSuccessEmail,
  PaymentSuccessTemplateParams,
} from "./templates/payment-success";
import {
  generatePaymentFailureEmail,
  PaymentFailureTemplateParams,
} from "./templates/payment-failure";
import {
  generateCaseAssignedEmail,
  CaseAssignedTemplateParams,
} from "./templates/case-assigned";
import {
  generateCaseStatusUpdateEmail,
  CaseStatusUpdateTemplateParams,
} from "./templates/case-status-update";
import {
  generateMeetingNotificationEmail,
  MeetingNotificationTemplateParams,
} from "./templates/meeting-notification";

export type SendEmailParams = {
  to: string;
  from?: string;
  config?: MailConfig;
  format?: "html" | "text" | "both";
};

export type SendPaymentSuccessEmailParams = SendEmailParams &
  PaymentSuccessTemplateParams;
export type SendPaymentFailureEmailParams = SendEmailParams &
  PaymentFailureTemplateParams;
export type SendCaseAssignedEmailParams = SendEmailParams &
  CaseAssignedTemplateParams;
export type SendCaseStatusUpdateEmailParams = SendEmailParams &
  CaseStatusUpdateTemplateParams;
export type SendMeetingNotificationEmailParams = SendEmailParams &
  MeetingNotificationTemplateParams;

const sendEmail = async (
  params: SendEmailParams & { subject: string; html?: string; text: string }
) => {
  const { to, from, config, subject, html, text, format = "both" } = params;

  // Use custom config if provided, otherwise use the default transporter
  const emailTransporter = config ? createTransporter(config) : transporter;

  const mailOptions: any = {
    from: from || process.env.NODEMAILER_EMAIL,
    to,
    subject,
  };

  // Add content based on format preference
  if (format === "html" || format === "both") {
    mailOptions.html = html;
  }
  if (format === "text" || format === "both") {
    mailOptions.text = text;
  }

  try {
    const result = await emailTransporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const sendPaymentSuccessEmail = async (
  params: SendPaymentSuccessEmailParams
) => {
  const { to, from, config, format, ...templateParams } = params;
  const emailContent = await generatePaymentSuccessEmail(templateParams);

  return sendEmail({
    to,
    from,
    config,
    format,
    subject: emailContent.subject,
    html: emailContent.html || undefined,
    text: emailContent.text,
  });
};

export const sendPaymentFailureEmail = async (
  params: SendPaymentFailureEmailParams
) => {
  const { to, from, config, format, ...templateParams } = params;
  const emailContent = await generatePaymentFailureEmail(templateParams);

  return sendEmail({
    to,
    from,
    config,
    format,
    subject: emailContent.subject,
    html: emailContent.html || undefined,
    text: emailContent.text,
  });
};

export const sendCaseAssignedEmail = async (
  params: SendCaseAssignedEmailParams
) => {
  const { to, from, config, format, ...templateParams } = params;
  const emailContent = await generateCaseAssignedEmail(templateParams);

  return sendEmail({
    to,
    from,
    config,
    format,
    subject: emailContent.subject,
    html: emailContent.html || undefined,
    text: emailContent.text,
  });
};

export const sendCaseStatusUpdateEmail = async (
  params: SendCaseStatusUpdateEmailParams
) => {
  const { to, from, config, format, ...templateParams } = params;
  const emailContent = await generateCaseStatusUpdateEmail(templateParams);

  return sendEmail({
    to,
    from,
    config,
    format,
    subject: emailContent.subject,
    html: emailContent.html || undefined,
    text: emailContent.text,
  });
};

export const sendMeetingNotificationEmail = async (
  params: SendMeetingNotificationEmailParams
) => {
  const { to, from, config, format, ...templateParams } = params;
  const emailContent = await generateMeetingNotificationEmail(templateParams);

  return sendEmail({
    to,
    from,
    config,
    format,
    subject: emailContent.subject,
    html: emailContent.html || undefined,
    text: emailContent.text,
  });
};

// Export types for external use
export type {
  PaymentSuccessTemplateParams,
  PaymentFailureTemplateParams,
  CaseAssignedTemplateParams,
  CaseStatusUpdateTemplateParams,
  MeetingNotificationTemplateParams,
  MailConfig,
};
