"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, FileText, Briefcase } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  activities: Array<{
    type: "case" | "lawyer";
    title: string;
    status?: string;
    date: string;
    id: string;
  }>;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "case":
      return <FileText className="h-4 w-4" />;
    case "lawyer":
      return <User className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "in_progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        <CardDescription className="text-sm">
          Latest activities across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getActivityIcon(activity.type)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(activity.date), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    {activity.status && (
                      <Badge
                        variant="secondary"
                        className={`text-xs mr-2 ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status.replace("_", " ")}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground capitalize">
                      {activity.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
