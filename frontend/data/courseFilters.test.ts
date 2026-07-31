import assert from "node:assert/strict";
import test from "node:test";

import { filterCourses, uniqueCourseValues } from "./courseFilters.ts";
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
    "Harvard University",
    "MIT",
    "Stanford University",
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
