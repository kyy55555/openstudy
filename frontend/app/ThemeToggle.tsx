"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  const saved = window.localStorage.getItem("openstudy-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ language }: { language: "en" | "zh" }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : preferredTheme());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("openstudy-theme", nextTheme);
    setTheme(nextTheme);
  }

  const dark = theme === "dark";
  const label = language === "zh"
    ? (dark ? "浅色" : "深色")
    : (dark ? "Light" : "Dark");

  return <button type="button" onClick={toggleTheme} aria-label={language === "zh" ? `切换到${label}模式` : `Switch to ${label.toLowerCase()} mode`} className="theme-toggle flex min-h-11 flex-1 items-center justify-center rounded-full border border-gray-200 bg-white px-2 py-2 text-xs font-semibold shadow-lg hover:border-gray-400 sm:flex-none sm:px-4 sm:text-sm"><span aria-hidden="true" className="sm:mr-1.5">{dark ? "☀" : "☾"}</span><span className="hidden sm:inline">{label}</span></button>;
}
