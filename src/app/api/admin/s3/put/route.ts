import { NextRequest, NextResponse } from "next/server";
import { getUploadSignedUrlFromPath, generateUniqueFilePath } from "@/lib/s3";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { caseId, fileName, fileType, fileSize } = body;

    // Validate required fields
    if (!caseId || !fileName || !fileType) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ==========================================
    // SPECIAL HANDLING FOR SERVICE ASSETS (FIX)
    // ==========================================
    // இதுதான் புது மாற்றம்: Service Assets வந்தால் DB-ல் தேட வேண்டாம்
    if (caseId === "service-assets") {
      // 1. Generate path directly
      const s3Path = generateUniqueFilePath("public_assets", fileName);

      // 2. Get Signed URL
      const signedUrl = await getUploadSignedUrlFromPath(s3Path);

      // 3. Return immediately
      return NextResponse.json({
        success: true,
        data: {
          fileId: "service-asset-" + Date.now(), // Dummy ID
          signedUrl,
          s3Path,
          fileName,
        },
        message: "Service asset upload URL generated",
      });
    }
    // ==========================================

    // Verify case exists (Only for real cases)
    const caseExists = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseExists) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    // Generate unique S3 path
    const s3Path = generateUniqueFilePath(caseId, fileName);

    // Get signed URL for upload
    const signedUrl = await getUploadSignedUrlFromPath(s3Path);

    // Create file record in database (Only for cases)
    const fileRecord = await prisma.caseFiles.create({
      data: {
        caseId,
        name: fileName,
        s3Path,
        fileUrl: null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        signedUrl,
        s3Path,
        fileName,
      },
      message: "Upload URL generated successfully",
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
