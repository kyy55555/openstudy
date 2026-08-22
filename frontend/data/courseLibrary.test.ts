import assert from "node:assert/strict";
import test from "node:test";

import { completionStreak, courseResourceKey, createCourseLibraryBackup, learningPathCoverage, localDateKey, normalizeStudyPlanDays, parseCourseLibrary, parseCourseLibraryBackup, pathCompletion, phaseCoverage, recordStudyTaskCompletion, selectSessionLibrary, studyPlanProgress, suggestedGentlePlanDays } from "./courseLibrary.ts";

test("course library safely parses local data", () => {
  assert.deepEqual(parseCourseLibrary(null), { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null });
  assert.deepEqual(parseCourseLibrary("broken"), { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null });
  assert.deepEqual(parseCourseLibrary('{"progress":{"a":"completed"},"favorites":["a"]}'), { progress: { a: "completed" }, favorites: ["a"], completedResources: [], studyPlans: {}, lastOpenedResource: null });
});

test("guest records never merge into an account automatically", () => {
  const guest = parseCourseLibrary('{"progress":{"guest-course":"completed"},"favorites":["guest-course"]}');
  const account = parseCourseLibrary('{"progress":{"account-course":"in-progress"},"favorites":[]}');
  assert.deepEqual(selectSessionLibrary(null, guest, account), guest);
  assert.deepEqual(selectSessionLibrary("user-1", guest, account), account);
  assert.deepEqual(selectSessionLibrary("new-user", guest, null), parseCourseLibrary(null));
  assert.ok(!("guest-course" in selectSessionLibrary("new-user", guest, null).progress));
});

test("invalid synced fields are discarded without losing valid records", () => {
  const parsed = parseCourseLibrary(JSON.stringify({
    progress: { good: "completed", bad: "finished" },
    favorites: ["good", 42],
    completedResources: ["good::url", null],
    studyPlans: { good: { days: 30, completedTaskIds: ["one", 2] }, bad: { days: -5, completedTaskIds: [] } },
    lastOpenedResource: { courseId: "good" },
  }));
  assert.deepEqual(parsed.progress, { good: "completed" });
  assert.deepEqual(parsed.favorites, ["good"]);
  assert.deepEqual(parsed.completedResources, ["good::url"]);
  assert.deepEqual(parsed.studyPlans, { good: { days: 30, completedTaskIds: ["one"] } });
  assert.equal(parsed.lastOpenedResource, null);
});

test("duplicate synced values are removed and study-plan days are normalized", () => {
  const parsed = parseCourseLibrary(JSON.stringify({
    favorites: ["a", "a", ""],
    completedResources: ["a::url", "a::url"],
    studyPlans: { a: { days: 30, completedTaskIds: ["one", "one", ""] } },
  }));
  assert.deepEqual(parsed.favorites, ["a"]);
  assert.deepEqual(parsed.completedResources, ["a::url"]);
  assert.deepEqual(parsed.studyPlans.a.completedTaskIds, ["one"]);
  assert.equal(normalizeStudyPlanDays(30.2), 31);
  assert.equal(normalizeStudyPlanDays(9999), 3650);
  assert.equal(normalizeStudyPlanDays(Number.NaN), null);
});

test("daily completion dates and plan percentages are normalized", () => {
  const parsed = parseCourseLibrary(JSON.stringify({
    studyPlans: {
      valid: { days: 30, completedTaskIds: ["a", "a", "unknown"], createdOn: "2026-08-01", lastDailyCompletionDate: "2026-08-16", dailyCompletionDates: ["2026-08-15", "bad", "2026-08-16", "2026-08-16"] },
      invalidDate: { days: 10, completedTaskIds: [], lastDailyCompletionDate: "today" },
    },
  }));
  assert.equal(parsed.studyPlans.valid.lastDailyCompletionDate, "2026-08-16");
  assert.equal(parsed.studyPlans.valid.createdOn, "2026-08-01");
  assert.deepEqual(parsed.studyPlans.valid.dailyCompletionDates, ["2026-08-15", "2026-08-16"]);
  assert.equal(parsed.studyPlans.invalidDate.lastDailyCompletionDate, undefined);
  assert.deepEqual(studyPlanProgress(["a", "b", "b"], parsed.studyPlans.valid.completedTaskIds), { completed: 1, total: 2, percent: 50 });
  assert.equal(localDateKey(new Date(2026, 7, 6)), "2026-08-06");
  assert.equal(completionStreak(["2026-08-14", "2026-08-15", "2026-08-16"], new Date(2026, 7, 16)), 3);
  assert.equal(completionStreak(["2026-08-14", "2026-08-15"], new Date(2026, 7, 16)), 2);
  assert.equal(completionStreak(["2026-08-13"], new Date(2026, 7, 16)), 0);
});

