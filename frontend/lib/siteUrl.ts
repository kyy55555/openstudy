export function publicSiteUrl() {
  const fallback = process.env.NODE_ENV === "production"
    ? "https://openstudy-sigma.vercel.app"
    : "http://localhost:3000";

  return (process.env.NEXT_PUBLIC_SITE_URL ?? fallback).replace(/\/+$/, "");
}
