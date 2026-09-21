"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Header } from "@/components/Header";
import { ConfigBar } from "@/components/ConfigBar";
import { TypingArea } from "@/components/TypingArea";
import { ResultsModal } from "@/components/ResultsModal";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useSettings } from "@/context/SettingsContext";
import { TestMode, EngineStats } from "@/lib/engine";
import { WordListType, generateWords } from "@/lib/words";
import { getRandomQuote, Quote } from "@/lib/quotes";

export default function HomePage() {
  const { settings } = useSettings();

  // Test Configuration State
  const [mode, setMode] = useState<TestMode>("time");
  const [subMode, setSubMode] = useState("30");
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [language, setLanguage] = useState<WordListType>("english");

  // Custom text modal state
  const [customText, setCustomText] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Active Quote information
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  // Saved Results and Personal Best flag
  const [completedStats, setCompletedStats] = useState<EngineStats | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);

  // Command palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Failure message (for Master/Sudden Death difficulties)
  const [failReason, setFailReason] = useState<string | null>(null);

  // Restart primed state (for Tab + Enter or visual indicator)
  const [isRestartPrimed, setIsRestartPrimed] = useState(false);
  const restartPrimedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tabKeyDownRef = useRef<boolean>(false);

  const cancelRestartPrimed = useCallback(() => {
    setIsRestartPrimed(false);
    tabKeyDownRef.current = false;
    if (restartPrimedTimerRef.current) {
      clearTimeout(restartPrimedTimerRef.current);
      restartPrimedTimerRef.current = null;
    }
  }, []);

  // Generate target words based on mode
  const wordsToType = useMemo(() => {
    if (mode === "quote") {
      const q = getRandomQuote(
        subMode === "all" ? "all" : (subMode as "short" | "medium" | "long" | "thicc")
      );
      return q.text.split(" ");
    }

    if (mode === "custom") {
      const trimmed = customText.trim();
      return trimmed ? trimmed.split(/\s+/) : ["the", "quick", "brown", "fox", "jumps"];
    }

    let wordCount = 50;
    if (mode === "words") {
      wordCount = parseInt(subMode, 10) || 25;
    } else if (mode === "time") {
      // Provide generous pool of words so user doesn't run out
      const sec = parseInt(subMode, 10) || 30;
      wordCount = Math.max(50, Math.ceil(sec * 3.5));
    } else if (mode === "zen") {
      wordCount = 200;
    }

    return generateWords(wordCount, {
      language,
      punctuation,
      numbers,
    });
  }, [mode, subMode, punctuation, numbers, language, customText]);

  // Handle test completion
  const handleTestComplete = useCallback(
    async (stats: EngineStats) => {
      setCompletedStats(stats);

      // Save locally for guest history
      try {
        const guestHistoryStr = localStorage.getItem("typehaya_guest_history");
        const history = guestHistoryStr ? JSON.parse(guestHistoryStr) : [];
        const resultRecord = {
          ...stats,
          mode,
          subMode,
          language,
          punctuation,
          numbers,
          createdAt: new Date().toISOString(),
        };
        history.unshift(resultRecord);
        localStorage.setItem(
          "typehaya_guest_history",
          JSON.stringify(history.slice(0, 50))
        );

        // Check local guest personal best
        const pbKey = `typehaya_pb_${mode}_${subMode}`;
        const prevPb = parseFloat(localStorage.getItem(pbKey) || "0");
        if (stats.wpm > prevPb) {
          setIsPersonalBest(true);
          localStorage.setItem(pbKey, stats.wpm.toString());
        } else {
          setIsPersonalBest(false);
        }
      } catch {
        // Local storage full or private browsing
      }

      // Record to PostgreSQL database via API
      try {
        const res = await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wpm: stats.wpm,
            rawWpm: stats.rawWpm,
            accuracy: stats.accuracy,
            consistency: stats.consistency,
            mode,
            subMode,
            language,
            punctuation,
            numbers,
            duration: stats.durationSeconds,
            charStats: {
              correct: stats.correctChars,
              incorrect: stats.incorrectChars,
              extra: stats.extraChars,
              missed: stats.missedChars,
            },
            wpmTimeline: stats.timeline,
            keyStats: stats.keyErrors,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.isPersonalBest) {
            setIsPersonalBest(true);
          }
        }
      } catch {
        // Backend offline fallback handled cleanly
      }
    },
    [mode, subMode, language, punctuation, numbers]
  );

  const handleTestFail = useCallback((reason: string) => {
    setFailReason(reason);
  }, []);

  // Initialize Typing Engine
  const {
    words,
    currentWordIndex,
    currentCharIndex,
    status,
    timeLeft,
    elapsedSeconds,
    liveWpm,
    liveAccuracy,
    paceCharIndex,
    handleKeyDown,
    resetTest,
  } = useTypingEngine({
    initialWords: wordsToType,
    mode,
    subMode,
    difficulty: "normal",
    blindMode: settings.blindMode,
    confidenceMode: settings.confidenceMode,
    soundPreset: settings.isMuted ? "off" : settings.soundPreset,
    soundVolume: settings.soundVolume,
    isMuted: settings.isMuted,
    paceWpm: settings.paceCaret === "pb" ? 75 : parseInt(settings.paceCaret, 10) || 0,
    onComplete: handleTestComplete,
    onFail: handleTestFail,
  });

  // Track quote details
  useEffect(() => {
    if (mode === "quote") {
      const q = getRandomQuote(
        subMode === "all" ? "all" : (subMode as "short" | "medium" | "long" | "thicc")
      );
      setCurrentQuote(q);
      resetTest(q.text.split(" "));
    } else {
      setCurrentQuote(null);
      resetTest(wordsToType);
    }
  }, [mode, subMode, punctuation, numbers, language]);

  // Restart handlers
  const handleNextTest = useCallback(() => {
    cancelRestartPrimed();
    setCompletedStats(null);
    setFailReason(null);
    setIsPersonalBest(false);

    if (mode === "quote") {
      const q = getRandomQuote(
        subMode === "all" ? "all" : (subMode as "short" | "medium" | "long" | "thicc")
      );
      setCurrentQuote(q);
      resetTest(q.text.split(" "));
    } else {
      let wordCount = 50;
      if (mode === "words") wordCount = parseInt(subMode, 10) || 25;
      else if (mode === "time") wordCount = Math.max(50, Math.ceil((parseInt(subMode, 10) || 30) * 3.5));
      const fresh = generateWords(wordCount, { language, punctuation, numbers });
      resetTest(fresh);
    }
  }, [mode, subMode, language, punctuation, numbers, resetTest, cancelRestartPrimed]);

  const handleRepeatTest = useCallback(() => {
    cancelRestartPrimed();
    setCompletedStats(null);
    setFailReason(null);
    setIsPersonalBest(false);
    resetTest();
  }, [resetTest, cancelRestartPrimed]);

  // Practice missed words drill
  const handlePracticeMissed = useCallback(() => {
    cancelRestartPrimed();
    if (!completedStats) return;
    const errorKeys = Object.keys(completedStats.keyErrors);
    if (errorKeys.length === 0) return;

    // Filter words that contain any of the error keys
    const missedWordList = wordsToType.filter((w) =>
      errorKeys.some((k) => w.toLowerCase().includes(k.toLowerCase()))
    );

    const drillWords = missedWordList.length > 0 ? missedWordList : wordsToType.slice(0, 10);
    setCompletedStats(null);
    setFailReason(null);
    resetTest(drillWords);
  }, [completedStats, wordsToType, resetTest, cancelRestartPrimed]);

  // Global Quick-Restart & Command Palette listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 1. Command Palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // 2. Cmd + Enter or Ctrl + Enter: Instant restart alias (convenient for Mac/PC users)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleNextTest();
        return;
      }

      // 3. Quick restart: "esc" mode
      if (e.key === "Escape") {
        if (settings.quickRestart === "esc") {
          e.preventDefault();
          handleNextTest();
          return;
        }
        if (!isCommandPaletteOpen) {
          e.preventDefault();
          setIsCommandPaletteOpen(true);
          return;
        }
      }

      // 4. Quick restart: "tab" mode (instant restart on Tab)
      if (e.key === "Tab" && settings.quickRestart === "tab") {
        e.preventDefault();
        handleNextTest();
        return;
      }

      // 5. Quick restart: "tabEnter" mode (Tab primes, Enter executes; or holding Tab + pressing Enter)
      if (settings.quickRestart === "tabEnter") {
        if (e.key === "Tab") {
          e.preventDefault();
          tabKeyDownRef.current = true;
          setIsRestartPrimed(true);

          if (restartPrimedTimerRef.current) {
            clearTimeout(restartPrimedTimerRef.current);
          }
          // Prime for 2 seconds
          restartPrimedTimerRef.current = setTimeout(() => {
            setIsRestartPrimed(false);
          }, 2000);
          return;
        }

        if (e.key === "Enter") {
          if (tabKeyDownRef.current || isRestartPrimed) {
            e.preventDefault();
            handleNextTest();
            return;
          }
        }
      }
    };

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        tabKeyDownRef.current = false;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("keyup", handleGlobalKeyUp);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("keyup", handleGlobalKeyUp);
      if (restartPrimedTimerRef.current) {
        clearTimeout(restartPrimedTimerRef.current);
      }
    };
  }, [isCommandPaletteOpen, settings.quickRestart, handleNextTest, isRestartPrimed]);

  return (
    <main
      className="min-h-screen flex flex-col justify-between selection:bg-yellow-500/20 transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
      {/* Header */}
      <Header />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 py-6">
        {completedStats ? (
          /* Results View */
          <ResultsModal
            stats={completedStats}
            mode={mode}
            subMode={subMode}
            language={language}
            isPersonalBest={isPersonalBest}
            onNextTest={handleNextTest}
            onRepeatTest={handleRepeatTest}
            onPracticeMissed={handlePracticeMissed}
          />
        ) : (
          /* Active Typing View */
          <div className="w-full flex flex-col items-center gap-8">
            {/* Fail Notification (if Sudden Death failed) */}
            {failReason && (
              <div
                className="py-2 px-4 rounded-xl text-xs font-bold shadow-md animate-shake flex items-center gap-2"
                style={{
                  backgroundColor: "var(--error-color)",
                  color: "#ffffff",
                }}
              >
                <span>{failReason}</span>
                <button
                  onClick={handleNextTest}
                  className="underline cursor-pointer ml-2"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Test Configuration Bar (fades out while typing to minimize distraction) */}
            <div
              className={`transition-opacity duration-300 ${
                status === "running" ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <ConfigBar
                mode={mode}
                subMode={subMode}
                punctuation={punctuation}
                numbers={numbers}
                language={language}
                onModeChange={(newMode, defaultSub) => {
                  setMode(newMode);
                  setSubMode(defaultSub);
                  if (newMode === "custom") setShowCustomModal(true);
                }}
                onSubModeChange={(sub) => setSubMode(sub)}
                onTogglePunctuation={() => setPunctuation((prev) => !prev)}
                onToggleNumbers={() => setNumbers((prev) => !prev)}
                onLanguageChange={(lang) => setLanguage(lang)}
              />
            </div>

            {/* Typing Engine Area */}
            <TypingArea
              words={words}
              currentWordIndex={currentWordIndex}
              currentCharIndex={currentCharIndex}
              status={status}
              timeLeft={timeLeft}
              elapsedSeconds={elapsedSeconds}
              liveWpm={liveWpm}
              liveAccuracy={liveAccuracy}
              paceCharIndex={paceCharIndex}
              mode={mode}
              subMode={subMode}
              quoteAuthor={currentQuote?.author}
              quoteSource={currentQuote?.source}
              isRestartPrimed={isRestartPrimed}
              onKeyDown={handleKeyDown}
              onRestart={handleNextTest}
            />

            {/* Optional Virtual Keyboard */}
            {settings.showKeyVisualizer && <VirtualKeyboard />}
          </div>
        )}
      </div>

      {/* Custom Text Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div
            className="w-full max-w-lg p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--sub-alt-color)",
              color: "var(--text-color)",
            }}
          >
            <h3 className="text-lg font-bold">Custom Text Test</h3>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste or type your custom text here..."
              rows={6}
              className="w-full p-3 rounded-xl font-mono text-sm border outline-none resize-none"
              style={{
                backgroundColor: "var(--sub-alt-color)",
                borderColor: "transparent",
                color: "var(--text-color)",
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                style={{ color: "var(--sub-color)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  resetTest(customText.trim().split(/\s+/));
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                style={{
                  backgroundColor: "var(--main-color)",
                  color: "var(--bg-color)",
                }}
              >
                Apply Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectMode={(m) => {
          setMode(m);
          setSubMode(m === "time" ? "30" : m === "words" ? "25" : "medium");
        }}
      />

      {/* Footer */}
      <Footer onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
    </main>
  );
}
