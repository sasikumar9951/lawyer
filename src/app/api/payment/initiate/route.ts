import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { phonepeService, phonepeUtils } from "@/lib/phonepe";
import {
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  PaymentStatus,
  PaymentEvent,
} from "@/types/api/payment";

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaymentInitiationResponse>> {
  try {
    const body: PaymentInitiationRequest = await request.json();

    // Validate request
    if (
      !body.serviceId ||
      !body.selectedPriceIds ||
      body.selectedPriceIds.length === 0 ||
      !body.customerInfo
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: serviceId, selectedPriceIds, or customerInfo",
        },
        { status: 400 }
      );
    }

    // Validate customer info
    const { name, email, phone } = body.customerInfo;
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name, email, and phone are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate phone format (Indian mobile numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone number. Please enter a valid 10-digit mobile number",
        },
        { status: 400 }
      );
    }

    // Fetch service and validate
    const service = await prisma.service.findFirst({
      where: {
        id: body.serviceId,
        isActive: true,
      },
      include: {
        price: {
          where: {
            id: { in: body.selectedPriceIds },
          },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found or inactive",
        },
        { status: 404 }
      );
    }

    // Validate selected prices
    if (service.price.length !== body.selectedPriceIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some selected prices are invalid or not found",
        },
        { status: 400 }
      );
    }

    // Check if all compulsory prices are selected
    const allServicePrices = await prisma.servicePrice.findMany({
      where: { serviceId: body.serviceId },
    });

    const compulsoryPrices = allServicePrices.filter((p) => p.isCompulsory);
    const selectedCompulsoryPrices = service.price.filter(
      (p) => p.isCompulsory
    );

    if (selectedCompulsoryPrices.length !== compulsoryPrices.length) {
      return NextResponse.json(
        {
          success: false,
          message: "All compulsory services must be selected",
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    let totalDiscount = 0;
    const orderItems = service.price.map((price) => {
      const discountAmount = price.discountAmount || 0;
      const finalPrice = price.price - discountAmount;

      totalAmount += price.price;
      totalDiscount += discountAmount;

      return {
        servicePriceId: price.id,
        priceAtOrderTime: price.price,
        discountAtOrderTime: discountAmount,
        finalPrice: finalPrice,
      };
    });

    const finalTotal = totalAmount - totalDiscount;

    // Generate unique merchant order ID
    const merchantOrderId = phonepeUtils.generateMerchantOrderId();

    // Create payment order in database
    const paymentOrder = await prisma.paymentOrder.create({
      data: {
        merchantOrderId,
        amount: finalTotal,
        status: PaymentStatus.PENDING,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: cleanPhone,
        selectedPrices: {
          create: orderItems,
        },
      },
      include: {
        selectedPrices: {
          include: {
            servicePrice: {
              include: {
                service: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // Create audit log
    await prisma.paymentAuditLog.create({
      data: {
        orderId: paymentOrder.id,
        event: PaymentEvent.ORDER_CREATED,
        status: PaymentStatus.PENDING,
        description: `Payment order created for service: ${service.name}`,
        metadata: {
          serviceId: body.serviceId,
          serviceName: service.name,
          customerInfo: body.customerInfo,
          selectedPriceIds: body.selectedPriceIds,
          totalAmount: finalTotal,
          itemCount: orderItems.length,
        },
      },
    });

    // Initiate payment with PhonePe
    const phonepeResponse = await phonepeService.initiatePayment({
      merchantOrderId,
      amount: finalTotal,
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: cleanPhone,
      redirectUrl: body.redirectUrl,
      metaInfo: {
        udf1: service.id,
        udf2: service.name,
        udf3: service.category.name,
        udf4: paymentOrder.id,
        udf5: JSON.stringify({ itemCount: orderItems.length }),
      },
    });

    if (!phonepeResponse.success) {
      // Update payment order status to failed
      await prisma.paymentOrder.update({
        where: { id: paymentOrder.id },
        data: { status: PaymentStatus.FAILED },
      });

      // Create audit log for failure
      await prisma.paymentAuditLog.create({
        data: {
          orderId: paymentOrder.id,
          event: PaymentEvent.ERROR_OCCURRED,
          status: PaymentStatus.FAILED,
          description: `PhonePe payment initiation failed: ${phonepeResponse.error}`,
          metadata: { error: phonepeResponse.error },
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: phonepeResponse.error || "Failed to initiate payment",
        },
        { status: 500 }
      );
    }

    // Update payment order with PhonePe response
    // Parse expireAt timestamp correctly (PhonePe returns timestamp in milliseconds)
    const expireAtDate = phonepeResponse.data!.expireAt
      ? new Date(parseInt(phonepeResponse.data!.expireAt.toString()))
      : new Date(Date.now() + 30 * 60 * 1000); // Default to 30 minutes from now

    await prisma.paymentOrder.update({
      where: { id: paymentOrder.id },
      data: {
        phonepeOrderId: phonepeResponse.data!.orderId,
        status: PaymentStatus.INITIATED,
        checkoutUrl: phonepeResponse.data!.redirectUrl,
        redirectUrl: body.redirectUrl,
        expireAt: expireAtDate,
        phonepeResponse: phonepeResponse.data,
      },
    });

    // Create audit log for successful initiation
    await prisma.paymentAuditLog.create({
      data: {
        orderId: paymentOrder.id,
        event: PaymentEvent.PAYMENT_INITIATED,
        status: PaymentStatus.INITIATED,
        description: `Payment initiated successfully with PhonePe`,
        metadata: {
          phonepeOrderId: phonepeResponse.data!.orderId,
          checkoutUrl: phonepeResponse.data!.redirectUrl,
          expireAt: phonepeResponse.data!.expireAt,
        },
      },
    });

    // Prepare response
    const selectedItems = paymentOrder.selectedPrices.map((item) => ({
      servicePriceId: item.servicePriceId,
      priceItemName: item.servicePrice.name,
      originalPrice: item.priceAtOrderTime,
      discountAmount: item.discountAtOrderTime || 0,
      finalPrice: item.finalPrice,
      isCompulsory: item.servicePrice.isCompulsory,
    }));

    return NextResponse.json({
      success: true,
      data: {
        orderId: paymentOrder.id,
        merchantOrderId,
        checkoutUrl: phonepeResponse.data!.redirectUrl,
        amount: finalTotal,
        expireAt: phonepeResponse.data!.expireAt,
        selectedItems,
      },
    });
  } catch (error: any) {
    console.error("Payment initiation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
