import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServiceResponse, ServiceContent } from "@/types/api/services";

type Params = {
  params: Promise<{
    categoryName: string;
    serviceName: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<ServiceResponse>> {
  try {
    const { categoryName, serviceName } = await params;

    if (!categoryName || !serviceName) {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Category name and service name are required",
        },
        { status: 400 }
      );
    }

    const service = await prisma.service.findFirst({
      where: {
        slug: serviceName,
        category: {
          slug: categoryName,
        },
        isActive: true,
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
            schemaJson: true,
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
        form: {
          id: service.form.id,
          name: service.form.name,
          description: service.form.description,
          schemaJson: service.form.schemaJson,
        },
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
