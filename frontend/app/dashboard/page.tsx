"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { courseCode, courses } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { buildGentlePlan } from "../../data/coursePlans";
import { learningPathCoverage } from "../../data/courseLibrary";
import { learningPaths } from "../../data/learningPaths";
import { useCourseLibrary } from "../useCourseLibrary";

function CourseList({ ids, language, empty }: { ids: string[]; language: "en" | "zh"; empty: string }) {
  const items = ids.map((id) => courses.find((course) => course.id === id)).filter((course) => course !== undefined);
  if (!items.length) return <p className="mt-3 text-sm text-gray-500">{empty}</p>;
  return <div className="mt-3 grid gap-2 sm:grid-cols-2">{items.map((course) => <Link key={course.id} href={courseDetailPath(course, language)} className="rounded-xl border border-gray-200 p-3 hover:border-black"><span className="text-sm font-semibold">{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</span><span className="mt-1 block text-xs text-gray-500">{course.university}</span></Link>)}</div>;
}

function DashboardContent() {
  const params = useSearchParams();
  const language = params.get("lang") === "zh" ? "zh" : "en";
  const { library, loaded, toggleStudyTask, recordResourceOpen, clearLastOpenedResource } = useCourseLibrary();
  const inProgress = courses.filter((course) => library.progress[course.id] === "in-progress").map((course) => course.id);
  const completed = courses.filter((course) => library.progress[course.id] === "completed").map((course) => course.id);
  const completedResources = library.completedResources.length;
  const activePlans = Object.entries(library.studyPlans).flatMap(([courseId, saved]) => {
    const course = courses.find((item) => item.id === courseId);
    const generated = buildGentlePlan(courseId, saved.days);
    if (!course || !generated) return [];
    const nextTask = generated.days.flatMap(({ tasks }) => tasks).find((task) => task.kind !== "buffer" && !saved.completedTaskIds.includes(task.id));
    return [{ course, saved, generated, nextTask }];
  });
  const coverage = learningPaths.map((path) => ({ path, ...learningPathCoverage(path.phases, library.progress) })).filter(({ completed }) => completed > 0).sort((a, b) => b.completed - a.completed || b.percent - a.percent);
  const copy = language === "zh" ? {
    back: "← OpenStudy", title: "我的学习中心", subtitle: "根据你的实际学习记录继续课程；大学培养方案只作为参考。", continue: "继续学习", noPlan: "还没有进行中的课程计划。你可以在支持规划的课程详情页输入目标天数。", current: "正在学习", noCurrent: "还没有标记为学习中的课程。", done: "已完成课程", noDone: "完成课程后会显示在这里，并自然点亮相关培养方案。", saved: "收藏课程", noSaved: "还没有收藏课程。", coverage: "培养方案自然覆盖", noCoverage: "完成课程后，这里会显示你自然覆盖最多的参考培养方案，无需选择路线。", overview: "学习概览", courses: "完成课程", resources: "完成资料", plans: "进行中计划", target: "目标", planned: "保守规划", next: "继续上次任务", completeTask: "完成这个任务", finishedPlan: "计划任务已全部完成，请自行确认整门课程状态。", reference: "查看参考方案",
  } : {
    back: "← OpenStudy", title: "My learning", subtitle: "Continue from your actual learning record; university curricula remain references only.", continue: "Continue learning", noPlan: "No active course plan yet. Set a target on a course that supports planning.", current: "In progress", noCurrent: "No courses are marked in progress.", done: "Completed courses", noDone: "Completed courses appear here and naturally light up relevant curricula.", saved: "Saved courses", noSaved: "No saved courses yet.", coverage: "Natural curriculum coverage", noCoverage: "Complete courses to see the curricula you naturally cover most—no path selection required.", overview: "Learning overview", courses: "Courses completed", resources: "Resources completed", plans: "Active plans", target: "Target", planned: "Conservative plan", next: "Continue last task", completeTask: "Complete this task", finishedPlan: "All plan tasks are complete. Confirm the whole course separately.", reference: "View curriculum reference",
  };

  if (!loaded) return <main className="mx-auto max-w-6xl px-6 py-12"><p>{language === "zh" ? "正在读取学习记录…" : "Loading learning record…"}</p></main>;
  return <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
    <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500 hover:text-black">{copy.back}</Link>
    <h1 className="mt-4 text-3xl font-bold">{copy.title}</h1><p className="mt-2 text-gray-600">{copy.subtitle}</p>
    <section className="mt-8"><h2 className="text-lg font-semibold">{copy.overview}</h2><div className="mt-3 grid gap-3 sm:grid-cols-3">{[[copy.courses, completed.length], [copy.resources, completedResources], [copy.plans, activePlans.length]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-gray-200 p-5"><strong className="text-3xl">{value}</strong><span className="mt-1 block text-sm text-gray-500">{label}</span></div>)}</div></section>
    <section className="mt-8"><h2 className="text-xl font-semibold">{copy.continue}</h2>{library.lastOpenedResource && (() => { const recentCourse = courses.find((course) => course.id === library.lastOpenedResource?.courseId); if (!recentCourse) return null; const recent = library.lastOpenedResource; return <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-blue-800">{language === "zh" ? "最近打开的资料" : "Last opened resource"}</p><Link href={courseDetailPath(recentCourse, language)} className="mt-1 block font-semibold hover:underline">{courseCode(recentCourse)} · {language === "zh" ? recentCourse.titleZh : recentCourse.title}</Link></div><button onClick={clearLastOpenedResource} className="text-xs text-gray-500 hover:text-black hover:underline">{language === "zh" ? "清除记录" : "Clear"}</button></div><a href={recent.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(recent.courseId, recent.url, recent.title, recent.titleZh)} className="mt-3 inline-block text-sm text-blue-900 hover:underline">{language === "zh" ? recent.titleZh : recent.title} · {new Date(recent.openedAt).toLocaleString(language === "zh" ? "zh-CN" : "en-US")} ↗</a></div>; })()}{activePlans.length === 0 ? <p className="mt-3 text-sm text-gray-500">{copy.noPlan}</p> : <div className="mt-3 grid gap-4 lg:grid-cols-2">{activePlans.map(({ course, saved, generated, nextTask }) => <div key={course.id} className="rounded-2xl border border-violet-200 bg-violet-50 p-5"><Link href={courseDetailPath(course, language)} className="font-semibold hover:underline">{courseCode(course)} · {language === "zh" ? course.titleZh : course.title}</Link><p className="mt-1 text-xs text-violet-800">{copy.target} {saved.days} · {copy.planned} {generated.plannedDays}</p>{nextTask ? <><a href={nextTask.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(course.id, nextTask.url, nextTask.title, nextTask.titleZh)} className="mt-4 block text-sm font-medium hover:underline">{copy.next}：{language === "zh" ? nextTask.titleZh : nextTask.title} ↗</a><button onClick={() => toggleStudyTask(course.id, nextTask.id)} className="mt-3 rounded-lg bg-violet-900 px-3 py-2 text-sm text-white">{copy.completeTask}</button></> : <p className="mt-4 text-sm text-emerald-800">{copy.finishedPlan}</p>}</div>)}</div>}</section>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.current}</h2><CourseList ids={inProgress} language={language} empty={copy.noCurrent} /></section><section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.done}</h2><CourseList ids={completed} language={language} empty={copy.noDone} /></section><section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.saved}</h2><CourseList ids={library.favorites} language={language} empty={copy.noSaved} /></section><section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.coverage}</h2>{coverage.length === 0 ? <p className="mt-3 text-sm text-gray-500">{copy.noCoverage}</p> : <div className="mt-3 space-y-3">{coverage.map(({ path, completed: count, total, percent }) => <div key={path.id} className="rounded-xl bg-emerald-50 p-3"><div className="flex justify-between gap-3 text-sm"><span className="font-semibold">{path.university}</span><span>{percent}% · {count}/{total}</span></div><Link href={`${language === "zh" ? "/paths?lang=zh&" : "/paths?"}path=${path.id}`} className="mt-2 inline-block text-xs text-emerald-800 hover:underline">{copy.reference} →</Link></div>)}</div>}</section></div>
  </main>;
}

export default function DashboardPage() { return <Suspense><DashboardContent /></Suspense>; }
