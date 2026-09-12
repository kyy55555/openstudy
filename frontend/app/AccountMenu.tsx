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
  const label = !isSupabaseConfigured() || user
    ? (language === "zh" ? "账号" : "Account")
    : (language === "zh" ? "登录" : "Sign in");
  const itemClass = "flex min-h-11 flex-1 items-center justify-center rounded-full border border-gray-200 bg-white px-2 py-2 text-center text-xs font-semibold shadow-lg hover:border-gray-400 sm:flex-none sm:px-4 sm:text-sm";

  return <nav aria-label={language === "zh" ? "用户快捷操作" : "Account shortcuts"} className="account-shortcuts fixed bottom-[max(.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-50 flex items-center justify-end gap-1.5 rounded-2xl bg-white/90 p-1.5 shadow-2xl backdrop-blur sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:left-4 sm:right-4 sm:gap-2 sm:bg-transparent sm:p-0 sm:shadow-none"><Link href={language === "zh" ? "/today?lang=zh" : "/today"} className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-violet-200 bg-violet-700 px-2 py-2 text-center text-xs font-semibold text-white shadow-lg hover:bg-violet-800 sm:flex-none sm:px-4 sm:text-sm">{language === "zh" ? "今日" : "Today"}</Link><Link href={language === "zh" ? "/dashboard?lang=zh" : "/dashboard"} className={itemClass}>{language === "zh" ? "用户中心" : "Center"}</Link><Link href={href} className={itemClass}>{label}</Link><ThemeToggle language={language} /></nav>;
}
