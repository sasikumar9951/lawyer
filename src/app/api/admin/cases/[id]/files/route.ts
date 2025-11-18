import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate id
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Case ID is required" },
        { status: 400 }
      );
    }

    // Verify case exists
    const caseExists = await prisma.case.findUnique({
      where: { id },
    });

    if (!caseExists) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    // Get files for the case
    const files = await prisma.caseFiles.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: files,
      message: "Files retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching case files:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch case files" },
      { status: 500 }
    );
  }
}
