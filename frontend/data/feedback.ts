export const feedbackIssueTypes = [
  "broken-link",
  "course-data",
  "curriculum-data",
  "missing-course",
  "study-plan",
  "account-sync",
  "mobile-accessibility",
  "translation",
  "account-deletion",
  "other",
] as const;

export type FeedbackIssueType = (typeof feedbackIssueTypes)[number];
export type FeedbackLanguage = "en" | "zh";
export type FeedbackViewport = "mobile" | "tablet" | "desktop";

export function isFeedbackIssueType(value: string): value is FeedbackIssueType {
  return feedbackIssueTypes.includes(value as FeedbackIssueType);
}

export function feedbackViewport(width: number): FeedbackViewport {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function feedbackAppVersion(commitSha?: string): string {
  const normalized = commitSha?.trim();
  return normalized ? normalized.slice(0, 40) : "unknown";
}

export function legacyFeedbackMessage(issueType: FeedbackIssueType, message: string): string {
  return `[${issueType}] ${message.trim()}`;
}

export function feedbackPrefill(
  language: FeedbackLanguage,
  context: { courseId?: string; pathId?: string; sourceUrl?: string; requestedCourse?: string },
): string {
  const lines: string[] = [];
  if (context.courseId) lines.push(`${language === "zh" ? "课程" : "Course"}：${context.courseId.slice(0, 100)}`);
  if (context.pathId) lines.push(`${language === "zh" ? "培养方案" : "Curriculum"}：${context.pathId.slice(0, 100)}`);
  if (context.sourceUrl) lines.push(`${language === "zh" ? "官方来源" : "Official source"}：${context.sourceUrl.slice(0, 2000)}`);
  if (context.requestedCourse) lines.push(`${language === "zh" ? "希望增加的课程或主题" : "Requested course or topic"}：${context.requestedCourse.slice(0, 200)}`);
  if (lines.length === 0) return "";
  return `${lines.join("\n")}\n\n${language === "zh" ? "我发现的问题：" : "Problem found: "}`;
}

export function shouldRetryLegacyFeedback(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "PGRST204" || /issue_type|language|viewport|app_version/i.test(error.message ?? "");
}
