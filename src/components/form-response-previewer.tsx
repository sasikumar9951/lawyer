"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FormResponsePreviewerProps {
  formResponse: any;
}

export default function FormResponsePreviewer({
  formResponse,
}: FormResponsePreviewerProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleToggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (!formResponse || !formResponse.rawJson) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Response</CardTitle>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              onClick={handleToggleCollapse}
              aria-expanded={!isCollapsed}
              aria-controls="form-response-card-content"
            >
              {isCollapsed ? (
                <span className="flex items-center gap-1">
                  <ChevronDown className="w-4 h-4" /> Expand
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ChevronUp className="w-4 h-4" /> Collapse
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent id="form-response-card-content">
            <p className="text-gray-500">No form response data available</p>
          </CardContent>
        )}
      </Card>
    );
  }

  const { surveyInfo, simpleData, detailedResponses, surveySchema } =
    formResponse.rawJson;

  const renderSimpleData = () => {
    return (
      <div className="space-y-4">
        {Object.entries(simpleData || {}).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{key}</h4>
              <Badge variant="outline" className="text-xs">
                {typeof value}
              </Badge>
            </div>
            <p className="text-gray-700">
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : String(value || "No value")}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderDetailedResponses = () => {
    return (
      <div className="space-y-6">
        {detailedResponses?.map((response: any, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {response.questionTitle || response.questionName}
                </h4>
                <p className="text-sm text-gray-500">
                  Question Type: {response.questionType}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {response.isRequired && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {response.questionType}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Answer:{" "}
                </span>
                <span className="text-gray-900">
                  {response.displayValue || response.value || "No answer"}
                </span>
              </div>

              {response.choices && response.choices.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Options:{" "}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {response.choices.map(
                      (choice: any, choiceIndex: number) => (
                        <Badge
                          key={choiceIndex}
                          variant={
                            choice.value === response.value
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {choice.text}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {response.page && (
                <div className="text-xs text-gray-500 mt-2">
                  Page: {response.page.title || response.page.name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSurveyInfo = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Survey Title
            </label>
            <p className="text-gray-900">{surveyInfo?.title || "Untitled"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <p className="text-gray-900">
              {surveyInfo?.description || "No description"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Pages
            </label>
            <p className="text-gray-900">{surveyInfo?.totalPages || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Questions
            </label>
            <p className="text-gray-900">{surveyInfo?.totalQuestions || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Completed At
            </label>
            <p className="text-gray-900">
              {surveyInfo?.completedAt
                ? new Date(surveyInfo.completedAt).toLocaleString()
                : "Unknown"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Position
            </label>
            <p className="text-gray-900">
              {surveyInfo?.logoPosition || "Default"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderRawJson = () => {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(formResponse.rawJson, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Form Response</CardTitle>
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2"
            onClick={handleToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-controls="form-response-card-content"
          >
            {isCollapsed ? (
              <span className="flex items-center gap-1">
                <ChevronDown className="w-4 h-4" /> Expand
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ChevronUp className="w-4 h-4" /> Collapse
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent id="form-response-card-content">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              {/** <TabsTrigger value="info">Survey Info</TabsTrigger> */}
              {/** <TabsTrigger value="raw">Raw JSON</TabsTrigger> */}
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <div className="h-72 overflow-x-auto overflow-y-auto">
                <div className="min-w-[1200px]">{renderSimpleData()}</div>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="mt-4">
              <div className="h-72 overflow-x-auto overflow-y-auto">
                <div className="min-w-[1200px]">
                  {renderDetailedResponses()}
                </div>
              </div>
            </TabsContent>

            {/**
            <TabsContent value="info" className="mt-4">
              {renderSurveyInfo()}
            </TabsContent>
            */}

            {/**
            <TabsContent value="raw" className="mt-4">
              {renderRawJson()}
            </TabsContent>
            */}
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
