"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function SiteFooter() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const suffix = language === "zh" ? "?lang=zh" : "";
  const isHome = usePathname() === "/";
  const footerClass = isHome
    ? "border-t border-white/10 bg-[#02040d] px-6 pb-24 pt-8 text-sm text-slate-400 sm:py-8"
    : "border-t border-gray-200 bg-white px-6 pb-24 pt-8 text-sm text-gray-500 sm:py-8";
  const linkClass = isHome ? "hover:text-white hover:underline" : "hover:text-black hover:underline";

  return <footer className={footerClass}>
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
      <p>© {new Date().getFullYear()} OpenStudy · {language === "zh" ? "培养方案仅供自学参考，不代表大学学分。" : "Curriculum references are for self-study and do not represent university credit."}</p>
      <nav className="flex flex-wrap gap-4" aria-label={language === "zh" ? "网站信息" : "Site information"}>
        <Link href={`/privacy${suffix}`} className={linkClass}>{language === "zh" ? "隐私" : "Privacy"}</Link>
        <Link href={`/terms${suffix}`} className={linkClass}>{language === "zh" ? "使用说明" : "Terms"}</Link>
        <Link href={`/feedback${suffix}`} className={linkClass}>{language === "zh" ? "反馈问题" : "Feedback"}</Link>
      </nav>
    </div>
  </footer>;
}
