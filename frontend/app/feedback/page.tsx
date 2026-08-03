"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../lib/supabase/client";

function FeedbackContent() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [website, setWebsite] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) { setStatus(language === "zh" ? "反馈服务尚未配置，请稍后再试。" : "Feedback is not configured yet. Please try again later."); return; }
    if (website) { setMessage(""); setStatus(language === "zh" ? "已收到，谢谢你的反馈。" : "Received—thank you for the feedback."); return; }
    setBusy(true);
    setStatus("");
    const { error } = await client.from("feedback").insert({ message: message.trim(), email: email.trim() || null, page_url: window.location.href });
    setBusy(false);
    if (error) setStatus(language === "zh" ? "暂时无法提交，请稍后重试。" : "Could not submit feedback. Please try again later.");
    else { setMessage(""); setEmail(""); setStatus(language === "zh" ? "已收到，谢谢你的反馈。" : "Received—thank you for the feedback."); }
  }

  return <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
    <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500">← OpenStudy</Link>
    <h1 className="mt-5 text-3xl font-bold">{language === "zh" ? "反馈问题" : "Send feedback"}</h1>
    <p className="mt-3 text-gray-600">{language === "zh" ? "请告诉我们失效链接、错误课程信息或使用中遇到的问题。" : "Report broken links, incorrect course information, or problems using the site."}</p>
    {!isSupabaseConfigured() && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{language === "zh" ? "本地预览尚未连接反馈服务；部署 Beta 时会随免费数据库一并启用。" : "This local preview is not connected to feedback storage; it will be enabled with the free database for Beta."}</p>}
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <label className="block text-sm font-medium">{language === "zh" ? "问题或建议" : "Problem or suggestion"}<textarea required minLength={10} maxLength={4000} value={message} onChange={(event) => setMessage(event.target.value)} rows={7} className="mt-2 block w-full rounded-xl border border-gray-300 p-3" /></label>
      <label className="block text-sm font-medium">{language === "zh" ? "邮箱（选填，用于回复）" : "Email (optional, for a reply)"}<input type="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block w-full rounded-xl border border-gray-300 p-3" /></label>
      <button disabled={busy || !message.trim()} className="rounded-xl bg-black px-5 py-3 font-medium text-white disabled:opacity-50">{busy ? (language === "zh" ? "提交中…" : "Sending…") : (language === "zh" ? "提交反馈" : "Send feedback")}</button>
      {status && <p role="status" className="text-sm text-gray-700">{status}</p>}
    </form>
  </main>;
}

export default function FeedbackPage() { return <Suspense><FeedbackContent /></Suspense>; }
