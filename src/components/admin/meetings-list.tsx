"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ChevronUp, ChevronDown } from "lucide-react";
import { CaseMeeting } from "@/types/api/cases";
import { MeetingViewModal } from "./meeting-view-modal";

interface MeetingsListProps {
  meetings: CaseMeeting[];
}

export const MeetingsList = ({ meetings }: MeetingsListProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleToggleCollapse = () => setIsCollapsed((prev) => !prev);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
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

  if (meetings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Meetings
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              onClick={handleToggleCollapse}
              aria-expanded={!isCollapsed}
              aria-controls="meetings-card-content"
            >
              {isCollapsed ? (
                <span className="flex items-center gap-1">
                  <ChevronDown className="w-4 h-4" /> Expand
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ChevronUp className="w-4 h-4" /> Collapse
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent id="meetings-card-content">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No meetings scheduled yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Meeting" to schedule the first meeting
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Meetings ({meetings.length})
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2"
            onClick={handleToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-controls="meetings-card-content"
          >
            {isCollapsed ? (
              <span className="flex items-center gap-1">
                <ChevronDown className="w-4 h-4" /> Expand
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ChevronUp className="w-4 h-4" /> Collapse
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent id="meetings-card-content">
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {meeting.meetingName || "Untitled Meeting"}
                      </h4>
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {meeting.startTime ? "Scheduled" : "No time set"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">
                          Start: {formatDateTime(meeting.startTime || null)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="font-medium">
                          Duration: {formatDuration(meeting.duration || null)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="truncate font-medium">
                          Link: {meeting.linkOrNumber}
                        </span>
                      </div>
                    </div>

                    {meeting.meetingNotes && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {meeting.meetingNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <MeetingViewModal meeting={meeting} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
