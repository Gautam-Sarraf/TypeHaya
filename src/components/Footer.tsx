"use client";

import React from "react";
import Link from "next/link";
import { Command, Palette, Volume2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSettings } from "@/context/SettingsContext";

interface FooterProps {
  onOpenCommandPalette: () => void;
}

export function Footer({ onOpenCommandPalette }: FooterProps) {
  const { theme } = useTheme();
  const { settings } = useSettings();

  return (
    <footer className="w-full max-w-6xl mx-auto px-6 py-6 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono select-none opacity-70 hover:opacity-100 transition-opacity">
      {/* Keybind hints */}
      <div className="flex flex-wrap items-center gap-4 text-[11px]" style={{ color: "var(--sub-color)" }}>
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer hover:opacity-100"
          style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--text-color)" }}
          title="Open Command Palette"
        >
          <Command className="w-3 h-3" />
          <span>esc / cmd+k</span>
          <span className="opacity-60 text-[10px]">— commands</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded font-bold"
            style={{ backgroundColor: "var(--sub-alt-color)", color: "var(--text-color)" }}
          >
            tab + enter
          </span>
          <span>restart</span>
        </div>
      </div>

      {/* Quick Settings Badges & Links */}
      <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--sub-color)" }}>
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 cursor-pointer hover:underline"
          title="Change Theme"
        >
          <Palette className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
          <span>{theme.name}</span>
        </button>

        <span className="flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
          <span>{settings.soundPreset.replace("_", " ")}</span>
        </span>

        <div className="w-[1px] h-3.5" style={{ backgroundColor: "var(--sub-color)", opacity: 0.3 }} />

        <Link href="/about" className="hover:underline">
          about
        </Link>
        <Link href="/settings" className="hover:underline">
          settings
        </Link>
      </div>
    </footer>
  );
}
