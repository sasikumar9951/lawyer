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
        metaTitle: true,
        metaDescription: true,
        contentImage: true,
        enableDraftButton: true,
        enableSpeakButton: true,
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
        // SEO Meta
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        contentImage: service.contentImage,
        // Quick-action toggles
        enableDraftButton: service.enableDraftButton,
        enableSpeakButton: service.enableSpeakButton,
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
      // SEO Meta
      metaTitle:
        typeof body.metaTitle !== "undefined" ? body.metaTitle : undefined,
      metaDescription:
        typeof body.metaDescription !== "undefined"
          ? body.metaDescription
          : undefined,
      // Quick-action toggles
      enableDraftButton:
        typeof body.enableDraftButton !== "undefined"
          ? body.enableDraftButton
          : undefined,
      enableSpeakButton:
        typeof body.enableSpeakButton !== "undefined"
          ? body.enableSpeakButton
          : undefined,
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

    // If FAQs were provided in the request, replace existing FAQs
    if (typeof body.faqs !== "undefined") {
      try {
        await prisma.serviceFAQ.deleteMany({ where: { serviceId: id } });

        if (Array.isArray(body.faqs) && body.faqs.length > 0) {
          // Use createMany for performance (no individual selects needed)
          await prisma.serviceFAQ.createMany({
            data: body.faqs.map((f: any) => ({
              serviceId: id,
              question: f.question,
              answer: f.answer,
            })),
          });
        }
      } catch (e) {
        console.error("Failed to update faqs:", e);
      }
    }

    // If prices were provided, replace existing price components
    if (typeof body.prices !== "undefined") {
      try {
        await prisma.servicePrice.deleteMany({ where: { serviceId: id } });

        if (Array.isArray(body.prices) && body.prices.length > 0) {
          await prisma.servicePrice.createMany({
            data: body.prices.map((p: any) => ({
              serviceId: id,
              name: p.name,
              price: p.price,
              discountAmount:
                typeof p.discountAmount !== "undefined"
                  ? p.discountAmount
                  : null,
              isCompulsory: !!p.isCompulsory,
            })),
          });
        }
      } catch (e) {
        console.error("Failed to update prices:", e);
      }
    }

    // Re-fetch service to include latest related data (faqs, price)
    const refreshed = await prisma.service.findUnique({
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
        metaTitle: true,
        metaDescription: true,
        contentImage: true,
        enableDraftButton: true,
        enableSpeakButton: true,
        category: true,
        subCategoryId: true,
        subCategory: true,
        faqs: true,
        price: true,
        rating: true,
      },
    });

    return NextResponse.json({ success: true, data: refreshed });
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
