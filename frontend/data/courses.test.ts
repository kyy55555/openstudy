import assert from "node:assert/strict";
import test from "node:test";

import { courseCode, courses, suggestedStudyStage } from "./courses.ts";
import { courseDetailPath, prerequisiteCourseIds } from "./courseNavigation.ts";

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
  "cs61c.org",
  "web.stanford.edu",
  "web.mit.edu",
  "pdos.csail.mit.edu",
  "cs162.org",
  "cs170.org",
  "cs186berkeley.net",
  "cs144.github.io",
  "cs184.eecs.berkeley.edu",
  "eecs189.org",
  "openlearninglibrary.mit.edu",
  "cs155.stanford.edu",
  "pacman.cs.tsinghua.edu.cn",
  "dsa.cs.tsinghua.edu.cn",
  "cg.cs.tsinghua.edu.cn",
  "courseweb.pku.edu.cn",
  "ceca.pku.edu.cn",
  "dean.pku.edu.cn",
  "center.pku.edu.cn",
  "elective.pku.edu.cn",
  "dbgroup.cs.tsinghua.edu.cn",
  "www.cs.cmu.edu",
  "www.csd.cs.cmu.edu",
  "www.cs124.org",
  "www.cs128.org",
  "courses.illinois.edu",
  "courses.grainger.illinois.edu",
  "syllabus.gatech.edu",
  "catalog.gatech.edu",
  "cs2110.gatech.edu",
  "faculty.cc.gatech.edu",
  "cs3110.github.io",
  "cs61.seas.harvard.edu",
  "www.scs.stanford.edu",
  "undergraduate.catalog.berkeley.edu",
  "math.berkeley.edu",
  "exams.math.princeton.edu",
  "web.math.princeton.edu",
  "www.math.princeton.edu",
  "mat201dev.math.princeton.edu",
  "mat202.math.princeton.edu",
  "phy.princeton.edu",
  "www.princeton.edu",
  "hpa.princeton.edu",
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
    "berkeley-cs61c",
    "stanford-cs103",
    "stanford-cs109",
    "stanford-cs111",
    "stanford-cs161",
    "princeton-cos240",
    "mit-8-01sc",
    "mit-8-02",
    "mit-5-111sc",
    "mit-7-012",
    "princeton-cos316",
    "princeton-cos324",
    "princeton-cos423",
    "mit-6-031",
    "mit-6-004",
    "mit-6-s081",
    "berkeley-cs162",
    "berkeley-cs170",
    "berkeley-cs186",
    "stanford-cs144",
    "stanford-cs143",
    "stanford-cs148",
    "mit-6-172",
    "mit-6-033",
    "mit-6-830",
    "mit-6-036",
    "mit-6-253",
    "berkeley-cs184",
    "berkeley-cs189",
    "stanford-cs221",
    "stanford-cs155",
    "princeton-cos418",
    "princeton-cos432",
    "princeton-cos461",
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

test("verified Tsinghua and Peking University courses are present", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of ["tsinghua-20740112", "tsinghua-computer-graphics", "tsinghua-20740164", "tsinghua-database-technology", "pku-computing-intro", "pku-data-structures", "pku-operating-systems"]) assert.ok(ids.has(id), `${id} is missing`);
});

test("Princeton BSE foundations use verified Princeton courses", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of ["princeton-mat103", "princeton-mat104", "princeton-mat201", "princeton-mat202", "princeton-phy103", "princeton-phy104", "princeton-chm201"]) {
    assert.ok(ids.has(id), `${id} is missing`);
  }
});

test("course detail routes and prerequisite links resolve", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of Object.values(prerequisiteCourseIds)) assert.ok(ids.has(id), `${id} prerequisite target is missing`);
  assert.equal(courseDetailPath("mit-6-006", "en"), "/courses/mit-6-006");
  assert.equal(courseDetailPath("mit-6-006", "zh"), "/courses/mit-6-006?lang=zh");
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
