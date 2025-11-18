import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ApiService } from "@/types/api/services";

type PartnerServiceData = ApiService & {
  averageRating?: number;
  reviewCount?: number;
  customerCount?: number;
  contentSections?: any;
};

const Partner = ({ serviceData }: { serviceData?: PartnerServiceData }) => {
  const computedAverage = (() => {
    if (typeof serviceData?.averageRating === "number")
      return serviceData.averageRating;
    if (serviceData?.rating && serviceData.rating.length > 0) {
      const sum = serviceData.rating.reduce((acc, r) => acc + r.rating, 0);
      return sum / serviceData.rating.length;
    }
    return 0;
  })();

  const displayAverage = Number(computedAverage.toFixed(1));
  const filledStars = Math.max(0, Math.min(5, Math.round(computedAverage)));
  const reviewsCount =
    serviceData?.reviewCount ?? serviceData?.rating?.length ?? 0;
  const customersCount = serviceData?.customerCount ?? 0;
  return (
    <div className="space-y-8">
      {/* Header: Reviews + Title/Description */}
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="bg-gray-100 rounded-lg p-6 md:min-w-[220px]">
            <div className="text-4xl font-bold text-gray-700">
              {displayAverage}
            </div>
            <div className="flex items-center space-x-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < filledStars ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              ({reviewsCount} reviews)
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {customersCount} People purchased
              </span>
            </div>
          </div>

          {/* Title and description - 60% width on md+ */}
          <div className="flex-1 md:w-3/5">
            <h1 className="text-2xl md:text-3xl font-bold text-green-600">
              {serviceData ? serviceData.name : "PARTNERSHIP FIRM"}
            </h1>
            {serviceData && serviceData.description && (
              <div className="text-sm md:text-base text-gray-700 mt-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  disallowedElements={["img"]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl md:text-3xl font-bold"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl md:text-2xl font-semibold"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg md:text-xl font-semibold"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-gray-700 mb-2" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 space-y-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 space-y-1" {...props} />
                    ),
                    li: ({ node, ...props }) => <li {...props} />,
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 pl-4 text-gray-600"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          className="px-1 py-0.5 bg-gray-100 rounded"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block p-3 bg-gray-100 rounded overflow-x-auto"
                          {...props}
                        />
                      ),
                  }}
                >
                  {serviceData.description}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-center mb-2">
              Choose your required Product & Pay
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Choose any product or combine two to get more discount
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-center mb-2">
              Fill required details
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Fill your details on success page & upload the documents (as
              necessary)
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-center mb-2">
              Receive updates on SMS & WhatsApp
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Receive update messages on whatsapp & sms on your requested
              product progress
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-center mb-2">
              Delivery of your product
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Be it consultation, drafting or registration. Get the delivery in
              promised time
            </p>
          </div>
        </div>
      </div>

      {/* Service Title and Description (fallback default copy) */}
      {/* {!serviceData?.description && (
        <div className="bg-white rounded-lg shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What is a Partnership Firm?
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              "Partnership" is the relation between two or more persons who have
              agreed to share the profits of a business carried on by all or any
              of them acting for all. Two or more parties come together with a
              formal agreement (known as Partnership Deed) where the roles,
              duties and the share of each partner is clearly defined. These
              persons are called "PARTNERS" and collectively a "FIRM". The
              partners share the risks and responsibilities of running the
              business.
            </p>
            <p>
              Partnership in India is governed by the Indian Partnership Act,
              1932. The Act provides the structure and provisions for running a
              partnership firm. Both registered and unregistered partnership
              firms are valid in India.
            </p>
          </div>
        </div>
      )} */}

      {/* Business Handshake Image */}
      <div className="mt-6 bg-white rounded-lg shadow-2xl p-4">
        <img
          src="/img1.webp"
          alt="Business Partnership Handshake"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      {/* Content Sections */}
      {serviceData &&
        serviceData.contentSections &&
        serviceData.contentSections.length > 0 && (
          <div className="space-y-6">
            {serviceData.contentSections.map((section: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {section.title}
                </h2>
                {section.type === "list" ? (
                  <div className="space-y-3">
                    {section.description && (
                      <p className="text-gray-700 mb-4">
                        {section.description}
                      </p>
                    )}
                    {section.points &&
                      section.points.map(
                        (point: string, pointIndex: number) => (
                          <div
                            key={pointIndex}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-700">{point}</span>
                          </div>
                        )
                      )}
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-700">
                    <p>{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Partner;
