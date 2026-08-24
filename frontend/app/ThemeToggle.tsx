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

  return <button type="button" onClick={toggleTheme} aria-label={language === "zh" ? `切换到${label}模式` : `Switch to ${label.toLowerCase()} mode`} className="theme-toggle rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-lg hover:border-gray-400"><span aria-hidden="true" className="mr-1.5">{dark ? "☀" : "☾"}</span>{label}</button>;
}
