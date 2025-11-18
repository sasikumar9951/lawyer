import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const responseSchema = z.object({
  rawJson: z.any().optional(),
});

export const GET = async (_req: NextRequest, { params }: Params) => {
  const responses = await prisma.formResponse.findMany({
    where: { formId: (await params).id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    responses.map((r) => ({
      id: r.id,
      formId: r.formId,
      createdAt: r.createdAt.toISOString(),
      rawJson: r.rawJson as unknown,
    }))
  );
};

export const POST = async (req: NextRequest, { params }: Params) => {
  const parsed = responseSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { rawJson } = parsed.data;
  const created = await prisma.formResponse.create({
    data: {
      formId: (await params).id,
      rawJson: rawJson as any,
    },
  });

  return NextResponse.json({
    id: created.id,
    formId: created.formId,
    createdAt: created.createdAt.toISOString(),
    rawJson: created.rawJson as unknown,
  });
};
