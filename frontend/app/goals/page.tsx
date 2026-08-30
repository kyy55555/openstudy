"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { courseGoalOptions, courseGoalSequence } from "../../data/courseGuidance";
import { courseCode, courses, suggestedStudyStage } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import { trackProductEvent } from "../../lib/productAnalytics";

type Language = "en" | "zh";

const copy = {
  en: {
    back: "← Explore courses", eyebrow: "Goal-based learning guide", title: "What do you want to learn?",
    intro: "Describe a field, and OpenStudy will reduce the decisions by arranging verified university courses from foundations to advanced study.",
    placeholder: "e.g. Distributed Systems or Machine Learning", submit: "Build my starting path", choices: "Popular starting goals",
    result: (topic: string) => `A practical way to start ${topic}`,
    resultIntro: "Start at the first course that fits your background. You do not need to complete every course or choose one university's full curriculum.",
    noResult: "This goal does not have a verified sequence yet. Send the request and it will guide what OpenStudy researches next.",
    request: "Request this learning goal",
    disclaimer: "This is an OpenStudy prerequisite-based self-study suggestion, not an official university degree requirement or guarantee of credit equivalence.",
    foundation: "Foundation", advanced: "Advanced option", step: (index: number) => `Step ${index + 1}`, stage: "Suggested stage", switchLanguage: "中文",
  },
  zh: {
    back: "← 浏览课程", eyebrow: "按学习目标规划", title: "你想学什么？",
    intro: "输入一个领域，OpenStudy 会按照先修关系把已核实的大学公开课从基础到进阶排好，减少你自己选课和排序的负担。",
    placeholder: "例如：分布式系统、机器学习", submit: "生成起步路线", choices: "常见学习目标",
    result: (topic: string) => `${topic}：从这里开始`,
    resultIntro: "从符合你当前基础的第一门课开始即可；不需要修完全部课程，也不需要选择某一所大学的完整培养方案。",
    noResult: "这个目标暂时没有已核实的课程顺序。提交需求后，它会决定 OpenStudy 下一批核实的内容。",
    request: "提交这个学习目标",
    disclaimer: "这是 OpenStudy 根据先修关系整理的个人自学建议，不是大学官方培养要求，也不代表可以获得或替代学分。",
    foundation: "基础", advanced: "进阶选修", step: (index: number) => `第 ${index + 1} 步`, stage: "建议阶段", switchLanguage: "English",
  },
} as const;

function goalsPath(language: Language, goal: string) {
  const params = new URLSearchParams();
  if (language === "zh") params.set("lang", "zh");
  if (goal) params.set("goal", goal);
  const query = params.toString();
  return query ? `/goals?${query}` : "/goals";
}

const stageZh: Record<string, string> = {
  "Year 1": "本科一年级",
  "Year 2": "本科二年级",
  "Years 2–3": "本科二至三年级",
  "Years 3–4": "本科三至四年级",
  Graduate: "研究生",
};

function stageLabel(course: (typeof courses)[number], language: Language) {
  const stage = suggestedStudyStage(course);
  if (!stage) return language === "zh" ? "尚未核实" : "Not verified";
  return language === "zh" ? stageZh[stage] : stage;
}

function GoalPlanner() {
  const params = useSearchParams();
  const router = useRouter();
  const language: Language = params.get("lang") === "zh" ? "zh" : "en";
  const initialGoal = params.get("goal")?.trim() ?? "";
  const [input, setInput] = useState(initialGoal);
  const [goal, setGoal] = useState(initialGoal);
  const labels = copy[language];
  const sequence = useMemo(() => courseGoalSequence(courses, goal), [goal]);

  function chooseGoal(nextGoal: string) {
    const trimmed = nextGoal.trim();
    setInput(trimmed);
    setGoal(trimmed);
    router.replace(goalsPath(language, trimmed), { scroll: false });
    if (trimmed) {
      trackProductEvent({ eventName: "goal_route_requested", searchQuery: trimmed, numericValue: courseGoalSequence(courses, trimmed)?.courses.length ?? 0, language });
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 p-6 text-white shadow-xl sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="text-sm text-violet-100 hover:text-white">{labels.back}</Link>
          <button type="button" onClick={() => router.replace(goalsPath(language === "zh" ? "en" : "zh", goal))} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">{labels.switchLanguage}</button>
        </div>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-violet-200">{labels.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{labels.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">{labels.intro}</p>
        <form onSubmit={(event) => { event.preventDefault(); chooseGoal(input); }} className="mt-8 flex flex-col gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur sm:flex-row">
          <label htmlFor="learning-goal" className="sr-only">{labels.title}</label>
          <input id="learning-goal" type="search" value={input} onChange={(event) => setInput(event.target.value)} placeholder={labels.placeholder} className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-5 py-4 text-slate-950 outline-none focus:ring-2 focus:ring-violet-300" />
          <button type="submit" className="rounded-xl bg-violet-500 px-6 py-4 font-bold text-white hover:bg-violet-400">{labels.submit}</button>
        </form>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{labels.choices}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {courseGoalOptions.map((option) => {
            const title = language === "zh" ? option.topicZh : option.topic;
            return <button key={option.topic} type="button" onClick={() => chooseGoal(title)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${sequence?.topic === option.topic ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-violet-400 hover:text-violet-700"}`}>{title}</button>;
          })}
        </div>
      </section>

      {sequence && (
        <section className="mt-8 overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{labels.result(language === "zh" ? sequence.topicZh : sequence.topic)}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{labels.resultIntro}</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sequence.courses.map((course, index) => (
              <li key={course.id} className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">{index === 0 ? labels.foundation : index === sequence.courses.length - 1 ? labels.advanced : labels.step(index)}</p>
                <Link href={courseDetailPath(course, language)} className="mt-3 block text-lg font-bold leading-6 text-slate-950 hover:text-violet-700"><span className="text-violet-700">{courseCode(course)}</span>{" "}{language === "zh" ? (course.titleZh ?? course.title) : course.title}</Link>
                <p className="mt-3 text-sm text-slate-500">{course.university}</p>
                <p className="mt-1 text-xs text-slate-400">{labels.stage}: {stageLabel(course, language)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-5 text-slate-500">{labels.disclaimer}</p>
        </section>
      )}

      {goal && !sequence && (
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="leading-6">{labels.noResult}</p>
          <Link href={`/feedback?${new URLSearchParams({ ...(language === "zh" ? { lang: "zh" } : {}), type: "missing-course", request: goal }).toString()}`} className="mt-4 inline-block rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-800">{labels.request} →</Link>
        </section>
      )}
    </main>
  );
}

export default function GoalsPage() {
  return <Suspense fallback={<main className="min-h-screen" />}><GoalPlanner /></Suspense>;
}
