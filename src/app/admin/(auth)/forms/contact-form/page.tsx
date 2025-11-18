"use client";

import { useEffect, useState } from "react";
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
  const [responses, setResponses] = useState<ApiFormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formId, setFormId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/forms/type/CONTACT_FORM/responses");
      if (res.ok) {
        const data = await res.json();
        setResponses(data);
        // Get the form ID from the first response for routing
        if (data.length > 0) {
          setFormId(data[0].formId);
        }
      }
      setLoading(false);
    };
    run();
  }, []);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(responses.length / pageSize));
  const paginatedResponses = responses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Contact Form Responses
            </h1>
            <p className="text-blue-700">
              View and manage contact form submissions
            </p>
          </div>
        </div>

        {/* Responses Card */}
        <div className="border border-blue-100 bg-white/90 backdrop-blur rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  Responses ({responses.length})
                </h2>
                <p className="text-blue-700 text-sm">
                  Contact form submissions and details
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-blue-100">
                  <TableHead className="text-blue-800">Date & Time</TableHead>
                  <TableHead className="text-blue-800">Survey Info</TableHead>
                  <TableHead className="text-right text-blue-800">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-blue-50/60">
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-blue-700"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        Loading responses...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : responses.length === 0 ? (
                  <TableRow className="hover:bg-blue-50/60">
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-blue-700"
                    >
                      No responses yet
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedResponses.map((r, index) => (
                    <TableRow
                      key={r.id}
                      className="hover:bg-blue-50/60 transition-colors border-blue-100"
                    >
                      <TableCell className="font-medium text-blue-900">
                        <div>
                          <div className="font-medium">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-blue-600">
                            {new Date(r.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-700">
                        <div className="text-sm">
                          <div className="font-medium">Contact Form</div>
                          <div className="text-xs text-blue-600">
                            Contact inquiry
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formId && (
                          <Link
                            href={`/admin/forms/${formId}/responses/${r.id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Response
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {responses.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-blue-700">
                  Showing {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, responses.length)} of{" "}
                  {responses.length}
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
                      className="border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      Last
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
