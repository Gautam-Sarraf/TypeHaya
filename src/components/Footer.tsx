"use client";

import React from "react";
import Link from "next/link";
import { Command, Palette, Volume2, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSettings } from "@/context/SettingsContext";

interface FooterProps {
  onOpenCommandPalette: () => void;
}

export function Footer({ onOpenCommandPalette }: FooterProps) {
  const { theme } = useTheme();
  const { settings } = useSettings();

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono select-none transition-all">
      {/* Keybind hints */}
      <div className="flex flex-wrap items-center gap-3 text-[11px]" style={{ color: "var(--sub-color)" }}>
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer hud-pill shadow-xs"
          style={{ color: "var(--text-color)" }}
          title="Open Command Palette"
        >
          <Command className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
          <span>cmd+k / esc</span>
          <span className="opacity-50 text-[10px]">— command palette</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 opacity-60">
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/20 border border-white/5">
            tab
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/20 border border-white/5">
            enter
          </kbd>
          <span className="text-[10px]">restart</span>
        </div>
      </div>

      {/* Quick Settings Badges & Links */}
      <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--sub-color)" }}>
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-100 transition-opacity"
          title="Change Theme"
        >
          <Palette className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
          <span className="font-semibold" style={{ color: "var(--text-color)" }}>{theme.name}</span>
        </button>

        <span className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 opacity-60" />
          <span className="capitalize">{settings.soundPreset.replace("_", " ")}</span>
        </span>

        <div className="w-[1px] h-3.5 bg-white/10" />

        <Link href="/about" className="hover:opacity-100 opacity-70 transition-opacity">
          about
        </Link>
        <Link href="/settings" className="hover:opacity-100 opacity-70 transition-opacity">
          settings
        </Link>
      </div>
    </footer>
  );
}
