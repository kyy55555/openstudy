"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DocumentLanguage() {
  const searchParams = useSearchParams();
  const language = searchParams.get("lang") === "zh" ? "zh-CN" : "en";

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
