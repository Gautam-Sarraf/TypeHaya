export type CharStatus = "untyped" | "correct" | "incorrect" | "extra" | "missed";

export interface CharState {
  char: string;
  status: CharStatus;
  userTyped?: string;
}

export interface WordState {
  targetWord: string;
  characters: CharState[];
  isCompleted: boolean;
  hasErrors: boolean;
}

export interface TimelineSample {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface EngineStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalTyped: number;
  durationSeconds: number;
  timeline: TimelineSample[];
  keyErrors: Record<string, number>;
}

export type TestMode = "time" | "words" | "quote" | "zen" | "custom";
export type Difficulty = "normal" | "master" | "expert" | "suddendeath";

export interface EngineOptions {
  mode: TestMode;
  subMode: string; // e.g. "15", "30", "60", "25", "short", etc.
  difficulty?: Difficulty;
  blindMode?: boolean;
  confidenceMode?: boolean; // cannot backspace mistakes
  paceWpm?: number; // ghost cursor speed
}

export function createWordsStructure(targetWords: string[]): WordState[] {
  return targetWords.map((word) => ({
    targetWord: word,
    characters: word.split("").map((c) => ({
      char: c,
      status: "untyped" as CharStatus,
    })),
    isCompleted: false,
    hasErrors: false,
  }));
}

export function computeConsistency(samples: TimelineSample[]): number {
  if (samples.length < 2) return 100;
  const wpms = samples.map((s) => s.wpm);
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  if (mean === 0) return 100;
  const variance =
    wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  const coeffOfVariation = (stdDev / mean) * 100;
  return Math.max(0, Math.min(100, Math.round(100 - coeffOfVariation)));
}
