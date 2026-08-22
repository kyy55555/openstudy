"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courseCode, courses } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { learningPaths } from "../../data/learningPaths";
import { learningPathCoverage, phaseCoverage } from "../../data/courseLibrary";
import type { CourseProgress } from "../../data/courseLibrary";
import { useCourseLibrary } from "../useCourseLibrary";

function PathsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "zh">(params.get("lang") === "zh" ? "zh" : "en");
  const requestedPath = params.get("path");
  const [selectedId, setSelectedId] = useState(learningPaths.some(({ id }) => id === requestedPath) ? requestedPath! : learningPaths[0].id);
  const path = learningPaths.find(({ id }) => id === selectedId) ?? learningPaths[0];
  const { library, loaded, setProgress } = useCourseLibrary();
  const completion = learningPathCoverage(path.phases, library.progress);
  const pathCourseIds = [...new Set(path.phases.flatMap((phase) => [...phase.courseIds, ...phase.choiceGroups.flatMap((group) => group.courseIds)]))];
  const homeCourseCount = pathCourseIds.filter((id) => courses.find((course) => course.id === id)?.university === path.university).length;
  const substituteCount = pathCourseIds.length - homeCourseCount;

  function pathsUrl(nextPathId: string, nextLanguage: "en" | "zh") {
    const nextParams = new URLSearchParams({ path: nextPathId });
    if (nextLanguage === "zh") nextParams.set("lang", "zh");
    return `/paths?${nextParams.toString()}`;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500 hover:text-black">← OpenStudy</Link>
          <h1 className="mt-3 text-3xl font-bold">{language === "zh" ? "顶尖大学培养方案参考" : "University curriculum references"}</h1>
          <p className="mt-2 max-w-3xl text-gray-600">{language === "zh" ? "培养方案仅供参考，无需选择或加入。完成课程后会自然点亮所有相关方案；外校课程只作为自学替代，不代表课程等价、大学认可或学分。" : "Curricula are references only—there is nothing to select or join. Completed courses naturally light up every relevant curriculum. External courses are self-study substitutes, not claims of equivalence, university approval, or credit."}</p>
        </div>
        <button onClick={() => { const nextLanguage = language === "zh" ? "en" : "zh"; setLanguage(nextLanguage); router.replace(pathsUrl(selectedId, nextLanguage)); }} className="rounded-full border px-4 py-2 text-sm font-medium">{language === "zh" ? "English" : "中文"}</button>
      </header>

      <aside className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
        <p className="font-semibold">{language === "zh" ? "阅读培养方案前请注意" : "Before using a curriculum reference"}</p>
        <ul className="mt-2 space-y-1">
          <li>• {language === "zh" ? "这是个人自学参考，不代表大学官方建议的逐学期安排。" : "This is a personal self-study reference, not the university's official term-by-term recommendation."}</li>
          <li>• {language === "zh" ? "外校公开课只是资料替代，不代表课程等价、学分或大学认可。" : "An external open course is only a resource substitute, not equivalence, credit, or university approval."}</li>
          <li>• {language === "zh" ? "学校未公布年级位置时，建议阶段依据官方先修关系推断，并明确标注。" : "When a school does not publish year placement, suggested stages are inferred from official prerequisites and labeled as such."}</li>
        </ul>
      </aside>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((item) => (
          <button key={item.id} onClick={() => { setSelectedId(item.id); router.replace(pathsUrl(item.id, language)); }} className={`rounded-xl border p-4 text-left ${item.id === path.id ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
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
            <p className="mt-2 text-xs font-medium text-gray-700">{language === "zh" ? `当前公开课覆盖：本校 ${homeCourseCount} 门 · 明确标注的外校替代 ${substituteCount} 门` : `Current open-course coverage: ${homeCourseCount} home-university courses · ${substituteCount} explicitly labeled external substitutes`}</p>
            <p className="mt-2 text-xs text-gray-500">{language === "zh" ? `来源版本：${path.sourceEditionZh} · 核验日期：${path.verifiedOn}` : `Source edition: ${path.sourceEdition} · Verified: ${path.verifiedOn}`}</p>
            {path.additionalOfficialSources?.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="mr-4 mt-2 inline-block text-xs font-medium text-gray-600 underline underline-offset-4">{language === "zh" ? source.titleZh : source.title} ↗</a>)}
          </div>
          <a href={path.officialUrl} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-medium underline underline-offset-4">{language === "zh" ? "查看官方培养方案 ↗" : "Official curriculum ↗"}</a>
        </div>

        {loaded && <div className="mt-6 rounded-xl bg-emerald-50 p-4"><div className="flex items-center justify-between gap-4 text-sm"><span className="font-semibold text-emerald-950">{language === "zh" ? `参考方案覆盖度：${completion.completed}/${completion.total} 个课程位置` : `Curriculum coverage: ${completion.completed}/${completion.total} course slots`}</span><span className="font-bold text-emerald-900">{completion.percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${completion.percent}%` }} /></div><p className="mt-2 text-xs text-emerald-800">{language === "zh" ? "这只是参考覆盖度，不代表大学学分或必须完成的路线。选修按要求数量计算；暂无公开课链接的要求不计入。" : "This is reference coverage, not university credit or a required path. Electives count by required slots; requirements without open-course links are excluded."}</p></div>}

        <div className="mt-8 space-y-6">
          {path.phases.map((phase, index) => { const phaseResult = phaseCoverage(phase, library.progress); const phaseClass = phaseResult.status === "completed" ? "border-emerald-400 bg-emerald-50" : phaseResult.status === "partial" ? "border-blue-300 bg-blue-50/50" : "border-gray-200 bg-white"; return (
            <div key={phase.title} className={`grid gap-4 rounded-2xl border p-5 sm:grid-cols-[9rem_1fr] ${phaseClass}`}>
              <div><span className="text-sm text-gray-500">{language === "zh" ? `建议阶段 ${index + 1}` : `Suggested stage ${index + 1}`}</span><h3 className="mt-1 font-semibold">{language === "zh" ? phase.titleZh : phase.title}</h3><span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${phaseResult.status === "completed" ? "bg-emerald-700 text-white" : phaseResult.status === "partial" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-600"}`}>{phaseResult.status === "completed" ? (language === "zh" ? "✓ 学期已点亮" : "✓ Term lit") : phaseResult.status === "partial" ? (language === "zh" ? `部分完成 ${phaseResult.completed}/${phaseResult.required}` : `Partial ${phaseResult.completed}/${phaseResult.required}`) : (language === "zh" ? "尚未开始" : "Not started")}</span></div>
              <div>
                <p className="text-sm text-gray-600">{language === "zh" ? phase.descriptionZh : phase.description}</p>
                {phase.courseIds.length > 0 && (
                  <p className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${phase.chooseCount === null ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-900"}`}>
                    {phase.chooseCount === null
                      ? (language === "zh" ? "本学期建议课程 · 必修与选项见说明" : "Suggested term courses · See notes for required versus optional")
                      : (language === "zh" ? `自由选课 · 以下任选 ${phase.chooseCount} 门` : `Flexible electives · Choose ${phase.chooseCount}`)}
                  </p>
                )}
                {phase.courseIds.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{phase.courseIds.map((id) => { const course = courses.find((item) => item.id === id); if (!course) return null; const substitute = course.university !== path.university; const status = library.progress[id] ?? "not-started"; return <div key={id} className={`rounded-xl border p-3 ${status === "completed" ? "border-emerald-400 bg-emerald-100" : status === "in-progress" ? "border-blue-300 bg-blue-50" : "border-gray-300 bg-white"}`}><Link href={courseDetailPath(course, language)} className="text-sm hover:underline"><span className="font-medium">{status === "completed" && "✓ "}{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</span><span className="mt-0.5 block text-xs text-gray-500">{course.university}{substitute ? ` · ${language === "zh" ? "外校自学替代" : "External self-study substitute"}` : ` · ${language === "zh" ? "本校公开课" : "Home-university course"}`}</span></Link>{loaded && <select aria-label={`${courseCode(course)} progress`} value={status} onChange={(event) => setProgress(id, event.target.value as CourseProgress)} className="mt-2 w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs"><option value="not-started">{language === "zh" ? "未开始" : "Not started"}</option><option value="in-progress">{language === "zh" ? "学习中" : "In progress"}</option><option value="completed">{language === "zh" ? "已完成" : "Completed"}</option></select>}</div>; })}</div>}
                {phase.choiceGroups.map((group) => <div key={group.label} className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="text-xs font-semibold text-amber-900">{language === "zh" ? `${group.labelZh} · 以下任选 ${group.chooseCount} 门` : `${group.label} · Choose ${group.chooseCount}`}</p><div className="mt-2 flex flex-wrap gap-2">{group.courseIds.map((id) => { const course = courses.find((item) => item.id === id); if (!course) return null; const substitute = course.university !== path.university; const completed = library.progress[id] === "completed"; return <Link key={id} href={courseDetailPath(course, language)} className={`rounded-lg border px-3 py-2 text-sm hover:border-black ${completed ? "border-emerald-400 bg-emerald-100" : "border-amber-300 bg-white"}`}><span className="font-medium">{completed && "✓ "}{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</span><span className="mt-0.5 block text-xs text-gray-500">{course.university}{substitute ? ` · ${language === "zh" ? "外校自学替代" : "External self-study substitute"}` : ""}</span></Link>; })}</div></div>)}
                {(language === "zh" ? phase.requirementsZh : phase.requirements).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(language === "zh" ? phase.requirementsZh : phase.requirements).map((requirement) => <span key={requirement} className="rounded-xl border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-900">{requirement}<span className="mt-0.5 block text-xs text-blue-700">{language === "zh" ? "官方要求 · 暂无公开课链接" : "Official requirement · No open-course link yet"}</span></span>)}</div>}
              </div>
            </div>
          ); })}
        </div>
      </section>
    </main>
  );
}

export default function PathsPage() {
  return <Suspense><PathsContent /></Suspense>;
}
