"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import type { ApiFormResponse } from "@/types/api/forms";

const Page = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [responses, setResponses] = useState<ApiFormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/admin/forms/${params.id}/responses`);
      const data = await res.json();
      setResponses(data);
      setIsLoading(false);
    };
    run();
  }, [params.id]);

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Responses</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Survey Info</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No responses yet
                </TableCell>
              </TableRow>
            ) : (
              responses.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(r.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">Survey Response</div>
                      <div className="text-xs text-muted-foreground">
                        Submitted response
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/forms/${params.id}/responses/${r.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Response
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
