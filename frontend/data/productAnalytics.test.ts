import assert from "node:assert/strict";
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
