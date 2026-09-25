"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart2,
  Trophy,
  Flame,
  Clock,
  Target,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface StatsSummary {
  totalTests: number;
  totalDurationSeconds: number;
  highestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  personalBests: Array<{
    mode: string;
    subMode: string;
    wpm: number;
    rawWpm: number;
    accuracy: number;
  }>;
  recentHistory: Array<{
    wpm: number;
    accuracy: number;
    createdAt: string;
  }>;
}

export default function StatsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSummary();
    } else {
      computeGuestStats();
    }
  }, [user]);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stats/summary");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const computeGuestStats = () => {
    try {
      const guestHistoryStr = localStorage.getItem("typehaya_guest_history");
      const history = guestHistoryStr ? JSON.parse(guestHistoryStr) : [];
      let totalDuration = 0;
      let sumWpm = 0;
      let sumAcc = 0;
      let highest = 0;

      const pbs: Record<string, { mode: string; subMode: string; wpm: number; rawWpm: number; accuracy: number }> = {};

      history.forEach((item: { wpm: number; rawWpm: number; accuracy: number; duration: number; mode: string; subMode: string }) => {
        totalDuration += item.duration || 0;
        sumWpm += item.wpm;
        sumAcc += item.accuracy;
        if (item.wpm > highest) highest = item.wpm;

        const key = `${item.mode}_${item.subMode}`;
        if (!pbs[key] || item.wpm > pbs[key].wpm) {
          pbs[key] = {
            mode: item.mode,
            subMode: item.subMode,
            wpm: item.wpm,
            rawWpm: item.rawWpm,
            accuracy: item.accuracy,
          };
        }
      });

      setStats({
        totalTests: history.length,
        totalDurationSeconds: Math.round(totalDuration),
        highestWpm: highest,
        avgWpm: history.length > 0 ? Math.round(sumWpm / history.length) : 0,
        avgAccuracy: history.length > 0 ? Math.round((sumAcc / history.length) * 10) / 10 : 0,
        personalBests: Object.values(pbs),
        recentHistory: history.slice(0, 15).reverse(),
      });
    } catch {
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Title & Auth notice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                  color: "var(--main-color)",
                  border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
                }}
              >
                <BarChart2 className="w-5 h-5" />
              </div>
              {user ? `${user.username}'s Telemetry` : "Guest Telemetry"}
            </h1>
            <p className="text-xs font-mono opacity-60 mt-1" style={{ color: "var(--sub-color)" }}>
              Detailed analytics of your velocity curves, accuracy consistency, and personal bests.
            </p>
          </div>

          {!user && (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 hud-pill"
              style={{
                color: "var(--main-color)",
              }}
            >
              <span>Sign in to backup records</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl hud-card flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-mono" style={{ color: "var(--sub-color)" }}>
              <Flame className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
              Peak Velocity
            </span>
            <span className="text-4xl font-extrabold font-display my-1" style={{ color: "var(--main-color)" }}>
              {stats?.highestWpm || 0}
            </span>
            <span className="text-[10px] font-mono opacity-50">all-time best speed</span>
          </div>

          <div className="p-5 rounded-2xl hud-card flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-mono" style={{ color: "var(--sub-color)" }}>
              <TrendingUp className="w-3.5 h-3.5" />
              Mean Speed
            </span>
            <span className="text-4xl font-extrabold font-display my-1" style={{ color: "var(--text-color)" }}>
              {stats?.avgWpm || 0}
            </span>
            <span className="text-[10px] font-mono opacity-50">average net wpm</span>
          </div>

          <div className="p-5 rounded-2xl hud-card flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-mono" style={{ color: "var(--sub-color)" }}>
              <Target className="w-3.5 h-3.5" />
              Mean Accuracy
            </span>
            <span className="text-4xl font-extrabold font-display my-1" style={{ color: "var(--text-color)" }}>
              {stats?.avgAccuracy || 0}%
            </span>
            <span className="text-[10px] font-mono opacity-50">precision rate</span>
          </div>

          <div className="p-5 rounded-2xl hud-card flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-mono" style={{ color: "var(--sub-color)" }}>
              <Clock className="w-3.5 h-3.5" />
              Flight Time
            </span>
            <span className="text-3xl font-extrabold font-display my-1" style={{ color: "var(--text-color)" }}>
              {formatDuration(stats?.totalDurationSeconds || 0)}
            </span>
            <span className="text-[10px] font-mono opacity-50">{stats?.totalTests || 0} tests finished</span>
          </div>
        </div>

        {/* Speed Progress Chart */}
        <div className="w-full p-6 rounded-3xl hud-glass shadow-xl mb-8 flex flex-col gap-4 border border-white/5">
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: "var(--main-color)" }} />
              Velocity Progression
            </h2>
            <span className="text-xs opacity-50" style={{ color: "var(--sub-color)" }}>
              Recent 15 Runs
            </span>
          </div>

          {stats?.recentHistory && stats.recentHistory.length > 1 ? (
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentHistory}>
                  <defs>
                    <linearGradient id="statsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--main-color)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--main-color)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="createdAt" hide />
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
                            className="px-3.5 py-2 rounded-xl text-xs font-mono shadow-2xl border backdrop-blur-md"
                            style={{
                              backgroundColor: "color-mix(in srgb, var(--sub-alt-color) 95%, transparent)",
                              borderColor: "color-mix(in srgb, var(--sub-color) 30%, transparent)",
                              color: "var(--text-color)",
                            }}
                          >
                            <p style={{ color: "var(--main-color)" }} className="font-bold">{data.wpm} WPM</p>
                            <p className="opacity-70">{data.accuracy}% acc</p>
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
                    fill="url(#statsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="w-full h-32 flex items-center justify-center text-xs opacity-50 font-mono" style={{ color: "var(--sub-color)" }}>
              Complete at least 2 tests to visualize your progress curve.
            </div>
          )}
        </div>

        {/* Personal Bests Table Card */}
        <div className="w-full rounded-3xl overflow-hidden hud-glass shadow-xl border border-white/5">
          <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-black/20">
            <Trophy className="w-4 h-4" style={{ color: "var(--main-color)" }} />
            <h2 className="text-sm font-bold font-display">Personal Bests Matrix</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10" style={{ color: "var(--sub-color)" }}>
                  <th className="py-3.5 px-6 font-bold uppercase text-[10px]">Mode</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[10px]">Sub-Mode</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[10px] text-right">Best WPM</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[10px] text-right">Raw WPM</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[10px] text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.personalBests && stats.personalBests.length > 0 ? (
                  stats.personalBests.map((pb, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-6 font-semibold uppercase">{pb.mode}</td>
                      <td className="py-3.5 px-6">{pb.subMode}</td>
                      <td className="py-3.5 px-6 text-right font-extrabold text-sm font-display" style={{ color: "var(--main-color)" }}>
                        {pb.wpm}
                      </td>
                      <td className="py-3.5 px-6 text-right opacity-80">{pb.rawWpm}</td>
                      <td className="py-3.5 px-6 text-right opacity-80">{pb.accuracy}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center opacity-50">
                      No personal bests recorded yet. Take tests in different modes to set your records!
                    </td>
                  </tr>
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
