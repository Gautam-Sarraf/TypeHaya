"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme, THEMES, DEFAULT_THEME, getThemeById } from "@/lib/themes";

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setThemeId: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>("serika_dark");
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const saved = localStorage.getItem("typehaya_theme");
    if (saved) {
      setThemeIdState(saved);
      setTheme(getThemeById(saved));
    }
  }, []);

  const setThemeId = (id: string) => {
    const selected = getThemeById(id);
    setThemeIdState(id);
    setTheme(selected);
    localStorage.setItem("typehaya_theme", id);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-color", theme.bgColor);
    root.style.setProperty("--main-color", theme.mainColor);
    root.style.setProperty("--caret-color", theme.caretColor);
    root.style.setProperty("--sub-color", theme.subColor);
    root.style.setProperty("--sub-alt-color", theme.subAltColor);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--error-color", theme.errorColor);
    root.style.setProperty("--error-extra-color", theme.errorExtraColor);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setThemeId,
        themes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
