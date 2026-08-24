import assert from "node:assert/strict";
import test from "node:test";

import {
  filterCourses,
  sortCourses,
  courseDifficultyRank,
  displayCourseSubjects,
  courseSearchSuggestions,
  courseProgrammingLanguages,
  courseSubjectLabel,
  programmingLanguageSubjectPrefix,
  rankCoursesForSearch,
  uniqueCourseValues,
  uniqueCourseSubjects,
  uniqueProgrammingLanguages,
} from "./courseFilters.ts";
import { courses } from "./courses.ts";

const defaults = {
  searchTerm: "",
  university: "All",
  subject: "All",
  onlyVideos: false,
  onlyAssignments: false,
  onlySolutions: false,
};

test("course options are unique and sorted", () => {
  assert.deepEqual(uniqueCourseValues(courses, "university"), [
    "Carnegie Mellon University",
    "Cornell University",
    "Georgia Institute of Technology",
    "Harvard University",
    "MIT",
    "Peking University",
    "Princeton University",
    "Stanford University",
    "Tsinghua University",
    "UC Berkeley",
    "University of Illinois Urbana-Champaign",
    "University of Washington",
  ]);

  const subjects = uniqueCourseValues(courses, "subject");
  assert.equal(subjects.length, new Set(subjects).size);
  assert.deepEqual(subjects, [...subjects].sort());

  const clearSubjects = uniqueCourseSubjects(courses);
  assert.ok(!clearSubjects.includes("Computer Science"));
  assert.ok(!clearSubjects.includes("Programming"));
  assert.ok(!clearSubjects.includes("Programming Languages"));
  assert.ok(!clearSubjects.includes("Systems"));
  assert.ok(!clearSubjects.includes("Probability"));
  assert.ok(clearSubjects.includes("Computer Systems"));
  assert.ok(clearSubjects.includes("Probability and Statistics"));
  assert.equal(courseSubjectLabel(courses, "Algorithms", "zh"), "算法");
  assert.equal(courseSubjectLabel(courses, "Computer Systems", "zh"), "计算机系统");
  assert.equal(courseSubjectLabel(courses, "Probability and Statistics", "zh"), "概率与统计");
  assert.equal(courseSubjectLabel(courses, "Algorithms", "en"), "Algorithms");

  const programmingLanguages = uniqueProgrammingLanguages(courses);
  assert.ok(programmingLanguages.includes("Python"));
  assert.ok(programmingLanguages.includes("Java"));
  assert.ok(programmingLanguages.includes("C++"));
  assert.ok(programmingLanguages.includes("JavaScript"));
});

test("programming-language filters use explicit course content", () => {
  const pythonCourses = filterCourses(courses, {
    ...defaults,
    subject: `${programmingLanguageSubjectPrefix}Python`,
  });
  const javaCourses = filterCourses(courses, {
    ...defaults,
    subject: `${programmingLanguageSubjectPrefix}Java`,
  });

  assert.ok(pythonCourses.length > 0);
  assert.ok(javaCourses.length > 0);
  assert.ok(pythonCourses.every((course) => courseProgrammingLanguages(course).includes("Python")));
  assert.ok(javaCourses.every((course) => courseProgrammingLanguages(course).includes("Java")));
});

test("learner-facing subjects never show broad taxonomy labels", () => {
  const forbiddenEnglish = new Set(["Computer Science", "Programming", "Programming Languages", "Systems", "Probability"]);
  const forbiddenChinese = new Set(["计算机科学", "编程", "编程语言", "系统", "概率"]);

  for (const course of courses) {
    assert.ok(displayCourseSubjects(course, "en").every((subject) => !forbiddenEnglish.has(subject)));
    assert.ok(displayCourseSubjects(course, "zh").every((subject) => !forbiddenChinese.has(subject)));
  }

  const systemsCourse = courses.find(({ subject }) => subject === "Systems");
  const probabilityCourse = courses.find(({ subject }) => subject === "Probability");
  assert.ok(systemsCourse);
  assert.ok(probabilityCourse);
  assert.deepEqual(displayCourseSubjects(systemsCourse, "zh"), ["计算机系统"]);
  assert.deepEqual(displayCourseSubjects(probabilityCourse, "zh"), ["概率与统计"]);
});

