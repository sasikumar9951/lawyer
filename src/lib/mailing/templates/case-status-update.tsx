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

export type CaseStatusUpdateTemplateParams = {
  customerName: string;
  serviceName: string;
  caseId: string;
  oldStatus: string;
  newStatus: string;
  companyName: string;
};

export const generateCaseStatusUpdateEmail = async (
  params: CaseStatusUpdateTemplateParams
) => {
  const {
    customerName,
    serviceName,
    caseId,
    oldStatus,
    newStatus,
    companyName,
  } = params;

  const htmlContent = (
    <Html>
      <Head />
      <Preview>Case Status Updated - {serviceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Case Status Updated</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Your case status for <strong>{serviceName}</strong> has been
            updated.
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
              <strong>Previous Status:</strong> {oldStatus}
            </Text>
            <Text style={detailText}>
              <strong>New Status:</strong>{" "}
              <span style={{ color: "#007bff", fontWeight: "bold" }}>
                {newStatus}
              </span>
            </Text>
          </Section>

          <Text style={text}>
            We will keep you updated on any further developments regarding your
            case.
          </Text>

          <Text style={text}>
            If you have any questions, please don't hesitate to contact us.
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
    Case Status Updated
    
    Dear ${customerName},
    
    Your case status for ${serviceName} has been updated.
    
    Case Details:
    - Case ID: ${caseId}
    - Service: ${serviceName}
    - Previous Status: ${oldStatus}
    - New Status: ${newStatus}
    
    We will keep you updated on any further developments regarding your case.
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    Team ${companyName}
  `;

  return {
    subject: `Case Status Updated - ${serviceName}`,
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
  color: "#17a2b8",
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
