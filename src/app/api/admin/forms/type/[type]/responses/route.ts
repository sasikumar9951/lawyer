import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ type: string }> };

const normalizeType = (t: string) => {
  const upper = t.toUpperCase();
  if (upper === "CONTACT" || upper === "CONTACT_FORM")
    return "CONTACT_FORM" as const;
  if (upper === "LAWYER_REGISTRATION" || upper === "REGISTRATION")
    return "LAWYER_REGISTRATION" as const;
  if (upper === "SERVICE" || upper === "SERVICE_FORM")
    return "SERVICE_FORM" as const;
  return null;
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  const typeParam = (await params).type;
  const norm = normalizeType(typeParam);
  if (!norm) {
    return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
  }

  const form = await prisma.form.findFirst({ where: { type: norm } });
  if (!form) {
    return NextResponse.json(
      { error: "Form not found for this type" },
      { status: 404 }
    );
  }

  const responses = await prisma.formResponse.findMany({
    where: { formId: form.id },
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
