"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from "recharts";
import { EngineStats } from "@/lib/engine";
import { RotateCcw, ArrowRight, BookOpen, Trophy } from "lucide-react";

interface ResultsModalProps {
  stats: EngineStats;
  mode: string;
  subMode: string;
  language: string;
  isPersonalBest?: boolean;
  onNextTest: () => void;
  onRepeatTest: () => void;
  onPracticeMissed?: () => void;
}

export function ResultsModal({
  stats,
  mode,
  subMode,
  language,
  isPersonalBest = false,
  onNextTest,
  onRepeatTest,
  onPracticeMissed,
}: ResultsModalProps) {
  // Trigger confetti burst if personal best achieved
  useEffect(() => {
    if (isPersonalBest) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#e2b714", "#00ffcc", "#bd93f9", "#ff7edb", "#ffffff"],
        });
      } catch {
        // Fallback
      }
    }
  }, [isPersonalBest]);

  // Keyboard shortcut listener for results screen (Tab+Enter, Enter, or Cmd/Ctrl+Enter to restart)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" ||
        ((e.metaKey || e.ctrlKey) && e.key === "Enter") ||
        (e.key === "Tab" && !e.shiftKey)
      ) {
        e.preventDefault();
        onNextTest();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextTest]);

  // Format chart data
  const chartData = stats.timeline.map((item) => ({
    second: item.second,
    wpm: item.wpm,
    rawWpm: item.rawWpm,
    errors: item.errors,
    errorY: item.errors > 0 ? item.rawWpm : null,
  }));

  const hasKeyErrors = Object.keys(stats.keyErrors).length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-4 animate-in fade-in duration-300 select-none px-4">
      {/* Personal Best Banner */}
      {isPersonalBest && (
        <div
          className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-md animate-bounce"
          style={{
            backgroundColor: "var(--main-color)",
            color: "var(--bg-color)",
          }}
        >
          <Trophy className="w-4 h-4" />
          <span>NEW PERSONAL BEST!</span>
        </div>
      )}

      {/* Main Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* WPM Big Display */}
        <div className="flex flex-col">
          <span
            className="text-xs uppercase tracking-wider font-bold opacity-60"
            style={{ color: "var(--sub-color)" }}
          >
            wpm
          </span>
          <span
            className="text-7xl font-extrabold tracking-tight leading-none"
            style={{ color: "var(--main-color)" }}
          >
            {stats.wpm}
          </span>
        </div>

        {/* Accuracy Big Display */}
        <div className="flex flex-col">
          <span
            className="text-xs uppercase tracking-wider font-bold opacity-60"
            style={{ color: "var(--sub-color)" }}
          >
            acc
          </span>
          <span
            className="text-7xl font-extrabold tracking-tight leading-none"
            style={{ color: "var(--text-color)" }}
          >
            {stats.accuracy}%
          </span>
        </div>

        {/* Details Grid */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl shadow-xs" style={{ backgroundColor: "var(--sub-alt-color)" }}>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 block" style={{ color: "var(--sub-color)" }}>
              test type
            </span>
            <span className="text-sm font-bold truncate block" style={{ color: "var(--text-color)" }}>
              {mode} {subMode}
            </span>
            <span className="text-[10px] opacity-50 block truncate" style={{ color: "var(--sub-color)" }}>
              {language}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 block" style={{ color: "var(--sub-color)" }}>
              raw wpm
            </span>
            <span className="text-sm font-bold block" style={{ color: "var(--text-color)" }}>
              {stats.rawWpm}
            </span>
            <span className="text-[10px] opacity-50 block" style={{ color: "var(--sub-color)" }}>
              speed
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 block" style={{ color: "var(--sub-color)" }}>
              characters
            </span>
            <span className="text-sm font-bold block" style={{ color: "var(--text-color)" }}>
              {stats.correctChars}/{stats.incorrectChars}/{stats.extraChars}/{stats.missedChars}
            </span>
            <span className="text-[10px] opacity-50 block" style={{ color: "var(--sub-color)" }}>
              cor/inc/ext/mis
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 block" style={{ color: "var(--sub-color)" }}>
              consistency
            </span>
            <span className="text-sm font-bold block" style={{ color: "var(--text-color)" }}>
              {stats.consistency}%
            </span>
            <span className="text-[10px] opacity-50 block" style={{ color: "var(--sub-color)" }}>
              variance
            </span>
          </div>
        </div>
      </div>

      {/* Signature Performance Chart */}
      <div
        className="w-full h-56 p-4 rounded-xl flex flex-col justify-between"
        style={{ backgroundColor: "var(--sub-alt-color)" }}
      >
        <div className="flex items-center justify-between text-xs font-semibold px-2" style={{ color: "var(--sub-color)" }}>
          <span>WPM & Accuracy Over Time</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--main-color)" }} />
              Net WPM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5" style={{ backgroundColor: "var(--sub-color)" }} />
              Raw WPM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--error-color)" }} />
              Errors
            </span>
          </div>
        </div>

        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="second"
                stroke="var(--sub-color)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--sub-color)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-mono shadow-md border"
                        style={{
                          backgroundColor: "var(--bg-color)",
                          borderColor: "var(--sub-alt-color)",
                          color: "var(--text-color)",
                        }}
                      >
                        <p className="font-bold">{data.second}s</p>
                        <p style={{ color: "var(--main-color)" }}>Net: {data.wpm} wpm</p>
                        <p style={{ color: "var(--sub-color)" }}>Raw: {data.rawWpm} wpm</p>
                        {data.errors > 0 && (
                          <p style={{ color: "var(--error-color)" }}>Errors: {data.errors}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="rawWpm"
                stroke="var(--sub-color)"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="var(--main-color)"
                strokeWidth={3}
                dot={false}
              />
              {/* Errors marker */}
              <Scatter
                data={chartData.filter((d) => d.errors > 0)}
                fill="var(--error-color)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs opacity-50 font-mono" style={{ color: "var(--sub-color)" }}>
            Test completed too quickly to generate timeline
          </div>
        )}
      </div>

      {/* Typos / Key Errors Breakdown */}
      {hasKeyErrors && (
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="opacity-60 font-semibold" style={{ color: "var(--sub-color)" }}>
            key errors:
          </span>
          {Object.entries(stats.keyErrors).map(([key, count]) => (
            <span
              key={key}
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{
                backgroundColor: "var(--sub-alt-color)",
                color: "var(--error-color)",
              }}
            >
              {key === " " ? "space" : key}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={onNextTest}
          className="px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          style={{
            backgroundColor: "var(--main-color)",
            color: "var(--bg-color)",
          }}
          title="Next Test (Tab + Enter or Enter)"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Next Test</span>
        </button>

        <button
          onClick={onRepeatTest}
          className="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: "var(--sub-alt-color)",
            color: "var(--text-color)",
          }}
          title="Repeat Same Test"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Repeat</span>
        </button>

        {onPracticeMissed && hasKeyErrors && (
          <button
            onClick={onPracticeMissed}
            className="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: "var(--sub-alt-color)",
              color: "var(--main-color)",
            }}
            title="Practice Missed Words"
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Missed</span>
          </button>
        )}
      </div>
    </div>
  );
}
