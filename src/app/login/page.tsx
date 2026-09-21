"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { LogIn, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center">
        <div
          className="p-8 rounded-3xl shadow-xl flex flex-col gap-6 border"
          style={{
            backgroundColor: "var(--sub-alt-color)",
            borderColor: "transparent",
          }}
        >
          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <div
              className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2"
              style={{ backgroundColor: "var(--main-color)", color: "var(--bg-color)" }}
            >
              <LogIn className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Sign in to sync your personal bests and history.
            </p>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-mono flex items-center gap-2"
              style={{ backgroundColor: "var(--bg-color)", color: "var(--error-color)" }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold opacity-70" style={{ color: "var(--sub-color)" }}>
                Email or Username
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@typehaya.com"
                className="p-3 rounded-xl outline-none font-sans text-sm border"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "transparent",
                  color: "var(--text-color)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold opacity-70" style={{ color: "var(--sub-color)" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="p-3 rounded-xl outline-none font-sans text-sm border"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "transparent",
                  color: "var(--text-color)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: "var(--main-color)",
                color: "var(--bg-color)",
              }}
            >
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guest Sync Info */}
          <div
            className="p-3.5 rounded-xl text-[11px] font-mono flex items-start gap-2.5 opacity-80"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--sub-color)" }}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--main-color)" }} />
            <span>
              Any typing tests you took as a guest on this browser will be automatically saved to your account.
            </span>
          </div>

          <div className="text-center text-xs font-mono opacity-70" style={{ color: "var(--sub-color)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold underline" style={{ color: "var(--main-color)" }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
