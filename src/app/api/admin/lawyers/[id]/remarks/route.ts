import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  AppendLawyerRemarkRequest,
  AppendLawyerRemarkResponse,
} from "@/types/api/lawyers";

type Params = { params: Promise<{ id: string }> };

export const POST = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const body: AppendLawyerRemarkRequest = await request.json();

    if (!body.remark || !body.remark.trim()) {
      return NextResponse.json(
        { error: "Remark is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.lawyer.findUnique({
      where: { id },
      select: { remarks: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
    }

    const updated = await prisma.lawyer.update({
      where: { id },
      data: { remarks: [...(existing.remarks || []), body.remark.trim()] },
      select: { remarks: true },
    });

    const response: AppendLawyerRemarkResponse = {
      remarks: updated.remarks || [],
      message: "Remark added",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error adding remark:", error);
    return NextResponse.json(
      { error: "Failed to add remark" },
      { status: 500 }
    );
  }
};