test("learning-record backups round-trip and reject unrelated or malformed files", () => {
  const library = parseCourseLibrary('{"progress":{"mit-6-006":"completed"},"favorites":["mit-6-006"]}');
  const serialized = createCourseLibraryBackup(library, "2026-08-04T12:00:00.000Z");
  assert.deepEqual(parseCourseLibraryBackup(serialized), { format: "openstudy-learning-record", version: 1, exportedAt: "2026-08-04T12:00:00.000Z", library });
  assert.equal(parseCourseLibraryBackup("broken"), null);
  assert.equal(parseCourseLibraryBackup('{"format":"another-app","version":1,"exportedAt":"2026-08-04T12:00:00.000Z","library":{}}'), null);
  assert.equal(parseCourseLibraryBackup('{"format":"openstudy-learning-record","version":2,"exportedAt":"2026-08-04T12:00:00.000Z","library":{}}'), null);
});

test("resource progress keys include both course and official URL", () => {
  assert.equal(courseResourceKey("mit-6-006", "https://example.edu/lectures"), "mit-6-006::https://example.edu/lectures");
});

test("gentle replanning only extends an unfinished plan when pace falls behind", () => {
  const today = new Date(2026, 7, 16);
  assert.equal(suggestedGentlePlanDays(30, "2026-08-01", 20, 30, today), null);
  assert.equal(suggestedGentlePlanDays(30, "2026-08-01", 3, 30, today), 184);
  assert.equal(suggestedGentlePlanDays(30, "2026-07-01", 0, 30, today), 89);
  assert.equal(suggestedGentlePlanDays(30, "2026-07-01", 30, 30, today), null);
});

test("completing a plan task records the learning day from every UI entry point", () => {
  const plan = { days: 30, completedTaskIds: ["task-1"], dailyCompletionDates: ["2026-08-21"] };
  const completed = recordStudyTaskCompletion(plan, "task-2", "2026-08-22");
  assert.deepEqual(completed.completedTaskIds, ["task-1", "task-2"]);
  assert.deepEqual(completed.dailyCompletionDates, ["2026-08-21", "2026-08-22"]);
  assert.equal(completed.lastDailyCompletionDate, "2026-08-22");
  assert.equal(recordStudyTaskCompletion(completed, "task-2", "2026-08-22"), completed);
});

test("path completion deduplicates repeated electives", () => {
  assert.deepEqual(pathCompletion(["a", "a", "b"], { a: "completed", b: "in-progress" }), { completed: 1, total: 2, percent: 50 });
});

test("phase lighting respects fixed courses and elective counts", () => {
  const fixed = { courseIds: ["a", "b"], chooseCount: null, choiceGroups: [] };
  assert.equal(phaseCoverage(fixed, { a: "completed" }).status, "partial");
  assert.equal(phaseCoverage(fixed, { a: "completed", b: "completed" }).status, "completed");
  const flexible = { courseIds: ["a", "b", "c"], chooseCount: 2, choiceGroups: [{ courseIds: ["d", "e"], chooseCount: 1 }] };
  assert.deepEqual(phaseCoverage(flexible, { a: "completed", c: "completed", e: "completed" }), { required: 3, completed: 3, status: "completed" });
});

test("path coverage counts required slots instead of every elective option", () => {
  const phases = [{ courseIds: ["a", "b", "c"], chooseCount: 1, choiceGroups: [] }];
  assert.deepEqual(learningPathCoverage(phases, { b: "completed" }), { completed: 1, total: 1, percent: 100 });
});
