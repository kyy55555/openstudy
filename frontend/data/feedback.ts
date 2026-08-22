export const feedbackIssueTypes = [
  "broken-link",
  "course-data",
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

export function shouldRetryLegacyFeedback(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "PGRST204" || /issue_type|language|viewport|app_version/i.test(error.message ?? "");
}
