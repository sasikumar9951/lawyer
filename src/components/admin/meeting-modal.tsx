"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, Plus, Info } from "lucide-react";
import { CreateMeetingRequest } from "@/types/api/cases";
import { GenerateMeetingLinkRequest } from "@/types/api/meetings";
import { generateMeetingLink } from "@/lib/meeting/actions";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MeetingModalProps {
  caseId: string;
  onMeetingCreated: () => void;
}

// Function to sanitize meeting name for Daily.co API
const sanitizeMeetingName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Replace any non-alphanumeric characters with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
};

export const MeetingModal = ({
  caseId,
  onMeetingCreated,
}: MeetingModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMeetingRequest>({
    linkOrNumber: "",
    startTime: null,
    endTime: null,
    duration: null,
    meetingNotes: null,
    meetingName: null,
  });
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [sanitizedName, setSanitizedName] = useState<string>("");

  const handleInputChange = (
    field: keyof CreateMeetingRequest,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-sanitize meeting name when it changes
    if (field === "meetingName" && typeof value === "string") {
      const sanitized = sanitizeMeetingName(value);
      setSanitizedName(sanitized);
    }
  };

  // Auto-calculate time fields based on what's available
  useEffect(() => {
    // Case 1: If start time and end time are set, calculate duration
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);

      if (end > start) {
        const diffInMs = end.getTime() - start.getTime();
        const diffInMinutes = Math.round(diffInMs / (1000 * 60));
        setFormData((prev) => ({
          ...prev,
          duration: diffInMinutes,
        }));
      }
    }
    // Case 2: If start time and duration are set, calculate end time
    else if (formData.startTime && formData.duration) {
      const start = new Date(formData.startTime);
      const end = new Date(start.getTime() + formData.duration * 60 * 1000);
      setFormData((prev) => ({
        ...prev,
        endTime: end.toISOString().slice(0, 16), // Format for datetime-local input
      }));
    }
    // Case 3: If end time and duration are set, calculate start time
    else if (formData.endTime && formData.duration) {
      const end = new Date(formData.endTime);
      const start = new Date(end.getTime() - formData.duration * 60 * 1000);
      setFormData((prev) => ({
        ...prev,
        startTime: start.toISOString().slice(0, 16), // Format for datetime-local input
      }));
    }
  }, [formData.startTime, formData.endTime, formData.duration]);

  const handleGenerateLink = async () => {
    if (!formData.startTime || !formData.endTime || !formData.duration) {
      toast.error("Please fill in start time, end time, and duration first");
      return;
    }

    setIsGeneratingLink(true);
    try {
      const request: GenerateMeetingLinkRequest = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: formData.duration,
        timezone: "Asia/Kolkata",
        meetingName: sanitizedName || undefined, // Use sanitized name for API
      };

      const response = await generateMeetingLink(request);

      if (response.success && response.data) {
        setGeneratedLink(response.data.link);
        setFormData((prev) => ({ ...prev, linkOrNumber: response.data!.link }));
        toast.success("Meeting link generated successfully!");
      } else {
        toast.error(response.message || "Failed to generate meeting link");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate meeting link");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.linkOrNumber.trim()) {
      toast.error("Link or number is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/cases/${caseId}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Meeting created successfully");
        setIsOpen(false);
        setFormData({
          linkOrNumber: "",
          startTime: null,
          endTime: null,
          duration: null,
          meetingNotes: null,
          meetingName: null,
        });
        setSanitizedName("");
        onMeetingCreated();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create meeting");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule New Meeting
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="meetingName"
                className="text-sm font-medium text-gray-700"
              >
                Meeting Name
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Meeting names will be automatically formatted to remove
                      spaces and special characters for compatibility with the
                      video conferencing system.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="meetingName"
              placeholder="Enter meeting name"
              value={formData.meetingName || ""}
              onChange={(e) => handleInputChange("meetingName", e.target.value)}
              className="w-full px-3 py-2"
            />
            {sanitizedName && sanitizedName !== formData.meetingName && (
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                <strong>Formatted name:</strong> {sanitizedName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startTime"
                className="text-sm font-medium text-gray-700"
              >
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime || ""}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="endTime"
                className="text-sm font-medium text-gray-700"
              >
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime || ""}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="duration"
              className="text-sm font-medium text-gray-700"
            >
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="Enter duration in minutes"
              value={formData.duration || ""}
              onChange={(e) =>
                handleInputChange(
                  "duration",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full px-3 py-2"
            />
            <p className="text-xs text-gray-500">
              Auto-calculates when you set start/end times, or set manually to
              auto-calculate other times
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="linkOrNumber"
              className="text-sm font-medium text-gray-700"
            >
              Link or Phone Number *
            </Label>
            <div className="space-y-2">
              <Input
                id="linkOrNumber"
                placeholder="Enter meeting link or phone number"
                value={formData.linkOrNumber}
                onChange={(e) =>
                  handleInputChange("linkOrNumber", e.target.value)
                }
                required
                className="w-full px-3 py-2"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateLink}
                disabled={
                  isGeneratingLink ||
                  !formData.startTime ||
                  !formData.endTime ||
                  !formData.duration
                }
                className="w-full"
              >
                {isGeneratingLink ? "Generating..." : "Generate Meeting Link"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="meetingNotes"
              className="text-sm font-medium text-gray-700"
            >
              Meeting Notes
            </Label>
            <Textarea
              id="meetingNotes"
              placeholder="Enter meeting notes"
              value={formData.meetingNotes || ""}
              onChange={(e) =>
                handleInputChange("meetingNotes", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
