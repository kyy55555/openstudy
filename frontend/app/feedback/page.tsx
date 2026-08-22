"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../lib/supabase/client";

function FeedbackContent() {
  const params = useSearchParams();
  const language = params.get("lang") === "zh" ? "zh" : "en";
  const courseId = params.get("course")?.slice(0, 100) ?? "";
  const sourceUrl = params.get("source")?.slice(0, 2000) ?? "";
  const [issueType, setIssueType] = useState(courseId ? "broken-link" : "other");
  const [message, setMessage] = useState(() => courseId ? (language === "zh" ? `课程：${courseId}\n官方链接：${sourceUrl}\n\n我发现的问题：` : `Course: ${courseId}\nOfficial link: ${sourceUrl}\n\nProblem found: `) : "");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [website, setWebsite] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (issueType === "account-deletion" && !email.trim()) { setStatus(language === "zh" ? "账号删除请求需要填写账号邮箱，方便核实身份。" : "Account-deletion requests need the account email so identity can be verified."); return; }
    const client = getSupabaseBrowserClient();
    if (!client) { setStatus(language === "zh" ? "反馈服务尚未配置，请稍后再试。" : "Feedback is not configured yet. Please try again later."); return; }
    if (website) { setMessage(""); setStatus(language === "zh" ? "已收到，谢谢你的反馈。" : "Received—thank you for the feedback."); return; }
    setBusy(true);
    setStatus("");
    const { error } = await client.from("feedback").insert({ message: `[${issueType}] ${message.trim()}`, email: email.trim() || null, page_url: window.location.href });
    setBusy(false);
    if (error) setStatus(language === "zh" ? "暂时无法提交，请稍后重试。" : "Could not submit feedback. Please try again later.");
    else { setMessage(""); setEmail(""); setStatus(language === "zh" ? "已收到，谢谢你的反馈。" : "Received—thank you for the feedback."); }
  }

  return <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
    <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500">← OpenStudy</Link>
    <h1 className="mt-5 text-3xl font-bold">{language === "zh" ? "反馈问题" : "Send feedback"}</h1>
    <p className="mt-3 text-gray-600">{language === "zh" ? "请告诉我们失效链接、错误课程信息或使用中遇到的问题。提交内容会保存到 OpenStudy 的数据库中。" : "Report broken links, incorrect course information, or problems using the site. Submissions are stored in OpenStudy's database."}</p>
    {!isSupabaseConfigured() && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{language === "zh" ? "本地预览尚未连接反馈服务；部署 Beta 时会随免费数据库一并启用。" : "This local preview is not connected to feedback storage; it will be enabled with the free database for Beta."}</p>}
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <label className="block text-sm font-medium">{language === "zh" ? "问题类型" : "Issue type"}<select value={issueType} onChange={(event) => setIssueType(event.target.value)} className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3"><option value="broken-link">{language === "zh" ? "链接失效或跳转错误" : "Broken or incorrect link"}</option><option value="course-data">{language === "zh" ? "课程信息不准确" : "Incorrect course information"}</option><option value="study-plan">{language === "zh" ? "学习计划不合理" : "Study-plan problem"}</option><option value="translation">{language === "zh" ? "翻译问题" : "Translation issue"}</option><option value="account-deletion">{language === "zh" ? "删除账号与云端记录" : "Delete account and cloud record"}</option><option value="other">{language === "zh" ? "其他问题或建议" : "Other problem or suggestion"}</option></select></label>
      <label className="block text-sm font-medium">{language === "zh" ? "问题或建议" : "Problem or suggestion"}<textarea required minLength={10} maxLength={4000} aria-describedby="feedback-character-count" value={message} onChange={(event) => setMessage(event.target.value)} rows={7} className="mt-2 block w-full rounded-xl border border-gray-300 p-3" /><span id="feedback-character-count" className="mt-1 block text-xs font-normal text-gray-500">{message.length}/4000</span></label>
      <label className="block text-sm font-medium">{issueType === "account-deletion" ? (language === "zh" ? "账号邮箱（必填，用于核实）" : "Account email (required for verification)") : (language === "zh" ? "邮箱（选填，用于回复）" : "Email (optional, for a reply)")}<input type="email" required={issueType === "account-deletion"} autoComplete="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block w-full rounded-xl border border-gray-300 p-3" /></label>
      <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={busy || message.trim().length < 10} className="rounded-xl bg-black px-5 py-3 font-medium text-white disabled:opacity-50">{busy ? (language === "zh" ? "提交中…" : "Sending…") : (language === "zh" ? "提交反馈" : "Send feedback")}</button><Link href={language === "zh" ? "/privacy?lang=zh" : "/privacy"} className="text-sm text-gray-600 underline underline-offset-4">{language === "zh" ? "查看隐私说明" : "Read the privacy notice"}</Link></div>
      {status && <p role="status" className="text-sm text-gray-700">{status}</p>}
    </form>
  </main>;
}

export default function FeedbackPage() { return <Suspense><FeedbackContent /></Suspense>; }
