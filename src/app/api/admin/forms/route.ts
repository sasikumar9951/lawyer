import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { ApiForm } from "@/types/api/forms";

const createFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  schemaJson: z.any().optional(),
});

export const GET = async () => {
  const formsWithCounts = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          responses: true,
        },
      },
      services: {
        select: {
          id: true,
          name: true,
          categoryName: true,
        },
      },
    },
  });

  const formsWithCountsFormatted = formsWithCounts.map(
    (form) =>
      ({
        id: form.id,
        name: form.name,
        description: form.description,
        type: form.type,
        schemaJson: form.schemaJson as unknown,
        createdAt: form.createdAt.toISOString(),
        updatedAt: form.updatedAt.toISOString(),
        responsesCount: form._count.responses,
        associatedServices: form.services,
      } as ApiForm)
  );

  return NextResponse.json(formsWithCountsFormatted);
};

export const POST = async (req: NextRequest) => {
  const parsed = createFormSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { name, description, schemaJson } = parsed.data;
  const created = await prisma.form.create({
    data: { name, description, schemaJson: schemaJson as any },
  });
  // For a newly created form, counts will be 0
  const response: ApiForm = {
    id: created.id,
    name: created.name,
    description: created.description,
    type: created.type,
    schemaJson: created.schemaJson as unknown,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    responsesCount: 0,
    associatedServices: [],
  };

  return NextResponse.json(response);
};
