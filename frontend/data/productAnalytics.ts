export const productEventNames = [
  "course_search",
  "goal_route_requested",
  "course_opened",
  "resource_opened",
  "favorite_added",
  "favorite_removed",
  "study_plan_created",
  "study_task_completed",
  "signup_completed",
] as const;

export type ProductEventName = (typeof productEventNames)[number];
export type ProductEventInput = {
  eventName: ProductEventName;
  courseId?: string;
  resourceType?: string;
  searchQuery?: string;
  numericValue?: number;
  language?: "en" | "zh";
};

export type ProductEventRow = {
  event_name: ProductEventName;
  anonymous_id: string;
  session_id: string;
  course_id: string | null;
  resource_type: string | null;
  search_query: string | null;
  numeric_value: number | null;
  language: "en" | "zh" | null;
  viewport: "mobile" | "tablet" | "desktop";
  page_path: string;
};

const eventNameSet = new Set<string>(productEventNames);
export const productAnalyticsUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function boundedText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized ? normalized.slice(0, maxLength) : null;
}

export function sanitizeProductEvent(
  input: ProductEventInput,
  context: { anonymousId: string; sessionId: string; pagePath: string; viewport: ProductEventRow["viewport"] },
): ProductEventRow | null {
  if (!eventNameSet.has(input.eventName) || !productAnalyticsUuidPattern.test(context.anonymousId) || !productAnalyticsUuidPattern.test(context.sessionId)) return null;
  const numericValue = typeof input.numericValue === "number" && Number.isFinite(input.numericValue)
    ? Math.max(0, Math.min(3650, Math.round(input.numericValue)))
    : null;
  return {
    event_name: input.eventName,
    anonymous_id: context.anonymousId,
    session_id: context.sessionId,
    course_id: boundedText(input.courseId, 120),
    resource_type: boundedText(input.resourceType, 40),
    search_query: boundedText(input.searchQuery, 160),
    numeric_value: numericValue,
    language: input.language === "en" || input.language === "zh" ? input.language : null,
    viewport: context.viewport,
    page_path: boundedText(context.pagePath.split("?")[0], 500) ?? "/",
  };
}
