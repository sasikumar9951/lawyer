"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";
import { useState } from "react";

interface DashboardFiltersProps {
  onPeriodChange: (period: string) => void;
  onRefresh: () => void;
  currentPeriod: string;
  isLoading?: boolean;
}

const periodOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last year" },
];

export function DashboardFilters({
  onPeriodChange,
  onRefresh,
  currentPeriod,
  isLoading,
}: DashboardFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    onPeriodChange(value);
  };

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Period:</span>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="ml-2"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
