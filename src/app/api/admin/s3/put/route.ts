import { NextRequest, NextResponse } from "next/server";
import { getUploadSignedUrlFromPath, generateUniqueFilePath } from "@/lib/s3";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("S3 PUT API - Received request:", body);
    console.log("S3 PUT API - Environment check:", {
      hasRegion: !!process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      hasBucket: !!process.env.AWS_S3_BUCKET,
    });
    const { caseId, fileName, fileType, fileSize } = body;

    // Validate required fields
    if (!caseId || !fileName || !fileType) {
      console.log("S3 PUT API - Missing required fields:", {
        caseId,
        fileName,
        fileType,
      });
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: caseId },
    });

    console.log("S3 PUT API - Case exists:", !!caseExists);

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
    console.log(
      "S3 PUT API - Generated signed URL:",
      signedUrl.substring(0, 100) + "..."
    );

    // Create file record in database
    const fileRecord = await prisma.caseFiles.create({
      data: {
        caseId,
        name: fileName,
        s3Path,
        fileUrl: null, // We don't store public URLs, everything is private
      },
    });

    console.log("S3 PUT API - Created file record:", fileRecord);

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
