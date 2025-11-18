import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { phonepeService } from "@/lib/phonepe";
import {
  PaymentCallbackRequest,
  PaymentCallbackResponse,
  PaymentStatus,
  PaymentEvent,
  PaymentMethod,
} from "@/types/api/payment";

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaymentCallbackResponse>> {
  try {
    // Get authorization header and request body
    const authorization = request.headers.get("authorization") || "";
    const responseBody = await request.text();

    if (!authorization || !responseBody) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing authorization header or request body",
        },
        { status: 400 }
      );
    }

    // PhonePe webhook credentials (these should be configured in your PhonePe dashboard)
    const webhookUsername =
      process.env.PHONEPE_WEBHOOK_USERNAME || "webhook_user";
    const webhookPassword =
      process.env.PHONEPE_WEBHOOK_PASSWORD || "webhook_pass";

    // Validate callback with PhonePe
    const callbackValidation = phonepeService.validateCallback(
      webhookUsername,
      webhookPassword,
      authorization,
      responseBody
    );

    if (!callbackValidation.success) {
      console.error(
        "PhonePe callback validation failed:",
        callbackValidation.error
      );
      return NextResponse.json(
        {
          success: false,
          message: "Invalid callback signature",
        },
        { status: 401 }
      );
    }

    const { type, payload } = callbackValidation.data;

    // Handle different callback types
    let merchantOrderId: string | null = null;
    let newStatus: PaymentStatus | null = null;
    let event: PaymentEvent;
    let description: string;

    switch (type) {
      case "CHECKOUT_ORDER_COMPLETED":
        merchantOrderId = payload.originalMerchantOrderId;
        newStatus = PaymentStatus.COMPLETED;
        event = PaymentEvent.PAYMENT_SUCCESS;
        description = "Payment completed via webhook";
        break;

      case "CHECKOUT_ORDER_FAILED":
        merchantOrderId = payload.originalMerchantOrderId;
        newStatus = PaymentStatus.FAILED;
        event = PaymentEvent.PAYMENT_FAILED;
        description = "Payment failed via webhook";
        break;

      case "PG_REFUND_COMPLETED":
        // Handle refund completion
        event = PaymentEvent.REFUND_COMPLETED;
        description = "Refund completed via webhook";
        // For refunds, we might need different handling
        break;

      case "PG_REFUND_FAILED":
        event = PaymentEvent.REFUND_FAILED;
        description = "Refund failed via webhook";
        break;

      case "PG_REFUND_ACCEPTED":
        event = PaymentEvent.REFUND_INITIATED;
        description = "Refund accepted via webhook";
        break;

      default:
        event = PaymentEvent.WEBHOOK_RECEIVED;
        description = `Webhook received with type: ${type}`;
    }

    // Find payment order if we have merchant order ID
    let paymentOrder = null;
    if (merchantOrderId) {
      paymentOrder = await prisma.paymentOrder.findUnique({
        where: { merchantOrderId },
        include: {
          selectedPrices: {
            include: {
              servicePrice: {
                include: {
                  service: {
                    select: {
                      id: true,
                      name: true,
                      categoryName: true,
                      formId: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!paymentOrder) {
        console.error(
          `Payment order not found for merchantOrderId: ${merchantOrderId}`
        );
        return NextResponse.json(
          {
            success: false,
            message: "Payment order not found",
          },
          { status: 404 }
        );
      }

      // Update payment order status if applicable
      if (newStatus && newStatus !== paymentOrder.status) {
        let phonepeTransactionId = paymentOrder.phonepeTransactionId;
        let paymentMethod = paymentOrder.paymentMethod;

        // Extract payment details from payload
        if (payload.paymentDetails && payload.paymentDetails.length > 0) {
          const latestPayment = payload.paymentDetails[0];
          phonepeTransactionId = latestPayment.transactionId?.toString();

          // Map payment mode
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
          }
        }

        await prisma.paymentOrder.update({
          where: { id: paymentOrder.id },
          data: {
            status: newStatus,
            phonepeTransactionId,
            paymentMethod,
            phonepeResponse: payload,
          },
        });

        // If payment is completed, create case
        if (newStatus === PaymentStatus.COMPLETED && !paymentOrder.caseId) {
          try {
            // Get the first service from selected prices (assuming single service per order)
            const firstServicePrice = paymentOrder.selectedPrices[0];
            const service = firstServicePrice.servicePrice.service;

            const newCase = await prisma.case.create({
              data: {
                customerName: paymentOrder.customerName,
                customerEmail: paymentOrder.customerEmail,
                customerPhone: paymentOrder.customerPhone,
                serviceId: service.id,
                status: "PENDING",
              },
            });

            // Link payment order to case
            await prisma.paymentOrder.update({
              where: { id: paymentOrder.id },
              data: { caseId: newCase.id },
            });

            description += ` and case created (ID: ${newCase.id})`;
          } catch (caseError) {
            console.error("Error creating case:", caseError);
            description += " but failed to create case";
          }
        }
      }

      // Create audit log
      await prisma.paymentAuditLog.create({
        data: {
          orderId: paymentOrder.id,
          event,
          status: newStatus || (paymentOrder.status as PaymentStatus),
          description,
          metadata: {
            callbackType: type,
            payload,
            authorization: authorization.substring(0, 20) + "...", // Log partial auth for debugging
          },
        },
      });
    } else {
      // Log webhook even if no order found
      console.log(
        `Webhook received with type ${type} but no merchant order ID found`
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        payload,
        orderId: paymentOrder?.id,
        status: newStatus || undefined,
      },
    });
  } catch (error: any) {
    console.error("Payment callback processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for payment return (when user comes back from PhonePe)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const merchantOrderId = url.searchParams.get("merchantOrderId");
  const status = url.searchParams.get("status");

  // Redirect to success page with parameters
  const redirectUrl = new URL("/success", request.url);
  if (merchantOrderId) {
    redirectUrl.searchParams.set("orderId", merchantOrderId);
  }
  if (status) {
    redirectUrl.searchParams.set("status", status);
  }

  return NextResponse.redirect(redirectUrl);
}
