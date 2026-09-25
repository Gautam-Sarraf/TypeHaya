"use client";

import React, { useState, useEffect } from "react";

const KEYBOARD_ROWS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace"],
  ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
  ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"],
  ["space"],
];

export function VirtualKeyboard() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (key === " ") key = "space";
      if (key === "control") key = "ctrl";
      setActiveKeys((prev) => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (key === " ") key = "space";
      if (key === "control") key = "ctrl";
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getKeyWidth = (key: string) => {
    switch (key) {
      case "space":
        return "w-64 sm:w-72";
      case "backspace":
      case "enter":
        return "w-16 sm:w-20";
      case "tab":
      case "caps":
        return "w-14 sm:w-16";
      case "shift":
        return "w-16 sm:w-22";
      default:
        return "w-8 sm:w-9";
    }
  };

  return (
    <div
      className="inline-flex flex-col items-center gap-1.5 p-3.5 rounded-3xl hud-glass shadow-2xl select-none transition-all my-4 border border-white/5"
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-1 sm:gap-1.5">
          {row.map((key, keyIndex) => {
            const isActive = activeKeys.has(key);
            return (
              <div
                key={keyIndex}
                className={`h-8 sm:h-9 ${getKeyWidth(
                  key
                )} rounded-xl flex items-center justify-center font-mono text-[10px] sm:text-xs font-semibold transition-all duration-75 select-none ${
                  isActive
                    ? "scale-95 shadow-inner"
                    : "shadow-md hover:scale-[1.02]"
                }`}
                style={{
                  backgroundColor: isActive
                    ? "var(--main-color)"
                    : "color-mix(in srgb, var(--sub-alt-color) 120%, white 5%)",
                  color: isActive ? "var(--bg-color)" : "var(--text-color)",
                  boxShadow: isActive
                    ? "0 0 12px var(--main-color), inset 0 2px 4px rgba(0,0,0,0.3)"
                    : "0 3px 0 color-mix(in srgb, var(--bg-color) 80%, black), 0 4px 6px rgba(0,0,0,0.2)",
                  transform: isActive ? "translateY(2px)" : "translateY(0)",
                }}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
