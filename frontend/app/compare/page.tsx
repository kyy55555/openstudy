"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { courseCode, courses, suggestedStudyStage } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { useCourseLibrary } from "../useCourseLibrary";

const levelZh: Record<string, string> = { Introductory: "入门", Intermediate: "中级", Undergraduate: "本科", "Advanced Undergraduate": "本科高阶", Advanced: "高级", Graduate: "研究生" };
const stageZh: Record<string, string> = { "Year 1": "本科一年级", "Year 2": "本科二年级", "Years 2–3": "本科二至三年级", "Years 3–4": "本科三至四年级", Graduate: "研究生" };

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = searchParams.get("lang") === "zh" ? "zh" : "en";
  const { library, loaded, toggleFavorite } = useCourseLibrary();
  const selected = library.favorites.map((id) => courses.find((course) => course.id === id)).filter((course) => course !== undefined);

  const labels = language === "zh" ? {
    back: "← 全部课程", title: "收藏与课程比较", subtitle: "根据可核实信息并排比较，不生成没有依据的推荐排名。", empty: "还没有收藏课程。请先从课程列表或详情页收藏想比较的课程。", browse: "浏览课程", university: "大学", level: "难度", stage: "建议阶段", year: "课程年份", prerequisites: "先修要求", resources: "官方资料入口", materials: "资料状态", remove: "移出比较", unknown: "尚未核实", none: "无需先修课", videos: "视频", assignments: "作业", solutions: "答案",
  } : {
    back: "← All courses", title: "Saved course comparison", subtitle: "Compare verified facts side by side without an unsupported recommendation ranking.", empty: "No saved courses yet. Save courses from the catalog or a course detail page first.", browse: "Browse courses", university: "University", level: "Level", stage: "Suggested stage", year: "Course year", prerequisites: "Prerequisites", resources: "Official resource links", materials: "Material status", remove: "Remove", unknown: "Not verified", none: "No prerequisites", videos: "Videos", assignments: "Assignments", solutions: "Solutions",
  };
  const status = (value: boolean | null) => value === null ? labels.unknown : value ? "✓" : "—";

  return <main className="mx-auto max-w-7xl px-6 py-10">
    <header className="flex items-start justify-between gap-4"><div><Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="text-sm text-gray-500 hover:text-black">{labels.back}</Link><h1 className="mt-3 text-3xl font-bold">{labels.title}</h1><p className="mt-2 text-gray-600">{labels.subtitle}</p></div><button onClick={() => router.replace(language === "zh" ? "/compare" : "/compare?lang=zh")} className="rounded-full border px-4 py-2 text-sm font-medium">{language === "zh" ? "English" : "中文"}</button></header>
    {loaded && selected.length === 0 && <section className="mt-10 rounded-2xl border border-dashed p-10 text-center"><p className="text-gray-600">{labels.empty}</p><Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="mt-5 inline-flex rounded-lg bg-black px-5 py-3 text-white">{labels.browse}</Link></section>}
    {selected.length > 0 && <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm"><thead><tr><th className="sticky left-0 z-10 border-b bg-white p-3 text-left" /><>{selected.map((course) => <th key={course.id} className="min-w-56 border-b p-3 text-left align-top"><Link href={courseDetailPath(course, language)} className="text-base font-semibold hover:underline">{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</Link><button onClick={() => toggleFavorite(course.id)} className="mt-2 block text-xs text-red-700 hover:underline">{labels.remove}</button></th>)}</></tr></thead><tbody>
      {[
        [labels.university, (course: typeof selected[number]) => course.university],
        [labels.level, (course: typeof selected[number]) => course.level ? (language === "zh" ? levelZh[course.level] ?? course.level : course.level) : labels.unknown],
        [labels.stage, (course: typeof selected[number]) => { const stage = suggestedStudyStage(course); return stage ? (language === "zh" ? stageZh[stage] ?? stage : stage) : labels.unknown; }],
        [labels.year, (course: typeof selected[number]) => course.year ?? labels.unknown],
        [labels.prerequisites, (course: typeof selected[number]) => course.prerequisites === null ? labels.unknown : course.prerequisites.length ? course.prerequisites.join(" · ") : labels.none],
        [labels.resources, (course: typeof selected[number]) => String(course.resources.length)],
        [labels.materials, (course: typeof selected[number]) => `${labels.videos} ${status(course.hasVideos)} · ${labels.assignments} ${status(course.hasAssignments)} · ${labels.solutions} ${status(course.hasSolutions)}`],
      ].map(([label, getter]) => <tr key={String(label)}><th className="sticky left-0 border-b bg-gray-50 p-3 text-left font-medium">{String(label)}</th>{selected.map((course) => <td key={course.id} className="border-b p-3 align-top text-gray-700">{String((getter as (course: typeof selected[number]) => unknown)(course))}</td>)}</tr>)}
    </tbody></table></div>}
  </main>;
}

export default function ComparePage() { return <Suspense><CompareContent /></Suspense>; }
