"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, X, File, CheckCircle } from "lucide-react";

interface FileUploadProps {
  caseId: string;
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  isTemporary?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  s3Path: string;
  size: number;
  type?: string;
  file?: File;
}

interface FileUploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  uploadedFile?: UploadedFile;
}

export default function FileUpload({
  caseId,
  onFilesUploaded,
  maxFiles = 5,
  acceptedFileTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
  maxFileSize = 10, // 10MB
  isTemporary = false,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("FileUpload - Component rendered with props:", {
    caseId,
    isTemporary,
    maxFiles,
    acceptedFileTypes,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    console.log("FileUpload - Files selected:", files);
    console.log("FileUpload - Current uploaded files:", uploadedFiles.length);
    console.log("FileUpload - Current uploading files:", uploadingFiles.length);

    if (
      uploadedFiles.length + uploadingFiles.length + files.length >
      maxFiles
    ) {
      toast.error(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(
          `File ${file.name} is too large. Maximum size is ${maxFileSize}MB`
        );
        return false;
      }
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        toast.error(`File type ${fileExtension} is not supported`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (isTemporary) {
      const tempFiles: UploadedFile[] = validFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        name: file.name,
        s3Path: "",
        size: file.size,
        type: file.type,
        file,
      }));
      const newUploadedFiles = [...uploadedFiles, ...tempFiles];

      setUploadedFiles(newUploadedFiles);

      onFilesUploaded(newUploadedFiles);
      console.log(
        "FileUpload - Updated uploaded files (temp):",
        newUploadedFiles
      );

      toast.success(`${tempFiles.length} file(s) added`);
      return;
    }

    const entries: FileUploadState[] = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading",
    }));
    setUploadingFiles((prev) => [...prev, ...entries]);
    setIsUploading(true);

    validFiles.forEach(async (file) => {
      try {
        const urlResponse = await fetch("/api/admin/s3/put", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        if (!urlResponse.ok) throw new Error("Failed to get upload URL");

        const urlData = await urlResponse.json();
        const { signedUrl, fileId, s3Path } = urlData.data;

        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload file to S3");

        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          s3Path,
          size: file.size,
          type: file.type,
        };

        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, status: "completed", progress: 100, uploadedFile }
              : f
          )
        );

        setUploadedFiles((prev) => {
          const newUploadedFiles = [...prev, uploadedFile];
          onFilesUploaded(newUploadedFiles);
          return newUploadedFiles;
        });

        toast.success(`File ${file.name} uploaded successfully`);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, status: "error", error: "Upload failed" }
              : f
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploadingFiles((prev) => {
          const allDone = prev.every((f) => f.status !== "uploading");
          if (allDone) setIsUploading(false);
          return prev;
        });
      }
    });
  };

  const removeFile = (fileId: string) => {
    // --- START OF FIX 3 ---
    // 1. Create the new list
    const newUploadedFiles = uploadedFiles.filter((f) => f.id !== fileId);

    // 2. Update local state
    setUploadedFiles(newUploadedFiles);

    // 3. Update parent state
    onFilesUploaded(newUploadedFiles);
    // --- END OF FIX 3 ---
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Upload Files</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            accept={acceptedFileTypes.join(",")}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={
              isUploading ||
              uploadedFiles.length + uploadingFiles.length >= maxFiles
            }
            className="mb-2"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
          <p className="text-sm text-gray-600">
            Accepted formats: {acceptedFileTypes.join(", ")} (Max {maxFileSize}
            MB each)
          </p>
          <p className="text-xs text-gray-500">
            {uploadedFiles.length + uploadingFiles.length} of {maxFiles} files
          </p>
        </div>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          {uploadingFiles.map((fileState, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {fileState.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(fileState.file.size)})
                  </span>
                </div>
                {fileState.status === "pending" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadingFile(fileState.file)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {fileState.status === "uploading" && (
                <div className="space-y-1">
                  <Progress value={fileState.progress} className="h-2" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              )}

              {fileState.status === "completed" && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Uploaded successfully</span>
                </div>
              )}

              {fileState.status === "error" && (
                <div className="flex items-center space-x-2 text-red-600">
                  <X className="w-4 h-4" />
                  {/* --- THIS IS THE FIX --- */}
                  <span className="text-sm">{fileState.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between border rounded-lg p-3 bg-green-50"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
