"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LawyerForm from "@/components/admin/lawyer-form";
import { LawyerResponse } from "@/types/api/lawyers";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const EditLawyerPage = () => {
  const params = useParams();
  const [lawyer, setLawyer] = useState<LawyerResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" disabled className="hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Lawyer</h1>
            <p className="text-gray-600 mt-1">Update lawyer information</p>
          </div>
        </div>

        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-lg font-semibold">
              Lawyer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-18" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <div className="flex gap-2">
                  <Skeleton className="h-20 flex-1" />
                  <Skeleton className="h-10 w-10 self-start" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-20" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="text-center py-8 text-red-600">Lawyer not found</div>
    );
  }

  return (
    <LawyerForm mode="edit" lawyer={lawyer} lawyerId={params.id as string} />
  );
};

export default EditLawyerPage;
