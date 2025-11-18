import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
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

    // Delete from S3 if s3Path exists
    if (fileRecord.s3Path) {
      const s3 = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: fileRecord.s3Path,
        });

        await s3.send(deleteCommand);
        console.log(`File deleted from S3: ${fileRecord.s3Path}`);
      } catch (s3Error) {
        console.error("Error deleting file from S3:", s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await prisma.caseFiles.delete({
      where: { id: fileId },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete file" },
      { status: 500 }
    );
  }
}
