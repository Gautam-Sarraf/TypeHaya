"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  WordState,
  EngineStats,
  TestMode,
  Difficulty,
  createWordsStructure,
  computeConsistency,
  TimelineSample,
} from "@/lib/engine";
import { soundEngine } from "@/lib/sound";

export interface UseTypingEngineProps {
  initialWords: string[];
  mode: TestMode;
  subMode: string;
  difficulty?: Difficulty;
  blindMode?: boolean;
  confidenceMode?: boolean;
  soundPreset?: string;
  soundVolume?: number;
  isMuted?: boolean;
  paceWpm?: number;
  onComplete?: (stats: EngineStats) => void;
  onFail?: (reason: string) => void;
}

export function useTypingEngine({
  initialWords,
  mode,
  subMode,
  difficulty = "normal",
  blindMode = false,
  confidenceMode = false,
  soundPreset = "off",
  soundVolume = 0.5,
  isMuted = false,
  paceWpm = 0,
  onComplete,
  onFail,
}: UseTypingEngineProps) {
  const [words, setWords] = useState<WordState[]>(() =>
    createWordsStructure(initialWords)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return mode === "time" ? parseInt(subMode, 10) || 30 : 0;
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live Metrics
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveRawWpm, setLiveRawWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [paceCharIndex, setPaceCharIndex] = useState(0);

  // Counters
  const correctCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const extraCharsRef = useRef(0);
  const missedCharsRef = useRef(0);
  const totalTypedRef = useRef(0);
  const keyErrorsRef = useRef<Record<string, number>>({});
  const timelineRef = useRef<TimelineSample[]>([]);
  const errorsThisSecondRef = useRef(0);

  // Time & Intervals
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const samplerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  // Sound Engine Volume & Mute Sync
  useEffect(() => {
    soundEngine.setVolume(soundVolume);
    soundEngine.setMuted(Boolean(isMuted || soundPreset === "off"));
  }, [soundVolume, isMuted, soundPreset]);

  // Reset Engine when initialWords or mode changes
  const resetTest = useCallback(
    (newWords?: string[]) => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (samplerIntervalRef.current) clearInterval(samplerIntervalRef.current);

      const targetList = newWords || initialWords;
      setWords(createWordsStructure(targetList));
      setCurrentWordIndex(0);
      setCurrentCharIndex(0);
      setStatus("idle");
      setTimeLeft(mode === "time" ? parseInt(subMode, 10) || 30 : 0);
      setElapsedSeconds(0);
      setLiveWpm(0);
      setLiveRawWpm(0);
      setLiveAccuracy(100);
      setPaceCharIndex(0);

      correctCharsRef.current = 0;
      incorrectCharsRef.current = 0;
      extraCharsRef.current = 0;
      missedCharsRef.current = 0;
      totalTypedRef.current = 0;
      keyErrorsRef.current = {};
      timelineRef.current = [];
      errorsThisSecondRef.current = 0;
      startTimeRef.current = null;
    },
    [initialWords, mode, subMode]
  );

  // Finalize Test and Compute Comprehensive Stats
  const finishTest = useCallback(() => {
    if (statusRef.current === "completed" || statusRef.current === "failed") return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (samplerIntervalRef.current) clearInterval(samplerIntervalRef.current);

    setStatus("completed");

    const now = Date.now();
    const duration = startTimeRef.current
      ? Math.max(1, (now - startTimeRef.current) / 1000)
      : 1;
    const durationMinutes = duration / 60;

    const correct = correctCharsRef.current;
    const total = totalTypedRef.current;
    const finalWpm = Math.max(0, Math.round((correct / 5) / durationMinutes));
    const finalRawWpm = Math.max(0, Math.round((total / 5) / durationMinutes));
    const finalAccuracy = total > 0 ? Math.round((correct / total) * 1000) / 10 : 100;
    const consistency = computeConsistency(timelineRef.current);

    const stats: EngineStats = {
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency,
      correctChars: correct,
      incorrectChars: incorrectCharsRef.current,
      extraChars: extraCharsRef.current,
      missedChars: missedCharsRef.current,
      totalTyped: total,
      durationSeconds: Math.round(duration * 10) / 10,
      timeline: [...timelineRef.current],
      keyErrors: { ...keyErrorsRef.current },
    };

    onComplete?.(stats);
  }, [onComplete]);

  // Handle Fail Condition (Difficulty: Master, Expert, Sudden Death)
  const triggerFail = useCallback(
    (reason: string) => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (samplerIntervalRef.current) clearInterval(samplerIntervalRef.current);
      setStatus("failed");
      onFail?.(reason);
    },
    [onFail]
  );

  // Start Timing Engine
  const startEngine = useCallback(() => {
    setStatus("running");
    startTimeRef.current = Date.now();

    // 1-second interval sampler for timeline curve and live metrics
    samplerIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const elapsedMinutes = Math.max(0.016, elapsed / 60);

      const curCorrect = correctCharsRef.current;
      const curTotal = totalTypedRef.current;

      const curWpm = Math.round((curCorrect / 5) / elapsedMinutes);
      const curRawWpm = Math.round((curTotal / 5) / elapsedMinutes);
      const curAcc = curTotal > 0 ? Math.round((curCorrect / curTotal) * 100) : 100;

      setLiveWpm(curWpm);
      setLiveRawWpm(curRawWpm);
      setLiveAccuracy(curAcc);
      setElapsedSeconds(Math.floor(elapsed));

      timelineRef.current.push({
        second: Math.floor(elapsed),
        wpm: curWpm,
        rawWpm: curRawWpm,
        errors: errorsThisSecondRef.current,
      });
      errorsThisSecondRef.current = 0;

      // Pace Caret calculation
      if (paceWpm > 0) {
        const paceChars = (paceWpm * 5 * (elapsed / 60));
        setPaceCharIndex(Math.floor(paceChars));
      }
    }, 1000);

    // Main Countdown or Countup Timer
    timerIntervalRef.current = setInterval(() => {
      if (mode === "time") {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  }, [mode, finishTest, paceWpm]);

  // Key Event Processor
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      // Allow function keys and keyboard shortcuts like Tab, F5, F11, etc.
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "CapsLock" ||
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key.startsWith("F")
      ) {
        return;
      }

      if (status === "completed" || status === "failed") return;

      // Start on first valid keydown
      if (status === "idle") {
        startEngine();
      }

      // Play mechanical sound
      soundEngine.play(soundPreset);

      const currentWord = words[currentWordIndex];
      if (!currentWord) return;

      // BACKSPACE HANDLING
      if (e.key === "Backspace") {
        e.preventDefault();

        // In confidence mode, backspacing is disabled
        if (confidenceMode) return;

        if (currentCharIndex > 0) {
          // Normal character backspace within active word
          const prevIndex = currentCharIndex - 1;
          const charState = currentWord.characters[prevIndex];

          setWords((prev) => {
            const next = [...prev];
            const updatedChars = [...next[currentWordIndex].characters];

            if (charState.status === "extra") {
              // Remove extra character
              updatedChars.splice(prevIndex, 1);
              extraCharsRef.current = Math.max(0, extraCharsRef.current - 1);
            } else {
              // Revert untyped
              if (charState.status === "correct") {
                correctCharsRef.current = Math.max(0, correctCharsRef.current - 1);
              } else if (charState.status === "incorrect") {
                incorrectCharsRef.current = Math.max(0, incorrectCharsRef.current - 1);
              }
              updatedChars[prevIndex] = {
                ...charState,
                status: "untyped",
                userTyped: undefined,
              };
            }

            next[currentWordIndex] = {
              ...next[currentWordIndex],
              characters: updatedChars,
            };
            return next;
          });

          setCurrentCharIndex(prevIndex);
        } else if (currentWordIndex > 0) {
          // Backspace into previous word if it had errors
          const prevWord = words[currentWordIndex - 1];
          if (prevWord.hasErrors) {
            setCurrentWordIndex((prev) => prev - 1);
            setCurrentCharIndex(prevWord.characters.length);
          }
        }
        return;
      }

      // SPACEBAR HANDLING: Advance word
      if (e.key === " ") {
        e.preventDefault();

        // Prevent skipping without typing anything
        if (currentCharIndex === 0) return;

        const isLastWord = currentWordIndex === words.length - 1;
        const targetLen = currentWord.targetWord.length;

        // Check if word has missed characters
        let missedCount = 0;
        let wordHasError = false;

        const updatedChars = currentWord.characters.map((c, idx) => {
          if (idx >= currentCharIndex && c.status === "untyped") {
            missedCount++;
            missedCharsRef.current++;
            wordHasError = true;
            return { ...c, status: "missed" as const };
          }
          if (c.status === "incorrect" || c.status === "extra") {
            wordHasError = true;
          }
          return c;
        });

        // Expert difficulty fails if word completed with errors
        if (difficulty === "expert" && wordHasError) {
          triggerFail("Failed on Expert: skipped word with errors");
          return;
        }

        // Account space as typed character if current word had no missed
        totalTypedRef.current++;
        if (!wordHasError) {
          correctCharsRef.current++;
        }

        setWords((prev) => {
          const next = [...prev];
          next[currentWordIndex] = {
            ...next[currentWordIndex],
            characters: updatedChars,
            isCompleted: true,
            hasErrors: wordHasError,
          };
          return next;
        });

        if (isLastWord) {
          finishTest();
        } else {
          setCurrentWordIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }
        return;
      }

      // REGULAR CHARACTER INPUT
      if (e.key.length === 1) {
        e.preventDefault();
        const inputChar = e.key;
        totalTypedRef.current++;

        const targetLen = currentWord.targetWord.length;

        if (currentCharIndex < targetLen) {
          // Typing within the word boundary
          const targetChar = currentWord.characters[currentCharIndex].char;
          const isCorrect = inputChar === targetChar;

          if (isCorrect) {
            correctCharsRef.current++;
          } else {
            incorrectCharsRef.current++;
            errorsThisSecondRef.current++;
            keyErrorsRef.current[inputChar] = (keyErrorsRef.current[inputChar] || 0) + 1;

            if (difficulty === "master" || difficulty === "suddendeath") {
              triggerFail("Failed: typo in " + difficulty + " mode");
              return;
            }
          }

          setWords((prev) => {
            const next = [...prev];
            const updatedChars = [...next[currentWordIndex].characters];
            updatedChars[currentCharIndex] = {
              char: targetChar,
              status: isCorrect ? "correct" : "incorrect",
              userTyped: inputChar,
            };
            const hasErr = updatedChars.some(
              (c) => c.status === "incorrect" || c.status === "extra"
            );
            next[currentWordIndex] = {
              ...next[currentWordIndex],
              characters: updatedChars,
              hasErrors: hasErr,
            };
            return next;
          });

          const nextCharIndex = currentCharIndex + 1;
          setCurrentCharIndex(nextCharIndex);

          // If last character of last word, complete test
          if (currentWordIndex === words.length - 1 && nextCharIndex === targetLen) {
            finishTest();
          }
        } else {
          // Extra characters beyond target length (up to +10 chars max)
          if (currentWord.characters.length - targetLen < 10) {
            extraCharsRef.current++;
            errorsThisSecondRef.current++;
            keyErrorsRef.current[inputChar] = (keyErrorsRef.current[inputChar] || 0) + 1;

            if (difficulty === "master" || difficulty === "suddendeath") {
              triggerFail("Failed: extra character in " + difficulty + " mode");
              return;
            }

            setWords((prev) => {
              const next = [...prev];
              const updatedChars = [
                ...next[currentWordIndex].characters,
                {
                  char: inputChar,
                  status: "extra" as const,
                  userTyped: inputChar,
                },
              ];
              next[currentWordIndex] = {
                ...next[currentWordIndex],
                characters: updatedChars,
                hasErrors: true,
              };
              return next;
            });

            setCurrentCharIndex((prev) => prev + 1);
          }
        }
      }
    },
    [
      status,
      words,
      currentWordIndex,
      currentCharIndex,
      confidenceMode,
      difficulty,
      soundPreset,
      startEngine,
      finishTest,
      triggerFail,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (samplerIntervalRef.current) clearInterval(samplerIntervalRef.current);
    };
  }, []);

  return {
    words,
    currentWordIndex,
    currentCharIndex,
    status,
    timeLeft,
    elapsedSeconds,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    paceCharIndex,
    handleKeyDown,
    resetTest,
    finishTest,
  };
}
