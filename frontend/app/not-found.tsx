import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16 text-center">
    <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">404</p>
    <h1 className="mt-3 text-3xl font-bold">Page not found · 页面未找到</h1>
    <p className="mt-4 text-gray-600">The page may have moved or the link may be incorrect.<br />页面可能已经移动，或链接地址有误。</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <Link href="/" className="rounded-lg bg-black px-5 py-3 font-medium text-white">OpenStudy home</Link>
      <Link href="/courses?lang=zh" className="rounded-lg border border-gray-300 px-5 py-3 font-medium">浏览课程</Link>
    </div>
  </main>;
}
