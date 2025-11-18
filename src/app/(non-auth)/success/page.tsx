"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ServiceNavbar from "@/components/non-auth-comp/(services)/service-navbar";
import ServiceFooter from "@/components/non-auth-comp/(services)/service-footer";
import { CheckCircle, XCircle, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusResponse } from "@/types/api/payment";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Fetch payment status if orderId is provided
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/payment/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ merchantOrderId: orderId }),
        });

        const result = await response.json();

        if (result.success) {
          setPaymentStatus(result);
        } else {
          setError(result.message || "Failed to fetch payment status");
        }
      } catch (err: any) {
        console.error("Error fetching payment status:", err);
        setError("Failed to fetch payment status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [orderId]);

  const formatPrice = (amountInPaisa: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountInPaisa / 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        );
      case "FAILED":
      case "CANCELLED":
        return <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />;
      case "PENDING":
      case "INITIATED":
      case "PROCESSING":
        return <Clock className="w-24 h-24 text-yellow-500 mx-auto mb-6" />;
      default:
        return (
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          title: "Payment Successful!",
          message:
            "Your payment has been processed successfully and your case has been created.",
          color: "text-green-800",
        };
      case "FAILED":
        return {
          title: "Payment Failed",
          message:
            "Unfortunately, your payment could not be processed. Please try again.",
          color: "text-red-800",
        };
      case "CANCELLED":
        return {
          title: "Payment Cancelled",
          message:
            "You have cancelled the payment. You can try again whenever you're ready.",
          color: "text-red-800",
        };
      case "PENDING":
      case "INITIATED":
      case "PROCESSING":
        return {
          title: "Payment Processing",
          message:
            "Your payment is being processed. Please wait while we confirm the transaction.",
          color: "text-yellow-800",
        };
      default:
        return {
          title: "Case Submitted Successfully!",
          message:
            "Thank you for choosing our services. We have received your case details.",
          color: "text-green-800",
        };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ServiceNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        onMobileMenuClose={handleMobileMenuClose}
      />

      <div className="pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment status...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
              <h1 className="text-4xl lg:text-5xl font-bold text-red-800 mb-4">
                Error
              </h1>
              <p className="text-xl text-gray-600 mb-8">{error}</p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              {/* Status Icon and Message */}
              <div className="mb-8">
                {paymentStatus?.data ? (
                  getStatusIcon(paymentStatus.data.status)
                ) : (
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                )}

                {(() => {
                  const statusInfo = paymentStatus?.data
                    ? getStatusMessage(paymentStatus.data.status)
                    : getStatusMessage("default");

                  return (
                    <>
                      <h1
                        className={`text-4xl lg:text-5xl font-bold mb-4 ${statusInfo.color}`}
                      >
                        {statusInfo.title}
                      </h1>
                      <p className="text-xl text-gray-600 mb-8">
                        {statusInfo.message}
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Payment Details */}
              {paymentStatus?.data && (
                <div className="max-w-2xl mx-auto mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Order ID</p>
                          <p className="font-medium">
                            {paymentStatus.data.merchantOrderId}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-medium">
                            {formatPrice(paymentStatus.data.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">
                            {paymentStatus.data.customerInfo.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p
                            className={`font-medium ${
                              paymentStatus.data.status === "COMPLETED"
                                ? "text-green-600"
                                : paymentStatus.data.status === "FAILED"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {paymentStatus.data.status.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      {paymentStatus.data.selectedItems.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                              Selected Services
                            </h4>
                            <div className="space-y-2">
                              {paymentStatus.data.selectedItems.map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <span className="text-gray-700">
                                      {item.priceItemName}
                                    </span>
                                    <span className="font-medium">
                                      {formatPrice(item.finalPrice)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {paymentStatus.data.caseId && (
                        <>
                          <Separator />
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Case ID</p>
                            <p className="font-medium text-lg text-blue-600">
                              {paymentStatus.data.caseId}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Please save this case ID for future reference
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Next Steps */}
              {(!paymentStatus?.data ||
                paymentStatus.data.status === "COMPLETED") && (
                <div className="bg-blue-50 rounded-lg p-8 mb-8 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                    What happens next?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Review
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Our team will review your case details and requirements
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Contact
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We'll reach out to you within 24-48 hours to discuss
                        your case
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Begin
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Once confirmed, we'll start working on your case
                        immediately
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {paymentStatus?.data?.status === "FAILED" ||
                paymentStatus?.data?.status === "CANCELLED" ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.history.back()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Try Payment Again
                    </Button>
                    <div>
                      <Button
                        onClick={() => (window.location.href = "/")}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                      >
                        Back to Home
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => (window.location.href = "/")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Back to Home
                    </Button>
                    <div>
                      <Button
                        onClick={() => (window.location.href = "/services")}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                      >
                        Browse More Services
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-8 text-sm text-gray-500">
                <p>
                  Have questions? Contact us at info@vakilfy.com or call +91
                  8979096507
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ServiceFooter />
    </div>
  );
}
