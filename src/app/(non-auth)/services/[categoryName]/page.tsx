import prisma from "@/lib/prisma";
import Navbar from "@/components/non-auth-comp/navbar";
import { ServiceContent } from "@/types/api/services";
import Link from "next/link";
import C1 from "@/components/non-auth-comp/c1";
import Fifth from "@/components/non-auth-comp/fifth";
import C4 from "@/components/non-auth-comp/c4";
import CategoryKnowMore from "@/components/category-know-more";
import Tenth from "@/components/non-auth-comp/tenth";

type Params = {
  params: Promise<{
    categoryName: string;
  }>;
};

const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

const computePricingSummary = (
  price: { price: number; discountAmount: number | null; isCompulsory: boolean }[]
) => {
  const compulsory = price.filter((p) => p.isCompulsory);
  if (compulsory.length === 0) {
    return null;
  }
  const mrp = compulsory.reduce((sum, p) => sum + p.price, 0);
  const discounted = compulsory.reduce(
    (sum, p) => sum + (p.price - (p.discountAmount || 0)),
    0
  );
  const discountPercent = mrp > 0 ? Math.round(((mrp - discounted) / mrp) * 100) : 0;
  return { mrp, discounted, discountPercent };
};

export default async function CategoryPage({ params }: Params) {
  const { categoryName } = await params;

  const category = await prisma.serviceCategory.findFirst({
    where: { slug: categoryName },
    select: { id: true, name: true, slug: true },
  });

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      category: { slug: categoryName },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      contentJson: true,
      category: { select: { slug: true, name: true } },
      price: {
        select: {
          price: true,
          discountAmount: true,
          isCompulsory: true,
        },
      },
      faqs: {
        select: { question: true, answer: true },
        take: 6,
      },
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Full-width hero directly under navbar with fixed height */}
      <div className="w-full h-[500px] lg:h-[600px]">
        <C1 title="Services" breadcrumbLabel="Services" />
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-6 mt-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {category?.name || "Services"}
              </h1>
              <p className="text-gray-600 mt-2">
                Choose from curated legal services under this category.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
              {services.map((service) => {
                const pricing = computePricingSummary(service.price);

                const content = (service.contentJson as ServiceContent | null) || null;
                const deliverables = content?.blocks?.find((b) => (b as any).type === "deliverables") as
                  | { type: string; items?: string[] }
                  | undefined;
                const items = deliverables?.items && deliverables.items.length > 0
                  ? deliverables.items
                  : service.faqs.map((f) => f.question).slice(0, 6);

                return (
                  <div key={service.id} className="h-full border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-4 max-h-16 overflow-hidden">
                        {service.description}
                      </p>
                    )}
                    {pricing ? (
                      <div className="mb-4">
                        <div className="text-2xl font-extrabold text-gray-900">
                          {formatCurrency(pricing.discounted)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through mr-2">{formatCurrency(pricing.mrp)}</span>
                          <span className="text-emerald-600 font-semibold">{pricing.discountPercent}% Off</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 text-gray-700">Pricing available inside</div>
                    )}

                    <ul className="space-y-2 mb-6">
                      {items.slice(0, 6).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-emerald-500 mt-1">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <CategoryKnowMore href={`/services/${service.category.slug}/${service.slug}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Fifth />
        </div>
      </main>

      {/* Full-width CTA/footer block at bottom */}
      <Tenth />
    </div>
  );
}