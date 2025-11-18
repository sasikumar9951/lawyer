import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const responseSchema = z.object({
  formId: z.string(),
  rawJson: z.any().optional(),
});

export const POST = async (req: NextRequest) => {
  try {
    const parsed = responseSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { formId, rawJson } = parsed.data;

    // Verify the form exists and is a contact form
    const contactForm = await prisma.form.findFirst({
      where: {
        id: formId,
        type: "CONTACT_FORM",
      },
    });

    if (!contactForm) {
      return NextResponse.json(
        { error: "Contact form not found" },
        { status: 404 }
      );
    }

    const created = await prisma.formResponse.create({
      data: {
        formId: formId,
        rawJson: rawJson as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: created.id,
        formId: created.formId,
        createdAt: created.createdAt.toISOString(),
        rawJson: created.rawJson as unknown,
      },
    });
  } catch (error) {
    console.error("Error saving contact form response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
