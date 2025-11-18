"use client";

import React, { useMemo } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

interface SurveyResponseViewerProps {
  response: any; // Survey response data
  className?: string;
}

const SurveyResponseViewer: React.FC<SurveyResponseViewerProps> = ({
  response,
  className = "",
}) => {
  const surveyModel = useMemo(() => {
    // Create survey model from the stored schema
    const model = new Model(response.surveySchema || response);

    // Set the response data
    model.data = response.simpleData || response;

    // Make all questions read-only
    const allVisibleQuestions = model.getAllQuestions(true);
    allVisibleQuestions.forEach((q) => {
      q.readOnly = true;
    });

    // Configure for review mode - keep navigation but disable completion
    model.showNavigationButtons = true;
    model.showCompletedPage = false;
    model.showPreviewBeforeComplete = "never";
    model.mode = "display"; // Set to display mode for better review experience

    // Show progress bar for multi-page surveys
    if (model.pages.length > 1) {
      model.showProgressBar = "top";
      model.progressBarType = "pages";
    }

    // Custom navigation button text for review mode
    model.pageNextText = "Next Page";
    model.pagePrevText = "Previous Page";
    model.completeText = "Review Complete";

    // Show page numbers
    model.showPageNumbers = true;
    model.showQuestionNumbers = "on";

    // Disable the complete button functionality
    model.onComplete.clear();
    model.onComplete.add((sender) => {
      // Do nothing on complete - just stay on the survey
      console.log("Survey review completed");
    });

    return model;
  }, [response]);

  if (
    !response ||
    (typeof response === "object" && Object.keys(response).length === 0)
  ) {
    return (
      <div className={`p-4 border rounded-lg bg-yellow-50 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-yellow-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm text-yellow-800 font-medium">
              Unable to display survey view
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              No response data available
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600 text-xs">
                Show raw data
              </summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Survey Display */}
      <div className="border rounded-lg overflow-hidden">
        <Survey model={surveyModel} />
      </div>
    </div>
  );
};

export default SurveyResponseViewer;