test("search supports English, Chinese, and keywords", () => {
  assert.ok(filterCourses(courses, { ...defaults, searchTerm: "Python" }).length > 0);
  assert.ok(filterCourses(courses, { ...defaults, searchTerm: "算法" }).length > 0);
  assert.ok(filterCourses(courses, { ...defaults, searchTerm: "Django" }).length > 0);
  assert.deepEqual(filterCourses(courses, { ...defaults, searchTerm: "CS50P" }).map(({ id }) => id), ["harvard-cs50-python"]);
});

test("search results prioritize exact course codes and titles", () => {
  const matches = filterCourses(courses, { ...defaults, searchTerm: "CS 61A" });
  assert.equal(rankCoursesForSearch(matches, "CS 61A")[0]?.id, "berkeley-cs61a");
  assert.ok(courseSearchSuggestions(courses, "CS50").includes("CS50P"));
});

test("search understands common bilingual synonyms instead of requiring exact wording", () => {
  for (const searchTerm of ["web", "website", "websites", "网站", "网页", "网站开发"]) {
    assert.ok(
      filterCourses(courses, { ...defaults, searchTerm }).some(
        ({ id }) => id === "harvard-cs50-web",
      ),
      `${searchTerm} should find the web-development course`,
    );
  }

  assert.ok(
    filterCourses(courses, { ...defaults, searchTerm: "website Python" }).some(
      ({ id }) => id === "harvard-cs50-web",
    ),
  );

  for (const [query, expectedId] of [
    ["networking", "stanford-cs144"],
    ["信息安全", "berkeley-cs161"],
    ["graphics", "berkeley-cs184"],
    ["概率统计", "mit-18-05"],
    ["distributed system", "mit-6-824"],
    ["编译原理", "stanford-cs143"],
  ]) {
    assert.ok(filterCourses(courses, { ...defaults, searchTerm: query }).some(({ id }) => id === expectedId), `${query} should find ${expectedId}`);
  }
});

test("search suggestions react to partial English and Chinese input", () => {
  assert.ok(courseSearchSuggestions(courses, "ja").includes("Java"));
  assert.ok(courseSearchSuggestions(courses, "网").includes("网站开发"));
  assert.ok(courseSearchSuggestions(courses, "mach").includes("Machine Learning"));
  assert.deepEqual(courseSearchSuggestions(courses, ""), []);
  assert.ok(courseSearchSuggestions(courses, "a", 3).length <= 3);
});

test("search suggestions recover a small English typo", () => {
  assert.ok(courseSearchSuggestions(courses, "websiet").some((suggestion) => suggestion.toLowerCase().includes("website")));
});

test("subject, university, and material filters compose", () => {
  const results = filterCourses(courses, {
    ...defaults,
    university: "Harvard University",
    subject: "Artificial Intelligence",
    onlyVideos: true,
    onlyAssignments: true,
  });

  assert.deepEqual(results.map(({ id }) => id), ["harvard-cs50-ai"]);
  assert.ok(
    filterCourses(courses, { ...defaults, onlySolutions: true }).every(
      ({ hasSolutions }) => hasSolutions === true,
    ),
  );
});

test("courses can be sorted without mutating the catalog", () => {
  const originalIds = courses.map(({ id }) => id);
  const byNewest = sortCourses(courses, "newest");
  const byDifficulty = sortCourses(courses, "easiest");

  assert.deepEqual(courses.map(({ id }) => id), originalIds);
  assert.equal(byNewest[0].year, Math.max(...courses.flatMap(({ year }) => year ?? [])));
  assert.deepEqual(
    byDifficulty.map(courseDifficultyRank),
    byDifficulty.map(courseDifficultyRank).toSorted((a, b) => a - b),
  );
});

test("courses can be sorted by public favorite count", () => {
  const sample = courses.slice(0, 3);
  const sorted = sortCourses(sample, "popular", { [sample[1].id]: 4, [sample[2].id]: 2 });
  assert.deepEqual(sorted.map(({ id }) => id), [sample[1].id, sample[2].id, sample[0].id]);
});
