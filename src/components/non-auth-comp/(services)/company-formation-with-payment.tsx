"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { ServiceSelectionData } from "@/types/api/payment";
import ServicePricingWithPayment from "./service-pricing-with-payment";

const CompanyFormationWithPayment = ({
  serviceData,
}: {
  serviceData?: any;
}) => {
  const router = useRouter();
  const [selectionData, setSelectionData] =
    useState<ServiceSelectionData | null>(null);

  // Handle selection changes from the pricing component
  const handleSelectionChange = (data: ServiceSelectionData) => {
    setSelectionData(data);
  };

  // If service data includes pricing, use the pricing component
  if (serviceData && serviceData.price && serviceData.price.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {serviceData.name}
        </h2>

        <ServicePricingWithPayment
          prices={serviceData.price}
          serviceName={serviceData.name}
          serviceId={serviceData.id}
          categoryName={serviceData.categoryName}
          serviceSlug={serviceData.slug}
          categorySlug={serviceData.category.slug}

          onSelectionChange={handleSelectionChange}
          showProceedButton={true}
          className="shadow-none p-0 mb-0"
        />

        {/* Additional service information */}
        {serviceData.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              About This Service
            </h3>
            <p className="text-sm text-gray-600">{serviceData.description}</p>
          </div>
        )}

        {/* Service stats */}
        {(serviceData.customerCount > 0 || serviceData.averageRating > 0) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              {serviceData.customerCount > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {serviceData.customerCount}+
                  </div>
                  <div className="text-xs text-gray-500">Happy Clients</div>
                </div>
              )}
              {serviceData.averageRating > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {serviceData.averageRating}/5
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to original hardcoded services if no pricing data
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState("");

  const services = [
    {
      id: "partnership",
      name: "Partnership Firm",
      currentPrice: 9999,
      originalPrice: 13399,
      discount: 3400,
      discountPercent: 25,
      isCompulsory: true,
    },
    {
      id: "gst",
      name: "GST Registration",
      currentPrice: 3499,
      originalPrice: 7999,
      discount: 4500,
      discountPercent: 56,
    },
    {
      id: "startup",
      name: "Startup India Registration",
      currentPrice: 3999,
      originalPrice: 7999,
      discount: 4000,
      discountPercent: 50,
    },
    {
      id: "msme",
      name: "MSME (Udyog Aadhar) Registration",
      currentPrice: 1999,
      originalPrice: 4999,
      discount: 2500,
      discountPercent: 50,
    },
  ];

  const handleServiceToggle = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service?.isCompulsory) return; // Cannot uncheck compulsory items

    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return services
      .filter(
        (service) =>
          service.isCompulsory || selectedServices.includes(service.id)
      )
      .reduce((total, service) => total + service.currentPrice, 0);
  };

  const calculateOriginalTotal = () => {
    return services
      .filter(
        (service) =>
          service.isCompulsory || selectedServices.includes(service.id)
      )
      .reduce((total, service) => total + service.originalPrice, 0);
  };

  const calculateSavings = () => {
    return calculateOriginalTotal() - calculateTotal();
  };

  const handleProceedToPayment = () => {
    const selectedItems = services.filter(
      (service) => service.isCompulsory || selectedServices.includes(service.id)
    );

    if (selectedItems.length === 0) {
      alert("Please select at least one service to proceed.");
      return;
    }

    // Create selection data for fallback services
    const fallbackSelectionData: ServiceSelectionData = {
      serviceId: serviceData?.id || "fallback-service",
      serviceName: serviceData?.name || "Company Formation",
      categoryName: serviceData?.categoryName || "company-formation",
      selectedPrices: selectedItems.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.originalPrice * 100, // Convert to paisa
        discountAmount: service.discount * 100, // Convert to paisa
        isCompulsory: service.isCompulsory || false,
        finalPrice: service.currentPrice * 100, // Convert to paisa
      })),
      totalAmount: calculateOriginalTotal() * 100, // Convert to paisa
      totalDiscount: calculateSavings() * 100, // Convert to paisa
      finalTotal: calculateTotal() * 100, // Convert to paisa
    };

    // Store selection data in sessionStorage
    sessionStorage.setItem(
      "serviceSelection",
      JSON.stringify(fallbackSelectionData)
    );

    // Navigate to payment form
    router.push(`/services/company-formation/partnership-firm/payment`);
  };

  // Auto-select compulsory items on mount
  useEffect(() => {
    const compulsoryIds = services
      .filter((service) => service.isCompulsory)
      .map((service) => service.id);
    setSelectedServices(compulsoryIds);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {serviceData ? serviceData.name : "Company Formation"}
      </h2>

      {/* Services List */}
      <div className="space-y-4 mb-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-start justify-between border-b border-gray-200 pb-3"
          >
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                id={service.id}
                checked={
                  service.isCompulsory || selectedServices.includes(service.id)
                }
                onChange={() => handleServiceToggle(service.id)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={service.isCompulsory}
              />
              <label
                htmlFor={service.id}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {service.name}
                {service.isCompulsory && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">
                ₹{service.currentPrice.toLocaleString()}
              </div>
              {service.discount > 0 && (
                <div className="text-xs text-red-600">
                  {service.discountPercent &&
                    `(${service.discountPercent}% Off) `}
                  ₹{service.discount.toLocaleString()} SAVE
                </div>
              )}
              <div className="text-xs text-gray-400 line-through">
                ₹{service.originalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gross Total */}
      <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-4">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">
            ₹{calculateTotal().toLocaleString()}
          </div>
          {calculateSavings() > 0 && (
            <div className="text-sm text-green-600">
              You save ₹{calculateSavings().toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceedToPayment}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Proceed to Payment - ₹{calculateTotal().toLocaleString()}
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">
        You will provide your details and complete payment on the next step
      </p>
    </div>
  );
};

export default CompanyFormationWithPayment;
