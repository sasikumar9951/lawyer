import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { FormType } from "@/types/api/forms";

export const GET = async (_req: NextRequest) => {
  try {
    // Get the latest lawyer registration form by createdAt
    const lawyerRegistrationForm = await prisma.form.findFirst({
      where: {
        type: "LAWYER_REGISTRATION" as FormType,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        schemaJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!lawyerRegistrationForm) {
      return NextResponse.json(
        { error: "Lawyer registration form not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: lawyerRegistrationForm.id,
        name: lawyerRegistrationForm.name,
        description: lawyerRegistrationForm.description,
        type: lawyerRegistrationForm.type,
        schemaJson: lawyerRegistrationForm.schemaJson,
        createdAt: lawyerRegistrationForm.createdAt.toISOString(),
        updatedAt: lawyerRegistrationForm.updatedAt.toISOString(),
      },
    });

    // Add caching headers for better performance
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300"); // Cache for 5 minutes
    response.headers.set(
      "ETag",
      `"${lawyerRegistrationForm.updatedAt.getTime()}"`
    );

    return response;
  } catch (error) {
    console.error("Error fetching lawyer registration form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
