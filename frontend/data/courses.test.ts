import assert from "node:assert/strict";
import test from "node:test";

import { courses } from "./courses.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
  "www.cs.princeton.edu",
  "www.cs.cornell.edu",
  "inst.eecs.berkeley.edu",
  "courses.cs.washington.edu",
]);

const knownInvalidCourseUrls = new Set([
  "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/",
]);

test("course records have unique ids and real official URLs", () => {
  assert.ok(courses.length >= 20);
  assert.equal(new Set(courses.map(({ id }) => id)).size, courses.length);

  for (const course of courses) {
    assert.ok(course.title.trim());
    assert.notEqual(course.courseUrl, "#");
    assert.ok(!knownInvalidCourseUrls.has(course.courseUrl));
    assert.equal(course.courseUrl, course.sourceUrl);
    assert.ok(officialHosts.has(new URL(course.courseUrl).hostname));
    assert.match(course.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);

    for (const resource of course.resources) {
      assert.ok(resource.title.trim());
      assert.ok(officialHosts.has(new URL(resource.url).hostname));
      assert.notEqual(resource.url, course.courseUrl);
    }
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
