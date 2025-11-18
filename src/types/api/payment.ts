// Payment API Types
export interface PaymentInitiationRequest {
  serviceId: string;
  selectedPriceIds: string[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  formResponseData?: any; // Optional form data
  redirectUrl?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  data?: {
    orderId: string;
    merchantOrderId: string;
    checkoutUrl: string;
    amount: number; // in paisa
    expireAt: string;
    selectedItems: PaymentOrderItemSummary[];
  };
  message?: string;
}

export interface PaymentOrderItemSummary {
  servicePriceId: string;
  priceItemName: string;
  originalPrice: number; // in paisa
  discountAmount: number; // in paisa
  finalPrice: number; // in paisa
  isCompulsory: boolean;
}

export interface PaymentStatusRequest {
  merchantOrderId: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    orderId: string;
    merchantOrderId: string;
    status: PaymentStatus;
    amount: number; // in paisa
    paymentMethod?: PaymentMethod;
    phonepeTransactionId?: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
    selectedItems: PaymentOrderItemSummary[];
    caseId?: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export interface PaymentCallbackRequest {
  authorization: string;
  responseBody: string;
}

export interface PaymentCallbackResponse {
  success: boolean;
  data?: {
    type: string;
    payload: any;
    orderId?: string;
    status?: PaymentStatus;
  };
  message?: string;
}

export interface PaymentRefundRequest {
  merchantOrderId: string;
  amount?: number; // Optional: if not provided, full refund
  reason?: string;
}

export interface PaymentRefundResponse {
  success: boolean;
  data?: {
    refundId: string;
    merchantRefundId: string;
    amount: number; // in paisa
    status: string;
  };
  message?: string;
}

// Enums matching Prisma schema
export enum PaymentStatus {
  PENDING = "PENDING",
  INITIATED = "INITIATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum PaymentMethod {
  UPI_INTENT = "UPI_INTENT",
  UPI_COLLECT = "UPI_COLLECT",
  UPI_QR = "UPI_QR",
  CARD = "CARD",
  TOKEN = "TOKEN",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
}

export enum PaymentEvent {
  ORDER_CREATED = "ORDER_CREATED",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_PROCESSING = "PAYMENT_PROCESSING",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_CANCELLED = "PAYMENT_CANCELLED",
  REFUND_INITIATED = "REFUND_INITIATED",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_FAILED = "REFUND_FAILED",
  WEBHOOK_RECEIVED = "WEBHOOK_RECEIVED",
  STATUS_CHECK = "STATUS_CHECK",
  ERROR_OCCURRED = "ERROR_OCCURRED",
}

// Service selection types for frontend
export interface ServiceSelectionData {
  serviceId: string;
  serviceName: string;
  categoryName: string;
  selectedPrices: {
    id: string;
    name: string;
    price: number;
    discountAmount: number | null;
    isCompulsory: boolean;
    finalPrice: number;
  }[];
  totalAmount: number; // in paisa
  totalDiscount: number; // in paisa
  finalTotal: number; // in paisa
}

// Case creation with payment
export interface CaseCreationWithPaymentRequest {
  serviceSelectionData: ServiceSelectionData;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  formResponseData?: any;
  paymentRequired: boolean;
}

export interface CaseCreationWithPaymentResponse {
  success: boolean;
  data?: {
    caseId: string;
    paymentOrder?: {
      orderId: string;
      merchantOrderId: string;
      checkoutUrl: string;
      amount: number;
      expireAt: string;
    };
  };
  message?: string;
}
