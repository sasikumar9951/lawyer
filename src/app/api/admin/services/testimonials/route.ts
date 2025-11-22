import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: /api/admin/services/testimonials?serviceId=xxx
export async function GET(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.searchParams.get("serviceId");
    if (!serviceId) {
      return NextResponse.json({ success: false, data: [], message: "serviceId is required" }, { status: 400 });
    }

    const items = await (prisma as any).serviceTestimonial.findMany({
      where: { serviceId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: items.map(i => ({
      id: i.id,
      serviceId: i.serviceId,
      author: i.author || null,
      role: i.role || null,
      text: i.text,
      rating: i.rating || null,
      isFeatured: i.isFeatured,
      order: i.order || null,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    })) });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ success: false, data: [], message: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST: Create testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, author, role, text, rating, isFeatured, order } = body;

    if (!serviceId || !text || text.trim() === "") {
      return NextResponse.json({ success: false, data: {} as any, message: "serviceId and text are required" }, { status: 400 });
    }

    // Ensure service exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ success: false, data: {} as any, message: "Service not found" }, { status: 404 });
    }

    const created = await (prisma as any).serviceTestimonial.create({
      data: {
        service: { connect: { id: serviceId } },
        author: author || null,
        role: role || null,
        text: text.trim(),
        rating: rating ?? null,
        isFeatured: !!isFeatured,
        order: order ?? null,
      },
    });

    return NextResponse.json({ success: true, data: {
      id: created.id,
      serviceId: created.serviceId,
      author: created.author || null,
      role: created.role || null,
      text: created.text,
      rating: created.rating || null,
      isFeatured: created.isFeatured,
      order: created.order || null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    } });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ success: false, data: {} as any, message: "Failed to create testimonial" }, { status: 500 });
  }
}
