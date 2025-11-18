"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import ContactFormRenderer from "@/components/contact-form-renderer";

interface ContactForm {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  schemaJson: any;
  createdAt: string;
  updatedAt: string;
}

// Loading skeleton component
const FormLoadingSkeleton = memo(() => (
  <div className="bg-white/80 rounded-lg p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  </div>
));

FormLoadingSkeleton.displayName = "FormLoadingSkeleton";

// Prefetch function to start loading data immediately
const prefetchContactForm = () => {
  // Start prefetching immediately
  fetch("/api/forms/contact", {
    method: "GET",
    headers: {
      "Cache-Control": "max-age=300",
    },
  }).catch(() => {
    // Silently fail for prefetch
  });
};

const C2 = () => {
  const [contactForm, setContactForm] = useState<ContactForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize the form schema to prevent unnecessary re-renders
  const memoizedSchema = useMemo(() => {
    return contactForm?.schemaJson || null;
  }, [contactForm?.schemaJson]);

  // Fetch contact form with optimized loading
  useEffect(() => {
    const fetchContactForm = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch("/api/forms/contact", {
          signal: controller.signal,
          headers: {
            "Cache-Control": "max-age=300",
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setContactForm(data.data);
          // Set loading to false immediately when we get the data
          setIsLoading(false);
        } else {
          console.error("Failed to fetch contact form");
          setIsLoading(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.error("Request timeout");
        } else {
          console.error("Error fetching contact form:", error);
        }
        setIsLoading(false);
      }
    };

    fetchContactForm();
  }, []);

  // Start prefetching immediately when component mounts
  useEffect(() => {
    prefetchContactForm();
  }, []);

  // Memoize the form completion handler
  const handleFormComplete = useCallback(
    async (result: any) => {
      console.log("Contact form completed:", result);
      setFormData(result);

      setIsSubmitting(true);

      try {
        const response = await fetch("/api/forms/contact/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: contactForm?.id,
            rawJson: result,
          }),
        });

        if (response.ok) {
          toast.success(
            "Contact form submitted successfully! We'll get back to you soon."
          );
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        toast.error("Failed to submit form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [contactForm?.id]
  );

  // Memoize the form renderer component
  const FormRenderer = useMemo(() => {
    if (!memoizedSchema) return null;

    return (
      <div className="bg-white/80 rounded-lg p-6">
        <ContactFormRenderer
          schema={memoizedSchema as Record<string, any>}
          onComplete={handleFormComplete}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }, [memoizedSchema, handleFormComplete, isSubmitting]);

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Container with Dull Golden Background */}
        <div className="relative rounded-3xl bg-gradient-to-br bg-white shadow-2xl p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Sticky Image */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/cbg2.webp"
                  alt="Justice statue"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:pl-4">
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Lora'] mb-4">
                  Contact With Lawyer
                </h2>
                <p className="text-lg text-gray-600">
                  Have a question or need legal assistance? Fill out the form
                  below and we'll get back to you as soon as possible.
                </p>
              </div>

              {isLoading ? (
                <FormLoadingSkeleton />
              ) : contactForm && memoizedSchema ? (
                FormRenderer
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No contact form available at the moment.
                  </p>
                  <p className="text-sm text-gray-400">
                    Please contact us directly using the information below.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(C2);
