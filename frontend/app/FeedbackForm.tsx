"use client";

import Link from "next/link";
import { useState } from "react";

import { feedbackAppVersion, feedbackViewport, legacyFeedbackMessage, shouldRetryLegacyFeedback, type FeedbackIssueType, type FeedbackLanguage } from "../data/feedback";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../lib/supabase/client";

export default function FeedbackForm({ language, initialIssueType = "other", initialMessage = "", compact = false, sourcePage }: { language: FeedbackLanguage; initialIssueType?: FeedbackIssueType; initialMessage?: string; compact?: boolean; sourcePage?: string }) {
  const [issueType, setIssueType] = useState<FeedbackIssueType>(initialIssueType);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [website, setWebsite] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (issueType === "account-deletion" && !email.trim()) {
      setStatus(language === "zh" ? "账号删除请求需要填写账号邮箱，方便核实身份。" : "Account-deletion requests need the account email so identity can be verified.");
      return;
    }
    const client = getSupabaseBrowserClient();
    if (!client) {
      setStatus(language === "zh" ? "反馈服务尚未配置，请稍后再试。" : "Feedback is not configured yet. Please try again later.");
      return;
    }
    if (website) {
      setMessage("");
      setStatus(language === "zh" ? "已收到，谢谢你的反馈。" : "Received—thank you for the feedback.");
      return;
    }
    setBusy(true);
    setStatus("");
    const common = { message: legacyFeedbackMessage(issueType, message), email: email.trim() || null, page_url: sourcePage || window.location.href };
    const structured = { ...common, issue_type: issueType, language, viewport: feedbackViewport(window.innerWidth), app_version: feedbackAppVersion(process.env.NEXT_PUBLIC_OPENSTUDY_COMMIT) };
    let { error } = await client.from("feedback").insert(structured);
    if (shouldRetryLegacyFeedback(error)) ({ error } = await client.from("feedback").insert(common));
    setBusy(false);
    if (error) setStatus(language === "zh" ? "暂时无法提交，请稍后重试。" : "Could not submit feedback. Please try again later.");
    else {
      setMessage("");
      setEmail("");
      setStatus(language === "zh" ? "已收到，谢谢你的反馈。" : "Received—thank you for the feedback.");
    }
  }

  return <form onSubmit={submit} className={compact ? "space-y-4" : "space-y-5"}>
    {!isSupabaseConfigured() && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{language === "zh" ? "本地预览尚未连接反馈服务。" : "This local preview is not connected to feedback storage."}</p>}
    <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
    <label className="block text-sm font-medium">{language === "zh" ? "问题类型" : "Issue type"}<select value={issueType} onChange={(event) => setIssueType(event.target.value as FeedbackIssueType)} className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3"><option value="broken-link">{language === "zh" ? "链接失效或跳转错误" : "Broken or incorrect link"}</option><option value="course-data">{language === "zh" ? "课程信息不准确" : "Incorrect course information"}</option><option value="curriculum-data">{language === "zh" ? "培养方案不准确" : "Incorrect curriculum reference"}</option><option value="missing-course">{language === "zh" ? "希望增加课程" : "Request a course"}</option><option value="study-plan">{language === "zh" ? "学习计划不合理" : "Study-plan problem"}</option><option value="account-sync">{language === "zh" ? "账号或云同步问题" : "Account or cloud-sync problem"}</option><option value="mobile-accessibility">{language === "zh" ? "手机或无障碍问题" : "Mobile or accessibility problem"}</option><option value="translation">{language === "zh" ? "翻译问题" : "Translation issue"}</option><option value="account-deletion">{language === "zh" ? "删除账号与云端记录" : "Delete account and cloud record"}</option><option value="other">{language === "zh" ? "其他问题或建议" : "Other problem or suggestion"}</option></select></label>
    <label className="block text-sm font-medium">{language === "zh" ? "问题或建议" : "Problem or suggestion"}<textarea required minLength={10} maxLength={4000} aria-describedby="feedback-character-count" value={message} onChange={(event) => setMessage(event.target.value)} rows={compact ? 5 : 7} placeholder={language === "zh" ? "请具体描述你遇到的问题，至少 10 个字。" : "Describe what happened in at least 10 characters."} className="mt-2 block w-full resize-y rounded-xl border border-gray-300 bg-white p-3" /><span id="feedback-character-count" className="mt-1 block text-xs font-normal text-gray-500">{message.length}/4000</span></label>
    <label className="block text-sm font-medium">{issueType === "account-deletion" ? (language === "zh" ? "账号邮箱（必填，用于核实）" : "Account email (required for verification)") : (language === "zh" ? "邮箱（选填，用于回复）" : "Email (optional, for a reply)")}<input type="email" required={issueType === "account-deletion"} autoComplete="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3" /></label>
    <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={busy || message.trim().length < 10} className="rounded-xl bg-violet-700 px-5 py-3 font-bold text-white hover:bg-violet-800 disabled:opacity-50">{busy ? (language === "zh" ? "提交中…" : "Sending…") : (language === "zh" ? "提交反馈" : "Send feedback")}</button>{!compact && <Link href={language === "zh" ? "/privacy?lang=zh" : "/privacy"} className="text-sm text-gray-600 underline underline-offset-4">{language === "zh" ? "查看隐私说明" : "Read the privacy notice"}</Link>}</div>
    {status && <p role="status" className="rounded-lg bg-slate-100 p-3 text-sm text-gray-700">{status}</p>}
  </form>;
}
