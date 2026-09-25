"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trophy, Medal, Clock, Type, Shield, Sparkles } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string | null;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  date: string;
}

export default function LeaderboardsPage() {
  const [mode, setMode] = useState<"time" | "words">("time");
  const [subMode, setSubMode] = useState("60");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [mode, subMode]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leaderboards?mode=${mode}&subMode=${subMode}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch {
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="flex items-center gap-1 font-bold text-amber-300">
          <Medal className="w-5 h-5 text-amber-300 inline drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
          <span>#1</span>
        </div>
      );
    if (rank === 2)
      return (
        <div className="flex items-center gap-1 font-bold text-slate-300">
          <Medal className="w-5 h-5 text-slate-300 inline drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />
          <span>#2</span>
        </div>
      );
    if (rank === 3)
      return (
        <div className="flex items-center gap-1 font-bold text-amber-600">
          <Medal className="w-5 h-5 text-amber-600 inline drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
          <span>#3</span>
        </div>
      );
    return <span className="font-bold opacity-60 font-mono">#{rank}</span>;
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Title & Description */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
                border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Global Arena Rankings</h1>
          </div>
          <p className="text-xs max-w-md font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
            Verified velocity records ranked by Net WPM across standard test benchmarks.
          </p>
        </div>

        {/* Categories Selector Deck */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-1 p-1.5 rounded-2xl hud-glass shadow-lg">
            <button
              onClick={() => {
                setMode("time");
                setSubMode("15");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === "time" && subMode === "15" ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: mode === "time" && subMode === "15" ? "var(--main-color)" : "transparent",
                color: mode === "time" && subMode === "15" ? "var(--bg-color)" : "var(--sub-color)",
              }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time 15s</span>
            </button>

            <button
              onClick={() => {
                setMode("time");
                setSubMode("60");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === "time" && subMode === "60" ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: mode === "time" && subMode === "60" ? "var(--main-color)" : "transparent",
                color: mode === "time" && subMode === "60" ? "var(--bg-color)" : "var(--sub-color)",
              }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time 60s</span>
            </button>

            <button
              onClick={() => {
                setMode("words");
                setSubMode("25");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === "words" && subMode === "25" ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: mode === "words" && subMode === "25" ? "var(--main-color)" : "transparent",
                color: mode === "words" && subMode === "25" ? "var(--bg-color)" : "var(--sub-color)",
              }}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Words 25</span>
            </button>

            <button
              onClick={() => {
                setMode("words");
                setSubMode("50");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === "words" && subMode === "50" ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: mode === "words" && subMode === "50" ? "var(--main-color)" : "transparent",
                color: mode === "words" && subMode === "50" ? "var(--bg-color)" : "var(--sub-color)",
              }}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Words 50</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="w-full rounded-3xl overflow-hidden hud-glass shadow-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/20" style={{ color: "var(--sub-color)" }}>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] w-24">Rank</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px]">Pilot / User</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] text-right">Net WPM</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] text-right">Raw</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] text-right">Accuracy</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] text-right">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center opacity-60 font-mono">
                      Synchronizing leaderboards...
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center opacity-50 font-mono">
                      No records established yet for {mode} {subMode}. Step into the arena and claim #1!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((row) => (
                    <tr
                      key={row.rank}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="py-4 px-6">{getRankBadge(row.rank)}</td>
                      <td className="py-4 px-6 font-bold font-sans flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border"
                          style={{
                            backgroundColor: "var(--sub-alt-color)",
                            borderColor: "color-mix(in srgb, var(--main-color) 30%, transparent)",
                            color: "var(--main-color)",
                          }}
                        >
                          {row.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold">{row.username}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-base font-display" style={{ color: "var(--main-color)" }}>
                        {row.wpm}
                      </td>
                      <td className="py-4 px-6 text-right opacity-80">{row.rawWpm}</td>
                      <td className="py-4 px-6 text-right font-semibold opacity-90">{row.accuracy}%</td>
                      <td className="py-4 px-6 text-right opacity-50 text-[11px]">
                        {new Date(row.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
