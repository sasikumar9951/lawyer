"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  CreateLawyerRequest,
  UpdateLawyerRequest,
  LawyerResponse,
} from "@/types/api/lawyers";

interface LawyerFormProps {
  mode: "create" | "edit";
  lawyer?: LawyerResponse;
  lawyerId?: string;
}

const LawyerForm = ({ mode, lawyer, lawyerId }: LawyerFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLawyerRequest>({
    name: "",
    email: "",
    phone: "",
    specialization: [],
    experience: null,
    languages: [],
    isActive: true,
    remarks: [],
  });

  const [newSpecialization, setNewSpecialization] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newRemark, setNewRemark] = useState("");

  useEffect(() => {
    if (mode === "edit" && lawyer) {
      setFormData({
        name: lawyer.name,
        email: lawyer.email,
        phone: lawyer.phone || "",
        specialization: lawyer.specialization,
        experience: lawyer.experience,
        languages: lawyer.languages,
        isActive: lawyer.isActive,
        remarks: lawyer.remarks,
      });
    }
  }, [mode, lawyer]);

  const handleInputChange = (field: keyof CreateLawyerRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSpecialization = () => {
    if (
      newSpecialization.trim() &&
      !formData.specialization.includes(newSpecialization.trim())
    ) {
      handleInputChange("specialization", [
        ...formData.specialization,
        newSpecialization.trim(),
      ]);
      setNewSpecialization("");
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    handleInputChange(
      "specialization",
      formData.specialization.filter((_, i) => i !== index)
    );
  };

  const handleAddLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      handleInputChange("languages", [
        ...formData.languages,
        newLanguage.trim(),
      ]);
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    handleInputChange(
      "languages",
      formData.languages.filter((_, i) => i !== index)
    );
  };

  const handleAddRemark = () => {
    if (newRemark.trim() && !formData.remarks.includes(newRemark.trim())) {
      handleInputChange("remarks", [...formData.remarks, newRemark.trim()]);
      setNewRemark("");
    }
  };

  const handleRemoveRemark = (index: number) => {
    handleInputChange(
      "remarks",
      formData.remarks.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/lawyers"
          : `/api/admin/lawyers/${lawyerId}`;

      const method = mode === "create" ? "POST" : "PUT";
      const body = mode === "create" ? formData : { ...formData, id: lawyerId };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message ||
            `Lawyer ${mode === "create" ? "created" : "updated"} successfully`
        );
        router.push("/admin/lawyers");
      } else {
        toast.error(data.error || `Failed to ${mode} lawyer`);
      }
    } catch (error) {
      toast.error(`Failed to ${mode} lawyer`);
    } finally {
      setLoading(false);
    }
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "create" ? "Add New Lawyer" : "Edit Lawyer"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "create"
              ? "Create a new lawyer profile"
              : "Update lawyer information"}
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-lg font-semibold">
            Lawyer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter lawyer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "experience",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  placeholder="Enter years of experience"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add specialization"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddSpecialization())
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSpecialization}
                  disabled={!newSpecialization.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialization.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add language"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddLanguage())
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLanguage}
                  disabled={!newLanguage.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((lang, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <div className="flex gap-2">
                <Textarea
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="Add remark"
                  className="min-h-[80px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRemark}
                  disabled={!newRemark.trim()}
                  className="self-start"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {formData.remarks.map((remark, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span className="flex-1 text-sm">{remark}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRemark(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={loading} className="shadow-sm">
                <Save className="w-4 h-4 mr-2" />
                {loading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Lawyer"
                  : "Update Lawyer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/lawyers")}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LawyerForm;
