import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { phonepeService } from "@/lib/phonepe";
import {
  PaymentStatusRequest,
  PaymentStatusResponse,
  PaymentStatus,
  PaymentEvent,
  PaymentMethod,
} from "@/types/api/payment";

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaymentStatusResponse>> {
  try {
    const body: PaymentStatusRequest = await request.json();

    if (!body.merchantOrderId) {
      return NextResponse.json(
        {
          success: false,
          message: "merchantOrderId is required",
        },
        { status: 400 }
      );
    }

    // Find payment order in database
    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { merchantOrderId: body.merchantOrderId },
      include: {
        selectedPrices: {
          include: {
            servicePrice: {
              include: {
                service: {
                  select: { name: true, categoryName: true },
                },
              },
            },
          },
        },
        case: {
          select: { id: true },
        },
      },
    });

    if (!paymentOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment order not found",
        },
        { status: 404 }
      );
    }

    // Check payment status with PhonePe if not already completed/failed
    let updatedStatus = paymentOrder.status;
    let phonepeTransactionId = paymentOrder.phonepeTransactionId;
    let paymentMethod = paymentOrder.paymentMethod;

    if (
      paymentOrder.status === PaymentStatus.INITIATED ||
      paymentOrder.status === PaymentStatus.PROCESSING
    ) {
      const statusResponse = await phonepeService.getOrderStatus(
        body.merchantOrderId
      );

      if (statusResponse.success && statusResponse.data) {
        const phonepeStatus = statusResponse.data.state;
        let newStatus: PaymentStatus;
        let event: PaymentEvent;
        let description: string;

        // Map PhonePe status to our status
        switch (phonepeStatus) {
          case "COMPLETED":
            newStatus = PaymentStatus.COMPLETED;
            event = PaymentEvent.PAYMENT_SUCCESS;
            description = "Payment completed successfully";
            break;
          case "FAILED":
            newStatus = PaymentStatus.FAILED;
            event = PaymentEvent.PAYMENT_FAILED;
            description = "Payment failed";
            break;
          case "PENDING":
            newStatus = PaymentStatus.PROCESSING;
            event = PaymentEvent.PAYMENT_PROCESSING;
            description = "Payment is being processed";
            break;
          default:
            newStatus = paymentOrder.status as PaymentStatus;
            event = PaymentEvent.STATUS_CHECK;
            description = `Payment status checked: ${phonepeStatus}`;
        }

        // Extract payment details if available
        if (
          statusResponse.data.paymentDetails &&
          statusResponse.data.paymentDetails.length > 0
        ) {
          const latestPayment = statusResponse.data.paymentDetails[0];
          phonepeTransactionId = latestPayment.transactionId?.toString();

          // Map payment mode to our enum
          switch (latestPayment.paymentMode) {
            case "UPI_INTENT":
              paymentMethod = PaymentMethod.UPI_INTENT;
              break;
            case "UPI_COLLECT":
              paymentMethod = PaymentMethod.UPI_COLLECT;
              break;
            case "UPI_QR":
              paymentMethod = PaymentMethod.UPI_QR;
              break;
            case "CARD":
              paymentMethod = PaymentMethod.CARD;
              break;
            case "NET_BANKING":
              paymentMethod = PaymentMethod.NET_BANKING;
              break;
            case "WALLET":
              paymentMethod = PaymentMethod.WALLET;
              break;
            default:
              paymentMethod = null;
          }
        }

        // Update payment order if status changed
        if (newStatus !== paymentOrder.status) {
          await prisma.paymentOrder.update({
            where: { id: paymentOrder.id },
            data: {
              status: newStatus,
              phonepeTransactionId,
              paymentMethod,
              phonepeResponse: statusResponse.data,
            },
          });

          // Create audit log
          await prisma.paymentAuditLog.create({
            data: {
              orderId: paymentOrder.id,
              event,
              status: newStatus,
              description,
              metadata: {
                phonepeStatus,
                phonepeTransactionId,
                paymentMethod,
                phonepeResponse: statusResponse.data,
              },
            },
          });

          updatedStatus = newStatus;
        } else {
          // Create audit log for status check
          await prisma.paymentAuditLog.create({
            data: {
              orderId: paymentOrder.id,
              event: PaymentEvent.STATUS_CHECK,
              status: paymentOrder.status as PaymentStatus,
              description: `Status checked: ${phonepeStatus}`,
              metadata: { phonepeStatus, phonepeResponse: statusResponse.data },
            },
          });
        }
      } else {
        // PhonePe API call failed, create audit log
        await prisma.paymentAuditLog.create({
          data: {
            orderId: paymentOrder.id,
            event: PaymentEvent.ERROR_OCCURRED,
            status: paymentOrder.status as PaymentStatus,
            description: `Failed to check status with PhonePe: ${statusResponse.error}`,
            metadata: { error: statusResponse.error },
          },
        });
      }
    }

    // Prepare selected items for response
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
        merchantOrderId: paymentOrder.merchantOrderId,
        status: updatedStatus as PaymentStatus,
        amount: paymentOrder.amount,
        paymentMethod: paymentMethod || undefined,
        phonepeTransactionId: phonepeTransactionId || undefined,
        customerInfo: {
          name: paymentOrder.customerName,
          email: paymentOrder.customerEmail,
          phone: paymentOrder.customerPhone,
        },
        selectedItems,
        caseId: paymentOrder.case?.id,
        createdAt: paymentOrder.createdAt.toISOString(),
        updatedAt: paymentOrder.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Payment status check error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaymentStatusResponse>> {
  const url = new URL(request.url);
  const merchantOrderId = url.searchParams.get("merchantOrderId");

  if (!merchantOrderId) {
    return NextResponse.json(
      {
        success: false,
        message: "merchantOrderId query parameter is required",
      },
      { status: 400 }
    );
  }

  // Reuse the POST logic
  return POST(
    new NextRequest(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantOrderId }),
    })
  );
}
