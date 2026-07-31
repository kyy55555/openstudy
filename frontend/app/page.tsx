"use client";

import Link from "next/link";
import { useState } from "react";

const homeCopy = {
  en: {
    eyebrow: "Verified university courses",
    subtitle: "Search open computer science courses from leading universities.",
    searchLabel: "Search courses",
    placeholder: "Algorithms, machine learning, Python, 算法...",
    search: "Search",
    browse: "Browse all 35 verified courses →",
    switchLanguage: "中文",
    switchLabel: "切换到中文",
  },
  zh: {
    eyebrow: "已核实的大学公开课",
    subtitle: "搜索世界一流大学公开的计算机科学课程。",
    searchLabel: "搜索课程",
    placeholder: "算法、机器学习、Python……",
    search: "搜索",
    browse: "浏览全部 35 门已核实课程 →",
    switchLanguage: "English",
    switchLabel: "Switch to English",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<keyof typeof homeCopy>("en");
  const copy = homeCopy[language];

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <button
        type="button"
        onClick={() => setLanguage((current) => (current === "en" ? "zh" : "en"))}
        aria-label={copy.switchLabel}
        className="absolute right-6 top-6 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        {copy.switchLanguage}
      </button>

      <section className="w-full max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
          {copy.eyebrow}
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          OpenStudy
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          {copy.subtitle}
        </p>

        <form action="/courses" method="get" className="mt-10 flex gap-2">
          <label htmlFor="course-search" className="sr-only">
            {copy.searchLabel}
          </label>
          <input
            id="course-search"
            name="q"
            type="search"
            placeholder={copy.placeholder}
            autoFocus
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-5 py-4 text-base shadow-sm outline-none focus:border-gray-700"
          />

          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-4 font-medium text-white hover:bg-gray-800"
          >
            {copy.search}
          </button>
        </form>

        <Link
          href="/courses"
          className="mt-5 inline-block text-sm text-gray-500 hover:text-black hover:underline"
        >
          {copy.browse}
        </Link>
      </section>
    </main>
  );
}
