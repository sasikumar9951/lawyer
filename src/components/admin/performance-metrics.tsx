"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useMemo } from "react";

interface PerformanceMetricsProps {
  stats: {
    totalCases: number;
    activeCases: number;
    completedCases: number;
    pendingCases: number;
    totalLawyers: number;
    totalServices: number;
    totalRevenue: number;
  };
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  const metrics = useMemo(() => {
    const totalCases = stats.totalCases;
    const completionRate = totalCases
      ? ((stats.completedCases / totalCases) * 100).toFixed(1)
      : "0";
    const activeRate = totalCases
      ? ((stats.activeCases / totalCases) * 100).toFixed(1)
      : "0";
    const pendingRate = totalCases
      ? ((stats.pendingCases / totalCases) * 100).toFixed(1)
      : "0";

    return [
      {
        title: "Completion Rate",
        value: `${completionRate}%`,
        description: `${stats.completedCases} of ${totalCases} cases completed`,
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        progress: parseFloat(completionRate),
        progressColor: "bg-green-500",
      },
      {
        title: "Active Cases",
        value: `${activeRate}%`,
        description: `${stats.activeCases} cases in progress`,
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        progress: parseFloat(activeRate),
        progressColor: "bg-blue-500",
      },
      {
        title: "Pending Cases",
        value: `${pendingRate}%`,
        description: `${stats.pendingCases} cases awaiting action`,
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        progress: parseFloat(pendingRate),
        progressColor: "bg-orange-500",
      },
    ];
  }, [stats]);

  const efficiencyMetrics = useMemo(() => {
    const casesPerLawyer = stats.totalLawyers
      ? (stats.totalCases / stats.totalLawyers).toFixed(1)
      : "0";
    const revenuePerCase = stats.totalCases
      ? Math.round(stats.totalRevenue / stats.totalCases)
      : 0;

    return [
      {
        title: "Cases per Lawyer",
        value: casesPerLawyer,
        icon: Users,
        color: "text-purple-600",
        description: "Average workload distribution",
      },
      {
        title: "Revenue per Case",
        value: `₹${revenuePerCase.toLocaleString()}`,
        icon: TrendingUp,
        color: "text-indigo-600",
        description: "Average value per case",
      },
    ];
  }, [stats]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Performance Metrics */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Key performance indicators and completion rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{metric.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {metric.value}
                  </Badge>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Efficiency Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Efficiency Metrics
          </CardTitle>
          <CardDescription>
            Productivity and resource utilization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {efficiencyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className={`p-4 rounded-lg border border-blue-100`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <div>
                    <p className="font-medium text-sm">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <p className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
            );
          })}

          {/* Quick Stats */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">
                  {stats.totalLawyers}
                </p>
                <p className="text-xs text-muted-foreground">Active Lawyers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {stats.totalServices}
                </p>
                <p className="text-xs text-muted-foreground">
                  Available Services
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
