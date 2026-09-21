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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings, toggleMute } = useSettings();

  const navLinks = [
    { href: "/", label: "Test", icon: Keyboard },
    { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
    { href: "/about", label: "About", icon: Info },
    { href: "/themes", label: "Themes", icon: Palette },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between z-20">
      {/* Brand Logo & Top-Left Mute Sound Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: "var(--main-color)" }}
          >
            <Keyboard className="w-5 h-5" style={{ color: "var(--bg-color)" }} />
          </div>
          <div className="flex flex-col">
            <span
              className="text-xl font-bold tracking-tight leading-none"
              style={{ color: "var(--text-color)" }}
            >
              typehaya
            </span>
            <span
              className="text-[10px] tracking-wider uppercase font-semibold leading-tight mt-0.5"
              style={{ color: "var(--sub-color)" }}
            >
              performance typing
            </span>
          </div>
        </Link>

        {/* Quick Mute Sound Button */}
        <button
          onClick={toggleMute}
          title={
            settings.isMuted
              ? "Typing sound is muted (Click to unmute)"
              : `Typing sound is ON (${settings.soundPreset.replace("_", " ")}) - Click to mute`
          }
          aria-label={settings.isMuted ? "Unmute typing sound" : "Mute typing sound"}
          className="px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer border shadow-xs hover:scale-105 active:scale-95 ml-1"
          style={{
            backgroundColor: settings.isMuted ? "var(--sub-alt-color)" : "transparent",
            borderColor: settings.isMuted ? "var(--error-color)" : "var(--sub-alt-color)",
            color: settings.isMuted ? "var(--error-color)" : "var(--sub-color)",
          }}
        >
          {settings.isMuted ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono">muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" style={{ color: "var(--main-color)" }} />
              <span className="hidden sm:inline text-[11px] font-mono opacity-80" style={{ color: "var(--text-color)" }}>sound on</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Icons */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`p-2.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                color: isActive ? "var(--main-color)" : "var(--sub-color)",
                backgroundColor: isActive ? "var(--sub-alt-color)" : "transparent",
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}

        {/* User Auth Section */}
        <div className="h-5 w-[1px] mx-1" style={{ backgroundColor: "var(--sub-alt-color)" }} />

        {user ? (
          <div className="flex items-center gap-1">
            <Link
              href="/stats"
              title="Your Stats"
              className={`p-2.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                pathname === "/stats" ? "opacity-100" : "opacity-75 hover:opacity-100"
              }`}
              style={{
                color: pathname === "/stats" ? "var(--main-color)" : "var(--sub-color)",
                backgroundColor: pathname === "/stats" ? "var(--sub-alt-color)" : "transparent",
              }}
            >
              <BarChart2 className="w-4 h-4" />
              <span className="font-semibold text-xs truncate max-w-[100px]" style={{ color: "var(--text-color)" }}>
                {user.username}
              </span>
            </Link>

            <Link
              href="/history"
              title="Test History"
              className="p-2.5 rounded-lg transition-colors text-xs"
              style={{ color: "var(--sub-color)" }}
            >
              <History className="w-4 h-4" />
            </Link>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2.5 rounded-lg transition-colors hover:opacity-100 opacity-60 text-xs"
              style={{ color: "var(--sub-color)" }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--sub-alt-color)",
              color: "var(--text-color)",
            }}
          >
            <UserIcon className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
            <span>Sign In</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
