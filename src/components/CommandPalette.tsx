"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSettings } from "@/context/SettingsContext";
import { Search, Palette, Volume2, Clock, Type, X, Sparkles } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode?: (mode: "time" | "words" | "quote" | "zen") => void;
}

export function CommandPalette({ isOpen, onClose, onSelectMode }: CommandPaletteProps) {
  const { themes, themeId, setThemeId } = useTheme();
  const { settings, updateSetting } = useSettings();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside command palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items = useMemo(() => {
    const list: Array<{
      id: string;
      category: string;
      label: string;
      action: () => void;
      icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
      active?: boolean;
    }> = [];

    // Themes
    themes.forEach((t) => {
      list.push({
        id: `theme-${t.id}`,
        category: "Theme Colorways",
        label: `${t.name}`,
        action: () => {
          setThemeId(t.id);
          onClose();
        },
        icon: Palette,
        active: themeId === t.id,
      });
    });

    // Sound Presets
    const sounds: Array<{ id: typeof settings.soundPreset; label: string }> = [
      { id: "off", label: "Sound: Off (Mute)" },
      { id: "cherry_blue", label: "Sound: Cherry MX Blue (Clicky)" },
      { id: "cherry_brown", label: "Sound: Cherry MX Brown (Tactile)" },
      { id: "pop", label: "Sound: Bubble Pop" },
      { id: "typewriter", label: "Sound: Vintage Typewriter" },
    ];
    sounds.forEach((s) => {
      list.push({
        id: `sound-${s.id}`,
        category: "Acoustics",
        label: s.label,
        action: () => {
          updateSetting("soundPreset", s.id);
          onClose();
        },
        icon: Volume2,
        active: settings.soundPreset === s.id,
      });
    });

    // Test Modes
    if (onSelectMode) {
      list.push({
        id: "mode-time",
        category: "Test Modes",
        label: "Switch to Time Mode",
        action: () => {
          onSelectMode("time");
          onClose();
        },
        icon: Clock,
      });
      list.push({
        id: "mode-words",
        category: "Test Modes",
        label: "Switch to Words Mode",
        action: () => {
          onSelectMode("words");
          onClose();
        },
        icon: Type,
      });
    }

    if (!query) return list;
    return list.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [themes, themeId, setThemeId, settings.soundPreset, updateSetting, onSelectMode, query, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 backdrop-blur-md transition-all animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border flex flex-col max-h-[520px] hud-glass border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/20"
        >
          <Search className="w-5 h-5 opacity-60" style={{ color: "var(--main-color)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search themes, sounds..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm placeholder:opacity-40"
            style={{ color: "var(--text-color)" }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl opacity-60 hover:opacity-100 cursor-pointer"
            style={{ color: "var(--sub-color)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Items List */}
        <div className="overflow-y-auto p-2 flex flex-col gap-1 max-h-96 font-mono text-xs">
          {items.length === 0 ? (
            <div className="p-10 text-center opacity-50 font-mono text-xs" style={{ color: "var(--sub-color)" }}>
              No commands found matching &quot;{query}&quot;
            </div>
          ) : (
            items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                    item.active
                      ? "font-bold shadow-xs scale-[1.01]"
                      : "hover:bg-white/5 opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: item.active
                      ? "color-mix(in srgb, var(--main-color) 15%, transparent)"
                      : "transparent",
                    color: item.active ? "var(--main-color)" : "var(--text-color)",
                    border: item.active
                      ? "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)"
                      : "1px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" style={{ color: item.active ? "var(--main-color)" : "var(--sub-color)" }} />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-black/20 border border-white/5 opacity-60">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
