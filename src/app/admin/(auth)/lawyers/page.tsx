"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Users,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { GetLawyersResponse, LawyerResponse } from "@/types/api/lawyers";
import { Skeleton } from "@/components/ui/skeleton";

const LawyersPage = () => {
  const router = useRouter();
  const [lawyers, setLawyers] = useState<LawyerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const [excelLoading, setExcelLoading] = useState(false);
  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        ...(isActiveFilter && { isActive: isActiveFilter }),
      });

      const response = await fetch(`/api/admin/lawyers?${params}`);
      const data: GetLawyersResponse = await response.json();

      if (response.ok) {
        setLawyers(data.lawyers);
      } else {
        toast.error("Failed to fetch lawyers");
      }
    } catch (error) {
      toast.error("Failed to fetch lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [search, isActiveFilter]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleDownloadExcel = async () => {
    setExcelLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        ...(isActiveFilter && { isActive: isActiveFilter }),
      });
      const url = `/api/admin/lawyers/export?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        toast.error("Failed to download Excel");
        return;
      }
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = "lawyers_export.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(href);
    } catch (error) {
      toast.error("Failed to download Excel");
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lawyers</h1>
          <p className="text-gray-600 mt-1">Manage all lawyers in the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadExcel}
            variant="outline"
            className="shadow-sm"
            disabled={excelLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
          <Button
            onClick={() => router.push("/admin/lawyers/create")}
            className="shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lawyer
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-lg font-semibold">
            Manage Lawyers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search lawyers by name, email, or phone..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <select
              value={isActiveFilter}
              onChange={(e) => {
                setIsActiveFilter(e.target.value);
              }}
              className="px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">No lawyers found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lawyers.map((lawyer) => (
                    <TableRow key={lawyer.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {lawyer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {lawyer.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {lawyer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lawyer.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {lawyer.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lawyer.experience ? `${lawyer.experience} years` : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.specialization
                            .slice(0, 2)
                            .map((spec, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {spec}
                              </Badge>
                            ))}
                          {lawyer.specialization.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lawyer.specialization.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={lawyer.isActive ? "default" : "secondary"}
                        >
                          {lawyer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {lawyer.cases.length}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/lawyers/${lawyer.id}`)
                            }
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/lawyers/${lawyer.id}/edit`)
                            }
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
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
  );
};

export default LawyersPage;
