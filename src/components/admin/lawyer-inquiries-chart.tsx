"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { Users, Mail, Phone, Briefcase } from "lucide-react";

interface LawyerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialization: string[];
  experience: number | null;
  createdAt: string;
}

interface LawyerInquiriesChartProps {
  inquiries: LawyerInquiry[];
}

export function LawyerInquiriesChart({ inquiries }: LawyerInquiriesChartProps) {
  const chartData = useMemo(() => {
    // Group by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dataByDate = last7Days.map((date) => {
      const dayInquiries = inquiries.filter((inquiry) =>
        inquiry.createdAt.startsWith(date)
      );

      return {
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count: dayInquiries.length,
        fill: "#8b5cf6", // purple-500
      };
    });

    return dataByDate;
  }, [inquiries]);

  const totalInquiries = inquiries.length;
  const thisWeekInquiries = chartData.reduce((sum, day) => sum + day.count, 0);
  const lastWeekInquiries = Math.max(0, totalInquiries - thisWeekInquiries);
  const weekChange = lastWeekInquiries
    ? ((thisWeekInquiries - lastWeekInquiries) / lastWeekInquiries) * 100
    : 0;

  const specializationStats = useMemo(() => {
    const specializationCount: { [key: string]: number } = {};

    inquiries.forEach((inquiry) => {
      inquiry.specialization.forEach((spec) => {
        specializationCount[spec] = (specializationCount[spec] || 0) + 1;
      });
    });

    return Object.entries(specializationCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([spec, count]) => ({ specialization: spec, count }));
  }, [inquiries]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Lawyer Inquiries
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          New lawyer registrations and specializations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalInquiries}
            </div>
            <div className="text-xs text-muted-foreground">Total Inquiries</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {thisWeekInquiries}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {weekChange > 0 ? "+" : ""}
              {weekChange.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Week Change</div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={{}} className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                className="text-xs"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                className="text-xs"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value} inquiries`, "Count"]}
                  />
                }
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Specialization Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Top Specializations
          </h4>
          <div className="space-y-2">
            {specializationStats.map((item, index) => (
              <div
                key={item.specialization}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{item.specialization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count /
                            Math.max(
                              ...specializationStats.map((s) => s.count)
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
