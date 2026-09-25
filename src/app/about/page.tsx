"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Info,
  Zap,
  Activity,
  Award,
  Command,
  Cpu,
  ShieldAlert,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* Title Banner */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
                border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <Info className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Architecture & Telemetry</h1>
          </div>
          <p className="text-xs font-mono max-w-lg opacity-60" style={{ color: "var(--sub-color)" }}>
            Next-generation, ultra-low latency typing test suite crafted with Web Audio synthesis and real-time DOM synchronization.
          </p>
        </div>

        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl hud-card flex flex-col gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
              }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base font-display">Sub-Millisecond Engine</h3>
            <p className="text-xs leading-relaxed opacity-70 font-mono" style={{ color: "var(--sub-color)" }}>
              Custom state engine executes keystroke differential hashing without synthetic delays. Zero input lag, zero heavy layout reflows.
            </p>
          </div>

          <div className="p-6 rounded-3xl hud-card flex flex-col gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
              }}
            >
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base font-display">High-Precision Telemetry</h3>
            <p className="text-xs leading-relaxed opacity-70 font-mono" style={{ color: "var(--sub-color)" }}>
              Continuous velocity curves, keystroke bottleneck matrices, accuracy drift tracking, and statistical consistency scoring.
            </p>
          </div>

          <div className="p-6 rounded-3xl hud-card flex flex-col gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
              }}
            >
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base font-display">Rich Aesthetic System</h3>
            <p className="text-xs leading-relaxed opacity-70 font-mono" style={{ color: "var(--sub-color)" }}>
              Custom theme colorways, procedural Web Audio mechanical click synthesizers, custom carets, and real-time pace ghost racers.
            </p>
          </div>
        </div>

        {/* Speed Calculation Formulas Card */}
        <div className="p-6 sm:p-8 rounded-3xl hud-glass flex flex-col gap-5 border border-white/5 font-mono text-xs shadow-xl">
          <h2 className="text-base font-bold font-display flex items-center gap-2" style={{ color: "var(--main-color)" }}>
            <Cpu className="w-4 h-4" />
            <span>Telemetry Mathematical Formulations</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="font-bold block text-sm font-sans mb-1 text-[var(--text-color)]">Net WPM (Words Per Minute)</span>
              <p className="opacity-70 leading-relaxed mb-2 text-[11px]">
                Standardized typing velocity index (1 word = 5 correct key impulses):
              </p>
              <code className="px-3 py-1.5 rounded-xl block text-[11px] font-bold bg-black/40 border border-white/5" style={{ color: "var(--main-color)" }}>
                WPM = (Correct Characters / 5) / Elapsed Minutes
              </code>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="font-bold block text-sm font-sans mb-1 text-[var(--text-color)]">Raw Velocity</span>
              <p className="opacity-70 leading-relaxed mb-2 text-[11px]">
                Total physical keypress actuation rate regardless of error rate:
              </p>
              <code className="px-3 py-1.5 rounded-xl block text-[11px] font-bold bg-black/40 border border-white/5" style={{ color: "var(--main-color)" }}>
                Raw = (Total Characters Typed / 5) / Elapsed Minutes
              </code>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="font-bold block text-sm font-sans mb-1 text-[var(--text-color)]">Accuracy Coefficient</span>
              <p className="opacity-70 leading-relaxed mb-2 text-[11px]">
                Keystroke accuracy efficiency percentage:
              </p>
              <code className="px-3 py-1.5 rounded-xl block text-[11px] font-bold bg-black/40 border border-white/5" style={{ color: "var(--main-color)" }}>
                Acc = (Correct Characters / Total Typed) * 100
              </code>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="font-bold block text-sm font-sans mb-1 text-[var(--text-color)]">Consistency Variance</span>
              <p className="opacity-70 leading-relaxed mb-2 text-[11px]">
                Velocity smoothness calculated from 1-second sample deviations:
              </p>
              <code className="px-3 py-1.5 rounded-xl block text-[11px] font-bold bg-black/40 border border-white/5" style={{ color: "var(--main-color)" }}>
                100 - (Standard Deviation / Mean WPM * 100)
              </code>
            </div>
          </div>
        </div>

        {/* Keyboard Hotkeys Cheat Sheet */}
        <div className="p-6 sm:p-8 rounded-3xl hud-glass flex flex-col gap-5 border border-white/5 font-mono text-xs shadow-xl">
          <h2 className="text-base font-bold font-display flex items-center gap-2" style={{ color: "var(--main-color)" }}>
            <Command className="w-4 h-4" />
            <span>Flight Deck Shortcuts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="opacity-80">Instant test restart</span>
              <span className="px-2.5 py-1 rounded-lg font-bold border border-white/10" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Tab + Enter
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="opacity-80">Open Command Deck</span>
              <span className="px-2.5 py-1 rounded-lg font-bold border border-white/10" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Esc / Cmd + K
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="opacity-80">Cycle to next test</span>
              <span className="px-2.5 py-1 rounded-lg font-bold border border-white/10" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Enter / Tab
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="opacity-80">Commit active word token</span>
              <span className="px-2.5 py-1 rounded-lg font-bold border border-white/10" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Spacebar
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
