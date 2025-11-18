import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
  CreateSdkOrderRequest,
  RefundRequest,
  MetaInfo,
} from "pg-sdk-node";

// PhonePe Configuration
const PHONEPE_CONFIG = {
  clientId: process.env.PHONEPE_CLIENT_ID || "TEST-M23K1JTKK7X3O_25091",
  clientSecret:
    process.env.PHONEPE_CLIENT_SECRET ||
    "ZmRmYjJmOGEtODBhMy00YWQzLWFhNDktYTQwY2YzY2ZhNjUw",
  clientVersion: parseInt(process.env.PHONEPE_CLIENT_VERSION || "1"),
  environment: (process.env.PHONEPE_ENV === "PRODUCTION"
    ? Env.PRODUCTION
    : Env.SANDBOX) as Env,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};

// Initialize PhonePe Client (Singleton)
let phonepeClient: StandardCheckoutClient | null = null;

const getPhonepeClient = (): StandardCheckoutClient => {
  if (!phonepeClient) {
    phonepeClient = StandardCheckoutClient.getInstance(
      PHONEPE_CONFIG.clientId,
      PHONEPE_CONFIG.clientSecret,
      PHONEPE_CONFIG.clientVersion,
      PHONEPE_CONFIG.environment
    );
  }
  return phonepeClient;
};

// PhonePe Service Types
export interface PhonepePaymentRequest {
  merchantOrderId: string;
  amount: number; // Amount in paisa
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  redirectUrl?: string;
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
  };
}

export interface PhonepePaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    redirectUrl: string;
    state: string;
    expireAt: string;
  };
  error?: string;
}

export interface PhonepeOrderStatusResponse {
  success: boolean;
  data?: {
    orderId: string;
    state: string;
    amount: number;
    expireAt: number;
    paymentDetails: any[];
    metaInfo?: any;
  };
  error?: string;
}

export interface PhonepeRefundRequest {
  merchantRefundId: string;
  originalMerchantOrderId: string;
  amount: number; // Amount in paisa
}

export interface PhonepeRefundResponse {
  success: boolean;
  data?: {
    refundId: string;
    state: string;
    amount: number;
  };
  error?: string;
}

