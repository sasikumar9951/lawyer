import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  CreateServiceRequest,
  ServicesResponse,
  ServiceResponse,
  ServiceContent,
} from "@/types/api/services";
import { generateSlug } from "@/lib/utils";

// ============================================================================
// GET: Fetch All Services
// ============================================================================
export async function GET(): Promise<NextResponse<ServicesResponse>> {
  try {
    const services = await prisma.service.findMany({
      include: {
        subCategory: true,
        category: true,
        form: true,
        faqs: true,
        price: true,
        rating: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: services.map((service) => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        isActive: service.isActive,
        contentJson: service.contentJson as ServiceContent | null,
        categoryName: service.categoryName,

        // ⭐ Map Sub-Category
        subCategoryId: service.subCategoryId,
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

        formId: service.formId,

        // ⭐ Map Hero Fields
        heroTitle: service.heroTitle,
        heroSubtitle: service.heroSubtitle,
        heroImage: service.heroImage,
        // ⭐ SEO Meta
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        contentImage: service.contentImage,
        // Quick-action toggles
        enableDraftButton: service.enableDraftButton,
        enableSpeakButton: service.enableSpeakButton,

        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
        category: {
          id: service.category.id,
          name: service.category.name,
          slug: service.category.slug,
          subCategories: [], // Return empty array for list view to satisfy type
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
      })),
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST: Create Service
// ============================================================================
export async function POST(
  request: NextRequest
): Promise<NextResponse<ServiceResponse>> {
  try {
    const body: CreateServiceRequest = await request.json();

    // 1. Basic Validation
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Service name is required",
        },
        { status: 400 }
      );
    }

    if (!body.categoryName || !body.formId) {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Category name and Form ID are required",
        },
        { status: 400 }
      );
    }

    // 2. Check if Category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { name: body.categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, data: {} as any, message: "Category not found" },
        { status: 404 }
      );
    }

    // 3. Check if Form exists
    const form = await prisma.form.findUnique({
      where: { id: body.formId },
    });

    if (!form) {
      return NextResponse.json(
        { success: false, data: {} as any, message: "Form not found" },
        { status: 404 }
      );
    }

    // 4. Check if Service Name already exists in Category
    const existingService = await prisma.service.findFirst({
      where: {
        name: body.name.trim(),
        category: { name: body.categoryName },
      },
    });

    if (existingService) {
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

    // 5. Create Service
    const service = await prisma.service.create({
      data: {
        name: body.name.trim(),
        slug: body.slug || generateSlug(body.name.trim()),
        description: body.description?.trim() || null,
        isActive: body.isActive ?? true,
        category: { connect: { name: body.categoryName } },
        form: { connect: { id: body.formId } },

        // ⭐ Connect Sub-Category (if provided)
        ...(body.subCategoryId
          ? {
              subCategory: { connect: { id: body.subCategoryId } },
            }
          : {}),

        // ⭐ Add Hero & Content Fields
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroImage: body.heroImage,
        contentImage: body.contentImage,
        // SEO Meta
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,

        contentJson: body.content
          ? JSON.parse(JSON.stringify(body.content))
          : null,

        // Quick-action toggles
        enableDraftButton: body.enableDraftButton ?? true,
        enableSpeakButton: body.enableSpeakButton ?? true,

        // Create Related Data (FAQs, Price)
        faqs: body.faqs
          ? {
              create: body.faqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              })),
            }
          : undefined,
        price: body.prices
          ? {
              create: body.prices.map((price) => ({
                name: price.name,
                price: price.price,
                discountAmount: price.discountAmount || null,
                isCompulsory: price.isCompulsory || false,
              })),
            }
          : undefined,
      },
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

        // ⭐ Select Sub-Category & Hero Fields in Response
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
        heroTitle: true,
        heroSubtitle: true,
        heroImage: true,
        metaTitle: true,
        metaDescription: true,
        enableDraftButton: true,
        enableSpeakButton: true,
        contentImage: true,

        category: true,
        form: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        faqs: true,
        price: true,
        rating: true,
      },
    });

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

        // ⭐ Map Sub-Category
        subCategoryId: service.subCategoryId,
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

        formId: service.formId,

        // ⭐ Map Hero Fields
        heroTitle: service.heroTitle,
        heroSubtitle: service.heroSubtitle,
        heroImage: service.heroImage,
        contentImage: service.contentImage,
        // ⭐ SEO Meta
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,

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
    console.error("Error creating service:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as any,
        message: "Failed to create service",
      },
      { status: 500 }
    );
  }
}
