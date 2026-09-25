"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { soundEngine } from "@/lib/sound";

export type CaretStyle = "line" | "block" | "underline" | "outline" | "bar";
export type CaretAnimation = "smooth" | "blink" | "pulse" | "off";
export type SoundPreset = "off" | "cherry_blue" | "cherry_brown" | "pop" | "typewriter";
export type QuickRestartKey = "tabEnter" | "tab" | "esc";

export interface SettingsState {
  caretStyle: CaretStyle;
  caretAnimation: CaretAnimation;
  soundPreset: SoundPreset;
  soundVolume: number;
  isMuted: boolean;
  quickRestart: QuickRestartKey;
  blindMode: boolean;
  confidenceMode: boolean;
  showLiveWpm: boolean;
  showLiveAcc: boolean;
  showTimer: boolean;
  showKeyVisualizer: boolean;
  fontFamily: string;
  fontSize: number;
  paceCaret: string; // "off", "pb", "60", "100", "120"
}

const DEFAULT_SETTINGS: SettingsState = {
  caretStyle: "line",
  caretAnimation: "smooth",
  soundPreset: "cherry_blue",
  soundVolume: 0.5,
  isMuted: false,
  quickRestart: "tabEnter",
  blindMode: false,
  confidenceMode: false,
  showLiveWpm: true,
  showLiveAcc: true,
  showTimer: true,
  showKeyVisualizer: false,
  fontFamily: "JetBrains Mono",
  fontSize: 30,
  paceCaret: "off",
};

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  toggleMute: () => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("typehaya_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        soundEngine.setMuted(Boolean(parsed.isMuted || parsed.soundPreset === "off"));
        if (parsed.soundVolume !== undefined) {
          soundEngine.setVolume(parsed.soundVolume);
        }
      } catch {
        // Fallback to default
      }
    }
  }, []);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "isMuted") {
        soundEngine.setMuted(Boolean(value));
      } else if (key === "soundPreset") {
        soundEngine.setMuted(Boolean(prev.isMuted || value === "off"));
      } else if (key === "soundVolume") {
        soundEngine.setVolume(Number(value));
      }
      localStorage.setItem("typehaya_settings", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleMute = () => {
    setSettings((prev) => {
      const nextMuted = !prev.isMuted;
      // If unmuting while preset is off, switch to cherry_blue
      const nextPreset = !nextMuted && prev.soundPreset === "off" ? "cherry_blue" : prev.soundPreset;
      const updated: SettingsState = {
        ...prev,
        isMuted: nextMuted,
        soundPreset: nextPreset,
      };
      soundEngine.setMuted(nextMuted);
      localStorage.setItem("typehaya_settings", JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    soundEngine.setMuted(false);
    soundEngine.setVolume(0.5);
    localStorage.setItem("typehaya_settings", JSON.stringify(DEFAULT_SETTINGS));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, toggleMute, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
