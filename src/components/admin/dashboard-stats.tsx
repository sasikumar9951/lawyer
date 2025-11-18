"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useMemo } from "react";

interface StatsProps {
  stats: {
    totalCases: number;
    activeCases: number;
    completedCases: number;
    pendingCases: number;
    totalLawyers: number;
    totalServices: number;
    totalRevenue: number;
  };
  trends?: {
    casesChange: number;
    revenueChange: number;
    lawyersChange: number;
    currentMonthCases: number;
    lastMonthCases: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    currentMonthLawyers: number;
    lastMonthLawyers: number;
  };
}

const statsConfig = [
  {
    title: "Total Cases",
    value: "totalCases",
    icon: FileText,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    textColor: "text-blue-700 dark:text-blue-300",
    description: "All cases",
    trendKey: "casesChange",
  },
  {
    title: "Active Cases",
    value: "activeCases",
    icon: Clock,
    gradient: "from-orange-500 to-orange-600",
    bgGradient:
      "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    textColor: "text-orange-700 dark:text-orange-300",
    description: "In progress",
    trendKey: null,
  },
  {
    title: "Completed",
    value: "completedCases",
    icon: CheckCircle,
    gradient: "from-green-500 to-green-600",
    bgGradient:
      "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    textColor: "text-green-700 dark:text-green-300",
    description: "Successfully done",
    trendKey: null,
  },
  {
    title: "Pending",
    value: "pendingCases",
    icon: AlertCircle,
    gradient: "from-yellow-500 to-yellow-600",
    bgGradient:
      "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    textColor: "text-yellow-700 dark:text-yellow-300",
    description: "Awaiting action",
    trendKey: null,
  },
  {
    title: "Lawyers",
    value: "totalLawyers",
    icon: Users,
    gradient: "from-purple-500 to-purple-600",
    bgGradient:
      "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    textColor: "text-purple-700 dark:text-purple-300",
    description: "Active professionals",
    trendKey: "lawyersChange",
  },
  {
    title: "Revenue",
    value: "totalRevenue",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient:
      "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
    textColor: "text-emerald-700 dark:text-emerald-300",
    description: "Total revenue",
    trendKey: "revenueChange",
  },
];

export function DashboardStats({ stats, trends }: StatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        const value = stats[stat.value as keyof StatsProps["stats"]];

        // Calculate trend data
        let trendValue = null;
        let trendUp = false;

        if (trends && stat.trendKey) {
          trendValue = trends[stat.trendKey as keyof typeof trends];
          trendUp = trendValue > 0;
        }

        return (
          <Card
            key={stat.title}
            className={`${stat.bgGradient} border-0 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group`}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-sm`}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
            </CardHeader>

            <CardContent className="relative">
              <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value === "totalRevenue"
                  ? `₹${value.toLocaleString()}`
                  : value.toLocaleString()}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {stat.description}
                </span>
                {trendValue !== null && (
                  <div
                    className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                      trendUp
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {trendUp ? (
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    ) : (
                      <ArrowDownRight className="h-2.5 w-2.5" />
                    )}
                    <span className="font-medium text-[10px]">
                      {trendUp ? "+" : ""}
                      {trendValue}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
