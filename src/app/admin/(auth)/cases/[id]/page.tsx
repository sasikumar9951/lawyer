"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiCase } from "@/types/api/cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  FileText,
  Users,
  Settings,
  Bell,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import FormResponsePreviewer from "@/components/form-response-previewer";
import { MeetingModal } from "@/components/admin/meeting-modal";
import { MeetingsList } from "@/components/admin/meetings-list";
import FileList from "@/components/admin/file-list";

interface Lawyer {
  id: string;
  name: string;
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<ApiCase | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [caseFiles, setCaseFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCustomerCollapsed, setIsCustomerCollapsed] = useState(false);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCaseData();
      fetchLawyers();
      fetchCaseFiles();
    }
  }, [params.id]);

  const fetchCaseData = async () => {
    try {
      const response = await fetch(`/api/admin/cases/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCaseData(data.data);
      } else {
        toast.error("Failed to fetch case details");
      }
    } catch (error) {
      console.error("Error fetching case:", error);
      toast.error("Failed to fetch case details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLawyers = async () => {
    try {
      const response = await fetch("/api/admin/cases/lawyers");
      if (response.ok) {
        const data = await response.json();
        setLawyers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    }
  };

  const fetchCaseFiles = async () => {
    try {
      const response = await fetch(`/api/admin/cases/${params.id}/files`);
      if (response.ok) {
        const data = await response.json();
        setCaseFiles(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching case files:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!caseData) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/cases/${caseData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Case status updated successfully");
        fetchCaseData(); // Refresh data
      } else {
        toast.error("Failed to update case status");
      }
    } catch (error) {
      console.error("Error updating case status:", error);
      toast.error("Failed to update case status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLawyerAssignment = async (lawyerId: string | null) => {
    if (!caseData) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/cases/${caseData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lawyerId }),
      });

      if (response.ok) {
        toast.success("Lawyer assigned successfully");
        fetchCaseData(); // Refresh data
      } else {
        toast.error("Failed to assign lawyer");
      }
    } catch (error) {
      console.error("Error assigning lawyer:", error);
      toast.error("Failed to assign lawyer");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAutoNotificationToggle = async (enabled: boolean) => {
    if (!caseData) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/admin/cases/${caseData.id}/notification`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isAutoNotificationOn: enabled }),
        }
      );

      if (response.ok) {
        toast.success(`Auto-notifications ${enabled ? "enabled" : "disabled"}`);
        fetchCaseData(); // Refresh data
      } else {
        toast.error("Failed to update auto-notification setting");
      }
    } catch (error) {
      console.error("Error updating auto-notification:", error);
      toast.error("Failed to update auto-notification setting");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading case details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Case Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The case you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/admin/cases")}>
            Back to Cases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() => router.push("/admin/cases")}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cases
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Case Details
            </h1>
            <p className="text-gray-600">Case ID: {caseData.id}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(caseData.status)}>
              {caseData.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Service Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer & Service
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-2"
                  onClick={() => setIsCustomerCollapsed((prev) => !prev)}
                  aria-expanded={!isCustomerCollapsed}
                  aria-controls="case-info-card-content"
                >
                  {isCustomerCollapsed ? (
                    <span className="flex items-center gap-1">
                      <ChevronDown className="w-4 h-4" /> Expand
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ChevronUp className="w-4 h-4" /> Collapse
                    </span>
                  )}
                </Button>
              </div>
            </CardHeader>
            {!isCustomerCollapsed && (
              <CardContent id="case-info-card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-gray-900">{caseData.customerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{caseData.customerEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <p className="text-gray-900">{caseData.customerPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name
                      </label>
                      <p className="text-gray-900">{caseData.service?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <p className="text-gray-900">
                        {caseData.service?.category?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Form Response */}
          {caseData.formResponse && (
            <FormResponsePreviewer formResponse={caseData.formResponse} />
          )}

          {/* Files */}
          <FileList
            files={caseFiles}
            onFileDelete={async (fileId) => {
              try {
                const response = await fetch("/api/admin/s3/delete", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fileId }),
                });
                if (response.ok) {
                  fetchCaseFiles(); // Refresh files list
                  toast.success("File deleted successfully");
                } else {
                  toast.error("Failed to delete file");
                }
              } catch (error) {
                console.error("Error deleting file:", error);
                toast.error("Failed to delete file");
              }
            }}
          />

          {/* Meetings */}
          <MeetingsList meetings={caseData.meetings || []} />
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Settings Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-2"
                  onClick={() => setIsSettingsCollapsed((prev) => !prev)}
                  aria-expanded={!isSettingsCollapsed}
                  aria-controls="settings-card-content"
                >
                  {isSettingsCollapsed ? (
                    <span className="flex items-center gap-1">
                      <ChevronDown className="w-4 h-4" /> Expand
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ChevronUp className="w-4 h-4" /> Collapse
                    </span>
                  )}
                </Button>
              </div>
            </CardHeader>
            {!isSettingsCollapsed && (
              <CardContent id="settings-card-content" className="space-y-6">
                {/* Case Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Status
                  </label>
                  <Select
                    value={caseData.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lawyer Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Lawyer
                  </label>
                  <Select
                    value={caseData.lawyerId || "none"}
                    onValueChange={(value) =>
                      handleLawyerAssignment(value === "none" ? null : value)
                    }
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lawyer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No lawyer assigned</SelectItem>
                      {lawyers.map((lawyer) => (
                        <SelectItem key={lawyer.id} value={lawyer.id}>
                          {lawyer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {caseData.lawyer && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-blue-800">
                        <p>
                          <strong>Assigned:</strong> {caseData.lawyer.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">
                      Auto Notifications
                    </label>
                  </div>
                  <Switch
                    checked={caseData.isAutoNotificationOn}
                    onCheckedChange={handleAutoNotificationToggle}
                    disabled={isUpdating}
                  />
                </div>

                <Separator />

                {/* Add Meeting Button */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manage Meetings
                  </label>
                  <MeetingModal
                    caseId={caseData.id}
                    onMeetingCreated={fetchCaseData}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
