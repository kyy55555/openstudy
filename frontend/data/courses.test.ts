import assert from "node:assert/strict";
import test from "node:test";

import { courses } from "./courses.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
]);

test("course records have unique ids and real official URLs", () => {
  assert.ok(courses.length >= 20);
  assert.equal(new Set(courses.map(({ id }) => id)).size, courses.length);

  for (const course of courses) {
    assert.ok(course.title.trim());
    assert.notEqual(course.courseUrl, "#");
    assert.equal(course.courseUrl, course.sourceUrl);
    assert.ok(officialHosts.has(new URL(course.courseUrl).hostname));
    assert.match(course.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("dataset spans universities and subjects without recommendation data", () => {
  assert.ok(new Set(courses.map(({ university }) => university)).size >= 3);
  assert.ok(new Set(courses.map(({ subject }) => subject)).size >= 10);

  for (const course of courses) {
    assert.ok(!("recommended" in course));
    for (const field of ["hasVideos", "hasAssignments", "hasSolutions"] as const) {
      assert.ok(course[field] === true || course[field] === false || course[field] === null);
    }
  }
});
