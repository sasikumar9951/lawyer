import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { ApiForm, AssociatedService } from "@/types/api/forms";

const updateFormSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  schemaJson: z.any().optional(),
  type: z
    .enum(["LAWYER_REGISTRATION", "CONTACT_FORM", "SERVICE_FORM"])
    .optional(),
});

type Params = { params: Promise<{ id: string }> };

export const GET = async (_req: NextRequest, { params }: Params) => {
  const form = await prisma.form.findUnique({
    where: { id: (await params).id },
  });
  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Get associated services
  const associatedServices = await prisma.service.findMany({
    where: { formId: (await params).id },
    select: {
      id: true,
      name: true,
      categoryName: true,
    },
  });

  const responsesCount = await prisma.formResponse.count({
    where: { formId: (await params).id },
  });

  const response: ApiForm = {
    id: form.id,
    name: form.name,
    description: form.description,
    type: form.type,
    schemaJson: form.schemaJson as unknown,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
    responsesCount,
    associatedServices,
  };

  return NextResponse.json(response);
};

export const PATCH = async (req: NextRequest, { params }: Params) => {
  const parsed = updateFormSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data as any;

  if (data.type && data.type !== "SERVICE_FORM") {
    const existing = await prisma.form.findFirst({
      where: { type: data.type },
    });
    if (existing && existing.id !== (await params).id) {
      return NextResponse.json(
        { error: `A form of type ${data.type} already exists.` },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.form.update({
    where: { id: (await params).id },
    data,
  });
  // Get updated counts after the update
  const responsesCount = await prisma.formResponse.count({
    where: { formId: updated.id },
  });

  const associatedServices = await prisma.service.findMany({
    where: { formId: updated.id },
    select: {
      id: true,
      name: true,
      categoryName: true,
    },
  });

  const response: ApiForm = {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    type: updated.type,
    schemaJson: updated.schemaJson as unknown,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    responsesCount,
    associatedServices,
  };

  return NextResponse.json(response);
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const formId = (await params).id;

  // Since the frontend now handles service reassignment,
  // we can proceed with deletion if there are no more associations
  try {
    await prisma.form.delete({ where: { id: formId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete form. It may still have associated services.",
      },
      { status: 400 }
    );
  }
};
