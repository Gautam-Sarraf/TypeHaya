"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trophy, Medal, Clock, Type } from "lucide-react";

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
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-400 inline" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300 inline" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 inline" />;
    return <span className="font-bold opacity-60">#{rank}</span>;
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {/* Title & Description */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6" style={{ color: "var(--main-color)" }} />
            <h1 className="text-2xl font-bold tracking-tight">Global Leaderboards</h1>
          </div>
          <p className="text-xs max-w-md font-mono" style={{ color: "var(--sub-color)" }}>
            Top verified typing speeds ranked by WPM across standard test categories.
          </p>
        </div>

        {/* Categories Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div
            className="flex items-center gap-1 p-1 rounded-xl shadow-xs"
            style={{ backgroundColor: "var(--sub-alt-color)" }}
          >
            <button
              onClick={() => {
                setMode("time");
                setSubMode("15");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === "time" && subMode === "15" ? "font-bold" : "opacity-60"
              }`}
              style={{
                backgroundColor: mode === "time" && subMode === "15" ? "var(--bg-color)" : "transparent",
                color: mode === "time" && subMode === "15" ? "var(--main-color)" : "var(--sub-color)",
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === "time" && subMode === "60" ? "font-bold" : "opacity-60"
              }`}
              style={{
                backgroundColor: mode === "time" && subMode === "60" ? "var(--bg-color)" : "transparent",
                color: mode === "time" && subMode === "60" ? "var(--main-color)" : "var(--sub-color)",
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === "words" && subMode === "25" ? "font-bold" : "opacity-60"
              }`}
              style={{
                backgroundColor: mode === "words" && subMode === "25" ? "var(--bg-color)" : "transparent",
                color: mode === "words" && subMode === "25" ? "var(--main-color)" : "var(--sub-color)",
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === "words" && subMode === "50" ? "font-bold" : "opacity-60"
              }`}
              style={{
                backgroundColor: mode === "words" && subMode === "50" ? "var(--bg-color)" : "transparent",
                color: mode === "words" && subMode === "50" ? "var(--main-color)" : "var(--sub-color)",
              }}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Words 50</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div
          className="w-full rounded-2xl overflow-hidden shadow-md border"
          style={{
            backgroundColor: "var(--sub-alt-color)",
            borderColor: "transparent",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--bg-color)", color: "var(--sub-color)" }}>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px] w-20">Rank</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px]">User</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px] text-right">WPM</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px] text-right">Raw</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px] text-right">Accuracy</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px] text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--bg-color)" }}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center opacity-60">
                      Loading rankings...
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center opacity-50">
                      No scores recorded yet for {mode} {subMode}. Be the first to claim rank #1!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((row) => (
                    <tr
                      key={row.rank}
                      className="transition-colors hover:bg-black/10"
                    >
                      <td className="py-4 px-6">{getRankBadge(row.rank)}</td>
                      <td className="py-4 px-6 font-bold font-sans flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--main-color)",
                          }}
                        >
                          {row.username.charAt(0).toUpperCase()}
                        </div>
                        <span>{row.username}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-sm" style={{ color: "var(--main-color)" }}>
                        {row.wpm}
                      </td>
                      <td className="py-4 px-6 text-right opacity-80">{row.rawWpm}</td>
                      <td className="py-4 px-6 text-right opacity-80">{row.accuracy}%</td>
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
