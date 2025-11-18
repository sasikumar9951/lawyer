import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  CreateLawyerRequest,
  GetLawyersResponse,
  CreateLawyerResponse,
} from "@/types/api/lawyers";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    const lawyers = await prisma.lawyer.findMany({
      where: whereClause,
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
      orderBy: { createdAt: "desc" },
    });

    const response: GetLawyersResponse = {
      lawyers,
      total: lawyers.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return NextResponse.json(
      { error: "Failed to fetch lawyers" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body: CreateLawyerRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingLawyer = await prisma.lawyer.findUnique({
      where: { email: body.email },
    });

    if (existingLawyer) {
      return NextResponse.json(
        { error: "A lawyer with this email already exists" },
        { status: 400 }
      );
    }

    const lawyer = await prisma.lawyer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        specialization: body.specialization || [],
        experience: body.experience || null,
        languages: body.languages || [],
        isActive: body.isActive ?? true,
        remarks: body.remarks || [],
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

    const response: CreateLawyerResponse = {
      lawyer,
      message: "Lawyer created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating lawyer:", error);
    return NextResponse.json(
      { error: "Failed to create lawyer" },
      { status: 500 }
    );
  }
};
