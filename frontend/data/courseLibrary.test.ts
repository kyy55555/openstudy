import assert from "node:assert/strict";
import test from "node:test";

import { cloudAtomicSaveUnavailable, cloudRevisionChanged, cloudSyncRequestIsCurrent, cloudSyncRetryDelay, completionStreak, courseResourceKey, createCourseLibraryBackup, learningPathCoverage, localDateKey, normalizeStudyPlanDays, parseCourseLibrary, parseCourseLibraryBackup, pathCompletion, phaseCoverage, readCourseLibraryStorage, recordStudyTaskCompletion, selectNewestAccountLibrary, selectSessionLibrary, studyPlanProgress, suggestedGentlePlanDays, toggleStudyPlanPause, weeklyStudyActivity, writeCourseLibraryStorage } from "./courseLibrary.ts";

test("cloud retries back off and stop until the next user action", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(cloudSyncRetryDelay), [2_000, 5_000, 15_000, 30_000, 60_000, null]);
  assert.equal(cloudSyncRetryDelay(-1), null);
  assert.equal(cloudSyncRetryDelay(1.5), null);
});

test("cloud revisions detect another device without depending on timestamp formatting", () => {
  assert.equal(cloudRevisionChanged(undefined, "2026-08-22T10:00:00Z"), false);
  assert.equal(cloudRevisionChanged(null, null), false);
  assert.equal(cloudRevisionChanged(null, "2026-08-22T10:00:00Z"), true);
  assert.equal(cloudRevisionChanged("2026-08-22T10:00:00.000Z", "2026-08-22 10:00:00+00"), false);
  assert.equal(cloudRevisionChanged("2026-08-22T10:00:00Z", "2026-08-22T10:00:01Z"), true);
});

test("late cloud responses cannot overwrite a newer account or signed-out session", () => {
  assert.equal(cloudSyncRequestIsCurrent(4, 4, "user-a", "user-a"), true);
  assert.equal(cloudSyncRequestIsCurrent(3, 4, "user-a", "user-a"), false);
  assert.equal(cloudSyncRequestIsCurrent(4, 4, "user-a", "user-b"), false);
  assert.equal(cloudSyncRequestIsCurrent(4, 4, "user-a", null), false);
  assert.equal(cloudSyncRequestIsCurrent(5, 5, null, null), true);
});

test("atomic cloud save falls back only when the database function is not installed", () => {
  assert.equal(cloudAtomicSaveUnavailable("PGRST202", "function missing"), true);
  assert.equal(cloudAtomicSaveUnavailable("42883", "undefined function"), true);
  assert.equal(cloudAtomicSaveUnavailable(undefined, "Could not find save_course_library"), true);
  assert.equal(cloudAtomicSaveUnavailable("42501", "permission denied"), false);
  assert.equal(cloudAtomicSaveUnavailable("42501", "permission denied for function save_course_library"), false);
  assert.equal(cloudAtomicSaveUnavailable(undefined, "network error"), false);
});

test("course library safely parses local data", () => {
  assert.deepEqual(parseCourseLibrary(null), { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null });
  assert.deepEqual(parseCourseLibrary("broken"), { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null });
  assert.deepEqual(parseCourseLibrary('{"progress":{"a":"completed"},"favorites":["a"]}'), { progress: { a: "completed" }, favorites: ["a"], completedResources: [], studyPlans: {}, lastOpenedResource: null });
});

test("browser storage failures fall back safely without blocking later cloud work", () => {
  const unavailable = {
    getItem() { throw new Error("storage denied"); },
    setItem() { throw new Error("quota exceeded"); },
  };
  assert.deepEqual(readCourseLibraryStorage(unavailable, "key"), { library: parseCourseLibrary(null), available: false });
  assert.equal(writeCourseLibraryStorage(unavailable, "key", parseCourseLibrary('{"favorites":["a"]}')), false);

  const values = new Map<string, string>();
  const available = {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
  };
  const library = parseCourseLibrary('{"progress":{"a":"completed"}}');
  assert.equal(writeCourseLibraryStorage(available, "key", library), true);
  assert.deepEqual(readCourseLibraryStorage(available, "key"), { library, available: true });
});

test("guest records never merge into an account automatically", () => {
  const guest = parseCourseLibrary('{"progress":{"guest-course":"completed"},"favorites":["guest-course"]}');
  const account = parseCourseLibrary('{"progress":{"account-course":"in-progress"},"favorites":[]}');
  assert.deepEqual(selectSessionLibrary(null, guest, account), guest);
  assert.deepEqual(selectSessionLibrary("user-1", guest, account), account);
  assert.deepEqual(selectSessionLibrary("new-user", guest, null), parseCourseLibrary(null));
  assert.ok(!("guest-course" in selectSessionLibrary("new-user", guest, null).progress));
});

test("newer offline account progress wins over stale cloud data", () => {
  const cached = parseCourseLibrary('{"updatedAt":"2026-08-22T10:00:00.000Z","progress":{"offline":"completed"}}');
  const cloud = parseCourseLibrary('{"updatedAt":"2026-08-22T09:00:00.000Z","progress":{"cloud":"in-progress"}}');
  assert.deepEqual(selectNewestAccountLibrary(cached, cloud, "2026-08-22T09:30:00.000Z"), { library: cached, source: "cache" });
  assert.deepEqual(selectNewestAccountLibrary(parseCourseLibrary(null), cloud, "2026-08-22T09:30:00.000Z"), { library: cloud, source: "cloud" });
  assert.deepEqual(selectNewestAccountLibrary(cached, null), { library: cached, source: "cache" });
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

test("pausing and resuming a plan adds paused days without losing progress", () => {
  const original = { days: 30, completedTaskIds: ["task-1"] };
  const paused = toggleStudyPlanPause(original, new Date(2026, 7, 20));
  assert.deepEqual(paused, { ...original, paused: true, pausedOn: "2026-08-20" });
  const resumed = toggleStudyPlanPause(paused, new Date(2026, 7, 25));
  assert.deepEqual(resumed, { days: 35, completedTaskIds: ["task-1"] });
});

test("weekly activity reports the latest seven local calendar days", () => {
  const activity = weeklyStudyActivity(["2026-08-16", "2026-08-20", "invalid"], new Date(2026, 7, 22));
  assert.deepEqual(activity.map(({ dateKey }) => dateKey), ["2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21", "2026-08-22"]);
  assert.deepEqual(activity.map(({ completed }) => completed), [true, false, false, false, true, false, false]);
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
