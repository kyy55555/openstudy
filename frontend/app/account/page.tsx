"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../lib/supabase/client";

function AccountContent() {
  const params = useSearchParams();
  const language = params.get("lang") === "zh" ? "zh" : "en";
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const client = getSupabaseBrowserClient();

  useEffect(() => {
    if (!client) return;
    void client.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [client]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setMessage("");
    const result = mode === "signin"
      ? await client.auth.signInWithPassword({ email, password })
      : await client.auth.signUp({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === "signup" && !result.data.session) setMessage(language === "zh" ? "注册成功，请检查邮箱并确认账号。" : "Account created. Check your email to confirm it.");
    else setMessage(language === "zh" ? "登录成功，正在同步学习记录。" : "Signed in. Your learning record is syncing.");
  }

  async function signOut() {
    await client?.auth.signOut();
    setMessage(language === "zh" ? "已退出登录。" : "Signed out.");
  }

  const back = language === "zh" ? "/?lang=zh" : "/";
  return <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
    <Link href={back} className="text-sm text-gray-500 hover:text-black">← OpenStudy</Link>
    <h1 className="mt-5 text-3xl font-bold">{language === "zh" ? "账号与云端同步" : "Account and cloud sync"}</h1>
    <p className="mt-3 text-gray-600">{language === "zh" ? "登录后，课程进度和收藏会同步到你的账号，并可在不同设备上继续学习。" : "Sign in to sync course progress and saved courses across devices."}</p>

    {!isSupabaseConfigured() ? <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <h2 className="font-semibold text-amber-950">{language === "zh" ? "云端服务尚未配置" : "Cloud service is not configured"}</h2>
      <p className="mt-2 text-sm text-amber-900">{language === "zh" ? "网站仍会保留当前浏览器中的学习记录。管理员配置 Supabase 环境变量并运行数据库脚本后，注册和跨设备同步即可启用。" : "The site still keeps learning records in this browser. Registration and cross-device sync become available after the Supabase environment variables and database schema are configured."}</p>
    </section> : user ? <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm text-emerald-800">{language === "zh" ? "当前账号" : "Signed in as"}</p>
      <p className="mt-1 font-semibold text-emerald-950">{user.email}</p>
      <p className="mt-4 text-sm text-emerald-900">{language === "zh" ? "✓ 课程进度与收藏已启用云端同步" : "✓ Cloud sync is active for progress and saved courses"}</p>
      <button onClick={signOut} className="mt-5 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-100">{language === "zh" ? "退出登录" : "Sign out"}</button>
    </section> : <section className="mt-8 rounded-2xl border border-gray-200 p-6">
      <div className="flex rounded-lg bg-gray-100 p-1">
        {(["signin", "signup"] as const).map((item) => <button key={item} onClick={() => { setMode(item); setMessage(""); }} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${mode === item ? "bg-white shadow-sm" : "text-gray-500"}`}>{item === "signin" ? (language === "zh" ? "登录" : "Sign in") : (language === "zh" ? "注册" : "Create account")}</button>)}
      </div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-sm font-medium">{language === "zh" ? "邮箱" : "Email"}<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" /></label>
        <label className="block text-sm font-medium">{language === "zh" ? "密码（至少 6 位）" : "Password (at least 6 characters)"}<input required minLength={6} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" /></label>
        {mode === "signup" && <label className="flex items-start gap-2 text-sm text-gray-600"><input required type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1" /><span>{language === "zh" ? "我已阅读并同意" : "I have read and agree to the"} <Link href={language === "zh" ? "/terms?lang=zh" : "/terms"} className="underline">{language === "zh" ? "使用说明" : "terms"}</Link> {language === "zh" ? "和" : "and"} <Link href={language === "zh" ? "/privacy?lang=zh" : "/privacy"} className="underline">{language === "zh" ? "隐私说明" : "privacy notice"}</Link>。</span></label>}
        <button disabled={busy || (mode === "signup" && !accepted)} className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50">{busy ? (language === "zh" ? "处理中…" : "Working…") : mode === "signin" ? (language === "zh" ? "登录并同步" : "Sign in and sync") : (language === "zh" ? "创建账号" : "Create account")}</button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700" role="status">{message}</p>}
      <p className="mt-4 text-xs text-gray-500">{language === "zh" ? "登录不会自动合并当前游客记录；账号与游客数据保持分开。" : "Signing in does not automatically merge the current guest record; account and guest data stay separate."}</p>
    </section>}
  </main>;
}

export default function AccountPage() { return <Suspense><AccountContent /></Suspense>; }
