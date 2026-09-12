"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { guestStudyMilestoneEvent, signupNudgeStorageKey } from "../data/signupNudge";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function SignupNudge() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function show() {
      const client = getSupabaseBrowserClient();
      if (client) {
        const { data } = await client.auth.getUser();
        if (data.user) return;
      }
      try {
        if (window.localStorage.getItem(signupNudgeStorageKey)) return;
        window.localStorage.setItem(signupNudgeStorageKey, "1");
      } catch {
        // The reminder can still be useful when private storage is unavailable.
      }
      setVisible(true);
    }
    function onMilestone() { void show(); }
    window.addEventListener(guestStudyMilestoneEvent, onMilestone);
    return () => window.removeEventListener(guestStudyMilestoneEvent, onMilestone);
  }, []);

  if (!visible) return null;
  const accountHref = language === "zh" ? "/account?lang=zh&mode=signup" : "/account?mode=signup";
  return <aside role="status" className="fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.25rem)] right-4 z-[70] w-[calc(100%-2rem)] rounded-2xl border border-violet-200 bg-white p-5 shadow-2xl sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:w-96">
    <button type="button" onClick={() => setVisible(false)} aria-label={language === "zh" ? "暂时关闭注册提醒" : "Dismiss sign-up reminder"} className="absolute right-3 top-3 rounded-full px-2 py-1 text-gray-500 hover:text-black">×</button>
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">{language === "zh" ? "进度已保存在当前设备" : "Progress saved on this device"}</p>
    <h2 className="mt-2 pr-6 text-lg font-bold">{language === "zh" ? "想在其他设备继续吗？" : "Want to continue on another device?"}</h2>
    <p className="mt-2 text-sm leading-6 text-gray-600">{language === "zh" ? "创建免费账号即可云同步。游客记录不会自动合并，你可以继续保持分开。" : "Create a free account for cloud sync. Your guest record will stay separate and will not be merged automatically."}</p>
    <div className="mt-4 flex gap-3"><Link href={accountHref} className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800">{language === "zh" ? "创建账号" : "Create account"}</Link><button type="button" onClick={() => setVisible(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:border-gray-400">{language === "zh" ? "暂时不用" : "Not now"}</button></div>
  </aside>;
}
