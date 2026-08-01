import assert from "node:assert/strict";
import test from "node:test";

import { courseResourceKey, parseCourseLibrary, pathCompletion } from "./courseLibrary.ts";

test("course library safely parses local data", () => {
  assert.deepEqual(parseCourseLibrary(null), { progress: {}, favorites: [], completedResources: [], studyPlans: {} });
  assert.deepEqual(parseCourseLibrary("broken"), { progress: {}, favorites: [], completedResources: [], studyPlans: {} });
  assert.deepEqual(parseCourseLibrary('{"progress":{"a":"completed"},"favorites":["a"]}'), { progress: { a: "completed" }, favorites: ["a"], completedResources: [], studyPlans: {} });
});

test("resource progress keys include both course and official URL", () => {
  assert.equal(courseResourceKey("mit-6-006", "https://example.edu/lectures"), "mit-6-006::https://example.edu/lectures");
});

test("path completion deduplicates repeated electives", () => {
  assert.deepEqual(pathCompletion(["a", "a", "b"], { a: "completed", b: "in-progress" }), { completed: 1, total: 2, percent: 50 });
});
