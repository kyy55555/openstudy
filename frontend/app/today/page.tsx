"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { courseCode, courses } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { buildGentlePlan, completedPlanTaskId } from "../../data/coursePlans";
import { gentleComebackPlanDays, localDateKey, studyGapDays } from "../../data/courseLibrary";
import { useCourseLibrary } from "../useCourseLibrary";

type Language = "en" | "zh";

function TodayContent() {
  const language: Language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const { library, loaded, syncIssue, syncConflict, completeDailyTask, recordResourceOpen, updateStudyPlanDays } = useCourseLibrary();
  const [todayKey] = useState(() => localDateKey());
  const [completionMessage, setCompletionMessage] = useState("");
  const [planLightened, setPlanLightened] = useState(false);

  const plans = Object.entries(library.studyPlans).flatMap(([courseId, saved]) => {
    const course = courses.find((item) => item.id === courseId);
    const generated = buildGentlePlan(courseId, saved.days);
    if (!course || !generated || saved.paused) return [];
    const tasks = generated.days.flatMap(({ tasks }) => tasks).filter((task) => task.kind !== "buffer");
    const completed = tasks.filter((task) => completedPlanTaskId(task, saved.completedTaskIds)).length;
    const nextTask = tasks.find((task) => !completedPlanTaskId(task, saved.completedTaskIds));
    return [{ course, saved, tasks, nextTask, completed, total: tasks.length }];
  });
  const completedToday = plans.some(({ saved }) => saved.lastDailyCompletionDate === todayKey);
  const todayPlan = completedToday ? null : plans.find(({ nextTask }) => nextTask);
  const todayTask = todayPlan?.nextTask ?? null;
  const gapDays = todayPlan ? studyGapDays(todayPlan.saved.lastDailyCompletionDate, new Date(`${todayKey}T00:00:00`)) : null;
  const comebackDays = todayPlan && gapDays !== null ? gentleComebackPlanDays(todayPlan.saved.days, gapDays) : null;
  const taskNumber = todayPlan && todayTask ? todayPlan.tasks.findIndex(({ id }) => id === todayTask.id) + 1 : 0;
  const percent = todayPlan?.total ? Math.round(todayPlan.completed / todayPlan.total * 100) : 0;
  const date = new Date(`${todayKey}T00:00:00`).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", { month: "long", day: "numeric", weekday: "long" });
  const copy = language === "zh" ? {
    back: "← OpenStudy", center: "用户中心", title: "今日学习", subtitle: "今天只完成这一小步。完成后不再追加任务。", task: "今日任务", done: "今天的学习完成了", doneHelp: "进度已经保存。明天会从下一项继续。", empty: "还没有今日任务。先选择一门课程并制定学习计划。", browse: "浏览课程", manage: "管理课程计划", open: "打开官方内容", complete: "完成今天的任务", saved: "完成啦！今天的学习进度已经保存。", progress: "课程计划进度", next: (current: number, total: number) => `接下来是第 ${current} 项，共 ${total} 项`, sync: "云同步暂时不可用，完成记录会先保存在此设备。", conflict: "发现其他设备的更新，请先到用户中心选择保留哪份记录。", welcomeBack: (days: number) => `欢迎回来。你有 ${days} 天没有学习，但之前的进度全部保留。今天仍然只做一个小任务。`, lighten: (days: number) => `把计划放轻到 ${days} 天`, lightened: "计划已放轻，不需要追赶之前错过的天数。",
  } : {
    back: "← OpenStudy", center: "User center", title: "Today’s study", subtitle: "Take one small step today. No extra task is added after you finish.", task: "Today’s task", done: "Today’s study is complete", doneHelp: "Your progress is saved. Continue with the next item tomorrow.", empty: "No task for today yet. Choose a course and create a study plan first.", browse: "Browse courses", manage: "Manage course plans", open: "Open official content", complete: "Complete today’s task", saved: "Done! Today’s progress has been saved.", progress: "Course plan progress", next: (current: number, total: number) => `Next is task ${current} of ${total}`, sync: "Cloud sync is temporarily unavailable. Completion will be saved on this device first.", conflict: "Another device updated your record. Choose which copy to keep in the user center first.", welcomeBack: (days: number) => `Welcome back. You were away for ${days} days, but all previous progress is still here. Today is still only one small task.`, lighten: (days: number) => `Lighten plan to ${days} days`, lightened: "Your plan is lighter now. There is no missed work to catch up on.",
  };
  const kind = todayTask ? ({ session: language === "zh" ? "讲义 / 视频" : "Lecture / video", assignment: language === "zh" ? "作业" : "Assignment", exam: language === "zh" ? "考试" : "Exam", project: language === "zh" ? "项目" : "Project", buffer: language === "zh" ? "复习" : "Review" }[todayTask.kind]) : "";

  if (!loaded) return <main className="mx-auto max-w-5xl px-5 py-10"><p>{language === "zh" ? "正在读取今日任务…" : "Loading today’s task…"}</p></main>;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between gap-4"><Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500 hover:text-black">{copy.back}</Link><Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:border-gray-400">{copy.center}</Link></div>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">{date}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{copy.title}</h1>
      <p className="mt-3 text-gray-600">{copy.subtitle}</p>
      {syncIssue && !syncConflict && <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{copy.sync}</p>}
      {syncConflict && <p role="alert" className="mt-5 rounded-xl border border-orange-300 bg-orange-50 p-3 text-sm text-orange-950">{copy.conflict} <Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className="font-semibold underline">{copy.center} →</Link></p>}
      {todayPlan && gapDays !== null && gapDays >= 3 && <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-950 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{copy.welcomeBack(gapDays)}</p>{planLightened && <p className="mt-1 text-sm text-sky-800">{copy.lightened}</p>}</div>{comebackDays && comebackDays > todayPlan.saved.days && <button type="button" onClick={() => { updateStudyPlanDays(todayPlan.course.id, comebackDays); setPlanLightened(true); }} className="shrink-0 rounded-xl bg-sky-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">{copy.lighten(comebackDays)}</button>}</section>}

      <section id="today-task" className="mt-8 scroll-mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-700 p-6 text-white shadow-xl shadow-violet-950/15 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-violet-200">{copy.task}</p>{todayTask && <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">{kind}</span>}</div>
        {completedToday || completionMessage ? <div className="mt-6 py-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-2xl font-bold text-emerald-950">✓</div><h2 className="mt-4 text-2xl font-bold sm:text-3xl">{copy.done}</h2><p className="mt-2 text-violet-100">{completionMessage || copy.doneHelp}</p></div> : todayPlan && todayTask ? <div className="mt-6"><Link href={courseDetailPath(todayPlan.course, language)} className="text-sm font-medium text-violet-200 hover:text-white hover:underline">{courseCode(todayPlan.course)} · {language === "zh" ? (todayPlan.course.titleZh ?? todayPlan.course.title) : todayPlan.course.title}</Link><h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">{language === "zh" ? todayTask.titleZh : todayTask.title}</h2><div className="mt-6 max-w-2xl"><div className="flex justify-between text-xs text-violet-200"><span>{copy.progress}</span><span>{todayPlan.completed}/{todayPlan.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-xs text-violet-200">{copy.next(taskNumber, todayPlan.total)}</p></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href={todayTask.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(todayPlan.course.id, todayTask.url, todayTask.title, todayTask.titleZh)} className="today-primary-action rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-violet-950 hover:bg-violet-50">{copy.open} ↗</a><button type="button" disabled={syncConflict} onClick={() => { completeDailyTask(todayPlan.course.id, todayTask.id, todayKey); setCompletionMessage(copy.saved); }} className="rounded-xl border border-violet-300 px-5 py-3 text-sm font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">{copy.complete}</button></div></div> : <div className="mt-6 py-3"><p className="text-violet-100">{copy.empty}</p><div className="mt-5 flex flex-wrap gap-3"><Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="today-primary-action rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-950">{copy.browse} →</Link><Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className="rounded-xl border border-violet-300 px-5 py-3 text-sm font-semibold">{copy.manage}</Link></div></div>}
      </section>
    </main>
  );
}

export default function TodayPage() {
  return <Suspense><TodayContent /></Suspense>;
}
