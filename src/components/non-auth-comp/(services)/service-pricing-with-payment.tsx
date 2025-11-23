"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ApiServicePrice } from "@/types/api/services";
import { ServiceSelectionData } from "@/types/api/payment";

interface ServicePricingWithPaymentProps {
  prices: ApiServicePrice[];
  serviceName: string;
  serviceId: string;
  categoryName: string;
  serviceSlug: string; // <-- Idhai add pannunga
  categorySlug: string; // <-- Idhai add pannunga
  onSelectionChange?: (selectionData: ServiceSelectionData) => void;
  showProceedButton?: boolean;
  className?: string;
}

// interface ServicePricingWithPaymentProps {
//   prices: ApiServicePrice[];
//   serviceName: string;
//   serviceId: string;
//   categoryName: string;
//   onSelectionChange?: (selectionData: ServiceSelectionData) => void;
//   showProceedButton?: boolean;
//   className?: string;
// }

const ServicePricingWithPayment = ({
  prices,
  serviceName,
  serviceId,
  categoryName,
  serviceSlug, // <-- Idhai add pannunga
  categorySlug, // <-- Idhai add pannunga
  onSelectionChange,
  showProceedButton = true,
  className = "",
}: ServicePricingWithPaymentProps) => {
  const router = useRouter();
  const [selectedPrices, setSelectedPrices] = useState<Set<string>>(new Set());

  if (!prices || prices.length === 0) {
    return null;
  }

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
    discountAmount: number | null
  ) => {
    if (!discountAmount) return originalPrice;
    return Math.max(0, originalPrice - discountAmount);
  };

  const handlePriceToggle = (priceId: string, isCompulsory: boolean) => {
    if (isCompulsory) return; // Cannot uncheck compulsory items

    setSelectedPrices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(priceId)) {
        newSet.delete(priceId);
      } else {
        newSet.add(priceId);
      }
      return newSet;
    });
  };

  // Calculate totals and prepare selection data
  const selectionData = useMemo((): ServiceSelectionData => {
    let totalAmount = 0;
    let totalDiscount = 0;
    let finalTotal = 0;
    const selectedItems: ServiceSelectionData["selectedPrices"] = [];

    prices.forEach((price) => {
      if (price.isCompulsory || selectedPrices.has(price.id)) {
        const discountedPrice = calculateDiscountedPrice(
          price.price,
          price.discountAmount || 0
        );

        selectedItems.push({
          id: price.id,
          name: price.name,
          price: price.price,
          discountAmount: price.discountAmount || 0,
          isCompulsory: price.isCompulsory,
          finalPrice: discountedPrice,
        });

        totalAmount += price.price;
        totalDiscount += price.discountAmount || 0;
        finalTotal += discountedPrice;
      }
    });

    return {
      serviceId,
      serviceName,
      categoryName,
      selectedPrices: selectedItems,
      totalAmount,
      totalDiscount,
      finalTotal,
    };
  }, [prices, selectedPrices, serviceId, serviceName, categoryName]);

  // Auto-select compulsory items on mount
  useEffect(() => {
    const compulsoryIds = prices
      .filter((price) => price.isCompulsory)
      .map((price) => price.id);

    if (compulsoryIds.length > 0) {
      setSelectedPrices(new Set(compulsoryIds));
    }
  }, [prices]);

  // Notify parent component of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectionData);
    }
  }, [selectionData, onSelectionChange]);

  const handleProceedToPayment = () => {
    if (selectionData.selectedPrices.length === 0) {
      alert("Please select at least one service to proceed.");
      return;
    }

    // Store selection data in sessionStorage for the next step
    sessionStorage.setItem("serviceSelection", JSON.stringify(selectionData));

    // Navigate to the payment form page
    router.push(`/services/${categorySlug}/${serviceSlug}/payment`);
    // router.push(
    //   `/services/${categoryName}/${serviceName.toLowerCase().replace(/\s+/g, "-")}/payment`
    // );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Pricing for {serviceName}
      </h3>

      {/* Pricing Options */}
      <div className="space-y-4 mb-6">
        {prices.map((price) => {
          const discountedPrice = calculateDiscountedPrice(
            price.price,
            price.discountAmount || 0
          );
          const hasDiscount = price.discountAmount && price.discountAmount > 0;
          const isSelected = price.isCompulsory || selectedPrices.has(price.id);

          return (
            <div
              key={price.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${price.isCompulsory ? "ring-2 ring-blue-200" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    id={price.id}
                    checked={isSelected}
                    onChange={() =>
                      handlePriceToggle(price.id, price.isCompulsory)
                    }
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={price.isCompulsory}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={price.id}
                      className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      {price.name}
                      {price.isCompulsory && (
                        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="text-right ml-4">
                  {hasDiscount ? (
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-gray-800">
                        {formatPrice(discountedPrice)}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(price.price)}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Save {formatPrice(price.discountAmount!)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-semibold text-gray-800">
                      {formatPrice(price.price)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      {selectionData.selectedPrices.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Subtotal ({selectionData.selectedPrices.length} items)
              </span>
              <span>{formatPrice(selectionData.totalAmount)}</span>
            </div>
            {selectionData.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Discount</span>
                <span>-{formatPrice(selectionData.totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>{formatPrice(selectionData.finalTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      {showProceedButton && (
        <div className="space-y-3">
          <button
            onClick={handleProceedToPayment}
            disabled={selectionData.selectedPrices.length === 0}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              selectionData.selectedPrices.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectionData.selectedPrices.length > 0
              ? `Proceed to Payment - ${formatPrice(selectionData.finalTotal)}`
              : "Select services to proceed"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            You will provide your details and complete payment on the next step
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicePricingWithPayment;
