import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServiceBuilderDataResponse } from "@/types/api/services";

export async function GET(): Promise<NextResponse<ServiceBuilderDataResponse>> {
  try {
    // Fetch categories and forms with minimal data
    const [categories, forms] = await Promise.all([
      prisma.serviceCategory.findMany({
        select: {
          id: true,
          name: true,
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
