"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

interface LawyerRegistrationFormRendererProps {
  schema: any;
  onComplete: (result: any) => void;
  onPartialSend?: (result: any) => void;
  isSubmitting?: boolean;
}

export default function LawyerRegistrationFormRenderer({
  schema,
  onComplete,
  onPartialSend,
  isSubmitting = false,
}: LawyerRegistrationFormRendererProps) {
  const [isSurveyReady, setIsSurveyReady] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const surveyRef = useRef<Model | null>(null);

  // Create survey model immediately when schema changes
  const surveyModel = useMemo(() => {
    if (!schema) return null;

    const survey = new Model(schema);

    // Configure survey settings
    survey.showCompletedPage = false;
    survey.showProgressBar = "bottom";
    survey.showQuestionNumbers = "off";
    survey.showNavigationButtons = true;
    survey.allowCompleteSurveyAutomatic = false;
    survey.completeText = isSubmitting
      ? "Submitting..."
      : "Complete Registration";
    survey.clearInvisibleValues = "onHidden";
    survey.checkErrorsMode = "onValueChanged";

    // Handle complete event
    survey.onComplete.add((sender, options) => {
      console.log("Lawyer registration form completed! Data:", sender.data);
      console.log("All questions:", sender.getAllQuestions());

      const result = {
        surveyInfo: {
          title: schema.title || "Lawyer Registration",
          description: schema.description || "",
          logoPosition: schema.logoPosition || "left",
          totalPages: sender.pageCount,
          totalQuestions: sender.questionCount,
          completedAt: new Date().toISOString(),
        },
        simpleData: sender.data,
        detailedResponses: sender.getAllQuestions().map((question, index) => ({
          questionName: question.name,
          questionTitle: question.title || question.name,
          questionType: question.getType(),
          value: question.value,
          displayValue: question.displayValue || question.value,
          page: {
            name: question.page?.name || "",
            title: question.page?.name || "",
            index: 0,
            description: "",
          },
          panel: null,
          isRequired: question.isRequired,
          choices: question.choices?.map((choice: any) => ({
            value: choice.value,
            text: choice.text,
          })),
          metadata: {
            questionIndex: index,
            hasComment: question.hasComment || false,
            hasOther: question.hasOther || false,
            inputType: question.inputType,
            placeholder: question.placeholder,
          },
        })),
        surveySchema: schema,
      };

      console.log("Formatted result:", result);
      setIsFormSubmitted(true);
      onComplete(result);
    });

    // Handle partial send if needed
    if (onPartialSend) {
      survey.onPartialSend.add((sender, options) => {
        onPartialSend(sender.data);
      });
    }

    surveyRef.current = survey;
    return survey;
  }, [schema, onComplete, onPartialSend, isSubmitting]);

  // Update complete button text when submitting state changes
  useEffect(() => {
    if (surveyRef.current) {
      surveyRef.current.completeText = isSubmitting
        ? "Submitting..."
        : "Complete Registration";
    }
  }, [isSubmitting]);

  // Reset form submission state when schema changes
  useEffect(() => {
    setIsFormSubmitted(false);
  }, [schema]);

  // Set survey as ready after a brief delay to ensure proper initialization
  useEffect(() => {
    if (surveyModel) {
      // Use a minimal delay to ensure the survey is properly initialized
      const timer = setTimeout(() => {
        setIsSurveyReady(true);
      }, 10); // Very short delay to ensure proper initialization

      return () => clearTimeout(timer);
    }
  }, [surveyModel]);

  if (!schema) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No registration form schema available</p>
      </div>
    );
  }

  if (!isSurveyReady || !surveyModel) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-2"></div>
        <span className="text-gray-600 text-sm">
          Preparing registration form...
        </span>
      </div>
    );
  }

  return (
    <div className="survey-container" style={{ background: "white" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
           .survey-container {
             background: white !important;
           }
           .survey-container .sd-root-modern {
             background: white !important;
           }
           .survey-container .sd-container-modern {
             background: white !important;
           }
           .survey-container .sd-page {
             background: white !important;
           }
           .survey-container .sd-body {
             background: white !important;
           }
           .survey-container .sd-element {
             background: white !important;
           }
           .survey-container .sd-question {
             background: white !important;
           }
           .survey-container .sd-panel {
             background: white !important;
           }
           .survey-container .sd-title {
             background: white !important;
             color: black !important;
           }
           .survey-container .sd-description {
             background: white !important;
             color: black !important;
           }
           .survey-container .sd-input {
             background: white !important;
             color: black !important;
           }
           .survey-container .sd-selectbase {
             background: white !important;
           }
           .survey-container .sd-item {
             background: white !important;
             color: black !important;
           }
           .survey-container .sd-progress {
             background: white !important;
           }
           .survey-container .survey-container .sd-navigation {
             background: white !important;
           }
           .survey-container .sd-btn {
             background: #3b82f6 !important;
             color: white !important;
             border: none !important;
             padding: 0.75rem 1.5rem !important;
             border-radius: 0.375rem !important;
             font-weight: 500 !important;
             cursor: pointer !important;
             transition: background-color 0.2s !important;
           }
           .survey-container .sd-btn:hover {
             background: #2563eb !important;
           }
           .survey-container .sd-btn:disabled {
             background: #9ca3af !important;
             cursor: not-allowed !important;
           }
           .survey-container .sd-root-modern .sd-container-modern {
             background: white !important;
           }
           .survey-container .sd-root-modern .sd-page {
             background: white !important;
           }
           .survey-container .sd-root-modern .sd-body {
             background: white !important;
           }
           
           /* Ensure all text is black */
           .survey-container * {
             color: black !important;
           }
           
           /* Override button text to be white */
           .survey-container .sd-btn,
           .survey-container .sd-btn * {
             color: white !important;
           }
           
           /* Input styling with shadows */
           .survey-container .sd-input {
             box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
             border: 1px solid #e5e7eb !important;
             border-radius: 0.375rem !important;
             color: black !important;
           }
           
           .survey-container .sd-input:focus {
             box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
             border-color: #3b82f6 !important;
             outline: none !important;
           }
           
           /* Radio button and checkbox styling */
           .survey-container .sd-selectbase .sd-item {
             box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
             border: 1px solid #e5e7eb !important;
             border-radius: 0.375rem !important;
             padding: 0.75rem !important;
             margin: 0.25rem 0 !important;
             color: black !important;
           }
           
           .survey-container .sd-selectbase .sd-item:hover {
             box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
           }
           
           .survey-container .sd-selectbase .sd-item.sd-item--checked {
             box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
             border-color: #3b82f6 !important;
           }
         `,
        }}
      />
      <Survey className="bg-white" model={surveyModel} />
    </div>
  );
}
