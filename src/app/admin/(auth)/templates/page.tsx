"use client";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TemplateStatus = "PENDING" | "APPROVED" | "REJECTED";

type TemplateItem = {
  id: string;
  friendlyName: string;
  category: string;
  language: string;
  body: string;
  status: TemplateStatus;
  isActive: boolean;
  twilioSid: string;
  createdAt: string;
  updatedAt: string;
  sentCount: number;
};

const languages = ["en", "en_US", "en_GB", "hi", "es", "fr", "de"];

const parseVariables = (body: string) => {
  const re = /\{\{(.*?)\}\}/g;
  const vars = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) vars.add(match[1].trim());
  return Array.from(vars);
};

export default function TemplatesPage() {
  const [list, setList] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [friendlyName, setFriendlyName] = useState("");
  const [category, setCategory] = useState("UTILITY");
  const [language, setLanguage] = useState("en");
  const [body, setBody] = useState(
    "Hello {{name}}, your case id is {{caseId}}."
  );

  // Test email states
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testType, setTestType] = useState("all");
  const [testFormat, setTestFormat] = useState("both");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const variables = useMemo(() => parseVariables(body), [body]);

  const fetchList = async () => {
    const res = await fetch("/api/admin/templates", { cache: "no-store" });
    const data = await res.json();
    if (data?.success) setList(data.data);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreate = async () => {
    if (!friendlyName || !body) return;
    setLoading(true);
    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendlyName, body, language, category }),
    });
    setLoading(false);
    if (res.ok) {
      setFriendlyName("");
      setBody("");
      await fetchList();
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/templates/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    await fetchList();
  };

  const handleTestEmails = async (fireAll = false) => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(
        `/api/admin/test-emails?email=${encodeURIComponent(
          testEmail
        )}&type=${testType}&format=${testFormat}${fireAll ? "&fireAll=true" : ""}`
      );
      const data = await res.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, error: "Failed to test emails" });
    }
    setTestLoading(false);
  };

  const pageSize = 9; // 3x3 grid
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const paginatedTemplates = list.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Email Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testType">Email Type</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="payment-success">
                    Payment Success
                  </SelectItem>
                  <SelectItem value="payment-failure">
                    Payment Failure
                  </SelectItem>
                  <SelectItem value="case-assigned">Case Assigned</SelectItem>
                  <SelectItem value="case-status-update">
                    Case Status Update
                  </SelectItem>
                  <SelectItem value="meeting-notification">
                    Meeting Notification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="testFormat">Format</Label>
              <Select value={testFormat} onValueChange={setTestFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">HTML + Text</SelectItem>
                  <SelectItem value="html">HTML Only</SelectItem>
                  <SelectItem value="text">Text Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end gap-2">
              <Button
                onClick={() => handleTestEmails(false)}
                disabled={testLoading}
                className="flex-1"
                aria-label="Test emails"
              >
                {testLoading ? "Sending..." : "Send Test Emails"}
              </Button>
              <Button
                onClick={() => {
                  setTestType("all");
                  handleTestEmails(true);
                }}
                disabled={testLoading}
                variant="destructive"
                aria-label="Fire all emails"
              >
                {testLoading ? "Firing..." : "🔥 Fire All"}
              </Button>
            </div>
          </div>
          {testResult && (
            <div
              className={`p-3 rounded-md text-sm ${
                testResult.success
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="font-semibold">
                {testResult.success ? "✅ Success" : "❌ Error"}
              </div>
              <div>{testResult.message || testResult.error}</div>
              {testResult.results && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">
                    View Details
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(testResult.results, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create WhatsApp Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="friendlyName">Friendly Name</Label>
              <Input
                id="friendlyName"
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
                placeholder="Order Update"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="UTILITY / MARKETING"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                list="langs"
              />
              <datalist id="langs">
                {languages.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="body">Body</Label>
              <textarea
                id="body"
                className="w-full rounded-md border px-3 py-2 text-sm min-h-28"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Hello {{name}}, your OTP is {{otp}}."
              />
              {variables.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Variables detected: {variables.join(", ")}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleCreate}
              disabled={loading}
              aria-label="Create template"
            >
              {loading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates ({list.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedTemplates.map((t) => (
              <div
                key={t.id}
                className="rounded-md border p-3 bg-white space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{t.friendlyName}</div>
                  <div className="text-xs">{t.status}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t.language} • {t.category}
                </div>
                <div className="text-sm bg-blue-50 rounded p-2 whitespace-pre-wrap">
                  {t.body}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs">Sent: {t.sentCount}</div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Active</Label>
                    <Switch
                      checked={t.isActive}
                      onCheckedChange={(v) => handleToggle(t.id, v)}
                      aria-label="Toggle active"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {list.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, list.length)} of {list.length}
              </div>
              {totalPages > 1 && (
                <div
                  className="flex items-center gap-2"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                  >
                    First
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                  >
                    Last
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
