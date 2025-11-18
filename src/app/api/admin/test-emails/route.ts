import { NextRequest, NextResponse } from "next/server";
import {
  sendPaymentSuccessEmail,
  sendPaymentFailureEmail,
  sendCaseAssignedEmail,
  sendCaseStatusUpdateEmail,
  sendMeetingNotificationEmail,
} from "@/lib/mailing";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email") || "test@example.com";
    const testType = searchParams.get("type") || "all";
    const fireAll = searchParams.get("fireAll") === "true";
    const format = searchParams.get("format") || "both";

    const testData = {
      customerName: "John Doe",
      serviceName: "Legal Consultation",
      amount: 5000,
      transactionId: "TXN123456789",
      caseId: "CASE001",
      companyName: "Vakilfy.com",
      errorMessage: "Insufficient funds",
      lawyerName: "Advocate Smith",
      customerEmail: "customer@example.com",
      customerPhone: "+91-9876543210",
      oldStatus: "PENDING",
      newStatus: "IN_PROGRESS",
      recipientName: "John Doe",
      meetingName: "Initial Consultation",
      startTime: "2024-01-15T10:00:00Z",
      endTime: "2024-01-15T11:00:00Z",
      duration: 60,
      linkOrNumber: "https://meet.google.com/abc-defg-hij",
    };

    const results: any = {};

    // When fireAll is true, always send all emails regardless of testType
    const shouldSendAll = fireAll || testType === "all";

    if (shouldSendAll || testType === "payment-success") {
      console.log("Sending payment success email to:", email);
      results.paymentSuccess = await sendPaymentSuccessEmail({
        to: email,
        format: format as "html" | "text" | "both",
        ...testData,
      });
    }

    if (shouldSendAll || testType === "payment-failure") {
      console.log("Sending payment failure email to:", email);
      results.paymentFailure = await sendPaymentFailureEmail({
        to: email,
        format: format as "html" | "text" | "both",
        ...testData,
      });
    }

    if (shouldSendAll || testType === "case-assigned") {
      console.log("Sending case assigned email to:", email);
      results.caseAssigned = await sendCaseAssignedEmail({
        to: email,
        format: format as "html" | "text" | "both",
        ...testData,
      });
    }

    if (shouldSendAll || testType === "case-status-update") {
      console.log("Sending case status update email to:", email);
      results.caseStatusUpdate = await sendCaseStatusUpdateEmail({
        to: email,
        format: format as "html" | "text" | "both",
        ...testData,
      });
    }

    if (shouldSendAll || testType === "meeting-notification") {
      console.log("Sending meeting notification email to:", email);
      results.meetingNotification = await sendMeetingNotificationEmail({
        to: email,
        format: format as "html" | "text" | "both",
        ...testData,
      });
    }

    const emailsSent = Object.keys(results).length;
    const expectedEmails = shouldSendAll ? 5 : 1;

    return NextResponse.json({
      success: true,
      message: fireAll
        ? "🔥 All emails fired successfully! Check your inbox!"
        : "Test emails sent successfully",
      results,
      testData,
      fireAll,
      debug: {
        testType,
        fireAll,
        shouldSendAll,
        emailsSent,
        expectedEmails,
        email,
      },
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
