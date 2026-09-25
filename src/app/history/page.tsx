"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { History as HistoryIcon, Filter } from "lucide-react";

interface TestHistoryItem {
  id?: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  mode: string;
  subMode: string;
  language?: string;
  duration: number;
  createdAt: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [filterMode, setFilterMode] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user, filterMode]);

  const fetchHistory = async () => {
    setIsLoading(true);
    if (user) {
      try {
        const url = filterMode === "all" ? "/api/results" : `/api/results?mode=${filterMode}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setHistory(data.results || []);
        }
      } catch {
        setHistory([]);
      }
    } else {
      try {
        const guestData = localStorage.getItem("typehaya_guest_history");
        if (guestData) {
          const parsed: TestHistoryItem[] = JSON.parse(guestData);
          if (filterMode === "all") {
            setHistory(parsed);
          } else {
            setHistory(parsed.filter((item) => item.mode === filterMode));
          }
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      }
    }
    setIsLoading(false);
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
                border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <HistoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-display">Session Flight Log</h1>
              <p className="text-xs font-mono opacity-60 mt-0.5" style={{ color: "var(--sub-color)" }}>
                {user ? `Authenticated profile: ${user.username}` : "Local guest memory stream"}
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl hud-glass shadow-lg">
            <Filter className="w-3.5 h-3.5 mx-2 opacity-50" style={{ color: "var(--sub-color)" }} />
            {["all", "time", "words", "quote"].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold capitalize cursor-pointer transition-all ${
                  filterMode === m ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: filterMode === m ? "var(--main-color)" : "transparent",
                  color: filterMode === m ? "var(--bg-color)" : "var(--sub-color)",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* History Table Card */}
        <div className="w-full rounded-3xl overflow-hidden hud-glass shadow-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/20" style={{ color: "var(--sub-color)" }}>
                  <th className="py-4 px-6 font-bold uppercase text-[11px]">Net WPM</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px]">Raw</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px]">Accuracy</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px]">Consistency</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px]">Configuration</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center opacity-60 font-mono">
                      Querying flight records...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center opacity-50 font-mono">
                      No sessions logged yet. Engage in typing tests on the homepage to start recording!
                    </td>
                  </tr>
                ) : (
                  history.map((item, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-white/5">
                      <td className="py-4 px-6 font-extrabold text-base font-display" style={{ color: "var(--main-color)" }}>
                        {item.wpm}
                      </td>
                      <td className="py-4 px-6 opacity-80">{item.rawWpm}</td>
                      <td className="py-4 px-6 opacity-90 font-semibold">{item.accuracy}%</td>
                      <td className="py-4 px-6 opacity-80">{item.consistency}%</td>
                      <td className="py-4 px-6 font-semibold">
                        <span className="px-2.5 py-1 rounded-xl text-[11px] bg-black/20 border border-white/5 uppercase">
                          {item.mode} {item.subMode}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right opacity-50 text-[11px]">
                        {new Date(item.createdAt).toLocaleString()}
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
