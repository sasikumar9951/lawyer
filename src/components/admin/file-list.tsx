"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, File, Trash2 } from "lucide-react";

interface CaseFile {
  id: string;
  name: string;
  s3Path: string;
  createdAt: string;
  caseId: string;
}

interface FileListProps {
  files: CaseFile[];
  onFileDelete?: (fileId: string) => void;
}

export default function FileList({ files, onFileDelete }: FileListProps) {
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  const handleDownload = async (file: CaseFile) => {
    setDownloadingFiles((prev) => new Set(prev).add(file.id));

    try {
      const response = await fetch("/api/admin/s3/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: file.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const data = await response.json();
      const { signedUrl } = data.data;

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${file.name}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!onFileDelete) return;

    try {
      const response = await fetch("/api/admin/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      onFileDelete(fileId);
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      case "txt":
        return "📄";
      default:
        return "📎";
    }
  };

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            No files uploaded yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Files ({files.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(file.name)}</span>
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  disabled={downloadingFiles.has(file.id)}
                  className="h-8 px-2"
                >
                  {downloadingFiles.has(file.id) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                </Button>

                {onFileDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
