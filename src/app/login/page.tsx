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

      <div className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
        <div className="p-8 sm:p-10 rounded-3xl hud-glass shadow-2xl flex flex-col gap-6 border border-white/5">
          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
                border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight font-display">Pilot Authentication</h1>
            <p className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Sign in to sync your telemetry, personal bests, and rankings.
            </p>
          </div>

          {error && (
            <div
              className="p-3.5 rounded-xl text-xs font-mono flex items-center gap-2 border border-red-500/30 bg-red-500/10 text-red-400"
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
                placeholder="pilot@typehaya.com"
                className="p-3.5 rounded-xl outline-none font-sans text-sm hud-card border border-white/5"
                style={{
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
                className="p-3.5 rounded-xl outline-none font-sans text-sm hud-card border border-white/5"
                style={{
                  color: "var(--text-color)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 py-3.5 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: "var(--main-color)",
                color: "var(--bg-color)",
                boxShadow: "0 0 20px color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Arena"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guest Sync Info */}
          <div
            className="p-3.5 rounded-2xl text-[11px] font-mono flex items-start gap-2.5 bg-black/20 border border-white/5"
            style={{ color: "var(--sub-color)" }}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--main-color)" }} />
            <span>
              All typing tests taken in this browser as a guest will automatically synchronize to your account.
            </span>
          </div>

          <div className="text-center text-xs font-mono opacity-70" style={{ color: "var(--sub-color)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold underline" style={{ color: "var(--main-color)" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
