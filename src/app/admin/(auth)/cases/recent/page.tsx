"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiCase } from "@/types/api/cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { LawyerResponse, GetLawyersResponse } from "@/types/api/lawyers";
import { ApiService, ServicesResponse } from "@/types/api/services";
import { DateRangePicker } from "@/components/ui/date-picker-2";
import { format } from "date-fns";

export default function AdminCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showGlobalNotificationDialog, setShowGlobalNotificationDialog] =
    useState(false);
  const [globalNotificationAction, setGlobalNotificationAction] = useState<
    "enable" | "disable"
  >("disable");
  const [updatingGlobalNotification, setUpdatingGlobalNotification] =
    useState(false);
  const [updatingIndividualNotification, setUpdatingIndividualNotification] =
    useState<string | null>(null);
  const [unassignedOnly, setUnassignedOnly] = useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "on" | "off"
  >("all");
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>("all");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const [sortBy] = useState<"createdAtDesc" | "createdAtAsc">("createdAtDesc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lawyers, setLawyers] = useState<LawyerResponse[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [dateRange, setDateRange] = useState<
    | {
        from: Date;
        to: Date;
      }
    | undefined
  >();

  useEffect(() => {
    // Set default dates to last 7 days
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    setDateRange({
      from: lastWeek,
      to: today,
    });
  }, []);

  useEffect(() => {
    fetchCases();
    fetchFilterOptions();
  }, []);

  const fetchCases = async () => {
    try {
      const params = new URLSearchParams();

      // Add date filters if they exist
      if (dateRange?.from) {
        params.append("startDate", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        params.append("endDate", format(dateRange.to, "yyyy-MM-dd"));
      }

      const response = await fetch(`/api/admin/cases?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCases(data.data || []);
      } else {
        toast.error("Failed to fetch cases");
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to fetch cases");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [lawyersRes, servicesRes] = await Promise.all([
        fetch("/api/admin/lawyers"),
        fetch("/api/admin/services"),
      ]);

      if (lawyersRes.ok) {
        const data: GetLawyersResponse = await lawyersRes.json();
        setLawyers(data.lawyers || []);
      }

      if (servicesRes.ok) {
        const data: ServicesResponse = await servicesRes.json();
        setServices(data.data || []);
      }
    } catch (error) {
      // ignore
    }
  };

  const handleGlobalNotificationToggle = async () => {
    setUpdatingGlobalNotification(true);
    try {
      const response = await fetch("/api/admin/cases/notification-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: globalNotificationAction,
        }),
      });

      if (response.ok) {
        toast.success(
          `Global notifications ${
            globalNotificationAction === "enable" ? "enabled" : "disabled"
          } successfully`
        );
        await fetchCases(); // Refresh the cases to get updated notification settings
      } else {
        toast.error("Failed to update global notification settings");
      }
    } catch (error) {
      console.error("Error updating global notification settings:", error);
      toast.error("Failed to update global notification settings");
    } finally {
      setUpdatingGlobalNotification(false);
      setShowGlobalNotificationDialog(false);
    }
  };

  const handleIndividualNotificationToggle = async (
    caseId: string,
    currentValue: boolean
  ) => {
    setUpdatingIndividualNotification(caseId);
    try {
      const response = await fetch(`/api/admin/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAutoNotificationOn: !currentValue,
        }),
      });

      if (response.ok) {
        toast.success(
          `Notifications ${
            !currentValue ? "enabled" : "disabled"
          } for this case`
        );
        await fetchCases(); // Refresh the cases to get updated notification settings
      } else {
        toast.error("Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setUpdatingIndividualNotification(null);
    }
  };

  const openGlobalNotificationDialog = (action: "enable" | "disable") => {
    setGlobalNotificationAction(action);
    setShowGlobalNotificationDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredCases = (() => {
    const list = cases.filter((caseItem) => {
      const matchesSearch =
        caseItem.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        caseItem.customerEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (caseItem.service?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || caseItem.status === statusFilter;

      const matchesUnassigned = !unassignedOnly || !caseItem.lawyerId;

      const matchesNotification =
        notificationFilter === "all" ||
        (notificationFilter === "on" && caseItem.isAutoNotificationOn) ||
        (notificationFilter === "off" && !caseItem.isAutoNotificationOn);

      const matchesLawyer =
        selectedLawyerId === "all" || caseItem.lawyer?.id === selectedLawyerId;

      const matchesService =
        selectedServiceId === "all" ||
        caseItem.service?.id === selectedServiceId;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUnassigned &&
        matchesNotification &&
        matchesLawyer &&
        matchesService
      );
    });

    list.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      if (sortBy === "createdAtAsc") return aTime - bTime;
      return bTime - aTime;
    });

    return list;
  })();

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchCases();
  }, [
    searchTerm,
    statusFilter,
    unassignedOnly,
    notificationFilter,
    selectedLawyerId,
    selectedServiceId,
    sortBy,
    dateRange,
  ]);

  // Check if all cases have notifications enabled
  const allNotificationsEnabled =
    cases.length > 0 &&
    cases.every((caseItem) => caseItem.isAutoNotificationOn);
  const allNotificationsDisabled =
    cases.length > 0 &&
    cases.every((caseItem) => !caseItem.isAutoNotificationOn);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cases...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-blue-50">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Recent Cases
            </h1>
            <p className="text-blue-700">Manage and track all customer cases</p>
          </div>

          {/* Global Notification Toggle Button */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-700">Global Notifications:</span>
            <Button
              onClick={() =>
                openGlobalNotificationDialog(
                  allNotificationsEnabled ? "disable" : "enable"
                )
              }
              variant={allNotificationsEnabled ? "destructive" : "default"}
              size="sm"
              disabled={updatingGlobalNotification}
              className={
                allNotificationsEnabled
                  ? ""
                  : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              }
            >
              {updatingGlobalNotification
                ? "Updating..."
                : allNotificationsEnabled
                ? "Disable All"
                : "Enable All"}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-blue-100 bg-white/90 backdrop-blur">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Date Range
              </label>
              <DateRangePicker
                onUpdate={(values) => {
                  if (values.range.from && values.range.to) {
                    setDateRange({
                      from: values.range.from,
                      to: values.range.to,
                    });
                  }
                }}
                initialDateFrom={dateRange?.from}
                initialDateTo={dateRange?.to}
                align="start"
                locale="en-GB"
                showCompare={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Search Cases
              </label>
              <Input
                placeholder="Search by customer name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Status Filter
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Notification
              </label>
              <Select
                value={notificationFilter}
                onValueChange={(v) => setNotificationFilter(v as any)}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="on">On</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Lawyer
              </label>
              <Select
                value={selectedLawyerId}
                onValueChange={setSelectedLawyerId}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All lawyers" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All Lawyers</SelectItem>
                  {lawyers.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Service
              </label>
              <Select
                value={selectedServiceId}
                onValueChange={setSelectedServiceId}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-blue-700">Unassigned only</span>
                <Switch
                  checked={unassignedOnly}
                  onCheckedChange={(v) => setUnassignedOnly(!!v)}
                  aria-label="Filter unassigned cases"
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="border border-blue-100 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>All Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Lawyer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Notifications
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCases.map((caseItem, index) => (
                  <tr
                    key={caseItem.id}
                    className="border-b hover:bg-blue-50/60 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-blue-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-blue-900">
                          {caseItem.customerName}
                        </div>
                        <div className="text-sm text-blue-700/80">
                          {caseItem.customerEmail}
                        </div>
                        <div className="text-sm text-blue-700/80">
                          {caseItem.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-blue-900">
                          {caseItem.service?.name}
                        </div>
                        <div className="text-sm text-blue-700/80">
                          {caseItem.service?.category?.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {caseItem.lawyer ? (
                        <div>
                          <div className="font-medium">
                            {caseItem.lawyer.name}
                          </div>
                          <div className="text-sm text-blue-700/80">
                            {caseItem.lawyer.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-blue-400">Not assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={caseItem.isAutoNotificationOn}
                          onCheckedChange={() =>
                            handleIndividualNotificationToggle(
                              caseItem.id,
                              caseItem.isAutoNotificationOn
                            )
                          }
                          disabled={
                            updatingIndividualNotification === caseItem.id
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm text-blue-700">
                          {updatingIndividualNotification === caseItem.id
                            ? "Updating..."
                            : caseItem.isAutoNotificationOn
                            ? "On"
                            : "Off"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-blue-700">
                      {formatDate(caseItem.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() =>
                          router.push(`/admin/cases/${caseItem.id}`)
                        }
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCases.length === 0 && (
              <div className="text-center py-8">
                <p className="text-blue-700/80">No cases found</p>
              </div>
            )}
          </div>
          {filteredCases.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-blue-700">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredCases.length)} of{" "}
                {filteredCases.length}
              </div>
              {totalPages > 1 && (
                <div
                  className="flex items-center gap-2"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className="border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    First
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        aria-label={`Page ${p}`}
                        className={
                          p === currentPage
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "border-blue-200 text-blue-700 hover:bg-blue-100"
                        }
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    className="border-blue-200 text-red -700 hover:bg-blue-100"
                  >
                    Last
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Notification Confirmation Dialog */}
      <AlertDialog
        open={showGlobalNotificationDialog}
        onOpenChange={setShowGlobalNotificationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {globalNotificationAction === "enable" ? "Enable" : "Disable"}{" "}
              Global Notifications
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will{" "}
              {globalNotificationAction === "enable" ? "enable" : "disable"}{" "}
              automatic notifications for all cases. This change will affect all
              existing cases and cannot be undone immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGlobalNotificationToggle}
              disabled={updatingGlobalNotification}
              className={
                globalNotificationAction === "enable"
                  ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  : "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              }
            >
              {updatingGlobalNotification
                ? "Updating..."
                : globalNotificationAction === "enable"
                ? "Enable All"
                : "Disable All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
