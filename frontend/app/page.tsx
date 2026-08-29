"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courses } from "../data/courses";
import KnowledgeExplorer from "./KnowledgeExplorer";

const homeCopy = {
  en: {
    eyebrow: "OpenStudy Beta · Verified university courses",
    scope: "Explore verified university courses through direct materials and flexible self-study plans. More fields are continuously joining OpenStudy.",
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
    scope: "通过整理好的官方资料与弹性计划，自由探索大学公开课。更多专业正在持续加入 OpenStudy。",
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
    <main className="home-universe relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-16">
      <KnowledgeExplorer language={language} />
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
        <button
        type="button"
        onClick={() => {
          const nextLanguage = language === "en" ? "zh" : "en";
          setLanguage(nextLanguage);
          router.replace(nextLanguage === "zh" ? "/?lang=zh" : "/");
        }}
        aria-label={copy.switchLabel}
        className="home-top-control rounded-full border px-4 py-2 text-sm font-medium backdrop-blur"
      >
        {copy.switchLanguage}
        </button>
      </div>

      <nav aria-label={language === "zh" ? "网站信息" : "Site information"} className="home-footer absolute bottom-5 left-5 z-20 hidden items-center gap-3 text-xs sm:flex">
        <span>© {new Date().getFullYear()} OpenStudy</span>
        <Link href={language === "zh" ? "/privacy?lang=zh" : "/privacy"} className="hover:text-white hover:underline">{language === "zh" ? "隐私" : "Privacy"}</Link>
        <Link href={language === "zh" ? "/terms?lang=zh" : "/terms"} className="hover:text-white hover:underline">{language === "zh" ? "使用说明" : "Terms"}</Link>
        <Link href={language === "zh" ? "/feedback?lang=zh" : "/feedback"} className="hover:text-white hover:underline">{language === "zh" ? "反馈" : "Feedback"}</Link>
      </nav>

      <section className="home-cosmos-content pointer-events-none relative z-10 w-full max-w-3xl px-5 py-8 text-center sm:px-10 sm:py-10">
        <p className="home-eyebrow text-sm font-semibold uppercase tracking-[0.25em]">
          {copy.eyebrow}
        </p>

        <h1 className="home-title mt-4 text-6xl font-bold tracking-[-0.04em] sm:text-7xl">
          OpenStudy
        </h1>

        <p className="home-scope mx-auto mt-5 max-w-xl rounded-2xl border px-4 py-3 text-sm leading-6 backdrop-blur-sm">
          {copy.scope}
        </p>

        <form action="/courses" method="get" className="home-search-shell pointer-events-auto mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl p-2 shadow-2xl backdrop-blur-md sm:flex-row">
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
            className="home-search-input min-w-0 flex-1 rounded-xl border px-5 py-4 text-base shadow-sm outline-none"
          />

          <button
            type="submit"
            className="home-search-button rounded-xl px-6 py-4 font-medium sm:w-auto"
          >
            {copy.search}
          </button>
        </form>

        <div className="pointer-events-auto"><Link
          href={language === "zh" ? "/courses?lang=zh" : "/courses"}
          className="home-nav-link mt-5 inline-block text-sm hover:underline"
        >
          {copy.browse}
        </Link>
        <span className="home-nav-separator mx-3">·</span>
        <Link
          href={language === "zh" ? "/paths?lang=zh" : "/paths"}
          className="home-nav-link mt-5 inline-block text-sm hover:underline"
        >
          {copy.paths}
        </Link>
        <span className="home-nav-separator mx-3">·</span>
        <Link href={language === "zh" ? "/today?lang=zh" : "/today"} className="home-nav-link home-nav-link-accent mt-5 inline-block text-sm font-medium hover:underline">{copy.today}</Link>
        <span className="home-nav-separator mx-3">·</span>
        <Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className="home-nav-link mt-5 inline-block text-sm hover:underline">{copy.dashboard}</Link></div>
      </section>
    </main>
  );
}

export default function Home() { return <Suspense><HomeContent /></Suspense>; }
