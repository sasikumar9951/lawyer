import { NextRequest, NextResponse } from "next/server";
import { setTemplateActive } from "@/lib/messaging/templates-service";
import type {
  ToggleTemplateActiveRequest,
  ToggleTemplateActiveResponse,
} from "@/types/api/templates";

type Params = { params: Promise<{ id: string }> };

export const PATCH = async (req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const body = (await req.json()) as ToggleTemplateActiveRequest;
  if (typeof body.isActive !== "boolean") {
    const r: ToggleTemplateActiveResponse = {
      success: false,
      error: "isActive must be boolean",
    };
    return NextResponse.json(r, { status: 400 });
  }
  await setTemplateActive(id, body.isActive);
  const r: ToggleTemplateActiveResponse = { success: true };
  return NextResponse.json(r);
};
