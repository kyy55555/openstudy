"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { courseCode, courses } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { buildGentlePlan } from "../../data/coursePlans";
import {
  completionStreak,
  createCourseLibraryBackup,
  learningPathCoverage,
  localDateKey,
  parseCourseLibraryBackup,
  phaseCoverage,
  studyPlanProgress,
  weeklyStudyActivity,
} from "../../data/courseLibrary";
import type { CourseLibraryBackup } from "../../data/courseLibrary";
import { learningPaths } from "../../data/learningPaths";
import { useCourseLibrary } from "../useCourseLibrary";

type Language = "en" | "zh";

function CourseList({ ids, language, empty }: { ids: string[]; language: Language; empty: string }) {
  const items = ids
    .map((id) => courses.find((course) => course.id === id))
    .filter((course) => course !== undefined);
  if (!items.length) return <p className="mt-3 text-sm text-gray-500">{empty}</p>;
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((course) => (
        <Link key={course.id} href={courseDetailPath(course, language)} className="rounded-xl border border-gray-200 p-3 transition hover:border-black hover:shadow-sm">
          <span className="text-sm font-semibold">{courseCode(course)} · {language === "zh" ? (course.titleZh ?? course.title) : course.title}</span>
          <span className="mt-1 block text-xs text-gray-500">{course.university}</span>
        </Link>
      ))}
    </div>
  );
}

