import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getGetSignedUrlFromPath = async (path: string) => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: path,
  });
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 60 * 12,
  });
  return signedUrl;
};

export const getUploadSignedUrlFromPath = async (path: string) => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: path,
  });
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 60 * 12,
  }); // 12 hours
  return signedUrl;
};

export const generateUniqueFilePath = (
  caseId: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const fileExtension = fileName.split(".").pop() || "";
  return `cases/${caseId}/${timestamp}-${randomId}.${fileExtension}`;
};
