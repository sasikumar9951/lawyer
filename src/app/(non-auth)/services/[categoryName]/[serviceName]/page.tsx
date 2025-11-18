import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ServiceContent } from "@/types/api/services";
import S1 from "@/components/non-auth-comp/(services)/s1";
import Partner from "@/components/non-auth-comp/(services)/partner";
import CompanyFormationWithPayment from "@/components/non-auth-comp/(services)/company-formation-with-payment";
import Faq from "@/components/non-auth-comp/faq";
import S2 from "@/components/non-auth-comp/(services)/s2";
import S3 from "@/components/non-auth-comp/(services)/s3";
import S4 from "@/components/non-auth-comp/(services)/s4";
import Navbar from "@/components/non-auth-comp/navbar";
import C4 from "@/components/non-auth-comp/c4";
import Tenth from "@/components/non-auth-comp/tenth";

type Params = {
  params: Promise<{
    categoryName: string;
    serviceName: string;
  }>;
};

export default async function ServiceDetailPage({ params }: Params) {
  const { categoryName, serviceName } = await params;

  if (!categoryName || !serviceName) {
    notFound();
  }

  const service = await prisma.service.findFirst({
    where: {
      slug: serviceName,
      category: {
        slug: categoryName,
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
      contentJson: true,
      categoryName: true,
      formId: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      form: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      faqs: {
        select: {
          id: true,
          serviceId: true,
          question: true,
          answer: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      price: {
        select: {
          id: true,
          serviceId: true,
          name: true,
          price: true,
          discountAmount: true,
          isCompulsory: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      rating: {
        select: {
          id: true,
          serviceId: true,
          rating: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      _count: {
        select: {
          cases: true,
          rating: true,
        },
      },
    },
  });

  // Get average rating
  const averageRating = await prisma.serviceRating.aggregate({
    where: {
      serviceId: service?.id,
    },
    _avg: {
      rating: true,
    },
  });

  if (!service) {
    notFound();
  }

  // Transform the data to match the expected format for the components
  const typedContentJson =
    service.contentJson as unknown as ServiceContent | null;
  const { _count, ...serviceWithoutCount } = service;
  const transformedServiceData = {
    ...serviceWithoutCount,
    averageRating: Number((averageRating._avg.rating ?? 0).toFixed(1)),
    reviewCount: _count.rating,
    customerCount: _count.cases,
    contentJson: typedContentJson ?? undefined,
    // Transform price array to pricingComponents
    pricingComponents:
      service.price?.map((price) => ({
        name: price.name,
        basePrice: price.price,
        discountAmount: price.discountAmount || 0,
        isCompulsory: price.isCompulsory || false,
      })) || [],
    // Transform contentJson.blocks to contentSections
    contentSections:
      typedContentJson?.blocks?.filter(
        (block) => block.type !== "deliverables"
      ) || [],
    // Extract deliverables from contentJson.blocks
    deliverables:
      typedContentJson?.blocks?.find(
        (block) => block.type === "deliverables"
      ) || null,
    // Keep original faqs
    faqs: service.faqs.map((faq) => ({
      id: faq.id,
      serviceId: faq.serviceId,
      question: faq.question,
      answer: faq.answer,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString(),
    })),
    // Transform dates to strings
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    category: {
      id: service.category.id,
      name: service.category.name,
      slug: service.category.slug,
      createdAt: service.category.createdAt.toISOString(),
      updatedAt: service.category.updatedAt.toISOString(),
    },
    price: service.price.map((price) => ({
      id: price.id,
      serviceId: price.serviceId,
      name: price.name,
      price: price.price,
      discountAmount: price.discountAmount,
      isCompulsory: price.isCompulsory,
      createdAt: price.createdAt.toISOString(),
      updatedAt: price.updatedAt.toISOString(),
    })),
    rating: service.rating.map((rating) => ({
      id: rating.id,
      serviceId: rating.serviceId,
      rating: rating.rating,
      createdAt: rating.createdAt.toISOString(),
      updatedAt: rating.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="pt-20 sm:pt-24 lg:pt-28 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* S1 Component - Business Partnership Section */}
          <S1 />

          {/* Partner and Company Formation Section */}
          <div className="py-6 sm:py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Side - Partner Component + FAQ + Carousel (Scrollable) */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                <Partner serviceData={transformedServiceData} />
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <Faq serviceData={transformedServiceData} />
                </div>
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <S2 />
                </div>
                {/* <div className="bg-white rounded-lg shadow-xl p-6">
                  <S4 />
                </div> */}
              </div>

              {/* Right Side - Company Formation Component (Sticky on desktop) */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-28">
                  <CompanyFormationWithPayment
                    serviceData={transformedServiceData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* S3 Component - Recommended Products Section */}
          {/* <div className="pb-6 sm:pb-8 lg:pb-12">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <S3 />
            </div>
          </div> */}
        </div>
      </div>

      {/* Responsive Footer */}
      <Tenth />
    </div>
  );
}
