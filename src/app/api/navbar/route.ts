import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export type NavbarCategoryData = {
  id: string;
  name: string;
  slug: string;
};

export type NavbarServiceData = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
};

export type NavbarDataResponse = {
  success: boolean;
  data: {
    categories: NavbarCategoryData[];
    services: NavbarServiceData[];
  };
  message?: string;
};

export async function GET(): Promise<NextResponse<NavbarDataResponse>> {
  try {
    const [categories, services] = await Promise.all([
      prisma.serviceCategory.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          subCategories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
            orderBy: { name: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.service.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          subCategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        where: {
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          subCategories: (category.subCategories || []).map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
          })),
        })),
        services: services.map((service) => ({
          id: service.id,
          name: service.name,
          slug: service.slug,
          categoryName: service.category.name,
          categorySlug: service.category.slug,
          subCategoryId: service.subCategory ? service.subCategory.id : null,
          subCategoryName: service.subCategory
            ? service.subCategory.name
            : null,
          subCategorySlug: service.subCategory
            ? service.subCategory.slug
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          categories: [],
          services: [],
        },
        message: "Failed to fetch navbar data",
      },
      { status: 500 }
    );
  }
}
