"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../lib/supabase/client";

type FeedbackStatus = "new" | "reviewing" | "resolved" | "closed";
type FeedbackRow = { id: number; issue_type: string | null; status: FeedbackStatus; message: string; email: string | null; page_url: string | null; language: string | null; viewport: string | null; app_version: string | null; created_at: string };
type Funnel = { active_visitors?: number; searched?: number; opened_course?: number; opened_resource?: number; saved_course?: number; created_plan?: number; completed_task?: number; signed_up?: number; search_to_course_rate?: number; course_to_resource_rate?: number; course_to_plan_rate?: number; plan_to_task_rate?: number };
type DashboardData = { userCount: number; feedbackCounts: Partial<Record<FeedbackStatus, number>>; recentFeedback: FeedbackRow[]; funnel30d: Funnel; generatedAt: string };

function InternalContent() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(() => !isSupabaseConfigured());
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const client = getSupabaseBrowserClient();

  const load = useCallback(async () => {
    if (!client) return;
    setError("");
    const result = await client.rpc("get_internal_dashboard");
    if (result.error) {
      setData(null);
      setError(result.error.code === "42501" ? (language === "zh" ? "当前账号没有内部数据权限。" : "This account does not have internal-dashboard access.") : (language === "zh" ? "内部数据暂时无法读取。请确认已运行最新 Supabase schema。" : "Internal data is unavailable. Confirm that the latest Supabase schema has been applied."));
      return;
    }
    setData(result.data as DashboardData);
  }, [client, language]);

  useEffect(() => {
    if (!client) return;
    void client.auth.getUser().then(({ data: auth }) => { setUser(auth.user); setAuthReady(true); if (auth.user) void load(); });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setAuthReady(true); if (session?.user) void load(); else setData(null); });
    return () => listener.subscription.unsubscribe();
  }, [client, load]);

  async function updateStatus(id: number, status: FeedbackStatus) {
    if (!client) return;
    setBusyId(id);
    const result = await client.rpc("update_feedback_status", { p_feedback_id: id, p_status: status });
    setBusyId(null);
    if (result.error) setError(language === "zh" ? "反馈状态更新失败。" : "Could not update feedback status.");
    else await load();
  }

  const copy = language === "zh" ? { title: "OpenStudy 内部数据", subtitle: "产品使用漏斗、注册账号与用户反馈。仅管理员可见。", account: "前往账号登录", refresh: "刷新数据", users: "注册账号", visitors: "30 天产品访客", courses: "打开课程", resources: "打开资料", saves: "收藏课程", plans: "创建计划", tasks: "完成任务", signups: "注册事件", feedback: "用户反馈", noFeedback: "目前还没有反馈。", page: "提交页面", reply: "回复邮箱", generated: "数据生成时间" } : { title: "OpenStudy internal data", subtitle: "Product funnel, registered accounts, and user feedback. Administrators only.", account: "Sign in to account", refresh: "Refresh data", users: "Registered accounts", visitors: "30-day product visitors", courses: "Opened courses", resources: "Opened resources", saves: "Saved courses", plans: "Created plans", tasks: "Completed tasks", signups: "Signup events", feedback: "User feedback", noFeedback: "No feedback yet.", page: "Submitted from", reply: "Reply email", generated: "Generated" };
  const accountHref = language === "zh" ? "/account?lang=zh" : "/account";

  if (!authReady) return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10"><p>{language === "zh" ? "正在确认权限…" : "Checking access…"}</p></main>;
  return <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-32 pt-8 sm:px-6 sm:py-12">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500">← OpenStudy</Link><h1 className="mt-4 text-3xl font-bold sm:text-4xl">{copy.title}</h1><p className="mt-2 text-gray-600">{copy.subtitle}</p></div>{user && <button type="button" onClick={() => void load()} className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold hover:border-gray-500">{copy.refresh}</button>}</div>
    {!isSupabaseConfigured() && <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">{language === "zh" ? "本地环境未配置 Supabase。" : "Supabase is not configured in this environment."}</p>}
    {!user && isSupabaseConfigured() && <section className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-6"><p className="font-semibold">{language === "zh" ? "请先使用管理员账号登录。" : "Sign in with an administrator account first."}</p><Link href={accountHref} className="mt-4 inline-block rounded-xl bg-violet-700 px-5 py-3 font-bold text-white">{copy.account} →</Link></section>}
    {error && <p role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">{error}</p>}
    {data && <>
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[copy.users, data.userCount], [copy.visitors, data.funnel30d.active_visitors ?? 0], [copy.courses, data.funnel30d.opened_course ?? 0], [copy.resources, data.funnel30d.opened_resource ?? 0], [copy.saves, data.funnel30d.saved_course ?? 0], [copy.plans, data.funnel30d.created_plan ?? 0], [copy.tasks, data.funnel30d.completed_task ?? 0], [copy.signups, data.funnel30d.signed_up ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}</section>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">30-day funnel</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><p><span className="block text-xs text-gray-500">Search → course</span><strong className="text-2xl">{data.funnel30d.search_to_course_rate ?? 0}%</strong></p><p><span className="block text-xs text-gray-500">Course → resource</span><strong className="text-2xl">{data.funnel30d.course_to_resource_rate ?? 0}%</strong></p><p><span className="block text-xs text-gray-500">Course → plan</span><strong className="text-2xl">{data.funnel30d.course_to_plan_rate ?? 0}%</strong></p><p><span className="block text-xs text-gray-500">Plan → task</span><strong className="text-2xl">{data.funnel30d.plan_to_task_rate ?? 0}%</strong></p></div></section>
      <section className="mt-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">{copy.feedback}</h2><p className="mt-1 text-sm text-gray-500">New {data.feedbackCounts.new ?? 0} · Reviewing {data.feedbackCounts.reviewing ?? 0} · Resolved {data.feedbackCounts.resolved ?? 0}</p></div><p className="text-xs text-gray-500">{copy.generated}: {new Date(data.generatedAt).toLocaleString()}</p></div>
        {data.recentFeedback.length === 0 ? <p className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">{copy.noFeedback}</p> : <div className="mt-4 space-y-3">{data.recentFeedback.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-wide text-violet-700">{item.issue_type ?? "legacy"} · #{item.id}</p><time className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</time></div><p className="mt-3 whitespace-pre-wrap leading-7">{item.message}</p><div className="mt-3 space-y-1 text-xs text-gray-500">{item.email && <p>{copy.reply}: {item.email}</p>}{item.page_url && <p className="break-all">{copy.page}: <a href={item.page_url} target="_blank" rel="noreferrer" className="underline">{item.page_url}</a></p>}</div><div className="mt-4 flex flex-wrap gap-2">{(["new", "reviewing", "resolved", "closed"] as FeedbackStatus[]).map((status) => <button key={status} type="button" disabled={busyId === item.id || item.status === status} onClick={() => void updateStatus(item.id, status)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${item.status === status ? "border-violet-400 bg-violet-100 text-violet-900" : "border-gray-200"}`}>{status}</button>)}</div></article>)}</div>}
      </section>
    </>}
  </main>;
}

export default function InternalPage() { return <Suspense><InternalContent /></Suspense>; }
