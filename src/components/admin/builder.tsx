"use client";

import { useEffect, useRef, useState } from "react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.css";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type Props = { mode: "create" | "edit" };

const AdminBuilder = ({ mode }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id?: string }>();
  const [formId, setFormId] = useState<string | null>(
    mode === "edit" ? params?.id || searchParams.get("id") || null : null
  );
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [creator, setCreator] = useState<SurveyCreator | null>(null);

  useEffect(() => {
    const c = new SurveyCreator({
      showLogicTab: true,
      isAutoSave: false,
      showJSONEditorTab: true,
    });
    c.toolbox.forceCompact = true;
    setCreator(c);
  }, []);

  useEffect(() => {
    if (!creator || !formId) return;
    const run = async () => {
      const res = await fetch(`/api/admin/forms/${formId}`);
      if (!res.ok) return;
      const data = await res.json();
      setName(data.name ?? "Untitled form");
      setDescription(data.description ?? "");
      creator.JSON = data.schemaJson || {};
    };
    run();
  }, [creator, formId]);

  const handleSave = async () => {
    if (!creator) return;
    setIsSaving(true);
    const payload = { name, description, schemaJson: creator.JSON };
    try {
      if (!formId) {
        const res = await fetch(`/api/admin/forms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setFormId(data.id);
        router.push(`/admin/forms/${data.id}/edit`);
      } else {
        await fetch(`/api/admin/forms/${formId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } finally {
      setIsSaving(false);
      router.push(`/admin/forms`);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-900">
          {mode === "edit" ? "Edit form" : "Create form"}
        </h1>
        <p className="text-sm text-gray-600">
          {mode === "edit"
            ? "Modify your form structure and settings"
            : "Build a new form with our visual editor"}
        </p>
      </div>

      {/* Form Controls Section */}
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Form name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Untitled form"
              className="bg-white text-gray-900 focus-visible:ring-white focus-visible:border-white border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Input
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your form"
              className="bg-white text-gray-900 focus-visible:ring-white focus-visible:border-white border-gray-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            aria-label="Save form"
            disabled={isSaving}
            className="px-6"
          >
            {isSaving ? "Saving..." : "Save Form"}
          </Button>
          {formId && (
            <>
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/forms/${formId}/preview`)}
                className="px-4"
              >
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/forms/${formId}/responses`)}
                className="px-4"
              >
                Responses
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Form Builder Section */}
      <div className="border border-gray-200 rounded-lg flex-1 min-h-0 overflow-hidden bg-white shadow-sm">
        {creator ? (
          <SurveyCreatorComponent
            creator={creator}
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Loading form builder...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBuilder;
