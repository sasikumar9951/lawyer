import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export type ServiceTableData = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categoryName: string;
  categorySlug: string;
  formName: string;
  createdAt: string;
};

export type ServicesTableResponse = {
  success: boolean;
  data: ServiceTableData[];
  message?: string;
};

export async function GET(): Promise<NextResponse<ServicesTableResponse>> {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        form: {
          select: {
            name: true,
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
        isActive: service.isActive,
        categoryName: service.category.name,
        categorySlug: service.category.slug,
        formName: service.form.name,
        createdAt: service.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching services table data:", error);
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
