"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseCode, courses } from "../../data/courses";
import { learningPaths } from "../../data/learningPaths";

function PathsContent() {
  const params = useSearchParams();
  const [language, setLanguage] = useState<"en" | "zh">(params.get("lang") === "zh" ? "zh" : "en");
  const [selectedId, setSelectedId] = useState(learningPaths[0].id);
  const path = learningPaths.find(({ id }) => id === selectedId) ?? learningPaths[0];

  function courseHref(title: string) {
    const search = new URLSearchParams({ q: title });
    if (language === "zh") search.set("lang", "zh");
    return `/courses?${search.toString()}`;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500 hover:text-black">← OpenStudy</Link>
          <h1 className="mt-3 text-3xl font-bold">{language === "zh" ? "顶尖大学学习路线" : "Top university learning paths"}</h1>
          <p className="mt-2 max-w-3xl text-gray-600">{language === "zh" ? "仅展示大学官网明确公布的培养要求。官方未规定学期的内容不会由 OpenStudy 自行编排；跨校课程会标注为等价替代。" : "Only requirements explicitly published by each university are shown. OpenStudy does not invent semester placement where the university specifies none; cross-university courses are marked as equivalents."}</p>
        </div>
        <button onClick={() => setLanguage(language === "zh" ? "en" : "zh")} className="rounded-full border px-4 py-2 text-sm font-medium">{language === "zh" ? "English" : "中文"}</button>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {learningPaths.map((item) => (
          <button key={item.id} onClick={() => setSelectedId(item.id)} className={`rounded-xl border p-4 text-left ${item.id === path.id ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
            <span className="font-semibold">{item.university}</span>
            <span className={`mt-1 block text-sm ${item.id === path.id ? "text-gray-300" : "text-gray-500"}`}>{language === "zh" ? item.programZh : item.program}</span>
          </button>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{path.university}</p>
            <h2 className="mt-1 text-2xl font-semibold">{language === "zh" ? path.programZh : path.program}</h2>
            <p className="mt-3 max-w-3xl text-gray-700">{language === "zh" ? path.summaryZh : path.summary}</p>
            <p className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{language === "zh" ? "依据官方培养要求 · 官方未规定统一学期" : "Based on official requirements · No universal semester order published"}</p>
          </div>
          <a href={path.officialUrl} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-medium underline underline-offset-4">{language === "zh" ? "查看官方培养方案 ↗" : "Official curriculum ↗"}</a>
        </div>

        <div className="mt-8 space-y-6">
          {path.phases.map((phase, index) => (
            <div key={phase.title} className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-[9rem_1fr]">
              <div><span className="text-sm text-gray-500">{language === "zh" ? `官方要求 ${index + 1}` : `Official requirement ${index + 1}`}</span><h3 className="mt-1 font-semibold">{language === "zh" ? phase.titleZh : phase.title}</h3></div>
              <div>
                <p className="text-sm text-gray-600">{language === "zh" ? phase.descriptionZh : phase.description}</p>
                {phase.courseIds.length > 0 && (
                  <p className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${phase.chooseCount === null ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-900"}`}>
                    {phase.chooseCount === null
                      ? (language === "zh" ? "基础序列 · 建议全部完成" : "Foundation sequence · Complete all")
                      : (language === "zh" ? `自由选课 · 以下任选 ${phase.chooseCount} 门` : `Flexible electives · Choose ${phase.chooseCount}`)}
                  </p>
                )}
                {phase.courseIds.length > 0 ? <div className="mt-3 flex flex-wrap gap-2">{phase.courseIds.map((id) => { const course = courses.find((item) => item.id === id); if (!course) return null; const substitute = course.university !== path.university; return <Link key={id} href={courseHref(course.title)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:border-black hover:bg-gray-50"><span className="font-medium">{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</span><span className="mt-0.5 block text-xs text-gray-500">{course.university}{substitute ? ` · ${language === "zh" ? "等价替代" : "Equivalent substitute"}` : ""}</span></Link>; })}</div> : <p className="mt-3 text-sm italic text-gray-500">{language === "zh" ? "这是官方规定的独立研究或论文要求，暂无可替代的普通公开课。" : "This is an official independent-work or thesis requirement with no ordinary open-course substitute."}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function PathsPage() {
  return <Suspense><PathsContent /></Suspense>;
}
