import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServicesResponse,
  ServiceResponse,
  ServiceContent,
} from "@/types/api/services";
import { generateSlug } from "@/lib/utils";

export async function GET(): Promise<NextResponse<ServicesResponse>> {
  try {
    const services = await prisma.service.findMany({
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

export async function POST(
  request: NextRequest
): Promise<NextResponse<ServiceResponse>> {
  try {
    const body: CreateServiceRequest = await request.json();

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

    // Check if category exists
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

    // Check if form exists
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

    // Check if service name already exists in the same category
    const existingService = await prisma.service.findFirst({
      where: {
        name: body.name.trim(),
        categoryName: body.categoryName,
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

    const service = await prisma.service.create({
      data: {
        name: body.name.trim(),
        slug: body.slug || generateSlug(body.name.trim()),
        description: body.description?.trim() || null,
        isActive: body.isActive ?? true,
        categoryName: body.categoryName,
        formId: body.formId,
        contentJson: body.content
          ? JSON.parse(JSON.stringify(body.content))
          : null,
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
