"use client";

import { Suspense } from "react";
import AdminBuilder from "@/components/admin/builder";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col gap-4 p-4">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Loading form builder...
              </span>
            </div>
          </div>
        </div>
      }
    >
      <AdminBuilder mode="create" />
    </Suspense>
  );
};

export default Page;
