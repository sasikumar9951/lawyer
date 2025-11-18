"use client";

import { ApiServicePrice } from "@/types/api/services";
import { useState, useMemo, useEffect } from "react";

interface ServicePricingProps {
  prices: ApiServicePrice[];
  serviceName: string;
}

const ServicePricing = ({ prices, serviceName }: ServicePricingProps) => {
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

  // Calculate totals
  const pricingSummary = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let finalTotal = 0;
    const selectedItems: ApiServicePrice[] = [];

    prices.forEach((price) => {
      if (price.isCompulsory || selectedPrices.has(price.id)) {
        selectedItems.push(price);
        const discountedPrice = calculateDiscountedPrice(
          price.price,
          price.discountAmount || 0
        );
        subtotal += price.price;
        totalDiscount += price.discountAmount || 0;
        finalTotal += discountedPrice;
      }
    });

    return {
      subtotal,
      totalDiscount,
      finalTotal,
      selectedItems,
      itemCount: selectedItems.length,
    };
  }, [prices, selectedPrices]);

  // Auto-select compulsory items on mount
  useEffect(() => {
    const compulsoryIds = prices
      .filter((price) => price.isCompulsory)
      .map((price) => price.id);

    if (compulsoryIds.length > 0) {
      setSelectedPrices(new Set(compulsoryIds));
    }
  }, [prices]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                      className="text-lg font-semibold text-gray-800 cursor-pointer"
                    >
                      {price.name}
                    </label>
                    {price.isCompulsory && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Compulsory
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {hasDiscount ? (
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-gray-800">
                            {formatPrice(discountedPrice)}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(price.price)}
                          </p>
                          <p className="text-xs text-green-600 font-medium">
                            Save {formatPrice(price.discountAmount!)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-gray-800">
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
      </div>

      {/* Pricing Summary */}
      {pricingSummary.itemCount > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Pricing Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Selected Items:</span>
              <span className="font-medium">{pricingSummary.itemCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">
                {formatPrice(pricingSummary.subtotal)}
              </span>
            </div>
            {pricingSummary.totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Total Discount:</span>
                <span className="font-medium">
                  -{formatPrice(pricingSummary.totalDiscount)}
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-blue-600">
              <span>Total:</span>
              <span>{formatPrice(pricingSummary.finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              // Navigate to payment page
              window.location.href = `/services/${
                window.location.pathname.split("/")[2]
              }/${window.location.pathname.split("/")[3]}/payment`;
            }}
            className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicePricing;
