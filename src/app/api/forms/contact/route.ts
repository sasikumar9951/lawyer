import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { FormType } from "@/types/api/forms";

export const GET = async (_req: NextRequest) => {
  try {
    // Get the latest contact form by createdAt
    const contactForm = await prisma.form.findFirst({
      where: {
        type: "CONTACT_FORM" as FormType,
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

    if (!contactForm) {
      return NextResponse.json(
        { error: "Contact form not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: contactForm.id,
        name: contactForm.name,
        description: contactForm.description,
        type: contactForm.type,
        schemaJson: contactForm.schemaJson,
        createdAt: contactForm.createdAt.toISOString(),
        updatedAt: contactForm.updatedAt.toISOString(),
      },
    });

    // Add caching headers for better performance
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300"); // Cache for 5 minutes
    response.headers.set("ETag", `"${contactForm.updatedAt.getTime()}"`);

    return response;
  } catch (error) {
    console.error("Error fetching contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
