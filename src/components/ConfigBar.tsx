"use client";

import React from "react";
import {
  Clock,
  Type,
  Quote as QuoteIcon,
  Mountain,
  AtSign,
  Hash,
  Wrench,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { TestMode } from "@/lib/engine";
import { WordListType } from "@/lib/words";

interface ConfigBarProps {
  mode: TestMode;
  subMode: string;
  punctuation: boolean;
  numbers: boolean;
  language: WordListType;
  onModeChange: (mode: TestMode, defaultSub: string) => void;
  onSubModeChange: (sub: string) => void;
  onTogglePunctuation: () => void;
  onToggleNumbers: () => void;
  onLanguageChange: (lang: WordListType) => void;
}

export function ConfigBar({
  mode,
  subMode,
  punctuation,
  numbers,
  language,
  onModeChange,
  onSubModeChange,
  onTogglePunctuation,
  onToggleNumbers,
  onLanguageChange,
}: ConfigBarProps) {
  const timeSubModes = [
    { val: "15", label: "15s" },
    { val: "30", label: "30s" },
    { val: "60", label: "60s" },
    { val: "120", label: "120s" },
  ];

  const wordSubModes = [
    { val: "10", label: "10w" },
    { val: "25", label: "25w" },
    { val: "50", label: "50w" },
    { val: "100", label: "100w" },
  ];

  const quoteSubModes = [
    { id: "all", label: "all lengths" },
    { id: "short", label: "short" },
    { id: "medium", label: "medium" },
    { id: "long", label: "long" },
    { id: "thicc", label: "epic" },
  ];

  const mainModes: Array<{ id: TestMode; label: string; icon: React.ComponentType<{ className?: string }>; defaultSub: string }> = [
    { id: "time", label: "Time", icon: Clock, defaultSub: "30" },
    { id: "words", label: "Words", icon: Type, defaultSub: "25" },
    { id: "quote", label: "Quote", icon: QuoteIcon, defaultSub: "medium" },
    { id: "zen", label: "Zen", icon: Mountain, defaultSub: "free" },
    { id: "custom", label: "Custom", icon: Wrench, defaultSub: "custom" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl hud-glass shadow-2xl font-mono text-xs select-none transition-all">
      {/* Segment 1: Tactile Modifiers (Punctuation & Numbers) */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
        <button
          onClick={onTogglePunctuation}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            punctuation
              ? "font-bold shadow-xs scale-100"
              : "opacity-50 hover:opacity-100"
          }`}
          style={{
            backgroundColor: punctuation
              ? "color-mix(in srgb, var(--main-color) 18%, transparent)"
              : "transparent",
            color: punctuation ? "var(--main-color)" : "var(--sub-color)",
            border: punctuation
              ? "1px solid color-mix(in srgb, var(--main-color) 35%, transparent)"
              : "1px solid transparent",
          }}
          title="Toggle Punctuation"
        >
          <AtSign className="w-3.5 h-3.5" />
          <span className="text-[11px]">punct</span>
          {punctuation && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--main-color)", boxShadow: "0 0 6px var(--main-color)" }}
            />
          )}
        </button>

        <button
          onClick={onToggleNumbers}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            numbers
              ? "font-bold shadow-xs scale-100"
              : "opacity-50 hover:opacity-100"
          }`}
          style={{
            backgroundColor: numbers
              ? "color-mix(in srgb, var(--main-color) 18%, transparent)"
              : "transparent",
            color: numbers ? "var(--main-color)" : "var(--sub-color)",
            border: numbers
              ? "1px solid color-mix(in srgb, var(--main-color) 35%, transparent)"
              : "1px solid transparent",
          }}
          title="Toggle Numbers"
        >
          <Hash className="w-3.5 h-3.5" />
          <span className="text-[11px]">nums</span>
          {numbers && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--main-color)", boxShadow: "0 0 6px var(--main-color)" }}
            />
          )}
        </button>
      </div>

      <div className="hidden sm:block w-[1px] h-5 bg-white/10" />

      {/* Segment 2: Primary Test Modes */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
        {mainModes.map((item) => {
          const Icon = item.icon;
          const isActive = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id, item.defaultSub)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? "font-bold shadow-sm"
                  : "opacity-50 hover:opacity-100"
              }`}
              style={{
                backgroundColor: isActive
                  ? "var(--main-color)"
                  : "transparent",
                color: isActive ? "var(--bg-color)" : "var(--sub-color)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Segment 3: Sub-Mode Numeric Pills */}
      {(mode === "time" || mode === "words" || mode === "quote") && (
        <>
          <div className="hidden sm:block w-[1px] h-5 bg-white/10" />
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
            {mode === "time" &&
              timeSubModes.map((item) => {
                const isActive = subMode === item.val;
                return (
                  <button
                    key={item.val}
                    onClick={() => onSubModeChange(item.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "shadow-xs"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "color-mix(in srgb, var(--main-color) 20%, transparent)"
                        : "transparent",
                      color: isActive ? "var(--main-color)" : "var(--sub-color)",
                      border: isActive
                        ? "1px solid color-mix(in srgb, var(--main-color) 35%, transparent)"
                        : "1px solid transparent",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}

            {mode === "words" &&
              wordSubModes.map((item) => {
                const isActive = subMode === item.val;
                return (
                  <button
                    key={item.val}
                    onClick={() => onSubModeChange(item.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "shadow-xs"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "color-mix(in srgb, var(--main-color) 20%, transparent)"
                        : "transparent",
                      color: isActive ? "var(--main-color)" : "var(--sub-color)",
                      border: isActive
                        ? "1px solid color-mix(in srgb, var(--main-color) 35%, transparent)"
                        : "1px solid transparent",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}

            {mode === "quote" &&
              quoteSubModes.map((q) => {
                const isActive = subMode === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => onSubModeChange(q.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                      isActive
                        ? "shadow-xs"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "color-mix(in srgb, var(--main-color) 20%, transparent)"
                        : "transparent",
                      color: isActive ? "var(--main-color)" : "var(--sub-color)",
                      border: isActive
                        ? "1px solid color-mix(in srgb, var(--main-color) 35%, transparent)"
                        : "1px solid transparent",
                    }}
                  >
                    {q.label}
                  </button>
                );
              })}
          </div>
        </>
      )}

      {/* Segment 4: Vocabulary / Language Selector */}
      {mode !== "quote" && mode !== "custom" && (
        <>
          <div className="hidden sm:block w-[1px] h-5 bg-white/10" />
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl border border-white/5">
            <Globe className="w-3.5 h-3.5 opacity-60" style={{ color: "var(--main-color)" }} />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as WordListType)}
              className="bg-transparent border-none text-[11px] font-semibold cursor-pointer outline-none capitalize"
              style={{ color: "var(--text-color)" }}
            >
              <option value="english" className="bg-[#1f2229] text-white">english 200</option>
              <option value="english_1k" className="bg-[#1f2229] text-white">english 1k</option>
              <option value="code_javascript" className="bg-[#1f2229] text-white">javascript code</option>
              <option value="code_python" className="bg-[#1f2229] text-white">python code</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
