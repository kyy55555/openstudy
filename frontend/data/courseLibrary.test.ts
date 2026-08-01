import assert from "node:assert/strict";
import test from "node:test";

import { parseCourseLibrary, pathCompletion } from "./courseLibrary.ts";

test("course library safely parses local data", () => {
  assert.deepEqual(parseCourseLibrary(null), { progress: {}, favorites: [] });
  assert.deepEqual(parseCourseLibrary("broken"), { progress: {}, favorites: [] });
  assert.deepEqual(parseCourseLibrary('{"progress":{"a":"completed"},"favorites":["a"]}'), { progress: { a: "completed" }, favorites: ["a"] });
});

test("path completion deduplicates repeated electives", () => {
  assert.deepEqual(pathCompletion(["a", "a", "b"], { a: "completed", b: "in-progress" }), { completed: 1, total: 2, percent: 50 });
});
