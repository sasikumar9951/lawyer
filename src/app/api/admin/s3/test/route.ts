import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

export async function GET(request: NextRequest) {
  try {
    console.log("S3 Test API - Environment check:", {
      hasRegion: !!process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      hasBucket: !!process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_S3_BUCKET,
    });

    const s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    try {
      const command = new ListBucketsCommand({});
      const response = await s3.send(command);

      return NextResponse.json({
        success: true,
        message: "S3 connection successful",
        buckets: response.Buckets?.map((b) => b.Name) || [],
        targetBucket: process.env.AWS_S3_BUCKET,
      });
    } catch (s3Error) {
      console.error("S3 Test API - S3 connection failed:", s3Error);
      return NextResponse.json(
        {
          success: false,
          message: "S3 connection failed",
          error: String(s3Error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("S3 Test API - General error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Test failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
