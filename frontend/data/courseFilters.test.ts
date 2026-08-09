import assert from "node:assert/strict";
import test from "node:test";

import {
  filterCourses,
  sortCourses,
  courseDifficultyRank,
  courseProgrammingLanguages,
  uniqueCourseValues,
  uniqueProgrammingLanguages,
} from "./courseFilters.ts";
import { courses } from "./courses.ts";

const defaults = {
  searchTerm: "",
  university: "All",
  subject: "All",
  programmingLanguage: "All",
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

  const programmingLanguages = uniqueProgrammingLanguages(courses);
  assert.ok(programmingLanguages.includes("Python"));
  assert.ok(programmingLanguages.includes("Java"));
  assert.ok(programmingLanguages.includes("C++"));
  assert.ok(programmingLanguages.includes("JavaScript"));
});

test("programming-language filters use explicit course content", () => {
  const pythonCourses = filterCourses(courses, {
    ...defaults,
    programmingLanguage: "Python",
  });
  const javaCourses = filterCourses(courses, {
    ...defaults,
    programmingLanguage: "Java",
  });

  assert.ok(pythonCourses.length > 0);
  assert.ok(javaCourses.length > 0);
  assert.ok(pythonCourses.every((course) => courseProgrammingLanguages(course).includes("Python")));
  assert.ok(javaCourses.every((course) => courseProgrammingLanguages(course).includes("Java")));
});

test("search supports English, Chinese, and keywords", () => {
  assert.ok(filterCourses(courses, { ...defaults, searchTerm: "Python" }).length > 0);
  assert.ok(filterCourses(courses, { ...defaults, searchTerm: "算法" }).length > 0);
  assert.ok(filterCourses(courses, { ...defaults, searchTerm: "Django" }).length > 0);
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
