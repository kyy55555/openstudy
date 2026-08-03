import type { MetadataRoute } from "next";
import { courses } from "../data/courses";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/courses", "/paths", "/privacy", "/terms", "/feedback"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...courses.map((course) => ({ url: `${base}/courses/${course.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
