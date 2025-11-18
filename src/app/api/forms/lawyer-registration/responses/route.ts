import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { formId, rawJson } = body;

    if (!formId || !rawJson) {
      return NextResponse.json(
        { error: "Form ID and raw JSON are required" },
        { status: 400 }
      );
    }

    // Create the form response
    const formResponse = await prisma.formResponse.create({
      data: {
        formId: formId,
        rawJson: rawJson,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: formResponse.id,
        formId: formResponse.formId,
        createdAt: formResponse.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating lawyer registration form response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
