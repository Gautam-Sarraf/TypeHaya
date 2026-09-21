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
} from "lucide-react";

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Title Banner */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-6 h-6" style={{ color: "var(--main-color)" }} />
            <h1 className="text-2xl font-bold tracking-tight">About Typehaya</h1>
          </div>
          <p className="text-xs font-mono max-w-lg" style={{ color: "var(--sub-color)" }}>
            A modern, distraction-free typing platform engineered for competitive typists, developers, and keyboard enthusiasts.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl flex flex-col gap-3 border shadow-xs"
            style={{ backgroundColor: "var(--sub-alt-color)", borderColor: "transparent" }}
          >
            <Zap className="w-5 h-5" style={{ color: "var(--main-color)" }} />
            <h3 className="font-bold text-sm">Ultra-Low Latency</h3>
            <p className="text-xs leading-relaxed opacity-70 font-mono" style={{ color: "var(--sub-color)" }}>
              Character-state state machine renders keystrokes with immediate DOM synchronization. Zero input lag, zero heavy synthetic wrappers.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl flex flex-col gap-3 border shadow-xs"
            style={{ backgroundColor: "var(--sub-alt-color)", borderColor: "transparent" }}
          >
            <Activity className="w-5 h-5" style={{ color: "var(--main-color)" }} />
            <h3 className="font-bold text-sm">Rich Analytics</h3>
            <p className="text-xs leading-relaxed opacity-70 font-mono" style={{ color: "var(--sub-color)" }}>
              Track Net WPM, Raw WPM, character classification, consistency variance, and interactive timeline error distributions.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl flex flex-col gap-3 border shadow-xs"
            style={{ backgroundColor: "var(--sub-alt-color)", borderColor: "transparent" }}
          >
            <Award className="w-5 h-5" style={{ color: "var(--main-color)" }} />
            <h3 className="font-bold text-sm">Endless Customization</h3>
            <p className="text-xs leading-relaxed opacity-70 font-mono" style={{ color: "var(--sub-color)" }}>
              16 curated mechanical keycap themes, Web Audio switch acoustics, customizable carets, pace ghosts, and diverse vocabularies.
            </p>
          </div>
        </div>

        {/* Speed Calculation Explained */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4 border shadow-xs font-mono text-xs"
          style={{ backgroundColor: "var(--sub-alt-color)", borderColor: "transparent" }}
        >
          <h2 className="text-sm font-bold font-sans flex items-center gap-2" style={{ color: "var(--main-color)" }}>
            Typing Speed Calculation Formulas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="font-bold block text-sm mb-1">Net WPM (Words Per Minute)</span>
              <p className="opacity-70 leading-relaxed mb-2">
                Standard typing metric where 1 word is defined as 5 correct keystrokes:
              </p>
              <code className="px-2 py-1 rounded block text-[11px] font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                WPM = (Correct Characters / 5) / Elapsed Minutes
              </code>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="font-bold block text-sm mb-1">Raw WPM</span>
              <p className="opacity-70 leading-relaxed mb-2">
                Total typing velocity regardless of mistakes made:
              </p>
              <code className="px-2 py-1 rounded block text-[11px] font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Raw = (Total Characters Typed / 5) / Elapsed Minutes
              </code>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="font-bold block text-sm mb-1">Accuracy %</span>
              <p className="opacity-70 leading-relaxed mb-2">
                Ratio of correct keystrokes to total input attempts:
              </p>
              <code className="px-2 py-1 rounded block text-[11px] font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Acc = (Correct Characters / Total Typed) * 100
              </code>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="font-bold block text-sm mb-1">Consistency %</span>
              <p className="opacity-70 leading-relaxed mb-2">
                Evenness of typing speed sampled every second:
              </p>
              <code className="px-2 py-1 rounded block text-[11px] font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                100 - (Standard Deviation / Mean WPM * 100)
              </code>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Cheat Sheet */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4 border shadow-xs font-mono text-xs"
          style={{ backgroundColor: "var(--sub-alt-color)", borderColor: "transparent" }}
        >
          <h2 className="text-sm font-bold font-sans flex items-center gap-2" style={{ color: "var(--main-color)" }}>
            <Command className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="opacity-80">Restart test</span>
              <span className="px-2 py-0.5 rounded font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Tab + Enter
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="opacity-80">Open Command Palette</span>
              <span className="px-2 py-0.5 rounded font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Esc or Cmd + K
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="opacity-80">Next test on results</span>
              <span className="px-2 py-0.5 rounded font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
                Enter or Tab
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
              <span className="opacity-80">Advance active word</span>
              <span className="px-2 py-0.5 rounded font-bold" style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--main-color)" }}>
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
