import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppTemplateMessage } from "@/lib/messaging";

// route : /api/live/messaging/whatsapp

// send noti by dev
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const to = searchParams.get("to") || "+919925122114";
    const templateSid =
      searchParams.get("templateSid") || "HXf633d05469ac4fad31a835e2d7a7623e";
    const varsParam = searchParams.get("vars");

    let variables: Record<string, string | number | boolean> | undefined =
      undefined;
    if (varsParam) {
      try {
        variables = JSON.parse(varsParam);
      } catch (_err) {
        return NextResponse.json(
          { success: false, message: "Invalid vars JSON. Use ?vars={...}" },
          { status: 400 }
        );
      }
    } else {
      variables = {
        "1": "https://meet.example.com/abc-123",
        "2": "12 Jan 2026, 03:30 PM IST",
        "3": "03:30 PM",
        "4": "04:00 PM",
        "5": "30 minutes",
        "6": "No additional notes",
      };
    }

    const result = await sendWhatsAppTemplateMessage({
      toPhoneE164: to,
      templateSid,
      variables,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { sid: result.sid, status: result.status },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
