"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SiteFooter() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const suffix = language === "zh" ? "?lang=zh" : "";

  return <footer className="border-t border-gray-200 bg-white px-6 py-8 text-sm text-gray-500">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
      <p>© {new Date().getFullYear()} OpenStudy · {language === "zh" ? "培养方案仅供自学参考，不代表大学学分。" : "Curriculum references are for self-study and do not represent university credit."}</p>
      <nav className="flex flex-wrap gap-4" aria-label={language === "zh" ? "网站信息" : "Site information"}>
        <Link href={`/privacy${suffix}`} className="hover:text-black hover:underline">{language === "zh" ? "隐私" : "Privacy"}</Link>
        <Link href={`/terms${suffix}`} className="hover:text-black hover:underline">{language === "zh" ? "使用说明" : "Terms"}</Link>
        <Link href={`/feedback${suffix}`} className="hover:text-black hover:underline">{language === "zh" ? "反馈问题" : "Feedback"}</Link>
      </nav>
    </div>
  </footer>;
}
