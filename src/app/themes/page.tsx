"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { Palette, Check, Sparkles } from "lucide-react";

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

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6" style={{ color: "var(--main-color)" }} />
            <h1 className="text-2xl font-bold tracking-tight">Theme Gallery</h1>
          </div>
          <p className="text-xs font-mono max-w-md" style={{ color: "var(--sub-color)" }}>
            Select from 16 curated themes inspired by iconic mechanical keycap colorways.
          </p>
        </div>

        {/* Live Theme Preview Box */}
        <div
          className="w-full p-6 rounded-2xl shadow-md mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 border"
          style={{
            backgroundColor: "var(--sub-alt-color)",
            borderColor: "transparent",
          }}
        >
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5" style={{ color: "var(--sub-color)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
              Live Theme Preview
            </span>
            <span className="text-xl font-extrabold" style={{ color: "var(--main-color)" }}>
              The quick brown fox jumps over the lazy dog
            </span>
            <span className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
              Current theme applied: <span className="font-bold underline">{themes.find((t) => t.id === themeId)?.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
              text
            </span>
            <span className="px-2.5 py-1 rounded font-bold" style={{ backgroundColor: "var(--main-color)", color: "var(--bg-color)" }}>
              accent
            </span>
            <span className="px-2.5 py-1 rounded font-bold" style={{ backgroundColor: "var(--bg-color)", color: "var(--error-color)" }}>
              error
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: "var(--sub-alt-color)" }}
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                  filter === c ? "font-bold" : "opacity-60"
                }`}
                style={{
                  backgroundColor: filter === c ? "var(--bg-color)" : "transparent",
                  color: filter === c ? "var(--main-color)" : "var(--sub-color)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search themes..."
            className="px-4 py-2 rounded-xl text-xs font-mono outline-none w-full sm:w-64"
            style={{
              backgroundColor: "var(--sub-alt-color)",
              color: "var(--text-color)",
            }}
          />
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredThemes.map((item) => {
            const isSelected = themeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setThemeId(item.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between gap-4 border ${
                  isSelected ? "scale-[1.03] ring-2" : "hover:scale-[1.02]"
                }`}
                style={{
                  backgroundColor: item.bgColor,
                  color: item.textColor,
                  borderColor: isSelected ? item.mainColor : "transparent",
                  outlineColor: item.mainColor,
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm">{item.name}</span>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: item.mainColor, color: item.bgColor }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Color Palette Swatches */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full shadow-inner border border-white/10"
                    style={{ backgroundColor: item.bgColor }}
                    title="Background"
                  />
                  <span
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: item.mainColor }}
                    title="Accent / Main"
                  />
                  <span
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: item.subColor }}
                    title="Sub text"
                  />
                  <span
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: item.textColor }}
                    title="Main text"
                  />
                  <span
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: item.errorColor }}
                    title="Error"
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
