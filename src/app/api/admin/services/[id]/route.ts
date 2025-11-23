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
        heroTitle: true,
        heroSubtitle: true,
        heroImage: true,
        contentImage: true,
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
        subCategoryId: true,
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            categoryId: true,
            createdAt: true,
            updatedAt: true,
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
        heroTitle: service.heroTitle,
        heroSubtitle: service.heroSubtitle,
        heroImage: service.heroImage,
        contentImage: service.contentImage,
        contentJson: service.contentJson as ServiceContent | null,
        categoryName: service.categoryName,
        formId: service.formId,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
        category: {
          id: service.category.id,
          name: service.category.name,
          slug: service.category.slug,
          subCategories: [],
          createdAt: service.category.createdAt.toISOString(),
          updatedAt: service.category.updatedAt.toISOString(),
        },
        subCategoryId: service.subCategoryId || null,
        subCategory: service.subCategory
          ? {
              id: service.subCategory.id,
              name: service.subCategory.name,
              slug: service.subCategory.slug,
              categoryId: service.subCategory.categoryId,
              createdAt: service.subCategory.createdAt.toISOString(),
              updatedAt: service.subCategory.updatedAt.toISOString(),
            }
          : null,
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // ... validation ...

    // Build update payload conditionally so we don't overwrite fields unintentionally
    const updateData: any = {
      name: body.name,
      slug: body.slug,
      description:
        typeof body.description !== "undefined" ? body.description : undefined,
      isActive:
        typeof body.isActive !== "undefined" ? body.isActive : undefined,
      form: body.formId ? { connect: { id: body.formId } } : undefined,
      // Hero fields
      heroTitle:
        typeof body.heroTitle !== "undefined" ? body.heroTitle : undefined,
      heroSubtitle:
        typeof body.heroSubtitle !== "undefined"
          ? body.heroSubtitle
          : undefined,
      heroImage:
        typeof body.heroImage !== "undefined" ? body.heroImage : undefined,
    };

    // Sub-category: connect or disconnect explicitly
    if (typeof body.subCategoryId !== "undefined") {
      if (body.subCategoryId)
        updateData.subCategory = { connect: { id: body.subCategoryId } };
      else updateData.subCategory = { disconnect: true };
    }

    // Content image: only set if provided by client (to avoid accidental overwrite)
    if (typeof body.contentImage !== "undefined") {
      updateData.contentImage = body.contentImage || null;
    }

    // Content JSON
    if (typeof body.content !== "undefined") {
      updateData.contentJson = body.content
        ? JSON.parse(JSON.stringify(body.content))
        : null;
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
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
        heroTitle: true,
        heroSubtitle: true,
        heroImage: true,
        contentImage: true,
        category: true,
        subCategoryId: true,
        subCategory: true,
        faqs: true,
        price: true,
        rating: true,
      },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    // ... error handling
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
