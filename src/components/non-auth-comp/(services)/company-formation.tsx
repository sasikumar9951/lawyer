"use client";

import { useState } from "react";
import React from "react"; // Added missing import
import { useRouter } from "next/navigation";

const CompanyFormation = ({ serviceData }: { serviceData?: any }) => {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState("");

  // Use service pricing components if available, otherwise use default services
  const services = serviceData && serviceData.pricingComponents && serviceData.pricingComponents.length > 0
    ? serviceData.pricingComponents.map((component: any, index: number) => ({
        id: `component-${index}`,
        name: component.name,
        currentPrice: component.basePrice - (component.discountAmount || 0),
        originalPrice: component.basePrice,
        discount: component.discountAmount || 0,
        discountPercent: component.discountAmount ? Math.round((component.discountAmount / component.basePrice) * 100) : 0,
        isCompulsory: component.isCompulsory
      }))
    : [
        {
          id: "partnership",
          name: "Partnership Firm",
          currentPrice: 9999,
          originalPrice: 13399,
          discount: 3400,
          discountPercent: 25
        },
        {
          id: "gst",
          name: "Gst Registration",
          currentPrice: 3499,
          originalPrice: 7999,
          discount: 4500
        },
        {
          id: "startup",
          name: "Startup India Registration",
          currentPrice: 3999,
          originalPrice: 7999,
          discount: 4000
        },
        {
          id: "msme",
          name: "Msme (udyog Aadhar) Registration",
          currentPrice: 1999,
          originalPrice: 4999,
          discount: 2500
        }
      ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s: any) => s.id === serviceId);
      return total + (service?.currentPrice || 0);
    }, 0);
  };

  const total = calculateTotal();

  const handleRegisterClick = () => {
    if (serviceData && serviceData.category && serviceData.slug) {
      // Navigate to the payment page for this specific service
      router.push(`/services/${serviceData.category.slug}/${serviceData.slug}/payment`);
    } else {
      // Fallback to general services page if no specific service data
      router.push('/services');
    }
  };

  // Set deliverables from service data if available and pre-select compulsory services
  React.useEffect(() => {
    if (serviceData && serviceData.deliverables) {
      const deliverableItems = serviceData.deliverables.items || [];
      const deliverableText = deliverableItems.join('\n• ');
      setDeliverables(deliverableText);
    }

    if (selectedServices.length === 0) {
      const compulsoryServiceIds = services
        .filter((service: any) => service.isCompulsory)
        .map((service: any) => service.id);
      setSelectedServices(compulsoryServiceIds);
    }
  }, [serviceData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {serviceData ? serviceData.name : "Company Formation"}
      </h2>
      
      {/* Services List */}
      <div className="space-y-4 mb-6">
        {services.map((service: any) => (
          <div key={service.id} className="flex items-start justify-between border-b border-gray-200 pb-3">
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={service.isCompulsory}
              />
              <label htmlFor={service.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                {service.name}
                {service.isCompulsory && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">₹{service.currentPrice.toLocaleString()}</div>
              {service.discount > 0 && (
                <div className="text-xs text-red-600">
                  {service.discountPercent && `(${service.discountPercent}% Off) `}
                  ₹{service.discount.toLocaleString()} SAVE
                </div>
              )}
              <div className="text-xs text-gray-400 line-through">₹{service.originalPrice.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gross Total */}
      <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-4">
        <span className="font-semibold text-gray-800">Gross Total</span>
        <span className="text-xl font-bold text-gray-800">₹{total.toLocaleString()}</span>
      </div>

      {/* Deliverables Section */}
      {serviceData && serviceData.deliverables && (
        <div className="mb-6">
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {serviceData.deliverables.title || "Deliverables"}
          </div>
          {serviceData.deliverables.description && (
            <p className="text-sm text-gray-600 mb-2">{serviceData.deliverables.description}</p>
          )}
          <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white whitespace-pre-wrap">
            {deliverables}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
          <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
          <div className="w-8 h-5 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">GP</div>
          <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AE</div>
          <div className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
          <div className="w-8 h-5 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">+</div>
        </div>
      </div>

      {/* Register Button */}
      <button 
        onClick={handleRegisterClick}
        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all duration-300"
      >
        PAY NOW
      </button>
    </div>
  );
};

export default CompanyFormation;
