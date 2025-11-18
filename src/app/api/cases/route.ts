import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Cases API - Received request body:", body);

    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      formData,
      selectedPrices,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !serviceId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get service to find the associated form
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        form: true,
      },
    });

    console.log("Cases API - Found service:", service);

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    let formResponseId = null;

    // Create form response if form data is provided
    if (formData && service.form) {
      try {
        const formResponse = await prisma.formResponse.create({
          data: {
            formId: service.form.id,
            rawJson: formData,
          },
        });
        formResponseId = formResponse.id;
        console.log("Form response created with ID:", formResponseId);
      } catch (error) {
        console.error("Error creating form response:", error);
        return NextResponse.json(
          { success: false, message: "Failed to save form data" },
          { status: 500 }
        );
      }
    }

    // Create the case
    const caseData = await prisma.case.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        serviceId,
        formResponseId: formResponseId,
        status: "PENDING",
        isActive: true,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        formResponse: true,
      },
    });

    console.log("Case created successfully:", caseData);

    return NextResponse.json(
      {
        success: true,
        data: caseData,
        message: "Case created successfully",
      },
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
