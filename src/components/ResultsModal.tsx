"use client";

import React, { useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from "recharts";
import { EngineStats } from "@/lib/engine";
import {
  RotateCcw,
  ArrowRight,
  BookOpen,
  Trophy,
  Zap,
  Target,
  Shield,
  Activity,
  Layers,
} from "lucide-react";

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
  // Trigger confetti burst on personal best
  useEffect(() => {
    if (isPersonalBest) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ["#00f2fe", "#4facfe", "#ff0844", "#ffb199", "#ffffff"],
        });
      } catch {
        // Fallback
      }
    }
  }, [isPersonalBest]);

  // Keyboard shortcut listener for results
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

  // Rank Calculation
  const rankTier = useMemo(() => {
    const wpm = stats.wpm;
    if (wpm >= 140) return { title: "Quantum Luminary", badge: "Tier S+", color: "#00ffcc" };
    if (wpm >= 110) return { title: "Hypersonic Master", badge: "Tier S", color: "#bd93f9" };
    if (wpm >= 85) return { title: "Apex Speedster", badge: "Tier A", color: "#e2b714" };
    if (wpm >= 65) return { title: "Velocity Pro", badge: "Tier B", color: "#61afef" };
    if (wpm >= 45) return { title: "Swift Operator", badge: "Tier C", color: "#7b9c98" };
    return { title: "Apprentice Typist", badge: "Tier D", color: "#94a3b8" };
  }, [stats.wpm]);

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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-4 animate-in fade-in zoom-in-95 duration-300 select-none px-2 sm:px-4">
      {/* Header Banner: Personal Best or Rank Tier */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl hud-glass shadow-lg border border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              color: "var(--main-color)",
            }}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold font-mono tracking-widest opacity-60" style={{ color: "var(--sub-color)" }}>
              Performance Assessment
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-display" style={{ color: rankTier.color }}>
                {rankTier.title}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase border"
                style={{
                  backgroundColor: `color-mix(in srgb, ${rankTier.color} 15%, transparent)`,
                  color: rankTier.color,
                  borderColor: `color-mix(in srgb, ${rankTier.color} 30%, transparent)`,
                }}
              >
                {rankTier.badge}
              </span>
            </div>
          </div>
        </div>

        {isPersonalBest && (
          <div
            className="px-4 py-1.5 rounded-xl flex items-center gap-2 font-bold text-xs shadow-md animate-pulse border"
            style={{
              backgroundColor: "var(--main-color)",
              color: "var(--bg-color)",
              borderColor: "var(--main-color)",
            }}
          >
            <Trophy className="w-4 h-4" />
            <span className="font-mono uppercase tracking-wider">New Personal Best!</span>
          </div>
        )}
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Net WPM Card */}
        <div className="p-5 rounded-2xl hud-card flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Net WPM
            </span>
            <Zap className="w-4 h-4" style={{ color: "var(--main-color)" }} />
          </div>
          <span
            className="text-5xl sm:text-6xl font-extrabold font-display tracking-tight leading-none my-1"
            style={{ color: "var(--main-color)" }}
          >
            {stats.wpm}
          </span>
          <span className="text-[11px] font-mono opacity-50" style={{ color: "var(--sub-color)" }}>
            words per minute
          </span>
        </div>

        {/* Accuracy Card */}
        <div className="p-5 rounded-2xl hud-card flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Accuracy
            </span>
            <Target className="w-4 h-4" style={{ color: "var(--text-color)" }} />
          </div>
          <span
            className="text-5xl sm:text-6xl font-extrabold font-display tracking-tight leading-none my-1"
            style={{ color: "var(--text-color)" }}
          >
            {stats.accuracy}%
          </span>
          <span className="text-[11px] font-mono opacity-50" style={{ color: "var(--sub-color)" }}>
            precision rate
          </span>
        </div>

        {/* Raw Speed & Consistency Card */}
        <div className="p-5 rounded-2xl hud-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Raw Speed
            </span>
            <Activity className="w-4 h-4" style={{ color: "var(--sub-color)" }} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-display" style={{ color: "var(--text-color)" }}>
              {stats.rawWpm}
            </span>
            <span className="text-xs font-mono font-bold opacity-60" style={{ color: "var(--sub-color)" }}>
              raw wpm
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="opacity-60" style={{ color: "var(--sub-color)" }}>Consistency:</span>
            <span className="font-bold" style={{ color: "var(--main-color)" }}>{stats.consistency}%</span>
          </div>
        </div>

        {/* Character Breakdown & Details Card */}
        <div className="p-5 rounded-2xl hud-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Characters
            </span>
            <Layers className="w-4 h-4" style={{ color: "var(--sub-color)" }} />
          </div>
          <div className="flex items-center gap-2 font-mono text-sm font-bold">
            <span className="text-emerald-400" title="Correct characters">{stats.correctChars}</span>
            <span className="opacity-30">/</span>
            <span style={{ color: "var(--error-color)" }} title="Incorrect characters">{stats.incorrectChars}</span>
            <span className="opacity-30">/</span>
            <span className="opacity-60" title="Extra characters">{stats.extraChars}</span>
            <span className="opacity-30">/</span>
            <span className="opacity-40" title="Missed characters">{stats.missedChars}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="opacity-60 capitalize" style={{ color: "var(--sub-color)" }}>{mode} {subMode}:</span>
            <span className="font-bold truncate max-w-[90px]" style={{ color: "var(--text-color)" }}>{language}</span>
          </div>
        </div>
      </div>

      {/* Cyber Neon Velocity Timeline Chart */}
      <div className="w-full p-5 rounded-3xl hud-glass flex flex-col justify-between gap-4 shadow-xl border border-white/5">
        <div className="flex flex-wrap items-center justify-between text-xs font-mono px-2" style={{ color: "var(--sub-color)" }}>
          <span className="font-bold uppercase tracking-wider">Velocity & Error Stream</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--main-color)", boxShadow: "0 0 6px var(--main-color)" }} />
              Net Speed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5" style={{ backgroundColor: "var(--sub-color)" }} />
              Raw Speed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--error-color)" }} />
              Errors
            </span>
          </div>
        </div>

        {chartData.length > 1 ? (
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--main-color)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--main-color)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="second"
                  stroke="var(--sub-color)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="s"
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
                          className="px-3.5 py-2.5 rounded-xl text-xs font-mono shadow-2xl border backdrop-blur-md"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--sub-alt-color) 95%, transparent)",
                            borderColor: "color-mix(in srgb, var(--sub-color) 30%, transparent)",
                            color: "var(--text-color)",
                          }}
                        >
                          <p className="font-bold mb-1 opacity-70">{data.second}s timestamp</p>
                          <p style={{ color: "var(--main-color)" }} className="font-bold">Net: {data.wpm} WPM</p>
                          <p style={{ color: "var(--sub-color)" }}>Raw: {data.rawWpm} WPM</p>
                          {data.errors > 0 && (
                            <p style={{ color: "var(--error-color)" }} className="font-bold">Errors: {data.errors}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="wpm"
                  stroke="var(--main-color)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#wpmGradient)"
                />
                <Scatter
                  data={chartData.filter((d) => d.errors > 0)}
                  fill="var(--error-color)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-xs opacity-50 font-mono" style={{ color: "var(--sub-color)" }}>
            Test completed too fast for timeline sampling
          </div>
        )}
      </div>

      {/* Keystroke Errors Breakdown Chips */}
      {hasKeyErrors && (
        <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl hud-glass text-xs font-mono border border-white/5">
          <span className="opacity-60 font-semibold" style={{ color: "var(--sub-color)" }}>
            Key Bottlenecks:
          </span>
          {Object.entries(stats.keyErrors).map(([key, count]) => (
            <span
              key={key}
              className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--error-color) 12%, transparent)",
                borderColor: "color-mix(in srgb, var(--error-color) 25%, transparent)",
                color: "var(--error-color)",
              }}
            >
              <kbd className="font-mono uppercase">{key === " " ? "space" : key}</kbd>
              <span className="opacity-60 text-[10px]">×{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Modern Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <button
          onClick={onNextTest}
          className="px-7 py-3 rounded-2xl font-bold font-mono text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
          style={{
            backgroundColor: "var(--main-color)",
            color: "var(--bg-color)",
            boxShadow: "0 0 20px color-mix(in srgb, var(--main-color) 35%, transparent)",
          }}
          title="Next Test (Enter or Tab)"
        >
          <span>Next Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRepeatTest}
          className="px-6 py-3 rounded-2xl font-bold font-mono text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer hud-pill"
          style={{
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
            className="px-6 py-3 rounded-2xl font-bold font-mono text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer hud-pill"
            style={{
              color: "var(--main-color)",
              borderColor: "color-mix(in srgb, var(--main-color) 30%, transparent)",
            }}
            title="Drill Missed Words"
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Errors</span>
          </button>
        )}
      </div>
    </div>
  );
}
