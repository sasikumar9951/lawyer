import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, role, text, rating, isFeatured, order } = body;

    const existing = await (prisma as any).serviceTestimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, data: {} as any, message: "Testimonial not found" }, { status: 404 });
    }

    const updated = await (prisma as any).serviceTestimonial.update({
      where: { id },
      data: {
        author: author ?? existing.author,
        role: role ?? existing.role,
        text: text ?? existing.text,
        rating: rating ?? existing.rating,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : existing.isFeatured,
        order: order ?? existing.order,
      },
    });

    return NextResponse.json({ success: true, data: {
      id: updated.id,
      serviceId: updated.serviceId,
      author: updated.author || null,
      role: updated.role || null,
      text: updated.text,
      rating: updated.rating || null,
      isFeatured: updated.isFeatured,
      order: updated.order || null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    } });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ success: false, data: {} as any, message: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await (prisma as any).serviceTestimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    await (prisma as any).serviceTestimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ success: false, message: "Failed to delete testimonial" }, { status: 500 });
  }
}
