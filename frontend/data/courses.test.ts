import assert from "node:assert/strict";
import test from "node:test";

import { courseCode, courseEditionLabel, courseLanguageLabel, courses, suggestedStudyStage } from "./courses.ts";
import { courseDetailPath, prerequisiteCourseIds } from "./courseNavigation.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
  "www.cs.princeton.edu",
  "www.cs.cornell.edu",
  "classes.cornell.edu",
  "math.cornell.edu",
  "pi.math.cornell.edu",
  "catalog.cornell.edu",
  "inst.eecs.berkeley.edu",
  "eecs.berkeley.edu",
  "sp26.cs161.org",
  "courses.cs.washington.edu",
  "cs61a.org",
  "sp26.datastructur.es",
  "www.eecs70.org",
  "cs61c.org",
  "web.stanford.edu",
  "stanford-cs221.github.io",
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
  "www.tsinghua.edu.cn",
  "www.tcm.tsinghua.edu.cn",
  "os.cs.tsinghua.edu.cn",
  "lab.cs.tsinghua.edu.cn",
  "v1-www.xuetangx.com",
  "studio.xuetangx.com",
  "higher.smartedu.cn",
  "math.pku.edu.cn",
  "marxism.pku.edu.cn",
  "mod.icst.pku.edu.cn",
  "qrd.college.harvard.edu",
  "www.cs.cmu.edu",
  "www.csd.cs.cmu.edu",
  "www.cs124.org",
  "www.cs128.org",
  "courses.illinois.edu",
  "courses.grainger.illinois.edu",
  "catalog.illinois.edu",
  "math.illinois.edu",
  "ece.illinois.edu",
  "cs341.cs.illinois.edu",
  "cs357.cs.illinois.edu",
  "ws.engr.illinois.edu",
  "syllabus.gatech.edu",
  "catalog.gatech.edu",
  "cs2110.gatech.edu",
  "faculty.cc.gatech.edu",
  "cs3110.github.io",
  "cs61.seas.harvard.edu",
  "read.seas.harvard.edu",
  "daslab.seas.harvard.edu",
  "harvard-cs-1200.github.io",
  "docs.google.com",
  "lewis.seas.harvard.edu",
  "stat110.hsites.harvard.edu",
  "people.math.harvard.edu",
  "abel.math.harvard.edu",
  "courses.my.harvard.edu",
  "www.seas.harvard.edu",
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
  "www.math.cmu.edu",
  "www.cmu.edu",
  "coursecatalog.web.cmu.edu",
  "db.cs.cmu.edu",
  "15445.courses.cs.cmu.edu",
  "graphics.cs.cmu.edu",
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

test("course language labels are fully localized", () => {
  assert.equal(courseLanguageLabel("English", "zh"), "英语");
  assert.equal(courseLanguageLabel("Chinese / English", "zh"), "中文 / 英语");
  assert.equal(courseLanguageLabel("Chinese", "en"), "Chinese");
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

test("the catalog includes verified non-STEM economics foundations", () => {
  for (const id of ["mit-14-01", "mit-14-02"]) {
    const item = courses.find((course) => course.id === id);
    assert.ok(item, `${id} is missing`);
    assert.equal(item.sourceName, "MIT OpenCourseWare");
    assert.equal(item.year, 2023);
    assert.equal(item.hasVideos, true);
    assert.equal(item.hasAssignments, true);
    assert.equal(item.hasSolutions, true);
  }
});

test("the catalog expands biology, chemistry, and physics beyond survey courses", () => {
  for (const id of ["mit-7-03", "mit-5-12", "mit-8-03sc"]) {
    const item = courses.find((course) => course.id === id);
    assert.ok(item, `${id} is missing`);
    assert.equal(item.sourceName, "MIT OpenCourseWare");
    assert.ok(item.resources.length >= 4);
  }
});

test("Princeton BSE foundations use verified Princeton courses", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of ["princeton-mat103", "princeton-mat104", "princeton-mat201", "princeton-mat202", "princeton-phy103", "princeton-phy104", "princeton-chm201"]) {
    assert.ok(ids.has(id), `${id} is missing`);
  }
});

test("CMU's six official CS core courses are present", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of ["cmu-15-122", "cmu-15-150", "cmu-15-210", "cmu-15-213", "cmu-15-251", "cmu-15-451"]) {
    assert.ok(ids.has(id), `${id} is missing`);
  }
});

