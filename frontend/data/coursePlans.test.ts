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
  }
});

test("CS50x follows the official weeks, problem sets, AI module, and final project", () => {
  const definition = structuredCoursePlans["harvard-cs50x"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.length, 23);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 10);
  assert.ok(definition.tasks.every(({ url }) => url.startsWith("https://cs50.harvard.edu/x/")));
  assert.equal(buildGentlePlan("harvard-cs50x", 30)?.plannedDays, 35);
});
