import assert from "node:assert/strict";
import test from "node:test";
import { buildGentlePlan, structuredCoursePlans } from "./coursePlans.ts";

test("MIT 18.01SC plan is never shorter than the user's target", () => {
  assert.equal(structuredCoursePlans["mit-18-01sc"].tasks.length, 113);
  assert.equal(buildGentlePlan("mit-18-01sc", 0), null);
  const plan = buildGentlePlan("mit-18-01sc", 30);
  assert.equal(plan?.requestedDays, 30);
  assert.equal(plan?.plannedDays, 35);
  assert.equal(plan?.days.length, 35);
  assert.equal(plan?.days.flatMap(({ tasks }) => tasks).filter(({ kind }) => kind !== "buffer").length, 113);
  assert.ok(plan?.days.flatMap(({ tasks }) => tasks).every(({ url }) => url.startsWith("https://ocw.mit.edu/")));
});

test("every catalog course has a plan made only from its official resources", async () => {
  const { courses } = await import("./courses.ts");
  assert.equal(Object.keys(structuredCoursePlans).length, courses.length);
  for (const course of courses) {
    const plan = structuredCoursePlans[course.id];
    assert.ok(plan.tasks.length > 0, `${course.id} has no plan tasks`);
    assert.ok(plan.tasks.every(({ url }) => new URL(url).protocol === "https:"));
    for (const requestedDays of [1, 7, 30]) {
      const generated = buildGentlePlan(course.id, requestedDays);
      assert.ok(generated, `${course.id} could not generate a ${requestedDays}-day plan`);
      assert.ok(generated.plannedDays >= requestedDays);
      const scheduledTasks = generated.days.flatMap(({ tasks }) => tasks);
      assert.ok(generated.days.every(({ tasks }) => tasks.length > 0), `${course.id} has an empty study day`);
      assert.ok(scheduledTasks.every(({ kind }) => kind !== "buffer"), `${course.id} still generates buffer-only days`);
      const scheduledSourceIds = scheduledTasks.map(({ id, sourceTaskId }) => sourceTaskId ?? id);
      let cursor = 0;
      for (const task of plan.tasks) {
        const nextIndex = scheduledSourceIds.indexOf(task.id, cursor);
        assert.ok(nextIndex >= cursor, `${course.id} omitted or reordered ${task.id}`);
        cursor = nextIndex;
      }
      for (const syllabus of plan.tasks.filter(({ resourceType }) => resourceType === "syllabus")) {
        assert.equal(scheduledSourceIds.filter((id) => id === syllabus.id).length, 1, `${course.id} stretches its syllabus across multiple days`);
      }
    }
  }
});

test("Stanford CS106A follows all 28 official lectures, assignments, and practice exams", () => {
  const definition = structuredCoursePlans["stanford-cs106a"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ kind }) => kind === "session").length, 28);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
  const plan = buildGentlePlan("stanford-cs106a", 30);
  assert.equal(plan?.days[0].tasks[0].id, "lecture-1");
  assert.equal(plan?.days.flatMap(({ tasks }) => tasks).filter(({ kind }) => kind === "buffer").length, 0);
});

test("CS50x follows the official weeks, problem sets, AI module, and final project", () => {
  const definition = structuredCoursePlans["harvard-cs50x"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.length, 23);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 10);
  assert.ok(definition.tasks.every(({ url }) => url.startsWith("https://cs50.harvard.edu/x/")));
  assert.equal(buildGentlePlan("harvard-cs50x", 30)?.plannedDays, 35);
});

test("verified CS50 courses expose their full official weekly sequences", () => {
  const expected = { "harvard-cs50-python": 21, "harvard-cs50-ai": 14, "harvard-cs50-web": 19, "harvard-cs50-cybersecurity": 11, "harvard-cs50-sql": 15, "harvard-cs50-r": 15, "harvard-cs50-scratch": 19 };
  for (const [courseId, taskCount] of Object.entries(expected)) {
    assert.equal(structuredCoursePlans[courseId].detail, "full");
    assert.equal(structuredCoursePlans[courseId].tasks.length, taskCount);
    assert.ok(structuredCoursePlans[courseId].tasks.every(({ url }) => url.startsWith("https://cs50.harvard.edu/")));
  }
});
