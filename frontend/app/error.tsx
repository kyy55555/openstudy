"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16 text-center">
    <h1 className="text-3xl font-bold">暂时无法加载 · Something went wrong</h1>
    <p className="mt-3 text-gray-600">你的本地学习记录仍保存在设备中。请重试；如果问题持续出现，请通过反馈页面告诉我们。</p>
    <button onClick={reset} className="mx-auto mt-7 rounded-xl bg-black px-5 py-3 font-medium text-white">重试 · Try again</button>
  </main>;
}
