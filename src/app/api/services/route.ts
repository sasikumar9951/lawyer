import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServicesResponse } from "@/types/api/services";

export async function GET(): Promise<NextResponse<any>> {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
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
        description: service.description,
        isActive: service.isActive,
        contentJson: service.contentJson,
        categoryName: service.categoryName,
        formId: service.formId,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
        category: {
          id: service.category.id,
          name: service.category.name,
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