test("CMU's required mathematics sequence is present", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of ["cmu-15-151", "cmu-21-120", "cmu-21-122", "cmu-21-241", "cmu-21-266", "cmu-15-259"]) {
    assert.ok(ids.has(id), `${id} is missing`);
  }
});

test("CMU advanced elective categories have native public courses", () => {
  const ids = new Set(courses.map(({ id }) => id));
  for (const id of ["cmu-15-312", "cmu-15-440", "cmu-15-445", "cmu-15-362", "cmu-15-281", "cmu-15-330", "cmu-15-418"]) {
    assert.ok(ids.has(id), `${id} is missing`);
  }
});

test("Berkeley's official linear algebra course replaces the external curriculum substitute", () => {
  const course = courses.find(({ id }) => id === "berkeley-math54");
  assert.equal(course?.code, "MATH 54");
  assert.equal(course?.university, "UC Berkeley");
  assert.equal(course?.year, null);
  assert.ok(course?.resources.some(({ url }) => url.includes("math.berkeley.edu")));
});

test("Cornell's required mathematics and computing foundations are present", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  for (const id of ["cornell-math1910", "cornell-math1920", "cornell-cs2800", "cornell-math2940"]) {
    assert.equal(byId.get(id)?.university, "Cornell University");
  }
  assert.equal(byId.get("cornell-cs2800")?.hasAssignments, null);
  assert.equal(byId.get("cornell-math2940")?.hasVideos, null);
});

test("Harvard's native discrete math, linear algebra, and probability courses are present", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  for (const id of ["harvard-cs20", "harvard-math21b", "harvard-stat110"]) {
    assert.equal(byId.get(id)?.university, "Harvard University");
  }
  assert.equal(byId.get("harvard-cs20")?.hasAssignments, null);
  assert.equal(byId.get("harvard-stat110")?.hasSolutions, true);
});

test("Harvard's current public operating-systems course is present", () => {
  const course = courses.find(({ id }) => id === "harvard-cs1610");
  assert.ok(course);
  assert.equal(course.year, 2026);
  assert.equal(course.university, "Harvard University");
  assert.ok(course.resources.some(({ type }) => type === "assignments"));
});

test("Harvard's current public data-systems course is present", () => {
  const course = courses.find(({ id }) => id === "harvard-cs1650");
  assert.ok(course);
  assert.equal(course.year, 2025);
  assert.equal(course.university, "Harvard University");
  assert.ok(course.resources.some(({ type }) => type === "projects"));
});

test("Harvard's current algorithms course exposes its full public materials", () => {
  const course = courses.find(({ id }) => id === "harvard-cs1200");
  assert.ok(course);
  assert.equal(course.year, 2026);
  assert.equal(course.hasSolutions, true);
  assert.ok(course.resources.some(({ type }) => type === "schedule"));
});

test("Illinois's public foundations and core courses are present without unsupported claims", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  for (const id of ["uiuc-math221", "uiuc-math231", "uiuc-cs173", "uiuc-cs341", "uiuc-cs357", "uiuc-cs361", "uiuc-cs374"]) {
    assert.equal(byId.get(id)?.university, "University of Illinois Urbana-Champaign");
  }
  assert.equal(byId.get("uiuc-cs341")?.year, null);
  assert.equal(byId.get("uiuc-cs361")?.hasAssignments, null);
  assert.equal(byId.get("uiuc-cs374")?.hasSolutions, null);
});

test("Georgia Tech's shared computing and calculus foundations are present", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  for (const id of ["gatech-math1551", "gatech-math1552", "gatech-cs1331", "gatech-cs1332", "gatech-cs2050", "gatech-cs2340"]) {
    assert.equal(byId.get(id)?.university, "Georgia Institute of Technology");
    assert.equal(byId.get(id)?.year, 2026);
  }
  assert.equal(byId.get("gatech-cs1331")?.hasSolutions, null);
  assert.equal(byId.get("gatech-cs2340")?.hasVideos, null);
});

