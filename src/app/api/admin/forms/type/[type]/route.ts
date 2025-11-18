import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ type: string }> };

const typeEnum = z.enum([
  "LAWYER_REGISTRATION",
  "CONTACT_FORM",
  "SERVICE_FORM",
]);

export const GET = async (_req: NextRequest, { params }: Params) => {
  const type = typeEnum.safeParse((await params).type.toUpperCase());
  if (!type.success)
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  const form = await prisma.form.findFirst({ where: { type: type.data } });
  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: form.id, name: form.name, type: form.type });
};

export const PATCH = async (req: NextRequest, { params }: Params) => {
  const type = typeEnum.safeParse((await params).type.toUpperCase());
  if (!type.success)
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const body = z
    .object({ formId: z.string().cuid() })
    .safeParse(await req.json());
  if (!body.success)
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  // Enforce uniqueness for CONTACT_FORM and LAWYER_REGISTRATION
  if (type.data !== "SERVICE_FORM") {
    const existing = await prisma.form.findFirst({
      where: { type: type.data },
    });
    if (existing && existing.id !== body.data.formId) {
      return NextResponse.json(
        { error: `A form of type ${type.data} already exists.` },
        { status: 400 }
      );
    }
  }

  // Set the target form to this type
  const updated = await prisma.form.update({
    where: { id: body.data.formId },
    data: { type: type.data },
  });
  return NextResponse.json({ id: updated.id, type: updated.type });
};
