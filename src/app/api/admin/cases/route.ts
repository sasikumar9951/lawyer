import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      lawyerId,
      formResponseId,
      formData,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !serviceId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create everything in a single transaction
    const caseData = await prisma.$transaction(async (tx) => {
      let createdFormResponseId: string | null = formResponseId || null;

      if (!createdFormResponseId && formData) {
        const service = await tx.service.findUnique({
          where: { id: serviceId },
          select: { formId: true },
        });

        if (service?.formId) {
          const createdFormResponse = await tx.formResponse.create({
            data: {
              formId: service.formId,
              rawJson: JSON.parse(JSON.stringify(formData)),
            },
          });
          createdFormResponseId = createdFormResponse.id;
        }
      }

      const createdCase = await tx.case.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          serviceId,
          lawyerId: lawyerId || null,
          formResponseId: createdFormResponseId,
          status: "PENDING",
          isActive: true,
        },
        include: {
          service: {
            include: {
              category: true,
            },
          },
          lawyer: true,
          formResponse: true,
        },
      });

      return createdCase;
    });

    return NextResponse.json(
      { success: true, data: caseData, message: "Case created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create case" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
   
    const status = searchParams.get("status");
    const serviceId = searchParams.get("serviceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    // Add date filtering
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          service: {
            include: {
              category: true,
            },
          },
          lawyer: true,
          formResponse: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: cases,
      pagination: {
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}
