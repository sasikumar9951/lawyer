import { NextRequest, NextResponse } from "next/server";
import { getGetSignedUrlFromPath } from "@/lib/s3";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId } = body;

    // Validate required fields
    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    // Get file record from database
    const fileRecord = await prisma.caseFiles.findUnique({
      where: { id: fileId },
    });

    if (!fileRecord) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    if (!fileRecord.s3Path) {
      return NextResponse.json(
        { success: false, message: "File path not found" },
        { status: 404 }
      );
    }

    // Get signed URL for download
    const signedUrl = await getGetSignedUrlFromPath(fileRecord.s3Path);

    return NextResponse.json({
      success: true,
      data: {
        signedUrl,
        fileName: fileRecord.name,
        s3Path: fileRecord.s3Path,
      },
      message: "Download URL generated successfully",
    });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
