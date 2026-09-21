"use client";

import React from "react";
import { Clock, Type, Quote as QuoteIcon, Mountain, AtSign, Hash, Wrench, Globe } from "lucide-react";
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
  const timeSubModes = ["15", "30", "60", "120"];
  const wordSubModes = ["10", "25", "50", "100"];
  const quoteSubModes = [
    { id: "all", label: "all" },
    { id: "short", label: "short" },
    { id: "medium", label: "med" },
    { id: "long", label: "long" },
    { id: "thicc", label: "thicc" },
  ];

  return (
    <div
      className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all select-none"
      style={{
        backgroundColor: "var(--sub-alt-color)",
        color: "var(--sub-color)",
      }}
    >
      {/* Modifiers (Punctuation, Numbers) */}
      <div className="flex items-center gap-1">
        <button
          onClick={onTogglePunctuation}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            punctuation ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: punctuation ? "var(--main-color)" : "var(--sub-color)",
          }}
          title="Toggle punctuation"
        >
          <AtSign className="w-3.5 h-3.5" />
          <span>punctuation</span>
        </button>

        <button
          onClick={onToggleNumbers}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            numbers ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: numbers ? "var(--main-color)" : "var(--sub-color)",
          }}
          title="Toggle numbers"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>numbers</span>
        </button>
      </div>

      <div className="w-[1px] h-4" style={{ backgroundColor: "var(--sub-color)", opacity: 0.25 }} />

      {/* Main Modes */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onModeChange("time", "30")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "time" ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: mode === "time" ? "var(--main-color)" : "var(--sub-color)",
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>time</span>
        </button>

        <button
          onClick={() => onModeChange("words", "25")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "words" ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: mode === "words" ? "var(--main-color)" : "var(--sub-color)",
          }}
        >
          <Type className="w-3.5 h-3.5" />
          <span>words</span>
        </button>

        <button
          onClick={() => onModeChange("quote", "medium")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "quote" ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: mode === "quote" ? "var(--main-color)" : "var(--sub-color)",
          }}
        >
          <QuoteIcon className="w-3.5 h-3.5" />
          <span>quote</span>
        </button>

        <button
          onClick={() => onModeChange("zen", "free")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "zen" ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: mode === "zen" ? "var(--main-color)" : "var(--sub-color)",
          }}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>zen</span>
        </button>

        <button
          onClick={() => onModeChange("custom", "custom")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "custom" ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
          }`}
          style={{
            color: mode === "custom" ? "var(--main-color)" : "var(--sub-color)",
          }}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>custom</span>
        </button>
      </div>

      <div className="w-[1px] h-4" style={{ backgroundColor: "var(--sub-color)", opacity: 0.25 }} />

      {/* Sub-modes */}
      {mode === "time" && (
        <div className="flex items-center gap-1">
          {timeSubModes.map((val) => (
            <button
              key={val}
              onClick={() => onSubModeChange(val)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                subMode === val ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                color: subMode === val ? "var(--main-color)" : "var(--sub-color)",
              }}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      {mode === "words" && (
        <div className="flex items-center gap-1">
          {wordSubModes.map((val) => (
            <button
              key={val}
              onClick={() => onSubModeChange(val)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                subMode === val ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                color: subMode === val ? "var(--main-color)" : "var(--sub-color)",
              }}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      {mode === "quote" && (
        <div className="flex items-center gap-1">
          {quoteSubModes.map((q) => (
            <button
              key={q.id}
              onClick={() => onSubModeChange(q.id)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                subMode === q.id ? "opacity-100 font-bold" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                color: subMode === q.id ? "var(--main-color)" : "var(--sub-color)",
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}

      {mode !== "quote" && mode !== "custom" && (
        <>
          <div className="w-[1px] h-4" style={{ backgroundColor: "var(--sub-color)", opacity: 0.25 }} />
          {/* Word List / Language selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 opacity-60" style={{ color: "var(--sub-color)" }} />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as WordListType)}
              className="bg-transparent border-none text-xs font-semibold cursor-pointer outline-none"
              style={{ color: "var(--sub-color)" }}
            >
              <option value="english" className="bg-[#2c2e31] text-white">english 200</option>
              <option value="english_1k" className="bg-[#2c2e31] text-white">english 1k</option>
              <option value="code_javascript" className="bg-[#2c2e31] text-white">javascript</option>
              <option value="code_python" className="bg-[#2c2e31] text-white">python</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
