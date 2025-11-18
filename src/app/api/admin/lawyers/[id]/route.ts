import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  UpdateLawyerRequest,
  GetLawyerResponse,
  UpdateLawyerResponse,
} from "@/types/api/lawyers";

type Params = { params: Promise<{ id: string }> };

export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

    const lawyer = await prisma.lawyer.findUnique({
      where: { id },
      include: {
        cases: {
          select: {
            id: true,
            status: true,
            customerName: true,
            customerEmail: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lawyer) {
      return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
    }

    const response: GetLawyerResponse = {
      lawyer,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching lawyer:", error);
    return NextResponse.json(
      { error: "Failed to fetch lawyer" },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const body: UpdateLawyerRequest = await request.json();

    // Check if lawyer exists
    const existingLawyer = await prisma.lawyer.findUnique({
      where: { id },
    });

    if (!existingLawyer) {
      return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
    }

    // If email is being updated, check if it's already taken by another lawyer
    if (body.email && body.email !== existingLawyer.email) {
      const emailExists = await prisma.lawyer.findUnique({
        where: { email: body.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "A lawyer with this email already exists" },
          { status: 400 }
        );
      }
    }

    const lawyer = await prisma.lawyer.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        specialization: body.specialization,
        experience: body.experience,
        languages: body.languages,
        isActive: body.isActive,
        remarks: body.remarks,
      },
      include: {
        cases: {
          select: {
            id: true,
            status: true,
            customerName: true,
            customerEmail: true,
            createdAt: true,
          },
        },
      },
    });

    const response: UpdateLawyerResponse = {
      lawyer,
      message: "Lawyer updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating lawyer:", error);
    return NextResponse.json(
      { error: "Failed to update lawyer" },
      { status: 500 }
    );
  }
};
