"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PrivacyContent() {
  const language = useSearchParams().get("lang") === "zh" ? "zh" : "en";
  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
    <Link href={language === "zh" ? "/?lang=zh" : "/"} className="text-sm text-gray-500">← OpenStudy</Link>
    <h1 className="mt-5 text-3xl font-bold">{language === "zh" ? "隐私说明" : "Privacy notice"}</h1>
    <p className="mt-2 text-sm text-gray-500">{language === "zh" ? "Beta 版本 · 更新于 2026 年 8 月 24 日" : "Beta version · Updated August 24, 2026"}</p>
    <div className="mt-8 space-y-6 leading-7 text-gray-700">
      <section><h2 className="text-lg font-semibold text-black">{language === "zh" ? "我们保存什么" : "What we store"}</h2><p className="mt-2">{language === "zh" ? "游客的课程进度、收藏、学习计划和最近打开资料只保存在当前浏览器。注册账号后，相同类型的学习记录会保存至 Supabase，并与账号 ID 和更新时间关联。" : "Guest progress, saved courses, study plans, and the last opened resource stay in the current browser. After account registration, the same learning records are stored in Supabase with the account ID and update time."}</p></section>
      <section><h2 className="text-lg font-semibold text-black">{language === "zh" ? "游客与账号记录分开" : "Guest and account records stay separate"}</h2><p className="mt-2">{language === "zh" ? "登录或注册不会自动合并游客记录。退出账号后，网站会重新显示该浏览器原有的游客记录。" : "Signing in or creating an account does not automatically merge guest records. After sign-out, the site shows the browser's original guest record again."}</p></section>
      <section><h2 className="text-lg font-semibold text-black">{language === "zh" ? "账号与反馈信息" : "Account and feedback information"}</h2><p className="mt-2">{language === "zh" ? "Supabase Auth 会保存注册邮箱和登录所需信息。提交反馈时，我们保存反馈正文、可选回复邮箱、提交时间和反馈页面地址；账号删除请求必须提供账号邮箱用于核实。请不要在反馈中填写密码或其他敏感信息。" : "Supabase Auth stores the registration email and information needed for sign-in. Feedback stores the message, optional reply email, submission time, and feedback-page address; account-deletion requests require the account email for verification. Do not include passwords or other sensitive information in feedback."}</p></section>
      <section><h2 className="text-lg font-semibold text-black">{language === "zh" ? "访问分析与广告" : "Visitor analytics and advertising"}</h2><p className="mt-2">{language === "zh" ? "OpenStudy 使用 Vercel Web Analytics 统计匿名访问量、页面浏览、来源、国家或地区、设备、浏览器和操作系统等汇总信息，以了解网站是否有用并改进体验。Vercel Web Analytics 不使用 Cookie，访问者标识按天重置；我们不使用广告追踪器，也不会用这些统计建立跨网站个人档案。" : "OpenStudy uses Vercel Web Analytics to measure anonymous visits, page views, referrers, country or region, device, browser, and operating-system aggregates so we can understand whether the site is useful and improve it. Vercel Web Analytics does not use cookies and resets visitor identifiers daily. We do not use advertising trackers or use these statistics to build cross-site personal profiles."}</p></section>
      <section><h2 className="text-lg font-semibold text-black">{language === "zh" ? "外部网站" : "External websites"}</h2><p className="mt-2">{language === "zh" ? "课程资料由大学官方站点提供。打开外部链接后，相关大学网站适用其自己的隐私政策；OpenStudy 不托管课程视频、讲义或试题。" : "Course materials are provided by official university sites. Their privacy policies apply after you open an external link; OpenStudy does not host course videos, notes, or exams."}</p></section>
      <section><h2 className="text-lg font-semibold text-black">{language === "zh" ? "删除数据" : "Deleting data"}</h2><p className="mt-2">{language === "zh" ? "Beta 期间如需删除云端学习记录或账号，请通过反馈页面提出请求。浏览器中的游客数据可通过清除本站浏览器存储删除。" : "During Beta, request deletion of cloud learning records or your account through the feedback page. Guest data can be removed by clearing this site's browser storage."}</p></section>
    </div>
  </main>;
}

export default function PrivacyPage() { return <Suspense><PrivacyContent /></Suspense>; }
