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
