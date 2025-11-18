"use client";

import { useEffect, useMemo, useState } from "react";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type {
  EnhancedSurveyResponse,
  SurveyPageInfo,
  SurveyPanelInfo,
  DetailedQuestionResponse,
  QuestionChoice,
  FormSchemaJson,
} from "@/types/api/forms";

const Page = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [json, setJson] = useState<FormSchemaJson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/admin/forms/${params.id}`);
      const data = await res.json();
      setJson(data.schemaJson || {});
      setIsLoading(false);
    };
    run();
  }, [params.id]);

  const model = useMemo(() => {
    const surveyModel = new Model(json || {});

    // Set up onComplete event handler
    surveyModel.onComplete.add(async (sender) => {
      setIsSubmitting(true);
      try {
        // Create enhanced response data with full context
        const enhancedResponse = createEnhancedResponseData(sender, json);

        await fetch(`/api/admin/forms/${params.id}/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawJson: enhancedResponse }),
        });
        router.push(`/admin/forms/${params.id}/responses`);
      } finally {
        setIsSubmitting(false);
      }
    });

    return surveyModel;
  }, [json, params.id, router]);

  const handleManualSubmit = async () => {
    // Validate survey before submitting
    if (model.hasErrors()) {
      alert("Please fill in all required fields");
      return;
    }

    // Trigger the survey completion
    model.completeLastPage();
  };

  // Helper function to create enhanced response data with full context
  const createEnhancedResponseData = (
    surveyModel: Model,
    surveySchema: FormSchemaJson
  ): EnhancedSurveyResponse => {
    const responses: DetailedQuestionResponse[] = [];
    const surveyData = surveyModel.data;

    // Get all questions from the survey
    const allQuestions = surveyModel.getAllQuestions();

    // Process each question to get detailed context
    allQuestions.forEach((question: any) => {
      const questionName: string = question.name;
      const questionValue = surveyData[questionName];

      // Skip if no response for this question
      if (
        questionValue === undefined ||
        questionValue === null ||
        questionValue === ""
      ) {
        return;
      }

      // Find the page this question belongs to
      let questionPage: SurveyPageInfo | null = null;
      let questionPanel: SurveyPanelInfo | null = null;

      // Get page information
      surveyModel.pages.forEach((page: any, pageIndex: number) => {
        const foundInPage = findQuestionInElements(page.elements, questionName);
        if (foundInPage.found) {
          questionPage = {
            name: page.name,
            title: page.title || page.name,
            index: pageIndex,
            description: page.description,
          };
          questionPanel = foundInPage.panel || null;
        }
      });

      const choices: QuestionChoice[] | undefined = question.choices
        ? question.choices.map((c: any) => ({
            value: c.value,
            text: c.text,
          }))
        : undefined;

      responses.push({
        questionName,
        questionTitle: question.title || questionName,
        questionType: question.getType(),
        value: questionValue,
        displayValue: question.displayValue || String(questionValue),
        page: questionPage,
        panel: questionPanel,
        isRequired: Boolean(question.isRequired),
        choices,
        metadata: {
          questionIndex: question.visibleIndex || 0,
          hasComment: Boolean(question.hasComment),
          hasOther: Boolean(question.hasOther),
          inputType: question.inputType,
          placeholder: question.placeholder,
        },
      });
    });

    return {
      // Survey metadata
      surveyInfo: {
        title: (surveySchema as any)?.title,
        description: (surveySchema as any)?.description,
        logoPosition: (surveySchema as any)?.logoPosition,
        completedHtml: (surveySchema as any)?.completedHtml,
        totalPages: surveyModel.pages.length,
        totalQuestions: allQuestions.length,
        completedAt: new Date().toISOString(),
      },
      // Original simple response data (for backward compatibility)
      simpleData: surveyData,
      // Enhanced response data with full context
      detailedResponses: responses,
      // Full survey schema (for complete context)
      surveySchema: surveySchema,
    };
  };

  // Helper function to find a question in elements array (handles nested panels)
  const findQuestionInElements = (
    elements: any[],
    questionName: string
  ): { found: boolean; panel?: SurveyPanelInfo } => {
    for (const element of elements) {
      if (element.name === questionName) {
        return { found: true };
      }

      // Check if this element is a panel with nested elements
      if (element.type === "panel" && element.elements) {
        const foundInPanel = findQuestionInElements(
          element.elements,
          questionName
        );
        if (foundInPanel.found) {
          return {
            found: true,
            panel: {
              name: element.name,
              title: element.title || element.name,
              description: element.description,
            },
          };
        }
      }

      // Check if this element has nested elements (like matrix questions)
      if (element.elements) {
        const foundInNested = findQuestionInElements(
          element.elements,
          questionName
        );
        if (foundInNested.found) {
          return foundInNested;
        }
      }
    }
    return { found: false };
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Preview</h1>
        <Button variant="secondary" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <Survey model={model} />
      <div className="flex justify-end">
        <Button
          onClick={handleManualSubmit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-label="Submit response"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
