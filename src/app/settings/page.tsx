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
  Sparkles,
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

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "color-mix(in srgb, var(--main-color) 15%, transparent)",
                color: "var(--main-color)",
                border: "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)",
              }}
            >
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight font-display">System Settings</h1>
              <p className="text-xs font-mono opacity-60" style={{ color: "var(--sub-color)" }}>
                Calibrate your typing mechanics, acoustics, caret behavior, and visuals.
              </p>
            </div>
          </div>

          <button
            onClick={resetSettings}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer hud-pill"
            style={{
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
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-display" style={{ color: "var(--main-color)" }}>
              <Eye className="w-4 h-4" />
              <span>Caret & Optical Cursor</span>
            </div>

            {/* Caret Style */}
            <div className="p-5 rounded-2xl hud-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans">Caret Geometry</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Visual shape and styling of the primary typing cursor.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/5">
                {(["line", "block", "underline", "outline", "bar"] as CaretStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSetting("caretStyle", style)}
                    className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                      settings.caretStyle === style ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: settings.caretStyle === style ? "var(--main-color)" : "transparent",
                      color: settings.caretStyle === style ? "var(--bg-color)" : "var(--sub-color)",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Caret Animation */}
            <div className="p-5 rounded-2xl hud-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans">Caret Motion Dynamics</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Interpolation smoothing and optical blink effects.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/5">
                {(["smooth", "blink", "pulse", "off"] as CaretAnimation[]).map((anim) => (
                  <button
                    key={anim}
                    onClick={() => updateSetting("caretAnimation", anim)}
                    className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                      settings.caretAnimation === anim ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: settings.caretAnimation === anim ? "var(--main-color)" : "transparent",
                      color: settings.caretAnimation === anim ? "var(--bg-color)" : "var(--sub-color)",
                    }}
                  >
                    {anim}
                  </button>
                ))}
              </div>
            </div>

            {/* Pace Caret (Ghost) */}
            <div className="p-5 rounded-2xl hud-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans">Pace Ghost (Target Benchmark)</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Secondary ghost cursor moving at a fixed target speed or personal best.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/5">
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
                    className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                      settings.paceCaret === item.id ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: settings.paceCaret === item.id ? "var(--main-color)" : "transparent",
                      color: settings.paceCaret === item.id ? "var(--bg-color)" : "var(--sub-color)",
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
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-display" style={{ color: "var(--main-color)" }}>
              <Volume2 className="w-4 h-4" />
              <span>Tactile Audio Feedback</span>
            </div>

            {/* Master Mute Toggle */}
            <div className="p-5 rounded-2xl hud-card flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans flex items-center gap-2">
                  {settings.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" style={{ color: "var(--main-color)" }} />}
                  Master Audio Mute
                </span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Toggle mechanical keyboard acoustic synthesizer on or off.
                </span>
              </div>
              <button
                onClick={toggleMute}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.isMuted ? "var(--error-color)" : "color-mix(in srgb, var(--main-color) 40%, transparent)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    settings.isMuted ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Sound Preset */}
            <div className="p-5 rounded-2xl hud-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans">Switch Acoustic Profile</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Zero-latency mechanical switch keystrokes generated in real-time.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/5">
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
                      className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                        settings.soundPreset === s.id ? "font-bold shadow-xs" : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: settings.soundPreset === s.id ? "var(--main-color)" : "transparent",
                        color: settings.soundPreset === s.id ? "var(--bg-color)" : "var(--sub-color)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {settings.soundPreset !== "off" && (
                  <button
                    onClick={handleTestSound}
                    className="px-3.5 py-1.5 rounded-xl font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                    style={{ backgroundColor: "var(--main-color)", color: "var(--bg-color)" }}
                    title="Audition Profile"
                  >
                    Test
                  </button>
                )}
              </div>
            </div>

            {/* Sound Volume */}
            {settings.soundPreset !== "off" && (
              <div className="p-5 rounded-2xl hud-card flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold block text-sm font-sans">Acoustic Gain (Volume)</span>
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
                  className="w-48 accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* SECTION: TYPING BEHAVIOR */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-display" style={{ color: "var(--main-color)" }}>
              <Sliders className="w-4 h-4" />
              <span>Discipline & Engine Modes</span>
            </div>

            {/* Blind Mode */}
            <div className="p-5 rounded-2xl hud-card flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans">Blind Mode</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Disguises typing mistakes until the test is completed.
                </span>
              </div>
              <button
                onClick={() => updateSetting("blindMode", !settings.blindMode)}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.blindMode ? "var(--main-color)" : "color-mix(in srgb, var(--sub-color) 30%, transparent)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    settings.blindMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Confidence Mode */}
            <div className="p-5 rounded-2xl hud-card flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans">Confidence Mode (Strict Forward)</span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Disables the backspace key. Errors cannot be rectified once committed.
                </span>
              </div>
              <button
                onClick={() => updateSetting("confidenceMode", !settings.confidenceMode)}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.confidenceMode ? "var(--main-color)" : "color-mix(in srgb, var(--sub-color) 30%, transparent)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    settings.confidenceMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Virtual Keyboard Toggle */}
            <div className="p-5 rounded-2xl hud-card flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Virtual 3D Mechanical Keyboard
                </span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  Display interactive tactile keyboard visualizer below typing stage.
                </span>
              </div>
              <button
                onClick={() => updateSetting("showKeyVisualizer", !settings.showKeyVisualizer)}
                className="w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative"
                style={{
                  backgroundColor: settings.showKeyVisualizer ? "var(--main-color)" : "color-mix(in srgb, var(--sub-color) 30%, transparent)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    settings.showKeyVisualizer ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Font Size Slider */}
            <div className="p-5 rounded-2xl hud-card flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm font-sans flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Text Font Scale
                </span>
                <span className="text-[11px] opacity-60" style={{ color: "var(--sub-color)" }}>
                  {settings.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="22"
                max="36"
                step="2"
                value={settings.fontSize}
                onChange={(e) => updateSetting("fontSize", parseInt(e.target.value, 10))}
                className="w-48 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer onOpenCommandPalette={() => {}} />
    </main>
  );
}
