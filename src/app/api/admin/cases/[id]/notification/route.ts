import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isAutoNotificationOn } = body;

    if (typeof isAutoNotificationOn !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isAutoNotificationOn must be a boolean" },
        { status: 400 }
      );
    }

    const updatedCase = await prisma.case.update({
      where: { id },
      data: { isAutoNotificationOn },
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

    return NextResponse.json({
      success: true,
      data: {
        id: updatedCase.id,
        status: updatedCase.status,
        isActive: updatedCase.isActive,
        customerName: updatedCase.customerName,
        customerEmail: updatedCase.customerEmail,
        customerPhone: updatedCase.customerPhone,
        isAutoNotificationOn: updatedCase.isAutoNotificationOn,
        createdAt: updatedCase.createdAt.toISOString(),
        updatedAt: updatedCase.updatedAt.toISOString(),
        lawyerId: updatedCase.lawyerId,
        serviceId: updatedCase.serviceId,
        formResponseId: updatedCase.formResponseId,
        service: updatedCase.service
          ? {
              id: updatedCase.service.id,
              name: updatedCase.service.name,
              slug: updatedCase.service.slug,
              description: updatedCase.service.description,
              isActive: updatedCase.service.isActive,
              contentJson: updatedCase.service.contentJson,
              createdAt: updatedCase.service.createdAt.toISOString(),
              updatedAt: updatedCase.service.updatedAt.toISOString(),
              categoryName: updatedCase.service.categoryName,
              formId: updatedCase.service.formId,
              category: updatedCase.service.category
                ? {
                    id: updatedCase.service.category.id,
                    name: updatedCase.service.category.name,
                    slug: updatedCase.service.category.slug,
                    createdAt:
                      updatedCase.service.category.createdAt.toISOString(),
                    updatedAt:
                      updatedCase.service.category.updatedAt.toISOString(),
                  }
                : null,
            }
          : null,
        lawyer: updatedCase.lawyer
          ? {
              id: updatedCase.lawyer.id,
              name: updatedCase.lawyer.name,
              email: updatedCase.lawyer.email,
            }
          : null,
        formResponse: updatedCase.formResponse
          ? {
              id: updatedCase.formResponse.id,
              rawJson: updatedCase.formResponse.rawJson,
            }
          : null,
      },
      message: "Auto-notification setting updated successfully",
    });
  } catch (error) {
    console.error("Error updating auto-notification setting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update auto-notification setting" },
      { status: 500 }
    );
  }
}
