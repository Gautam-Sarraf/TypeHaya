"use client";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { WordState } from "@/lib/engine";
import { useSettings } from "@/context/SettingsContext";
import { RotateCcw, Zap, Target, Timer, Sparkles } from "lucide-react";

interface TypingAreaProps {
  words: WordState[];
  currentWordIndex: number;
  currentCharIndex: number;
  status: "idle" | "running" | "completed" | "failed";
  timeLeft: number;
  elapsedSeconds: number;
  liveWpm: number;
  liveAccuracy: number;
  paceCharIndex: number;
  mode: string;
  subMode: string;
  quoteAuthor?: string;
  quoteSource?: string;
  isRestartPrimed?: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRestart: () => void;
}

export function TypingArea({
  words,
  currentWordIndex,
  currentCharIndex,
  status,
  timeLeft,
  elapsedSeconds,
  liveWpm,
  liveAccuracy,
  paceCharIndex,
  mode,
  subMode,
  quoteAuthor,
  quoteSource,
  isRestartPrimed = false,
  onKeyDown,
  onRestart,
}: TypingAreaProps) {
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Caret coordinate state
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0, height: 36, width: 2.5 });
  const [ghostPos, setGhostPos] = useState<{ top: number; left: number } | null>(null);

  // Focus hidden input on click or mount
  const handleFocus = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  useEffect(() => {
    handleFocus();
  }, [words]);

  // Global window focus listener and keypress auto-focus
  useEffect(() => {
    const handleWindowBlur = () => setIsFocused(false);
    const handleWindowFocus = () => setIsFocused(true);
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isFocused && inputRef.current && e.key !== "Tab") {
        inputRef.current.focus();
        setIsFocused(true);
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isFocused]);

  // Calculate Caret position and auto-scroll viewport
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const currentWordEl = containerRef.current.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    ) as HTMLElement;

    if (!currentWordEl) return;

    let targetLeft = 0;
    let targetTop = 0;
    let charWidth = 14;
    let charHeight = 38;

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const scrollTop = containerRef.current.scrollTop;

    if (currentCharIndex < currentWord.characters.length) {
      const charEl = currentWordEl.querySelector(
        `[data-char-index="${currentCharIndex}"]`
      ) as HTMLElement;
      if (charEl) {
        const charRect = charEl.getBoundingClientRect();
        targetLeft = charRect.left - containerRect.left + scrollLeft;
        targetTop = charRect.top - containerRect.top + scrollTop;
        charWidth = charRect.width || 14;
        charHeight = charRect.height || 38;
      }
    } else {
      // Past last character of word
      const lastCharEl = currentWordEl.querySelector(
        `[data-char-index="${currentWord.characters.length - 1}"]`
      ) as HTMLElement;
      if (lastCharEl) {
        const lastCharRect = lastCharEl.getBoundingClientRect();
        targetLeft = lastCharRect.right - containerRect.left + scrollLeft;
        targetTop = lastCharRect.top - containerRect.top + scrollTop;
        charWidth = lastCharRect.width || 14;
        charHeight = lastCharRect.height || 38;
      }
    }

    setCaretPos({
      top: targetTop,
      left: targetLeft,
      height: charHeight,
      width: settings.caretStyle === "block" || settings.caretStyle === "outline" ? charWidth : 3,
    });

    // Smooth auto-scroll viewport if active line exceeds line 2
    const lineHeight = 54;
    if (targetTop > lineHeight * 2.2) {
      containerRef.current.scrollTop = targetTop - lineHeight;
    } else {
      containerRef.current.scrollTop = 0;
    }
  }, [currentWordIndex, currentCharIndex, words, settings.caretStyle]);

  // Ghost Caret / Pace Caret calculation
  useEffect(() => {
    if (settings.paceCaret === "off" || !containerRef.current || status !== "running") {
      setGhostPos(null);
      return;
    }

    let accumulated = 0;
    let foundWord = 0;
    let foundChar = 0;

    for (let w = 0; w < words.length; w++) {
      const len = words[w].characters.length + 1;
      if (accumulated + len > paceCharIndex) {
        foundWord = w;
        foundChar = paceCharIndex - accumulated;
        break;
      }
      accumulated += len;
    }

    const wordEl = containerRef.current.querySelector(
      `[data-word-index="${foundWord}"]`
    ) as HTMLElement;
    if (wordEl) {
      const charEl = wordEl.querySelector(
        `[data-char-index="${foundChar}"]`
      ) as HTMLElement;
      if (charEl) {
        setGhostPos({ top: charEl.offsetTop, left: charEl.offsetLeft });
      }
    }
  }, [paceCharIndex, words, settings.paceCaret, status]);

  // Caret appearance style helper
  const getCaretStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: `${caretPos.left}px`,
      top: `${caretPos.top}px`,
      pointerEvents: "none",
      zIndex: 15,
      transition: "left 0.08s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.08s ease",
    };

    switch (settings.caretStyle) {
      case "block":
        return {
          ...base,
          width: `${caretPos.width || 16}px`,
          height: `${caretPos.height}px`,
          backgroundColor: "var(--caret-color)",
          opacity: 0.6,
          borderRadius: "3px",
        };
      case "outline":
        return {
          ...base,
          width: `${caretPos.width || 16}px`,
          height: `${caretPos.height}px`,
          border: "2px solid var(--caret-color)",
          borderRadius: "3px",
        };
      case "underline":
        return {
          ...base,
          width: `${caretPos.width || 16}px`,
          height: "4px",
          top: `${caretPos.top + caretPos.height - 4}px`,
          backgroundColor: "var(--caret-color)",
          borderRadius: "9999px",
        };
      case "bar":
        return {
          ...base,
          width: "3.5px",
          height: `${caretPos.height}px`,
          backgroundColor: "var(--caret-color)",
          borderRadius: "2px",
        };
      case "line":
      default:
        return {
          ...base,
          width: "3.5px",
          height: `${caretPos.height}px`,
          backgroundColor: "var(--caret-color)",
          borderRadius: "2px",
          boxShadow: "0 0 12px var(--caret-color)",
        };
    }
  };

  const getCaretAnimClass = () => {
    switch (settings.caretAnimation) {
      case "blink":
        return "caret-anim-blink";
      case "pulse":
        return "caret-anim-pulse";
      case "smooth":
        return "caret-anim-smooth";
      case "off":
      default:
        return "";
    }
  };

  // Calculate test progress percentage for time mode
  const totalSeconds = parseInt(subMode, 10) || 30;
  const progressPercent =
    mode === "time"
      ? Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100))
      : 0;

  return (
    <div
      onClick={handleFocus}
      className="relative w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center select-none cursor-text px-2 sm:px-6"
    >
      {/* Telemetry Stage HUD Bar */}
      <div className="w-full flex items-center justify-between h-10 mb-4 px-3 font-mono">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Dynamic Timer Badge */}
          {settings.showTimer && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/20 border border-white/5 shadow-xs">
              <Timer className="w-4 h-4 opacity-70" style={{ color: "var(--main-color)" }} />
              <span
                className="text-xl font-bold font-display"
                style={{ color: "var(--main-color)" }}
              >
                {mode === "time" ? `${timeLeft}s` : `${elapsedSeconds}s`}
              </span>
            </div>
          )}

          {/* Live Speed Dial */}
          {settings.showLiveWpm && status === "running" && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/20 border border-white/5 animate-in fade-in">
              <Zap className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
              <span className="text-base font-bold" style={{ color: "var(--text-color)" }}>
                {liveWpm}
              </span>
              <span className="text-[10px] uppercase font-bold opacity-50" style={{ color: "var(--sub-color)" }}>
                wpm
              </span>
            </div>
          )}

          {/* Live Accuracy Chip */}
          {settings.showLiveAcc && status === "running" && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/20 border border-white/5 animate-in fade-in">
              <Target className="w-3.5 h-3.5" style={{ color: "var(--main-color)" }} />
              <span className="text-base font-bold" style={{ color: "var(--text-color)" }}>
                {liveAccuracy}%
              </span>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs opacity-60">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status === "running" ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: status === "running" ? "var(--main-color)" : "var(--sub-color)",
              boxShadow: status === "running" ? "0 0 10px var(--main-color)" : "none",
            }}
          />
          <span className="capitalize font-mono text-xs hidden sm:inline">
            {status === "running" ? "active flight" : "ready"}
          </span>
        </div>
      </div>

      {/* Futuristic Typing Stage Box (Expanded Width & Height) */}
      <div
        className="relative w-full p-8 sm:p-10 md:p-12 rounded-3xl hud-glass shadow-2xl transition-all duration-300"
        style={{
          minHeight: "240px",
          maxHeight: "290px",
        }}
      >
        {/* Subtle Progress Line at Top of Stage (Time Mode) */}
        {mode === "time" && status === "running" && (
          <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-black/30 overflow-hidden rounded-t-3xl">
            <div
              className="h-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "var(--main-color)",
                boxShadow: "0 0 10px var(--main-color)",
              }}
            />
          </div>
        )}

        {/* Hidden Accessibility/Mobile Input */}
        <input
          ref={inputRef}
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
            }
            onKeyDown(e);
          }}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="absolute -top-96 left-0 opacity-0 pointer-events-none"
        />

        {/* Focus Lost Overlay with Futuristic HUD Badge */}
        {!isFocused && status !== "completed" && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer rounded-3xl"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
          >
            <div
              className="px-8 py-4 rounded-2xl text-sm font-mono font-bold shadow-2xl flex items-center gap-2.5 border animate-pulse"
              style={{
                backgroundColor: "var(--sub-alt-color)",
                borderColor: "var(--main-color)",
                color: "var(--text-color)",
                boxShadow: "0 0 25px color-mix(in srgb, var(--main-color) 35%, transparent)",
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: "var(--main-color)" }} />
              <span>Click anywhere or press any key to engage typing arena</span>
            </div>
          </div>
        )}

        {/* Words & Characters Render Viewport */}
        <div
          ref={containerRef}
          className="relative w-full flex flex-wrap gap-y-4 leading-relaxed overflow-hidden select-none font-mono-code tracking-wide"
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: "54px",
            maxHeight: "216px",
          }}
        >
          {/* Animated Caret */}
          {status !== "completed" && (
            <div style={getCaretStyles()} className={`${getCaretAnimClass()} laser-caret`} />
          )}

          {/* Ghost / Pace Caret */}
          {ghostPos && (
            <div
              style={{
                position: "absolute",
                left: `${ghostPos.left}px`,
                top: `${ghostPos.top}px`,
                width: "3px",
                height: `${caretPos.height}px`,
                backgroundColor: "var(--sub-color)",
                opacity: 0.55,
                borderRadius: "2px",
                pointerEvents: "none",
                transition: "left 0.2s ease, top 0.2s ease",
              }}
              title="Pace Ghost"
            />
          )}

          {/* Words */}
          {words.map((word, wordIndex) => {
            const isWordActive = wordIndex === currentWordIndex;
            return (
              <div
                key={wordIndex}
                data-word-index={wordIndex}
                className={`inline-flex items-center mr-3.5 sm:mr-5 ${
                  isWordActive ? "word-active" : ""
                }`}
              >
                {word.characters.map((charState, charIndex) => {
                  const isCharActive = isWordActive && charIndex === currentCharIndex;
                  let charClass = "char-untyped";
                  if (charState.status === "correct") charClass = "char-correct";
                  if (charState.status === "incorrect") charClass = "char-incorrect";
                  if (charState.status === "extra") charClass = "char-extra";
                  if (charState.status === "missed") charClass = "char-missed";

                  // Blind Mode
                  if (settings.blindMode && charState.status !== "untyped") {
                    charClass = "char-correct";
                  }

                  return (
                    <span
                      key={charIndex}
                      data-char-index={charIndex}
                      className={`${charClass} ${isCharActive ? "active-char font-semibold" : ""}`}
                    >
                      {charState.char}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote Attribution */}
      {mode === "quote" && quoteAuthor && (
        <div
          className="w-full text-right mt-3 text-xs italic font-sans opacity-70"
          style={{ color: "var(--sub-color)" }}
        >
          — {quoteAuthor}
          {quoteSource ? `, ${quoteSource}` : ""}
        </div>
      )}

      {/* Modern Restart Dock */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={onRestart}
          className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer group shadow-lg ${
            isRestartPrimed
              ? "scale-115 ring-2 shadow-2xl neon-glow"
              : "hover:scale-105 active:scale-95 opacity-70 hover:opacity-100"
          }`}
          style={{
            backgroundColor: isRestartPrimed
              ? "var(--main-color)"
              : "color-mix(in srgb, var(--sub-alt-color) 90%, transparent)",
            color: isRestartPrimed ? "var(--bg-color)" : "var(--sub-color)",
            border: isRestartPrimed
              ? "1px solid var(--main-color)"
              : "1px solid color-mix(in srgb, var(--sub-color) 20%, transparent)",
          }}
          title="Restart Test (Tab + Enter or Esc)"
        >
          <RotateCcw
            className={`w-5 h-5 ${
              isRestartPrimed ? "rotate-180" : "group-hover:rotate-180"
            } transition-transform duration-500`}
          />
        </button>

        {/* Key Shortcut Badges */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] opacity-50 mt-1">
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
            style={{
              backgroundColor: "var(--sub-alt-color)",
              borderColor: "color-mix(in srgb, var(--sub-color) 25%, transparent)",
              color: "var(--text-color)",
            }}
          >
            tab
          </kbd>
          <span>+</span>
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
            style={{
              backgroundColor: "var(--sub-alt-color)",
              borderColor: "color-mix(in srgb, var(--sub-color) 25%, transparent)",
              color: "var(--text-color)",
            }}
          >
            enter
          </kbd>
          <span className="ml-1 uppercase tracking-wider text-[9px] font-semibold">
            to restart
          </span>
        </div>
      </div>
    </div>
  );
}
