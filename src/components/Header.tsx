"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Keyboard,
  Trophy,
  BarChart2,
  Palette,
  Settings as SettingsIcon,
  Info,
  User as UserIcon,
  LogOut,
  History,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings, toggleMute } = useSettings();
  const { theme } = useTheme();

  const navLinks = [
    { href: "/", label: "Arena", icon: Keyboard },
    { href: "/leaderboards", label: "Rankings", icon: Trophy },
    { href: "/themes", label: "Themes", icon: Palette },
    { href: "/settings", label: "Config", icon: SettingsIcon },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30 relative">
      {/* Brand & Live Telemetry Chips */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-all"
        >
          {/* Futuristic Hexagon/Keycap Logo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
            style={{
              backgroundColor: "var(--main-color)",
              boxShadow: `0 0 20px color-mix(in srgb, var(--main-color) 40%, transparent)`,
            }}
          >
            <Keyboard className="w-5 h-5" style={{ color: "var(--bg-color)" }} />
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 animate-pulse"
              style={{
                backgroundColor: "var(--main-color)",
                boxShadow: "0 0 8px var(--main-color)",
              }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className="text-xl font-extrabold tracking-tight font-display uppercase leading-none"
                style={{ color: "var(--text-color)" }}
              >
                TYPE<span style={{ color: "var(--main-color)" }}>HAYA</span>
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono border"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--main-color) 12%, transparent)",
                  color: "var(--main-color)",
                  borderColor: "color-mix(in srgb, var(--main-color) 25%, transparent)",
                }}
              >
                v2.4
              </span>
            </div>
            <span
              className="text-[10px] tracking-widest uppercase font-semibold font-mono leading-tight mt-0.5 opacity-60"
              style={{ color: "var(--sub-color)" }}
            >
              precision typing engine
            </span>
          </div>
        </Link>

        {/* Live Audio Equalizer Pill Button */}
        <button
          onClick={toggleMute}
          title={
            settings.isMuted
              ? "Audio muted — Click to enable tactile mechanical switch acoustics"
              : `Switch acoustics active: ${settings.soundPreset.replace("_", " ")} (Click to mute)`
          }
          aria-label="Toggle typing audio feedback"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium cursor-pointer hud-pill transition-all active:scale-95 ml-2"
          style={{
            color: settings.isMuted ? "var(--error-color)" : "var(--main-color)",
            backgroundColor: settings.isMuted
              ? "color-mix(in srgb, var(--error-color) 10%, transparent)"
              : "color-mix(in srgb, var(--main-color) 8%, transparent)",
            borderColor: settings.isMuted
              ? "color-mix(in srgb, var(--error-color) 30%, transparent)"
              : "color-mix(in srgb, var(--main-color) 25%, transparent)",
          }}
        >
          {settings.isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              {/* Animated 3-Bar Audio Visualizer */}
              <div className="flex items-center gap-[2px] h-3.5 px-0.5">
                <span
                  className="w-[2.5px] rounded-full eq-bar-1"
                  style={{ backgroundColor: "var(--main-color)" }}
                />
                <span
                  className="w-[2.5px] rounded-full eq-bar-2"
                  style={{ backgroundColor: "var(--main-color)" }}
                />
                <span
                  className="w-[2.5px] rounded-full eq-bar-3"
                  style={{ backgroundColor: "var(--main-color)" }}
                />
              </div>
              <span className="text-[11px] font-semibold opacity-90 capitalize">
                {settings.soundPreset.replace("_", " ")}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Futuristic Floating Navigation Dock */}
      <nav className="flex items-center gap-1 sm:gap-2 hud-glass p-1 sm:p-1.5 rounded-2xl shadow-xl">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-xs font-semibold ${
                isActive
                  ? "shadow-sm scale-[1.02]"
                  : "opacity-60 hover:opacity-100 hover:bg-white/5"
              }`}
              style={{
                color: isActive ? "var(--main-color)" : "var(--sub-color)",
                backgroundColor: isActive
                  ? "color-mix(in srgb, var(--main-color) 12%, transparent)"
                  : "transparent",
                border: isActive
                  ? "1px solid color-mix(in srgb, var(--main-color) 30%, transparent)"
                  : "1px solid transparent",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">{link.label}</span>
            </Link>
          );
        })}

        <div
          className="h-4 w-[1px] mx-1"
          style={{ backgroundColor: "color-mix(in srgb, var(--sub-color) 25%, transparent)" }}
        />

        {/* User Auth Section */}
        {user ? (
          <div className="flex items-center gap-1">
            <Link
              href="/stats"
              title="View your Performance Stats"
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold ${
                pathname === "/stats"
                  ? "opacity-100"
                  : "opacity-75 hover:opacity-100"
              }`}
              style={{
                color: pathname === "/stats" ? "var(--main-color)" : "var(--text-color)",
                backgroundColor: pathname === "/stats"
                  ? "color-mix(in srgb, var(--main-color) 15%, transparent)"
                  : "transparent",
              }}
            >
              <BarChart2 className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
              <span className="font-mono text-xs truncate max-w-[90px]">
                {user.username}
              </span>
            </Link>

            <Link
              href="/history"
              title="Test History"
              className="p-2 rounded-xl transition-colors text-xs opacity-60 hover:opacity-100"
              style={{ color: "var(--sub-color)" }}
            >
              <History className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-xl transition-colors opacity-60 hover:opacity-100 text-xs cursor-pointer"
              style={{ color: "var(--error-color)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xs"
            style={{
              backgroundColor: "var(--main-color)",
              color: "var(--bg-color)",
            }}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
