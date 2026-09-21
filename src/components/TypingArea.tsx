"use client";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { WordState } from "@/lib/engine";
import { useSettings } from "@/context/SettingsContext";
import { RotateCcw } from "lucide-react";

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
  onKeyDown,
  onRestart,
}: TypingAreaProps) {
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Caret coordinate state
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0, height: 32, width: 2 });
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
    let charHeight = 36;

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
        charHeight = charRect.height || 36;
      }
    } else {
      // Past last character of word (at the space boundary)
      const lastCharEl = currentWordEl.querySelector(
        `[data-char-index="${currentWord.characters.length - 1}"]`
      ) as HTMLElement;
      if (lastCharEl) {
        const lastCharRect = lastCharEl.getBoundingClientRect();
        targetLeft = lastCharRect.right - containerRect.left + scrollLeft;
        targetTop = lastCharRect.top - containerRect.top + scrollTop;
        charWidth = lastCharRect.width || 14;
        charHeight = lastCharRect.height || 36;
      }
    }

    setCaretPos({
      top: targetTop,
      left: targetLeft,
      height: charHeight,
      width: settings.caretStyle === "block" || settings.caretStyle === "outline" ? charWidth : 2,
    });

    // Auto-scroll viewport if active line exceeds line 2
    const lineHeight = 42;
    if (targetTop > lineHeight * 1.5) {
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

    // Find character element corresponding to paceCharIndex
    let accumulated = 0;
    let foundWord = 0;
    let foundChar = 0;

    for (let w = 0; w < words.length; w++) {
      const len = words[w].characters.length + 1; // + space
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
      zIndex: 10,
    };

    switch (settings.caretStyle) {
      case "block":
        return {
          ...base,
          width: `${caretPos.width || 14}px`,
          height: `${caretPos.height}px`,
          backgroundColor: "var(--caret-color)",
          opacity: 0.75,
          borderRadius: "2px",
        };
      case "outline":
        return {
          ...base,
          width: `${caretPos.width || 14}px`,
          height: `${caretPos.height}px`,
          border: "2px solid var(--caret-color)",
          borderRadius: "2px",
        };
      case "underline":
        return {
          ...base,
          width: `${caretPos.width || 14}px`,
          height: "3px",
          top: `${caretPos.top + caretPos.height - 4}px`,
          backgroundColor: "var(--caret-color)",
        };
      case "bar":
        return {
          ...base,
          width: "3px",
          height: `${caretPos.height}px`,
          backgroundColor: "var(--caret-color)",
        };
      case "line":
      default:
        return {
          ...base,
          width: "2.5px",
          height: `${caretPos.height}px`,
          backgroundColor: "var(--caret-color)",
          borderRadius: "1px",
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

  return (
    <div
      onClick={handleFocus}
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none cursor-text px-4"
    >
      {/* Live Status Indicators (Timer, WPM, Accuracy) */}
      <div className="w-full flex items-center justify-between h-8 mb-4 px-2 text-xl font-bold font-mono">
        <div className="flex items-center gap-6">
          {settings.showTimer && (
            <span style={{ color: "var(--main-color)" }}>
              {mode === "time" ? timeLeft : elapsedSeconds}
            </span>
          )}
          {settings.showLiveWpm && status === "running" && (
            <span className="text-sm font-semibold opacity-70" style={{ color: "var(--sub-color)" }}>
              {liveWpm} <span className="text-xs">wpm</span>
            </span>
          )}
          {settings.showLiveAcc && status === "running" && (
            <span className="text-sm font-semibold opacity-70" style={{ color: "var(--sub-color)" }}>
              {liveAccuracy}%
            </span>
          )}
        </div>
      </div>

      {/* Main 3-Line Typing Viewport */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "140px", maxHeight: "155px" }}>
        {/* Hidden mobile / accessibility input */}
        <input
          ref={inputRef}
          type="text"
          onKeyDown={onKeyDown}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="absolute -top-96 left-0 opacity-0 pointer-events-none"
        />

        {/* Focus Lost Overlay */}
        {!isFocused && status !== "completed" && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer rounded-lg"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          >
            <div
              className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2"
              style={{
                backgroundColor: "var(--sub-alt-color)",
                color: "var(--text-color)",
              }}
            >
              <span>Click here or press any key to focus</span>
            </div>
          </div>
        )}

        {/* Text Container with Carets */}
        <div
          ref={containerRef}
          className="relative w-full flex flex-wrap gap-y-3 leading-relaxed overflow-hidden select-none transition-transform duration-100"
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: "42px",
            maxHeight: "150px",
          }}
        >
          {/* Animated Caret */}
          {status !== "completed" && (
            <div style={getCaretStyles()} className={getCaretAnimClass()} />
          )}

          {/* Ghost / Pace Caret */}
          {ghostPos && (
            <div
              style={{
                position: "absolute",
                left: `${ghostPos.left}px`,
                top: `${ghostPos.top}px`,
                width: "2px",
                height: `${caretPos.height}px`,
                backgroundColor: "var(--sub-color)",
                opacity: 0.45,
                borderRadius: "1px",
                pointerEvents: "none",
                transition: "left 0.2s ease, top 0.2s ease",
              }}
              title="Pace Caret"
            />
          )}

          {/* Render Words & Characters */}
          {words.map((word, wordIndex) => {
            const isWordActive = wordIndex === currentWordIndex;
            return (
              <div
                key={wordIndex}
                data-word-index={wordIndex}
                className={`inline-flex items-center mr-3 ${
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

                  // In Blind mode, disguise errors as correct until test ends
                  if (settings.blindMode && charState.status !== "untyped") {
                    charClass = "char-correct";
                  }

                  return (
                    <span
                      key={charIndex}
                      data-char-index={charIndex}
                      className={`${charClass} ${isCharActive ? "active-char" : ""}`}
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

      {/* Quote Attribution (if quote mode) */}
      {mode === "quote" && quoteAuthor && (
        <div
          className="w-full text-right mt-3 text-xs italic font-sans opacity-70"
          style={{ color: "var(--sub-color)" }}
        >
          — {quoteAuthor}
          {quoteSource ? `, ${quoteSource}` : ""}
        </div>
      )}

      {/* Restart Button with Shortcut Tooltip */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={onRestart}
          className="p-3 rounded-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 group opacity-60 hover:opacity-100"
          style={{
            backgroundColor: "transparent",
            color: "var(--sub-color)",
          }}
          title="Restart Test (Tab + Enter)"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
        <span
          className="text-[11px] tracking-wider font-semibold opacity-40 uppercase"
          style={{ color: "var(--sub-color)" }}
        >
          {settings.quickRestart === "tabEnter"
            ? "tab + enter to restart"
            : settings.quickRestart === "tab"
            ? "tab to restart"
            : "esc to restart"}
        </span>
      </div>
    </div>
  );
}
