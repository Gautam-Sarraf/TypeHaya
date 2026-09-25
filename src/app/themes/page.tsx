"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { Palette, Check, Sparkles, Search } from "lucide-react";

export default function ThemesPage() {
  const { themes, themeId, setThemeId } = useTheme();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const categories = ["all", "dark", "light", "vibrant", "retro"];

  const filteredThemes = themes.filter((t) => {
    const matchesCat = filter === "all" || t.category === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
                border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Aesthetic Colorways</h1>
          </div>
          <p className="text-xs font-mono max-w-md opacity-60" style={{ color: "var(--sub-color)" }}>
            Select from {themes.length} curated theme colorways designed for high-contrast precision typing.
          </p>
        </div>

        {/* Interactive Live Theme Preview Stage */}
        <div
          className="w-full p-6 sm:p-8 rounded-3xl hud-glass shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5"
        >
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono flex items-center justify-center md:justify-start gap-2" style={{ color: "var(--sub-color)" }}>
              <Sparkles className="w-4 h-4" style={{ color: "var(--main-color)" }} />
              Live Stage Calibration
            </span>
            <span className="text-2xl font-extrabold font-display" style={{ color: "var(--main-color)" }}>
              The quick brown fox jumps over the lazy dog
            </span>
            <span className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Active profile: <span className="font-bold underline text-[var(--text-color)]">{themes.find((t) => t.id === themeId)?.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl border border-white/10" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
              text tone
            </span>
            <span className="px-3 py-1.5 rounded-xl font-bold shadow-md" style={{ backgroundColor: "var(--main-color)", color: "var(--bg-color)" }}>
              accent glow
            </span>
            <span className="px-3 py-1.5 rounded-xl font-bold border border-red-500/30" style={{ backgroundColor: "var(--bg-color)", color: "var(--error-color)" }}>
              error tag
            </span>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 p-1.5 rounded-2xl hud-glass shadow-lg">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold capitalize cursor-pointer transition-all ${
                  filter === c ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: filter === c ? "var(--main-color)" : "transparent",
                  color: filter === c ? "var(--bg-color)" : "var(--sub-color)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" style={{ color: "var(--sub-color)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl text-xs font-mono outline-none hud-glass border border-white/5"
              style={{
                color: "var(--text-color)",
              }}
            />
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredThemes.map((item) => {
            const isSelected = themeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setThemeId(item.id)}
                className={`p-5 rounded-3xl text-left transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between gap-5 border relative overflow-hidden group ${
                  isSelected
                    ? "scale-[1.03] ring-2 shadow-2xl"
                    : "hover:scale-[1.02] hover:-translate-y-1"
                }`}
                style={{
                  backgroundColor: item.bgColor,
                  color: item.textColor,
                  borderColor: isSelected ? item.mainColor : "color-mix(in srgb, var(--sub-color) 20%, transparent)",
                  boxShadow: isSelected ? `0 0 25px color-mix(in srgb, ${item.mainColor} 30%, transparent)` : undefined,
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm font-display tracking-tight">{item.name}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 capitalize">{item.category}</span>
                  </div>

                  {isSelected ? (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: item.mainColor, color: item.bgColor }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full border opacity-40 group-hover:opacity-100"
                      style={{ borderColor: item.mainColor }}
                    />
                  )}
                </div>

                {/* Color Palette Swatches */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/30 border border-white/5">
                  <span
                    className="w-5 h-5 rounded-full shadow-inner border border-white/10"
                    style={{ backgroundColor: item.bgColor }}
                    title="Canvas Base"
                  />
                  <span
                    className="w-5 h-5 rounded-full shadow-md"
                    style={{ backgroundColor: item.mainColor }}
                    title="Accent Glow"
                  />
                  <span
                    className="w-5 h-5 rounded-full shadow-inner"
                    style={{ backgroundColor: item.subColor }}
                    title="Sub text"
                  />
                  <span
                    className="w-5 h-5 rounded-full shadow-inner"
                    style={{ backgroundColor: item.textColor }}
                    title="Main text"
                  />
                  <span
                    className="w-5 h-5 rounded-full shadow-inner"
                    style={{ backgroundColor: item.errorColor }}
                    title="Error warning"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
