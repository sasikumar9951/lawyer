"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ApiService, ApiServicePrice } from "@/types/api/services";
import { ApiForm } from "@/types/api/forms";
import { toast } from "sonner";
import ServiceNavbar from "@/components/non-auth-comp/(services)/service-navbar";
import ServiceFooter from "@/components/non-auth-comp/(services)/service-footer";
import PaymentForm from "./payment-form";
import Navbar from "@/components/non-auth-comp/navbar";

export default function PaymentPage() {
  const params = useParams();
  const [service, setService] = useState<ApiService | null>(null);
  const [form, setForm] = useState<ApiForm | null>(null);
  const [selectedPrices, setSelectedPrices] = useState<ApiServicePrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const categoryName = params.categoryName as string;
        const serviceName = params.serviceName as string;

        const response = await fetch(
          `/api/services/${categoryName}/${serviceName}`
        );
        if (!response.ok) throw new Error("Failed to fetch service");

        const data = await response.json();
        console.log("Payment page - Service data:", data.data);
        console.log("Payment page - Form data:", data.data.form);
        setService(data.data);

        // Set form data from service response
        if (data.data.form) {
          setForm(data.data.form);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [params]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ServiceNavbar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
          onMobileMenuClose={handleMobileMenuClose}
        />
        <div className="pt-20 sm:pt-24 lg:pt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading service details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <ServiceNavbar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
          onMobileMenuClose={handleMobileMenuClose}
        />
        <div className="pt-20 sm:pt-24 lg:pt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Service Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The service you're looking for doesn't exist.
              </p>
              <a
                href="/services"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Services
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <ServiceNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        onMobileMenuClose={handleMobileMenuClose}
      /> */}
      <Navbar />

      <div className="pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <a
                  href="/services"
                  className="hover:text-blue-600 transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <a
                  href={`/services/${service.category?.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {service.category?.name}
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <a
                  href={`/services/${params.categoryName}/${params.serviceName}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {service.name}
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-800 font-medium">Payment</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Complete Your Order
            </h1>
            <p className="text-xl text-gray-600">
              Please provide your details and complete the service form to
              proceed with your order.
            </p>
          </div>

          <PaymentForm
            service={service}
            form={form}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
          />
        </div>
      </div>

      <ServiceFooter />
    </div>
  );
}
