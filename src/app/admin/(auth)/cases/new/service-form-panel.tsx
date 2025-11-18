"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SurveyFormRenderer from "@/components/survey-form-renderer";
import { ApiForm } from "@/types/api/forms";
import { toast } from "sonner";

type Props = {
  serviceForm: ApiForm | null;
  formData: any;
  onCompleted: (data: any) => void;
};

const ServiceFormPanel = ({ serviceForm, formData, onCompleted }: Props) => {
  if (!serviceForm) return null;

  return (
    <Card className="border border-blue-100 bg-white/90 backdrop-blur mt-6">
      <CardHeader>
        <CardTitle>Service Form {formData ? "✓" : "(optional)"}</CardTitle>
      </CardHeader>
      <CardContent>
        {serviceForm.schemaJson && !formData ? (
          <SurveyFormRenderer
            schema={serviceForm.schemaJson as Record<string, any>}
            onComplete={(result) => {
              onCompleted(result);
              toast.success("Form completed");
            }}
          />
        ) : formData ? (
          <div className="text-sm text-green-700">
            Form data captured. It will be saved with the case.
          </div>
        ) : (
          <div className="text-sm text-blue-700">
            No form schema available for this service.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceFormPanel;