function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3 text-xs text-gray-600"><span>{label}</span><span>{percent}%</span></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full rounded-full bg-violet-700 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function DashboardContent() {
  const params = useSearchParams();
  const language: Language = params.get("lang") === "zh" ? "zh" : "en";
  const { library, loaded, syncIssue, syncConflict, lastSyncedAt, retryCloudSync, resolveCloudConflict, completeDailyTask, togglePlanPaused, recordResourceOpen, clearLastOpenedResource, replaceLibrary } = useCourseLibrary();
  const [pendingBackup, setPendingBackup] = useState<CourseLibraryBackup | null>(null);
  const [backupMessage, setBackupMessage] = useState("");
  const [todayKey] = useState(() => localDateKey());
  const [achievement, setAchievement] = useState("");

  const inProgress = courses.filter((course) => library.progress[course.id] === "in-progress").map((course) => course.id);
  const completed = courses.filter((course) => library.progress[course.id] === "completed").map((course) => course.id);
  const activePlans = Object.entries(library.studyPlans).flatMap(([courseId, saved]) => {
    const course = courses.find((item) => item.id === courseId);
    const generated = buildGentlePlan(courseId, saved.days);
    if (!course || !generated) return [];
    const tasks = generated.days.flatMap(({ tasks }) => tasks).filter((task) => task.kind !== "buffer");
    const nextTask = tasks.find((task) => !saved.completedTaskIds.includes(task.id));
    const progress = studyPlanProgress(tasks.map(({ id }) => id), saved.completedTaskIds);
    return [{ course, saved, generated, nextTask, progress }];
  });
  const coverage = learningPaths
    .map((path) => ({ path, ...learningPathCoverage(path.phases, library.progress) }))
    .filter(({ completed: count }) => count > 0)
    .sort((a, b) => b.completed - a.completed || b.percent - a.percent);
  const completedToday = Boolean(todayKey && activePlans.some(({ saved }) => saved.lastDailyCompletionDate === todayKey));
  const streak = completionStreak(activePlans.flatMap(({ saved }) => saved.dailyCompletionDates ?? []));
  const weeklyActivity = weeklyStudyActivity(activePlans.flatMap(({ saved }) => saved.dailyCompletionDates ?? []));
  const weeklyCompleted = weeklyActivity.filter(({ completed: dayCompleted }) => dayCompleted).length;
  const activityDates = [...new Set(activePlans.flatMap(({ saved }) => saved.dailyCompletionDates ?? []))].sort().reverse();
  const completedPlanTaskCount = activePlans.reduce((total, { saved }) => total + saved.completedTaskIds.length, 0);
  const runningPlans = activePlans.filter(({ saved }) => !saved.paused);
  const todayPlan = completedToday ? null : runningPlans.find(({ nextTask }) => nextTask);
  const todayTask = todayPlan?.nextTask ?? null;

  const copy = language === "zh" ? {
    back: "← OpenStudy", title: "用户中心", subtitle: "从上次的位置继续；每天只推荐一个容易完成的任务。大学培养方案仅作为参考。",
    today: "今日建议", todayDone: "今天的任务已完成", todayDoneHelp: "做得很好。今天不再增加新任务，明天再继续。", noToday: "还没有今日任务。请先在课程详情页创建一个学习计划。", completeToday: "完成今日任务", achievement: "完成啦！今天的学习任务已经记下。",
    createPlan: "为正在学习的课程制定计划", browsePlans: "选择课程并制定计划",
    recent: "继续上次学习", noRecent: "打开课程资料后，这里会保留你的上次学习位置。", clear: "清除记录",
    overview: "学习概览", courses: "完成课程", resources: "完成资料", plans: "进行中计划", streak: "连续完成天数", week: "最近 7 天", weekUnit: "天完成任务", gentleWin: "稳步前进", gentleWinHelp: "完成一次也算进步。这里记录真实完成，不要求每天打卡。", achievements: "学习成就", achievementHelp: "只根据你主动确认的完成记录点亮。", firstStep: "完成第一个计划任务", threeDays: "累计学习 3 天", sevenDays: "累计学习 7 天", firstCourse: "完成第一门课程", history: "学习历史", noHistory: "完成计划任务后，会在这里记录学习日期。", completedTask: "完成了当天的计划任务",
    plansTitle: "课程计划", noPlan: "还没有课程计划。你可以在课程详情页输入目标天数。", target: "目标天数", planned: "保守规划", progress: "计划完成度", finishedPlan: "计划任务已全部完成，请自行确认整门课程状态。", paused: "已暂停，不会安排今日任务。", pause: "暂停", resume: "继续",
    current: "正在学习", noCurrent: "还没有标记为学习中的课程。", done: "已完成课程", noDone: "完成课程后会显示在这里。", saved: "收藏课程", noSaved: "还没有收藏课程。",
    coverage: "培养方案学期点亮", noCoverage: "完成或开始路线中的课程后，这里会自然显示匹配的参考培养方案，无需选择路线。", reference: "查看完整参考方案", termDone: "已点亮", termPartial: "进行中", termEmpty: "未开始",
    backup: "备份与恢复学习记录", backupHelp: "下载一份不含邮箱和密码的 JSON 文件。恢复备份会覆盖当前游客或当前账号的学习记录，不会自动合并。", download: "下载备份", chooseBackup: "选择备份文件", invalidBackup: "无法读取：请选择 OpenStudy 导出的有效 JSON 备份（最大 2 MB）。", restore: "确认覆盖并恢复", cancel: "取消", restored: "学习记录已从备份恢复。", backupFrom: "备份时间",
  } : {
    back: "← OpenStudy", title: "User center", subtitle: "Continue where you left off; OpenStudy suggests only one achievable task each day. University curricula remain references.",
    today: "Today's suggestion", todayDone: "Today's task is complete", todayDoneHelp: "Nice work. No extra task will be added today—continue tomorrow.", noToday: "No task for today yet. Create a study plan from a course page first.", completeToday: "Complete today's task", achievement: "Done! Today's learning task has been recorded.",
    createPlan: "Plan an in-progress course", browsePlans: "Choose a course and create a plan",
    recent: "Continue where you left off", noRecent: "Open an official course resource and your latest position will stay here.", clear: "Clear",
    overview: "Learning overview", courses: "Courses completed", resources: "Resources completed", plans: "Active plans", streak: "Completion streak", week: "Last 7 days", weekUnit: "days with a completed task", gentleWin: "Steady progress", gentleWinHelp: "One completion still counts. This records real progress without demanding a daily streak.", achievements: "Learning achievements", achievementHelp: "Unlocked only from progress you explicitly confirm.", firstStep: "Complete your first plan task", threeDays: "Learn on 3 days", sevenDays: "Learn on 7 days", firstCourse: "Complete your first course", history: "Learning history", noHistory: "Completed plan tasks will add their learning dates here.", completedTask: "Completed the day's plan task",
    plansTitle: "Course plans", noPlan: "No course plan yet. Set a target number of days on a course page.", target: "Target days", planned: "Conservative plan", progress: "Plan progress", finishedPlan: "All plan tasks are complete. Confirm the whole course separately.", paused: "Paused; no daily task will be suggested.", pause: "Pause", resume: "Resume",
    current: "In progress", noCurrent: "No courses are marked in progress.", done: "Completed courses", noDone: "Completed courses appear here.", saved: "Saved courses", noSaved: "No saved courses yet.",
    coverage: "Curriculum term progress", noCoverage: "Start or complete curriculum courses to see naturally matching references—no path selection required.", reference: "View full curriculum reference", termDone: "Lit", termPartial: "In progress", termEmpty: "Not started",
    backup: "Back up and restore learning record", backupHelp: "Download a JSON file without your email or password. Restoring replaces the current guest or account record; it never merges automatically.", download: "Download backup", chooseBackup: "Choose backup file", invalidBackup: "Could not read this file. Choose a valid OpenStudy JSON backup up to 2 MB.", restore: "Replace and restore", cancel: "Cancel", restored: "Learning record restored from backup.", backupFrom: "Backup created",
  };

  function downloadBackup() {
    const payload = createCourseLibraryBackup(library);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `openstudy-learning-record-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function chooseBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    setPendingBackup(null);
    setBackupMessage("");
    if (!file || file.size > 2 * 1024 * 1024) {
      setBackupMessage(copy.invalidBackup);
      input.value = "";
      return;
    }
    const parsed = parseCourseLibraryBackup(await file.text());
    if (!parsed) setBackupMessage(copy.invalidBackup);
    else setPendingBackup(parsed);
    input.value = "";
  }

  function restoreBackup() {
    if (!pendingBackup) return;
    replaceLibrary(pendingBackup.library);
    setPendingBackup(null);
    setBackupMessage(copy.restored);
  }

  if (!loaded) return <main className="mx-auto max-w-6xl px-6 py-12"><p>{language === "zh" ? "正在读取学习记录…" : "Loading learning record…"}</p></main>;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
      <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500 hover:text-black">{copy.back}</Link>
      <h1 className="mt-4 text-3xl font-bold">{copy.title}</h1>
      <p className="mt-2 max-w-3xl text-gray-600">{copy.subtitle}</p>
      {syncConflict && <div role="alert" className="mt-5 rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-950"><p className="font-semibold">{language === "zh" ? "发现另一台设备更新了学习记录" : "Another device updated your learning record"}</p><p className="mt-1">{language === "zh" ? "为避免覆盖，云同步已经暂停。请选择保留当前设备的记录，或改用最新云端记录；系统不会自动合并。" : "Cloud sync is paused to prevent an overwrite. Keep this device's record or use the latest cloud record; OpenStudy will not merge them automatically."}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => resolveCloudConflict("local")} className="rounded-lg bg-orange-900 px-3 py-2 font-semibold text-white">{language === "zh" ? "保留本机并上传" : "Keep this device"}</button><button type="button" onClick={() => resolveCloudConflict("cloud")} className="rounded-lg border border-orange-400 bg-white px-3 py-2 font-semibold">{language === "zh" ? "使用云端记录" : "Use cloud record"}</button></div></div>}
      {!syncIssue && !syncConflict && lastSyncedAt && <p className="mt-2 text-xs text-emerald-700">✓ {language === "zh" ? "云端已同步" : "Cloud synced"} · {new Date(lastSyncedAt).toLocaleString(language === "zh" ? "zh-CN" : "en-US")}</p>}
      {syncIssue && <div role="status" className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"><p>{language === "zh" ? "云端同步暂时失败。当前更改已保存在此设备；网络恢复时会自动重试。" : "Cloud sync is temporarily unavailable. Changes are saved on this device and will retry automatically when the network returns."}</p><button type="button" onClick={retryCloudSync} className="shrink-0 rounded-lg border border-amber-500 px-3 py-2 font-semibold hover:bg-amber-100">{language === "zh" ? "立即重试" : "Retry now"}</button></div>}

      <section className="mt-8 rounded-3xl bg-gradient-to-br from-violet-950 to-indigo-800 p-5 text-white shadow-lg sm:p-7">
        <p className="text-sm font-semibold text-violet-200">{copy.today}</p>
        {completedToday || achievement ? (
          <div className="mt-3"><h2 className="text-2xl font-bold">✓ {copy.todayDone}</h2><p className="mt-2 text-sm text-violet-100">{achievement || copy.todayDoneHelp}</p></div>
        ) : todayPlan && todayTask ? (
          <div className="mt-3">
            <Link href={courseDetailPath(todayPlan.course, language)} className="text-sm text-violet-200 hover:underline">{courseCode(todayPlan.course)} · {language === "zh" ? (todayPlan.course.titleZh ?? todayPlan.course.title) : todayPlan.course.title}</Link>
            <h2 className="mt-2 text-2xl font-bold">{language === "zh" ? todayTask.titleZh : todayTask.title}</h2>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a href={todayTask.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(todayPlan.course.id, todayTask.url, todayTask.title, todayTask.titleZh)} className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-violet-950">{copy.recent} ↗</a>
              <button type="button" onClick={() => { completeDailyTask(todayPlan.course.id, todayTask.id, todayKey); setAchievement(copy.achievement); }} className="rounded-xl border border-violet-300 px-4 py-3 text-sm font-semibold hover:bg-white/10">{copy.completeToday}</button>
            </div>
          </div>
        ) : <div className="mt-3"><p className="text-sm text-violet-100">{copy.noToday}</p><Link href={inProgress[0] ? courseDetailPath(courses.find(({ id }) => id === inProgress[0])!, language) : language === "zh" ? "/courses?lang=zh" : "/courses"} className="mt-4 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-950">{inProgress[0] ? copy.createPlan : copy.browsePlans} →</Link></div>}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{copy.overview}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[[copy.courses, completed.length], [copy.resources, library.completedResources.length], [copy.plans, runningPlans.length], [copy.streak, streak]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-gray-200 p-3 sm:p-5"><strong className="text-2xl sm:text-3xl">{value}</strong><span className="mt-1 block text-xs text-gray-500 sm:text-sm">{label}</span></div>)}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-emerald-800">{copy.week}</p><h2 className="mt-1 text-2xl font-bold text-emerald-950">{weeklyCompleted} {copy.weekUnit}</h2><p className="mt-2 text-sm text-emerald-900">{copy.gentleWinHelp}</p></div>{weeklyCompleted > 0 && <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900">✓ {copy.gentleWin}</span>}</div>
        <div className="mt-5 grid grid-cols-7 gap-2">{weeklyActivity.map(({ dateKey, completed: dayCompleted }) => <div key={dateKey} className="text-center"><div title={dateKey} aria-label={`${dateKey}: ${dayCompleted ? copy.completeToday : copy.noToday}`} className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${dayCompleted ? "bg-emerald-700 text-white" : "border border-emerald-200 bg-white text-gray-400"}`}>{dayCompleted ? "✓" : "·"}</div><span className="mt-1 block text-[10px] text-emerald-900">{new Date(`${dateKey}T00:00:00`).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", { weekday: "short" })}</span></div>)}</div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6"><h2 className="text-xl font-semibold text-amber-950">{copy.achievements}</h2><p className="mt-1 text-sm text-amber-900">{copy.achievementHelp}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[
          { label: copy.firstStep, unlocked: completedPlanTaskCount >= 1 },
          { label: copy.threeDays, unlocked: activityDates.length >= 3 },
          { label: copy.sevenDays, unlocked: activityDates.length >= 7 },
          { label: copy.firstCourse, unlocked: completed.length >= 1 },
        ].map(({ label, unlocked }) => <div key={label} className={`rounded-xl border p-3 text-sm font-semibold ${unlocked ? "border-amber-300 bg-white text-amber-950" : "border-gray-200 bg-gray-50 text-gray-400"}`}><span aria-hidden="true">{unlocked ? "✓" : "○"}</span> {label}</div>)}</div></div>
        <div className="rounded-2xl border border-gray-200 p-5 sm:p-6"><h2 className="text-xl font-semibold">{copy.history}</h2>{activityDates.length === 0 ? <p className="mt-3 text-sm text-gray-500">{copy.noHistory}</p> : <ol className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">{activityDates.slice(0, 30).map((dateKey) => <li key={dateKey} className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3 text-sm"><span>{copy.completedTask}</span><time dateTime={dateKey} className="shrink-0 text-gray-500">{new Date(`${dateKey}T00:00:00`).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</time></li>)}</ol>}</div>
      </section>

      <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold text-blue-950">{copy.recent}</h2>{library.lastOpenedResource && <button onClick={clearLastOpenedResource} className="text-xs text-blue-800 hover:underline">{copy.clear}</button>}</div>
        {library.lastOpenedResource && (() => {
          const recent = library.lastOpenedResource;
          const course = courses.find((item) => item.id === recent.courseId);
          if (!course) return <p className="mt-3 text-sm text-blue-900">{copy.noRecent}</p>;
          return <div className="mt-3"><Link href={courseDetailPath(course, language)} className="font-semibold text-blue-950 hover:underline">{courseCode(course)} · {language === "zh" ? (course.titleZh ?? course.title) : course.title}</Link><a href={recent.url} target="_blank" rel="noreferrer" onClick={() => recordResourceOpen(recent.courseId, recent.url, recent.title, recent.titleZh)} className="mt-2 block text-sm text-blue-900 hover:underline">{language === "zh" ? recent.titleZh : recent.title} · {new Date(recent.openedAt).toLocaleString(language === "zh" ? "zh-CN" : "en-US")} ↗</a></div>;
        })() || <p className="mt-3 text-sm text-blue-900">{copy.noRecent}</p>}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{copy.plansTitle}</h2>
        {activePlans.length === 0 ? <div className="mt-3"><p className="text-sm text-gray-500">{copy.noPlan}</p><Link href={inProgress[0] ? courseDetailPath(courses.find(({ id }) => id === inProgress[0])!, language) : language === "zh" ? "/courses?lang=zh" : "/courses"} className="mt-3 inline-flex rounded-lg border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-900 hover:bg-violet-50">{inProgress[0] ? copy.createPlan : copy.browsePlans} →</Link></div> : <div className="mt-3 grid gap-4 lg:grid-cols-2">{activePlans.map(({ course, saved, generated, nextTask, progress }) => (
          <article key={course.id} className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <Link href={courseDetailPath(course, language)} className="font-semibold text-violet-950 hover:underline">{courseCode(course)} · {language === "zh" ? (course.titleZh ?? course.title) : course.title}</Link>
            <div className="mt-1 flex items-center justify-between gap-3"><p className="text-xs text-violet-800">{copy.target} {saved.days} · {copy.planned} {generated.plannedDays}</p><button type="button" onClick={() => togglePlanPaused(course.id)} className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-xs font-semibold text-violet-900 hover:bg-violet-100">{saved.paused ? copy.resume : copy.pause}</button></div>
            <ProgressBar percent={progress.percent} label={`${copy.progress} · ${progress.completed}/${progress.total}`} />
            {saved.paused ? <p className="mt-3 text-sm font-medium text-gray-600">⏸ {copy.paused}</p> : nextTask ? <p className="mt-3 text-sm text-violet-900">{language === "zh" ? nextTask.titleZh : nextTask.title}</p> : <p className="mt-3 text-sm font-medium text-emerald-800">✓ {copy.finishedPlan}</p>}
          </article>
        ))}</div>}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.current}</h2><CourseList ids={inProgress} language={language} empty={copy.noCurrent} /></section>
        <section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.done}</h2><CourseList ids={completed} language={language} empty={copy.noDone} /></section>
        <section className="rounded-2xl border border-gray-200 p-5"><h2 className="text-xl font-semibold">{copy.saved}</h2><CourseList ids={library.favorites} language={language} empty={copy.noSaved} /></section>
      </div>

      <section className="mt-8 rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-xl font-semibold">{copy.coverage}</h2>
        {coverage.length === 0 ? <p className="mt-3 text-sm text-gray-500">{copy.noCoverage}</p> : <div className="mt-4 space-y-5">{coverage.slice(0, 3).map(({ path, completed: count, total, percent }) => (
          <article key={path.id}>
            <div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-semibold">{path.university}</h3><p className="text-xs text-gray-500">{language === "zh" ? path.programZh : path.program}</p></div><span className="text-sm font-semibold">{percent}% · {count}/{total}</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{path.phases.map((phase) => { const result = phaseCoverage(phase, library.progress); const stateLabel = result.status === "completed" ? copy.termDone : result.status === "partial" ? copy.termPartial : copy.termEmpty; return <div key={phase.title} className={`rounded-xl border p-3 ${result.status === "completed" ? "border-emerald-400 bg-emerald-100" : result.status === "partial" ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}><p className="text-xs font-semibold">{language === "zh" ? phase.titleZh : phase.title}</p><p className="mt-1 text-xs text-gray-600">{stateLabel} · {result.completed}/{result.required}</p></div>; })}</div>
            <Link href={`${language === "zh" ? "/paths?lang=zh&" : "/paths?"}path=${path.id}`} className="mt-3 inline-block text-xs font-medium text-emerald-800 hover:underline">{copy.reference} →</Link>
          </article>
        ))}</div>}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 p-5">
        <h2 className="text-xl font-semibold">{copy.backup}</h2><p className="mt-2 text-sm text-gray-600">{copy.backupHelp}</p>
        <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={downloadBackup} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-black">{copy.download}</button><label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-black">{copy.chooseBackup}<input type="file" accept="application/json,.json" onChange={chooseBackup} className="sr-only" /></label></div>
        {pendingBackup && <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-950">{copy.backupFrom}：{new Date(pendingBackup.exportedAt).toLocaleString(language === "zh" ? "zh-CN" : "en-US")}</p><p className="mt-1 text-xs text-amber-900">{copy.courses}：{Object.values(pendingBackup.library.progress).filter((status) => status === "completed").length} · {copy.resources}：{pendingBackup.library.completedResources.length} · {copy.plans}：{Object.keys(pendingBackup.library.studyPlans).length}</p><div className="mt-3 flex gap-2"><button type="button" onClick={restoreBackup} className="rounded-lg bg-amber-950 px-3 py-2 text-sm font-medium text-white">{copy.restore}</button><button type="button" onClick={() => setPendingBackup(null)} className="rounded-lg border border-amber-400 px-3 py-2 text-sm font-medium text-amber-950">{copy.cancel}</button></div></div>}
        {backupMessage && <p role="status" className="mt-3 text-sm text-gray-700">{backupMessage}</p>}
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
