import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServiceBuilderDataResponse } from "@/types/api/services";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ServiceBuilderDataResponse>> {
  try {
    // Fetch Categories with Nested SubCategories & Forms
    const [categories, forms] = await Promise.all([
      prisma.serviceCategory.findMany({
        select: {
          id: true,
          name: true,
          subCategories: {
            select: {
              id: true,
              name: true,
            },
            orderBy: { name: "asc" },
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
        // Categories include nested SubCategories
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          subCategories: category.subCategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
          })),
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
          forms: [],
        },
        message: "Failed to fetch builder data",
      },
      { status: 500 }
    );
  }
}
