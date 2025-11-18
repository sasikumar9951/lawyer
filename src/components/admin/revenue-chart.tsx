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
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    cases: number;
  }>;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  cases: {
    label: "Cases",
    color: "hsl(var(--chart-2))",
  },
};

export function RevenueChart({ data }: RevenueChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "both">(
    "both"
  );

  const formatValue = (value: number) => {
    if (selectedMetric === "revenue") {
      return `₹${value.toLocaleString()}`;
    }
    return value.toString();
  };

  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: item.date,
      revenue: item.revenue,
      cases: item.cases,
    }));
  }, [data]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const totalCases = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.cases, 0);
  }, [chartData]);

  const revenueChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const recent = chartData
      .slice(-7)
      .reduce((sum, item) => sum + item.revenue, 0);
    const previous = chartData
      .slice(-14, -7)
      .reduce((sum, item) => sum + item.revenue, 0);
    return previous ? ((recent - previous) / previous) * 100 : 0;
  }, [chartData]);

  const casesChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const recent = chartData
      .slice(-7)
      .reduce((sum, item) => sum + item.cases, 0);
    const previous = chartData
      .slice(-14, -7)
      .reduce((sum, item) => sum + item.cases, 0);
    return previous ? ((recent - previous) / previous) * 100 : 0;
  }, [chartData]);

  const TrendIcon = ({ change }: { change: number }) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <Card className="col-span-1 lg:col-span-1 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">
            Analytics Overview
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Revenue and case performance trends
          </CardDescription>
        </div>
        <Select
          value={selectedMetric}
          onValueChange={(value: "revenue" | "both") =>
            setSelectedMetric(value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Both Metrics</SelectItem>
            <SelectItem value="revenue">Revenue Only</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              Total Revenue
              <TrendIcon change={revenueChange} />
              <span
                className={`text-xs ${
                  revenueChange > 0
                    ? "text-green-600"
                    : revenueChange < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {revenueChange > 0 ? "+" : ""}
                {revenueChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalCases.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              Total Cases
              <TrendIcon change={casesChange} />
              <span
                className={`text-xs ${
                  casesChange > 0
                    ? "text-green-600"
                    : casesChange < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {casesChange > 0 ? "+" : ""}
                {casesChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[280px]">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) =>
                selectedMetric === "revenue"
                  ? `₹${(value / 1000).toFixed(0)}K`
                  : value
              }
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `₹${Number(value).toLocaleString()}`
                      : value,
                    name === "revenue" ? "Revenue" : "Cases",
                  ]}
                />
              }
            />
            {(selectedMetric === "both" || selectedMetric === "revenue") && (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
              />
            )}
            {selectedMetric === "both" && (
              <Area
                type="monotone"
                dataKey="cases"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#casesGradient)"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--chart-2))",
                  strokeWidth: 2,
                }}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
