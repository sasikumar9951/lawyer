import { NextRequest, NextResponse } from "next/server";
import {
  startOfDay,
  endOfDay,
  subDays,
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30"; // days
    const days = parseInt(period);

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Calculate monthly periods for trend analysis
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    // Get basic stats
    const [
      totalCases,
      activeCases,
      completedCases,
      pendingCases,
      totalLawyers,
      totalServices,
      totalRevenue,
      recentCases,
      casesByStatus,
      revenueByDay,
      casesByService,
      casesByLawyer,
      recentActivity,
      // Monthly trend data
      currentMonthCases,
      lastMonthCases,
      currentMonthRevenue,
      lastMonthRevenue,
      currentMonthLawyers,
      lastMonthLawyers,
      // Lawyer inquiries
      lawyerInquiries,
    ] = await Promise.all([
      // Total cases
      prisma.case.count(),

      // Active cases
      prisma.case.count({
        where: { isActive: true },
      }),

      // Completed cases
      prisma.case.count({
        where: { status: "COMPLETED" },
      }),

      // Pending cases
      prisma.case.count({
        where: { status: "PENDING" },
      }),

      // Total lawyers
      prisma.lawyer.count(),

      // Total services
      prisma.service.count({
        where: { isActive: true },
      }),

      // Total revenue (from service prices)
      prisma.servicePrice.aggregate({
        _sum: {
          price: true,
        },
      }),

      // Recent cases (last 10)
      prisma.case.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          lawyer: {
            select: { name: true },
          },
          service: {
            select: {
              name: true,
              category: {
                select: { name: true },
              },
            },
          },
        },
      }),

      // Cases by status
      prisma.case.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      // Revenue by day (mock data for now - you can calculate from actual transactions)
      prisma.case.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          service: {
            include: {
              price: true,
            },
          },
        },
      }),

      // Cases by service
      prisma.case.groupBy({
        by: ["serviceId"],
        _count: {
          serviceId: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Cases by lawyer
      prisma.case.groupBy({
        by: ["lawyerId"],
        _count: {
          lawyerId: true,
        },
        where: {
          lawyerId: {
            not: null,
          },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Recent activity (mix of different events)
      Promise.all([
        // Recent cases
        prisma.case.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            customerName: true,
            createdAt: true,
            status: true,
          },
        }),
        // Recent lawyers
        prisma.lawyer.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),
      ]),

      // Monthly trend data
      // Current month cases
      prisma.case.count({
        where: {
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
      }),

      // Last month cases
      prisma.case.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Current month revenue
      prisma.case.findMany({
        where: {
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
        include: {
          service: {
            include: {
              price: true,
            },
          },
        },
      }),

      // Last month revenue
      prisma.case.findMany({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
        include: {
          service: {
            include: {
              price: true,
            },
          },
        },
      }),

      // Current month lawyers
      prisma.lawyer.count({
        where: {
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
      }),

      // Last month lawyers
      prisma.lawyer.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Lawyer inquiries (new lawyer registrations)
      prisma.lawyer.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          specialization: true,
          experience: true,
          createdAt: true,
        },
      }),
    ]);

    // Process revenue by day
    const revenueData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(endDate, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayCases = revenueByDay.filter(
        (c) => c.createdAt >= dayStart && c.createdAt <= dayEnd
      );

      const dayRevenue = dayCases.reduce((total, case_) => {
        return total + (case_.service.price?.[0]?.price || 0);
      }, 0);

      revenueData.push({
        date: format(date, "MMM dd"),
        revenue: dayRevenue,
        cases: dayCases.length,
      });
    }

    // Process cases by service with names
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: casesByService.map((c) => c.serviceId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const casesByServiceWithNames = casesByService.map((item) => ({
      ...item,
      serviceName:
        services.find((s) => s.id === item.serviceId)?.name || "Unknown",
    }));

    // Process cases by lawyer with names
    const lawyers = await prisma.lawyer.findMany({
      where: {
        id: {
          in: casesByLawyer.map((c) => c.lawyerId!).filter(Boolean),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const casesByLawyerWithNames = casesByLawyer.map((item) => ({
      ...item,
      lawyerName:
        lawyers.find((l) => l.id === item.lawyerId)?.name || "Unknown",
    }));

    // Calculate monthly trends
    const currentMonthRevenueTotal = currentMonthRevenue.reduce(
      (total, case_) => {
        return total + (case_.service.price?.[0]?.price || 0);
      },
      0
    );

    const lastMonthRevenueTotal = lastMonthRevenue.reduce((total, case_) => {
      return total + (case_.service.price?.[0]?.price || 0);
    }, 0);

    // Calculate percentage changes
    const casesChange = lastMonthCases
      ? ((currentMonthCases - lastMonthCases) / lastMonthCases) * 100
      : 0;
    const revenueChange = lastMonthRevenueTotal
      ? ((currentMonthRevenueTotal - lastMonthRevenueTotal) /
          lastMonthRevenueTotal) *
        100
      : 0;
    const lawyersChange = lastMonthLawyers
      ? ((currentMonthLawyers - lastMonthLawyers) / lastMonthLawyers) * 100
      : 0;

    // Combine recent activity
    const [recentCaseActivity, recentLawyerActivity] = recentActivity;
    const combinedActivity = [
      ...recentCaseActivity.map((c) => ({
        type: "case" as const,
        title: `New case: ${c.customerName}`,
        status: c.status,
        date: c.createdAt,
        id: c.id,
      })),
      ...recentLawyerActivity.map((l) => ({
        type: "lawyer" as const,
        title: `New lawyer: ${l.name}`,
        date: l.createdAt,
        id: l.id,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        totalCases,
        activeCases,
        completedCases,
        pendingCases,
        totalLawyers,
        totalServices,
        totalRevenue: totalRevenue._sum.price || 0,
      },
      trends: {
        casesChange: Math.round(casesChange * 10) / 10,
        revenueChange: Math.round(revenueChange * 10) / 10,
        lawyersChange: Math.round(lawyersChange * 10) / 10,
        currentMonthCases,
        lastMonthCases,
        currentMonthRevenue: currentMonthRevenueTotal,
        lastMonthRevenue: lastMonthRevenueTotal,
        currentMonthLawyers,
        lastMonthLawyers,
      },
      recentCases,
      casesByStatus: casesByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      revenueByDay: revenueData,
      casesByService: casesByServiceWithNames,
      casesByLawyer: casesByLawyerWithNames,
      recentActivity: combinedActivity,
      lawyerInquiries,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
