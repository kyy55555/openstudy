"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { feedbackPrefill, isFeedbackIssueType } from "../../data/feedback";
import FeedbackForm from "../FeedbackForm";

function FeedbackContent() {
  const params = useSearchParams();
  const language = params.get("lang") === "zh" ? "zh" : "en";
  const courseId = params.get("course")?.slice(0, 100) ?? "";
  const pathId = params.get("path")?.slice(0, 100) ?? "";
  const sourceUrl = params.get("source")?.slice(0, 2000) ?? "";
  const requestedCourse = params.get("request")?.slice(0, 200) ?? "";
  const requestedType = params.get("type") ?? "";
  const issueType = isFeedbackIssueType(requestedType) ? requestedType : courseId ? "broken-link" : pathId ? "curriculum-data" : "other";
  const message = feedbackPrefill(language, { courseId, pathId, sourceUrl, requestedCourse });

  return <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
    <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500">← OpenStudy</Link>
    <h1 className="mt-5 text-3xl font-bold">{language === "zh" ? "反馈问题" : "Send feedback"}</h1>
    <p className="mt-3 text-gray-600">{language === "zh" ? "请告诉我们失效链接、错误课程信息或使用中遇到的问题。提交内容会保存到 OpenStudy 的数据库中。" : "Report broken links, incorrect course information, or problems using the site. Submissions are stored in OpenStudy's database."}</p>
    <div className="mt-8"><FeedbackForm language={language} initialIssueType={issueType} initialMessage={message} /></div>
  </main>;
}

export default function FeedbackPage() { return <Suspense><FeedbackContent /></Suspense>; }
