"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { courseCode, courses, suggestedStudyStage } from "../../../data/courses";
import { courseDetailPath, prerequisiteCourseIds } from "../../../data/courseNavigation";
import { useCourseLibrary } from "../../useCourseLibrary";
import { courseResourceKey } from "../../../data/courseLibrary";
import type { CourseProgress } from "../../../data/courseLibrary";
import { buildGentlePlan, structuredCoursePlans } from "../../../data/coursePlans";

const resourceZh = {
  syllabus: "课程大纲", schedule: "课程安排", lectures: "讲义与视频", assignments: "作业",
  exams: "考试与测试题", projects: "课程项目", materials: "其他资料", downloads: "完整资料包",
} as const;

const levelZh: Record<string, string> = { Introductory: "入门", Intermediate: "中级", Undergraduate: "本科", "Advanced Undergraduate": "本科高阶", Advanced: "高级", Graduate: "研究生" };
const stageZh: Record<string, string> = { "Year 1": "本科一年级", "Year 2": "本科二年级", "Years 2–3": "本科二至三年级", "Years 3–4": "本科三至四年级", Graduate: "研究生" };

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = searchParams.get("lang") === "zh" ? "zh" : "en";
  const course = courses.find(({ id }) => id === params.id);
  const { library, loaded, setProgress, toggleFavorite, toggleResource, createStudyPlan, toggleStudyTask, removeStudyPlan, recordResourceOpen } = useCourseLibrary();
  const [planDays, setPlanDays] = useState(30);

  if (!course) {
    return <main className="mx-auto max-w-3xl px-6 py-12"><h1 className="text-2xl font-bold">{language === "zh" ? "未找到课程" : "Course not found"}</h1><Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="mt-6 inline-block underline">{language === "zh" ? "返回课程列表" : "Back to courses"}</Link></main>;
  }

  const stage = suggestedStudyStage(course);
  const completedResourceCount = course.resources.filter((resource) => library.completedResources.includes(courseResourceKey(course.id, resource.url))).length;
  const planDefinition = structuredCoursePlans[course.id];
  const savedPlan = library.studyPlans[course.id];
  const generatedPlan = savedPlan ? buildGentlePlan(course.id, savedPlan.days) : null;
  const totalPlanTasks = planDefinition?.tasks.length ?? 0;
  const nextTask = generatedPlan?.days.flatMap(({ tasks }) => tasks).find((task) => task.kind !== "buffer" && !savedPlan?.completedTaskIds.includes(task.id));
  const completedPlanTasks = savedPlan ? savedPlan.completedTaskIds.filter((id) => planDefinition?.tasks.some((task) => task.id === id)).length : 0;
  const value = (verified: boolean | null) => verified === null ? (language === "zh" ? "尚未核实" : "Not verified") : verified ? (language === "zh" ? "有" : "Available") : (language === "zh" ? "无" : "Not available");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="text-sm text-gray-500 hover:text-black">← {language === "zh" ? "全部课程" : "All courses"}</Link>
        <button onClick={() => router.replace(courseDetailPath(course, language === "zh" ? "en" : "zh"))} className="rounded-full border px-4 py-2 text-sm font-medium">{language === "zh" ? "English" : "中文"}</button>
      </header>

      <section className="mt-8 rounded-2xl border border-gray-200 p-7 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{course.university} · {courseCode(course)}</p>
        <h1 className="mt-2 text-3xl font-bold">{language === "zh" ? course.titleZh : course.title}</h1>
        <p className="mt-2 text-gray-500">{language === "zh" ? course.title : course.titleZh}</p>
        <p className="mt-6 text-lg leading-8 text-gray-700">{language === "zh" ? course.descriptionZh : course.description}</p>

        {loaded && <div className="mt-6 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-emerald-950">{language === "zh" ? "我的学习状态" : "My learning status"}</p><div className="mt-2 flex flex-wrap gap-2">{(["not-started", "in-progress", "completed"] as CourseProgress[]).map((status) => <button key={status} onClick={() => setProgress(course.id, status)} className={`rounded-full border px-3 py-1.5 text-sm ${library.progress[course.id] === status || (!library.progress[course.id] && status === "not-started") ? "border-emerald-800 bg-emerald-800 text-white" : "border-emerald-300 bg-white"}`}>{language === "zh" ? ({ "not-started": "未开始", "in-progress": "学习中", completed: "已完成" }[status]) : ({ "not-started": "Not started", "in-progress": "In progress", completed: "Completed" }[status])}</button>)}</div></div><button onClick={() => toggleFavorite(course.id)} className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-900">{library.favorites.includes(course.id) ? (language === "zh" ? "★ 已收藏" : "★ Saved") : (language === "zh" ? "☆ 收藏课程" : "☆ Save course")}</button></div>}

        <div className="mt-7 grid gap-3 rounded-xl bg-gray-50 p-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <p><b>{language === "zh" ? "学科" : "Subject"}：</b>{language === "zh" ? course.subjectZh : course.subject}</p>
          <p><b>{language === "zh" ? "课程难度" : "Level"}：</b>{course.level ? (language === "zh" ? levelZh[course.level] ?? course.level : course.level) : (language === "zh" ? "尚未核实" : "Not verified")}</p>
          <p><b>{language === "zh" ? "建议阶段" : "Suggested stage"}：</b>{stage ? (language === "zh" ? stageZh[stage] ?? stage : stage) : (language === "zh" ? "尚未核实" : "Not verified")} {stage && (language === "zh" ? "（推断）" : "(inferred)")}</p>
          <p><b>{language === "zh" ? "课程年份" : "Course year"}：</b>{course.year ?? (language === "zh" ? "尚未核实" : "Not verified")}</p>
          <p><b>{language === "zh" ? "视频" : "Videos"}：</b>{value(course.hasVideos)}</p>
          <p><b>{language === "zh" ? "作业 / 答案" : "Assignments / solutions"}：</b>{value(course.hasAssignments)} / {value(course.hasSolutions)}</p>
        </div>

        <section className="mt-8"><h2 className="text-xl font-semibold">{language === "zh" ? "先修要求" : "Prerequisites"}</h2>
          {course.prerequisites === null ? <p className="mt-3 text-gray-500">{language === "zh" ? "官方页面未明确列出，暂不猜测。" : "Not explicitly listed by the official source; no assumption made."}</p> : course.prerequisites.length === 0 ? <p className="mt-3 text-gray-500">{language === "zh" ? "无需先修课。" : "No prerequisites."}</p> : <div className="mt-3 flex flex-wrap gap-2">{course.prerequisites.map((item) => { const targetId = prerequisiteCourseIds[item]; const target = courses.find(({ id }) => id === targetId); return target ? <Link key={item} href={courseDetailPath(target, language)} className="rounded-full border px-3 py-2 text-sm hover:border-black">{item} →</Link> : <span key={item} className="rounded-full border px-3 py-2 text-sm">{item}</span>; })}</div>}
        </section>

        <section className="mt-8"><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-semibold">{language === "zh" ? "官方课程资料" : "Official course materials"}</h2><p className="mt-1 text-sm text-gray-500">{language === "zh" ? "打开资料时会自动记录为“学习中”，方便下次继续；完成仍由你确认。" : "Opening a resource automatically marks it in progress for easy continuation; you still confirm completion."}</p></div>{loaded && course.resources.length > 0 && <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">{language === "zh" ? `已完成 ${completedResourceCount}/${course.resources.length}` : `${completedResourceCount}/${course.resources.length} completed`}</span>}</div><div className="mt-4 grid gap-3 sm:grid-cols-2">{course.resources.map((resource) => { const resourceKey = courseResourceKey(course.id, resource.url); const completed = library.completedResources.includes(resourceKey); const titleZh = resourceZh[resource.type]; return <div key={resource.url} className={`rounded-xl border p-4 ${completed ? "border-emerald-300 bg-emerald-50" : "border-gray-200"}`}><a href={resource.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(course.id, resource.url, resource.title, titleZh)} className="block hover:underline"><span className="font-medium">{language === "zh" ? titleZh : resource.title}</span><span className="mt-1 block text-xs text-gray-500">{course.sourceName} ↗</span></a>{loaded && <label className="mt-3 flex cursor-pointer items-center gap-2 border-t border-black/10 pt-3 text-sm"><input type="checkbox" checked={completed} onChange={() => toggleResource(course.id, resource.url)} /><span>{completed ? (language === "zh" ? "已完成" : "Completed") : (language === "zh" ? "标记为已完成" : "Mark complete")}</span></label>}</div>; })}</div></section>

        {loaded && planDefinition && <section className="mt-8 rounded-2xl border border-violet-200 bg-violet-50/50 p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold text-violet-950">{language === "zh" ? "弹性学习计划" : "Flexible study plan"}</h2><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-800">{planDefinition.detail === "full" ? (language === "zh" ? "官方完整内容顺序" : "Full official sequence") : (language === "zh" ? "官方资料入口计划" : "Official-resource plan")}</span></div><p className="mt-2 text-sm text-violet-900">{language === "zh" ? (planDefinition.detail === "full" ? "计划按官方公布的讲次、作业与考试顺序生成。输入你希望完成课程的天数，系统会保守增加约 15% 缓冲，且不会把未完成任务叠加到下一天。" : "该课程官方未公开足够细的逐讲顺序，因此计划只使用已核实的官方资料入口，不会编造内容。输入目标天数后仍会加入约 15% 缓冲。") : (planDefinition.detail === "full" ? "The plan follows the published lecture, assignment, and exam order. OpenStudy adds about 15% buffer and never stacks unfinished work onto the next day." : "The official source does not publish enough session-level detail, so this plan uses verified official resource entries without inventing content. About 15% buffer is still added.")}</p>
          {!savedPlan ? <form onSubmit={(event) => { event.preventDefault(); if (planDays >= 1) createStudyPlan(course.id, planDays); }} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="text-sm font-medium text-violet-950">{language === "zh" ? "希望多少天完成？" : "How many days would you like?"}<input type="number" min={1} value={planDays} onChange={(event) => setPlanDays(Number(event.target.value))} className="mt-1 block w-full rounded-lg border border-violet-300 bg-white px-3 py-2 sm:w-36" /></label><button type="submit" disabled={planDays < 1} className="rounded-lg bg-violet-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40">{language === "zh" ? "生成保守计划" : "Create conservative plan"}</button></form> : generatedPlan && <div className="mt-5"><div className="rounded-xl border border-violet-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><span className="font-semibold text-violet-950">{language === "zh" ? `目标 ${savedPlan.days} 天 · 规划 ${generatedPlan.plannedDays} 天` : `${savedPlan.days}-day target · ${generatedPlan.plannedDays}-day plan`}</span><p className="mt-1 text-xs text-violet-700">{language === "zh" ? "已加入保守缓冲，不会压缩到目标天数以内。" : "Includes a conservative buffer and is never shorter than your target."}</p></div><div className="flex items-center gap-3"><span className="text-sm text-violet-800">{completedPlanTasks}/{totalPlanTasks}</span><button onClick={() => removeStudyPlan(course.id)} className="text-xs text-gray-500 hover:text-black hover:underline">{language === "zh" ? "删除并重新制定" : "Delete and recreate"}</button></div></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100"><div className="h-full bg-violet-700" style={{ width: `${Math.round(completedPlanTasks / totalPlanTasks * 100)}%` }} /></div></div>
            {nextTask ? <div className="mt-4 rounded-xl bg-violet-900 p-4 text-white"><p className="text-xs font-semibold uppercase tracking-wide text-violet-200">{language === "zh" ? "继续上次学习" : "Continue learning"}</p><a href={nextTask.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(course.id, nextTask.url, nextTask.title, nextTask.titleZh)} className="mt-2 block font-semibold hover:underline">{language === "zh" ? nextTask.titleZh : nextTask.title} ↗</a><button onClick={() => toggleStudyTask(course.id, nextTask.id)} className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-violet-950">{language === "zh" ? "完成这个任务" : "Complete this task"}</button></div> : <p className="mt-4 rounded-xl bg-emerald-100 p-4 font-semibold text-emerald-900">{language === "zh" ? "计划任务已全部完成。请根据实际学习情况确认是否完成整门课程。" : "All plan tasks are complete. Confirm the whole course separately when you are ready."}</p>}
            <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-violet-950">{language === "zh" ? "查看全部每日安排" : "View all daily tasks"}</summary><div className="mt-3 max-h-[36rem] space-y-2 overflow-y-auto pr-1">{generatedPlan.days.map((day, index) => { const realTasks = day.tasks.filter((task) => task.kind !== "buffer"); const completed = realTasks.length === 0 || realTasks.every((task) => savedPlan.completedTaskIds.includes(task.id)); return <div key={day.id} className={`rounded-lg border p-3 ${completed ? "border-emerald-200 bg-emerald-50" : "border-violet-100 bg-white"}`}><span className="text-xs font-semibold text-gray-500">{language === "zh" ? `第 ${index + 1} 天` : `Day ${index + 1}`}</span><div className="mt-2 space-y-2">{day.tasks.map((task) => task.kind === "buffer" ? <p key={task.id} className="text-sm text-gray-500">{language === "zh" ? task.titleZh : task.title}</p> : <label key={task.id} className="flex items-start gap-2 text-sm"><input aria-label={`${language === "zh" ? task.titleZh : task.title} completed`} type="checkbox" checked={savedPlan.completedTaskIds.includes(task.id)} onChange={() => toggleStudyTask(course.id, task.id)} /><a href={task.url} target="_blank" rel="noreferrer" className="hover:underline">{language === "zh" ? task.titleZh : task.title} ↗</a></label>)}</div></div>; })}</div></details>
          </div>}
        </section>}

        <section className="mt-8 border-t pt-6"><h2 className="font-semibold">{language === "zh" ? "来源与核实" : "Source and verification"}</h2><p className="mt-2 text-sm text-gray-600">{language === "zh" ? "所有链接均指向大学或课程团队的官方页面。未知信息保留为“尚未核实”，不会推测。" : "Every link points to an official university or course-team page. Unknown facts remain unverified rather than guessed."}</p><p className="mt-2 text-sm text-gray-500">{course.sourceName} · {language === "zh" ? "核实日期" : "verified"} {course.verifiedOn}</p><a href={course.courseUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg bg-black px-5 py-3 font-medium text-white">{language === "zh" ? "进入官方课程网站 ↗" : "Open official course ↗"}</a></section>
      </section>
    </main>
  );
}
