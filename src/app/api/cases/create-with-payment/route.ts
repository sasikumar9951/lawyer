import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { phonepeService, phonepeUtils } from "@/lib/phonepe";
import {
  CaseCreationWithPaymentRequest,
  CaseCreationWithPaymentResponse,
  PaymentStatus,
  PaymentEvent,
} from "@/types/api/payment";

export async function POST(
  request: NextRequest
): Promise<NextResponse<CaseCreationWithPaymentResponse>> {
  try {
    const body: CaseCreationWithPaymentRequest = await request.json();

    // Validate request
    if (!body.serviceSelectionData || !body.customerInfo) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: serviceSelectionData or customerInfo",
        },
        { status: 400 }
      );
    }

    const {
      serviceSelectionData,
      customerInfo,
      formResponseData,
      paymentRequired,
    } = body;

    // Validate customer info
    const { name, email, phone } = customerInfo;
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name, email, and phone are required",
        },
        { status: 400 }
      );
    }

    // Validate service selection
    if (
      !serviceSelectionData.serviceId ||
      !serviceSelectionData.selectedPrices ||
      serviceSelectionData.selectedPrices.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service selection data",
        },
        { status: 400 }
      );
    }

    // Fetch service and validate
    const service = await prisma.service.findFirst({
      where: {
        id: serviceSelectionData.serviceId,
        isActive: true,
      },
      include: {
        price: true,
        form: {
          select: { id: true, schemaJson: true },
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

    // Validate selected prices against service prices
    const selectedPriceIds = serviceSelectionData.selectedPrices.map(
      (p) => p.id
    );
    const validPrices = service.price.filter((p) =>
      selectedPriceIds.includes(p.id)
    );

    if (validPrices.length !== selectedPriceIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some selected prices are invalid",
        },
        { status: 400 }
      );
    }

    // Check if all compulsory prices are selected
    const compulsoryPrices = service.price.filter((p) => p.isCompulsory);
    const selectedCompulsoryPrices = validPrices.filter((p) => p.isCompulsory);

    if (selectedCompulsoryPrices.length !== compulsoryPrices.length) {
      return NextResponse.json(
        {
          success: false,
          message: "All compulsory services must be selected",
        },
        { status: 400 }
      );
    }

    let formResponse = null;

    // Create form response if form data is provided
    if (formResponseData && service.form) {
      try {
        formResponse = await prisma.formResponse.create({
          data: {
            formId: service.form.id,
            rawJson: formResponseData,
          },
        });
      } catch (formError) {
        console.error("Error creating form response:", formError);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to save form data",
          },
          { status: 500 }
        );
      }
    }

    // Create case
    const newCase = await prisma.case.create({
      data: {
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.replace(/\D/g, ""),
        serviceId: service.id,
        formResponseId: formResponse?.id,
        status: paymentRequired ? "PENDING" : "PENDING", // Will be updated after payment
      },
    });

    // If payment is not required, return success with case
    if (!paymentRequired || serviceSelectionData.finalTotal === 0) {
      return NextResponse.json({
        success: true,
        data: {
          caseId: newCase.id,
        },
        message: "Case created successfully without payment",
      });
    }

    // Calculate total amount for payment
    let totalAmount = 0;
    let totalDiscount = 0;
    const orderItems = validPrices.map((price) => {
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

    // Create payment order
    const paymentOrder = await prisma.paymentOrder.create({
      data: {
        merchantOrderId,
        amount: finalTotal,
        status: PaymentStatus.PENDING,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.replace(/\D/g, ""),
        caseId: newCase.id,
        selectedPrices: {
          create: orderItems,
        },
      },
    });

    // Create audit log
    await prisma.paymentAuditLog.create({
      data: {
        orderId: paymentOrder.id,
        event: PaymentEvent.ORDER_CREATED,
        status: PaymentStatus.PENDING,
        description: `Payment order created for case ${newCase.id}`,
        metadata: {
          caseId: newCase.id,
          serviceId: service.id,
          serviceName: service.name,
          customerInfo,
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
      customerPhone: phone.replace(/\D/g, ""),
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/callback`,
      metaInfo: {
        udf1: service.id,
        udf2: service.name,
        udf3: service.category.name,
        udf4: newCase.id,
        udf5: paymentOrder.id,
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
        description: `Payment initiated successfully for case ${newCase.id}`,
        metadata: {
          caseId: newCase.id,
          phonepeOrderId: phonepeResponse.data!.orderId,
          checkoutUrl: phonepeResponse.data!.redirectUrl,
          expireAt: phonepeResponse.data!.expireAt,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        caseId: newCase.id,
        paymentOrder: {
          orderId: paymentOrder.id,
          merchantOrderId,
          checkoutUrl: phonepeResponse.data!.redirectUrl,
          amount: finalTotal,
          expireAt: phonepeResponse.data!.expireAt,
        },
      },
      message: "Case created and payment initiated successfully",
    });
  } catch (error: any) {
    console.error("Case creation with payment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
