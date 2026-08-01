"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseCode, courses } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { learningPaths } from "../../data/learningPaths";
import { pathCompletion } from "../../data/courseLibrary";
import type { CourseProgress } from "../../data/courseLibrary";
import { useCourseLibrary } from "../useCourseLibrary";

function PathsContent() {
  const params = useSearchParams();
  const [language, setLanguage] = useState<"en" | "zh">(params.get("lang") === "zh" ? "zh" : "en");
  const [selectedId, setSelectedId] = useState(learningPaths[0].id);
  const path = learningPaths.find(({ id }) => id === selectedId) ?? learningPaths[0];
  const { library, loaded, setProgress } = useCourseLibrary();
  const pathCourseIds = path.phases.flatMap((phase) => [...phase.courseIds, ...phase.choiceGroups.flatMap((group) => group.courseIds)]);
  const completion = pathCompletion(pathCourseIds, library.progress);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500 hover:text-black">← OpenStudy</Link>
          <h1 className="mt-3 text-3xl font-bold">{language === "zh" ? "顶尖大学学习路线" : "Top university learning paths"}</h1>
          <p className="mt-2 max-w-3xl text-gray-600">{language === "zh" ? "课程要求来自大学官网；年级和学期由 OpenStudy 根据官方先修关系推导。跨校公开课会明确标注为等价替代。" : "Requirements come from university sources; OpenStudy infers year and term placement from official prerequisite chains. Cross-university open courses are clearly marked as equivalents."}</p>
        </div>
        <button onClick={() => setLanguage(language === "zh" ? "en" : "zh")} className="rounded-full border px-4 py-2 text-sm font-medium">{language === "zh" ? "English" : "中文"}</button>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-950">{language === "zh" ? "官方要求摘要" : "Official requirement summary"}</p>
              <ul className="mt-2 space-y-1 text-sm text-blue-900">{(language === "zh" ? path.officialRequirementNotesZh : path.officialRequirementNotes).map((note) => <li key={note}>• {note}</li>)}</ul>
            </div>
            <p className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{language === "zh" ? `官方要求 · ${path.calendar === "quarter" ? "按学季" : "按学期"} · 时间位置为先修关系推导` : `Official requirements · ${path.calendar === "quarter" ? "Quarter system" : "Semester system"} · Placement inferred from prerequisites`}</p>
          </div>
          <a href={path.officialUrl} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-medium underline underline-offset-4">{language === "zh" ? "查看官方培养方案 ↗" : "Official curriculum ↗"}</a>
        </div>

        {loaded && <div className="mt-6 rounded-xl bg-emerald-50 p-4"><div className="flex items-center justify-between gap-4 text-sm"><span className="font-semibold text-emerald-950">{language === "zh" ? `路线进度：${completion.completed}/${completion.total} 门` : `Path progress: ${completion.completed}/${completion.total}`}</span><span className="font-bold text-emerald-900">{completion.percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${completion.percent}%` }} /></div><p className="mt-2 text-xs text-emerald-800">{language === "zh" ? "进度仅保存在当前浏览器中。重复出现的选修课只计算一次。" : "Progress is stored only in this browser. Repeated electives count once."}</p></div>}

        <div className="mt-8 space-y-6">
          {path.phases.map((phase, index) => (
            <div key={phase.title} className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-[9rem_1fr]">
              <div><span className="text-sm text-gray-500">{language === "zh" ? `建议阶段 ${index + 1}` : `Suggested stage ${index + 1}`}</span><h3 className="mt-1 font-semibold">{language === "zh" ? phase.titleZh : phase.title}</h3></div>
              <div>
                <p className="text-sm text-gray-600">{language === "zh" ? phase.descriptionZh : phase.description}</p>
                {phase.courseIds.length > 0 && (
                  <p className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${phase.chooseCount === null ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-900"}`}>
                    {phase.chooseCount === null
                      ? (language === "zh" ? "本学期建议课程 · 必修与选项见说明" : "Suggested term courses · See notes for required versus optional")
                      : (language === "zh" ? `自由选课 · 以下任选 ${phase.chooseCount} 门` : `Flexible electives · Choose ${phase.chooseCount}`)}
                  </p>
                )}
                {phase.courseIds.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{phase.courseIds.map((id) => { const course = courses.find((item) => item.id === id); if (!course) return null; const substitute = course.university !== path.university; const status = library.progress[id] ?? "not-started"; return <div key={id} className="rounded-xl border border-gray-300 p-3"><Link href={courseDetailPath(course, language)} className="text-sm hover:underline"><span className="font-medium">{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</span><span className="mt-0.5 block text-xs text-gray-500">{course.university}{substitute ? ` · ${language === "zh" ? "等价公开课" : "Equivalent open course"}` : ` · ${language === "zh" ? "本校公开课" : "Home-university course"}`}</span></Link>{loaded && <select aria-label={`${courseCode(course)} progress`} value={status} onChange={(event) => setProgress(id, event.target.value as CourseProgress)} className="mt-2 w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs"><option value="not-started">{language === "zh" ? "未开始" : "Not started"}</option><option value="in-progress">{language === "zh" ? "学习中" : "In progress"}</option><option value="completed">{language === "zh" ? "已完成" : "Completed"}</option></select>}</div>; })}</div>}
                {phase.choiceGroups.map((group) => <div key={group.label} className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="text-xs font-semibold text-amber-900">{language === "zh" ? `${group.labelZh} · 以下任选 ${group.chooseCount} 门` : `${group.label} · Choose ${group.chooseCount}`}</p><div className="mt-2 flex flex-wrap gap-2">{group.courseIds.map((id) => { const course = courses.find((item) => item.id === id); if (!course) return null; const substitute = course.university !== path.university; return <Link key={id} href={courseDetailPath(course, language)} className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm hover:border-black"><span className="font-medium">{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</span><span className="mt-0.5 block text-xs text-gray-500">{course.university}{substitute ? ` · ${language === "zh" ? "等价公开课" : "Equivalent open course"}` : ""}</span></Link>; })}</div></div>)}
                {(language === "zh" ? phase.requirementsZh : phase.requirements).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(language === "zh" ? phase.requirementsZh : phase.requirements).map((requirement) => <span key={requirement} className="rounded-xl border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-900">{requirement}<span className="mt-0.5 block text-xs text-blue-700">{language === "zh" ? "官方要求 · 暂无公开课链接" : "Official requirement · No open-course link yet"}</span></span>)}</div>}
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
