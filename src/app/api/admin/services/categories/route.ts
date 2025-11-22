import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import {
  CreateServiceCategoryRequest,
  ServiceCategoriesResponse,
  ServiceCategoryResponse,
} from "@/types/api/services";

// ============================================================================
// GET: Fetch all categories with their sub-categories
// ============================================================================
export async function GET(): Promise<NextResponse<ServiceCategoriesResponse>> {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        subCategories: {
          orderBy: { name: "asc" }, // Order sub-categories alphabetically
        },
      },
      orderBy: { createdAt: "desc" }, // Newest categories first
    });

    // Transform to match ApiServiceCategory interface
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      subCategories: category.subCategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        categoryId: sub.categoryId,
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
      })),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      { success: false, data: [], message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE: Delete a Main Category or Sub-Category
// ============================================================================
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const body = await request.json();
    const { id, type } = body as {
      id?: string;
      type?: "CATEGORY" | "SUB_CATEGORY";
    };

    if (!id || !type) {
      return NextResponse.json(
        { success: false, message: "id and type are required" },
        { status: 400 }
      );
    }

    if (type === "CATEGORY") {
      const existing = await prisma.serviceCategory.findUnique({
        where: { id },
      });
      if (!existing) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }

      // Deleting the category will cascade to sub-categories/services as per schema
      await prisma.serviceCategory.delete({ where: { id } });

      return NextResponse.json({ success: true, message: "Category deleted" });
    }

    // SUB_CATEGORY
    const existingSub = await prisma.serviceSubCategory.findUnique({
      where: { id },
    });
    if (!existingSub) {
      return NextResponse.json(
        { success: false, message: "Sub-category not found" },
        { status: 404 }
      );
    }

    await prisma.serviceSubCategory.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Sub-category deleted",
    });
  } catch (error) {
    console.error("Error deleting category/sub-category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST: Create a Main Category OR Sub-Category
// ============================================================================
export async function POST(
  request: NextRequest
): Promise<NextResponse<ServiceCategoryResponse>> {
  try {
    const body: CreateServiceCategoryRequest = await request.json();
    const { name, type, parentId } = body;

    // 1. Basic Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, data: {} as any, message: "Name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const slug = generateSlug(trimmedName);

    // ==========================================
    // CASE A: Create Main Category
    // ==========================================
    if (type === "CATEGORY") {
      // Check for duplicate in ServiceCategory table
      const existingCategory = await prisma.serviceCategory.findFirst({
        where: { OR: [{ name: trimmedName }, { slug: slug }] },
      });

      if (existingCategory) {
        return NextResponse.json(
          {
            success: false,
            data: {} as any,
            message: "Main Category already exists",
          },
          { status: 409 }
        );
      }

      const newCategory = await prisma.serviceCategory.create({
        data: {
          name: trimmedName,
          slug: slug,
        },
        include: { subCategories: true }, // Return empty array structure
      });

      return NextResponse.json({
        success: true,
        data: {
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.slug,
          subCategories: [],
          createdAt: newCategory.createdAt.toISOString(),
          updatedAt: newCategory.updatedAt.toISOString(),
        },
      });
    }

    // ==========================================
    // CASE B: Create Sub-Category
    // ==========================================
    else if (type === "SUB_CATEGORY") {
      if (!parentId) {
        return NextResponse.json(
          {
            success: false,
            data: {} as any,
            message: "Parent Category is required",
          },
          { status: 400 }
        );
      }

      // Check for duplicate in ServiceSubCategory table
      // Note: Slugs must be unique across the table
      const existingSub = await prisma.serviceSubCategory.findFirst({
        where: { slug: slug },
      });

      if (existingSub) {
        return NextResponse.json(
          {
            success: false,
            data: {} as any,
            message: "Sub-Category slug already exists",
          },
          { status: 409 }
        );
      }

      const newSubCategory = await prisma.serviceSubCategory.create({
        data: {
          name: trimmedName,
          slug: slug,
          categoryId: parentId,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: newSubCategory.id,
          name: newSubCategory.name,
          slug: newSubCategory.slug,
          categoryId: newSubCategory.categoryId,
          createdAt: newSubCategory.createdAt.toISOString(),
          updatedAt: newSubCategory.updatedAt.toISOString(),
        },
      });
    }

    // Invalid Type
    return NextResponse.json(
      { success: false, data: {} as any, message: "Invalid creation type" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error creating category:", error);

    // Handle Prisma Unique Constraint Errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          data: {} as any,
          message: "A category with this name or slug already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, data: {} as any, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
