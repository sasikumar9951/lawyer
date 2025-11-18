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

export type PaymentSuccessTemplateParams = {
  customerName: string;
  serviceName: string;
  amount: number;
  transactionId: string;
  caseId: string;
  companyName: string;
};

export const generatePaymentSuccessEmail = async (
  params: PaymentSuccessTemplateParams
) => {
  const {
    customerName,
    serviceName,
    amount,
    transactionId,
    caseId,
    companyName,
  } = params;

  const htmlContent = (
    <Html>
      <Head />
      <Preview>Payment Successful - {serviceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Successful!</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Your payment for <strong>{serviceName}</strong> has been processed
            successfully.
          </Text>

          <Section style={boxContainer}>
            <Heading as="h3" style={h3}>
              Payment Details:
            </Heading>
            <Text style={detailText}>
              <strong>Amount:</strong> ₹{amount}
            </Text>
            <Text style={detailText}>
              <strong>Transaction ID:</strong> {transactionId}
            </Text>
            <Text style={detailText}>
              <strong>Case ID:</strong> {caseId}
            </Text>
            <Text style={detailText}>
              <strong>Service:</strong> {serviceName}
            </Text>
          </Section>

          <Text style={text}>
            Our team will review your case and get back to you shortly. You will
            receive updates about your case status via email and WhatsApp.
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
    Payment Successful!
    
    Dear ${customerName},
    
    Your payment for ${serviceName} has been processed successfully.
    
    Payment Details:
    - Amount: ₹${amount}
    - Transaction ID: ${transactionId}
    - Case ID: ${caseId}
    - Service: ${serviceName}
    
    Our team will review your case and get back to you shortly. You will receive updates about your case status via email and WhatsApp.
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    Team ${companyName}
  `;

  return {
    subject: `Payment Successful - ${serviceName}`,
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
