"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Link, FileText, Eye } from "lucide-react";
import { CaseMeeting } from "@/types/api/cases";

interface MeetingViewModalProps {
  meeting: CaseMeeting;
}

export const MeetingViewModal = ({ meeting }: MeetingViewModalProps) => {
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Meeting Details
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-6">
          {meeting.meetingName && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Meeting Name
              </Label>
              <div className="w-full px-3 py-2 bg-gray-50 rounded-md border text-gray-900">
                {meeting.meetingName}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Link or Phone Number
            </Label>
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md border text-gray-900 font-mono">
              {meeting.linkOrNumber}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Start Time
              </Label>
              <div className="w-full px-3 py-2 bg-gray-50 rounded-md border text-gray-900">
                {formatDateTime(meeting.startTime || null)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                End Time
              </Label>
              <div className="w-full px-3 py-2 bg-gray-50 rounded-md border text-gray-900">
                {formatDateTime(meeting.endTime || null)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Duration (minutes)
            </Label>
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md border text-gray-900">
              {formatDuration(meeting.duration || null)}
            </div>
          </div>

          {meeting.meetingNotes && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Meeting Notes
              </Label>
              <div className="w-full px-3 py-2 bg-gray-50 rounded-md border text-gray-900 whitespace-pre-wrap leading-relaxed min-h-[80px]">
                {meeting.meetingNotes}
              </div>
            </div>
          )}

          
        </form>
      </DialogContent>
    </Dialog>
  );
};
