"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSettings } from "@/context/SettingsContext";
import { Search, Palette, Volume2, Clock, Type, X } from "lucide-react";

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
      icon: React.ComponentType<{ className?: string }>;
      active?: boolean;
    }> = [];

    // Themes
    themes.forEach((t) => {
      list.push({
        id: `theme-${t.id}`,
        category: "Themes",
        label: `Theme: ${t.name}`,
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
      { id: "off", label: "Sound: Off" },
      { id: "cherry_blue", label: "Sound: Cherry MX Blue (Clicky)" },
      { id: "cherry_brown", label: "Sound: Cherry MX Brown (Tactile)" },
      { id: "pop", label: "Sound: Bubble Pop" },
      { id: "typewriter", label: "Sound: Typewriter" },
    ];
    sounds.forEach((s) => {
      list.push({
        id: `sound-${s.id}`,
        category: "Sounds",
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
        category: "Modes",
        label: "Switch to Time Mode",
        action: () => {
          onSelectMode("time");
          onClose();
        },
        icon: Clock,
      });
      list.push({
        id: "mode-words",
        category: "Modes",
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
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [themes, themeId, setThemeId, settings.soundPreset, updateSetting, onSelectMode, query, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 backdrop-blur-xs transition-all animate-in fade-in duration-150"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[500px]"
        style={{
          backgroundColor: "var(--bg-color)",
          borderColor: "var(--sub-alt-color)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: "var(--sub-alt-color)" }}
        >
          <Search className="w-5 h-5 opacity-60" style={{ color: "var(--sub-color)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search themes..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm placeholder:opacity-40"
            style={{ color: "var(--text-color)" }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
            style={{ color: "var(--sub-color)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Items List */}
        <div className="overflow-y-auto p-2 flex flex-col gap-1 max-h-96 font-mono text-xs">
          {items.length === 0 ? (
            <div className="p-8 text-center opacity-50 font-mono text-xs" style={{ color: "var(--sub-color)" }}>
              No commands found matching &quot;{query}&quot;
            </div>
          ) : (
            items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    item.active ? "font-bold" : "hover:bg-black/10"
                  }`}
                  style={{
                    backgroundColor: item.active ? "var(--sub-alt-color)" : "transparent",
                    color: item.active ? "var(--main-color)" : "var(--text-color)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 opacity-70" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold opacity-40" style={{ color: "var(--sub-color)" }}>
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
