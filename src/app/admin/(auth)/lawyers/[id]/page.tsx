"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  User,
  FileText,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import { LawyerResponse } from "@/types/api/lawyers";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const LawyerPageSkeleton = () => {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" />
        <div className="flex-1">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <Skeleton className="h-9 w-16" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white border-b py-2 px-3">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-44" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </div>
              <div className="flex items-center gap-2 pt-1.5">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="rounded-md border">
              <div className="divide-y">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-5 items-center gap-4 p-4"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ViewLawyerPage = () => {
  const params = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<LawyerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [newRemark, setNewRemark] = useState("");
  const [caseSearch, setCaseSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("createdAtDesc");
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await fetch(`/api/admin/lawyers/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setLawyer(data.lawyer);
        } else {
          toast.error("Failed to fetch lawyer");
        }
      } catch (error) {
        toast.error("Failed to fetch lawyer");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLawyer();
    }
  }, [params.id]);

  const handleAddRemark = async () => {
    if (!lawyer || !newRemark.trim()) return;
    try {
      const response = await fetch(`/api/admin/lawyers/${lawyer.id}/remarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark: newRemark.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        setLawyer({ ...lawyer, remarks: data.remarks });
        setNewRemark("");
        toast.success("Remark added");
      } else {
        toast.error("Failed to add remark");
      }
    } catch {
      toast.error("Failed to add remark");
    }
  };

  const filteredCases = (() => {
    if (!lawyer) return [] as LawyerResponse["cases"];
    let list = [...lawyer.cases];
    if (selectedStatuses.length > 0) {
      list = list.filter((c) => selectedStatuses.includes(c.status));
    }
    if (caseSearch.trim()) {
      const q = caseSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.customerEmail.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "createdAtAsc":
        list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "createdAtDesc":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "nameAsc":
        list.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case "nameDesc":
        list.sort((a, b) => b.customerName.localeCompare(a.customerName));
        break;
    }
    return list;
  })();

  const getInitials = (fullName: string) => {
    const parts = fullName?.trim()?.split(" ") || [];
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
    return initials || "U";
  };

  const handleOpenMail = () => {
    if (!lawyer?.email) return;
    window.location.href = `mailto:${lawyer.email}`;
  };

  const handleOpenPhone = () => {
    if (!lawyer?.phone) return;
    window.location.href = `tel:${lawyer.phone}`;
  };

  const handleCopyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  if (loading) {
    return <LawyerPageSkeleton />;
  }

  if (!lawyer) {
    return (
      <div className="text-center py-8 text-red-600">Lawyer not found</div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/lawyers")}
          className="hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Lawyer Details</h1>
          <p className="text-gray-600 mt-1">
            View and manage lawyer information
          </p>
        </div>
        <Button
          onClick={() => router.push(`/admin/lawyers/${lawyer.id}/edit`)}
          className="shadow-sm"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white border-b py-2 px-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                <User className="w-3 h-3" />
                Basic Information
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => setIsInfoCollapsed((prev) => !prev)}
                aria-expanded={!isInfoCollapsed}
                aria-controls="lawyer-info-card-content"
              >
                {isInfoCollapsed ? (
                  <span className="flex items-center gap-1 text-xs">
                    <ChevronDown className="w-3.5 h-3.5" /> Expand
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs">
                    <ChevronUp className="w-3.5 h-3.5" /> Collapse
                  </span>
                )}
              </Button>
            </div>
          </CardHeader>
          {!isInfoCollapsed && (
            <CardContent
              id="lawyer-info-card-content"
              className="p-3 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-1 ring-gray-200">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs">
                    {getInitials(lawyer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {lawyer.name}
                    </h3>
                    <Badge
                      variant={lawyer.isActive ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0.5"
                    >
                      {lawyer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={handleOpenMail}
                    aria-label="Send email"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                  {lawyer.phone && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={handleOpenPhone}
                      aria-label="Call phone"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center gap-1 text-xs">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 truncate">
                      {lawyer.email}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => handleCopyValue(lawyer.email, "Email")}
                      aria-label="Copy email"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {lawyer.phone && (
                  <div className="space-y-0.5">
                    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <div className="flex items-center gap-1 text-xs">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-900 truncate">
                        {lawyer.phone}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() =>
                          handleCopyValue(lawyer.phone as string, "Phone")
                        }
                        aria-label="Copy phone"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-0.5">
                  <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                    Experience
                  </label>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900">
                      {lawyer.experience || 0} years
                    </span>
                  </div>
                </div>
              </div>

              {lawyer.specialization.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Specializations
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specialization.map((spec, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {lawyer.languages.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.languages.map((lang, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Remarks
                </label>
                <div className="space-y-1">
                  {(lawyer.remarks || [])
                    .map((remark) => remark.trim())
                    .filter((remark) => remark.length > 0)
                    .map((remark, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-400" />
                        <div className="text-xs text-gray-700 bg-gray-50 px-2 py-1.5 rounded border-l-2 border-primary/20 flex-1">
                          {remark}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-1.5">
                  <Input
                    placeholder="Add a remark..."
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                  />
                  <Button
                    onClick={handleAddRemark}
                    className="whitespace-nowrap"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Cases Information */}
        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="w-5 h-5" />
              Cases ({filteredCases.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "PENDING", label: "Pending" },
                  { key: "IN_PROGRESS", label: "In Progress" },
                  { key: "COMPLETED", label: "Completed" },
                  { key: "CANCELLED", label: "Cancelled" },
                ].map((s) => {
                  const isSelected = selectedStatuses.includes(s.key);
                  return (
                    <Button
                      key={s.key}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className="h-8"
                      onClick={() =>
                        setSelectedStatuses((prev) =>
                          prev.includes(s.key)
                            ? prev.filter((x) => x !== s.key)
                            : [...prev, s.key]
                        )
                      }
                    >
                      {s.label}
                    </Button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by</label>
                <select
                  className="px-3 py-2 border border-gray-200 rounded-md bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAtDesc">Newest</option>
                  <option value="createdAtAsc">Oldest</option>
                  <option value="nameAsc">Name A-Z</option>
                  <option value="nameDesc">Name Z-A</option>
                </select>
              </div>
              <div>
                <Input
                  placeholder="Search cases (name or email)..."
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredCases.length === 0 ? (
              <p className="text-gray-500 text-sm">No cases assigned</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell className="font-medium">
                          {case_.customerName}
                        </TableCell>
                        <TableCell>{case_.customerEmail}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {case_.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(case_.createdAt as unknown as Date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/cases/${case_.id}`)
                            }
                            className="h-8 px-2"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewLawyerPage;
