import assert from "node:assert/strict";
import test from "node:test";

import {
  filterCourses,
  sortCourses,
  courseDifficultyRank,
  uniqueCourseValues,
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
    "Harvard University",
    "MIT",
    "Peking University",
    "Princeton University",
    "Stanford University",
    "Tsinghua University",
    "UC Berkeley",
    "University of Washington",
  ]);

  const subjects = uniqueCourseValues(courses, "subject");
  assert.equal(subjects.length, new Set(subjects).size);
  assert.deepEqual(subjects, [...subjects].sort());
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
  const byTitle = sortCourses(courses, "title");
  const byUniversity = sortCourses(courses, "university");
  const byNewest = sortCourses(courses, "newest");
  const byDifficulty = sortCourses(courses, "easiest");

  assert.deepEqual(courses.map(({ id }) => id), originalIds);
  assert.deepEqual(
    byTitle.map(({ title }) => title),
    byTitle.map(({ title }) => title).toSorted((a, b) => a.localeCompare(b)),
  );
  assert.deepEqual(
    byUniversity.map(({ university }) => university),
    byUniversity
      .map(({ university }) => university)
      .toSorted((a, b) => a.localeCompare(b)),
  );
  assert.equal(byNewest[0].year, Math.max(...courses.flatMap(({ year }) => year ?? [])));
  assert.deepEqual(
    byDifficulty.map(courseDifficultyRank),
    byDifficulty.map(courseDifficultyRank).toSorted((a, b) => a - b),
  );
});
