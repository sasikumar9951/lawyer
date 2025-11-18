"use client";

import { ServiceContent, ContentBlock } from "@/types/api/services";

interface DynamicServiceContentProps {
  content: ServiceContent | null;
  serviceName: string;
  description?: string | null;
}

const DynamicServiceContent = ({ content, serviceName, description }: DynamicServiceContentProps) => {
  if (!content || !content.blocks || content.blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{serviceName}</h2>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        <div className="text-center text-gray-500 py-8">
          <p>No content available for this service.</p>
        </div>
      </div>
    );
  }

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "text":
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{block.title}</h3>
            <div className="prose max-w-none text-gray-600">
              {block.content.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        );

      case "list":
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{block.title}</h3>
            {block.description && (
              <p className="text-gray-600 mb-4">{block.description}</p>
            )}
            <ul className="space-y-3">
              {block.points.map((point, pIndex) => (
                <li key={pIndex} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "deliverables":
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{block.title}</h3>
            {block.description && (
              <p className="text-gray-600 mb-4">{block.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {block.items.map((item, iIndex) => (
                <div key={iIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {content.blocks.map((block, index) => renderContentBlock(block, index))}
    </div>
  );
};

export default DynamicServiceContent;
