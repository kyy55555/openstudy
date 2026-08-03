"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TermsContent() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
    <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500">← OpenStudy</Link>
    <h1 className="mt-5 text-3xl font-bold">{language === "zh" ? "使用说明与免责声明" : "Terms and disclaimer"}</h1>
    <p className="mt-2 text-sm text-gray-500">{language === "zh" ? "Beta 版本 · 更新于 2026 年 8 月 3 日" : "Beta version · Updated August 3, 2026"}</p>
    <div className="mt-8 space-y-6 leading-7 text-gray-700">
      <p>{language === "zh" ? "OpenStudy 是独立的自学课程索引，不隶属于、也不代表页面中列出的任何大学。大学名称及课程资料的权利归各自权利人所有。" : "OpenStudy is an independent self-study course index. It is not affiliated with or endorsed by any listed university. University names and course materials remain the property of their respective owners."}</p>
      <p>{language === "zh" ? "培养方案依据大学公开要求整理；学期位置可能根据先修关系推导。外校课程仅是自学替代，不表示内容完全等价、大学认可、可转学分或满足学位要求。请以大学最新官方规定为准。" : "Curriculum references are organized from public university requirements; term placement may be inferred from prerequisites. External courses are self-study substitutes and do not imply full equivalence, university approval, transfer credit, or degree completion. Always consult the university's latest official rules."}</p>
      <p>{language === "zh" ? "课程链接可能被大学更新、移动或关闭。学习计划和预计天数只是保守估算，不保证完成结果。Beta 期间功能可能调整，重要学习记录请自行保留备份。" : "Universities may update, move, or remove course links. Study plans and estimated durations are conservative estimates, not guarantees. Features may change during Beta, so keep your own backup of important learning records."}</p>
    </div>
  </main>;
}

export default function TermsPage() { return <Suspense><TermsContent /></Suspense>; }
