import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { sanitizeProductEvent } from "./productAnalytics.ts";

const context = {
  anonymousId: "d9428888-122b-4a9c-9c77-4d3b94eac7ab",
  sessionId: "b5bdb2f8-8c26-4dd8-90d8-5240d9a4b472",
  pagePath: "/courses?secret=not-stored",
  viewport: "mobile" as const,
};

test("product analytics keeps only bounded non-sensitive fields", () => {
  const row = sanitizeProductEvent({
    eventName: "course_search",
    searchQuery: `  distributed    systems ${"x".repeat(300)}`,
    numericValue: 9999,
    language: "zh",
  }, context);
  assert.equal(row?.page_path, "/courses");
  assert.equal(row?.viewport, "mobile");
  assert.equal(row?.numeric_value, 3650);
  assert.equal(row?.search_query?.length, 160);
  assert.equal(row?.language, "zh");
  assert.equal("email" in (row ?? {}), false);
});

test("product analytics rejects invalid anonymous identifiers", () => {
  assert.equal(sanitizeProductEvent({ eventName: "course_opened", courseId: "mit-6-006" }, { ...context, anonymousId: "not-a-uuid" }), null);
});

test("conversion rates only count actions that happen after their prior funnel step", () => {
  const schema = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
  assert.match(schema, /event_name = 'course_opened'[\s\S]*created_at >= visitor_first\.searched_at/);
  assert.match(schema, /event_name = 'resource_opened'[\s\S]*created_at >= visitor_first\.course_opened_at/);
  assert.match(schema, /event_name = 'study_plan_created'[\s\S]*created_at >= visitor_first\.course_opened_at/);
  assert.match(schema, /event_name = 'study_task_completed'[\s\S]*created_at >= visitor_first\.plan_created_at/);
  assert.match(schema, /searched_and_opened \/ nullif\(searched, 0\).*search_to_course_rate/);
  assert.match(schema, /course_and_resource \/ nullif\(opened_course, 0\).*course_to_resource_rate/);
  assert.doesNotMatch(schema, /opened_course \/ nullif\(searched, 0\).*search_to_course_rate/);
});
