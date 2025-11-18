"use client";

import { ApiServicePrice } from "@/types/api/services";

interface DynamicServicePricingProps {
  prices: ApiServicePrice[];
  serviceName: string;
}

const DynamicServicePricing = ({ prices, serviceName }: DynamicServicePricingProps) => {
  if (!prices || prices.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscountedPrice = (originalPrice: number, discountAmount: number | null) => {
    if (!discountAmount) return originalPrice;
    return Math.max(0, originalPrice - discountAmount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Pricing for {serviceName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prices.map((price) => {
          const discountedPrice = calculateDiscountedPrice(price.price, price.discountAmount || 0);
          const hasDiscount = price.discountAmount && price.discountAmount > 0;

          return (
            <div
              key={price.id}
              className={`border rounded-lg p-6 ${
                price.isCompulsory
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } transition-all duration-300`}
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{price.name}</h4>
                
                {price.isCompulsory && (
                  <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mb-3">
                    Compulsory
                  </span>
                )}

                <div className="mb-4">
                  {hasDiscount ? (
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-800">
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
                    <p className="text-2xl font-bold text-gray-800">
                      {formatPrice(price.price)}
                    </p>
                  )}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Get Started
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicServicePricing;
