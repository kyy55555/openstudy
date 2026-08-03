import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16 text-center">
    <p className="text-sm font-semibold text-gray-500">404</p>
    <h1 className="mt-3 text-3xl font-bold">没有找到这个页面 · Page not found</h1>
    <p className="mt-3 text-gray-600">页面可能已移动，或者课程链接有误。The page may have moved or the course link may be incorrect.</p>
    <Link href="/" className="mx-auto mt-7 rounded-xl bg-black px-5 py-3 font-medium text-white">返回 OpenStudy</Link>
  </main>;
}
