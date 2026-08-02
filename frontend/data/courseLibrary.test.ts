import assert from "node:assert/strict";
import test from "node:test";

import { courseResourceKey, learningPathCoverage, parseCourseLibrary, pathCompletion, phaseCoverage } from "./courseLibrary.ts";

test("course library safely parses local data", () => {
  assert.deepEqual(parseCourseLibrary(null), { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null });
  assert.deepEqual(parseCourseLibrary("broken"), { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null });
  assert.deepEqual(parseCourseLibrary('{"progress":{"a":"completed"},"favorites":["a"]}'), { progress: { a: "completed" }, favorites: ["a"], completedResources: [], studyPlans: {}, lastOpenedResource: null });
});

test("resource progress keys include both course and official URL", () => {
  assert.equal(courseResourceKey("mit-6-006", "https://example.edu/lectures"), "mit-6-006::https://example.edu/lectures");
});

test("path completion deduplicates repeated electives", () => {
  assert.deepEqual(pathCompletion(["a", "a", "b"], { a: "completed", b: "in-progress" }), { completed: 1, total: 2, percent: 50 });
});

test("phase lighting respects fixed courses and elective counts", () => {
  const fixed = { courseIds: ["a", "b"], chooseCount: null, choiceGroups: [] };
  assert.equal(phaseCoverage(fixed, { a: "completed" }).status, "partial");
  assert.equal(phaseCoverage(fixed, { a: "completed", b: "completed" }).status, "completed");
  const flexible = { courseIds: ["a", "b", "c"], chooseCount: 2, choiceGroups: [{ courseIds: ["d", "e"], chooseCount: 1 }] };
  assert.deepEqual(phaseCoverage(flexible, { a: "completed", c: "completed", e: "completed" }), { required: 3, completed: 3, status: "completed" });
});

test("path coverage counts required slots instead of every elective option", () => {
  const phases = [{ courseIds: ["a", "b", "c"], chooseCount: 1, choiceGroups: [] }];
  assert.deepEqual(learningPathCoverage(phases, { b: "completed" }), { completed: 1, total: 1, percent: 100 });
});
