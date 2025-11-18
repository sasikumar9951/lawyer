import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !["enable", "disable"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Must be 'enable' or 'disable'",
        },
        { status: 400 }
      );
    }

    const isAutoNotificationOn = action === "enable";

    // Update all cases to set the notification setting
    const result = await prisma.case.updateMany({
      where: {
        isActive: true, // Only update active cases
      },
      data: {
        isAutoNotificationOn,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Global notifications ${
        action === "enable" ? "enabled" : "disabled"
      } successfully`,
      data: {
        updatedCount: result.count,
        action,
      },
    });
  } catch (error) {
    console.error("Error updating global notification settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update global notification settings",
      },
      { status: 500 }
    );
  }
}
