import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateMeetingRequest } from "@/types/api/cases";
import { sendWhatsAppTemplateMessage } from "@/lib/messaging";

type Params = { params: Promise<{ id: string }> };

export const POST = async (request: NextRequest, { params }: Params) => {
  try {
    const { id: caseId } = await params;
    const body: CreateMeetingRequest = await request.json();

    const {
      linkOrNumber,
      startTime,
      endTime,
      duration,
      meetingNotes,
      meetingName,
    } = body;

    // Validate required fields
    if (!linkOrNumber) {
      return NextResponse.json(
        { success: false, message: "Link or number is required" },
        { status: 400 }
      );
    }

    // Check if case exists
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    // Create meeting
    const meeting = await prisma.caseMeeting.create({
      data: {
        linkOrNumber,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        duration,
        meetingNotes,
        meetingName,
        caseId,
      },
    });

    try {
      const start = meeting.startTime ? new Date(meeting.startTime) : null;
      const end = meeting.endTime ? new Date(meeting.endTime) : null;
      const istFormatterFull = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const istFormatterTime = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const startFull = start ? `${istFormatterFull.format(start)} IST` : "";
      const startTimeOnly = start ? istFormatterTime.format(start) : "";
      const endTimeOnly = end ? istFormatterTime.format(end) : "";
      const durationText =
        meeting.duration === null || meeting.duration === undefined
          ? ""
          : String(meeting.duration);
      const notesText = meeting.meetingNotes || "No additional notes";

      const templateSid =
        process.env.TWILIO_WHATSAPP_MEETING_TEMPLATE_SID ||
        "HXf633d05469ac4fad31a835e2d7a7623e";

      const variables: Record<string, string> = {
        "1": meeting.linkOrNumber || "",
        "2": startFull,
        "3": startTimeOnly,
        "4": endTimeOnly,
        "5": durationText,
        "6": notesText,
      };

      const targetPhone = "+919925122114";
      const recipients: ("CLIENT" | "LAWYER")[] = ["CLIENT", "LAWYER"];

      for (const recipientType of recipients) {
        const sendResult = await sendWhatsAppTemplateMessage({
          toPhoneE164: targetPhone,
          templateSid,
          variables,
        });

        await prisma.whatsAppNotification.create({
          data: {
            recipientPhone: targetPhone,
            recipientType,
            messageType: "MEETING_SCHEDULED",
            templateName: templateSid,
            messageContent:
              `Meeting scheduled: ${
                meeting.meetingName || "N/A"
              } | ${startFull}` +
              (meeting.linkOrNumber ? ` | ${meeting.linkOrNumber}` : ""),
            status: sendResult.success ? "SENT" : "FAILED",
            twilioMessageSid: sendResult.success ? sendResult.sid : null,
            errorMessage: sendResult.success ? null : sendResult.error,
            caseId,
          },
        });
      }
    } catch (notifyError) {
      console.error("Failed to send WhatsApp notification:", notifyError);
      try {
        const targetPhone = "+919925122114";
        const recipients: ("CLIENT" | "LAWYER")[] = ["CLIENT", "LAWYER"];
        for (const recipientType of recipients) {
          await prisma.whatsAppNotification.create({
            data: {
              recipientPhone: targetPhone,
              recipientType,
              messageType: "MEETING_SCHEDULED",
              templateName: null,
              messageContent: "Failed to send meeting notification",
              status: "FAILED",
              errorMessage:
                notifyError instanceof Error
                  ? notifyError.message
                  : "Unknown error",
              caseId,
            },
          });
        }
      } catch (logErr) {
        console.error("Failed to log WhatsApp notification failure:", logErr);
      }
    }

    return NextResponse.json(
      { success: true, data: meeting, message: "Meeting created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create meeting" },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    const { id: caseId } = await params;

    // Check if case exists
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    // Get all meetings for the case
    const meetings = await prisma.caseMeeting.findMany({
      where: { caseId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: meetings,
        message: "Meetings retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
};
