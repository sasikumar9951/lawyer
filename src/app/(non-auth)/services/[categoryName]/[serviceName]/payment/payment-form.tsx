"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ApiService, ApiServicePrice } from "@/types/api/services";
import { ApiForm } from "@/types/api/forms";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SurveyFormRenderer from "@/components/survey-form-renderer";
import FileUpload from "@/components/ui/file-upload";
import {
  ServiceSelectionData,
  PaymentInitiationRequest,
} from "@/types/api/payment";

interface PaymentFormProps {
  service: ApiService;
  form: ApiForm | null;
  selectedPrices: ApiServicePrice[];
  setSelectedPrices: (prices: ApiServicePrice[]) => void;
}

interface CustomerDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface FormData {
  [key: string]: any;
}

interface UploadedFile {
  id: string;
  name: string;
  s3Path: string;
  size: number;
  type?: string;
  file?: File;
}

export default function PaymentForm({
  service,
  form,
  selectedPrices,
  setSelectedPrices,
}: PaymentFormProps) {
  const params = useParams();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicePrices, setServicePrices] = useState<ApiServicePrice[]>([]);
  const [selectedPriceIds, setSelectedPriceIds] = useState<Set<string>>(
    new Set()
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: "pending" | "uploading" | "completed" | "error";
  }>({});

  // Payment related states
  const [caseId, setCaseId] = useState<string | null>(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch service prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          `/api/services/${params.categoryName}/${params.serviceName}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Service data:", data.data);
          console.log("Form data:", data.data.form);
          setServicePrices(data.data.price || []);

          // Auto-select compulsory items
          const compulsoryIds =
            data.data.price
              ?.filter((price: ApiServicePrice) => price.isCompulsory)
              .map((price: ApiServicePrice) => price.id) || [];

          setSelectedPriceIds(new Set(compulsoryIds));

          const selectedPricesFromData =
            data.data.price?.filter(
              (price: ApiServicePrice) => price.isCompulsory
            ) || [];

          setSelectedPrices(selectedPricesFromData);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [params, setSelectedPrices]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscountedPrice = (
    originalPrice: number,
    discountAmount: number | null | undefined
  ) => {
    if (!discountAmount) return originalPrice;
    return Math.max(0, originalPrice - discountAmount);
  };

  const handlePriceToggle = (priceId: string, isCompulsory: boolean) => {
    if (isCompulsory) return;

    const newSelectedIds = new Set(selectedPriceIds);
    if (newSelectedIds.has(priceId)) {
      newSelectedIds.delete(priceId);
    } else {
      newSelectedIds.add(priceId);
    }

    setSelectedPriceIds(newSelectedIds);

    // Update selected prices based on the new selection
    const newSelectedPrices = servicePrices.filter(
      (price) => price.isCompulsory || newSelectedIds.has(price.id)
    );
    setSelectedPrices(newSelectedPrices);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedPrices.forEach((price) => {
      const discountedPrice = calculateDiscountedPrice(
        price.price,
        price.discountAmount
      );
      total += discountedPrice;
    });
    return total;
  };

  const handleCustomerDetailsChange = (
    field: keyof CustomerDetails,
    value: string
  ) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormComplete = (result: any) => {
    console.log("Form completed in payment form:", result);
    setFormData(result);
    toast.success("Form completed successfully!");
  };

  const createCase = async () => {
    if (!validateForm()) return null;

    try {
      const submissionData = {
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        serviceId: service.id,
        formData: formData,
        selectedPrices: selectedPrices,
      };

      console.log("Creating case with data:", submissionData);

      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Case created successfully:", responseData);
        return responseData.data.id;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create case");
      }
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Failed to create case. Please try again.");
      return null;
    }
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    console.log("Payment form - Files uploaded:", files);
    console.log("Payment form - Files count:", files.length);
    setUploadedFiles(files);
  };

  const validateForm = () => {
    if (!customerDetails.customerName.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!customerDetails.customerEmail.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.customerEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!customerDetails.customerPhone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(customerDetails.customerPhone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return false;
    }
    if (selectedPrices.length === 0) {
      toast.error("Please select at least one service option");
      return false;
    }
    // Check if form is completed if form exists
    if (form && !formData) {
      toast.error("Please complete the service form before proceeding");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Step 1: Create case
      const createdCaseId = await createCase();
      if (!createdCaseId) {
        setIsSubmitting(false);
        setIsUploading(false);
        return;
      }

      setCaseId(createdCaseId);
      toast.success("Case created! Now uploading files...");

      // Step 2: Upload files one by one
      const filesToUpload = uploadedFiles.filter(
        (file) => file.id.startsWith("temp-") && file.file
      );

      console.log("Files to upload:", filesToUpload);
      console.log("Total uploaded files:", uploadedFiles);
      console.log(
        "All uploaded files details:",
        uploadedFiles.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          hasFile: !!f.file,
          fileType: f.file?.type,
          isTemp: f.id.startsWith("temp-"),
        }))
      );
      console.log(
        "Files to upload details:",
        filesToUpload.map((f) => ({
          name: f.name,
          size: f.size,
          hasFile: !!f.file,
          fileType: f.file?.type,
        }))
      );

      if (filesToUpload.length === 0) {
        toast.success(
          "Case and files processed successfully! You can now proceed to payment."
        );
        setShowPaymentButton(true);
        setIsSubmitting(false);
        setIsUploading(false);
        return;
      }

      // Upload files and track results
      const uploadResults = [];

      for (const file of filesToUpload) {
        try {
          setUploadStatus((prev) => ({ ...prev, [file.name]: "uploading" }));

          // Get signed URL
          const urlResponse = await fetch("/api/admin/s3/put", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              caseId: createdCaseId,
              fileName: file.name,
              fileType: file.type || "application/octet-stream",
              fileSize: file.size,
            }),
          });

          if (!urlResponse.ok) {
            throw new Error("Failed to get upload URL");
          }

          const urlData = await urlResponse.json();
          const { signedUrl } = urlData.data;

          console.log(`Uploading ${file.name} to S3...`);
          console.log(`File size: ${file.file?.size} bytes`);
          console.log(`File type: ${file.file?.type}`);

          // Upload to S3
          const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: file.file,
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });

          console.log(
            `S3 upload response for ${file.name}:`,
            uploadResponse.status,
            uploadResponse.statusText
          );

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload file to S3");
          }

          setUploadStatus((prev) => ({ ...prev, [file.name]: "completed" }));
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

          uploadResults.push({ file: file.name, success: true });
          toast.success(`File ${file.name} uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
          uploadResults.push({
            file: file.name,
            success: false,
            error: String(error),
          });
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Check if all files were uploaded successfully
      const successfulUploads = uploadResults.filter(
        (result) => result.success
      );
      const failedUploads = uploadResults.filter((result) => !result.success);

      if (failedUploads.length === 0) {
        toast.success(
          "Case and files processed successfully! You can now proceed to payment."
        );
        setShowPaymentButton(true);
      } else {
        toast.error(
          `${failedUploads.length} files failed to upload. Please try again.`
        );
        console.error("Failed uploads:", failedUploads);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // New payment function
  const handlePayment = async () => {
    if (!caseId || selectedPrices.length === 0) {
      toast.error("Unable to proceed with payment. Please try again.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Prepare payment request
      const paymentRequest: PaymentInitiationRequest = {
        serviceId: service.id,
        selectedPriceIds: selectedPrices.map((price) => price.id),
        customerInfo: {
          name: customerDetails.customerName,
          email: customerDetails.customerEmail,
          phone: customerDetails.customerPhone,
        },
        formResponseData: formData,
        redirectUrl: `${window.location.origin}/success`,
      };

      console.log("Initiating payment with data:", paymentRequest);

      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store payment info for callback handling
        sessionStorage.setItem(
          "paymentOrder",
          JSON.stringify({
            orderId: result.data.orderId,
            merchantOrderId: result.data.merchantOrderId,
            amount: result.data.amount,
            caseId: caseId,
            customerInfo: {
              name: customerDetails.customerName,
              email: customerDetails.customerEmail,
              phone: customerDetails.customerPhone,
            },
            serviceInfo: {
              serviceId: service.id,
              serviceName: service.name,
              categoryName: service.categoryName,
            },
          })
        );

        // Redirect to PhonePe payment gateway
        window.location.href = result.data.checkoutUrl;
      } else {
        throw new Error(result.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(
        error.message || "Failed to initiate payment. Please try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form Section */}
      <div className="lg:col-span-2 space-y-8">
        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Customer Details
            </CardTitle>
            <p className="text-gray-600">
              Please provide your contact information
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerDetails.customerName}
                  onChange={(e) =>
                    handleCustomerDetailsChange("customerName", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={customerDetails.customerEmail}
                  onChange={(e) =>
                    handleCustomerDetailsChange("customerEmail", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="Enter your phone number"
                value={customerDetails.customerPhone}
                onChange={(e) =>
                  handleCustomerDetailsChange("customerPhone", e.target.value)
                }
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Upload Documents{" "}
              {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
            </CardTitle>
            <p className="text-gray-600">
              Upload any relevant documents for your case (optional)
            </p>
          </CardHeader>
          <CardContent>
            <FileUpload
              caseId="temp"
              onFilesUploaded={handleFilesUploaded}
              maxFiles={10}
              acceptedFileTypes={[
                ".pdf",
                ".doc",
                ".docx",
                ".jpg",
                ".jpeg",
                ".png",
                ".txt",
              ]}
              maxFileSize={10}
              isTemporary={true}
            />

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Debug: {uploadedFiles.length} files uploaded
              </p>
              <p className="text-sm text-gray-600">
                Files: {uploadedFiles.map((f) => f.name).join(", ") || "None"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress Section */}
        {isUploading && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Uploading Files...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file) => {
                  const status = uploadStatus[file.name] || "pending";
                  const progress = uploadProgress[file.name] || 0;

                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {status === "uploading" && (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-blue-600">
                              Uploading...
                            </span>
                          </div>
                        )}
                        {status === "completed" && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm">Uploaded</span>
                          </div>
                        )}
                        {status === "error" && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm">Failed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Form */}
        {form && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Service Form {formData && "✓"}
              </CardTitle>
              <p className="text-gray-600">
                {formData
                  ? "Form completed successfully! You can now proceed with payment."
                  : "Please complete the form below to provide additional details"}
              </p>
            </CardHeader>
            <CardContent>
              {formData ? (
                <div className="text-center py-8">
                  <div className="text-green-600 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-green-600 font-semibold">
                    Form completed successfully!
                  </p>
                  <p className="text-gray-600 mt-2">
                    You can now proceed with payment.
                  </p>
                </div>
              ) : form.schemaJson &&
                typeof form.schemaJson === "object" &&
                form.schemaJson !== null ? (
                <SurveyFormRenderer
                  schema={form.schemaJson as Record<string, any>}
                  onComplete={handleFormComplete}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No form schema available. Form:{" "}
                    {JSON.stringify(form, null, 2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Pricing and Payment */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-28 space-y-6">
          {/* Service Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Service Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {servicePrices.map((price) => {
                const discountedPrice = calculateDiscountedPrice(
                  price.price,
                  price.discountAmount
                );
                const hasDiscount =
                  price.discountAmount && price.discountAmount > 0;
                const isSelected =
                  price.isCompulsory || selectedPriceIds.has(price.id);

                return (
                  <div
                    key={price.id}
                    className={`border rounded-lg p-4 transition-all duration-300 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`price-${price.id}`}
                        checked={isSelected}
                        onChange={() =>
                          handlePriceToggle(price.id, price.isCompulsory)
                        }
                        disabled={price.isCompulsory}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <label
                            htmlFor={`price-${price.id}`}
                            className="text-sm font-semibold text-gray-800 cursor-pointer"
                          >
                            {price.name}
                          </label>
                          {price.isCompulsory && (
                            <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {hasDiscount ? (
                              <div className="space-y-1">
                                <p className="font-bold text-gray-800">
                                  {formatPrice(discountedPrice)}
                                </p>
                                <p className="text-gray-500 line-through text-xs">
                                  {formatPrice(price.price)}
                                </p>
                              </div>
                            ) : (
                              <p className="font-bold text-gray-800">
                                {formatPrice(price.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Selected Items:</span>
                  <span className="font-medium">{selectedPrices.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Step 1: Complete Submission Button */}
              {!showPaymentButton && (
                <>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (form ? !formData : false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : form && !formData ? (
                      "Complete Form First"
                    ) : form && formData ? (
                      "Complete Submission ✓"
                    ) : (
                      "Complete Submission"
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By clicking "Complete Submission", you agree to our terms
                    and conditions
                  </p>
                </>
              )}

              {/* Step 2: Payment Button (shown after case creation) */}
              {showPaymentButton && (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-green-800 font-medium">
                        Case Created Successfully!
                      </p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Your case has been created with ID:{" "}
                      <span className="font-mono">{caseId}</span>
                    </p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  >
                    {isProcessingPayment ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing Payment...</span>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Pay Now - {formatPrice(calculateTotal())}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Secure payment powered by PhonePe. You will be redirected to
                    complete the payment.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
