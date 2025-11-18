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

export type CaseAssignedTemplateParams = {
  lawyerName: string;
  customerName: string;
  serviceName: string;
  caseId: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
};

export const generateCaseAssignedEmail = async (
  params: CaseAssignedTemplateParams
) => {
  const {
    lawyerName,
    customerName,
    serviceName,
    caseId,
    customerEmail,
    customerPhone,
    companyName,
  } = params;

  const htmlContent = (
    <Html>
      <Head />
      <Preview>New Case Assigned - {serviceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Case Assigned</Heading>

          <Text style={text}>Dear {lawyerName},</Text>

          <Text style={text}>
            A new case has been assigned to you for{" "}
            <strong>{serviceName}</strong>.
          </Text>

          <Section style={boxContainer}>
            <Heading as="h3" style={h3}>
              Case Details:
            </Heading>
            <Text style={detailText}>
              <strong>Case ID:</strong> {caseId}
            </Text>
            <Text style={detailText}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={detailText}>
              <strong>Client Name:</strong> {customerName}
            </Text>
            <Text style={detailText}>
              <strong>Client Email:</strong> {customerEmail}
            </Text>
            <Text style={detailText}>
              <strong>Client Phone:</strong> {customerPhone}
            </Text>
          </Section>

          <Text style={text}>
            Please review the case details and contact the client as soon as
            possible to begin working on their case.
          </Text>

          <Text style={text}>
            You can access the case details through your dashboard.
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
    New Case Assigned
    
    Dear ${lawyerName},
    
    A new case has been assigned to you for ${serviceName}.
    
    Case Details:
    - Case ID: ${caseId}
    - Service: ${serviceName}
    - Client Name: ${customerName}
    - Client Email: ${customerEmail}
    - Client Phone: ${customerPhone}
    
    Please review the case details and contact the client as soon as possible to begin working on their case.
    
    You can access the case details through your dashboard.
    
    Best regards,
    Team ${companyName}
  `;

  return {
    subject: `New Case Assigned - ${serviceName}`,
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
  color: "#007bff",
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
