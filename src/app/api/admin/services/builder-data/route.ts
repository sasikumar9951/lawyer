import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServiceBuilderDataResponse } from "@/types/api/services";

export async function GET(): Promise<NextResponse<ServiceBuilderDataResponse>> {
  try {
    // Fetch categories, subcategories and forms
    const [categories, subCategories, forms] = await Promise.all([
      prisma.serviceCategory.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      }),

      prisma.serviceSubCategory.findMany({
        select: {
          id: true,
          name: true,
          categoryId: true,
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),

      prisma.form.findMany({
        where: {
          type: "SERVICE_FORM",
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
        })),

        // ⭐ Important: return subcategory with categoryName
        subCategories: subCategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          categoryId: sub.categoryId,
          categoryName: sub.category.name, // needed for filtering
        })),

        forms: forms.map((form) => ({
          id: form.id,
          name: form.name,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching builder data:", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          categories: [],
          subCategories: [],
          forms: [],
        },
        message: "Failed to fetch builder data",
      },
      { status: 500 }
    );
  }
}
