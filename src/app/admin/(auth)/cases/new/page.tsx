"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SearchableSelect, {
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

import { GetLawyersResponse, LawyerResponse } from "@/types/api/lawyers";
import { ApiService, ServicesResponse } from "@/types/api/services";
import { ApiForm } from "@/types/api/forms";
import SurveyFormRenderer from "@/components/survey-form-renderer";
import { CreateCaseRequest, CaseResponse } from "@/types/api/cases";

const schema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Enter a valid email"),
  customerPhone: z.string().min(7, "Enter a valid phone"),
  serviceId: z.string().min(1, "Service is required"),
  lawyerId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminAddCasePage() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState<LawyerResponse[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serviceForm, setServiceForm] = useState<ApiForm | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: "",
      lawyerId: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [lawyersRes, servicesRes] = await Promise.all([
          fetch("/api/admin/lawyers"),
          fetch("/api/admin/services"),
        ]);

        if (lawyersRes.ok) {
          const data: GetLawyersResponse = await lawyersRes.json();
          setLawyers(data.lawyers || []);
        }
        if (servicesRes.ok) {
          const data: ServicesResponse = await servicesRes.json();
          setServices(data.data || []);
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const fetchFormForService = async () => {
      setServiceForm(null);
      setFormData(null);
      const serviceId = form.getValues("serviceId");
      if (!serviceId) {
        setFormLoading(false);
        return;
      }
      try {
        setFormLoading(true);
        const res = await fetch(`/api/admin/services/${serviceId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.data?.form) {
          const formInfo = data.data.form as ApiForm | null;
          if (formInfo) {
            // Fetch full form with schema if needed
            const formRes = await fetch(`/api/admin/forms/${formInfo.id}`);
            if (formRes.ok) {
              const fullForm: ApiForm = await formRes.json();
              setServiceForm(fullForm);
            }
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setFormLoading(false);
      }
    };

    const subscription = form.watch((values, { name }) => {
      if (name === "serviceId") {
        fetchFormForService();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const selectedServiceId = form.watch("serviceId");

  const lawyerOptions: SearchableSelectOption[] = useMemo(
    () =>
      lawyers.map((l) => ({
        value: l.id,
        label: `${l.name} — ${l.email}`,
      })),
    [lawyers]
  );

  const serviceOptions: SearchableSelectOption[] = useMemo(
    () =>
      services.map((s) => ({
        value: s.id,
        label: `${s.name}${s.category ? ` (${s.category.name})` : ""}`,
      })),
    [services]
  );

  const handleSubmitForm = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload: CreateCaseRequest = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        serviceId: values.serviceId,
        lawyerId: values.lawyerId || null,
        formData: formData || undefined,
      };

      const res = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg =
          (await res.json().catch(() => null))?.message ||
          "Failed to create case";
        toast.error(msg);
        return;
      }

      const data: CaseResponse = await res.json();
      toast.success("Case created successfully");
      router.push("/admin/cases");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-blue-50">
      <Card className="border border-blue-100 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Add Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Customer name"
                        {...field}
                        required
                        aria-label="Customer name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Customer email"
                        {...field}
                        required
                        aria-label="Customer email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Customer phone"
                        {...field}
                        required
                        aria-label="Customer phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <SearchableSelect
                      options={serviceOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select service"
                      searchPlaceholder="Search services..."
                      emptyText="No services found"
                      className="w-full"
                      loading={loading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <Card className="border border-blue-100 bg-white/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Service Form</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!selectedServiceId ? (
                      <div className="text-sm text-blue-700">
                        Select a service to load the form.
                      </div>
                    ) : formLoading ? (
                      <div className="text-sm text-blue-700">Loading form…</div>
                    ) : serviceForm?.schemaJson && !formData ? (
                      <SurveyFormRenderer
                        schema={serviceForm.schemaJson as Record<string, any>}
                        onComplete={(result) => {
                          setFormData(result);
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
              </div>
              <FormField
                control={form.control}
                name="lawyerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lawyer (optional)</FormLabel>
                    <SearchableSelect
                      options={lawyerOptions}
                      value={field.value ?? undefined}
                      onValueChange={(v) => field.onChange(v)}
                      placeholder="Select lawyer"
                      searchPlaceholder="Search lawyers..."
                      emptyText="No lawyers found"
                      className="w-full"
                      loading={loading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/cases")}
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    submitting ||
                    formLoading ||
                    !selectedServiceId ||
                    (!!serviceForm?.schemaJson && !formData)
                  }
                  aria-label="Create case"
                  onClick={form.handleSubmit(handleSubmitForm)}
                >
                  {submitting ? "Creating..." : "Create Case"}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
