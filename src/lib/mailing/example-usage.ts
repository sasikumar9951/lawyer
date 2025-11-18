import {
  sendPaymentSuccessEmail,
  sendPaymentFailureEmail,
  sendCaseAssignedEmail,
  sendCaseStatusUpdateEmail,
  sendMeetingNotificationEmail,
} from "./index";

// Example usage of the mailing system

export const examplePaymentSuccess = async () => {
  const result = await sendPaymentSuccessEmail({
    to: "customer@example.com",
    customerName: "John Doe",
    serviceName: "Legal Consultation",
    amount: 5000,
    transactionId: "TXN123456789",
    caseId: "CASE001",
    companyName: "Vakilfy.com",
  });

  console.log("Payment success email result:", result);
};

export const examplePaymentFailure = async () => {
  const result = await sendPaymentFailureEmail({
    to: "customer@example.com",
    customerName: "John Doe",
    serviceName: "Legal Consultation",
    amount: 5000,
    errorMessage: "Insufficient funds",
    caseId: "CASE001",
    companyName: "Vakilfy.com",
  });

  console.log("Payment failure email result:", result);
};

export const exampleCaseAssigned = async () => {
  const result = await sendCaseAssignedEmail({
    to: "lawyer@example.com",
    lawyerName: "Advocate Smith",
    customerName: "John Doe",
    serviceName: "Legal Consultation",
    caseId: "CASE001",
    customerEmail: "customer@example.com",
    customerPhone: "+91-9876543210",
    companyName: "Vakilfy.com",
  });

  console.log("Case assigned email result:", result);
};

export const exampleCaseStatusUpdate = async () => {
  const result = await sendCaseStatusUpdateEmail({
    to: "customer@example.com",
    customerName: "John Doe",
    serviceName: "Legal Consultation",
    caseId: "CASE001",
    oldStatus: "PENDING",
    newStatus: "IN_PROGRESS",
    companyName: "Vakilfy.com",
  });

  console.log("Case status update email result:", result);
};

export const exampleMeetingNotification = async () => {
  const result = await sendMeetingNotificationEmail({
    to: "customer@example.com",
    recipientName: "John Doe",
    meetingName: "Initial Consultation",
    startTime: "2024-01-15T10:00:00Z",
    endTime: "2024-01-15T11:00:00Z",
    duration: 60,
    linkOrNumber: "https://meet.google.com/abc-defg-hij",
    caseId: "CASE001",
    serviceName: "Legal Consultation",
    companyName: "Vakilfy.com",
  });

  console.log("Meeting notification email result:", result);
};

// Example with custom SMTP configuration
export const exampleWithCustomConfig = async () => {
  const result = await sendPaymentSuccessEmail({
    to: "customer@example.com",
    customerName: "John Doe",
    serviceName: "Legal Consultation",
    amount: 5000,
    transactionId: "TXN123456789",
    caseId: "CASE001",
    companyName: "Vakilfy.com",
    config: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password",
      },
    },
  });

  console.log("Custom config email result:", result);
};
