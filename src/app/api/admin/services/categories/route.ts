import { NextRequest, NextResponse } from "next/server";

import {
  CreateServiceCategoryRequest,
  ServiceCategoriesResponse,
  ServiceCategoryResponse,
} from "@/types/api/services";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET(): Promise<NextResponse<ServiceCategoriesResponse>> {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch service categories",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ServiceCategoryResponse>> {
  try {
    const body: CreateServiceCategoryRequest = await request.json();

    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const trimmedName = body.name.trim();
    const slug = generateSlug(trimmedName);

    const existingCategory = await prisma.serviceCategory.findFirst({
      where: {
        OR: [
          { name: trimmedName },
          { slug: slug }
        ]
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "Category with this name or slug already exists",
        },
        { status: 409 }
      );
    }

    const category = await prisma.serviceCategory.create({
      data: {
        name: trimmedName,
        slug: slug,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating service category:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as any,
        message: "Failed to create service category",
      },
      { status: 500 }
    );
  }
}
