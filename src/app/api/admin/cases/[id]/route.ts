import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        lawyer: true,
        formResponse: true,
        meetings: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: caseData.id,
        status: caseData.status,
        isActive: caseData.isActive,
        customerName: caseData.customerName,
        customerEmail: caseData.customerEmail,
        customerPhone: caseData.customerPhone,
        isAutoNotificationOn: caseData.isAutoNotificationOn,
        createdAt: caseData.createdAt.toISOString(),
        updatedAt: caseData.updatedAt.toISOString(),
        lawyerId: caseData.lawyerId,
        serviceId: caseData.serviceId,
        formResponseId: caseData.formResponseId,
        service: caseData.service
          ? {
              id: caseData.service.id,
              name: caseData.service.name,
              slug: caseData.service.slug,
              description: caseData.service.description,
              isActive: caseData.service.isActive,
              contentJson: caseData.service.contentJson,
              createdAt: caseData.service.createdAt.toISOString(),
              updatedAt: caseData.service.updatedAt.toISOString(),
              categoryName: caseData.service.categoryName,
              formId: caseData.service.formId,
              category: caseData.service.category
                ? {
                    id: caseData.service.category.id,
                    name: caseData.service.category.name,
                    slug: caseData.service.category.slug,
                    createdAt:
                      caseData.service.category.createdAt.toISOString(),
                    updatedAt:
                      caseData.service.category.updatedAt.toISOString(),
                  }
                : null,
            }
          : null,
        lawyer: caseData.lawyer
          ? {
              id: caseData.lawyer.id,
              name: caseData.lawyer.name,
              email: caseData.lawyer.email,
            }
          : null,
        formResponse: caseData.formResponse
          ? {
              id: caseData.formResponse.id,
              rawJson: caseData.formResponse.rawJson,
            }
          : null,
        meetings:
          caseData.meetings?.map((meeting) => ({
            id: meeting.id,
            linkOrNumber: meeting.linkOrNumber,
            startTime: meeting.startTime?.toISOString() || null,
            endTime: meeting.endTime?.toISOString() || null,
            duration: meeting.duration,
            meetingNotes: meeting.meetingNotes,
            meetingName: meeting.meetingName,
            caseId: meeting.caseId,
            createdAt: meeting.createdAt.toISOString(),
            updatedAt: meeting.updatedAt.toISOString(),
          })) || [],
      },
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, lawyerId, isActive, isAutoNotificationOn } = body;

    const updateData: any = {};

    if (status !== undefined) updateData.status = status;
    if (lawyerId !== undefined) updateData.lawyerId = lawyerId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isAutoNotificationOn !== undefined)
      updateData.isAutoNotificationOn = isAutoNotificationOn;

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        service: {
          include: {
            category: true,
          },
        },
        lawyer: true,
        formResponse: true,
        meetings: {
          orderBy: { createdAt: "desc" },
        },
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
        meetings:
          updatedCase.meetings?.map((meeting) => ({
            id: meeting.id,
            linkOrNumber: meeting.linkOrNumber,
            startTime: meeting.startTime?.toISOString() || null,
            endTime: meeting.endTime?.toISOString() || null,
            duration: meeting.duration,
            meetingNotes: meeting.meetingNotes,
            meetingName: meeting.meetingName,
            caseId: meeting.caseId,
            createdAt: meeting.createdAt.toISOString(),
            updatedAt: meeting.updatedAt.toISOString(),
          })) || [],
      },
      message: "Case updated successfully",
    });
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update case" },
      { status: 500 }
    );
  }
}
