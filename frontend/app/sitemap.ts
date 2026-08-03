import type { MetadataRoute } from "next";
import { courses } from "../data/courses";
import { publicSiteUrl } from "../lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  const pages = ["", "/courses", "/paths", "/privacy", "/terms", "/feedback"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...courses.map((course) => ({ url: `${base}/courses/${course.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