// PhonePe Service Functions
export const phonepeService = {
  // Initialize Payment
  initiatePayment: async (
    request: PhonepePaymentRequest
  ): Promise<PhonepePaymentResponse> => {
    try {
      const client = getPhonepeClient();

      const redirectUrl =
        request.redirectUrl || `${PHONEPE_CONFIG.baseUrl}/payment/callback`;

      // Build meta info if provided
      let metaInfo = null;
      if (request.metaInfo) {
        const metaBuilder = MetaInfo.builder();
        if (request.metaInfo.udf1) metaBuilder.udf1(request.metaInfo.udf1);
        if (request.metaInfo.udf2) metaBuilder.udf2(request.metaInfo.udf2);
        if (request.metaInfo.udf3) metaBuilder.udf3(request.metaInfo.udf3);
        if (request.metaInfo.udf4) metaBuilder.udf4(request.metaInfo.udf4);
        if (request.metaInfo.udf5) metaBuilder.udf5(request.metaInfo.udf5);
        metaInfo = metaBuilder.build();
      }

      const paymentRequestBuilder = StandardCheckoutPayRequest.builder()
        .merchantOrderId(request.merchantOrderId)
        .amount(request.amount)
        .redirectUrl(redirectUrl);

      if (metaInfo) {
        paymentRequestBuilder.metaInfo(metaInfo);
      }

      const paymentRequest = paymentRequestBuilder.build();

      const response = await client.pay(paymentRequest);

      return {
        success: true,
        data: {
          orderId: response.orderId,
          redirectUrl: response.redirectUrl,
          state: response.state,
          expireAt: response.expireAt.toString(),
        },
      };
    } catch (error: any) {
      console.error("PhonePe payment initiation error:", error);
      return {
        success: false,
        error: error.message || "Failed to initiate payment",
      };
    }
  },

  // Create SDK Order (for mobile apps)
  createSdkOrder: async (request: {
    merchantOrderId: string;
    amount: number;
    redirectUrl: string;
  }) => {
    try {
      const client = getPhonepeClient();

      const orderRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
        .merchantOrderId(request.merchantOrderId)
        .amount(request.amount)
        .redirectUrl(request.redirectUrl)
        .build();

      const response = await client.createSdkOrder(orderRequest);

      return {
        success: true,
        data: {
          orderId: response.orderId,
          state: response.state,
          expireAt: response.expireAt,
          token: response.token,
        },
      };
    } catch (error: any) {
      console.error("PhonePe SDK order creation error:", error);
      return {
        success: false,
        error: error.message || "Failed to create SDK order",
      };
    }
  },

  // Check Order Status
  getOrderStatus: async (
    merchantOrderId: string
  ): Promise<PhonepeOrderStatusResponse> => {
    try {
      const client = getPhonepeClient();

      const response = await client.getOrderStatus(merchantOrderId);

      return {
        success: true,
        data: {
          orderId: response.orderId,
          state: response.state,
          amount: response.amount,
          expireAt: response.expireAt,
          paymentDetails: response.paymentDetails || [],
          metaInfo: response.metaInfo,
        },
      };
    } catch (error: any) {
      console.error("PhonePe order status check error:", error);
      return {
        success: false,
        error: error.message || "Failed to get order status",
      };
    }
  },

  // Initiate Refund
  initiateRefund: async (
    request: PhonepeRefundRequest
  ): Promise<PhonepeRefundResponse> => {
    try {
      const client = getPhonepeClient();

      const refundRequest = RefundRequest.builder()
        .amount(request.amount)
        .merchantRefundId(request.merchantRefundId)
        .originalMerchantOrderId(request.originalMerchantOrderId)
        .build();

      const response = await client.refund(refundRequest);

      return {
        success: true,
        data: {
          refundId: response.refundId,
          state: response.state,
          amount: response.amount,
        },
      };
    } catch (error: any) {
      console.error("PhonePe refund initiation error:", error);
      return {
        success: false,
        error: error.message || "Failed to initiate refund",
      };
    }
  },

  // Get Refund Status
  getRefundStatus: async (merchantRefundId: string) => {
    try {
      const client = getPhonepeClient();

      const response = await client.getRefundStatus(merchantRefundId);

      return {
        success: true,
        data: {
          merchantId: response.merchantId,
          merchantRefundId: response.merchantRefundId,
          state: response.state,
          amount: response.amount,
          paymentDetails: response.paymentDetails || [],
        },
      };
    } catch (error: any) {
      console.error("PhonePe refund status check error:", error);
      return {
        success: false,
        error: error.message || "Failed to get refund status",
      };
    }
  },

  // Validate Webhook/Callback
  validateCallback: (
    username: string,
    password: string,
    authorization: string,
    responseBody: string
  ) => {
    try {
      const client = getPhonepeClient();

      const callbackResponse = client.validateCallback(
        username,
        password,
        authorization,
        responseBody
      );

      return {
        success: true,
        data: {
          type: callbackResponse.type,
          payload: callbackResponse.payload,
        },
      };
    } catch (error: any) {
      console.error("PhonePe callback validation error:", error);
      return {
        success: false,
        error: error.message || "Failed to validate callback",
      };
    }
  },
};

// Utility functions
export const phonepeUtils = {
  // Convert rupees to paisa
  rupeesToPaisa: (rupees: number): number => {
    return Math.round(rupees * 100);
  },

  // Convert paisa to rupees
  paisaToRupees: (paisa: number): number => {
    return paisa / 100;
  },

  // Generate unique merchant order ID
  generateMerchantOrderId: (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ORDER_${timestamp}_${random}`;
  },

  // Format amount for display
  formatAmount: (amountInPaisa: number): string => {
    const rupees = phonepeUtils.paisaToRupees(amountInPaisa);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rupees);
  },
};

export default phonepeService;
