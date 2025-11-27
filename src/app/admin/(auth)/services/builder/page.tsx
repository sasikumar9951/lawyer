"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import type { Options as EasyMdeOptions } from "easymde";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ArrowLeft, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BuilderCategoryOption,
  BuilderFormOption,
  ApiService,
  ApiServiceTestimonial,
  ContentBlock,
  ServiceContent,
  DeliverablesContentBlock,
} from "@/types/api/services";
import { generateSlug } from "@/lib/utils";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type PriceStructure = {
  name: string;
  price: number;
  discountAmount?: number;
  isCompulsory: boolean;
};

type FAQ = {
  question: string;
  answer: string;
};

const ServicesBuilderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editServiceId = searchParams.get("edit");
  const isEditMode = !!editServiceId;

  const [categories, setCategories] = useState<BuilderCategoryOption[]>([]);
  const [forms, setForms] = useState<BuilderFormOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFormId, setSelectedFormId] = useState("");
  const [prices, setPrices] = useState<PriceStructure[]>([
    { name: "", price: 0, isCompulsory: false },
  ]);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [contentImage, setContentImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [enableDraftButton, setEnableDraftButton] = useState(true);
  const [enableSpeakButton, setEnableSpeakButton] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: "", answer: "" }]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [deliverables, setDeliverables] = useState<{
    title: string;
    description: string;
    items: string[];
  }>({
    title: "Deliverables",
    description: "",
    items: [""],
  });
  // Testimonials
  const [testimonials, setTestimonials] = useState<ApiServiceTestimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<ApiServiceTestimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    author: "",
    role: "",
    text: "",
    rating: 0,
    isFeatured: false,
  });

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(
      (sub) => sub.categoryName === selectedCategoryName
    );
  }, [subCategories, selectedCategoryName]);

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true); // 1. Get Signed URL

      const res = await fetch("/api/admin/s3/put", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: "service-assets",
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const responseData = await res.json();
      if (!res.ok || !responseData.success) {
        throw new Error("Failed to get upload URL");
      }

      const { signedUrl, s3Path } = responseData.data; // 2. Upload to S3 directly using the signed URL

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload to S3");
      }

      // ============================================================
      // FIX: Constructing the Full URL manually
      // ============================================================
      // Use the correct bucket name and region (from your .env configuration)
      const bucketName = "lawyer-development";
      const region = "ap-south-1";

      // Construct the full S3 URL
      const fullUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Path}`;

      return fullUrl;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const simpleMdeOptions: EasyMdeOptions = useMemo(
    () => ({
      spellChecker: false,
      autofocus: false,
      placeholder: "Write a clear description…",
      toolbar: [
        "heading",
        "bold",
        "italic",
        "strikethrough",
        "|",
        "unordered-list",
        "ordered-list",
        "quote",
        "|",
        "link",
        "code",
        "preview",
        "guide",
      ] as unknown as EasyMdeOptions["toolbar"],
      status: false,
    }),
    []
  );

  const handleServiceDescriptionChange = useCallback(
    (value: string) => setServiceDescription(value),
    []
  );

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/services/builder-data");
      const data = await response.json();

      if (data.success) {
        const apiCategories = data.data.categories || [];
        setCategories(apiCategories);

        // Build a flattened subCategories array with `categoryName` so
        // the UI can filter subcategories by the selected category name.
        const flattenedSubCategories = apiCategories.flatMap((cat: any) =>
          (cat.subCategories || []).map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            categoryName: cat.name,
          }))
        );

        setSubCategories(flattenedSubCategories);
        setForms(data.data.forms);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServiceForEdit = async (serviceId: string) => {
    setIsLoadingService(true);
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`);
      const data = await response.json();

      if (data.success) {
        const service = data.data;
        setServiceName(service.name);
        setServiceDescription(service.description || "");
        setIsActive(service.isActive);
        setSelectedCategoryName(service.categoryName);
        setSelectedFormId(service.formId);
        setSelectedSubCategoryId(service.subCategoryId || "");
        setHeroTitle(service.heroTitle || "");
        setHeroSubtitle(service.heroSubtitle || "");
        setHeroImage(service.heroImage || "");
        setContentImage(service.contentImage ?? "");
        setMetaTitle(service.metaTitle || "");
        setMetaDescription(service.metaDescription || "");
        setEnableDraftButton(service.enableDraftButton ?? true);
        setEnableSpeakButton(service.enableSpeakButton ?? true);

        // Set prices
        if (service.price && service.price.length > 0) {
          setPrices(
            service.price.map((p: any) => ({
              name: p.name,
              price: p.price,
              discountAmount: p.discountAmount || undefined,
              isCompulsory: p.isCompulsory || false,
            }))
          );
        }

        // Set FAQs
        if (service.faqs && service.faqs.length > 0) {
          setFaqs(
            service.faqs.map((faq: any) => ({
              question: faq.question,
              answer: faq.answer,
            }))
          );
        }

        // Set content blocks and deliverables
        if (service.contentJson && service.contentJson.blocks) {
          const deliverableBlock = service.contentJson.blocks.find(
            (block: any) => block.type === "deliverables"
          );
          const otherBlocks = service.contentJson.blocks.filter(
            (block: any) => block.type !== "deliverables"
          );

          setContentBlocks(otherBlocks);

          if (deliverableBlock) {
            setDeliverables({
              title: deliverableBlock.title || "Deliverables",
              description: deliverableBlock.description || "",
              items: deliverableBlock.items || [""],
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      alert("Failed to load service data");
    } finally {
      setIsLoadingService(false);
    }
  };

  const addPrice = () => {
    setPrices([...prices, { name: "", price: 0, isCompulsory: false }]);
  };

  const removePrice = (index: number) => {
    if (prices.length > 1) {
      setPrices(prices.filter((_, i) => i !== index));
    }
  };

  const updatePrice = (
    index: number,
    field: keyof PriceStructure,
    value: string | number | boolean
  ) => {
    setPrices(
      prices.map((price, i) =>
        i === index ? { ...price, [field]: value } : price
      )
    );
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index: number) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    setFaqs(
      faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const calculateDiscountPercentage = (price: number, discount?: number) => {
    if (!discount || discount <= 0) return 0;
    return Math.round((discount / price) * 100);
  };

  // Content block management functions
  const addContentBlock = (type: "list" | "text") => {
    const newBlock: ContentBlock =
      type === "list"
        ? { type: "list", title: "", description: "", points: [""] }
        : { type: "text", title: "", content: "" };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const removeContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const updateContentBlock = (index: number, updatedBlock: ContentBlock) => {
    setContentBlocks(
      contentBlocks.map((block, i) => (i === index ? updatedBlock : block))
    );
  };

  const addPointToListBlock = (blockIndex: number) => {
    const block = contentBlocks[blockIndex];
    if (block.type === "list") {
      const updatedBlock = { ...block, points: [...block.points, ""] };
      updateContentBlock(blockIndex, updatedBlock);
    }
  };

  const removePointFromListBlock = (blockIndex: number, pointIndex: number) => {
    const block = contentBlocks[blockIndex];
    if (block.type === "list" && block.points.length > 1) {
      const updatedBlock = {
        ...block,
        points: block.points.filter((_, i) => i !== pointIndex),
      };
      updateContentBlock(blockIndex, updatedBlock);
    }
  };

  const updateListBlockPoint = (
    blockIndex: number,
    pointIndex: number,
    value: string
  ) => {
    const block = contentBlocks[blockIndex];
    if (block.type === "list") {
      const updatedPoints = block.points.map((point, i) =>
        i === pointIndex ? value : point
      );
      const updatedBlock = { ...block, points: updatedPoints };
      updateContentBlock(blockIndex, updatedBlock);
    }
  };

  // Deliverables management functions
  const addDeliverableItem = () => {
    setDeliverables({
      ...deliverables,
      items: [...deliverables.items, ""],
    });
  };

  const removeDeliverableItem = (index: number) => {
    if (deliverables.items.length > 1) {
      setDeliverables({
        ...deliverables,
        items: deliverables.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateDeliverableItem = (index: number, value: string) => {
    setDeliverables({
      ...deliverables,
      items: deliverables.items.map((item, i) => (i === index ? value : item)),
    });
  };

  const handleHeroImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToS3(file);
    if (url) {
      setHeroImage(url);

      // If editing an existing service, persist heroImage immediately
      if (isEditMode && editServiceId) {
        try {
          await fetch(`/api/admin/services/${editServiceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ heroImage: url }),
          });
        } catch (err) {
          console.error("Failed to persist heroImage:", err);
        }
      }
    }
  };

  const handleContentImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToS3(file);
    if (url) {
      setContentImage(url);

      // If editing an existing service, persist contentImage immediately
      if (isEditMode && editServiceId) {
        try {
          await fetch(`/api/admin/services/${editServiceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentImage: url }),
          });
        } catch (err) {
          console.error("Failed to persist contentImage:", err);
        }
      }
    }
  };

  const updateDeliverableField = (
    field: "title" | "description",
    value: string
  ) => {
    setDeliverables({
      ...deliverables,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!serviceName.trim() || !selectedCategoryName || !selectedFormId) {
      alert("Please fill in all required fields");
      return;
    }

    // Filter out empty FAQs and prices
    const validFaqs = faqs.filter(
      (faq) => faq.question.trim() && faq.answer.trim()
    );
    const validPrices = prices
      .filter((price) => price.name.trim() && price.price > 0)
      .map((price) => ({
        name: price.name,
        price: price.price,
        discountAmount: price.discountAmount,
        isCompulsory: price.isCompulsory,
      }));

    // Prepare content blocks with deliverables
    const allContentBlocks = [...contentBlocks];

    // Add deliverables block if it has valid items
    const validDeliverableItems = deliverables.items.filter((item) =>
      item.trim()
    );
    if (validDeliverableItems.length > 0) {
      allContentBlocks.push({
        type: "deliverables",
        title: deliverables.title.trim() || "Deliverables",
        description: deliverables.description.trim(),
        items: validDeliverableItems,
      });
    }

    if (validPrices.length === 0) {
      alert("Please add at least one valid price component");
      return;
    }

    setIsSaving(true);
    try {
      const url = isEditMode
        ? `/api/admin/services/${editServiceId}`
        : "/api/admin/services";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: serviceName.trim(),
          slug: generateSlug(serviceName.trim()),
          description: serviceDescription.trim() || undefined,
          isActive,
          categoryName: selectedCategoryName,
          subCategoryId: selectedSubCategoryId,
          formId: selectedFormId,
          heroTitle,
          heroSubtitle,
          heroImage,
          contentImage: contentImage?.trim() ? contentImage : undefined,
          metaTitle: metaTitle?.trim() ? metaTitle : undefined,
          metaDescription: metaDescription?.trim()
            ? metaDescription
            : undefined,
          enableDraftButton,
          enableSpeakButton,
          faqs: validFaqs,
          prices: validPrices,
          content:
            allContentBlocks.length > 0
              ? { blocks: allContentBlocks }
              : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Service ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/services");
      } else {
        alert(
          data.message ||
            `Failed to ${isEditMode ? "update" : "create"} service`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} service:`,
        error
      );
      alert(`Failed to ${isEditMode ? "update" : "create"} service`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (isEditMode && editServiceId) {
      fetchServiceForEdit(editServiceId);
    }
  }, [isEditMode, editServiceId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Service" : "Create New Service"}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Update your service configuration and pricing"
              : "Build a comprehensive service offering for your clients"}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for your service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingService && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Loading service data...
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter service name"
                className="mt-1"
                disabled={isLoadingService}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isLoadingService}
              />
              <Label htmlFor="isActive">Active Service</Label>
            </div>
          </div>
          <div>
            <Label htmlFor="serviceDescription">Description</Label>
            <div className="mt-1">
              <SimpleMDE
                value={serviceDescription}
                onChange={handleServiceDescriptionChange}
                options={simpleMdeOptions}
              />
            </div>
          </div>
          {/* Hero Section */}
          <div className="border rounded-lg p-4 space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Hero Section (Banner)</h3>

            <div>
              <Label>Hero Title</Label>
              <Input
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Enter hero title (displayed on service page)"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Hero Subtitle</Label>
              <Textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Enter subtitle / tagline"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Hero Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
              />

              {heroImage && (
                <img
                  src={heroImage}
                  alt="Preview"
                  className="h-32 mt-3 border rounded-md object-cover"
                />
              )}
            </div>
          </div>
          <div>
            <Label>Content Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleContentImageUpload}
            />
            {contentImage && (
              <img
                src={contentImage}
                className="w-full h-auto max-h-[400px] mt-3 rounded-md border object-contain bg-gray-50"
              />
            )}
          </div>

          {/* SEO Meta */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta</CardTitle>
              <CardDescription>
                Add meta title and description for better search engine display
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Enter meta title (optional)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Enter meta description (optional)"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Action Buttons</CardTitle>
              <CardDescription>
                Enable or disable quick action buttons on the service page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableDraftButton">Draft Button</Label>
                <Switch
                  id="enableDraftButton"
                  checked={enableDraftButton}
                  onCheckedChange={setEnableDraftButton}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableSpeakButton">Speak to Lawyer Button</Label>
                <Switch
                  id="enableSpeakButton"
                  checked={enableSpeakButton}
                  onCheckedChange={setEnableSpeakButton}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <SearchableSelect
                options={categories.map((category) => ({
                  value: category.name,
                  label: category.name,
                }))}
                value={selectedCategoryName}
                onValueChange={setSelectedCategoryName}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found."
                className="mt-1 w-full"
                loading={isLoading || isLoadingService}
                disabled={isLoadingService}
              />
            </div>
            {selectedCategoryName && (
              <div>
                <Label htmlFor="subcategory">Sub Category *</Label>
                <SearchableSelect
                  options={filteredSubCategories.map((sub) => ({
                    value: sub.id,
                    label: sub.name,
                  }))}
                  value={selectedSubCategoryId}
                  onValueChange={setSelectedSubCategoryId}
                  placeholder="Select sub-category"
                  searchPlaceholder="Search..."
                  emptyText="No subcategories found"
                  className="mt-1 w-full"
                />
              </div>
            )}

            <div>
              <Label htmlFor="form">Associated Form *</Label>
              <SearchableSelect
                options={forms.map((form) => ({
                  value: form.id,
                  label: form.name,
                }))}
                value={selectedFormId}
                onValueChange={setSelectedFormId}
                placeholder="Select a form"
                searchPlaceholder="Search forms..."
                emptyText="No forms found."
                className="mt-1 w-full"
                loading={isLoading || isLoadingService}
                disabled={isLoadingService}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Structure</CardTitle>
          <CardDescription>
            Define the pricing components for your service (in Indian Rupees)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prices.map((price, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Price Component {index + 1}</h4>
                {prices.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePrice(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`price-name-${index}`}>
                    Component Name *
                  </Label>
                  <Input
                    id={`price-name-${index}`}
                    value={price.name}
                    onChange={(e) => updatePrice(index, "name", e.target.value)}
                    placeholder="e.g., Legal Consultation, Document Drafting"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`price-${index}`}>Base Price (₹) *</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      value={price.price}
                      onChange={(e) =>
                        updatePrice(
                          index,
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter price in rupees"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`discount-${index}`}>
                      Discount Amount (₹)
                    </Label>
                    <Input
                      id={`discount-${index}`}
                      type="number"
                      // min="0"
                      max={price.price}
                      value={price.discountAmount || ""}
                      onChange={(e) =>
                        updatePrice(
                          index,
                          "discountAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter discount amount"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`compulsory-${index}`}
                    checked={price.isCompulsory}
                    onCheckedChange={(checked) =>
                      updatePrice(index, "isCompulsory", checked)
                    }
                  />
                  <Label htmlFor={`compulsory-${index}`}>
                    Compulsory Component
                  </Label>
                </div>
              </div>
              {price.price > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>₹{price.price.toLocaleString()}</span>
                    </div>
                    {price.discountAmount && price.discountAmount > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span>
                            -₹{price.discountAmount.toLocaleString()} (
                            {calculateDiscountPercentage(
                              price.price,
                              price.discountAmount
                            )}
                            % off)
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Final Price:</span>
                          <span>
                            ₹
                            {(
                              price.price - price.discountAmount
                            ).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addPrice}>
            <Plus className="w-4 h-4 mr-2" />
            Add Price Component
          </Button>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Add common questions and answers about your service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">FAQ {index + 1}</h4>
                {faqs.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`question-${index}`}>Question</Label>
                  <div className="mt-1">
                    <SimpleMDE
                      value={faq.question}
                      onChange={(value: string) =>
                        updateFAQ(index, "question", value)
                      }
                      options={simpleMdeOptions}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`answer-${index}`}>Answer</Label>
                  <div className="mt-1">
                    <SimpleMDE
                      value={faq.answer}
                      onChange={(value: string) =>
                        updateFAQ(index, "answer", value)
                      }
                      options={simpleMdeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addFAQ}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </CardContent>
      </Card>

      {/* Testimonials (only while editing a service) */}
      {isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>
              Add or edit testimonials shown on the public service page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testimonials.length === 0 ? (
              <div className="text-sm text-gray-500">No testimonials yet.</div>
            ) : (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="border rounded-lg p-3 flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium">
                      {t.author || "Anonymous"}{" "}
                      {t.role ? (
                        <span className="text-sm text-gray-500">
                          — {t.role}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-700 mt-2">{t.text}</div>
                    {t.rating ? (
                      <div className="text-xs text-gray-500 mt-2">
                        Rating: {t.rating}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTestimonial(t);
                        setTestimonialForm({
                          author: t.author || "",
                          role: t.role || "",
                          text: t.text,
                          rating: t.rating || 0,
                          isFeatured: t.isFeatured,
                        });
                        setIsTestimonialDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("Delete testimonial?")) return;
                        try {
                          const res = await fetch(
                            `/api/admin/services/testimonials/${t.id}`,
                            { method: "DELETE" }
                          );
                          const d = await res.json();
                          if (d.success)
                            setTestimonials(
                              testimonials.filter((x) => x.id !== t.id)
                            );
                          else alert("Delete failed");
                        } catch (e) {
                          console.error(e);
                          alert("Delete failed");
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}

            <div>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestimonialForm({
                    author: "",
                    role: "",
                    text: "",
                    rating: 0,
                    isFeatured: false,
                  });
                  setIsTestimonialDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            {/* Simple dialog inline */}
            {isTestimonialDialogOpen && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={testimonialForm.author}
                      onChange={(e) =>
                        setTestimonialForm({
                          ...testimonialForm,
                          author: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Role / Location</Label>
                    <Input
                      value={testimonialForm.role}
                      onChange={(e) =>
                        setTestimonialForm({
                          ...testimonialForm,
                          role: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label>Text</Label>
                  <Textarea
                    value={testimonialForm.text}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        text: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsTestimonialDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!testimonialForm.text.trim()) {
                        alert("Text is required");
                        return;
                      }
                      try {
                        if (editingTestimonial) {
                          const res = await fetch(
                            `/api/admin/services/testimonials/${editingTestimonial.id}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ ...testimonialForm }),
                            }
                          );
                          const d = await res.json();
                          if (d.success) {
                            setTestimonials(
                              testimonials.map((t) =>
                                t.id === d.data.id ? d.data : t
                              )
                            );
                            setIsTestimonialDialogOpen(false);
                          } else {
                            alert(d.message || "Update failed");
                          }
                        } else {
                          const res = await fetch(
                            "/api/admin/services/testimonials",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                serviceId: editServiceId,
                                ...testimonialForm,
                              }),
                            }
                          );
                          const d = await res.json();
                          if (d.success) {
                            setTestimonials([d.data, ...testimonials]);
                            setIsTestimonialDialogOpen(false);
                          } else {
                            alert(d.message || "Create failed");
                          }
                        }
                      } catch (e) {
                        console.error(e);
                        alert("Operation failed");
                      }
                    }}
                  >
                    {editingTestimonial ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Deliverables Section */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>Deliverables</CardTitle>
          <CardDescription>
            Specify what clients will receive upon service completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingService && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Loading deliverables...
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="deliverables-title">Title</Label>
              <Input
                id="deliverables-title"
                value={deliverables.title}
                onChange={(e) =>
                  updateDeliverableField("title", e.target.value)
                }
                placeholder="e.g., Deliverables"
                className="mt-1"
                disabled={isLoadingService}
              />
            </div>

            <div>
              <Label htmlFor="deliverables-description">Description</Label>
              <div className="mt-1">
                <SimpleMDE
                  value={deliverables.description}
                  onChange={(value: string) =>
                    updateDeliverableField("description", value)
                  }
                  options={simpleMdeOptions}
                />
              </div>
            </div>

            <div>
              <Label>Items</Label>
              <div className="space-y-2 mt-2">
                {deliverables.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <div className="flex-1">
                      <SimpleMDE
                        value={item}
                        onChange={(value: string) =>
                          updateDeliverableItem(itemIndex, value)
                        }
                        options={simpleMdeOptions}
                      />
                    </div>
                    {deliverables.items.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDeliverableItem(itemIndex)}
                        disabled={isLoadingService}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDeliverableItem}
                  disabled={isLoadingService}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>Content Sections</CardTitle>
          <CardDescription>
            Add structured content like term sheets, process descriptions, or
            other detailed information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingService && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Loading content...
                </span>
              </div>
            </div>
          )}

          {contentBlocks.map((block, blockIndex) => (
            <div key={blockIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {block.type === "list" ? "List Content" : "Text Content"}{" "}
                  {blockIndex + 1}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeContentBlock(blockIndex)}
                  disabled={isLoadingService}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`content-title-${blockIndex}`}>Title *</Label>
                  <Input
                    id={`content-title-${blockIndex}`}
                    value={block.title}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, {
                        ...block,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter section title"
                    className="mt-1"
                    disabled={isLoadingService}
                  />
                </div>

                {block.type === "list" ? (
                  <>
                    <div>
                      <Label htmlFor={`content-description-${blockIndex}`}>
                        Description
                      </Label>
                      <div className="mt-1">
                        <SimpleMDE
                          value={block.description || ""}
                          onChange={(value: string) =>
                            updateContentBlock(blockIndex, {
                              ...block,
                              description: value,
                            })
                          }
                          options={simpleMdeOptions}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Points</Label>
                      <div className="space-y-2 mt-2">
                        {block.points.map((point, pointIndex) => (
                          <div key={pointIndex} className="flex gap-2">
                            <div className="flex-1">
                              <SimpleMDE
                                value={point}
                                onChange={(value: string) =>
                                  updateListBlockPoint(
                                    blockIndex,
                                    pointIndex,
                                    value
                                  )
                                }
                                options={simpleMdeOptions}
                              />
                            </div>
                            {block.points.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removePointFromListBlock(
                                    blockIndex,
                                    pointIndex
                                  )
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addPointToListBlock(blockIndex)}
                          disabled={isLoadingService}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Point
                        </Button>
                      </div>
                    </div>
                  </>
                ) : block.type === "text" ? (
                  <div>
                    <Label htmlFor={`content-text-${blockIndex}`}>
                      Content *
                    </Label>
                    <div className="mt-1">
                      <SimpleMDE
                        value={block.content}
                        onChange={(value: string) =>
                          updateContentBlock(blockIndex, {
                            ...block,
                            content: value,
                          })
                        }
                        options={simpleMdeOptions}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => addContentBlock("list")}
              disabled={isLoadingService}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add List Content
            </Button>
            <Button
              variant="outline"
              onClick={() => addContentBlock("text")}
              disabled={isLoadingService}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Text Content
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving
            ? `${isEditMode ? "Updating" : "Creating"} Service...`
            : `${isEditMode ? "Update" : "Create"} Service`}
        </Button>
      </div>
    </div>
  );
};

export default function ServicesBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Loading...</h1>
              <p className="text-gray-600">
                Please wait while we load the service builder
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Loading service builder...
              </span>
            </div>
          </div>
        </div>
      }
    >
      <ServicesBuilderContent />
    </Suspense>
  );
}
