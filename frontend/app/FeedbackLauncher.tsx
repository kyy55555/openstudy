"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import FeedbackForm from "./FeedbackForm";

export default function FeedbackLauncher() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sourcePage, setSourcePage] = useState("");
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", escape);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", escape); document.body.style.overflow = previous; };
  }, [open]);

  if (pathname === "/feedback" || pathname === "/internal") return null;

  return <>
    <button type="button" onClick={() => { setSourcePage(window.location.href); setOpen(true); }} className="feedback-launcher fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.25rem)] left-4 z-[60] inline-flex min-h-11 items-center gap-2 rounded-full border border-violet-300 bg-white px-4 py-2 text-sm font-bold text-violet-900 shadow-xl hover:border-violet-500 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))]" aria-haspopup="dialog"><span aria-hidden="true">✦</span>{language === "zh" ? "反馈问题" : "Feedback"}</button>
    {open && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="feedback-dialog-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">OpenStudy Beta</p><h2 id="feedback-dialog-title" className="mt-1 text-2xl font-bold">{language === "zh" ? "遇到问题？直接告诉我们" : "Found a problem? Tell us directly"}</h2><p className="mt-2 text-sm text-gray-600">{language === "zh" ? "会自动记录当前页面，方便我们定位并修复。请不要填写密码。" : "The current page is included so we can locate and fix the issue. Never include a password."}</p></div><button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label={language === "zh" ? "关闭反馈窗口" : "Close feedback dialog"} className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-2 text-lg leading-none hover:border-gray-400">×</button></div>
        <FeedbackForm key={sourcePage} language={language} compact sourcePage={sourcePage} />
      </section>
    </div>}
  </>;
}
