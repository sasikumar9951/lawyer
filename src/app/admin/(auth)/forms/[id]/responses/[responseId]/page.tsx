"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SurveyResponseViewer from "@/components/admin/survey-response-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiFormResponse } from "@/types/api/forms";

const Page = () => {
  const params = useParams<{ id: string; responseId: string }>();
  const router = useRouter();
  const [response, setResponse] = useState<ApiFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/forms/${params.id}/responses`);
        if (res.ok) {
          const responses: ApiFormResponse[] = await res.json();
          const foundResponse = responses.find(
            (r) => r.id === params.responseId
          );
          setResponse(foundResponse || null);
        }
      } catch (error) {
        console.error("Error fetching response:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponse();
  }, [params.id, params.responseId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Response Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The response you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Response Details
          </h1>
          <p className="text-gray-600 mt-1">
            Submitted on {new Date(response.createdAt).toLocaleString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Responses
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Survey Response
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            View the response as it appeared to the user, with full navigation
            between pages
          </p>
        </CardHeader>
        <CardContent>
          <SurveyResponseViewer response={response.rawJson as any} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