test("Tsinghua and PKU native mathematics foundations preserve honest provenance", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  assert.equal(byId.get("tsinghua-linear-algebra")?.university, "Tsinghua University");
  assert.equal(byId.get("tsinghua-linear-algebra")?.year, 2026);
  assert.equal(byId.get("tsinghua-linear-algebra")?.hasVideos, true);
  assert.equal(byId.get("pku-higher-algebra-1")?.university, "Peking University");
  assert.equal(byId.get("pku-higher-algebra-1")?.hasAssignments, null);
  assert.equal(byId.get("pku-probability")?.university, "Peking University");
  assert.equal(byId.get("pku-probability")?.year, null);
});

test("Tsinghua operating systems exposes the complete public ucore sequence", () => {
  const course = courses.find(({ id }) => id === "tsinghua-operating-systems");
  assert.equal(course?.university, "Tsinghua University");
  assert.equal(course?.year, null);
  assert.equal(course?.hasVideos, true);
  assert.equal(course?.hasAssignments, true);
  assert.equal(course?.hasSolutions, null);
});

test("Tsinghua combinatorics and algorithms expose their official public sequences", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  for (const id of ["tsinghua-combinatorics", "tsinghua-algorithm-design"]) {
    assert.equal(byId.get(id)?.university, "Tsinghua University");
    assert.equal(byId.get(id)?.hasVideos, true);
    assert.equal(byId.get(id)?.hasAssignments, true);
    assert.equal(byId.get(id)?.hasSolutions, null);
  }
  assert.equal(byId.get("tsinghua-combinatorics")?.year, null);
  assert.equal(byId.get("tsinghua-algorithm-design")?.year, 2026);
  assert.equal(byId.get("tsinghua-algorithm-design")?.courseUrl, "https://higher.smartedu.cn/course/66a031a9711dc30c34ab77d8");
  assert.ok(byId.get("tsinghua-algorithm-design")?.resources.some(({ url }) => url.includes("xuetangx.com/courses/course-v1%3ATsinghuaX%2B2018122106X")));
});

test("audited courses use the latest confirmed public editions", () => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  for (const [id, expectedYear, expectedUrl] of [
    ["mit-6-004", 2017, "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/"],
    ["stanford-cs221", 2026, "https://stanford-cs221.github.io/spring2026/"],
    ["berkeley-cs161", 2026, "https://sp26.cs161.org/"],
    ["berkeley-cs184", 2026, "https://cs184.eecs.berkeley.edu/sp26/"],
    ["cornell-cs2110", 2026, "https://www.cs.cornell.edu/courses/cs2110/2026sp/"],
    ["cornell-cs3410", 2026, "https://www.cs.cornell.edu/courses/cs3410/2026sp/"],
    ["cornell-cs3780", 2026, "https://www.cs.cornell.edu/courses/cs3780/2026sp/"],
    ["uiuc-cs225", 2026, "https://courses.grainger.illinois.edu/cs225/sp2026/"],
    ["berkeley-math1a", null, "https://undergraduate.catalog.berkeley.edu/courses/1144962"],
    ["berkeley-math1b", null, "https://undergraduate.catalog.berkeley.edu/courses/1145002"],
    ["cmu-15-418", 2026, "https://www.cs.cmu.edu/afs/cs/academic/class/15418-s26/www/"],
  ] as const) {
    assert.equal(byId.get(id)?.year, expectedYear, `${id} public edition regressed`);
    assert.equal(byId.get(id)?.courseUrl, expectedUrl, `${id} official URL regressed`);
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
    // The verified official course page is itself a valid learning entry. Some
    // providers expose the syllabus, videos, and assignments only on that page
    // and do not publish a second stable resource URL.
    assert.ok(course.courseUrl, `${course.id} has no verified official course entry`);
    for (const field of ["hasVideos", "hasAssignments", "hasSolutions"] as const) {
      assert.ok(course[field] === true || course[field] === false || course[field] === null);
    }
  }
});

test("dated public materials show their verified edition year", () => {
  const dated = courses.find((course) => course.id === "mit-6-006");
  assert.ok(dated);
  assert.equal(courseEditionLabel(dated, "zh"), "2020");
  assert.equal(courseEditionLabel(dated, "en"), "2020");
});

test("official pages without an edition year are described without guessing", () => {
  const ongoing = courses.find((course) => course.id === "tsinghua-computer-graphics");
  assert.ok(ongoing);
  assert.equal(courseEditionLabel(ongoing, "zh"), "官方课程页（未标年份）");
  assert.equal(courseEditionLabel(ongoing, "en"), "Official course page (year not stated)");
});
