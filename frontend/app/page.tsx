"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courses } from "../data/courses";

const homeCopy = {
  en: {
    eyebrow: "OpenStudy Beta · Verified university courses",
    subtitle: "Search verified computer science courses and their mathematics and natural-science foundations.",
    scope: "Current Beta focus: computer science, mathematics, physics, and chemistry foundations. More fields will be added without interrupting the site.",
    searchLabel: "Search courses",
    placeholder: "Algorithms, machine learning, Python, 算法...",
    search: "Search",
    browse: `Browse all ${courses.length} verified courses →`,
    paths: "Explore university curriculum references →",
    today: "Today’s study →",
    dashboard: "User center →",
    switchLanguage: "中文",
    switchLabel: "切换到中文",
  },
  zh: {
    eyebrow: "OpenStudy Beta · 已核实的大学公开课",
    subtitle: "搜索已核实的计算机科学课程，以及相关数学与自然科学基础课程。",
    scope: "当前 Beta 重点：计算机科学、数学、物理与化学基础。更多专业将持续加入，网站无需停机。",
    searchLabel: "搜索课程",
    placeholder: "算法、机器学习、Python……",
    search: "搜索",
    browse: `浏览全部 ${courses.length} 门已核实课程 →`,
    paths: "查看顶尖大学培养方案参考 →",
    today: "今日学习 →",
    dashboard: "用户中心 →",
    switchLanguage: "English",
    switchLabel: "Switch to English",
  },
} as const;

function HomeContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [language, setLanguage] = useState<keyof typeof homeCopy>(params.get("lang") === "zh" ? "zh" : "en");
  const copy = homeCopy[language];

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 sm:py-16">
      <button
        type="button"
        onClick={() => {
          const nextLanguage = language === "en" ? "zh" : "en";
          setLanguage(nextLanguage);
          router.replace(nextLanguage === "zh" ? "/?lang=zh" : "/");
        }}
        aria-label={copy.switchLabel}
        className="absolute right-4 top-4 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 sm:right-6 sm:top-6"
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
        <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-950">
          {copy.scope}
        </p>

        <form action="/courses" method="get" className="mt-10 flex flex-col gap-2 sm:flex-row">
          {language === "zh" && <input type="hidden" name="lang" value="zh" />}

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
            className="rounded-xl bg-black px-6 py-4 font-medium text-white hover:bg-gray-800 sm:w-auto"
          >
            {copy.search}
          </button>
        </form>

        <Link
          href={language === "zh" ? "/courses?lang=zh" : "/courses"}
          className="mt-5 inline-block text-sm text-gray-500 hover:text-black hover:underline"
        >
          {copy.browse}
        </Link>
        <span className="mx-3 text-gray-300">·</span>
        <Link
          href={language === "zh" ? "/paths?lang=zh" : "/paths"}
          className="mt-5 inline-block text-sm text-gray-500 hover:text-black hover:underline"
        >
          {copy.paths}
        </Link>
        <span className="mx-3 text-gray-300">·</span>
        <Link href={language === "zh" ? "/today?lang=zh" : "/today"} className="mt-5 inline-block text-sm font-medium text-violet-700 hover:text-violet-950 hover:underline">{copy.today}</Link>
        <span className="mx-3 text-gray-300">·</span>
        <Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className="mt-5 inline-block text-sm text-gray-500 hover:text-black hover:underline">{copy.dashboard}</Link>
      </section>
    </main>
  );
}

export default function Home() { return <Suspense><HomeContent /></Suspense>; }
