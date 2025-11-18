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

export type PaymentFailureTemplateParams = {
  customerName: string;
  serviceName: string;
  amount: number;
  errorMessage: string;
  caseId: string;
  companyName: string;
};

export const generatePaymentFailureEmail = async (
  params: PaymentFailureTemplateParams
) => {
  const {
    customerName,
    serviceName,
    amount,
    errorMessage,
    caseId,
    companyName,
  } = params;

  const htmlContent = (
    <Html>
      <Head />
      <Preview>Payment Failed - {serviceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Failed</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            We're sorry, but your payment for <strong>{serviceName}</strong>{" "}
            could not be processed.
          </Text>

          <Section style={boxContainer}>
            <Heading as="h3" style={h3}>
              Payment Details:
            </Heading>
            <Text style={detailText}>
              <strong>Amount:</strong> ₹{amount}
            </Text>
            <Text style={detailText}>
              <strong>Case ID:</strong> {caseId}
            </Text>
            <Text style={detailText}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={detailText}>
              <strong>Error:</strong> {errorMessage}
            </Text>
          </Section>

          <Text style={text}>
            Please try again with a different payment method or contact your
            bank if the issue persists.
          </Text>

          <Text style={text}>
            If you continue to experience issues, please contact our support
            team for assistance.
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
    Payment Failed
    
    Dear ${customerName},
    
    We're sorry, but your payment for ${serviceName} could not be processed.
    
    Payment Details:
    - Amount: ₹${amount}
    - Case ID: ${caseId}
    - Service: ${serviceName}
    - Error: ${errorMessage}
    
    Please try again with a different payment method or contact your bank if the issue persists.
    
    If you continue to experience issues, please contact our support team for assistance.
    
    Best regards,
    Team ${companyName}
  `;

  return {
    subject: `Payment Failed - ${serviceName}`,
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
  color: "#dc3545",
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
