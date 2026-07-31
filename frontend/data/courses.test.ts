import assert from "node:assert/strict";
import test from "node:test";

import { courseCode, courses, suggestedStudyStage } from "./courses.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
  "www.cs.princeton.edu",
  "www.cs.cornell.edu",
  "inst.eecs.berkeley.edu",
  "courses.cs.washington.edu",
  "cs61a.org",
  "sp26.datastructur.es",
  "www.eecs70.org",
]);

const knownInvalidCourseUrls = new Set([
  "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/",
]);

test("course records have unique ids and real official URLs", () => {
  assert.ok(courses.length >= 20);
  assert.equal(new Set(courses.map(({ id }) => id)).size, courses.length);

  for (const course of courses) {
    assert.ok(course.title.trim());
    assert.ok(course.titleZh?.trim(), `${course.id} has no Chinese title`);
    assert.ok(course.descriptionZh?.trim(), `${course.id} has no Chinese description`);
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

test("every course with a verified level has a suggested study stage", () => {
  for (const course of courses) {
    if (course.level === null) continue;
    assert.ok(suggestedStudyStage(course), `${course.id} has no suggested study stage`);
  }
});

test("new prerequisite foundation courses are present", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of [
    "mit-18-01sc",
    "mit-18-02sc",
    "mit-18-05",
    "mit-18-06",
    "mit-6-042j",
    "princeton-cos217",
    "cornell-cs3410",
    "berkeley-cs61a",
    "berkeley-cs61b",
    "berkeley-cs70",
  ]) {
    assert.ok(ids.has(id), `${id} is missing`);
  }
});

test("every course has a stable display code", () => {
  for (const course of courses) {
    assert.ok(courseCode(course).trim(), `${course.id} has no display code`);
  }
  assert.equal(courseCode(courses.find(({ id }) => id === "princeton-cos126")!), "COS 126");
  assert.equal(courseCode(courses.find(({ id }) => id === "mit-6-042j")!), "6.042J");
});

test("verified prerequisite chains include their official foundations", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  assert.deepEqual(byId.get("mit-6-006")?.prerequisites, [
    "Introductory Python programming",
    "Discrete mathematics",
  ]);
  assert.deepEqual(byId.get("mit-6-046j")?.prerequisites, [
    "MIT 6.006",
    "Discrete mathematics",
  ]);
  assert.ok(byId.get("cornell-cs3780")?.prerequisites?.includes("Probability"));
});

test("dataset spans universities and subjects without recommendation data", () => {
  assert.ok(new Set(courses.map(({ university }) => university)).size >= 3);
  assert.ok(new Set(courses.map(({ subject }) => subject)).size >= 10);

  for (const course of courses) {
    assert.ok(!("recommended" in course));
    assert.ok(course.resources.length > 0, `${course.id} has no verified resource entry`);
    for (const field of ["hasVideos", "hasAssignments", "hasSolutions"] as const) {
      assert.ok(course[field] === true || course[field] === false || course[field] === null);
    }
  }
});
