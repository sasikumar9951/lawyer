import { NextRequest, NextResponse } from "next/server";
import { getUploadSignedUrlFromPath, getGetSignedUrlFromPath, generateUniqueFilePath } from "@/lib/s3";
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
    // Skip DB lookup for service asset uploads and generate path directly
    if (caseId === "service-assets") {
      // 1. Generate path directly
      const s3Path = generateUniqueFilePath("public_assets", fileName);

      // 2. Get Signed URL
      const signedUrl = await getUploadSignedUrlFromPath(s3Path);

      // 3. Also generate a signed GET url so the client can preview the uploaded file
      const signedGetUrl = await getGetSignedUrlFromPath(s3Path);

      return NextResponse.json({
        success: true,
        data: {
          fileId: "service-asset-" + Date.now(), // Dummy ID
          signedUrl,
          signedGetUrl,
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
    // Also generate a signed GET URL for previewing the uploaded file
    const signedGetUrl = await getGetSignedUrlFromPath(s3Path);

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
        signedGetUrl,
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
