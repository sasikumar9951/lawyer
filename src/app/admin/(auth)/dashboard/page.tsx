"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { RecentActivity } from "@/components/admin/recent-activity";
import { DashboardFilters } from "@/components/admin/dashboard-filters";
import { PerformanceMetrics } from "@/components/admin/performance-metrics";
import { LawyerInquiriesChart } from "@/components/admin/lawyer-inquiries-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface DashboardData {
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
  recentCases: any[];
  casesByStatus: Array<{
    status: string;
    count: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    cases: number;
  }>;
  casesByService: Array<{
    serviceId: string;
    serviceName: string;
    _count: {
      serviceId: number;
    };
  }>;
  casesByLawyer: Array<{
    lawyerId: string | null;
    lawyerName: string;
    _count: {
      lawyerId: number;
    };
  }>;
  recentActivity: Array<{
    type: "case" | "lawyer";
    title: string;
    status?: string;
    date: string;
    id: string;
  }>;
  lawyerInquiries: Array<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    specialization: string[];
    experience: number | null;
    createdAt: string;
  }>;
}

const AdminDashboardPage = () => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30");

  const fetchDashboardData = async (selectedPeriod: string = period) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/admin/dashboard?period=${selectedPeriod}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch dashboard data: ${response.statusText}`
        );
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    fetchDashboardData(newPeriod);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (!session) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "Admin"}
          </p>
        </div>
        <DashboardFilters
          onPeriodChange={handlePeriodChange}
          onRefresh={handleRefresh}
          currentPeriod={period}
          isLoading={isLoading}
        />
      </div>

      {/* Loading State */}
      {isLoading && !dashboardData && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {dashboardData && (
        <DashboardStats
          stats={dashboardData.stats}
          trends={dashboardData.trends}
        />
      )}

      {/* Charts Grid - Full Width */}
   

      {/* Lawyer Inquiries Chart - Full Width */}
      {dashboardData && (
        <LawyerInquiriesChart inquiries={dashboardData.lawyerInquiries} />
      )}

      {/* Performance Metrics */}
      {dashboardData && <PerformanceMetrics stats={dashboardData.stats} />}

      {/* Recent Activity */}
      {dashboardData && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity activities={dashboardData.recentActivity} />
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-4">
            {/* <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="/admin/cases"
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  View All Cases
                </a>
                <a
                  href="/admin/lawyers"
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Manage Lawyers
                </a>
                <a
                  href="/admin/services"
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Manage Services
                </a>
                <a
                  href="/admin/forms"
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  View Forms
                </a>
              </div>
            </div> */}

            {/* System Status */}
            {/* <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Status</span>
                  <span className="text-green-600">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Update</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboardPage;
