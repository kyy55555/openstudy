import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AccountMenu from "./AccountMenu";
import DocumentLanguage from "./DocumentLanguage";
import SiteFooter from "./SiteFooter";
import { publicSiteUrl } from "../lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl()),
  title: "OpenStudy",
  description: "Verified open university courses and learning paths.",
  openGraph: {
    title: "OpenStudy",
    description: "Verified open university courses and curriculum references for self-study.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><a href="#main-content" className="skip-link">Skip to main content / 跳到主要内容</a><Suspense><DocumentLanguage /></Suspense><div id="main-content" tabIndex={-1} className="contents">{children}</div><Suspense><SiteFooter /></Suspense><Suspense><AccountMenu /></Suspense></body>
    </html>
  );
}
