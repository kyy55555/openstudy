import assert from "node:assert/strict";
import test from "node:test";
import { feedbackAppVersion, feedbackViewport, isFeedbackIssueType, legacyFeedbackMessage, shouldRetryLegacyFeedback } from "./feedback.ts";

test("feedback categories are explicit and reject unknown values", () => {
  assert.equal(isFeedbackIssueType("account-sync"), true);
  assert.equal(isFeedbackIssueType("computer-science"), false);
});

test("feedback records only a coarse viewport category", () => {
  assert.equal(feedbackViewport(390), "mobile");
  assert.equal(feedbackViewport(800), "tablet");
  assert.equal(feedbackViewport(1440), "desktop");
});

test("feedback version is short and safe", () => {
  assert.equal(feedbackAppVersion(" abcdef123456 "), "abcdef123456");
  assert.equal(feedbackAppVersion(), "unknown");
  assert.equal(feedbackAppVersion("a".repeat(80)).length, 40);
});

test("legacy feedback remains readable and only retries schema mismatches", () => {
  assert.equal(legacyFeedbackMessage("study-plan", "  Too much work  "), "[study-plan] Too much work");
  assert.equal(shouldRetryLegacyFeedback({ code: "PGRST204" }), true);
  assert.equal(shouldRetryLegacyFeedback({ message: "column app_version does not exist" }), true);
  assert.equal(shouldRetryLegacyFeedback({ code: "42501", message: "row-level security" }), false);
});
