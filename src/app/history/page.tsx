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
      // Guest local history
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

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <HistoryIcon className="w-6 h-6" style={{ color: "var(--main-color)" }} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Test History</h1>
              <p className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
                {user ? `Logged in as ${user.username}` : "Viewing guest session history"}
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: "var(--sub-alt-color)" }}
          >
            <Filter className="w-3.5 h-3.5 mx-2 opacity-50" style={{ color: "var(--sub-color)" }} />
            {["all", "time", "words", "quote"].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                  filterMode === m ? "font-bold" : "opacity-60"
                }`}
                style={{
                  backgroundColor: filterMode === m ? "var(--bg-color)" : "transparent",
                  color: filterMode === m ? "var(--main-color)" : "var(--sub-color)",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
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
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px]">WPM</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px]">Raw</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px]">Accuracy</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px]">Consistency</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px]">Mode</th>
                  <th className="py-3.5 px-6 font-bold uppercase text-[11px] text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--bg-color)" }}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center opacity-60">
                      Loading history...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center opacity-50">
                      No tests found in history. Take a test on the homepage to start recording!
                    </td>
                  </tr>
                ) : (
                  history.map((item, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-black/10">
                      <td className="py-4 px-6 font-bold text-sm" style={{ color: "var(--main-color)" }}>
                        {item.wpm}
                      </td>
                      <td className="py-4 px-6 opacity-80">{item.rawWpm}</td>
                      <td className="py-4 px-6 opacity-80">{item.accuracy}%</td>
                      <td className="py-4 px-6 opacity-80">{item.consistency}%</td>
                      <td className="py-4 px-6 font-semibold">
                        <span className="px-2 py-0.5 rounded text-[11px]" style={{ backgroundColor: "var(--bg-color)" }}>
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
