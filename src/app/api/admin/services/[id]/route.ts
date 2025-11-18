import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  UpdateServiceRequest,
  ServiceResponse,
  ServiceContent,
} from "@/types/api/services";
import { generateSlug } from "@/lib/utils";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<ServiceResponse>> {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        contentJson: true,
        categoryName: true,
        formId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        form: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        faqs: {
          select: {
            id: true,
            serviceId: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        price: {
          select: {
            id: true,
            serviceId: true,
            name: true,
            price: true,
            discountAmount: true,
            isCompulsory: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        rating: {
          select: {
            id: true,
            serviceId: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        isActive: service.isActive,
        contentJson: service.contentJson as ServiceContent | null,
        categoryName: service.categoryName,
        formId: service.formId,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
        category: {
          id: service.category.id,
          name: service.category.name,
          slug: service.category.slug,
          createdAt: service.category.createdAt.toISOString(),
          updatedAt: service.category.updatedAt.toISOString(),
        },
        form: service.form,
        faqs: service.faqs.map((faq) => ({
          id: faq.id,
          serviceId: faq.serviceId,
          question: faq.question,
          answer: faq.answer,
          createdAt: faq.createdAt.toISOString(),
          updatedAt: faq.updatedAt.toISOString(),
        })),
        price: service.price.map((price) => ({
          id: price.id,
          serviceId: price.serviceId,
          name: price.name,
          price: price.price,
          discountAmount: price.discountAmount,
          isCompulsory: price.isCompulsory,
          createdAt: price.createdAt.toISOString(),
          updatedAt: price.updatedAt.toISOString(),
        })),
        rating: service.rating.map((rating) => ({
          id: rating.id,
          serviceId: rating.serviceId,
          rating: rating.rating,
          createdAt: rating.createdAt.toISOString(),
          updatedAt: rating.updatedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as any,
        message: "Failed to fetch service",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<ServiceResponse>> {
  try {
    const { id } = await params;
    const body: UpdateServiceRequest = await request.json();

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    // Check if name is being updated and if it conflicts with existing service in the same category
    if (body.name && body.name.trim() !== existingService.name) {
      const categoryName = body.categoryName || existingService.categoryName;
      const nameConflict = await prisma.service.findFirst({
        where: {
          name: body.name.trim(),
          categoryName: categoryName,
          NOT: { id },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          {
            success: false,
            data: {} as any,
            message:
              "Service with this name already exists in the selected category",
          },
          { status: 409 }
        );
      }
    }

    // Validate category and form if provided
    if (body.categoryName) {
      const category = await prisma.serviceCategory.findUnique({
        where: { name: body.categoryName },
      });
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            data: {} as any,
            message: "Category not found",
          },
          { status: 404 }
        );
      }
    }

    if (body.formId) {
      const form = await prisma.form.findUnique({
        where: { id: body.formId },
      });
      if (!form) {
        return NextResponse.json(
          {
            success: false,
            data: {} as any,
            message: "Form not found",
          },
          { status: 404 }
        );
      }
    }

    // Update service with transaction to handle related data
    const service = await prisma.$transaction(async (tx) => {
      // Update the service
      const updatedService = await tx.service.update({
        where: { id },
        data: {
          ...(body.name && {
            name: body.name.trim(),
            slug: body.slug || generateSlug(body.name.trim()),
          }),
          ...(body.description !== undefined && {
            description: body.description?.trim() || null,
          }),
          ...(body.isActive !== undefined && { isActive: body.isActive }),
          ...(body.categoryName && { categoryName: body.categoryName }),
          ...(body.formId && { formId: body.formId }),
          ...(body.content !== undefined && {
            contentJson: body.content
              ? JSON.parse(JSON.stringify(body.content))
              : null,
          }),
        },
      });

      // Update FAQs if provided
      if (body.faqs) {
        // Delete existing FAQs
        await tx.serviceFAQ.deleteMany({
          where: { serviceId: id },
        });

        // Create new FAQs
        if (body.faqs.length > 0) {
          await tx.serviceFAQ.createMany({
            data: body.faqs.map((faq) => ({
              serviceId: id,
              question: faq.question,
              answer: faq.answer,
            })),
          });
        }
      }

      // Update prices if provided
      if (body.prices) {
        // Delete existing prices
        await tx.servicePrice.deleteMany({
          where: { serviceId: id },
        });

        // Create new prices
        if (body.prices.length > 0) {
          await tx.servicePrice.createMany({
            data: body.prices.map((price) => ({
              serviceId: id,
              name: price.name,
              price: price.price,
              discountAmount: price.discountAmount || null,
              isCompulsory: price.isCompulsory || false,
            })),
          });
        }
      }

      return updatedService;
    });

    // Fetch the updated service with all relations
    const updatedServiceWithRelations = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        contentJson: true,
        categoryName: true,
        formId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        form: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        faqs: {
          select: {
            id: true,
            serviceId: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        price: {
          select: {
            id: true,
            serviceId: true,
            name: true,
            price: true,
            discountAmount: true,
            isCompulsory: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        rating: {
          select: {
            id: true,
            serviceId: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!updatedServiceWithRelations) {
      throw new Error("Failed to fetch updated service");
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedServiceWithRelations.id,
        name: updatedServiceWithRelations.name,
        slug: updatedServiceWithRelations.slug,
        description: updatedServiceWithRelations.description,
        isActive: updatedServiceWithRelations.isActive,
        contentJson:
          updatedServiceWithRelations.contentJson as ServiceContent | null,
        categoryName: updatedServiceWithRelations.categoryName,
        formId: updatedServiceWithRelations.formId,
        createdAt: updatedServiceWithRelations.createdAt.toISOString(),
        updatedAt: updatedServiceWithRelations.updatedAt.toISOString(),
        category: {
          id: updatedServiceWithRelations.category.id,
          name: updatedServiceWithRelations.category.name,
          slug: updatedServiceWithRelations.category.slug,
          createdAt:
            updatedServiceWithRelations.category.createdAt.toISOString(),
          updatedAt:
            updatedServiceWithRelations.category.updatedAt.toISOString(),
        },
        form: updatedServiceWithRelations.form,
        faqs: updatedServiceWithRelations.faqs.map((faq) => ({
          id: faq.id,
          serviceId: faq.serviceId,
          question: faq.question,
          answer: faq.answer,
          createdAt: faq.createdAt.toISOString(),
          updatedAt: faq.updatedAt.toISOString(),
        })),
        price: updatedServiceWithRelations.price.map((price) => ({
          id: price.id,
          serviceId: price.serviceId,
          name: price.name,
          price: price.price,
          discountAmount: price.discountAmount,
          isCompulsory: price.isCompulsory,
          createdAt: price.createdAt.toISOString(),
          updatedAt: price.updatedAt.toISOString(),
        })),
        rating: updatedServiceWithRelations.rating.map((rating) => ({
          id: rating.id,
          serviceId: rating.serviceId,
          rating: rating.rating,
          createdAt: rating.createdAt.toISOString(),
          updatedAt: rating.updatedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as any,
        message: "Failed to update service",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const { id } = await params;

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete service",
      },
      { status: 500 }
    );
  }
}
