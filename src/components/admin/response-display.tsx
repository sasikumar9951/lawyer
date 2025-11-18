"use client";

import React from "react";
import type {
  EnhancedSurveyResponse,
  DetailedQuestionResponse,
} from "@/types/api/forms";

interface ResponseDisplayProps {
  response: EnhancedSurveyResponse;
  className?: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
  className = "",
}) => {
  const formatQuestionValue = (questionResponse: DetailedQuestionResponse) => {
    const { questionType, value, choices } = questionResponse;

    switch (questionType) {
      case "rating":
        const ratingValue = Number(value);
        if (!isNaN(ratingValue)) {
          return (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < ratingValue ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({ratingValue}/5)
              </span>
            </div>
          );
        }
        break;

      case "boolean":
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              value === true || value === "true"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value === true || value === "true" ? "Yes" : "No"}
          </span>
        );

      case "radiogroup":
      case "dropdown":
        const selectedChoice = choices?.find((c) => c.value === value);
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {selectedChoice?.text || String(value)}
          </span>
        );

      case "checkbox":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {(value as unknown[]).map((val, idx) => {
                const choice = choices?.find((c) => c.value === val);
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {choice?.text || String(val)}
                  </span>
                );
              })}
            </div>
          );
        }
        break;

      case "text":
      case "comment":
        const textValue = String(value);
        if (textValue.length > 100) {
          return (
            <div className="space-y-2">
              <p className="text-sm">{textValue.substring(0, 100)}...</p>
              <details className="text-xs">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Show full text
                </summary>
                <p className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  {textValue}
                </p>
              </details>
            </div>
          );
        }
        return <p className="text-sm">{textValue}</p>;

      case "file":
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-1">
              {(value as any[]).map((file, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs"
                >
                  📎 {file.name || "File"}
                </div>
              ))}
            </div>
          );
        }
        break;

      case "imagepicker":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-2">
              {(value as string[]).map((imgValue, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs"
                >
                  🖼️ {imgValue}
                </div>
              ))}
            </div>
          );
        }
        break;

      default:
        // Handle dates
        const dateValue = String(value);
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const date = new Date(dateValue);
          return (
            <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
              📅 {date.toLocaleDateString()}
            </span>
          );
        }

        // Handle date-time
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
          const date = new Date(dateValue);
          return (
            <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
              📅 {date.toLocaleString()}
            </span>
          );
        }

        // Default text display
        return <span className="text-sm">{String(value)}</span>;
    }

    return <span className="text-sm">{String(value)}</span>;
  };

  const groupResponsesByPage = () => {
    const pageGroups: Record<string, DetailedQuestionResponse[]> = {};

    response.detailedResponses.forEach((questionResponse) => {
      const pageKey = questionResponse.page
        ? `${questionResponse.page.title || questionResponse.page.name} (Page ${
            questionResponse.page.index + 1
          })`
        : "Unknown Page";

      if (!pageGroups[pageKey]) {
        pageGroups[pageKey] = [];
      }
      pageGroups[pageKey].push(questionResponse);
    });

    return pageGroups;
  };

  if (!response.detailedResponses || response.detailedResponses.length === 0) {
    return (
      <div className={`p-4 border rounded-lg bg-gray-50 ${className}`}>
        <p className="text-sm text-gray-500">No responses found</p>
        {response.simpleData && Object.keys(response.simpleData).length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600 text-xs">
              Show raw data
            </summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(response.simpleData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  const pageGroups = groupResponsesByPage();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Survey Info Header */}
      {response.surveyInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg text-gray-900">
            {response.surveyInfo.title || "Survey Response"}
          </h3>
          {response.surveyInfo.description && (
            <p className="text-sm text-gray-600 mt-1">
              {response.surveyInfo.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>📊 {response.surveyInfo.totalQuestions} questions</span>
            <span>📄 {response.surveyInfo.totalPages} pages</span>
            <span>
              ⏰ Completed:{" "}
              {new Date(response.surveyInfo.completedAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Responses by Page */}
      {Object.entries(pageGroups).map(([pageTitle, questions]) => (
        <div key={pageTitle} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h4 className="font-medium text-gray-900">{pageTitle}</h4>
          </div>
          <div className="p-4 space-y-4">
            {questions.map((questionResponse, idx) => (
              <div key={idx} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">
                      {questionResponse.questionTitle}
                    </h5>

                    {/* Question metadata */}
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {questionResponse.questionType}
                      </span>
                      {questionResponse.panel && (
                        <span className="bg-blue-100 px-2 py-1 rounded">
                          📁{" "}
                          {questionResponse.panel.title ||
                            questionResponse.panel.name}
                        </span>
                      )}
                      {questionResponse.isRequired && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>

                    {/* Formatted answer */}
                    <div className="mt-2">
                      {formatQuestionValue(questionResponse)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResponseDisplay;
