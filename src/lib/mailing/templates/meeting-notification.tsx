import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { render } from "@react-email/render";

export type MeetingNotificationTemplateParams = {
  recipientName: string;
  meetingName: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  linkOrNumber?: string;
  caseId: string;
  serviceName: string;
  companyName: string;
};

export const generateMeetingNotificationEmail = async (
  params: MeetingNotificationTemplateParams
) => {
  const {
    recipientName,
    meetingName,
    startTime,
    endTime,
    duration,
    linkOrNumber,
    caseId,
    serviceName,
    companyName,
  } = params;

  const formatTime = (time: string) => {
    return new Date(time).toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = endTime ? formatTime(endTime) : null;

  const htmlContent = (
    <Html>
      <Head />
      <Preview>Meeting Scheduled - {meetingName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Meeting Scheduled</Heading>

          <Text style={text}>Dear {recipientName},</Text>

          <Text style={text}>
            A meeting has been scheduled for your case{" "}
            <strong>{serviceName}</strong>.
          </Text>

          <Section style={boxContainer}>
            <Heading as="h3" style={h3}>
              Meeting Details:
            </Heading>
            <Text style={detailText}>
              <strong>Meeting Name:</strong> {meetingName}
            </Text>
            <Text style={detailText}>
              <strong>Start Time:</strong> {formattedStartTime}
            </Text>
            {formattedEndTime && (
              <Text style={detailText}>
                <strong>End Time:</strong> {formattedEndTime}
              </Text>
            )}
            {duration && (
              <Text style={detailText}>
                <strong>Duration:</strong> {duration} minutes
              </Text>
            )}
            <Text style={detailText}>
              <strong>Case ID:</strong> {caseId}
            </Text>
            <Text style={detailText}>
              <strong>Service:</strong> {serviceName}
            </Text>
            {linkOrNumber && (
              <Text style={detailText}>
                <strong>Meeting Link/Number:</strong> {linkOrNumber}
              </Text>
            )}
          </Section>

          <Text style={text}>
            Please make sure to join the meeting on time. If you need to
            reschedule, please contact us as soon as possible.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Best regards,
            <br />
            Team {companyName}
          </Text>
        </Container>
      </Body>
    </Html>
  );

  const textContent = `
    Meeting Scheduled
    
    Dear ${recipientName},
    
    A meeting has been scheduled for your case ${serviceName}.
    
    Meeting Details:
    - Meeting Name: ${meetingName}
    - Start Time: ${formattedStartTime}
    ${formattedEndTime ? `- End Time: ${formattedEndTime}` : ""}
    ${duration ? `- Duration: ${duration} minutes` : ""}
    - Case ID: ${caseId}
    - Service: ${serviceName}
    ${linkOrNumber ? `- Meeting Link/Number: ${linkOrNumber}` : ""}
    
    Please make sure to join the meeting on time. If you need to reschedule, please contact us as soon as possible.
    
    Best regards,
    Team ${companyName}
  `;

  return {
    subject: `Meeting Scheduled - ${meetingName}`,
    html: await render(htmlContent),
    text: textContent,
  };
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#28a745",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const h3 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px 0",
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "26px",
};

const detailText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "5px 0",
};

const boxContainer = {
  background: "#f8f9fa",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "22px",
};
