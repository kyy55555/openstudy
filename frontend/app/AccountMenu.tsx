"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../lib/supabase/client";

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

  return <Link href={href} className="fixed bottom-5 right-5 z-50 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-lg hover:border-gray-400">{label}</Link>;
}
