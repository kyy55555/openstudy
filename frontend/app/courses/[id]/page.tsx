"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { courseCode, courses, suggestedStudyStage } from "../../../data/courses";
import { courseDetailPath, prerequisiteCourseIds } from "../../../data/courseNavigation";

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

  if (!course) {
    return <main className="mx-auto max-w-3xl px-6 py-12"><h1 className="text-2xl font-bold">{language === "zh" ? "未找到课程" : "Course not found"}</h1><Link href={language === "zh" ? "/courses?lang=zh" : "/courses"} className="mt-6 inline-block underline">{language === "zh" ? "返回课程列表" : "Back to courses"}</Link></main>;
  }

  const stage = suggestedStudyStage(course);
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

        <section className="mt-8"><h2 className="text-xl font-semibold">{language === "zh" ? "官方课程资料" : "Official course materials"}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{course.resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 p-4 hover:border-black"><span className="font-medium">{language === "zh" ? resourceZh[resource.type] : resource.title}</span><span className="mt-1 block text-xs text-gray-500">{course.sourceName} ↗</span></a>)}</div></section>

        <section className="mt-8 border-t pt-6"><h2 className="font-semibold">{language === "zh" ? "来源与核实" : "Source and verification"}</h2><p className="mt-2 text-sm text-gray-600">{language === "zh" ? "所有链接均指向大学或课程团队的官方页面。未知信息保留为“尚未核实”，不会推测。" : "Every link points to an official university or course-team page. Unknown facts remain unverified rather than guessed."}</p><p className="mt-2 text-sm text-gray-500">{course.sourceName} · {language === "zh" ? "核实日期" : "verified"} {course.verifiedOn}</p><a href={course.courseUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg bg-black px-5 py-3 font-medium text-white">{language === "zh" ? "进入官方课程网站 ↗" : "Open official course ↗"}</a></section>
      </section>
    </main>
  );
}
