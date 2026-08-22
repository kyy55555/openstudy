import assert from "node:assert/strict";
import test from "node:test";

import { courses } from "./courses.ts";
import { learningPaths } from "./learningPaths.ts";

test("learning paths use official sources and known courses", () => {
  const courseIds = new Set(courses.map(({ id }) => id));
  assert.equal(learningPaths.length, 11);
  for (const path of learningPaths) {
    assert.equal(new URL(path.officialUrl).protocol, "https:");
    assert.match(path.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(path.sourceEdition.trim());
    assert.ok(path.sourceEditionZh.trim());
    for (const source of path.additionalOfficialSources ?? []) {
      assert.equal(new URL(source.url).protocol, "https:");
      assert.ok(source.title.trim());
      assert.ok(source.titleZh.trim());
    }
    assert.equal(path.scheduleStatus, "prerequisite-inferred");
    assert.equal(path.phases.length, path.calendar === "quarter" ? 12 : 8);
    assert.ok(path.officialRequirementNotes.length >= 2);
    assert.equal(path.officialRequirementNotes.length, path.officialRequirementNotesZh.length);
    for (const phase of path.phases) {
      if (phase.chooseCount !== null) {
        assert.ok(phase.courseIds.length >= phase.chooseCount, `${path.id} ${phase.title} has too few choices`);
      }
      for (const group of phase.choiceGroups) {
        assert.ok(group.chooseCount > 0);
        assert.ok(group.courseIds.length >= group.chooseCount);
        for (const id of group.courseIds) assert.ok(courseIds.has(id), `${path.id} references missing choice ${id}`);
      }
    }
    for (const id of path.phases.flatMap(({ courseIds }) => courseIds)) {
      assert.ok(courseIds.has(id), `${path.id} references missing course ${id}`);
    }
  }
});

test("Berkeley and CMU curricula prefer newly verified home-university courses", () => {
  const berkeley = learningPaths.find(({ id }) => id === "berkeley-cs")!;
  const cmu = learningPaths.find(({ id }) => id === "cmu-cs")!;
  const berkeleyIds = berkeley.phases.flatMap(({ courseIds }) => courseIds);
  const cmuIds = cmu.phases.flatMap(({ courseIds }) => courseIds);
  assert.ok(berkeleyIds.includes("berkeley-math54"));
  assert.ok(!berkeleyIds.includes("mit-18-06"));
  assert.ok(cmuIds.includes("cmu-15-418"));
});

test("Cornell's early curriculum uses its required home-university foundations", () => {
  const cornell = learningPaths.find(({ id }) => id === "cornell-cs");
  assert.ok(cornell);
  const earlyCourseIds = cornell.phases.slice(0, 3).flatMap(({ courseIds }) => courseIds);
  for (const id of ["cornell-math1910", "cornell-math1920", "cornell-cs2800", "cornell-math2940"]) {
    assert.ok(earlyCourseIds.includes(id), `${id} is missing from Cornell's early curriculum`);
  }
  for (const id of ["mit-18-01sc", "mit-18-02sc", "mit-6-042j", "mit-18-06"]) {
    assert.ok(!earlyCourseIds.includes(id), `${id} still substitutes for a verified Cornell course`);
  }
});

test("Harvard's early curriculum uses verified native discrete math, linear algebra, and probability", () => {
  const harvard = learningPaths.find(({ id }) => id === "harvard-cs");
  assert.ok(harvard);
  const earlyCourseIds = harvard.phases.slice(0, 4).flatMap(({ courseIds }) => courseIds);
  for (const id of ["harvard-cs20", "harvard-math21b", "harvard-stat110"]) {
    assert.ok(earlyCourseIds.includes(id), `${id} is missing from Harvard's early curriculum`);
  }
  for (const id of ["mit-6-042j", "mit-18-06", "mit-18-05"]) {
    assert.ok(!earlyCourseIds.includes(id), `${id} still substitutes for a verified Harvard course`);
  }
});

test("Illinois curriculum uses verified native foundations and core courses", () => {
  const illinois = learningPaths.find(({ id }) => id === "uiuc-cs");
  assert.ok(illinois);
  const courseIds = illinois.phases.flatMap(({ courseIds }) => courseIds);
  for (const id of ["uiuc-math221", "uiuc-math231", "uiuc-cs173", "uiuc-cs341", "uiuc-cs357", "uiuc-cs361", "uiuc-cs374"]) {
    assert.ok(courseIds.includes(id), `${id} is missing from Illinois's curriculum`);
  }
  for (const id of ["mit-6-042j", "mit-18-05", "berkeley-cs162", "berkeley-cs170", "mit-6-0002"]) {
    assert.ok(!courseIds.includes(id), `${id} still substitutes for a verified Illinois course`);
  }
});

test("Georgia Tech's early curriculum uses its verified shared foundations", () => {
  const gatech = learningPaths.find(({ id }) => id === "gatech-cs");
  assert.ok(gatech);
  const earlyCourseIds = gatech.phases.slice(0, 4).flatMap(({ courseIds }) => courseIds);
  for (const id of ["gatech-math1551", "gatech-math1552", "gatech-cs1331", "gatech-cs1332", "gatech-cs2050", "gatech-cs2110", "gatech-cs2340"]) {
    assert.ok(earlyCourseIds.includes(id), `${id} is missing from Georgia Tech's early curriculum`);
  }
  for (const id of ["mit-18-01sc", "mit-18-02sc", "berkeley-cs61a", "berkeley-cs61b", "mit-6-042j", "princeton-cos217"]) {
    assert.ok(!earlyCourseIds.includes(id), `${id} still substitutes for a verified Georgia Tech course`);
  }
});

test("Tsinghua and PKU routes prefer verified same-university mathematics resources", () => {
  const tsinghua = learningPaths.find(({ id }) => id === "tsinghua-cs");
  const pku = learningPaths.find(({ id }) => id === "pku-cs");
  assert.ok(tsinghua);
  assert.ok(pku);
  const tsinghuaIds = tsinghua.phases.flatMap(({ courseIds }) => courseIds);
  const pkuIds = pku.phases.flatMap(({ courseIds }) => courseIds);
  assert.ok(tsinghuaIds.includes("tsinghua-linear-algebra"));
  assert.ok(!tsinghuaIds.includes("mit-18-06"));
  assert.ok(pkuIds.includes("pku-higher-algebra-1"));
  assert.ok(pkuIds.includes("pku-probability"));
  assert.ok(!pkuIds.includes("mit-18-06"));
  assert.ok(!pkuIds.includes("mit-18-05"));
});
