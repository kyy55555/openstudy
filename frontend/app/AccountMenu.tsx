"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../lib/supabase/client";
import ThemeToggle from "./ThemeToggle";

export default function AccountMenu() {
  const [user, setUser] = useState<User | null>(null);
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    void client.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => setUser(nextSession?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const href = language === "zh" ? "/account?lang=zh" : "/account";
  const label = !isSupabaseConfigured()
    ? (language === "zh" ? "账号设置" : "Account setup")
    : user
      ? (language === "zh" ? "我的账号" : "My account")
      : (language === "zh" ? "登录同步" : "Sign in to sync");

  return <nav aria-label={language === "zh" ? "用户快捷操作" : "Account shortcuts"} className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 flex flex-wrap items-center justify-end gap-2"><ThemeToggle language={language} /><Link href={language === "zh" ? "/today?lang=zh" : "/today"} className="rounded-full border border-violet-200 bg-violet-700 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-violet-800">{language === "zh" ? "今日学习" : "Today"}</Link><Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-lg hover:border-gray-400">{language === "zh" ? "用户中心" : "User center"}</Link><Link href={href} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-lg hover:border-gray-400">{label}</Link></nav>;
}
