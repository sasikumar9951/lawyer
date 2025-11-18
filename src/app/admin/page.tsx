"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      router.replace("/admin/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });
    setIsSubmitting(false);
    if (!result || result.error) {
      setErrorMessage("Invalid credentials");
      return;
    }
    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-svh flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border rounded-lg p-6 shadow-sm"
        aria-label="Admin login form"
      >
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            aria-label="Email address"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            aria-label="Password"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground rounded-md py-2 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          Use admin@admin.com / sasasasa
        </p>
      </form>
    </main>
  );
};

export default AdminLoginPage;
