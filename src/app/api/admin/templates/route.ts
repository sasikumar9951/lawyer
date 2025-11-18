import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTemplateMessageCount } from "@/lib/messaging/templates-service";
import { createWhatsAppTemplate } from "@/lib/messaging/templates-service";
import type {
  CreateTemplateRequest,
  CreateTemplateResponse,
  ListTemplatesResponse,
} from "@/types/api/templates";

export const GET = async () => {
  const templates = await prisma.whatsAppTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
  const withCounts = await Promise.all(
    templates.map(async (t) => ({
      ...t,
      sentCount: await getTemplateMessageCount(t.id),
    }))
  );
  const resp: ListTemplatesResponse = {
    success: true,
    data: withCounts.map((t) => ({
      id: t.id,
      friendlyName: t.friendlyName,
      category: t.category,
      language: t.language,
      body: t.body,
      status: t.status as any,
      isActive: t.isActive,
      twilioSid: t.twilioSid,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      sentCount: t.sentCount,
    })),
  };
  return NextResponse.json(resp);
};

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as CreateTemplateRequest;
  if (!body.friendlyName || !body.body || !body.language || !body.category) {
    const r: CreateTemplateResponse = {
      success: false,
      error: "Missing required fields",
    };
    return NextResponse.json(r, { status: 400 });
  }
  const created = await createWhatsAppTemplate(body);
  return NextResponse.json(created, { status: created.success ? 200 : 400 });
};
