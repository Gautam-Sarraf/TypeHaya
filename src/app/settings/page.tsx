"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSettings, CaretStyle, CaretAnimation, SoundPreset, QuickRestartKey } from "@/context/SettingsContext";
import { soundEngine } from "@/lib/sound";
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Eye,
  RotateCcw,
  Sliders,
  Type,
  Keyboard,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings, toggleMute } = useSettings();

  const handleTestSound = () => {
    soundEngine.play(settings.soundPreset);
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <Header />

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "var(--sub-alt-color)" }}>
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6" style={{ color: "var(--main-color)" }} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
                Fine-tune your typing engine, audio, caret, and interface behavior.
              </p>
            </div>
          </div>

          <button
            onClick={resetSettings}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--sub-alt-color)",
              color: "var(--sub-color)",
            }}
            title="Restore Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="flex flex-col gap-8 font-mono text-xs">
          {/* SECTION: CARET */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--main-color)" }}>
              <Eye className="w-4 h-4" />
              <span>Caret & Cursor</span>
            </div>

            {/* Caret Style */}
            <div
              className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Caret Style</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Visual appearance of the active typing cursor.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
                {(["line", "block", "underline", "outline", "bar"] as CaretStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSetting("caretStyle", style)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      settings.caretStyle === style ? "font-bold" : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: settings.caretStyle === style ? "var(--sub-alt-color)" : "transparent",
                      color: settings.caretStyle === style ? "var(--main-color)" : "var(--sub-color)",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Caret Animation */}
            <div
              className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Caret Animation</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Cursor movement smoothing and blink effect.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
                {(["smooth", "blink", "pulse", "off"] as CaretAnimation[]).map((anim) => (
                  <button
                    key={anim}
                    onClick={() => updateSetting("caretAnimation", anim)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      settings.caretAnimation === anim ? "font-bold" : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: settings.caretAnimation === anim ? "var(--sub-alt-color)" : "transparent",
                      color: settings.caretAnimation === anim ? "var(--main-color)" : "var(--sub-color)",
                    }}
                  >
                    {anim}
                  </button>
                ))}
              </div>
            </div>

            {/* Pace Caret (Ghost) */}
            <div
              className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Pace Caret (Ghost Cursor)</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Secondary ghost cursor moving at a fixed target speed or your personal best.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
                {[
                  { id: "off", label: "off" },
                  { id: "pb", label: "personal best" },
                  { id: "60", label: "60 wpm" },
                  { id: "100", label: "100 wpm" },
                  { id: "120", label: "120 wpm" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateSetting("paceCaret", item.id)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      settings.paceCaret === item.id ? "font-bold" : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: settings.paceCaret === item.id ? "var(--sub-alt-color)" : "transparent",
                      color: settings.paceCaret === item.id ? "var(--main-color)" : "var(--sub-color)",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION: SOUND */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--main-color)" }}>
              <Volume2 className="w-4 h-4" />
              <span>Audio Feedback</span>
            </div>

            {/* Master Mute Toggle */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm flex items-center gap-2">
                  {settings.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" style={{ color: "var(--main-color)" }} />}
                  Mute All Typing Sounds
                </span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Silence mechanical keyboard sounds immediately.
                </span>
              </div>
              <button
                onClick={toggleMute}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.isMuted ? "var(--error-color)" : "var(--bg-color)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.isMuted ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Sound Preset */}
            <div
              className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Mechanical Switch Sounds</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Zero-latency tactile clicks synthesized via the Web Audio API.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
                  {[
                    { id: "off", label: "off" },
                    { id: "cherry_blue", label: "cherry blue" },
                    { id: "cherry_brown", label: "cherry brown" },
                    { id: "pop", label: "pop" },
                    { id: "typewriter", label: "typewriter" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateSetting("soundPreset", s.id as SoundPreset)}
                      className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                        settings.soundPreset === s.id ? "font-bold" : "opacity-60"
                      }`}
                      style={{
                        backgroundColor: settings.soundPreset === s.id ? "var(--sub-alt-color)" : "transparent",
                        color: settings.soundPreset === s.id ? "var(--main-color)" : "var(--sub-color)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {settings.soundPreset !== "off" && (
                  <button
                    onClick={handleTestSound}
                    className="px-3 py-1 rounded-lg font-bold shadow-xs cursor-pointer transition-transform active:scale-95"
                    style={{ backgroundColor: "var(--main-color)", color: "var(--bg-color)" }}
                    title="Audition Sound"
                  >
                    Test
                  </button>
                )}
              </div>
            </div>

            {/* Sound Volume */}
            {settings.soundPreset !== "off" && (
              <div
                className="p-4 rounded-2xl flex items-center justify-between gap-4"
                style={{ backgroundColor: "var(--sub-alt-color)" }}
              >
                <div>
                  <span className="font-bold block text-sm">Sound Volume</span>
                  <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => updateSetting("soundVolume", parseFloat(e.target.value))}
                  className="w-48 accent-yellow-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* SECTION: TYPING BEHAVIOR */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--main-color)" }}>
              <Sliders className="w-4 h-4" />
              <span>Engine Behavior & Discipline</span>
            </div>

            {/* Blind Mode */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Blind Mode</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Disguises mistakes as correct characters until the test completes.
                </span>
              </div>
              <button
                onClick={() => updateSetting("blindMode", !settings.blindMode)}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.blindMode ? "var(--main-color)" : "var(--bg-color)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.blindMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Confidence Mode */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Confidence Mode</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Disables the backspace key. You cannot fix errors once committed.
                </span>
              </div>
              <button
                onClick={() => updateSetting("confidenceMode", !settings.confidenceMode)}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.confidenceMode ? "var(--main-color)" : "var(--bg-color)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.confidenceMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Quick Restart Key */}
            <div
              className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm">Quick Restart Shortcut</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Hotkey combination to immediately reset the active typing test.
                </span>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-color)" }}>
                {[
                  { id: "tabEnter", label: "tab + enter" },
                  { id: "tab", label: "tab" },
                  { id: "esc", label: "esc" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateSetting("quickRestart", item.id as QuickRestartKey)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      settings.quickRestart === item.id ? "font-bold" : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: settings.quickRestart === item.id ? "var(--sub-alt-color)" : "transparent",
                      color: settings.quickRestart === item.id ? "var(--main-color)" : "var(--sub-color)",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Virtual Keyboard Toggle */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Virtual Keyboard
                </span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Renders interactive on-screen keyboard with keypress lighting.
                </span>
              </div>
              <button
                onClick={() => updateSetting("showKeyVisualizer", !settings.showKeyVisualizer)}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.showKeyVisualizer ? "var(--main-color)" : "var(--bg-color)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.showKeyVisualizer ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Font Size Slider */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--sub-alt-color)" }}
            >
              <div>
                <span className="font-bold block text-sm flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Size
                </span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  {settings.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="36"
                step="2"
                value={settings.fontSize}
                onChange={(e) => updateSetting("fontSize", parseInt(e.target.value, 10))}
                className="w-48 accent-yellow-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
