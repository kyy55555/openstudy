"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16 text-center">
    <h1 className="text-3xl font-bold">Something went wrong · 页面出现问题</h1>
    <p className="mt-4 text-gray-600">Your learning record remains stored. Try loading this page again.<br />你的学习记录仍会保留，请重新加载此页面。</p>
    <button onClick={reset} className="mx-auto mt-7 rounded-lg bg-black px-5 py-3 font-medium text-white">Try again · 重试</button>
  </main>;
}
